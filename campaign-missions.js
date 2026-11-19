'use strict';
Object.assign(ITEM,{chapterProp:{width:64},chapterNPC:{width:58},chapterParcel:{width:29,hp:1},chapterRune:{width:36},chapterWarmth:{width:42}});
let chapterState=null,chapterSpawning=false,chapterReserved=new Set();
const CHAPTER_GUARD_HINT=chapterText('Ο φύλακας διαφωνεί με την αποφυλάκιση. Πείσε τον πρώτα!','The guard objects to the release. Persuade them first!','Вартовий проти звільнення. Спершу переконайте його!');
const CHAPTER_ORDER_HINT=chapterText('Ωραίο σύμβολο. Η σειρά όμως είναι εκεί πάνω — ούτε ο Gruffy δεν διαβάζει ανάποδα!','Lovely symbol. The order is up there — even Gruffy reads it forwards!','Гарний символ. Порядок угорі — навіть Ґраффі не читає навпаки!');
function chapterEvent(type,data={}){if(!chapterState)return;chapterState.events.push({type,level:game.level,section:game.section,time:game.clock,...data});if(chapterState.events.length>200)chapterState.events.shift()}
function chapterSay(text){townSpeech={name:STAGES[game.level].name,text,until:game.clock+Math.max(4,text.length*.055)};game.districtTitle=0}
function chapterNextType(){const roster=STAGES[game.level].foes;return roster.find(t=>!chapterState.seen.has(t)&&!chapterReserved.has(t))??roster[chapterState.cursor++%roster.length]}
const chapterEnemyFactory=enemy;
enemy=function(type,x,y){if(chapterSpawning&&chapterState){type=chapterNextType();chapterReserved.add(type)}return chapterEnemyFactory(type,x,y)};
function chapterGuard(side='right',delay=.3,type=null){const t=type??chapterNextType(),e=chapterEnemyFactory(t,game.camera+(side==='right'?WIDTH+40:-40),218+(chapterState.cursor++%3)*10);chapterState.seen.add(t);queueEntrance(e,side,delay,game.camera+(side==='right'?WIDTH-75:80));game.enemies.push(e);return e}
function chapterNpc(x,y){const n={kind:'chapterNPC',decor:true,x,y,stride:0,walking:false,face:1,age:0,sheet:[0,0,1,2,2,1][game.level],identity:[0,0,1,1,1,0][game.level],friendlyType:game.level===0?30:game.level===5?39:undefined};chapterState.npcs.push(n);game.items.push(n);return n}
const chapterBegin=beginStage;
beginStage=function(retry=false){
 chapterBegin(retry);chapterState={level:game.level,age:0,cursor:0,seen:new Set(),completed:new Set(Array.from({length:game.section},(_,i)=>i)),active:null,npcs:[],hazards:[],events:[],flags:{power:game.section>6,bridge:game.section>6,quiet:game.section>2},cold:0,alarm:0,endShown:false,wind:0};
 for(const s of directorScenes)if(s&&DIRECTOR_PLAN[game.level][s.section]==='quiet')game.items=game.items.filter(i=>i.scene!==s);
 // Warm islands are actual supported fixtures, not invisible cold-meter resets.
 if(game.level===5)for(let d=0;d<4;d++)for(const offset of [240,870,1490])game.items.push({kind:'chapterWarmth',decor:true,x:d*DISTRICT_LENGTH+offset,y:196,frame:14,w:45});
 if(game.level===1)for(const scene of directorScenes)if(scene?.vehicle)game.items.push({kind:'chapterBerth',decor:true,solid:true,blockW:80,blockH:8,x:scene.anchor,y:186},{kind:'chapterBerthRim',decor:true,x:scene.anchor,y:206},{kind:'chapterGangplank',decor:true,x:scene.anchor,y:207,scene});game.districtTitle=1.4;
};
function chapterStartMission(beat){
 const x=GATES[game.section]-85,m={...beat,x,y:228,age:0,progress:0,order:[0,1,2],index:0,waves:0,read:false,helpAt:-10};
 chapterState.active=m;game.arenaCamera=game.camera;game.gate='fight';game.timer=0;game.enemies=[];game.hazards=[];game.shots=[];encounterDirector=null;
 if(beat.kind==='rescue'){m.cage={kind:'chapterProp',role:'cage',decor:true,solid:true,blockW:30,blockH:5,x,y:223,renderY:225,w:110,frame:6,open:0,scene:m};m.npc=chapterNpc(x,225);m.npc.drawSize=60;const im=images['cage-components'],meta=DRAGON_CAMPAIGN_META.cage;m.insideFloor=225+m.cage.w*im.naturalHeight/(im.naturalWidth/2)*(.85-meta.anchor);m.npc.renderY=m.insideFloor;game.items.push(m.cage,{kind:'chapterProp',decor:true,role:'cage-front',x,y:225.1,w:110,scene:m});chapterGuard()}
 if(beat.kind==='carry'){
  const frame=[0,4,9,10,13,15][game.level];m.parcel={...makeItem('chapterParcel',x-55,232),quest:m,frame};m.target={kind:'chapterProp',decor:true,role:'receiver',x:x+65,y:224,w:50,frame:[2,5,8,11,1,14][game.level],scene:m};if(game.level===2){m.target.art='forest-root';m.target.frame=5}game.items.push(m.parcel,m.target);
 }
 if(beat.kind==='defend'){m.duration=(game.difficulty==='easy'?6:game.difficulty==='hard'?10:8);m.station={kind:'chapterProp',decor:true,x,y:223,w:49,frame:[2,5,8,11,12,14][game.level],scene:m};game.items.push(m.station);chapterGuard('right');m.waves=1}
 if(beat.kind==='escort'){m.npc=chapterNpc(x-75,232);m.goal=x+65;m.lastX=m.npc.x;chapterGuard('left',.6);chapterGuard('right',1.0)}
 if(beat.kind==='chase'){m.runner=chapterGuard('right',0,[26,23,30,38,38,39][game.level]);m.runner.entry=null;m.runner.x=x-5;m.runner.y=224;m.runner.hp=m.runner.maxHp=game.difficulty==='hard'?66:48;m.runner.chapterRunner=true;m.goal=GATES[game.section]+115;game.gate='travel';game.arenaCamera=null}
 if(beat.kind==='sequence'){if(game.section>6)m.order=[2,0,1];m.pads=[0,1,2].map((r,i)=>({kind:'chapterRune',decor:true,x:x-62+i*62,y:227,w:36,rune:r,on:false,frame:game.level===3?11:game.level===2?8:game.level===5?14:1,scene:m}));game.items.push(...m.pads)}
 if(beat.kind==='read'){m.plaque={kind:'chapterProp',decor:true,x,y:225,w:47,frame:game.level===3?11:13,scene:m};game.items.push(m.plaque)}
 if(beat.kind==='rest'){game.items.push(makeItem('healthGem',x-24,233),makeItem('energyFlask',x+25,233))}
 chapterSay(beat.title+(CHAPTER_HINTS[beat.kind]?' · '+CHAPTER_HINTS[beat.kind]:''));chapterEvent('mission-start',{kind:beat.kind});
}
const chapterEncounter=startEncounter;
startEncounter=function(){
 if(!chapterState||chapterState.level!==game.level)return chapterEncounter();if(chapterState.active)return;
 const beat=CHAPTERS[game.level][game.section];if(!['fight','rival','boss'].includes(beat.kind)){if(GATES[game.section]+10>game.camera+WIDTH-10)return;chapterStartMission(beat);return}
 chapterSpawning=true;chapterReserved=new Set();try{chapterEncounter()}finally{chapterSpawning=false}
 if(game.gate==='fight'){for(const e of game.enemies)if(!e.boss&&!e.rival||e.storyFoe)chapterState.seen.add(e.type);chapterSay(beat.title);chapterEvent('fight-start',{kind:beat.kind});if(game.level===4&&chapterState.alarm>.8&&beat.kind==='fight'){const e=chapterGuard('left',1.4),d=encounterDirector;if(d){e.entry.released=false;(d.groups[d.groups.length]||=[]).push(e)}chapterState.alarm=.3}}
};
function chapterFinish(){const m=chapterState.active;if(!m)return;chapterState.completed.add(m.section);chapterEvent('mission-complete',{kind:m.kind});
 if(m.kind==='defend'||m.kind==='carry'){chapterState.flags.power=true;chapterState.flags.bridge=true;if(game.level===4)chapterState.alarm=Math.max(0,chapterState.alarm-.5)}
 if(m.kind==='sequence'&&game.level===4){chapterState.flags.quiet=true;chapterState.alarm=0}
 if(m.npc){delete m.npc.renderY;m.npc.walking=true;m.npc.exitTo=game.camera-75;m.npc.released=true}
 if(m.parcel){game.items=game.items.filter(i=>i!==m.parcel);for(const p of game.players){if(p.carry===m.parcel)p.carry=null;if(p.toss===m.parcel)p.toss=null}}
 if(m.target)m.target.powered=true;if(m.station)m.station.powered=true;
 chapterState.active=null;game.gate='open';game.timer=.8;game.hazards=[];game.shots=[];effect('gate');
}
function chapterAllGuardsGone(){return game.enemies.every(e=>e.hp<=0)}
function chapterNear(p,target,r=34){return Math.hypot(p.x-target.x,(p.y-target.y)*1.15)<r&&p.z<12}
function chapterUse(p){
 const m=chapterState?.active;if(!m||MOVE_TIME[p.act]||p.z>11)return false;
 if(m.kind==='rescue'&&chapterNear(p,m.cage,60)){
  if(!chapterAllGuardsGone()){chapterSay(CHAPTER_GUARD_HINT);return true}
  if(m.openAge===undefined){m.openAge=0;m.cage.solid=false;effect('pickup');chapterEvent('cage-open')}return true;
 }
 if(m.kind==='carry'&&p.carry===m.parcel&&chapterNear(p,m.target,43)){m.delivered=true;chapterFinish();return true}
 if(m.kind==='read'&&chapterNear(p,m.plaque,45)){m.read=true;chapterSay(CHAPTER_CLUES[game.level]);effect('pickup');return true}
 if(m.kind==='sequence'){
  const pad=m.pads.find(q=>chapterNear(p,q,29));if(!pad)return false;
  if(pad.rune===m.order[m.index]){pad.on=true;m.index++;effect('pickup');chapterEvent('rune',{index:m.index});if(m.index===3)chapterFinish()}
  else if(game.clock-m.helpAt>1.2){m.helpAt=game.clock;chapterSay(CHAPTER_ORDER_HINT);chapterEvent('wrong-rune')}return true;
 }
 return false;
}
const chapterPickup=pickupAction;
pickupAction=function(p){if(chapterUse(p))return;chapterPickup(p)};
const chapterBreak=breakItem;
breakItem=function(i){if(i.kind==='chapterParcel'){i.gone=false;i.hp=1;i.flight=null;i.z=0;i.x=clamp(i.x,game.camera+25,game.camera+WIDTH-25);return}chapterBreak(i)};
const chapterUnderlay=carryObjectUnderlay;
carryObjectUnderlay=function(p){if(p.carry?.kind!=='chapterParcel')return chapterUnderlay(p);const meta=DRAGON_CARRY_META[p.hero||p.id],x=(.70-meta.center)*meta.height*meta.aspect,y=(.55-meta.anchor)*meta.height;chapterProp(p.carry.frame,x+7,y,29)};
const chapterCarried=drawCarried;
drawCarried=function(p,i){if(i.kind!=='chapterParcel')return chapterCarried(p,i);if(DragonCarry.uses(p))return;const [x,y,turn]=heldPropPose(p,false);ctx.save();ctx.translate(x*HERO_SCALE,y*HERO_SCALE);ctx.rotate(turn);chapterProp(i.frame,0,4,29);ctx.restore()};
function updateChapterMission(dt,living){
 const s=chapterState;if(!s||game.mode!=='play')return;s.age+=dt;
 for(const n of s.npcs){n.age+=dt;if(n.released){const dx=n.exitTo-n.x;if(Math.abs(dx)>2){const move=Math.sign(dx)*Math.min(Math.abs(dx),35*dt);n.x+=move;n.stride+=Math.abs(move);n.face=Math.sign(dx);n.walking=true}else n.gone=true}}
 const m=s.active;if(!m)return;m.age+=dt;
 for(const w of townWalkers)if(s.npcs.some(n=>!n.gone&&n.sheet===w.crowdSheet&&n.identity===w.identity&&Math.abs(n.x-w.x)<WIDTH)){w.active=false;w.wait=8}
 if(m.kind==='rescue'&&m.openAge!==undefined){m.openAge+=dt;m.cage.open=clamp(m.openAge/.65,0,1);if(m.openAge>.65){const t=clamp((m.openAge-.65)/1.1,0,1),x=m.npc.x,y=m.npc.y;m.npc.x=m.x-40*t;m.npc.y=225+13*t;m.npc.renderY=m.insideFloor+(238-m.insideFloor)*t;m.npc.stride+=Math.hypot(m.npc.x-x,m.npc.y-y);m.npc.face=-1;m.npc.walking=t<1;if(t>=1&&m.openAge>2.2)chapterFinish()}}
 if(m.kind==='carry'&&game.items.includes(m.parcel)&&!m.parcel.flight&&m.parcel.z<=0&&chapterNear({x:m.parcel.x,y:m.parcel.y,z:0},m.target,25)){m.delivered=true;chapterFinish()}
 if(m.kind==='defend'){
  const count=living.filter(p=>Math.hypot(p.x-m.x,(p.y-m.y)*3.5)<43&&p.z<12&&!['hit','respawn'].includes(p.act)).length;m.progress=Math.min(1,m.progress+dt/m.duration*Math.min(1.35,count));
  if(m.progress>.38&&m.waves===1){chapterGuard('left',.5);m.waves++}if(m.progress>.75&&m.waves===2){chapterGuard('right',.6);m.waves++}if(m.progress>=1&&chapterAllGuardsGone())chapterFinish();
 }
 if(m.kind==='escort'){
  const near=living.some(p=>Math.hypot(p.x-m.npc.x,(p.y-m.npc.y)*1.2)<80),danger=game.enemies.some(e=>e.hp&&!e.entry&&['attack','tell'].includes(e.act)&&Math.abs(e.x-m.npc.x)<29);m.npc.walking=near&&!danger&&m.npc.x<m.goal;
  if(m.npc.walking){const move=Math.min(m.goal-m.npc.x,38*dt);m.npc.x+=move;m.npc.stride+=move;m.npc.face=1}m.progress=clamp((m.npc.x-(m.x-75))/140,0,1);if(m.progress>=1&&chapterAllGuardsGone())chapterFinish();
 }
 if(m.kind==='chase'&&!m.runner.hp&&chapterAllGuardsGone()){chapterSay(CHAPTER_CLUES[game.level]);chapterFinish()}
 if(m.kind==='read'&&m.read)chapterFinish();
 if(['event','rest'].includes(m.kind)&&m.age>1.8)chapterFinish();
}
const chapterEnemyUpdate=updateEnemy;
updateEnemy=function(e,dt,living){const m=chapterState?.active;if(e.chapterRunner&&e.hp&&m?.kind==='chase'){
 e.age+=dt;e.phase+=dt;if(e.act==='hit'&&e.age<.22)return;e.face=1;const before=e.x;e.x=Math.min(m.goal,e.x+(game.difficulty==='easy'?65:77)*dt,game.camera+WIDTH-48);e.stride=(e.stride||0)+Math.abs(e.x-before);pose(e,e.x<m.goal?'walk':'idle');
 if(e.x>=m.goal-1&&!m.calledHelp){m.calledHelp=true;chapterGuard('left',.2);chapterGuard('right',.8);chapterEvent('courier-called-help')}return;
 }chapterEnemyUpdate(e,dt,living)};
