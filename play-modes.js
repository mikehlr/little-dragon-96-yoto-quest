'use strict';
// Session choice precedes seats. Practice is a standalone stage, never campaign progress.
let selectedMode='story',practiceStage=0,practiceOrigin='difficulty',practiceStarting=false;
game.sessionMode='story';
ARCADE_ICONS.story='M3 3h8l2 3 2-3h8v22h-8l-2-3-2 3H3zM13 6v16M6 8h4m-4 5h4m6-5h4m-4 5h4';
ARCADE_ICONS.practice='M3 23V3m0 1h18l-4 5 4 5H3M8 23h-8';
const modesHome=hdHome;
hdHome=function(){return modesHome().replace(arcadeButton('two','2 ΠΑΙΚΤΕΣ','two','primary')+arcadeButton('one','1 ΠΑΙΚΤΗΣ','one'),arcadeButton('mode-story','STORY MODE','story','primary')+arcadeButton('mode-practice','PRACTICE','practice'))};
function playerCountScreen(){return `<div class="mode-screen"><h2>${selectedMode==='story'?'STORY MODE':'PRACTICE'}</h2><p>ΔΙΑΛΕΞΕ ΑΡΙΘΜΟ ΠΑΙΚΤΩΝ</p><div class="mode-commands">${arcadeButton('one','1 ΠΑΙΚΤΗΣ','one','primary')}${arcadeButton('two','2 ΠΑΙΚΤΕΣ','two')}${arcadeButton('back','ΠΙΣΩ','back')}</div></div>`}
function practiceLevelsScreen(){return `<div class="mode-screen practice-screen"><h2>ΔΙΑΛΕΞΕ ΠΙΣΤΑ</h2><p>PRACTICE · ${selectedTwo?'2 ΠΑΙΚΤΕΣ':'1 ΠΑΙΚΤΗΣ'}</p><div class="practice-levels">${STAGES.map((s,i)=>`<button type="button" class="practice-level ${practiceStage===i?'primary':''}" data-go="practice-stage-${i}" aria-label="${i+1}. ${s.name}"><img src="assets/hd-far-${['athens','harbor','forest','ruins','castle'][i]}.webp" alt="" draggable="false"><span><i>${String(i+1).padStart(2,'0')}</i><b>${s.name}</b></span></button>`).join('')}</div>${arcadeButton('back','ΠΙΣΩ','back')}</div>`}
const modesShow=show;
show=function(page){
 modesShow(page);
 if(page==='players'){panel.innerHTML=playerCountScreen();screen.setAttribute('aria-label','Επιλογή αριθμού παικτών');hdFocus('one')}
 if(page==='practice-levels'){panel.innerHTML=practiceLevelsScreen();screen.setAttribute('aria-label','Επιλογή πίστας εξάσκησης');hdFocus('practice-stage-'+practiceStage)}
 if(page==='home')panel.querySelectorAll('[data-go^="mode-"]').forEach(b=>b.disabled=!hdLoaded);
 if(page==='characters'&&heroSeat===0){const b=panel.querySelector('[data-go="back"] b');if(b)b.textContent='ΑΡΙΘΜΟΣ ΠΑΙΚΤΩΝ'}
 if(game.sessionMode==='practice'&&['pause','clear','lose'].includes(page)){
  if(page==='clear')panel.querySelector('[data-go="nextStage"]')?.remove();
  const holder=panel.querySelector('.card .menu-links')||panel.querySelector('.card');
  if(holder){holder.insertAdjacentHTML('beforeend',arcadeButton('practice-levels','ΑΛΛΑΓΗ ΠΙΣΤΑΣ','practice'));if(page==='clear')holder.insertAdjacentHTML('beforeend',arcadeButton('retry','ΞΑΝΑ Η ΙΔΙΑ ΠΙΣΤΑ','retry')+arcadeButton('home','ΑΡΧΙΚΟ ΜΕΝΟΥ','home'))}
  if(page==='clear')panel.querySelector('button')?.focus({preventScroll:true});
 }
};
const modesBack=hdBack;
hdBack=function(){if(game.mode==='players'){show('home');return}if(game.mode==='characters'&&heroSeat===0&&!heroLocked){show('players');return}if(game.mode==='practice-levels'){show(practiceOrigin);return}modesBack()};
const modesGo=go;
go=function(name){
 if(name==='mode-story'||name==='mode-practice'){if(!hdLoaded)return;selectedMode=name==='mode-story'?'story':'practice';show('players');return}
 if(name.startsWith('difficulty-')&&selectedMode==='practice'){
  const key=name.slice(11);if(!Object.hasOwn(DIFFICULTIES,key))return;selectedDifficulty=game.difficulty=key;try{localStorage.setItem('little-dragon-difficulty',key)}catch{}practiceOrigin='difficulty';show('practice-levels');return;
 }
 if(name==='practice-levels'&&game.sessionMode==='practice'){practiceOrigin=game.mode;practiceStage=game.level;show('practice-levels');return}
 if(name.startsWith('practice-stage-')){const level=Number(name.slice(15));if(game.mode!=='practice-levels'||!Number.isInteger(level)||level<0||level>=STAGES.length)return;practiceStage=level;selectedMode='practice';unlockSound();effect('select');start(selectedTwo);return}
 if(game.sessionMode==='practice'&&['retry','nextStage'].includes(name)){if(name==='retry'){practiceStage=game.level;selectedMode='practice';start(game.two)}else{practiceOrigin=game.mode;show('practice-levels')}return}
 modesGo(name);
};
const modesStage=beginStage;
beginStage=function(retry=false){if(practiceStarting)game.level=practiceStage;modesStage(retry)};
const modesStart=start;
start=function(two){game.sessionMode=selectedMode;practiceStarting=selectedMode==='practice';try{modesStart(two)}finally{practiceStarting=false}};
globalThis.DragonModes={version:'2.6',selected:()=>selectedMode,practiceStage:()=>practiceStage};
const modesMove=hdMove;
hdMove=function(dx,dy){
 if(game.mode!=='practice-levels')return modesMove(dx,dy);hdUserNavigated=true;
 const current=document.activeElement,rect=current?.getBoundingClientRect(),buttons=[...panel.querySelectorAll('button:not(:disabled)')];if(!rect)return;
 const cx=rect.x+rect.width/2,cy=rect.y+rect.height/2,candidates=buttons.filter(b=>b!==current).map(b=>{const r=b.getBoundingClientRect(),x=r.x+r.width/2-cx,y=r.y+r.height/2-cy;return {b,x,y,score:(dx?Math.abs(y):Math.abs(x))*2+Math.hypot(x,y)}}).filter(v=>dx?v.x*dx>8:v.y*dy>8).sort((a,b)=>a.score-b.score);
 const next=candidates[0]?.b;if(next){next.focus({preventScroll:true});next.scrollIntoView({block:'nearest',inline:'nearest'})}
};
moveMenu=hdMove;
