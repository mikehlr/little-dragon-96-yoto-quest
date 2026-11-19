'use strict';
// An aerial attack shares jump physics, but has its own authored animation and hit window.
MOVE_TIME.airKick=.48;
const arcadeAction=action;
action=function(p,name){
 if(p&&['attack','punch','kick'].includes(name)&&p.z>0&&game.mode==='play'){
  if(p.hp<=0||p.airKickUsed||p.carry||p.act==='respawn'||MOVE_TIME[p.act])return;
  p.face=Math.sign(moveX(p))||Math.sign(p.face)||1;p.airKickUsed=true;p.charge=0;p.chargeSpent=true;p.running=false;
  p.hit=new Set();pose(p,'airKick');effect('kickSwing',p.id);return;
 }
 arcadeAction(p,name);
};
const arcadePlayerUpdate=updatePlayer;
updatePlayer=function(p,dt){
 p.face=Math.sign(p.face)||p.arcadeFacing||1;
 arcadePlayerUpdate(p,dt);
 if(p.act==='airKick'){
  if(p.z<=0){pose(p,'land');p.airKickUsed=false}
  else if(p.age>=.13&&p.age<.34){for(const e of game.enemies){const d=(e.x-p.x)*p.face;if(canHitEnemy(e,p.z-12)&&d>=-7&&d<48+e.size*.27&&Math.abs(e.y-p.y)<22)damage(e,p,29,p.hit,p.face,'kick')}if(p.z<32)hitItems(p,p.hit,p.x,p.y,46,26,p.face)}
 }
 if(p.z===0&&p.vz===0)p.airKickUsed=false;
 p.face=Math.sign(p.face)||p.arcadeFacing||1;p.arcadeFacing=p.face;
};
const arcadeHeroFrame=drawHeroFrame;
function airKickFrame(p){return Math.min(7,Math.floor(p.age/MOVE_TIME.airKick*8))}
drawHeroFrame=function(p){if(p.act!=='airKick')return arcadeHeroFrame(p);const im=images['air-kick-'+(p.hero||p.id)],sw=im.naturalWidth/4,sh=im.naturalHeight/2,frame=airKickFrame(p),h=64;ctx.drawImage(im,frame%4*sw,Math.floor(frame/4)*sh,sw,sh,-h/2,-h*.95,h,h)};
const arcadeHero=drawHero;
drawHero=function(p){p.face=Math.sign(p.face)||p.arcadeFacing||1;arcadeHero(p)};
const arcadeStick=updateStick;
updateStick=function(e){arcadeStick(e);const p=game.players[0];if(p&&DragonTouch.active&&Math.abs(DragonTouch.x)>.01&&!MOVE_TIME[p.act]){p.face=Math.sign(DragonTouch.x);p.arcadeFacing=p.face}};
const arcadeStart=start;
start=function(two){if(two&&heroSeats[0]===heroSeats[1])heroSeats[1]=3-heroSeats[0];arcadeStart(two)};

// The active game surface owns its gestures. Native menu keyboard focus stays available.
const gameSurface=document.querySelector('#game-shell');
for(const event of ['gesturestart','gesturechange','gestureend','dblclick'])gameSurface.addEventListener(event,e=>{if(game.mode==='play')e.preventDefault()},{passive:false});
gameSurface.addEventListener('touchmove',e=>{if(game.mode==='play'&&e.cancelable)e.preventDefault()},{passive:false});

