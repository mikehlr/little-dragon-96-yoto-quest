'use strict';
// One input vocabulary for keyboard, four face buttons and multitouch.
Object.assign(KEY_MAP,{KeyJ:'1:attack',KeyK:'1:block',KeyL:'1:block',KeyH:'1:special',ShiftLeft:'1:run',KeyF:'2:attack',KeyG:'2:block',KeyR:'2:block',ShiftRight:'2:run'});
ACTIONS.push('attack','guard');
MOVE_TIME.heroSpecial=.88;
const familyBaseAction=action;
action=function(p,name){
 if(!p||p.act==='respawn'||p.act==='heroSpecial'||p.hp<=0)return;
 if(name==='attack'){if(MOVE_TIME[p.act])return;name=((p.attackCombo||0)%3===2)?'kick':'punch';p.attackCombo=(p.attackCombo||0)+1}
 if(name==='guard'){if(moveX(p)||moveY(p))return familyBaseAction(p,'dodge');return}
 if(name==='special'){
  if(game.mode!=='play'||MOVE_TIME[p.act]||p.z||p.energy<60||p.specialCooldown>0)return;
  dropCarried(p);p.energy-=60;p.specialCooldown=7;p.specialPulse=-1;p.fired=false;p.hit=new Set();p.running=false;
  const dx=moveX(p);if(dx)p.face=Math.sign(dx);pose(p,'heroSpecial');p.inv=Math.max(p.inv,.64);effect('charge',p.id);return;
 }
 familyBaseAction(p,name);
};
rescueTarget=function(){return null}; // Lives replace the old once-per-district revive.
const familyPlayer=player;
player=function(id){return Object.assign(familyPlayer(id),{lives:3,maxHp:100,deathHandled:false,respawnWait:0,specialCooldown:0,charge:0,chargeSpent:false})};
const familyStage=beginStage;
beginStage=function(retry=false){
 if(retry)for(const p of game.players){p.lives=3;p.hp=p.maxHp||100;p.energy=65}
 familyStage(retry);familyEffects.length=0;
 for(const p of game.players){p.deathHandled=false;p.respawnWait=0;p.charge=0;p.chargeSpent=true;p.specialCooldown=0;if(p.lives<=0)p.hp=0}
};
const familyUpdatePlayer=updatePlayer;
updatePlayer=function(p,dt){
 p.specialCooldown=Math.max(0,(p.specialCooldown||0)-dt);
 if(p.act==='respawn'){
  p.age+=dt;p.inv=Math.max(p.inv,1.5);p.dropSpeed=(p.dropSpeed||0)+850*dt;p.z=Math.max(0,p.z-p.dropSpeed*dt);
  if(!p.z){pose(p,'land');p.vz=0;p.inv=2.3;impact(p.x,p.y,'landing',p.face,1.8);effect('slam',p.id);const hits=new Set();for(const e of game.enemies)if(!e.entry&&canHitEnemy(e,0)&&Math.hypot(e.x-p.x,(e.y-p.y)*2)<83)damage(e,p,14,hits,e.x<p.x?-1:1,'kick')}
  return;
 }
 if(p.act==='heroSpecial'){
  p.age+=dt;p.phase+=dt;p.inv=Math.max(0,p.inv-dt);p.energy=Math.min(100,p.energy+dt*3);
  if((p.hero||p.id)===1){if(p.age>=.30&&!p.fired){p.fired=true;game.shots.push({x:p.x+p.face*25,y:p.y-32,depth:p.y,elevation:0,direction:p.face,life:.95,owner:p,hits:new Set(),damage:46,gold:true});impact(p.x+p.face*27,p.y-32,'gold',p.face,1.5);effect('energyHit',p.id)}}
  else if(p.age>=.25&&p.age<.72){const pulse=Math.floor((p.age-.25)/.19);if(pulse!==p.specialPulse){p.specialPulse=pulse;const hits=new Set();for(const e of game.enemies)if(!e.entry&&canHitEnemy(e,0)&&Math.hypot(e.x-p.x,(e.y-p.y)*1.7)<76)damage(e,p,15,hits,e.x<p.x?-1:1,'kick');hitItems(p,new Set(),p.x-65,p.y,130,25,1);impact(p.x,p.y-25,'wind',p.face,1.4);effect('kickSwing',p.id)}}
  if(p.age>=MOVE_TIME.heroSpecial)pose(p,'idle');return;
 }
 const held=isHeld(p,'attack');
 if(!held){p.charge=0;p.chargeSpent=false}
 else if(!p.chargeSpent){p.charge=(p.charge||0)+dt;if(p.charge>=.72&&p.energy>=60&&!p.specialCooldown&&!MOVE_TIME[p.act]&&!p.z){action(p,'special');if(p.act==='heroSpecial')p.chargeSpent=true}else if((p.energy<60||p.specialCooldown>0)&&!MOVE_TIME[p.act]&&!p.z&&p.charge>.36){action(p,'attack')}}
 p.running=isHeld(p,'run')&&!p.carry&&!p.z&&!isHeld(p,'block');
 familyUpdatePlayer(p,dt);
};
const familyUpdate=update;
update=function(dt){
 if(game.mode==='play'){
  for(const p of game.players){
   if(p.hp<=0&&!p.deathHandled){p.deathHandled=true;p.lives=Math.max(0,(p.lives??3)-1);p.respawnWait=p.lives>0?.8:0;p.charge=0;p.chargeSpent=true;dropCarried(p)}
   if(p.respawnWait>0){if(!game.players.some(o=>o.hp>0))p.age+=dt;p.respawnWait=Math.max(0,p.respawnWait-dt);if(!p.respawnWait){p.hp=p.maxHp||100;p.z=p.y+90;p.vz=0;p.dropSpeed=0;p.x=clamp(p.x,...playerLimits(p));p.inv=3;pose(p,'respawn');p.deathHandled=false}}
  }
  for(const f of familyEffects)f.age+=dt;
  while(familyEffects.length&&familyEffects[0].age>1)familyEffects.shift();
 }
 familyUpdate(dt);
 if((game.mode==='intro'||game.mode==='ending')&&!document.hidden)updateStoryText(dt);
};
const familyShow=show;
show=function(page){
 familyShow(page);
 for(const p of game.players){p.charge=0;p.chargeSpent=true;p.running=false}
 if(page==='intro'||page==='ending')initStoryText();
};
addEventListener('blur',()=>{for(const p of game.players){p.charge=0;p.chargeSpent=true}});

