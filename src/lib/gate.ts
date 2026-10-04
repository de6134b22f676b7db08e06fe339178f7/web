/**
 * Inline head script (DESIGN.md v4 §3.4), rendered by <InlineScript> in <head>, so it runs before <body> parses.
 * - adds `js` (gates the loader's skip hint and the split-heading hidden state, together with `hydrated`)
 * - once per session: a repeat visit gets `no-intro` before first paint (loader display:none, --intro:0s).
 *   `?intro` in the URL forces the intro again (QA). Blocked storage: the intro plays (CSS always ends it).
 * - skip (click/key, from the first frame): seeks every running `ld-*` / `h-*` CSS animation to the lift start
 *   (1560 ms), so the lift + hero still play out (~600 ms). The one skipping keydown is preventDefault-ed only for
 *   scroll keys (Space, PageDown, ArrowDown, End), so skipping never scrolls past the hero; Tab/Enter keep theirs.
 * Nothing here is needed for the loader to start or finish: that is pure CSS (globals.css, "LOADER").
 */
export const GATE = `(function(d){d.classList.add('js');var on=false;try{
if(location.search.indexOf('intro')>-1)sessionStorage.removeItem('ws-intro');
if(sessionStorage.getItem('ws-intro'))d.classList.add('no-intro');
else{sessionStorage.setItem('ws-intro','1');on=true}
}catch(e){on=true}
if(!on)return;
var K={' ':1,Spacebar:1,PageDown:1,ArrowDown:1,End:1};
function skip(e){if(e&&e.type==='keydown'&&K[e.key])e.preventDefault();try{document.getAnimations().forEach(function(a){var n=a.animationName||'';
if((n.indexOf('ld-')===0||n.indexOf('h-')===0)&&a.currentTime!==null&&a.currentTime<1560)a.currentTime=1560})}catch(e){}off()}
function off(){removeEventListener('pointerdown',skip,true);removeEventListener('keydown',skip,true)}
addEventListener('pointerdown',skip,{capture:true,passive:true});addEventListener('keydown',skip,true);
setTimeout(off,2200)})(document.documentElement)`;
