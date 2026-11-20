'use strict';
let chapterState=null,chapterSpawning=false,chapterReserved=new Set();
function chapterEvent(type,data={}){if(chapterState){chapterState.events.push({type,level:game.level,section:game.section,time:game.clock,...data});if(chapterState.events.length>200)chapterState.events.shift()}}
function chapterSay(text){townSpeech={name:STAGES[game.level].name,text,until:game.clock+2.6};game.districtTitle=0}
const chapterEnemyFactory=enemy;
function chapterNextType(){const roster=STAGES[game.level].foes;return roster.find(t=>!chapterState.seen.has(t)&&!chapterReserved.has(t))??roster[chapterState.cursor++%roster.length]}
enemy=function(type,x,y){if(chapterSpawning&&chapterState){type=chapterNextType();chapterReserved.add(type)}return chapterEnemyFactory(type,x,y)};
Object.assign(ITEM,{regionCrate:{width:35,hp:27}});
// Compact supply pockets beside loading/rest areas; no objects sprinkled at every gate.
stageItems=function(level){const out=[],kind='regionCrate';for(let d=0;d<4;d++){const x=d*DISTRICT_LENGTH;out.push(makeItem(kind,x+590,209,d%2?'energyFlask':'coinCache'),makeItem(kind,x+622,215,'healthGem'));if(d%2===0)out.push(makeItem(kind,x+1430,211,d===0?'club':'card'))}out.push(makeItem('club',170,226));for(const i of out)if(i.kind==='regionCrate')i.nativeLevel=level;return out};
const chapterBegin=beginStage;
beginStage=function(retry=false){chapterBegin(retry);chapterState={level:game.level,age:0,cursor:0,seen:new Set(),completed:new Set(),active:null,npcs:[],hazards:[],events:[],flags:{power:true,bridge:true,quiet:true},cold:0,alarm:0,endShown:false,wind:0};
 for(const d of townDoors)d.y=198;
 const keepDistrict=game.level===0||game.level===1||game.level===4?1:-1;
 townVendors=townVendors.filter(v=>v.district===keepDistrict);
 game.items=game.items.filter(i=>!['townStall','townVendor'].includes(i.kind)||i.district===keepDistrict);
 game.items=game.items.filter(i=>i.kind!=='layoutSupply'&&!(i.tag==='market-edge'&&keepDistrict<0)&&!(i.tag==='spring'&&game.level!==0)&&i.kind!=='chapterWatcher');
 for(const i of game.items)if(i.kind==='layoutFurniture'||i.kind==='layoutRoad')i.y=Math.max(198,i.y);
 if(game.level===5)for(let d=0;d<4;d++)for(const x of [240,1490])game.items.push({kind:'chapterWarmth',decor:true,x:d*DISTRICT_LENGTH+x,y:198,frame:14,w:40});
 if(game.level===1)for(const scene of directorScenes)if(scene?.vehicle)game.items.push({kind:'chapterBerth',decor:true,solid:true,blockW:80,blockH:8,x:scene.anchor,y:186},{kind:'chapterBerthRim',decor:true,x:scene.anchor,y:206},{kind:'chapterGangplank',decor:true,x:scene.anchor,y:207,scene});
 game.items=game.items.filter(i=>{const district=Math.floor(i.x/DISTRICT_LENGTH),local=i.x-district*DISTRICT_LENGTH;if(i.tag==='market-edge')return district===keepDistrict;if(i.tag==='rest-bench')return (game.level===0&&district%2===0&&local===700)||(game.level===1&&district===1&&local===1260)||(game.level===4&&district===1&&local===700);if(i.tag==='bench-lamp'||i.tag==='bench-planter')return game.level===0&&district%2===0&&Math.abs(local-700)<60;if(i.role==='snow-bench')return district%2===0&&local===700;if(i.tag==='native-ground-edge')return local<1000;return true});
 const details=[[0,2,3],[4,5,7],[8,9,10],[12,13],[14,12],[]][game.level];GROUND_DETAILS[game.level]=Array.from({length:4},(_,d)=>details.map((frame,n)=>({frame,x:d*DISTRICT_LENGTH+[480,1050,1550][n],y:frame===0||[4,5,8,9,10].includes(frame)?200:frame===14?230:245,w:frame===14?110:frame===7?58:frame===0?30:42,phase:d+n}))).flat();
 layoutObjects=layoutObjects.filter(i=>game.items.includes(i));roadCache[game.level]=layoutObjects.map(i=>({type:i.tag,x:i.x,y:i.y,w:i.w}));if(game.level===1)for(const scene of directorScenes)if(scene?.vehicle)scene.vehicle.visible=true;game.districtTitle=1.3;
};
const chapterEncounter=startEncounter;
startEncounter=function(){if(!chapterState)return chapterEncounter();const beat=CHAPTERS[game.level][game.section];if(beat.kind==='rest'){game.gate='open';game.timer=.45;game.enemies=[];game.hazards=[];chapterEvent('breather');if(game.section===14){const x=GATES[game.section]-90;game.items.push(makeItem('healthGem',x,230),makeItem('energyFlask',x+28,230))}return}
 chapterSpawning=beat.kind==='fight';chapterReserved=new Set();try{chapterEncounter()}finally{chapterSpawning=false}
 if(game.gate==='fight'){for(const e of game.enemies)if(!e.boss&&!e.rival||e.storyFoe)chapterState.seen.add(e.type);chapterEvent('fight-start',{kind:beat.kind});game.districtTitle=0;townSpeech=null}
};
const chapterGate=updateGate;
updateGate=function(living,dt){const section=game.section;chapterGate(living,dt);if(chapterState&&game.mode==='play'){chapterState.age+=dt;if(section!==game.section)chapterState.completed.add(section)}};
const chapterTown=updateTown;
updateTown=function(dt){townObservedSection=game.section;const walkers=townWalkers;townWalkers=[];try{chapterTown(dt)}finally{townWalkers=walkers}updateRegionalWalkers(dt);if(game.level===1)for(const s of directorScenes)if(s?.vehicle){s.vehicle.x=s.anchor;s.vehicle.visible=true;s.vehicle.depart=false;s.vehicle.departAge=0}};
const mooredChapterEnter=enterArena;
enterArena=function(e,dt){const r=e.entry;mooredChapterEnter(e,dt);if(r?.mode==='vehicle'&&r.scene.level===1&&r.started){const v=r.scene.vehicle;v.from=v.target=r.scene.anchor;v.x=r.scene.anchor;if(r.time>=1.75)r.scene.boardLowered=true;if(e.entry&&r.vehiclePhase==='ride')e.x=v.x+17;v.depart=false;v.departAge=0}};
globalThis.DragonCampaign={version:'2.8',order:CAMPAIGN_ORDER,chapters:CHAPTERS,state:()=>chapterState,loadForReview:loadChapterPack,startBeat:startEncounter};
// One-way, region-specific passers-by. Active routes are never repositioned on camera.
const REGION_ANIMALS=[[],[24],[26,27],[30,34],[38],[39,21]];
function updateRegionalWalkers(dt){if(game.mode!=='play')return;for(const w of townWalkers){const animals=REGION_ANIMALS[game.level];w.animalType=animals.length?animals[w.identity%animals.length]:null;if(!w.regional){w.regional=true;w.wait=4+(w.identity||0)*6+(w.crowdSheet||0)*4;w.active=false;w.direction=w.identity%2?-1:1;w.crowdSheet=0;w.identity=game.level===1?0:w.identity%2}
 if(!w.active){w.wait-=dt;if(w.wait<=0&&game.clock>=(chapterState.ambientNext||0)&&!townWalkers.some(o=>o!==w&&o.active)){w.active=true;w.x=w.direction>0?game.camera-55:game.camera+WIDTH+55;w.y=game.level===1?243:game.level===5?245:201;w.stride=0;w.flee=0;w.scaredOnce=false;chapterState.ambientNext=game.clock+12}continue}
 const near=game.players.some(p=>p.hp&&Math.abs(p.x-w.x)<72&&Math.abs(p.y-w.y)<35),fight=game.gate==='fight'&&game.enemies.some(e=>e.hp&&Math.abs(e.x-w.x)<120);if((near&&animals.length)||fight){if(!w.scaredOnce){const p=game.players.find(p=>p.hp&&Math.abs(p.x-w.x)<120);if(p)w.direction=Math.sign(w.x-p.x)||w.direction;w.scaredOnce=true}w.flee=2.4;}else w.flee=Math.max(0,(w.flee||0)-dt);const step=w.direction*(w.flee?animals.length?92:64:animals.length?40:29)*dt;w.walking=true;w.x+=step;w.stride+=Math.abs(step);if(w.x<game.camera-90||w.x>game.camera+WIDTH+90){w.active=false;w.wait=34+(w.identity||0)*11;chapterState.ambientNext=game.clock+8}
 }}