// Fixed camera for each complete sheet, never fit individual poses.
const familyHeroFrame=drawHeroFrame;
function familyMotionFrame(p){return p.act==='heroSpecial'?8+Math.min(7,Math.floor(p.age/.88*8)):Math.floor(p.stride/10)%8}
drawHeroFrame=function(p){if(p.act==='heroSpecial'||p.running&&p.act==='walk'){const hero=p.hero||p.id,im=images['hero-actions-'+hero];const sw=im.naturalWidth/4,sh=im.naturalHeight/4,frame=familyMotionFrame(p),size=hero===1?64:65;ctx.drawImage(im,frame%4*sw,Math.floor(frame/4)*sh,sw,sh,-size/2,-size*(hero===1?.968:.952),size,size);return}if(p.act==='respawn'){const im=images['p'+(p.hero||p.id)+'-motion'];stamp(im,8,4,HERO_SIZE);return}familyHeroFrame(p)};

// Hits have a world-space contact point and a bounded lifetime, never a screen flash.
const familyEffects=[];
function impact(x,y,kind='contact',direction=1,power=1){if(!game.fx)return;familyEffects.push({x,y,kind,direction,power,age:0,seed:Math.floor(x*7+y*11)});if(familyEffects.length>48)familyEffects.splice(0,familyEffects.length-48)}
const familyDamage=damage;
damage=function(e,p,amount,hits,direction,source){const hp=e.hp;familyDamage(e,p,amount,hits,direction,source);if(e.hp<hp){impact(e.x,e.y-(e.z||0)-e.size*.53,e.hp?'contact':'finish',direction,e.hp?1:1.4);if(!e.hp&&e.boss)impact(e.x,e.y-25,'gold',direction,2)}};
const familyHitItems=hitItems;
hitItems=function(p,hits,x,y,reach,amount,direction=p.face){const before=game.items.filter(i=>i.hp&&!i.gone).map(i=>[i,i.hp]);familyHitItems(p,hits,x,y,reach,amount,direction);for(const [i,hp]of before)if(i.hp<hp&&!i.gone)impact(i.x,i.y-12,['pot','amphora','storyUrn'].includes(i.kind)?'stone':'wood',direction,.8)};
const familyBreak=breakItem;
breakItem=function(i){if(i.gone)return;const stone=['pot','amphora','storyUrn'].includes(i.kind);impact(i.x,i.y-(i.z||0)-10,stone?'stone':'wood',i.flight?.direction||1,1.5);familyBreak(i)};
const familyHurt=hitHero;
hitHero=function(p,x,n){const hp=p.hp,inv=p.inv;familyHurt(p,x,n);if(p.hp<hp)impact(p.x,p.y-p.z-27,'hurt',x>p.x?-1:1,.85);else if(!inv&&p.act==='block')impact(p.x+p.face*12,p.y-29,'guard',p.face,1)};
function drawImpactEffects(){
 for(const f of familyEffects){const life=['wood','stone','landing'].includes(f.kind)?.65:f.kind==='wind'?.43:.32,t=f.age/life;if(t>=1)continue;const calm=hdPrefs.calm,scale=f.power*(calm?.6:1),x=f.x-game.camera,y=f.y;
  ctx.save();ctx.translate(x,y);ctx.globalAlpha=(1-t)*(calm?.55:1);ctx.lineCap='round';
  const debris=f.kind==='wood'||f.kind==='stone',ring=f.kind==='landing'||f.kind==='wind',color=f.kind==='wind'?'#8ceeff':f.kind==='hurt'?'#ffb59a':f.kind==='guard'?'#b4eaff':debris?(f.kind==='stone'?'#c1bec6':'#c9a276'):'#ffe7ab';
  if(hdPrefs.lighting&&!calm&&!debris&&t<.55)hdGlow(0,0,(16+t*13)*scale,(12+t*9)*scale,f.kind==='wind'?'135,226,255':'255,202,116',.3*(1-t));
  if((debris||f.kind==='landing')&&!calm){for(let k=0;k<4;k++){ctx.fillStyle=f.kind==='stone'?'#c2bcc444':'#d3b89644';ctx.beginPath();ctx.ellipse((k-1.5)*(4+t*15)*scale,5-t*4,(2+t*7)*scale,(1+t*3)*scale,0,0,Math.PI*2);ctx.fill()}}
  if(ring){ctx.strokeStyle=color;ctx.lineWidth=(2-t)*scale;ctx.beginPath();ctx.ellipse(0,f.kind==='wind'?8:0,(10+t*43)*scale,(4+t*(f.kind==='wind'?12:7))*scale,-.15,0,Math.PI*2);ctx.stroke()}
  else if(!debris){if(t<.4){ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=(i%2?3:13)*(1-t)*scale;const px=Math.cos(a)*r*f.direction,py=Math.sin(a)*r*.8;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();ctx.fill();ctx.strokeStyle=f.kind==='guard'?'#35617d':'#b6773d';ctx.lineWidth=1.1;ctx.stroke()}ctx.strokeStyle=color;ctx.lineWidth=1.3*(1-t);ctx.beginPath();ctx.ellipse(0,0,(4+t*17)*scale,(3+t*12)*scale,0,0,Math.PI*2);ctx.stroke()}
  if(!calm)for(let i=0;i<(debris?10:6);i++){const a=(i*2.399+f.seed*.03),v=(debris?28:22)+(i%3)*9,px=Math.cos(a)*v*f.age*2*scale,py=Math.sin(a)*v*f.age*1.5*scale+(debris?75*f.age*f.age:0);ctx.save();ctx.translate(px,py);ctx.rotate(a+f.age*i);ctx.fillStyle=i%3===0?'#fff5d3':color;ctx.fillRect(-1,-.7,debris?3:2,debris?1.7:.8);ctx.restore()}
  ctx.restore();
 }
}
const familyShot=drawShot;
drawShot=function(s){if(!s.gold)return familyShot(s);const x=s.x-game.camera,y=s.y;ctx.save();ctx.translate(x,y);ctx.scale(s.direction,1);if(hdPrefs.lighting)hdGlow(0,0,30,15,'255,199,91',.35);ctx.strokeStyle='#ffda86';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-28,3);ctx.bezierCurveTo(-12,-14,4,13,16,-5);ctx.lineTo(11,-12);ctx.lineTo(26,-5);ctx.lineTo(17,6);ctx.stroke();ctx.strokeStyle='#fff4cf';ctx.lineWidth=1;ctx.stroke();ctx.restore()};

