/**
 * The loader's end (DESIGN.md §6.2). The loader itself is CSS (globals.css `.ldr`, gated by `html.intro`); this inline
 * script only removes the gate once it has played (the curtain is gone at 1080ms, the header is in by 1400ms, the
 * last hero line and the last `.hero-in` finish by 1800ms), so later client-side returns to `/` show nothing, and so
 * no `html.intro` start state outlives the sheet. Placed right after the hero markup.
 */
export const INTRO = `(function(D){if(!D.classList.contains('intro'))return;setTimeout(function(){D.classList.remove('intro')},1800)})(document.documentElement)`;
