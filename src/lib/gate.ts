/**
 * Inline head script (DESIGN.md §6.1, §6.2), rendered by <InlineScript> in <head> so it runs before paint.
 * - `js`: CSS start states for things that animate apply only when JS runs.
 * - `reduce`: prefers-reduced-motion. No intro, no scroll motion (CSS and the leaves both check it).
 * - `fine`: a fine pointer (Lenis, hover shifts).
 * - `intro`: on the home page, the loader (the tile builds, the ball drops into the W, the night curtain lifts while
 *   the hero headline rises through it; 1.1s) plays once per session. `?intro` forces it. Set only when motion is
 *   allowed, so it is never seen twice, never under reduced motion and never without JS (the loader markup is
 *   CSS-hidden unless `html.intro`). lib/intro.ts removes the class once every intro animation has finished.
 */
export const GATE = `(function(d){var m=matchMedia,c=d.classList;c.add('js');if(m('(prefers-reduced-motion: reduce)').matches)c.add('reduce');if(m('(pointer: fine)').matches)c.add('fine');if(location.pathname!=='/'||c.contains('reduce'))return;var p=1;try{var s=sessionStorage,k='ws-intro';if(location.search.indexOf('intro')>-1||location.search.indexOf('bounce')>-1)s.removeItem(k);if(s.getItem(k))p=0;else s.setItem(k,'1')}catch(e){}if(p)c.add('intro')})(document.documentElement)`;