const regionalDrawItem=drawItem;
drawItem=function(i){if(i.kind==='townWalker'&&i.active&&i.animalType!==null&&i.animalType!==undefined){const im=images['foe-motion-'+i.animalType];if(!READY(im))return;const m=DRAGON_MOTION_META.foes[i.animalType],h=i.animalType===24?23:i.animalType===21?29:32,sw=im.naturalWidth/4,sh=im.naturalHeight/4,f=Math.floor(i.stride/5)%8,x=i.x-game.camera;shadow(x,i.y,7,.23);ctx.save();ctx.translate(x,i.y);ctx.scale(i.direction,1);ctx.drawImage(im,f%4*sw,Math.floor(f/4)*sh,sw,sh,-h*sw/sh*.5,-h*m.anchor,h*sw/sh,h);ctx.restore();return}regionalDrawItem(i)};

const regionContainerDraw=drawItem;
drawItem=function(i){if(i.kind!=='regionCrate')return regionContainerDraw(i);if(i.gone)return;const x=i.x-game.camera;shadow(x,i.y,11,.3);ctx.save();ctx.translate(x,i.y-(i.z||0));if(i.flight)ctx.rotate(i.flight.spin);directorProp(0,i.nativeLevel,0,0,35);ctx.restore()};
const regionCarryUnder=carryObjectUnderlay;
carryObjectUnderlay=function(p){if(p.carry?.kind!=='regionCrate')return regionCarryUnder(p);const m=DRAGON_CARRY_META[p.hero||p.id];directorProp(0,p.carry.nativeLevel,(.70-m.center)*m.height*m.aspect+7,(.55-m.anchor)*m.height,29)};
const regionCarried=drawCarried;
drawCarried=function(p,i){if(i.kind!=='regionCrate')return regionCarried(p,i);if(DragonCarry.uses(p))return;const [x,y,turn]=heldPropPose(p,false);ctx.save();ctx.translate(x*HERO_SCALE,y*HERO_SCALE);ctx.rotate(turn);directorProp(0,i.nativeLevel,0,4,29);ctx.restore()};