// Authored rewards, placed on the actual playable floor.
const FAMILY_PICKUPS={healthGem:0,maxHeart:1,bread:2,fruitPlate:3,lifeCharm:5};
Object.assign(ITEM,{healthGem:{width:22},maxHeart:{width:24},bread:{width:25},fruitPlate:{width:26},lifeCharm:{width:24}});
const familyStageItems=stageItems;
stageItems=function(level){const a=familyStageItems(level);for(let d=0;d<4;d++){const x=d*DISTRICT_LENGTH;a.push(makeItem('healthGem',x+370,228),makeItem('bread',x+1235,220),makeItem(d%2?'lifeCharm':'maxHeart',x+1680,238))}let n=0;for(const i of a)if(i.hp&&++n%7===0)i.loot=n%14?'healthGem':'maxHeart';return a};
const familyPickup=pickupAction;
pickupAction=function(p){const i=nearbyItem(p);if(!p.carry&&!MOVE_TIME[p.act]&&p.z<=11&&i&&i.kind in FAMILY_PICKUPS){
  if(i.kind==='lifeCharm'&&p.lives>=5){game.bonusNotice={text:'ΕΧΕΙΣ ΗΔΗ 5 ΖΩΕΣ',until:game.clock+1};return}
  if(i.kind==='maxHeart'&&(p.maxHp||100)>=160){p.hp=Math.min(p.maxHp,p.hp+35)}else if(i.kind==='maxHeart'){p.maxHp=Math.min(160,(p.maxHp||100)+20);p.hp=Math.min(p.maxHp,p.hp+35)}else if(i.kind==='lifeCharm')p.lives++;else p.hp=Math.min(p.maxHp||100,p.hp+(i.kind==='healthGem'?30:45));
  i.gone=true;game.items=game.items.filter(o=>o!==i);game.bonusNotice={text:i.kind==='lifeCharm'?'+1 ΖΩΗ':i.kind==='maxHeart'?(p.maxHp===160?'+ ΖΩΗ · ΟΡΙΟ 160':'+20 ΜΕΓΙΣΤΗ ΖΩΗ'):'+ ΖΩΗ',until:game.clock+1.7};effect('heal',p.id);impact(p.x,p.y-24,'guard',1,1);return;
 }familyPickup(p)};
