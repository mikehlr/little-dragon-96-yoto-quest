'use strict';
// Pointer IDs remain independent: the left thumb can steer while the right attacks or jumps.
const DragonTouch=globalThis.DragonTouch={active:false,x:0,y:0,pointer:null};
const mobileMatch=matchMedia('(pointer:coarse)');
const touchIcon={
 attack:'<path d="M7 19l4-3 3-7 4 1 2 6-5 4-7 2zM10 8l2-3 4 1 2 3M19 5l3-2M22 10h3M22 18l3 2"/>',
 jump:'<path d="M8 20V9m-5 5l5-5 5 5M15 22l6-5-2-5-4-1 2-5m1-3h.1"/>',
 block:'<path d="M14 3l9 4v7c0 6-9 11-9 11S5 20 5 14V7zM10 13l3 3 6-7"/>',
 special:'<path d="M16 2L5 16h8l-2 10 13-16h-9z"/>',
 dodge:'<path d="M4 11h11M2 16h8M6 21h8M18 5l7 8-7 8m6-8H12"/>',
 pickup:'<path d="M6 12h16v12H6zM10 12V8h8v4M14 8V2m-4 4l4-4 4 4"/>'
};
function touchGlyph(key){return `<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${touchIcon[key]}</svg>`}
touch.replaceChildren();
touch.innerHTML=`<div id="stick-zone" aria-label="Περιοχή αναλογικού μοχλού"><div id="stick-base"><span class="stick-rings"></span><span id="stick-knob"></span></div><span class="stick-caption">ΚΙΝΗΣΗ</span></div><div class="touch-cluster">${[['attack','Επίθεση: πάτημα για χτύπημα, κράτημα για ειδική κίνηση'],['jump','Άλμα'],['block','Κράτημα για άμυνα'],['pickup','Σήκωσε, πέτα ή βοήθησε']].map(([key,label])=>`<button class="action-disc ${key}" data-touch="${key}" aria-label="${label}">${touchGlyph(key)}<small>${({attack:'ΕΠΙΘΕΣΗ',jump:'ΑΛΜΑ',block:'ΑΜΥΝΑ',special:'ΕΝΕΡΓΕΙΑ',dodge:'ΑΠΟΦΥΓΗ',pickup:'ΣΗΚΩΣΕ'})[key]}</small></button>`).join('')}</div><div class="touch-onboarding" hidden>Σύρε για κίνηση · πέρα από τον κύκλο για τρέξιμο · κράτα Επίθεση για special</div>`;
const stickZone=document.querySelector('#stick-zone'),stickBase=document.querySelector('#stick-base'),stickKnob=document.querySelector('#stick-knob');
let stickOrigin=null,attackPointer=null,attackTime=0,attackCombo=0,touchQueued=null;
function updateStick(e){
 if(e.pointerId!==DragonTouch.pointer||!stickOrigin)return;
 const dx=e.clientX-stickOrigin.x,dy=e.clientY-stickOrigin.y,r=43,dist=Math.hypot(dx,dy),unit=dist?Math.min(dist,r)/dist:0,magnitude=clamp((Math.min(dist/r,1)-.12)/.88,0,1);
 DragonTouch.x=dist?dx/dist*magnitude:0;DragonTouch.y=dist?dy/dist*magnitude:0;
 if(dist>60)keys.add('1:run');else if(dist<50)keys.delete('1:run');stickBase.classList.toggle('running',keys.has('1:run'));
 stickKnob.style.transform=`translate(${dx*unit}px,${dy*unit}px)`;
}
function resetTouch(){DragonTouch.active=false;DragonTouch.pointer=null;DragonTouch.x=DragonTouch.y=0;stickOrigin=null;stickKnob.style.transform='translate(0,0)';stickBase.style.transform='';stickBase.classList.remove('engaged');attackPointer=null;attackTime=0;touchQueued=null;keys.delete('1:block');keys.delete('1:attack');keys.delete('1:run');stickBase.classList.remove('running');touch.querySelectorAll('.pressed').forEach(el=>el.classList.remove('pressed'))}
stickZone.addEventListener('pointerdown',e=>{
 if(game.mode!=='play'||DragonTouch.pointer!==null||e.pointerType==='mouse')return;
 e.preventDefault();unlockSound();stickZone.setPointerCapture(e.pointerId);
 const z=stickZone.getBoundingClientRect();stickOrigin={x:clamp(e.clientX,z.left+49,z.right-49),y:clamp(e.clientY,z.top+49,z.bottom-49)};
 DragonTouch.active=true;DragonTouch.pointer=e.pointerId;stickBase.style.transform=`translate(${stickOrigin.x-(z.left+z.width/2)}px,${stickOrigin.y-(z.top+z.height/2)}px)`;stickBase.classList.add('engaged');updateStick(e);
},{passive:false});
stickZone.addEventListener('pointermove',e=>{if(e.pointerId===DragonTouch.pointer){e.preventDefault();updateStick(e)}},{passive:false});
for(const event of ['pointerup','pointercancel','lostpointercapture'])stickZone.addEventListener(event,e=>{if(e.pointerId===DragonTouch.pointer){DragonTouch.active=false;DragonTouch.pointer=null;DragonTouch.x=DragonTouch.y=0;stickOrigin=null;stickKnob.style.transform='';stickBase.style.transform='';stickBase.classList.remove('engaged','running');keys.delete('1:run')}});
for(const b of touch.querySelectorAll('[data-touch]')){
 b.addEventListener('pointerdown',e=>{
  if(game.mode!=='play'||b.disabled)return;e.preventDefault();unlockSound();b.setPointerCapture(e.pointerId);b.classList.add('pressed');
  const p=game.players[0],key=b.dataset.touch;if(!p)return;
  if(key==='block'){keys.add('1:block');action(p,'guard')}
  else if(key==='attack'){attackPointer=e.pointerId;press('1:attack')}
  else if(MOVE_TIME[p.act]&&p.act!=='lift')touchQueued={action:key,ttl:.24};
  else action(p,key);
  if(hdPrefs.haptics!==false&&navigator.vibrate)navigator.vibrate(8);
 },{passive:false});
 const release=e=>{b.classList.remove('pressed');if(e.type==='pointercancel')touchQueued=null;if(b.dataset.touch==='block')keys.delete('1:block');if(e.pointerId===attackPointer){attackPointer=null;keys.delete('1:attack')}};
 for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,release);
 b.addEventListener('click',e=>{if(e.detail===0&&game.mode==='play'){const p=game.players[0];if(p)action(p,b.dataset.touch==='attack'?'attack':b.dataset.touch)}});
}
const hdTouchUpdate=update;
update=function(dt){
 hdTouchUpdate(dt);
 if(game.mode!=='play'){resetTouch();return}
 if(touchQueued){touchQueued.ttl-=dt;const p=game.players[0];if(touchQueued.ttl<=0)touchQueued=null;else if(p&&!MOVE_TIME[p.act]){const next=touchQueued.action;touchQueued=null;action(p,next)}}
 touch.querySelector('.attack').classList.toggle('charging',!!game.players[0]?.charge&&!game.players[0]?.chargeSpent);
 if(mobileMatch.matches){const p=game.players[0],button=touch.querySelector('.pickup');if(p){const available=!!(p.carry||nearbyItem(p)||rescueTarget(p));button.hidden=false;button.querySelector('small').textContent=p.carry?'ΠΕΤΑΞΕ':rescueTarget(p)?'ΒΟΗΘΗΣΕ':'ΣΗΚΩΣΕ';button.setAttribute('aria-label',p.carry?'Πέταξε αντικείμενο':rescueTarget(p)?'Βοήθησε τον δεύτερο παίκτη':'Σήκωσε αντικείμενο');button.disabled=!available}}
};
const hdTouchShow=show;
show=function(page){resetTouch();hdTouchShow(page);document.documentElement.classList.toggle('touch-game',mobileMatch.matches&&page==='play');if(page==='play'&&mobileMatch.matches){const onboarding=touch.querySelector('.touch-onboarding');let seen=false;try{seen=localStorage.getItem('dragon-touch-intro')==='1';localStorage.setItem('dragon-touch-intro','1')}catch{}onboarding.hidden=seen;if(!seen)setTimeout(()=>onboarding.hidden=true,6500)}};
addEventListener('blur',resetTouch);document.addEventListener('visibilitychange',()=>{if(document.hidden){resetTouch();if(game.mode==='play')show('pause')}});addEventListener('resize',resetTouch);
hdPrefs.haptics=hdPrefs.haptics!==false;
hdPrefs.leftHanded=hdPrefs.leftHanded===true;
const touchResize=hdResize;
hdResize=function(){touchResize();document.documentElement.classList.toggle('left-handed',!!hdPrefs.leftHanded)};
hdSettingDefs[2].splice(1,0,['haptics','ΑΠΤΙΚΗ ΑΝΑΔΡΑΣΗ','Σύντομη δόνηση όπου υποστηρίζεται'],['leftHanded','ΑΝΤΙΣΤΡΟΦΗ ΠΛΕΥΡΩΝ','Αλλαγή πλευράς μοχλού και ενεργειών']);
const touchGuide=hdGuide;
hdGuide=function(){return touchGuide().replace('<p class="keyboard-guide">','<p class="touch-guide"><b>ΣΤΟ ΚΙΝΗΤΟ</b> Σύρε τον μοχλό: μικρή κλίση για αργά, μεγάλη για γρήγορα. Κράτησε Επίθεση για γροθιές και κλωτσιές σε συνδυασμό. Το Σήκωσε / Πέταξε εμφανίζεται όταν χρειάζεται.</p><p class="keyboard-guide">')};
hdResize();
show(game.mode);
