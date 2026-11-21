'use strict';
const SURPRISE_TYPES={1:'water',2:'forest',3:'ruins',5:'wind',4:'scooters'};
const SURPRISE_TEXT={
 water:[['ΝΕΡΟ ΣΤΗΝ ΠΡΟΚΥΜΑΙΑ','WATER ON THE QUAY','ВОДА НА ПРИЧАЛІ'],['ΚΡΑΤΑ ΕΠΙΘΕΣΗ · ΣΗΜΑΔΕΨΕ ΜΕ ΚΙΝΗΣΗ','HOLD ATTACK · MOVE TO AIM','УТРИМУЙ АТАКУ · РУХАЙСЯ ДЛЯ ПРИЦІЛУ']],
 forest:[['ΜΑΖΕΨΕ ΤΙΣ ΠΥΓΟΛΑΜΠΙΔΕΣ','GATHER THE FIREFLIES','ЗБЕРИ СВІТЛЯЧКІВ'],['ΠΙΑΣΕ ΤΑ ΦΩΤΑ · ΠΗΔΑ ΤΟΥΣ ΚΟΡΜΟΥΣ','CATCH LIGHTS · JUMP THE LOGS','ЛОВИ ВОГНИКИ · ПЕРЕСТРИБУЙ КОЛОДИ']],
 ruins:[['Η ΒΡΟΧΗ ΤΩΝ ΚΡΥΣΤΑΛΛΩΝ','CRYSTAL RAIN','КРИШТАЛЕВИЙ ДОЩ'],['ΧΤΥΠΑ ΤΙΣ ΠΕΤΡΕΣ · ΠΙΑΣΕ ΤΟΥΣ ΚΡΥΣΤΑΛΛΟΥΣ','HIT STONES · CATCH CRYSTALS','БИЙ КАМІННЯ · ЛОВИ КРИСТАЛИ']],
 wind:[['ΤΑ ΦΑΝΑΡΙΑ ΤΗΣ ΧΙΟΝΟΘΥΕΛΛΑΣ','BLIZZARD LANTERNS','ЛІХТАРІ В ХУРТОВИНІ'],['ΑΜΥΝΑ ΣΤΟΝ ΑΝΕΜΟ · ΠΙΑΣΕ ΤΑ ΦΑΝΑΡΙΑ','GUARD THE WIND · CATCH LANTERNS','ЗАХИЩАЙСЯ ВІД ВІТРУ · ЛОВИ ЛІХТАРІ']],
 scooters:[['ΟΙ ΒΙΑΣΤΙΚΟΙ ΑΓΓΕΛΙΟΦΟΡΟΙ','SCOOTER COURIERS','КУР’ЄРИ НА СКУТЕРАХ'],['ΑΠΟΦΥΓΗ / ΑΛΜΑ · ΧΤΥΠΑ ΤΟΥΣ ΑΝΑΒΑΤΕΣ','DODGE / JUMP · HIT THE RIDERS','УХИЛЯЙСЯ / СТРИБАЙ · БИЙ ВОДІЇВ']]
};
for(const kind in SURPRISE_TEXT)SURPRISE_TEXT[kind]=SURPRISE_TEXT[kind].map(row=>chapterText(...row));
const BONUS_SKIP=chapterText('ΠΑΡΑΛΕΙΨΗ ΜΠΟΝΟΥΣ','SKIP BONUS','ПРОПУСТИТИ БОНУС'),BONUS_COINS=chapterText('ΜΠΟΝΟΥΣ ΝΟΜΙΣΜΑΤΑ','BONUS COINS','БОНУСНІ МОНЕТИ'),BONUS_SCORE=chapterText('ΠΟΝΤΟΙ','POINTS','ОЧКИ');
const BONUS_LAST=chapterText('ΤΕΛΕΥΤΑΙΟ ΠΕΡΑΣΜΑ','FINAL PASS','ОСТАННІЙ ПРОЇЗД');
let surpriseState=null,surpriseDone=false;
const WATER_GUN_WIDTH=28;
Object.assign(ITEM,{waterBlaster:{width:WATER_GUN_WIDTH,sprite:5}});
function bonusArt(frame,x,y,w,flip=1){const im=images['surprise-props'];if(!READY(im))return;const r=DRAGON_COLLECTION_ART['surprise-props'].frames[frame],h=w*r[3]/r[2],anchor=frame<4?.94:frame<8?.86:frame<12?.96:frame===13?.98:.94;ctx.save();ctx.translate(x,y);ctx.scale(flip,1);ctx.drawImage(im,...r,-w/2,-h*anchor,w,h);ctx.restore()}
function drawWaterGun(x,y,w=WATER_GUN_WIDTH){const im=images['surprise-props'];if(!READY(im))return;const r=DRAGON_COLLECTION_ART['surprise-props'].frames[12],h=w*r[3]/r[2];ctx.drawImage(im,...r,x-w*.24,y-h*.70,w,h)}
function surpriseAttack(p){return p.hp>0&&(['punch','kick','airKick','airClub','heroSpecial'].includes(p.act))&&p.age>=({punch:.14,kick:.22,airKick:.10,airClub:.18,heroSpecial:.25}[p.act])&&p.age<({punch:.27,kick:.40,airKick:.35,airClub:.34,heroSpecial:.73}[p.act])}
function bonusBump(p,x){if(!surpriseState||p.inv>0||p.act==='dodge'||p.act==='respawn'||p.hp<=0)return;if(p.act==='block')return;surpriseState.misses++;surpriseState.points=Math.max(0,surpriseState.points-1);p.inv=.7;pose(p,'hit');p.x=clamp(p.x+(p.x<x?-7:7),...playerLimits(p));effect('hurt',p.id);impact(p.x,p.y-15,'guard',1,.65)}
const bonusHit=hitHero;
hitHero=function(p,x,amount){if(surpriseState&&game.gate==='surprise'){bonusBump(p,x);return}return bonusHit(p,x,amount)};
function startSurprise(){const kind=SURPRISE_TYPES[game.level];if(!kind||surpriseState)return false;const camera=game.camera;
 surpriseState={kind,level:game.level,section:game.section,camera,t:0,duration:kind==='water'?19:17,points:0,misses:0,spawned:0,next:1.2,objects:[],gear:new Map(game.players.map(p=>[p,p.carry])),equipped:false};surpriseDone=true;
 Object.assign(game,{gate:'surprise',arenaCamera:camera,enemies:[],hazards:[],shots:[],timer:0,districtTitle:0});townSpeech=null;
 if(kind==='water')surpriseState.objects.push({kind:'surpriseObject',type:'cart',x:camera-90,y:199,z:0});
 chapterEvent('surprise-start',{kind});effect('warning');return true;
}
function restoreSurpriseGear(s){if(s.kind!=='water')return;for(const [p,item]of s.gear){if(p.carry?.kind==='waterBlaster')p.carry=item&&!item.gone?item:null;p.waterTank=null;p.waterCooldown=0;p.charge=0;p.chargeSpent=true}game.items=game.items.filter(i=>i.kind!=='waterBlaster')}
function cancelSurprise(){if(surpriseState)restoreSurpriseGear(surpriseState);surpriseState=null}
function finishSurprise(skip=false){const s=surpriseState;if(!s)return;const owner=game.players.find(p=>p.hp>0)||game.players[0];
 for(const e of game.enemies)if(e.surpriseFoe&&e.hp>0&&!e.entry)damage(e,owner,e.hp*4,new Set(),e.x<owner.x?-1:1,'energyHit');game.enemies=game.enemies.filter(e=>!e.surpriseFoe||!e.entry);
 const reward=skip?0:Math.min(14,Math.max(0,s.points));if(reward)grantCoins(reward);restoreSurpriseGear(s);surpriseState=null;Object.assign(game,{camera:s.camera,gate:'open',timer:.9,arenaCamera:null,hazards:[],shots:[]});game.bonusNotice={text:BONUS_COINS+' +'+reward,until:game.clock+2.4};chapterEvent('surprise-end',{kind:s.kind,points:s.points,misses:s.misses,reward,skip});effect('reward');
}
const surpriseEncounter=startEncounter;
startEncounter=function(){if(game.section===8&&CHAPTERS[game.level]?.[8]?.kind==='rest'&&!surpriseDone&&SURPRISE_TYPES[game.level]){startSurprise();return}return surpriseEncounter()};
const surpriseBegin=beginStage;
beginStage=function(retry=false){cancelSurprise();surpriseDone=false;return surpriseBegin(retry)};
function spawnBonus(s){const lane=[205,224,243][s.spawned%3],dir=s.spawned%4===3?1:-1,edge=s.camera+(dir===1?-70:WIDTH+70);s.spawned++;
 if(s.kind==='forest'){const log=s.spawned%3!==0;s.objects.push({kind:'surpriseObject',type:log?'log':'fly',x:edge,y:log?lane:[210,231][s.spawned%2],z:log?0:10,dir,vx:dir*(log?130:90),age:-.85,hit:new Set(),resolved:false})}
 else if(s.kind==='ruins'){s.objects.push({kind:'surpriseObject',type:'crystal',x:s.camera+60+(s.spawned*83)%340,y:lane,z:220,vy:0,age:-.9,broken:false,hit:new Set()})}
 else if(s.kind==='wind'){const side=Math.sin(s.t*.8)>0?1:-1;s.objects.push({kind:'surpriseObject',type:'lantern',x:s.camera+(side===1?-30:WIDTH+30),y:lane,z:10,dir:side,vx:side*80,age:0})}
 else if(s.kind==='scooters'){s.objects.push({kind:'surpriseObject',type:'scooter',x:edge,y:lane,z:0,dir,vx:dir*(game.difficulty==='easy'?120:game.difficulty==='hard'?182:150),age:-.9,rider:true,hit:new Set(),resolved:false})}
}
function waterIdleRig(p){if(p.act!=='idle'||p.carryFlow&&p.carryFlow.mode!=='idle')return null;const hero=p.hero||p.id,frame=20,hand=CARRY_ACTION_HANDS[hero][frame];return {image:images['carry-actions-'+hero],frame,rows:6,height:DRAGON_CARRY_META[hero].height,anchor:.975,hand,box:[hand[0]-.13,hand[1]-.065,.26,.13]}}
function waterMuzzle(p){let hand,height;const action=waterIdleRig(p)||carryActionRig(p);if(action?.hand){hand=action.hand;height=action.height}else if((p.act==='walk'||p.carryFlow?.mode==='brake')&&p.carryFlow&&['walk','brake'].includes(p.carryFlow.mode)){const frame=carryWalkFrame(p)-8,v=LOAD_HANDS[p.hero||p.id][frame];hand=[v.x,v.y];height=DRAGON_CARRY_META[p.hero||p.id].height}else{const rig=carryBridgeRig(p);hand=rig.hand;height=rig.height}hand||=[.67,.58];const x=(hand[0]-.5)*height,y=(hand[1]-.975)*height,meta=DRAGON_COLLECTION_ART['surprise-props'].frames[12],gunH=WATER_GUN_WIDTH*meta[3]/meta[2];return {x:p.x+p.face*(x+(.94-.24)*WATER_GUN_WIDTH),z:p.z-y+(.70-.43)*gunH,depth:p.y}}
function fireWater(p){if(game.mode!=='play'||!surpriseState||surpriseState.kind!=='water'||p.carry?.kind!=='waterBlaster'||p.hp<=0||p.waterCooldown>0||p.waterTank<1||['hit','block','respawn','lift'].includes(p.act))return;p.waterTank--;p.waterCooldown=.18;p.waterRecoil=.12;const m=waterMuzzle(p);surpriseState.objects.push({kind:'surpriseObject',type:'water',...m,y:m.depth,owner:p,dir:p.face,vx:p.face*335,age:0,hit:new Set()});effect('waterJet',p.id)}
const surpriseAction=action;
action=function(p,name){if(p?.carry?.kind==='waterBlaster'&&surpriseState&&['attack','punch','kick','special','pickup'].includes(name)){if(name!=='pickup')fireWater(p);return}return surpriseAction(p,name)};
const surprisePlayer=updatePlayer;
updatePlayer=function(p,dt){if(p.carry?.kind==='waterBlaster'){p.waterCooldown=Math.max(0,(p.waterCooldown||0)-dt);p.waterTank=Math.min(8,(p.waterTank||0)+dt*2);p.waterRecoil=Math.max(0,(p.waterRecoil||0)-dt);p.chargeSpent=true;surprisePlayer(p,dt);p.charge=0;p.chargeSpent=true;if(isHeld(p,'attack'))fireWater(p);return}return surprisePlayer(p,dt)};
function updateSurprise(s,dt,living){s.t+=dt;s.next-=dt;
 if(s.kind==='water'){
  const cart=s.objects.find(o=>o.type==='cart');cart.x=s.waterFinished?cart.x-dt*180:Math.min(s.camera+80,cart.x+dt*180);
  if(s.t>1.15&&!s.equipped){s.equipped=true;for(const p of living){p.carry=makeItem('waterBlaster',p.x,p.y);p.waterTank=8;p.waterCooldown=0;pose(p,'lift')}for(let n=0;n<6;n++){const side=n%2?'left':'right',e=enemy([25,23,24][n%3],s.camera+(side==='left'?-55:WIDTH+55),[211,232][n%2]);e.hp=e.maxHp=24;e.surpriseFoe=true;queueEntrance(e,side,.45+n*1.8,s.camera+(side==='left'?100:360));game.enemies.push(e)}}
  if(s.equipped&&living.some(p=>!p.carry&&p.act!=='respawn'))for(const p of living)if(!p.carry){p.carry=makeItem('waterBlaster',p.x,p.y);p.waterTank=8}
 }else if(s.next<=0&&s.t<s.duration-1){spawnBonus(s);s.next=s.kind==='ruins'?1.15:s.kind==='scooters'?(game.difficulty==='easy'?1.65:1.3):1.1}
 if(s.kind==='wind'){const force=Math.sin(s.t*1.1)*Math.max(0,Math.sin(s.t*.55))*85;for(const p of living){const anchored=p.act==='block'||p.act==='heroSpecial';p.x=clamp(p.x+force*dt*(anchored?.12:p.z>10?1.3:1),...playerLimits(p))}}
 for(const o of s.objects){o.age=(o.age||0)+dt;if(o.type==='cart')continue;
  if(o.type==='water'){o.x+=o.vx*dt;for(const e of game.enemies)if(e.hp>0&&!e.entry&&!o.hit.has(e)&&Math.abs(e.x-o.x)<25&&Math.abs(e.y-o.y)<22&&Math.abs((e.z||0)+e.size*.6-o.z)<38){o.hit.add(e);damage(e,o.owner||living[0],36,new Set(),o.dir,'energyHit');s.points+=2;o.done=true;impact(e.x,e.y-20,'water',o.dir,.8)}}
  else if(o.type==='crystal'){
   if(o.age>=0){o.vy+=dt*330;o.z=Math.max(0,o.z-o.vy*dt);for(const p of living)if(!o.broken&&o.z<65&&surpriseAttack(p)&&Math.abs(p.x-o.x)<51&&Math.abs(p.y-o.y)<18){o.broken=true;o.z=8;o.vy=0;s.points+=2;impact(o.x,o.y-14,'glass',p.face,1);effect('break')}
    if(o.broken&&living.some(p=>Math.hypot(p.x-o.x,(p.y-o.y)*1.3)<26)){o.done=true;s.points++;effect('pickup')}
    if(!o.broken&&o.z<=0){let safe=true;for(const p of living)if(Math.abs(p.x-o.x)<26&&Math.abs(p.y-o.y)<14&&p.z<25){bonusBump(p,o.x);safe=false}if(safe)s.points++;impact(o.x,o.y,'stone',1,.8);o.done=true}
   }
  }else if(o.age>=0){o.x+=o.vx*dt;
   if(o.type==='fly'||o.type==='lantern'){if(living.some(p=>Math.hypot(p.x-o.x,(p.y-o.y)*1.2)<25||surpriseAttack(p)&&Math.abs(p.x-o.x)<45&&Math.abs(p.y-o.y)<18)){o.done=true;s.points++;effect('pickup');spark(o.x,o.y-o.z,'#ffe79b',6)}}
   else for(const p of living){const near=Math.abs(p.x-o.x)<(o.type==='scooter'?35:25)&&Math.abs(p.y-o.y)<14;if(!near)continue;
    const shot=game.shots.find(shot=>!shot.hits.has(o)&&Math.abs(shot.x-o.x)<35&&Math.abs(shot.depth-o.y)<18);
    if(o.type==='scooter'&&o.rider&&(surpriseAttack(p)||shot)){o.rider=false;o.resolved=true;s.points+=2;if(shot)shot.hits.add(o);const e=enemy(38,o.x,o.y);e.hp=e.maxHp=18;e.entry=null;e.z=14;e.size*=1.15;game.enemies.push(e);damage(e,p,100,new Set(),o.dir,'kick');effect('club')}
    else if((o.type==='log'||o.rider)&&p.z<20&&!o.hit.has(p)){o.hit.add(p);bonusBump(p,o.x)}
   }
  }
  if(o.x<s.camera-95||o.x>s.camera+WIDTH+95){if(o.type==='scooter'&&!o.resolved&&!o.hit.size||o.type==='log'&&!o.hit.size)s.points++;o.done=true}if(o.type==='water'&&o.age>1.3)o.done=true;if(o.type==='crystal'&&o.age>3.6)o.done=true;
 }
 s.objects=s.objects.filter(o=>!o.done);
 if(s.kind==='water'){
  if(s.t>=s.duration||s.equipped&&s.t>4&&game.enemies.filter(e=>e.surpriseFoe).every(e=>e.hp<=0))s.waterFinished=true;
  if(s.waterFinished&&s.objects.find(o=>o.type==='cart').x<s.camera-90)finishSurprise();
 }else if(s.t>=s.duration&&(!s.objects.length||s.t>=s.duration+9))finishSurprise();
}
const surpriseGate=updateGate;
updateGate=function(living,dt){if(surpriseState&&game.gate==='surprise'){updateSurprise(surpriseState,dt,living);return}return surpriseGate(living,dt)};
const surpriseUpdate=update;
update=function(dt){surpriseUpdate(dt);if(surpriseState){if(game.level!==surpriseState.level){cancelSurprise();return}if(game.mode==='play'&&game.gate==='surprise')game.camera=surpriseState.camera}};
const surpriseItem=drawItem;
drawItem=function(i){if(i.kind==='waterBlaster'){const x=i.x-game.camera;shadow(x,i.y,10,.3);ctx.save();ctx.translate(x,i.y-(i.z||0));drawWaterGun(0,-9,WATER_GUN_WIDTH);ctx.restore();return}if(i.kind!=='surpriseObject')return surpriseItem(i);const x=i.x-game.camera,y=i.y-(i.z||0),s=surpriseState;if(!s)return;
 if(i.age<0){const side=i.dir===1?20:WIDTH-20;ctx.save();ctx.strokeStyle='#ffd98a';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(20,i.y);ctx.lineTo(WIDTH-20,i.y);ctx.stroke();if(i.type==='crystal'){ctx.fillStyle='#ffcf7a44';ctx.beginPath();ctx.ellipse(x,i.y,25,8,0,0,Math.PI*2);ctx.fill()}else arcadeChevron(side,i.y-6,5,i.age*3);ctx.restore();return}
 if(i.type==='cart')bonusArt(13,x,y,64);
 else if(i.type==='scooter'){shadow(x,i.y,24,.35);bonusArt((i.rider?0:4)+(hdPrefs.calm?0:Math.floor(i.age*10)%4),x,y,62,i.dir)}
 else if(i.type==='log'){shadow(x,i.y,20,.33);bonusArt(8+(hdPrefs.calm?0:Math.floor(i.age*9)%4),x,y,46,i.dir)}
 else if(i.type==='crystal'){shadow(x,i.y,13,.2);bonusArt(14,x,y,i.broken?17:30)}
 else if(i.type==='lantern'){shadow(x,i.y,7,.2);bonusArt(15,x,y,22);if(hdPrefs.lighting)hdGlow(x,y-10,18,15,'255,183,72',.15)}
 else if(i.type==='fly'){if(hdPrefs.lighting)hdGlow(x,y,10,10,'216,255,107',.25);ctx.fillStyle='#edff9a';ctx.beginPath();ctx.ellipse(x,y,3.5,2,Math.sin(i.age*8)*.4,0,Math.PI*2);ctx.fill()}
 else if(i.type==='water'){ctx.save();ctx.strokeStyle='#9ceaffdd';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-i.dir*15,y+Math.sin(i.age*30));ctx.quadraticCurveTo(x-i.dir*6,y-3,x,y);ctx.stroke();ctx.fillStyle='#e0fbff';ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();ctx.restore()}
};
const surpriseDraw=draw;
draw=function(){if(!surpriseState)return surpriseDraw();const items=game.items;game.items=[...items,...surpriseState.objects];try{return surpriseDraw()}finally{game.items=items}};
const waterHero=drawHeroFrame;
drawHeroFrame=function(p){const rig=p.carry?.kind==='waterBlaster'?waterIdleRig(p):null;if(!rig)return waterHero(p);const im=rig.image,sw=im.naturalWidth/4,sh=im.naturalHeight/6,h=rig.height,w=h*sw/sh;ctx.drawImage(im,rig.frame%4*sw,Math.floor(rig.frame/4)*sh,sw,sh,-w/2,-h*rig.anchor,w,h);drawRegisteredLoad(p,p.carry,rig)};
const surpriseHud=hud;
hud=function(){surpriseHud();const s=surpriseState;if(!s||!['play','pause'].includes(game.mode))return;arcadePlate(125,35,230,48,'#91e7ff');arcadeMetal(SURPRISE_TEXT[s.kind][0],240,45,10,212,'#c4f8ff');label(SURPRISE_TEXT[s.kind][1],240,60,5.7,'#ffe3a7','center');label(BONUS_SCORE+' '+s.points+'  ·  '+(s.t>=s.duration?BONUS_LAST:Math.ceil(s.duration-s.t)+'s'),240,76,7,'#ffd578','center');if(s.kind==='water')for(const [n,p]of game.players.entries())if(p.carry?.kind==='waterBlaster'){pixel(12+n*370,57,78,4,'#132b48');pixel(12+n*370,57,78*(p.waterTank||0)/8,4,'#75dcff')}};
const surpriseShow=show;
show=function(page){if(page==='home')cancelSurprise();surpriseShow(page);if(page==='pause'&&surpriseState){const holder=panel.querySelector('.menu-links')||panel.querySelector('.card');holder?.insertAdjacentHTML('beforeend',arcadeButton('bonus-skip',BONUS_SKIP,'resume'))}};
const surpriseGo=go;
go=function(name){if(name==='bonus-skip'&&game.mode==='pause'&&surpriseState){finishSurprise(true);show('play');return}return surpriseGo(name)};
const surpriseSound=renderEffect;
renderEffect=function(rig,out,name,at,hero=1){if(name==='waterJet'){noiseBurst(rig,out,at,.13,.10,2400);tone(rig,out,at,680,.08,.035,'sine',260);return}return surpriseSound(rig,out,name,at,hero)};
globalThis.DragonSurprises={version:'2.21',state:()=>surpriseState,start:startSurprise,finish:finishSurprise,cancel:cancelSurprise,drawGunAtHand:drawWaterGun,art:bonusArt,types:SURPRISE_TYPES};
