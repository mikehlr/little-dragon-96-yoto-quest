'use strict';
// Actual world motion, with the original fixed native sprite camera and floor shadow.
const defeatedFoes=[];
const HIT_REACTIONS={punch:{speed:105,lift:0,stun:.19},kick:{speed:205,lift:100,stun:.40},club:{speed:255,lift:135,stun:.49},energyHit:{speed:280,lift:155,stun:.55},throwHit:{speed:275,lift:145,stun:.53},slam:{speed:325,lift:180,stun:.65}};
function enemyMass(e){return e.boss?4:e.rival&&!e.storyFoe?1.35:['golem','bronze','oak'].includes(e.brawl?.id)||e.type===29?1.55:1}
function reactionBounds(e){const cam=Number.isFinite(game.arenaCamera)&&['fight','reward'].includes(game.gate)?game.arenaCamera:game.camera;return [Math.min(e.x,Math.max(15,cam+22)),Math.max(e.x,Math.min(WORLD-15,cam+WIDTH-22))]}
function finishDefeatedEntrance(e){const r=e.entry;if(!r)return;if(r.scene){r.scene.phase='engaged';if(r.scene.cover)r.scene.cover.open=1;if(r.mode==='vehicle'&&r.scene.vehicle){r.scene.vehicle.depart=true;r.scene.vehicle.departAge=0}}e.entry=null;e.directorLife=null;e.reinforcement=false}
function startEnemyReaction(e,owner,direction,source,oldX){
 const dead=e.hp<=0,profile=HIT_REACTIONS[source]||HIT_REACTIONS.punch,mass=enemyMass(e),blocked=!dead&&e.guard&&!(e.guardDown>0)&&e.face!==direction;
 if(!dead&&e.entry){e.hurt=Math.max(e.hurt||0,.12);return}
 if(dead&&e.entry&&!e.entry.started)return;
 if(!e.entry&&!e.boss)e.x=oldX;
 if(dead)finishDefeatedEntrance(e);
 const factor=blocked?.38:1,rest=dead?0:(e.kit?.hover||0),speed=(dead?Math.max(180,profile.speed*1.10):profile.speed)*factor/mass;
 const lift=(dead?Math.max(125,profile.lift*1.1):profile.lift)*factor/Math.sqrt(mass);
 const r={age:0,vx:(direction||Math.sign(e.x-owner.x)||1)*Math.min(360,speed),vz:Math.min(lift,Math.max(0,(75-(e.z||0))*5)),rest,stun:profile.stun*factor,grounded:false,landed:false,rise:0,bounds:reactionBounds(e),boss:!!e.boss,air:lift>40||e.z>rest+2,source};
 e.reaction=r;
 if(dead){e.move=null;e.hurt=0;pose(e,'fall');const flight=(r.vz+Math.sqrt(r.vz*r.vz+860*Math.max(0,(e.z||0)-rest)))/430;
  const blinkAt=e.boss?Math.max(.45,flight+.12):Math.max(.9,flight+.17);e.knockout={level:game.level,direction:Math.sign(r.vx)||1,age:0,blinkAt,end:blinkAt+(e.boss?.68:.72),done:false};
  if(!defeatedFoes.includes(e)){defeatedFoes.push(e);if(defeatedFoes.length>24)defeatedFoes.shift()}
 }else if(!e.boss){e.move=null;e.feintLeft=0;e.feinted=false;pose(e,'hit')}
 if(!e.boss&&profile.lift>0&&!blocked){game.freeze=Math.max(game.freeze,source==='slam'?.048:.035);if(game.fx&&!hdPrefs.calm)game.shake=Math.max(game.shake,source==='slam'?3.5:2.5)}
}
const reactionDamage=damage;
damage=function(e,owner,amount,hits,direction,source='punch'){const hp=e.hp,x=e.x;reactionDamage(e,owner,amount,hits,direction,source);if(e.hp<hp)startEnemyReaction(e,owner,direction,source,x)};
function advanceEnemyReaction(e,dt){
 const r=e.reaction;if(!r)return;r.age+=dt;
 if(!r.boss||!['attack','phase'].includes(e.act)){
  const before=e.x;let next=clamp(before+r.vx*dt,...r.bounds);
  if((e.z||0)<=r.rest+4)for(const o of game.items)if(o.solid&&!o.gone&&Math.abs(o.y-e.y)<(o.blockH||4)+5){const edge=o.x-Math.sign(r.vx)*((o.blockW||8)+8);if(r.vx>0&&before<=edge&&next>edge||r.vx<0&&before>=edge&&next<edge){next=edge;break}}
  e.x=clamp(next,...r.bounds);if(Math.abs(e.x-before)<Math.abs(r.vx*dt)*.3){if(!r.wall&&Math.abs(r.vx)>170){r.wall=true;impact(e.x,e.y-16,'contact',Math.sign(r.vx),.65)}r.vx=0}
 }
 r.vx*=Math.exp(-(r.air?3.5:10)*dt);
 if(!r.boss||e.knockout){e.z=Math.max(r.rest,(e.z||0)+r.vz*dt);r.vz-=430*dt;
  if(e.z<=r.rest&&r.vz<=0){e.z=r.rest;r.vz=0;r.grounded=true;if(r.air&&!r.landed){r.landed=true;impact(e.x,e.y,'landing',Math.sign(r.vx)||1,.6);effect('land')}}
 }
 if(e.knockout)return;
 if(r.boss){if(r.age>.14)e.reaction=null;return}
 e.age+=dt;e.phase+=dt;e.guardDown=Math.max(0,(e.guardDown||0)-dt);e.hurt=Math.max(0,(e.hurt||0)-dt);
 if(r.age>=r.stun&&(!r.air||r.grounded)){
  if(r.air&&r.rise<.14){if(r.rise===0)pose(e,'recover');r.rise+=dt;return}
  e.reaction=null;e.move=null;e.z=r.rest;e.cooldown=Math.max(e.cooldown||0,.36*difficultyRules().rest);pose(e,'idle');
 }else if(r.air&&r.grounded)e.act='fall';else e.act='hit';
}
function advanceKnockout(e,dt){const k=e.knockout;if(!k||k.done)return;k.age+=dt;advanceEnemyReaction(e,dt);if(k.age>=k.end){k.done=true;e.reaction=null;e.z=0}}
const reactionEnemyUpdate=updateEnemy;
updateEnemy=function(e,dt,living){if(e.knockout)return;if(e.reaction&&!e.boss){if(!game.freeze)advanceEnemyReaction(e,dt);return}reactionEnemyUpdate(e,dt,living);if(e.reaction&&e.hp&&!game.freeze)advanceEnemyReaction(e,dt)};
const reactionGate=updateGate;
updateGate=function(living,dt){if(game.gate==='reward'){const boss=game.enemies.find(e=>e.boss&&e.knockout&&!e.knockout.done);if(boss&&boss.knockout.age<boss.knockout.blinkAt+.32)game.timer=Math.max(game.timer,1.15+dt)}reactionGate(living,dt)};
const reactionWorldUpdate=update;
update=function(dt){reactionWorldUpdate(dt);if(game.mode!=='play'||game.freeze>0)return;for(const e of defeatedFoes)advanceKnockout(e,dt);for(let n=defeatedFoes.length-1;n>=0;n--)if(defeatedFoes[n].knockout.done)defeatedFoes.splice(n,1)};
const reactionStage=beginStage;
beginStage=function(retry=false){defeatedFoes.length=0;reactionStage(retry)};
function knockoutVisible(e){const k=e.knockout;if(!k||k.done)return false;return hdPrefs.calm||k.age<k.blinkAt||Math.floor((k.age-k.blinkAt)*9)%2===0}
const reactionDrawFoe=drawFoe;
drawFoe=function(e){if(!e.knockout)return reactionDrawFoe(e.reaction&&e.act==='fall'?{...e,age:0}:e);if(!knockoutVisible(e)||activeChapterPack&&e.knockout.level!==activeChapterPack.level)return;const k=e.knockout,air=!!e.reaction?.air&&k.age<.32&&!e.reaction?.grounded;ctx.save();if(hdPrefs.calm&&k.age>k.blinkAt)ctx.globalAlpha*=clamp((k.end-k.age)/(k.end-k.blinkAt),0,1);
 reactionDrawFoe({...e,act:air?'hit':'fall',age:air?.12:0,hurt:0,move:null,entry:null,koRotation:-k.direction*(e.face*(e.kit?-1:1))*daySmooth(0,.38,k.age)*1.05});ctx.restore();
};
// Keep a defeated actor in the same sorted world pass if a new encounter replaces the roster.
const reactionWorldDraw=draw;
draw=function(){const actual=game.enemies,extra=defeatedFoes.filter(e=>!actual.includes(e)&&!e.knockout.done);if(extra.length)game.enemies=[...actual,...extra];try{reactionWorldDraw()}finally{game.enemies=actual}};
function reviewEnemyReaction(mode,time){
 game.sound=false;game.clock=0;game.score=0;game.combo=null;game.shake=0;game.freeze=0;game.level=0;game.camera=game.arenaCamera=0;game.section=0;game.gate='fight';game.districtTitle=0;game.items=[];game.hazards=[];game.shots=[];game.particles=[];familyEffects.length=0;arcadeBlasts.length=0;defeatedFoes.length=0;townSpeech=null;
 const h=Object.assign(player(1),{x:150,y:230,inv:0}),e=mode===5?specialEnemy(0,290,230):enemy(0,260,230);game.players=[h];game.enemies=[e];e.hp=mode>=4?1:200;e.maxHp=Math.max(200,e.maxHp);if(e.boss){e.phaseIndex=2;e.phaseAttack=2}
 const source=['punch','kick','club','slam','slam','slam'][mode];damage(e,h,mode>=4?1000:24,new Set(),1,source);game.freeze=0;
 const ticks=Math.ceil(time/.016);for(let n=0;n<ticks;n++){const dt=time/ticks;if(e.knockout)advanceKnockout(e,dt);else if(e.reaction)advanceEnemyReaction(e,dt);for(const f of familyEffects)f.age+=dt;for(const p of game.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=140*dt;p.life-=dt}game.particles=game.particles.filter(p=>p.life>0)}game.clock=time;draw();
}
Object.assign(DragonCampaign,{reactions:{profiles:HIT_REACTIONS,clear:()=>{defeatedFoes.length=0},defeated:()=>defeatedFoes,advance:advanceEnemyReaction,advanceKO:advanceKnockout,visible:knockoutVisible,review:reviewEnemyReaction}});
