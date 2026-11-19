'use strict';
// Authored arrivals + small cohorts. Difficulty still owns health, damage and tell times.
const DIRECTOR_TYPES=[0,3,6,11,12];
const DIRECTOR_PLAN=[
 ['door','work','rope','cover','door','vehicle','work','rival','door','cover','vehicle','rope','door','work','cover','boss'],
 ['door','vehicle','work','rope','door','cover','vehicle','rival','door','rope','cover','work','door','vehicle','cover','boss'],
 ['door','rope','cover','work','door','vehicle','rope','rival','door','work','vehicle','cover','door','rope','work','boss'],
 ['door','cover','work','vehicle','door','rope','cover','rival','door','vehicle','rope','work','door','cover','vehicle','boss'],
 ['door','work','vehicle','cover','door','rope','work','rival','door','cover','rope','vehicle','door','work','cover','boss']
];
const DIRECTOR_CAPTIONS=[
 {door:'Από το συνεργείο ακούστηκε ένα συνθηματικό.',work:'Ο σκουπιστής σας είδε. Η σκούπα μάλλον θα περιμένει!',rope:'Κοιτάξτε ψηλά: κάτι κατεβαίνει από τη σκαλωσιά.',cover:'Αυτό το μπαούλο δεν ήταν και τόσο άδειο...',vehicle:'Ανοιχτό φορτηγάκι στο σοκάκι. Έφερε παρέα!'},
 {door:'Οι αποθήκες ανοίγουν. Οι πειρατές φυλάνε το πέρασμα.',work:'Τέλος το σφουγγάρισμα. Ο πειρατής έχει άλλες δουλειές!',rope:'Προσοχή στο γερανάκι της προκυμαίας!',cover:'Κάποιος κρύβεται μέσα στο βαρέλι.',vehicle:'Το καρότσι του φορτίου φέρνει ενισχύσεις.'},
 {door:'Η πέτρινη πύλη κρύβει τους φύλακες του δάσους.',work:'Ο μικρός δράκος άφησε το πότισμα στη μέση.',rope:'Ένας φύλακας γλιστράει από το κλαδί με την κληματσίδα.',cover:'Ο κούφιος κορμός μόλις κουνήθηκε!',vehicle:'Μαγικό καρότσι: οι ρόδες γυρίζουν χωρίς άλογο.'},
 {door:'Η παλιά πύλη ανοίγει για τους πέτρινους φύλακες.',work:'Ο λιθοξόος σταμάτησε το γυάλισμα. Σας παρακολουθεί.',rope:'Κάθοδος από την αρχαία αψίδα. Αφήστε χώρο!',cover:'Αυτό το πιθάρι έκρυβε κάτι μεγαλύτερο από λάδι.',vehicle:'Το πέτρινο βαγονάκι κουβαλάει απρόσμενο φορτίο.'},
 {door:'Οι βοηθοί του Gruffy ανοίγουν την πύλη.',work:'Η μάγισσα έκλεισε το βιβλίο. Τώρα κοιτάζει εσάς.',rope:'Κάποιος κατεβαίνει πίσω από το μοβ παραπέτασμα.',cover:'Το μπαούλο των βιβλίων είχε έναν ακόμη αναγνώστη.',vehicle:'Το καρότσι της βιβλιοθήκης φέρνει ζωντανό φορτίο.'}
];
Object.assign(ITEM,{directorTask:{width:40},directorCover:{width:62,hp:25},directorGantry:{width:148},directorVehicle:{width:140},directorStation:{width:40},directorTool:{width:24}});
let directorScenes=[],encounterDirector=null,directorSeen=new Set();
const directorEvents=[];
function directorEvent(type,data={}){directorEvents.push({type,level:game.level,section:game.section,time:game.clock,...data});if(directorEvents.length>250)directorEvents.shift()}
function directorMeta(level){return globalThis.DRAGON_DIRECTOR_META?.life?.[level]||{scale:1.6,anchor:.95,center:.5,headY:.25}}
function directorPropMeta(level,frame){return globalThis.DRAGON_DIRECTOR_META?.props?.[level]?.[frame]||{anchor:.94,center:.5}}
function directorHeight(e){return e.size*directorMeta(e.directorLife??game.level).scale}
function directorProp(frame,level,x,y,w){const im=images['director-props-'+level];if(!READY(im))return;const sw=im.naturalWidth/4,sh=im.naturalHeight/2,m=directorPropMeta(level,frame),h=w*sh/sw;ctx.drawImage(im,frame%4*sw,Math.floor(frame/4)*sh,sw,sh,x-w*m.center,y-h*m.anchor,w,h)}
function directorLife(e,frame){const level=e.directorLife??game.level,im=images['director-life-'+level];if(!READY(im))return;if(frame===6&&level<2)frame=7;const sw=im.naturalWidth/4,sh=im.naturalHeight/4,m=directorMeta(level),h=directorHeight(e),w=h*sw/sh,x=e.x-game.camera,y=e.y-(e.z||0);ctx.save();ctx.translate(x,y);ctx.scale(e.face||-1,1);if(e.hurt>0||e.act==='hit')ctx.filter='brightness(1.25)';ctx.drawImage(im,frame%4*sw,Math.floor(frame/4)*sh,sw,sh,-w*m.center,-h*m.anchor,w,h);ctx.restore()}
function populateDirector(){
 directorScenes=[];encounterDirector=null;directorSeen=new Set();directorEvents.length=0;
 for(let section=Math.floor(game.entry/DISTRICT_LENGTH)*4;section<16;section++){
  const kind=DIRECTOR_PLAN[game.level][section],anchor=GATES[section]-105,scene={kind,section,anchor,lane:225,phase:'quiet',clock:0,completed:false,level:game.level};directorScenes[section]=scene;
  if(['work','rope','cover','vehicle'].includes(kind)){const actor=enemy(DIRECTOR_TYPES[game.level],anchor,scene.lane);Object.assign(actor,{directorLife:game.level,face:-1,taskAge:section*.31,act:'work',stride:0});scene.actor=actor}
  if(kind==='work'){scene.task={kind:'directorTask',decor:true,solid:true,blockW:12,blockH:4,x:anchor,y:scene.lane,scene};game.items.push(scene.task,{kind:'directorStation',decor:true,x:anchor-23,y:scene.lane+2,scene})}
  if(kind==='rope'){scene.gantry={kind:'directorGantry',decor:true,x:anchor,y:187,scene};game.items.push(scene.gantry)}
  if(kind==='cover'){scene.cover={kind:'directorCover',decor:true,solid:true,blockW:24,blockH:5,x:anchor,y:scene.lane,hp:25,open:0,scene};game.items.push(scene.cover)}
  if(kind==='vehicle'){scene.vehicle={kind:'directorVehicle',decor:true,x:anchor,y:187,scene,visible:false,stride:0,depart:false};game.items.push(scene.vehicle)}
 }
}
const directorStage=beginStage;
beginStage=function(retry=false){directorStage(retry);populateDirector()};
function releaseDirectorWave(d,index){d.wave=index;d.waveAge=0;d.clearAge=0;for(const e of d.groups[index]){e.entry.released=true;e.entry.delay=Math.max(.08,e.entry.delay);e.cooldown=Math.max(e.cooldown,.65)}directorEvent('wave-release',{wave:index,total:d.groups.length,kind:d.scene.kind});if(index>0)effect('warning')}
const directorEncounter=startEncounter;
startEncounter=function(){
 const scene=directorScenes[game.section];
 if(scene&&['work','rope','cover'].includes(scene.kind)&&scene.anchor+70>game.camera+WIDTH)return;
 directorEncounter();
 for(const e of game.enemies)if(e.entry){e.entry.goalX=clamp(e.entry.goalX,game.camera+64,game.camera+WIDTH-64);if(e.entry.door)e.entry.targetX=e.entry.goalX}
 if(!scene||['boss','rival'].includes(scene.kind)){encounterDirector=null;return}
 if(scene.actor){const source=game.enemies[0],e=scene.actor;e.entry={...source.entry};e.guard=source.guard;e.hp=e.maxHp=Math.max(e.maxHp,source.maxHp);game.enemies[0]=e;scene.promoted=true;if(scene.task)game.items=game.items.filter(i=>i!==scene.task)}
 const groups=[];
 for(const [i,e]of game.enemies.entries()){const group=Math.floor(i/2);(groups[group]||=[]).push(e);e.directorWave=group;e.entry.wait=false;e.entry.released=false;if(i===0&&scene.actor){Object.assign(e.entry,{mode:scene.kind,scene,delay:.32,exposed:false});delete e.entry.door;e.entry.goalX=scene.anchor}}
 encounterDirector={scene,groups,wave:0,waveAge:0,clearAge:0,aidUsed:false,pressure:0};scene.phase='alarmed';scene.clock=0;
 if(!directorSeen.has(scene.kind)){directorSeen.add(scene.kind);townSpeech={name:STAGES[game.level].name,text:DIRECTOR_CAPTIONS[game.level][scene.kind],until:game.clock+5.2}}
 releaseDirectorWave(encounterDirector,0);
};
function dropDirectorTool(scene){if(scene.toolDropped)return;scene.toolDropped=true;const size=[14,16,13,11,13][scene.level],p=scene.actor;game.items.push({kind:'directorTool',decor:true,x:p.x+p.face*12,y:p.y+2,z:12,vz:0,vx:p.face*13,spin:0,size,scene});effect('pickup');directorEvent('tool-release',{kind:scene.kind})}
function finishDirectorEntry(e,r){e.z=0;e.reinforcement=false;e.entry=null;e.directorLife=null;e.cooldown=Math.max(e.cooldown,.75*difficultyRules().rest);pose(e,'idle');r.scene.phase='engaged';if(r.mode==='vehicle'){r.scene.vehicle.depart=true;r.scene.vehicle.departAge=0}directorEvent('arrival-complete',{kind:r.mode})}
const directorEnter=enterArena;
enterArena=function(e,dt){
 const r=e.entry;if(r?.released===false)return;
 if(!r?.mode)return directorEnter(e,dt);
 r.delay-=dt;if(r.delay>0)return;
 if(!r.started){r.started=true;r.time=0;r.scene.phase='arrival';e.x=r.scene.anchor;e.y=r.scene.lane;e.z=0;e.face=(game.players.find(p=>p.hp)?.x||e.x-1)<e.x?-1:1;pose(e,'arrival');if(r.mode==='vehicle'){const v=r.scene.vehicle;v.visible=true;v.from=game.camera+WIDTH+100;v.target=clamp(r.scene.anchor,game.camera+150,game.camera+WIDTH-85);v.x=v.from;v.y=187;r.rideY=0}directorEvent('arrival-start',{kind:r.mode})}
 r.time+=dt;const t=r.time,s=r.scene;
 if(r.mode==='work'){if(t>=.40)dropDirectorTool(s);r.exposed=true;if(t>=.72)finishDirectorEntry(e,r);return}
 if(r.mode==='rope'){
  if(t<.58){e.z=195;r.exposed=false;return}
  const pm=directorPropMeta(s.level,7),beam=s.gantry.y-148*pm.anchor+148*[.18,.30,.18,.27,.25][s.level],startZ=Math.max(45,e.y-beam-directorHeight(e)*.95-4),fall=t-.58;e.z=Math.max(0,startZ-58*fall-105*fall*fall);r.exposed=e.z<50;
  if(!e.z){r.landedAt??=t;if(t-r.landedAt<.25){if(!r.landingEffect){r.landingEffect=true;impact(e.x,e.y,'landing',e.face,1.1);effect('land')}return}finishDirectorEntry(e,r)}return;
 }
 if(r.mode==='cover'){
  const p=clamp((t-.32)/.76,0,1);s.cover.open=clamp((t-.16)/.42,0,1);e.x=s.anchor+e.face*34*p;e.y=s.lane-9+24*p;e.z=Math.sin(p*Math.PI)*24;r.progress=p;r.exposed=p>.12;if(p>=1)finishDirectorEntry(e,r);return;
 }
 if(r.mode==='vehicle'){
  const v=s.vehicle,p=clamp(t/1.55,0,1),before=v.x;v.x=mix(v.from,v.target,1-Math.pow(1-p,3));v.stride+=Math.abs(v.x-before);e.x=v.x+17;
  const m=globalThis.DRAGON_DIRECTOR_META?.cargo?.[s.level]||{top:.28,height:.43},pm=directorPropMeta(s.level,3),apertureY=v.y-140*pm.anchor+140*m.top,headY=directorMeta(s.level).headY||.25;
  const rideY=apertureY+140*m.height*.48+directorHeight(e)*(directorMeta(s.level).anchor-headY);e.y=rideY;e.z=0;r.rideY=rideY;
  if(t<1.75){r.exposed=false;r.vehiclePhase='ride';return}
  const hop=clamp((t-1.75)/.74,0,1);r.vehiclePhase='hop';r.progress=hop;r.exposed=hop>.2;e.x=mix(v.target+17,v.target-35,hop);e.y=mix(rideY,s.lane+7,hop);e.z=Math.sin(hop*Math.PI)*21;if(hop>=1)finishDirectorEntry(e,r);
 }
};
const directorCanHit=canHitEnemy;
canHitEnemy=function(e,z){if(e.entry?.released===false||e.entry?.mode&&e.entry.exposed===false)return false;return directorCanHit(e,z)};
function directorFrame(e){const r=e.entry;if(!r?.mode)return null;const t=r.time||0;if(r.mode==='work')return t<.20?4:t<.40?5:t<.57?6:7;if(r.mode==='rope')return t<.58?-1:e.z>70?8:e.z>28?9:e.z>0?10:(t-(r.landedAt||t))<.14?11:12;return (r.progress||0)<.18?13:(r.progress||0)<.78?14:15}
function cargoBox(v){const m=globalThis.DRAGON_DIRECTOR_META?.cargo?.[v.scene.level]||{left:.34,top:.28,width:.53,height:.43},p=directorPropMeta(v.scene.level,3);return {x:v.x-game.camera-140*p.center+140*m.left,y:v.y-140*p.anchor+140*m.top,w:140*m.width,h:140*m.height}}
const directorDrawFoe=drawFoe;
drawFoe=function(e){
 if(!e.hp)return directorDrawFoe(e);const r=e.entry;if(!r?.mode)return directorDrawFoe(e);if(!r.started){if(r.mode==='work'){shadow(e.x-game.camera,e.y,11,.28);directorLife(e,[0,1,2,3,2,1][Math.floor(e.taskAge*5)%6])}return}if(r.mode==='vehicle'&&r.vehiclePhase==='ride')return;
 const frame=directorFrame(e);if(frame<0)return;ctx.save();
 if(r.mode==='rope'){const gantry=r.scene.gantry,pm=directorPropMeta(game.level,7),beam=gantry.y-148*pm.anchor+148*[.18,.30,.18,.27,.25][game.level];ctx.beginPath();ctx.rect(0,beam+4,WIDTH,HEIGHT-beam);ctx.clip()}
 if(r.mode==='cover'&&(r.progress||0)<.4){const c=r.scene.cover;ctx.beginPath();ctx.rect(c.x-game.camera-48,c.y-90,96,95);ctx.clip()}
 if(r.mode==='vehicle'&&r.progress<.32){const box=cargoBox(r.scene.vehicle);ctx.beginPath();ctx.rect(box.x,box.y,box.w,box.h);ctx.clip()}
 shadow(e.x-game.camera,e.y,10,.35);directorLife(e,frame);ctx.restore();
};
const directorDrawItem=drawItem;
drawItem=function(i){
 if(!i.kind?.startsWith('director'))return directorDrawItem(i);const s=i.scene,x=i.x-game.camera;if(x<-200||x>WIDTH+200)return;
 if(i.kind==='directorTask'){const e=s.actor;shadow(x,i.y,11,.28);directorLife(e,[0,1,2,3,2,1][Math.floor(e.taskAge*5)%6]);return}
 if(i.kind==='directorStation'){directorProp(5,s.level,x,i.y,43);return}
 if(i.kind==='directorTool'){shadow(x,i.y,6,.18);ctx.save();ctx.translate(x,i.y-i.z);if(i.z)ctx.rotate(i.spin);directorProp(6,s.level,0,0,i.size);ctx.restore();return}
 if(i.kind==='directorGantry'){
  directorProp(7,s.level,x,i.y,148);const r=s.actor.entry,pm=directorPropMeta(s.level,7),from=i.y-148*pm.anchor+148*[.18,.30,.18,.27,.25][s.level];
  if(r?.mode==='rope'&&r.started&&r.time>=.58&&s.actor.z>70){const m=directorMeta(s.level),g=[[.25,.46],[.42,.32],[.42,.22],[.30,.13],[.42,.18]][s.level],im=images['director-life-'+s.level],h=directorHeight(s.actor),w=h*im.naturalWidth/im.naturalHeight;s.ropeEnd={x:s.actor.x+s.actor.face*(g[0]-m.center)*w,y:s.actor.y-s.actor.z+h*(g[1]-m.anchor)}}
  if(s.ropeEnd){const attached=r?.mode==='rope'&&s.actor.z>70,tipX=s.ropeEnd.x-game.camera+(attached?0:Math.sin(game.clock*2.2)*1.5);ctx.strokeStyle=s.level===2?'#577945':'#a58a62';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,from);ctx.lineTo(tipX,Math.max(from,s.ropeEnd.y));ctx.stroke()}return;
 }
 if(i.kind==='directorCover'){
  if(!i.open)return directorProp(0,s.level,x,i.y,[60,63,66,66,70][s.level]);
  const w=[60,63,66,66,70][s.level],pm=directorPropMeta(s.level,1),cut=globalThis.DRAGON_DIRECTOR_META?.lidCut?.[s.level]||.40,top=i.y-w*pm.anchor;
  ctx.save();ctx.beginPath();ctx.rect(x-w,top+w*cut,w*2,w*(1-cut)+3);ctx.clip();directorProp(1,s.level,x,i.y,w);ctx.restore();
  // The detached lid is a source component with its own physical arc, never a background rectangle.
  {const im=images['director-props-'+s.level],sw=im.naturalWidth/4,sh=im.naturalHeight/2,p0=directorPropMeta(s.level,0),u=clamp((i.lidTime||0)/.85,0,1);ctx.save();ctx.translate(x-u*38,mix(i.y-w*p0.anchor,i.y+4-w*cut,u)-Math.sin(u*Math.PI)*30);ctx.rotate(-u*.8);ctx.drawImage(im,0,0,sw,sh*cut,-w*p0.center,0,w,w*cut);ctx.restore()}return;
 }
 if(i.kind==='directorVehicle'){
  if(!i.visible)return;directorProp(3,s.level,x,i.y,140);const r=s.actor.entry;
  if(r?.mode==='vehicle'&&r.started&&r.vehiclePhase==='ride'){const box=cargoBox(i);ctx.save();ctx.beginPath();ctx.rect(box.x,box.y,box.w,box.h);ctx.clip();directorLife(s.actor,13);ctx.restore()}
  const wheels=globalThis.DRAGON_DIRECTOR_META?.wheels?.[s.level];if(wheels)for(const wheel of wheels){const pm=directorPropMeta(s.level,3),cx=x-140*pm.center+140*wheel.x,cy=i.y-140*pm.anchor+140*wheel.y;ctx.save();ctx.translate(cx,cy);ctx.rotate(-i.stride/(wheel.r*140));const im=images['director-props-'+s.level],sw=im.naturalWidth/4,sh=im.naturalHeight/2;ctx.drawImage(im,0,sh,sw,sh,-wheel.r*165,-wheel.r*165,wheel.r*330,wheel.r*330);ctx.restore()}return;
 }
};
function directorAid(d){if(d.aidUsed)return;const living=game.players.filter(p=>p.hp>0);if(!living.length||!living.some(p=>p.hp<(p.maxHp||100)*.3))return;d.aidUsed=true;const p=living.reduce((a,b)=>a.hp<b.hp?a:b);if(game.items.some(i=>!i.gone&&['apple','healthGem','bread'].includes(i.kind)&&Math.abs(i.x-p.x)<110))return;game.items.push(makeItem('healthGem',clamp(p.x+22,...playerLimits(p)),clamp(p.y+6,...DEPTH)));directorEvent('recovery-drop')}
function updateDirector(dt){
 if(game.mode!=='play')return;for(const s of directorScenes){if(!s)continue;s.clock+=dt;if(s.cover?.open>0)s.cover.lidTime=(s.cover.lidTime||0)+dt;if(s.kind==='work'&&s.promoted&&!s.actor.hp)dropDirectorTool(s);if(s.actor&&!s.promoted)s.actor.taskAge+=dt;const v=s.vehicle;if(v?.visible&&!s.actor.hp&&!v.depart){v.depart=true;v.departAge=0}if(v?.visible&&v.depart){v.departAge+=dt;if(v.departAge>.7){const dx=(v.departAge-.7)*90*dt+100*dt;v.x-=dx;v.stride+=dx;if(v.x<game.camera-170)v.visible=false}}}
 for(const i of game.items)if(i.kind==='directorTool'&&i.z>0){i.x+=i.vx*dt;i.vz-=160*dt;i.z=Math.max(0,i.z+i.vz*dt);i.spin+=dt*3}
 const d=encounterDirector;if(!d||game.gate!=='fight')return;d.waveAge+=dt;
 const current=d.groups[d.wave],alive=current.filter(e=>e.hp>0),entered=current.every(e=>!e.hp||!e.entry);d.pressure=Math.max(0,d.pressure-dt*.13);
 if(!alive.length){d.clearAge+=dt;directorAid(d)}else d.clearAge=0;
 if(d.wave+1<d.groups.length){const recovering=game.players.some(p=>p.respawnWait>0||p.act==='respawn'),low=game.players.some(p=>p.hp>0&&p.hp<(p.maxHp||100)*.3),gap=low?2.0:.85;
  if(!recovering&&(!alive.length&&d.clearAge>=gap||!low&&alive.length===1&&entered&&d.waveAge>5.5&&alive[0].hp<alive[0].maxHp*.35))releaseDirectorWave(d,d.wave+1)}
}
const directorGateUpdate=updateGate;
updateGate=function(living,dt){directorGateUpdate(living,dt);updateDirector(dt)};
const directorUpdate=update;
update=function(dt){
 const scene=directorScenes[game.section];
 if(game.mode==='play'&&game.gate==='travel'&&scene?.kind==='work'&&!scene.promoted&&scene.anchor+70<=game.camera+WIDTH){
  const actor=scene.actor,shot=game.shots.find(s=>Math.abs(s.x-actor.x)<28&&Math.abs(s.depth-actor.y)<23),strike=game.players.some(p=>p.hp&&['punch','kick'].includes(p.act)&&p.age>.12&&Math.abs(p.x-actor.x)<52&&Math.abs(p.y-actor.y)<22);
  if(shot||strike){const shots=game.shots;startEncounter();game.shots=shots;if(actor.entry){Object.assign(actor.entry,{started:true,time:0,delay:0,exposed:true});pose(actor,'arrival')}directorEvent('player-interrupt')}
 }
 directorUpdate(dt);
};
const directorEnemyUpdate=updateEnemy;
updateEnemy=function(e,dt,living){
 if(!e.entry&&e.hp>0&&!e.boss&&!['tell','attack','recover','hit','fall','phase'].includes(e.act)){
  const budget=(game.difficulty==='easy'?1:2)+(living.length>1?1:0),busy=game.enemies.filter(o=>o!==e&&o.hp>0&&!o.entry&&['tell','attack'].includes(o.act)).length;
  if(busy>=budget)e.cooldown=Math.max(e.cooldown,dt+.12);
 }
 directorEnemyUpdate(e,dt,living);
};
const directorBreak=breakItem;
breakItem=function(i){if(i.kind!=='directorCover')return directorBreak(i);i.hp=0;if(game.gate==='travel'&&i.scene.section===game.section)startEncounter();if(i.scene.actor.entry)i.scene.actor.entry.delay=0;impact(i.x,i.y-12,'wood',1,1.2)};
const directorHud=hud;
hud=function(){directorHud();const d=encounterDirector;if(!d||game.mode!=='play'||game.gate!=='fight'||game.enemies.some(e=>e.boss))return;if(!townSpeech){pixel(WIDTH-73,37,66,12,'#101a2bdb');label('ΚΥΜΑ '+(d.wave+1)+' / '+d.groups.length,WIDTH-11,46,7,'#ffdf9b','right')}const r=d.scene.actor?.entry;if(r?.mode==='rope'&&r.started&&r.time<.58){ctx.save();ctx.strokeStyle='#f5d590';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(r.scene.anchor-game.camera,r.scene.lane,14,4,0,0,Math.PI*2);ctx.stroke();label('!',r.scene.anchor-game.camera,r.scene.lane-7,12,'#ffe3a6','center');ctx.restore()}};
globalThis.DragonDirector={version:'2.5',plan:DIRECTOR_PLAN,scenes:()=>directorScenes,current:()=>encounterDirector,events:directorEvents,populate:populateDirector,life:directorLife,frame:directorFrame};