const ARCADE_ICONS={
 one:'M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 23v-5a7 7 0 0 1 14 0v5M4 23h16',
 two:'M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 23v-6a6 6 0 0 1 12 0v6m0-10a6 6 0 0 1 9 5v5',
 settings:'m10 2 4 0 1 4 3 2 4-1 2 4-3 3 0 3 3 3-2 4-4-1-3 2-1 4h-4l-1-4-3-2-4 1-2-4 3-3v-3L0 11l2-4 4 1 3-2zM12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
 how:'M8 5h8l4 5 3 10-3 2-5-5H9l-5 5-3-2 3-10zM6 10v7m-3-3h6m8-3h.1m3 3h.1',
 back:'M11 5 3 13l8 8M3 13h13a6 6 0 0 1 0 12',
 resume:'m7 3 15 10L7 23z',home:'m2 12 11-9 11 9M5 10v14h16V10m-12 14v-8h8v8',retry:'M4 10a9 9 0 1 1-1 9M4 3v7h7',
 image:'M2 3h22v20H2zM3 18l6-7 5 5 4-5 5 7M17 7h.1',audio:'M3 10h5l7-6v20l-7-6H3zM19 9q7 5 0 10',access:'M13 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 9h20M13 9v8m-7 9 7-9 7 9',
 star:'m13 1 3.6 8 8.4 1-6.2 6 1.8 9L13 21l-7.6 4 1.8-9L1 10l8.4-1z'
};
function arcadeGlyph(name){return `<svg viewBox="-2 -2 30 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ARCADE_ICONS[name]||ARCADE_ICONS.settings}"/></svg>`}
function arcadeButton(go,title,icon=go,extra=''){return `<button type="button" class="arcade-command ${extra}" data-go="${go}"><span class="command-icon">${arcadeGlyph(icon)}</span><b>${title}</b><span class="command-chevron" aria-hidden="true">▶</span></button>`}
hdHome=function(){return `<div class="title-scene arcade-title"><h1 class="logo">LITTLE<br><span>DRAGON</span><em>’96</em></h1><p class="subtitle">YOTO QUEST</p><div class="console-menu" role="group" aria-label="Αρχικό μενού">${arcadeButton('two','2 ΠΑΙΚΤΕΣ','two','primary')}${arcadeButton('one','1 ΠΑΙΚΤΗΣ','one')}${arcadeButton('how','ΧΕΙΡΙΣΜΟΣ','how')}${arcadeButton('settings','ΡΥΘΜΙΣΕΙΣ','settings')}</div><span class="arcade-start-hint">${hdLastInput==='pad'?'PRESS A / ×':'ΠΑΤΑ ENTER Ή ΔΙΑΛΕΞΕ'}</span>${!hdLoaded?`<span id="hd-loading" role="status">ΦΟΡΤΩΣΗ ${Math.round(hdLoadDone/hdLoadTotal*100)}%</span>`:''}</div>`};
hdSettings=function(){return `<div class="console-settings arcade-settings"><h2>ΡΥΘΜΙΣΕΙΣ</h2><nav class="settings-tabs" aria-label="Κατηγορίες ρυθμίσεων">${HD_TABS.map((title,i)=>`<button class="arcade-command arcade-tab ${i===hdTab?'active':''}" data-go="tab${i}" aria-pressed="${i===hdTab}">${arcadeGlyph(['image','audio','how','access'][i])}<b>${title}</b></button>`).join('')}</nav><div class="setting-list">${hdSettingDefs[hdTab].map(([key,title,hint])=>`<button type="button" class="arcade-command arcade-setting setting-row" data-go="hd-${key}" aria-label="${title}: ${hdSettingValue(key)}${hint?'. '+hint:''}"><b>${title}</b><span class="setting-value"><i aria-hidden="true">◀</i><strong>${hdSettingValue(key)}</strong><i aria-hidden="true">▶</i></span></button>`).join('')}</div><div id="pad-status" aria-live="polite"></div>${arcadeButton('back','ΠΙΣΩ','back')}</div>`};
hdGuide=function(){return `<div class="console-guide arcade-guide"><h2>ΤΕΣΣΕΡΑ ΚΟΥΜΠΙΑ · ΟΛΗ Η ΔΡΑΣΗ</h2><div class="arcade-control-grid">${[['X / □','ΕΠΙΘΕΣΗ','Κράτα για special · στον αέρα: κλωτσιά'],['A / ×','ΑΛΜΑ','Πήδα και πάτα επίθεση'],['B / ○','ΑΜΥΝΑ','Με κατεύθυνση: αποφυγή'],['Y / △','ΧΡΗΣΗ','Σήκωσε · πέταξε · μίλα']].map(([key,title,tip],i)=>`<div class="arcade-control"><span class="control-cap cap-${i}">${key}</span><div><b>${title}</b><span>${tip}</span></div></div>`).join('')}</div><p class="arcade-run-guide">ΜΟΧΛΟΣ: ΚΙΝΗΣΗ <span>LB / RB: ΤΡΕΞΙΜΟ</span></p><p class="keyboard-guide">P1: ΒΕΛΑΚΙΑ · J ΕΠΙΘΕΣΗ · SPACE ΑΛΜΑ · K ΑΜΥΝΑ · U ΧΡΗΣΗ<br>P2: WASD · F ΕΠΙΘΕΣΗ · T ΑΛΜΑ · G ΑΜΥΝΑ · E ΧΡΗΣΗ<br>SHIFT: ΤΡΕΞΙΜΟ · ΚΙΝΗΤΟ: ΣΥΡΕ ΕΞΩ ΑΠΟ ΤΟΝ ΚΥΚΛΟ ΓΙΑ ΤΡΕΞΙΜΟ</p><div id="pad-status" aria-live="polite"></div>${arcadeButton('back','ΠΙΣΩ','back')}</div>`};
difficultyScreen=function(){return `<div class="difficulty-screen arcade-difficulty"><h2>ΔΙΑΛΕΞΕ ΠΡΟΚΛΗΣΗ</h2><div class="difficulty-options" role="group" aria-label="Επίπεδο δυσκολίας">${Object.entries(DIFFICULTIES).map(([key,p],i)=>`<button type="button" data-go="difficulty-${key}" class="difficulty-choice ${key===selectedDifficulty?'primary selected':''}" aria-label="${p.name}. ${p.description}"><span class="difficulty-medals" aria-hidden="true">${Array.from({length:i+1},()=>arcadeGlyph('star')).join('')}</span><b>${p.name}</b><strong>${['ΓΙΑ ΟΛΟΥΣ','ΓΙΑ ΠΕΡΙΠΕΤΕΙΑ','ΓΙΑ ΠΡΩΤΑΘΛΗΤΕΣ'][i]}</strong><span class="difficulty-prompt" aria-hidden="true">▶ ΕΠΙΛΟΓΗ ◀</span></button>`).join('')}</div>${arcadeButton('back','ΠΙΣΩ','back')}</div>`};
const arcadeShow=show;
show=function(page){
 arcadeShow(page);
 // Convert every remaining in-game command, including pause/retry/stage/clear, into the same skin.
 for(const b of panel.querySelectorAll('button:not(.hero-choice):not(.difficulty-choice):not(.arcade-command)')){
  const title=b.textContent.replace(/^↩|^▶/g,'').trim(),name=b.dataset.go;
  b.classList.add('arcade-command');b.innerHTML=`<span class="command-icon">${arcadeGlyph(name==='nextStage'?'resume':name)}</span><b>${title}</b><span class="command-chevron" aria-hidden="true">▶</span>`;
 }
 if(page==='home'&&!hdLoaded)panel.querySelectorAll('[data-go="one"],[data-go="two"]').forEach(b=>b.disabled=true);
 if(page==='stage'){const names=panel.querySelector('.hero-select');if(names)names.textContent=game.players.map(p=>HERO_CHOICES[(p.hero||p.id)-1].name).join(' + ');const tip=panel.querySelector('.card p .muted');if(tip&&!game.entry)tip.textContent='ΑΛΜΑ + ΕΠΙΘΕΣΗ: ΕΝΑΕΡΙΑ ΚΛΩΤΣΙΑ · Y / U: ΧΡΗΣΗ'}
};
globalThis.DragonArcade24={version:'2.4',airFrame:airKickFrame,uniqueRoster:true};
show(game.mode);
