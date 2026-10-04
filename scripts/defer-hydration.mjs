// Post-build (static export): run the Next.js chunk scripts only after the first paint has been presented.
//
// Next emits every chunk as `<script src async>` in <head> (plus `<link rel=preload as=script>` hints). On a fast
// connection they arrive before the first frame and their evaluation (React, router, GSAP) sits between parsing and
// the first paint, delaying FCP/LCP. Here the chunk <script> tags AND every script preload (including Next's
// bootstrap preload) are removed from the HTML, so nothing JS is fetched before first paint. A tiny inline loader
// then inserts the same chunks as `<script async>` right after the first-contentful-paint entry (fallback: a 1.5s
// timer, e.g. for hidden tabs, which never paint). Hydration therefore starts after FCP; content and CSS motion are
// unaffected.
//
// Idempotent and defensive: a page that does not match the expected markup is left untouched (with a warning).
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("out");
const MARK = "data-ws-defer";
const SCRIPT = /<script src="(\/_next\/static\/chunks\/[^"]+\.js)"( id="[^"]+")? async=""><\/script>/g;

async function* html(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* html(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

const loader = (list) =>
  `<script ${MARK}="">(function(){var L=${JSON.stringify(list)},d=0;function go(){if(d)return;d=1;L.forEach(function(x){var s=document.createElement("script");s.src=x[0];if(x[1])s.id=x[1];s.async=true;document.head.appendChild(s)})}` +
  `function soon(){setTimeout(go,0)}try{new PerformanceObserver(function(l,o){if(l.getEntriesByName("first-contentful-paint").length){o.disconnect();soon()}}).observe({type:"paint",buffered:true})}catch(e){soon()}` +
  `setTimeout(go,1500)})()</script>`;

let changed = 0;
let skipped = 0;
for await (const file of html(OUT)) {
  const src = await readFile(file, "utf8");
  if (src.includes(MARK)) continue;
  const list = [];
  let out = src.replace(SCRIPT, (_, url, id) => {
    list.push(id ? [url, id.slice(5, -1)] : [url]);
    return "";
  });
  if (!list.length || !out.includes("</body>")) {
    skipped++;
    console.warn(`[defer-hydration] no chunk scripts matched, left as is: ${path.relative(OUT, file)}`);
    continue;
  }
  // No script preloads either (Next emits one for the bootstrap chunk): the chunks must not share the first round
  // trips with the CSS, the fonts and the LCP image.
  for (const [url] of list) out = out.split(`<link rel="preload" as="script" fetchPriority="low" href="${url}"/>`).join("");
  out = out.replace("</body>", `${loader(list)}</body>`);
  await writeFile(file, out);
  changed++;
}
console.log(`[defer-hydration] ${changed} page(s) updated${skipped ? `, ${skipped} skipped` : ""}`);
