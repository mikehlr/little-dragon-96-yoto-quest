'use strict';
let bossWaves=null;
const BOSS_SUPPORTS=[[26,0,30],[22,24,3],[27,28,26],[34,31,38],[38,36,35],[39,21,20]];
const WAVE_NOTICE=chapterText('ΕΝΙΣΧΥΣΕΙΣ','REINFORCEMENTS','ПІДКРІПЛЕННЯ');
const waveBegin=beginStage;
beginStage=function(retry=false){bossWaves=null;waveBegin(retry)};
const waveEncounter=startEncounter;
startEncounter=function(){waveEncounter();if(game.gate==='fight'&&game.section===15){const boss=game.enemies.find(e=>e.boss);if(boss&&!bossWaves)bossWaves={boss,level:game.level,elapsed:0,next:0,lastAt:-100,notice:0,retreat:false,events:[],healed:new Set()}}};
function bossWaveEvent(type,data={}){const e={type,time:bossWaves.elapsed,...data};bossWaves.events.push(e);chapterEvent(type,data)}
function spawnBossWave(){const s=bossWaves,w=s.next++,count=Math.min(3,(game.difficulty==='easy'?1:game.difficulty==='normal'?2:3)+(game.two?1:0));
 for(let i=0;i<count;i++){const side=(w+i)%2?'right':'left',type=BOSS_SUPPORTS[game.level][(w+i)%3],e=enemy(type,game.camera+(side==='left'?-60:WIDTH+60),[215,239,226][i]);e.bossSupport=true;e.supportWave=w;e.hp=e.maxHp=Math.max(12,Math.round(e.maxHp*(game.difficulty==='easy'?.65:.85)));queueEntrance(e,side,.75+i*.65,game.camera+(side==='left'?82:WIDTH-82));game.enemies.push(e)}
 s.lastAt=s.elapsed;s.notice=2.8;bossWaveEvent('boss-wave',{wave:w+1,count});effect('warning');
}
function updateBossWaves(dt){const s=bossWaves;if(!s||game.mode!=='play'||game.gate!=='fight')return;s.notice=Math.max(0,s.notice-dt);const adds=game.enemies.filter(e=>e.bossSupport);
 if(!s.boss.hp){if(!s.retreat){s.retreat=true;game.hazards=[];game.shots=[];game.enemies=game.enemies.filter(e=>!e.bossSupport||!e.entry||e.entry.started);for(const e of game.enemies)if(e.bossSupport&&e.hp){e.move=null;e.entry=null;e.bossRetreat=e.x<game.camera+WIDTH/2?-1:1;e.cooldown=99}bossWaveEvent('boss-support-retreat')}return}
 if(s.boss.entry||game.players.some(p=>p.respawnWait>0||p.act==='respawn'))return;
 s.elapsed+=dt;
 for(let w=0;w<s.next;w++)if(!s.healed.has(w)&&adds.some(e=>e.supportWave===w)&&adds.filter(e=>e.supportWave===w).every(e=>!e.hp)){s.healed.add(w);const weak=game.players.find(p=>p.hp>0&&p.hp<(p.maxHp||100)*.35);if(weak){const last=adds.find(e=>e.supportWave===w);game.items.push(makeItem('healthGem',clamp(last.x,...playerLimits(weak)),last.y))}}
 const gap=game.difficulty==='easy'?12:game.difficulty==='normal'?10:8;
 if(s.next<3&&s.elapsed>=2.8&&s.boss.phaseIndex>=s.next&&s.elapsed-s.lastAt>=gap&&!adds.some(e=>e.hp>0)&&!['attack','phase'].includes(s.boss.act))spawnBossWave();
}
const waveGate=updateGate;
updateGate=function(living,dt){updateBossWaves(dt);waveGate(living,dt)};
const waveEnemyUpdate=updateEnemy;
updateEnemy=function(e,dt,living){if(e.bossRetreat&&e.hp){e.age+=dt;e.phase+=dt;e.face=e.bossRetreat;const dx=e.face*125*dt;e.x+=dx;e.stride=(e.stride||0)+Math.abs(dx);pose(e,'walk');if(e.x<game.camera-70||e.x>game.camera+WIDTH+70){e.hp=0;e.coinDropped=true}return}waveEnemyUpdate(e,dt,living)};
const waveStartSpecial=startSpecial;
startSpecial=function(e,living,target){if(e.boss&&bossWaves?.boss===e){const cap=(game.difficulty==='easy'?1:game.difficulty==='normal'?2:3)+(living.length>1?1:0),busy=game.enemies.filter(o=>o!==e&&o.hp&&!o.entry&&['tell','attack'].includes(o.act)).length;if(busy>=cap){e.cooldown=.25;pose(e,'idle');return}}return waveStartSpecial(e,living,target)};
const waveHud=hud;
hud=function(){waveHud();if(game.mode==='play'&&bossWaves?.notice>0){pixel(WIDTH/2-106,74,212,14,'#142033ed');label(WAVE_NOTICE+' · '+bossWaves.next+' / 3',WIDTH/2,84,7,'#ffdda0','center')}};
Object.assign(DragonCampaign,{bossWaves:()=>bossWaves});
