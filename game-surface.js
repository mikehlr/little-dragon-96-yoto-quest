'use strict';
// The game is one interactive surface; native browser text/image gestures have no role here.
for(const event of ['selectstart','dragstart','contextmenu'])document.addEventListener(event,e=>{if(e.target.closest?.('#game-shell'))e.preventDefault()});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'&&document.activeElement?.closest('#game-shell'))e.preventDefault()});
let viewportFrame=0;
function fitGameViewport(){document.documentElement.classList.add('viewport-changing');document.documentElement.style.setProperty('--game-viewport-height',window.innerHeight+'px');document.documentElement.style.setProperty('--game-viewport-width',window.innerWidth+'px');globalThis.getSelection()?.removeAllRanges();if(typeof resetTouch==='function')resetTouch();cancelAnimationFrame(viewportFrame);viewportFrame=requestAnimationFrame(()=>{viewportFrame=requestAnimationFrame(()=>document.documentElement.classList.remove('viewport-changing'))})}
addEventListener('resize',fitGameViewport,{passive:true});window.visualViewport?.addEventListener('resize',fitGameViewport,{passive:true});window.screen.orientation?.addEventListener('change',fitGameViewport);fitGameViewport();