const familyDrawItem=drawItem;
drawItem=function(i){
 if(i.kind in FAMILY_PICKUPS){if(i.gone)return;const x=i.x-game.camera;if(x<-40||x>WIDTH+40)return;const w=ITEM[i.kind].width;shadow(x,i.y,w*.25,.3);townCell(images['arcade-powerups'],FAMILY_PICKUPS[i.kind],4,2,x,i.y-3-(hdPrefs.calm?0:Math.sin(game.clock*3+i.x)*1.2),w,w,.93);return}
 if(i.kind==='townWalker'&&i.active&&i.crowdSheet!==undefined){const frame=i.identity*10+(i.walking?1+Math.floor(i.stride/6)%8:0);shadow(i.x-game.camera,i.y,11,.3);ctx.save();ctx.translate(i.x-game.camera,i.y);ctx.scale(i.direction,1);townCell(images['crowd-variety-'+i.crowdSheet],frame,5,4,0,0,78,78,.98);ctx.restore();return}familyDrawItem(i);
};
const familyPopulate=populateTown;
populateTown=function(level){familyPopulate(level);const sheets=[[0,0],[0,2],[1,1],[1,2],[2,2]][level];for(const [index,w]of townWalkers.entries()){w.crowdSheet=sheets[index%2];w.identity=index%2;w.wait=1+index*.7}for(let d=0;d<4;d++){const w={kind:'townWalker',decor:true,x:d*DISTRICT_LENGTH+1050,y:216+d%2*23,identity:(d+1)%2,crowdSheet:sheets[(d+1)%2],stride:0,direction:d%2?1:-1,active:false,wait:4+d,age:0};townWalkers.push(w);game.items.push(w)}};
const familyRoadSprite=roadSprite;
roadSprite=function(frame,x,y,w,h){if(frame!==5)return familyRoadSprite(frame,x,y,w,h);const im=images['grounded-street-lamp'];if(!READY(im))return;const width=h*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,x-width/2,y-h*.992,width,h)};

