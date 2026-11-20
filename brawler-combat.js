'use strict';
// A different approach pattern, committed signature and simple answer for every new foe.
const BRAWL_PROFILES=[
 ['golem','close','ring',44,1.20,.34,1.65,42,0,'Πήδα το χτύπημα και πλησίασε μετά.','Jump the stomp, then move in.','Перестрибніть удар і наблизьтесь.'],
 ['owl','orbit','dash',116,1.05,.42,1.45,0,176,'Άλλαξε λωρίδα όταν ετοιμάζει τη βουτιά.','Change lanes when the dive winds up.','Змініть смугу перед пікіруванням.'],
 ['crab','strafe','ring',32,.95,.30,1.25,29,0,'Ο κάβουρας κινείται πλάγια. Το πίσω μέρος είναι ευάλωτο.','The crab moves sideways. Its back is vulnerable.','Краб рухається боком. Його спина вразлива.'],
 ['octopus','anchor','fan',104,1.10,.32,1.40,0,113,'Ανάμεσα στα δύο μελάνια μένει κενό.','There is a gap between the two ink shots.','Між двома чорнильними пострілами є проміжок.'],
 ['gull','swoop','leap',96,1.05,.62,1.35,24,0,'Περίμενε την προσγείωση του γλάρου.','Wait for the gull to land.','Дочекайтесь приземлення чайки.'],
 ['fish','close','fan',75,1.10,.30,1.30,0,115,'Φύλαξη, κι ύστερα πλησίασε τον ψαροναύτη.','Guard, then close in on the fish sailor.','Захищайтесь, тоді наблизьтесь до риби-матроса.'],
 ['fox','feint','dash',88,1.05,.38,1.45,0,205,'Μην κυνηγάς την προσποίηση. Κάνε λίγο πλάι.','Do not chase the feint. Step aside.','Не женіться за фінтом. Відійдіть убік.'],
 ['hedgehog','shield','ring',35,1.10,.28,1.50,34,0,'Κλωτσιά ή εναέριο χτύπημα ανοίγει τη φρουρά.','A kick or aerial hit opens the guard.','Удар ногою або в повітрі відкриває захист.'],
 ['acorn','anchor','lanes',105,1.15,.25,1.45,0,105,'Πήδα τον σπόρο και πλησίασε.','Jump the seed and close in.','Перестрибніть насінину й наблизьтесь.'],
 ['tree','lumber','ring',48,1.40,.40,1.90,48,0,'Ο κορμός αργεί να σηκωθεί ξανά.','The tree takes time to stand ready again.','Дерево повільно готується знову.'],
 ['beetle','circle','dash',56,.95,.24,1.35,0,145,'Το σκαθάρι κάνει κύκλο. Κράτα τη θέση σου.','The beetle circles. Hold your ground.','Жук кружляє. Тримайте позицію.'],
 ['gargoyle','statue','leap',112,1.25,.70,1.75,27,0,'Βγες από τη σκιά πριν προσγειωθεί.','Leave the shadow before it lands.','Вийдіть із тіні до приземлення.'],
 ['bronze','shield','ring',42,1.25,.35,1.70,40,0,'Το αυτόματο στρίβει αργά. Πέρνα πίσω του.','The automaton turns slowly. Go behind it.','Автоматон повільно повертається. Зайдіть ззаду.'],
 ['harpy','orbit','fan',125,1.15,.30,1.45,0,117,'Φύλαξη ή πλάγιο βήμα απέναντι στα φτερά.','Guard or step aside from the feathers.','Захищайтесь або відійдіть від пір’я.'],
 ['scarab','roll','dash',114,1.10,.43,1.65,0,165,'Πήδα το κύλισμα. Μετά μένει ακάλυπτος.','Jump the roll. It is exposed afterwards.','Перестрибніть перекат. Потім він відкритий.'],
 ['book','reader','lanes',118,1.15,.25,1.50,0,107,'Πλησίασε το βιβλίο όταν κλείσει τις σελίδες.','Close in when the book shuts its pages.','Наблизьтесь, коли книга закриє сторінки.'],
 ['wax','sneak','drop',92,1.25,.25,1.55,18,0,'Το σημάδι μένει στο πάτωμα. Φύγε από εκεί.','The marker stays on the floor. Move away.','Мітка лишається на підлозі. Відійдіть.'],
 ['jester','bait','leap',66,1.00,.47,1.55,22,0,'Ο γελωτοποιός αποφεύγει μία φορά. Περίμενέ τον.','The jester dodges once. Wait for him.','Блазень ухиляється раз. Дочекайтесь його.'],
 ['mouse','burst','dash',66,.95,.23,1.50,0,213,'Μικρή έφοδος, μεγάλη ανάσα. Χτύπα μετά!','Short rush, long pause. Hit afterwards!','Короткий ривок, довга пауза. Бийте потім!'],
 ['hare','hop','leap',88,1.10,.58,1.55,21,0,'Το λαγουδάκι πηδά στο σημαδεμένο σημείο.','The hare jumps to the marked spot.','Заєць стрибає до позначеного місця.']
].map((v,i)=>{const [id,approach,form,range,tell,active,rest,radius,speed,...tip]=v;return {type:20+i,id,approach,form,range,tell,active,rest,radius,speed,tip:chapterText(...tip),shield:['hedgehog','bronze'].includes(id)}});
for(const p of BRAWL_PROFILES){const kit=FAIRY_KITS[p.type-12];p.name=kit.name;kit.range=p.range;kit.armor=false;kit.hover=['gull','owl','harpy'].includes(p.id)?7:0;const low=p.id==='acorn',art=low?'stone':p.id==='octopus'?'potion':p.id==='book'?'card':p.id==='harpy'?'wind':p.form==='ring'?'twig':'claw';kit.moves={signature:strike(p.name,p.form,p.tell,p.active,p.rest,{range:p.range,radius:p.radius,speed:p.speed,height:p.id==='hare'?36:43,lanes:p.id==='octopus'?[-16,16]:p.id==='harpy'?[-12,12]:p.id==='fish'?[-8,8]:[0],count:1,art})};kit.phases=[['signature']];FOES[p.type][0]=Math.round(FOES[p.type][0]*.82)}
const brawlFactory=enemy;
enemy=function(type,x,y){const e=brawlFactory(type,x,y);if(e.type>=20){e.brawl=BRAWL_PROFILES[e.type-20];e.retreatTravel=0;e.guardDown=0;e.cooldown=1.05;e.guard=e.brawl.shield}return e};
const brawlUpdateEnemy=updateEnemy;
updateEnemy=function(e,dt,living){e.guardDown=Math.max(0,(e.guardDown||0)-dt);brawlUpdateEnemy(e,dt,living)};
let brawlTip=null;const brawlTaught=new Set();
const brawlStartSpecial=startSpecial;
startSpecial=function(e,living,target){brawlStartSpecial(e,living,target);if(!e.brawl)return;const p=e.brawl;e.move.lockedFace=e.face;e.move.baseSpeed=e.move.plan.speed;if(e.brawl.id==='hare'||e.brawl.id==='jester')e.move.spots[0].x=arenaX(target.x+(e.brawl.id==='hare'?-e.face:e.face)*35);e.retreatTravel=0;if(!brawlTaught.has(e.type)){brawlTaught.add(e.type);brawlTip={text:p.tip,until:game.clock+4}}};
const brawlSpecial=updateSpecial;
updateSpecial=function(e,dt,living){
 if(!e.brawl||!living.length)return brawlSpecial(e,dt,living);const p=e.brawl;
 if(['tell','attack','recover','phase'].includes(e.act))return brawlSpecial(e,dt,living);
 const target=living.reduce((a,b)=>Math.hypot(a.x-e.x,(a.y-e.y)*1.5)<Math.hypot(b.x-e.x,(b.y-e.y)*1.5)?a:b),dx=target.x-e.x,dy=target.y-e.y,distance=Math.hypot(dx,dy*1.3);e.cooldown-=dt;e.face=Math.sign(dx)||e.face;
 if(p.approach==='statue'&&distance>145){pose(e,'idle');return}
 if(p.approach==='feint'&&distance<110&&e.cooldown<=.28&&!e.feinted){e.feinted=true;e.feintLeft=.28}
 if(p.approach==='bait'&&['punch','airClub','airKick'].includes(target.act)&&distance<60&&!e.feinted){e.feinted=true;e.feintLeft=.24;e.cooldown=Math.max(.35,e.cooldown)}
 let vx=0,vy=0;const speed=e.speed*(p.approach==='lumber'?.55:1);
 if(e.feintLeft>0){e.feintLeft-=dt;vx=-e.face*speed*1.1}
 else if(e.cooldown<=0&&Math.abs(dx)<p.range+22&&Math.abs(dy)<(p.form==='ring'?18:34)){e.feinted=false;return startSpecial(e,living,target)}
 else {const preferred=p.form==='ring'?p.range*.48:p.range*.78;
  if(Math.abs(dx)>preferred+8)vx=e.face*speed;
  if(['anchor','orbit','reader'].includes(p.approach)&&Math.abs(dx)<preferred-18&&e.retreatTravel<25){vx=-e.face*speed*.7;e.retreatTravel+=Math.abs(vx*dt)}
  let lane=target.y;if(['strafe','circle','orbit','sneak'].includes(p.approach))lane=clamp(target.y+Math.sin(e.phase*(p.approach==='circle'?1.8:1.1)+e.type)*14,...DEPTH);
  vy=clamp(lane-e.y,-speed*.6*dt,speed*.6*dt)/dt;
 }
 const ox=e.x,oy=e.y;e.x=arenaX(e.x+vx*dt);e.y=clamp(e.y+vy*dt,...DEPTH);pose(e,Math.hypot(e.x-ox,e.y-oy)>.01?'walk':'idle');
};
const brawlAttack=specialAttack;
specialAttack=function(e,dt,living){if(e.brawl?.id==='scarab')e.move.plan.speed=e.move.baseSpeed*(1+Math.min(.6,e.age*1.5));brawlAttack(e,dt,living)};
const brawlBossDamage=bossDamage;
bossDamage=function(e,amount,direction){if(!e.brawl)return brawlBossDamage(e,amount,direction);const front=e.face!==direction,guard=e.brawl.shield&&e.guardDown<=0&&['idle','walk','tell'].includes(e.act)&&front;return Math.min(e.hp,Math.max(1,Math.round(amount*(guard?.72:e.act==='recover'?1.35:!front&&e.brawl.id==='crab'?1.4:1))))};
const brawlDamage=damage;
damage=function(e,p,amount,hits,direction,source){const hp=e.hp;brawlDamage(e,p,amount,hits,direction,source);if(e.brawl&&e.hp<hp){if(e.brawl.id==='book')e.cooldown=Math.max(e.cooldown,1.2);if(e.brawl.shield&&(source==='kick'||p.z>8)){e.guardDown=1.8;e.cooldown=Math.max(e.cooldown,1.1);impact(e.x,e.y-20,'guard',direction,1.1)}if(!e.hp&&!e.coinDropped){e.coinDropped=true;game.items.push({...makeItem('coinCache',e.x,e.y),tokenValue:1})}}};
const brawlHazard=hazard;
hazard=function(e,move,data){brawlHazard(e,move,data);if(e.brawl){const h=game.hazards.at(-1);h.damage=game.difficulty==='hard'?7:6;if(e.brawl.id==='acorn')h.z=3}};
const brawlHud=hud;
hud=function(){brawlHud();if(game.mode==='play'&&brawlTip&&game.clock<brawlTip.until&&!townSpeech){pixel(8,38,WIDTH-16,15,'#101c2be8');label(brawlTip.text,WIDTH/2,48,6,'#ffe0a1','center')}};
Object.assign(DragonCampaign,{profiles:BRAWL_PROFILES});
// Signature projectiles have the material described by their tells.
for(const p of BRAWL_PROFILES){const plan=FAIRY_KITS[p.type-12].moves.signature;if(p.id==='octopus')plan.art='ink';if(p.id==='fish')plan.art='water';if(p.id==='acorn')plan.art='seed'}
const brawlDrawHazard=drawEnemyHazard;
drawEnemyHazard=function(h){if(h.form!=='bolt'||!['ink','water','seed'].includes(h.art))return brawlDrawHazard(h);const x=h.x-game.camera,y=h.y-h.z;ctx.save();ctx.translate(x,y);if(h.art==='seed'){ctx.rotate(h.age*Math.sign(h.vx)*8);ctx.fillStyle='#a87840';ctx.beginPath();ctx.ellipse(0,1,6,8,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#624329';ctx.beginPath();ctx.ellipse(0,-4,7,3,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#463320';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(1,-10);ctx.stroke()}else{const ink=h.art==='ink';if(hdPrefs.lighting)hdGlow(0,0,13,10,ink?'162,107,191':'114,211,246',.20);ctx.fillStyle=ink?'#70458e':'#71cce9';ctx.beginPath();ctx.ellipse(0,0,8,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=ink?'#bd94cb':'#d9f8ff';ctx.beginPath();ctx.ellipse(-2,-2,3,1.5,-.3,0,Math.PI*2);ctx.fill();ctx.fillStyle=ink?'#75508b88':'#9be4f388';ctx.beginPath();ctx.arc(-Math.sign(h.vx)*12,1,2,0,Math.PI*2);ctx.fill()}ctx.restore()};