const chapterGate=updateGate;
updateGate=function(living,dt){if(chapterState?.active){updateDirector(dt);updateChapterMission(dt,living);return}const section=game.section;chapterGate(living,dt);if(chapterState&&game.mode==='play'){if(game.section!==section){chapterState.completed.add(section);chapterEvent('beat-clear',{section})}updateChapterMission(dt,living)}};
const chapterTown=updateTown;
updateTown=function(dt){townObservedSection=game.section;chapterTown(dt);if(game.level===1)for(const s of directorScenes)if(s?.vehicle){s.vehicle.x=s.anchor;s.vehicle.visible=true;s.vehicle.depart=false;s.vehicle.departAge=0}};
globalThis.DragonCampaign={version:'2.7',order:CAMPAIGN_ORDER,chapters:CHAPTERS,state:()=>chapterState,loadForReview:loadChapterPack,startBeat:startEncounter,use:chapterUse,finish:chapterFinish};

const mooredChapterEnter=enterArena;
enterArena=function(e,dt){const r=e.entry;mooredChapterEnter(e,dt);if(r?.mode==='vehicle'&&r.scene.level===1&&r.started){const v=r.scene.vehicle;v.from=v.target=r.scene.anchor;v.x=r.scene.anchor;if(r.time>=1.75)r.scene.boardLowered=true;if(e.entry&&r.vehiclePhase==='ride')e.x=v.x+17;v.depart=false;v.departAge=0}};