const familyHud=hud;
hud=function(){drawImpactEffects();familyHud();for(const [n,p]of game.players.entries()){const x=n?WIDTH-141:9;pixel(x,25,132,9,'#101a2bed');label('×'+p.lives+'  '+Math.ceil(p.hp)+'/'+(p.maxHp||100)+'  '+((p.hero||p.id)===1?'ΔΡΑΚΟΣ':'ΑΝΕΜΟΣ'),x+1,32,5.8,'#f4dfb5');const hero=p.hero||p.id,ready=p.energy>=60&&!p.specialCooldown;if(p.specialCooldown>0)label(Math.ceil(p.specialCooldown)+'s',x+114,32,5,'#e7ebf4');else if(ready)label(hdLastInput==='pad'?'ΚΡΑΤΑ X':mobileMatch.matches?'ΚΡΑΤΑ':p.id===1?'ΚΡΑΤΑ J':'ΚΡΑΤΑ F',x+105,32,5,'#fff1b2');if(p.charge>0&&!p.chargeSpent){pixel(p.x-game.camera-12,p.y-p.z-67,24,2,'#162139');pixel(p.x-game.camera-12,p.y-p.z-67,24*Math.min(1,p.charge/.72),2,hero===1?'#ffda8c':'#91edff')}}};

// Text reveal and reading time share one path for pad, keyboard and touch.
let familyStory=null;
function initStoryText(){const el=panel.querySelector('.comic-copy p');if(!el)return;const text=el.textContent;familyStory={el,text,chars:Array.from(text),elapsed:0,read:0,complete:false};el.textContent='';el.setAttribute('aria-label',text);panel.querySelector('.arcade-story-hint')?.setAttribute('data-typing','true')}
function updateStoryText(dt){if(!familyStory||!familyStory.el.isConnected){initStoryText();return}const s=familyStory;if(!s.complete){s.elapsed+=dt;const count=Math.floor(s.elapsed*34);s.el.textContent=s.chars.slice(0,count).join('');if(count>=s.chars.length){s.complete=true;panel.querySelector('.arcade-story-hint')?.removeAttribute('data-typing')}}else{s.read+=dt;if(s.read>=Math.max(3,s.chars.length/34))go('arcadeAdvance')}}
const familyGo=go;
go=function(name){if(name==='arcadeAdvance'&&(game.mode==='intro'||game.mode==='ending')&&familyStory&&!familyStory.complete){familyStory.el.textContent=familyStory.text;familyStory.complete=true;familyStory.read=0;panel.querySelector('.arcade-story-hint')?.removeAttribute('data-typing');return}familyGo(name)};
const familyGuide=hdGuide;
hdGuide=function(){return familyGuide().replace('Γροθιά · κλωτσιά','Επίθεση · κράτημα για ειδική κίνηση').replace('X / □ · B / ○','X / □').replace('Y / △ · R1 / RB','Y / △').replace('Ενέργεια · σήκωμα / ρίψη','Σήκωσε · πέταξε · μίλα').replace('L1 / LB · L3 / R3','B / ○ · LB / RB').replace('Άμυνα · αποφυγή','Άμυνα / κατεύθυνση για αποφυγή · ώμοι για τρέξιμο').replace('J/K/L, Space, H/U/I','J επίθεση (κράτα για special), Space άλμα, K άμυνα, U χρήση, Shift τρέξιμο').replace('F/G/R, T, Y/E/Q','F επίθεση, T άλμα, G άμυνα, E χρήση, δεξί Shift τρέξιμο').replace('Κράτησε Επίθεση για γροθιές και κλωτσιές σε συνδυασμό.','Κράτησε Επίθεση για την ειδική κίνηση όταν γεμίσει η ενέργεια. Σύρε τον μοχλό πέρα από τον κύκλο για τρέξιμο.')};
globalThis.DragonFamily={version:'2.3',effects:familyEffects,impact,motionFrame:familyMotionFrame,story:()=>familyStory,lifeCap:5,specialCost:60};
