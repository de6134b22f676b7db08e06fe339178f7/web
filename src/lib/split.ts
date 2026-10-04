/**
 * split(el, mode): our own SplitText (DESIGN.md v4 §4.3). No dependency, no layout thrash beyond one read pass.
 * - Wraps every word in a measuring span, groups words by their rendered top (Range-free: one rect read per word),
 *   then rebuilds the content as `.ln > span` lines (mode "lines") or `.ln > span > .c` chars (mode "chars").
 * - Inline wrappers (<em>, <b>, links) are re-created per line, so styling survives; <br> become line breaks.
 * - The original text is set as aria-label on `el`; the generated lines are aria-hidden.
 * - Each line span gets --l (line index); each char gets --c (char index across the element).
 * - revert() restores the original markup (call it before re-splitting on width change).
 * Static content only: do not split an element whose children React will re-render.
 */
export type SplitMode = "lines" | "chars";
export type SplitResult = { lines: HTMLElement[]; chars: HTMLElement[]; revert: () => void };

type Word = { node: HTMLSpanElement; chain: Element[]; space: boolean };

export function split(el: HTMLElement, mode: SplitMode = "lines"): SplitResult {
  const original = el.innerHTML;
  const hadLabel = el.getAttribute("aria-label");
  const label = (el.textContent ?? "").replace(/\s+/g, " ").trim();

  // 1. Wrap words.
  const words: Word[] = [];
  const walk = (node: Node, chain: Element[]) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? "").split(/(\s+)/);
        const frag = document.createDocumentFragment();
        for (const p of parts) {
          if (!p) continue;
          if (/^\s+$/.test(p)) {
            if (words.length) words[words.length - 1].space = true;
            frag.appendChild(document.createTextNode(" "));
            continue;
          }
          const w = document.createElement("span");
          w.style.display = "inline-block";
          w.textContent = p;
          words.push({ node: w, chain, space: false });
          frag.appendChild(w);
        }
        child.replaceWith(frag);
      } else if (child instanceof Element && child.tagName !== "BR") {
        walk(child, [...chain, child]);
      }
    }
  };
  walk(el, []);

  // 2. Group by rendered line (one read pass).
  const tops = words.map((w) => (w.node.offsetParent ? w.node.getBoundingClientRect().top : 0));
  const groups: Word[][] = [];
  let last = -Infinity;
  words.forEach((w, i) => {
    if (!groups.length || Math.abs(tops[i] - last) > 2) {
      groups.push([]);
      last = tops[i];
    }
    groups[groups.length - 1].push(w);
  });

  // 3. Rebuild as lines, re-creating inline wrappers per line.
  const lines: HTMLElement[] = [];
  const chars: HTMLElement[] = [];
  let ci = 0;
  const frag = document.createDocumentFragment();
  groups.forEach((g, li) => {
    const ln = document.createElement("span");
    ln.className = "ln";
    ln.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span");
    inner.style.setProperty("--l", String(li));
    ln.appendChild(inner);
    const stack: [Element, Element][] = [];
    g.forEach((w, wi) => {
      let depth = 0;
      while (depth < stack.length && depth < w.chain.length && stack[depth][0] === w.chain[depth]) depth++;
      stack.length = depth;
      for (let k = depth; k < w.chain.length; k++) {
        const clone = w.chain[k].cloneNode(false) as Element;
        (stack.length ? stack[stack.length - 1][1] : inner).appendChild(clone);
        stack.push([w.chain[k], clone]);
      }
      const host = stack.length ? stack[stack.length - 1][1] : inner;
      const text = w.node.textContent ?? "";
      if (mode === "chars") {
        for (const ch of Array.from(text)) {
          const c = document.createElement("span");
          c.className = "c";
          c.style.setProperty("--c", String(ci++));
          c.textContent = ch;
          host.appendChild(c);
          chars.push(c);
        }
      } else host.appendChild(document.createTextNode(text));
      if (w.space && wi < g.length - 1) host.appendChild(document.createTextNode(" "));
    });
    frag.appendChild(ln);
    lines.push(inner);
  });
  el.textContent = "";
  el.appendChild(frag);
  if (label && !hadLabel) el.setAttribute("aria-label", label);

  return {
    lines,
    chars,
    revert() {
      el.innerHTML = original;
      if (!hadLabel) el.removeAttribute("aria-label");
    },
  };
}
