'use strict';
const BOMBER_NAME=chapterText('Καλι-κροτίδα','Crackle Goblin','Гоблін-підривник');
const BOMBER_TIP=chapterText('Φύγε από τον κύκλο ή χτύπα τη βόμβα πίσω!','Leave the circle or hit the bomb back!','Вийдіть із кола або відбийте бомбу!');
const BOMBER_PROFILE={name:BOMBER_NAME,type:40,id:'bomber',approach:'anchor',form:'fan',range:146,tell:1.35,active:.40,rest:2.3,radius:38,speed:0,tip:BOMBER_TIP,shield:false};
const BOMBER_KIT={...FAIRY_KITS[24],name:BOMBER_NAME,range:146,armor:false,hover:0,moves:{signature:strike(BOMBER_NAME,'fan',1.35,.4,2.3,{lanes:[0],speed:0,radius:38,art:'bomb'})},phases:[['signature']]};
FOES.push([Math.round(FOES[36][0]*.9),42,FOES[36][2],'ranged']);FAIRY_KITS.push(BOMBER_KIT);FAIRY_NAMES.push(BOMBER_NAME);BRAWL_PROFILES.push(BOMBER_PROFILE);MOTION_FOES.add(40);DRAGON_MOTION_META.foes[40]={...DRAGON_MOTION_META.foes[36]};
for(const level of [0,1,3,4])STAGES[level].foes.splice(4,0,40);
const bomberFactory=enemy;
enemy=function(type,x,y){const explicit=type===40&&!chapterSpawning,e=bomberFactory(explicit?36:type,x,y);if(e.type!==40&&!explicit)return e;const rules=difficultyRules();Object.assign(e,{type:40,bomber:true,brawl:BOMBER_PROFILE,kit:BOMBER_KIT,guard:false,speed:42*rules.speed,size:FOES[40][2]});e.hp=e.maxHp=Math.round(FOES[40][0]*(game.two?1.16:1)*rules.enemyHealth);return e};
const bomberMotion=foeMotionFrame;
foeMotionFrame=function(e){if(e.bomber){if(e.act==='tell')return e.age<(e.move?.plan.tell||1.35)*.85?9:10;if(e.act==='attack')return e.age<.19?10:11;if(e.act==='recover')return e.age<.2?12:0}return bomberMotion(e)};
function bomberHand(e){const im=images['foe-motion-40'],m=DRAGON_MOTION_META.foes[40],h=e.size*1.72*m.scale,w=h*(READY(im)?im.naturalWidth/im.naturalHeight:1),frame=foeMotionFrame(e),out=frame===10;return {x:e.x+e.face*w*((out?.84:.75)-m.center),y:e.y,z:(e.z||0)+h*(m.anchor-(out?.49:.62)),h,w}}
function drawBombBody(x,y,r,lit=true){ctx.save();ctx.translate(x,y);const g=ctx.createRadialGradient(-r*.35,-r*.4,.2,0,0,r);g.addColorStop(0,'#82939c');g.addColorStop(.35,'#384350');g.addColorStop(1,'#101822');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#bec4bd';ctx.lineWidth=.45;ctx.stroke();ctx.fillStyle='#a37b4e';ctx.fillRect(-r*.28,-r-2,r*.56,2.5);if(lit){ctx.strokeStyle='#d8ad71';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,-r-1);ctx.quadraticCurveTo(4,-r-6,6,-r-3);ctx.stroke();ctx.fillStyle='#ffe49d';ctx.beginPath();ctx.arc(6,-r-3,1,0,Math.PI*2);ctx.fill()}ctx.restore()}
const bomberDraw=drawFoe;
drawFoe=function(e){bomberDraw(e);if(!e.bomber||!e.hp||e.entry&&!e.entry.started||e.x-game.camera<-90||e.x-game.camera>WIDTH+90)return;const h=bomberHand(e),x=e.x-game.camera,y=e.y-(e.z||0);ctx.save();ctx.translate(x,y);ctx.scale(e.face,1);ctx.strokeStyle='#77443b';ctx.lineWidth=2.3;ctx.beginPath();ctx.moveTo(-h.h*.11,-h.h*.43);ctx.lineTo(h.h*.12,-h.h*.21);ctx.stroke();drawBombBody(-h.h*.06,-h.h*.23,2.7,false);drawBombBody(h.h*.08,-h.h*.25,2.5,false);ctx.restore();
 if(e.act==='tell'){drawBombBody(h.x-game.camera,h.y-h.z,4.7,true);ctx.save();ctx.fillStyle='#e0ba7b';ctx.beginPath();ctx.ellipse(h.x-game.camera+e.face*2,h.y-h.z+3,1.7,.9,0,0,Math.PI*2);ctx.fill();ctx.restore()}
};
function throwArcadeBomb(e){const active=game.items.filter(i=>i.kind==='arcadeBomb'&&!i.gone&&!i.friendly).length;if(active>=(game.difficulty==='hard'?2:1))return;const spot=e.move.spots[0],h=bomberHand(e);game.items.push({kind:'arcadeBomb',decor:true,x:h.x,y:h.y,z:h.z,start:{x:h.x,y:h.y,z:h.z},target:{x:clamp(spot.x,game.camera+38,game.camera+WIDTH-38),y:clamp(spot.y,...DEPTH)},age:0,airTime:.68,fuse:game.difficulty==='easy'?2.2:game.difficulty==='hard'?1.45:1.8,groundAge:0,radius:38,owner:e,tick:0});effect('throw')}
const bomberLaunch=launchSpecial;
launchSpecial=function(e,move){if(e.bomber){throwArcadeBomb(e);return}bomberLaunch(e,move)};
function updateArcadeBombs(dt){
 for(const b of game.items.slice())if(b.kind==='arcadeBomb'&&!b.gone){b.age+=dt;
  if(!b.friendly&&!game.enemies.some(e=>e.hp&&!e.bossRetreat)){b.gone=true;arcadeBlasts.push({x:b.x,y:b.y,age:.12,life:.35,material:'metal',dust:true});continue}
  if(b.age<b.airTime){const t=b.age/b.airTime;b.x=mix(b.start.x,b.target.x,t);b.y=mix(b.start.y,b.target.y,t);b.z=b.start.z*(1-t)+Math.sin(t*Math.PI)*48;continue}
  b.x=b.target.x;b.y=b.target.y;b.groundAge=b.age-b.airTime;b.z=Math.max(0,Math.sin(Math.min(1,b.groundAge/.20)*Math.PI)*4);
  if(b.fuse-b.groundAge<.85){const tick=Math.floor(b.groundAge/.28);if(tick!==b.tick){b.tick=tick;effect('fuseTick')}}
  if(b.groundAge>=b.fuse){b.gone=true;arcadeExplosion(b.x,b.y,b.radius,b.owner,!!b.friendly)}
 }game.items=game.items.filter(i=>!i.gone);
}
function drawArcadeBomb(b){if(b.gone)return;const x=b.x-game.camera,warning=b.friendly?'#a8e4c4':'#f4ba7d',t=clamp(b.groundAge/b.fuse,0,1);ctx.save();ctx.strokeStyle=warning;ctx.lineWidth=.8;ctx.globalAlpha=.48;ctx.beginPath();ctx.ellipse(b.target.x-game.camera,b.target.y,b.radius,b.radius/1.8,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=.8;ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(b.target.x-game.camera,b.target.y,b.radius,b.radius/1.8,0,-Math.PI/2,-Math.PI/2+t*Math.PI*2);ctx.stroke();ctx.globalAlpha=1;shadow(x,b.y,5,.3);drawBombBody(x,b.y-b.z-5,5,true);if(t>.65&&hdPrefs.lighting){ctx.globalCompositeOperation='screen';hdGlow(x,b.y-b.z-5,8,8,'255,138,71',(hdPrefs.calm?.13:.10+.08*Math.sin(b.age*14)))}ctx.restore()}
const bombNightAtmosphere=hdAtmosphere;
hdAtmosphere=function(){bombNightAtmosphere();if(game.level!==0||cityDay().night<.2)return;ctx.save();ctx.strokeStyle='#ffcf8b';ctx.lineWidth=.9;for(const b of game.items)if(b.kind==='arcadeBomb'&&!b.gone){ctx.beginPath();ctx.ellipse(b.target.x-game.camera,b.target.y,b.radius,b.radius/1.8,0,0,Math.PI*2);ctx.stroke();if(hdPrefs.lighting)hdGlow(b.x-game.camera,b.y-b.z-8,7,7,'255,174,91',.22)}ctx.restore()};
const arcadeItemsUpdate=updateItems;
updateItems=function(dt){arcadeItemsUpdate(dt);updateDestruction(dt);updateArcadeBombs(dt)};
const arcadeStage=beginStage;
beginStage=function(retry=false){arcadeStage(retry);destructionSeed=0;arcadeBlasts.length=0;
 for(let d=0;d<4;d++)if([0,1,4].includes(game.level))game.items.push(makeItem('glassJar',d*DISTRICT_LENGTH+666,211,'energyFlask'));
 if([0,1,4].includes(game.level))game.items.push(makeItem('powderBarrel',DISTRICT_LENGTH+1080,213,'coinCache'));
 if(game.level===0)arrangeCityLights();
};
function arrangeCityLights(){
 // Stand on the rear curb. Clear furniture from each post and its road-facing cone.
 game.items=game.items.filter(i=>!(i.kind==='layoutRoad'&&i.frame===5));
 const halfOf=i=>i.w/2||ITEM[i.kind]?.width/2||20;
 const structural=game.items.filter(i=>i.kind?.startsWith('director')||i.kind?.startsWith('chapter'));
 const lamps=[];for(let d=0;d<4;d++)for(const offset of [360,850,1190,1480,1780]){
  const target=d*DISTRICT_LENGTH+offset,candidates=[target];for(let n=1;n<=15;n++)candidates.push(target-n*15,target+n*15);
  const x=candidates.find(x=>x>=d*DISTRICT_LENGTH+120&&x<=d*DISTRICT_LENGTH+1830&&lamps.every(l=>Math.abs(l.x-x)>=180)&&structural.every(i=>i.y<185||i.y>245||Math.abs(i.x-x)>=halfOf(i)+65))??target;
  lamps.push({kind:'layoutRoad',decor:true,solid:true,frame:5,x,y:198,w:53,h:96,tag:'clear-street-lamp',blockW:5,blockH:3});
 }
 const isMoveable=i=>['regionCrate','glassJar','powderBarrel','layoutFurniture','layoutRoad','townStall','townVendor'].includes(i.kind)&&!(i.kind==='layoutRoad'&&i.frame===5);
 for(const i of game.items)if(isMoveable(i)&&i.y>=185&&i.y<=245){const half=halfOf(i),l=lamps.find(l=>Math.abs(i.x-l.x)<half+64);if(!l)continue;
  const choices=[];for(let n=0;n<12;n++)for(const sign of [-1,1])choices.push(l.x+sign*(half+77+n*18));choices.sort((a,b)=>Math.abs(a-i.x)-Math.abs(b-i.x));
  const x=choices.find(x=>x>25&&x<WORLD-25&&lamps.every(l=>Math.abs(x-l.x)>=half+65)&&game.items.every(o=>o===i||o.kind==='townWalker'||Math.abs(o.y-i.y)>12||Math.abs(o.x-x)>=half+halfOf(o)+5));
  if(x!==undefined){i.x=x;if(i.kind==='townStall'){const vendor=townVendors.find(v=>v.district===i.district);if(vendor){vendor.x=i.x-4;vendor.y=202}}}
 }
 GROUND_DETAILS[0]=GROUND_DETAILS[0].filter(i=>!lamps.some(l=>Math.abs(i.x-l.x)<i.w/2+58));
 game.items.push(...lamps);layoutObjects=game.items.filter(i=>i.kind?.startsWith('layout'));roadCache[0]=layoutObjects.map(i=>({type:i.tag,x:i.x,y:i.y,w:i.w}));
}
Object.assign(DragonCampaign.destruction,{bombs:updateArcadeBombs,throwBomb:throwArcadeBomb,bomber:BOMBER_PROFILE,lamps:arrangeCityLights});
function reviewDestruction(mode,time){
 game.sound=false;game.level=0;game.camera=0;game.districtTitle=0;game.hazards=[];game.shots=[];game.particles=[];familyEffects.length=0;arcadeBlasts.length=0;game.items=[];townSpeech=null;
 const h=Object.assign(player(1),{x:90,y:230,inv:0});game.players=[h];game.enemies=[];game.gate='fight';destructionSeed=0;
 if(mode===4){const e=enemy(40,145,230);game.enemies=[e];h.x=300;startSpecial(e,[h],h);e.act='attack';e.age=0;launchSpecial(e,e.move);h.x=90}
 else{const kind=['regionCrate','glassJar','amphora','powderBarrel'][mode],i=makeItem(kind,260,230,'coinCache');i.nativeLevel=0;game.items.push(i);breakItem(i)}
 const ticks=Math.ceil(time/.016);for(let n=0;n<ticks;n++)updateItems(time/ticks);draw();
}
Object.assign(DragonCampaign.destruction,{review:reviewDestruction});
