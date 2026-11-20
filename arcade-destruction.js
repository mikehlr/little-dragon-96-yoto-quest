'use strict';
// Short physical fragments keep their material and floor depth; loot keeps its own life.
let destructionSeed=0,breakMaterial=null;
const arcadeBlasts=[];
const MATERIALS={wood:['#b58a51','#6e492f','#dbb681'],glass:['#78bbdd','#e2faff','#3b83b0'],stone:['#c5b795','#8e806c','#eee0bd'],ceramic:['#cd8853','#824c33','#f0c79c'],metal:['#a1b0bb','#5f6d80','#dfdfc7'],ice:['#a8e3f3','#e8ffff','#72aec9']};
Object.assign(ITEM,{glassJar:{width:19,hp:16},powderBarrel:{width:30,hp:24},arcadeFragment:{width:8},arcadeBomb:{width:13}});
function materialOf(i){if(i.material)return i.material;if(i.kind==='glassJar'||i.kind==='energyFlask')return 'glass';if(['pot','amphora','storyUrn'].includes(i.kind))return 'ceramic';if(i.kind==='regionCrate')return ['wood','wood','wood','stone','wood','ice'][i.nativeLevel??game.level];return i.kind==='directorCover'?'wood':'wood'}
function fragmentRandom(seed,n){const v=Math.sin(seed*12.9898+n*78.233)*43758.5453;return v-Math.floor(v)}
function createFragments(i,material,small=false){
 const seed=++destructionSeed,count=small?3:game.fx?12:5,im=i.kind==='regionCrate'?images['director-props-'+(i.nativeLevel??game.level)]:null;
 const alive=game.items.filter(i=>i.kind==='arcadeFragment'&&!i.gone).length;if(alive>=140)return;
 for(let n=0;n<Math.min(count,140-alive);n++){const r=fragmentRandom(seed,n),r2=fragmentRandom(seed,n+19),metal=!small&&material==='wood'&&n%5===0;
  game.items.push({kind:'arcadeFragment',decor:true,x:i.x+(r-.5)*12,y:clamp(i.y+(r2-.5)*9,...DEPTH),z:(i.z||0)+(small?9:14+r*15),vx:(r-.5)*(small?80:165),vy:(r2-.5)*25,vz:(small?65:105)+r2*85,angle:r*6.28,spin:(r2-.5)*14,age:0,life:small?.65:4.8,bounces:0,material:metal?'metal':material,size:small?2:metal?3:3+r*4,seed:seed*23+n,gold:metal&&i.kind==='regionCrate'&&[0,4].includes(i.nativeLevel??game.level),source:!metal&&material!=='ice'&&material!=='glass'?im:null,tile:n%9});
 }
}
const destructionBreak=breakItem;
breakItem=function(i){if(i.gone||i.fractured)return;i.fractured=true;const material=materialOf(i),before=new Set(game.items),oldEffects=familyEffects.length,prior=breakMaterial;breakMaterial=material;
 try{destructionBreak(i)}finally{breakMaterial=prior}
 game.items=game.items.filter(v=>before.has(v)||!['debris','brokenBarrel','openedChest'].includes(v.kind));
 for(let n=familyEffects.length-1;n>=oldEffects;n--)if(['wood','stone'].includes(familyEffects[n].kind))familyEffects.splice(n,1);
 createFragments(i,material);if(i.kind==='powderBarrel')arcadeExplosion(i.x,i.y,40,game.players.find(p=>p.hp)||game.players[0],true,i.z||0);else arcadeBlasts.push({x:i.x,y:i.y-(i.z||0),age:0,life:.42,material,dust:true});
};
function updateDestruction(dt){
 for(const i of game.items){if(i.kind==='directorCover'&&i.open>=1&&!i.scene.actor.entry){i.residueAge=(i.residueAge||0)+dt;if(i.residueAge>=5)i.gone=true}if(i.hitFlash)i.hitFlash=Math.max(0,i.hitFlash-dt);if(i.kind!=='arcadeFragment')continue;i.age+=dt;if(i.age>=i.life){i.gone=true;continue}
  if(i.z>0||i.vz>0){i.x+=i.vx*dt;i.y=clamp(i.y+i.vy*dt,...DEPTH);i.z+=i.vz*dt;i.vz-=430*dt;i.angle+=i.spin*dt;
   if(i.z<=0){i.z=0;if(i.bounces++<1&&Math.abs(i.vz)>55){i.vz=-i.vz*.24;i.vx*=.45;i.vy*=.4;i.spin*=.3}else{i.vz=i.vx=i.vy=i.spin=0}}
  }
 }
 for(const f of arcadeBlasts)f.age+=dt;for(let n=arcadeBlasts.length-1;n>=0;n--)if(arcadeBlasts[n].age>=arcadeBlasts[n].life)arcadeBlasts.splice(n,1);
 game.items=game.items.filter(i=>!i.gone);
}
function drawFragment(i){
 const x=i.x-game.camera;if(x<-20||x>WIDTH+20)return;const tail=i.life-i.age;
 if(!hdPrefs.calm&&tail<1.25&&Math.floor(tail*7)%2===0)return;
 ctx.save();ctx.globalAlpha=(hdPrefs.calm?Math.min(1,tail/1.25):1)*(['glass','ice'].includes(i.material)?.7:1);ctx.translate(x,i.y-i.z);ctx.rotate(i.angle);const s=i.size,colors=i.gold?['#c5a058','#775332','#ffe1a2']:MATERIALS[i.material];
 if(i.source&&READY(i.source)){const sw=i.source.naturalWidth/4,sh=i.source.naturalHeight/2,tx=.12+i.tile%3*.24,ty=.13+Math.floor(i.tile/3)*.25;ctx.drawImage(i.source,sw*tx,sh*ty,sw*.22,sh*.22,-s/2,-s*.36,s,s*.72)}
 else{const g=ctx.createLinearGradient(-s,-s,s,s);g.addColorStop(0,colors[2]);g.addColorStop(.45,colors[0]);g.addColorStop(1,colors[1]);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-s*.65,s*.28);ctx.lineTo(-s*.17,-s*.56);ctx.lineTo(s*.62,-s*.12);ctx.lineTo(s*.32,s*.38);ctx.closePath();ctx.fill();ctx.strokeStyle=colors[2];ctx.lineWidth=.35;ctx.stroke()}
 ctx.restore();
}
function drawGlassJar(i){const x=i.x-game.camera,y=i.y-(i.z||0);if(!i.held)shadow(x,i.y,6,.25);ctx.save();ctx.translate(x,y);if(i.flight)ctx.rotate(i.flight.spin);bonusSprite(5,0,0,27);ctx.fillStyle='#ae5d47';ctx.beginPath();ctx.arc(2,-19,1.8,0,Math.PI*2);ctx.fill();ctx.restore()}
function drawPowderBarrel(i){const x=i.x-game.camera,y=i.y-(i.z||0);if(!i.held)shadow(x,i.y,10,.3);ctx.save();ctx.translate(x,y);if(i.flight)ctx.rotate(i.flight.spin);bonusSprite(0,0,0,30);ctx.fillStyle='#a54f3bd4';ctx.beginPath();ctx.moveTo(-7,-19);ctx.quadraticCurveTo(0,-17,7,-19);ctx.lineTo(7,-11);ctx.quadraticCurveTo(0,-9,-7,-11);ctx.closePath();ctx.fill();ctx.strokeStyle='#f0ce88';ctx.lineWidth=.7;for(let n=0;n<5;n++){const a=n*Math.PI*2/5;ctx.beginPath();ctx.moveTo(Math.cos(a)*1.2,-14+Math.sin(a)*1.2);ctx.lineTo(Math.cos(a)*3,-14+Math.sin(a)*3);ctx.stroke()}ctx.restore()}
const destructionDrawItem=drawItem;
drawItem=function(i){if(i.gone)return;if(i.residueAge>3.6&&!hdPrefs.calm&&Math.floor((5-i.residueAge)*7)%2===0)return;if(i.kind==='arcadeFragment')return drawFragment(i);if(i.kind==='arcadeBomb')return drawArcadeBomb(i);ctx.save();if(i.residueAge>3.6&&hdPrefs.calm)ctx.globalAlpha=clamp((5-i.residueAge)/1.4,0,1);if(i.hitFlash){ctx.translate(Math.sin(i.hitFlash*90)*(i.hitDirection||1)*1.6,0);ctx.filter='brightness(1.12)'}
 if(i.kind==='glassJar')drawGlassJar(i);else if(i.kind==='powderBarrel')drawPowderBarrel(i);else destructionDrawItem(i);ctx.restore();
};
const destructionHits=hitItems;
hitItems=function(p,hits,x,y,reach,amount,direction=p.face){const before=game.items.filter(i=>i.hp&&!i.gone).map(i=>[i,i.hp]);destructionHits(p,hits,x,y,reach,amount,direction);
 for(const [i,hp]of before)if(!i.gone&&i.hp<hp){i.hitFlash=.12;i.hitDirection=direction;createFragments(i,materialOf(i),true)}
 for(const b of game.items)if(b.kind==='arcadeBomb'&&!b.gone&&!b.friendly&&b.age>b.airTime&&Math.abs(b.y-y)<20&&(b.x-x)*direction>=-9&&(b.x-x)*direction<reach+5&&!hits.has(b)){hits.add(b);b.friendly=true;b.owner=p;b.start={x:b.x,y:b.y,z:b.z};b.target={x:clamp(b.x+direction*100,game.camera+28,game.camera+WIDTH-28),y:b.y};b.age=0;b.airTime=.45;b.fuse=Math.max(.8,b.fuse-b.groundAge);b.groundAge=0;effect('throw')}
};
function arcadeExplosion(x,y,radius,owner,friendly=false,originZ=0){
 arcadeBlasts.push({x,y:y-originZ,groundY:y,age:0,life:.85,radius,material:'metal'});if(arcadeBlasts.length>24)arcadeBlasts.shift();effect('slam');if(game.fx&&!hdPrefs.calm)game.shake=Math.max(game.shake,2.5);
 if(!friendly&&game.gate==='fight')for(const p of game.players)if(p.hp&&p.z<24&&Math.hypot(p.x-x,(p.y-y)*1.8)<radius)hitHero(p,x,game.difficulty==='hard'?10:game.difficulty==='easy'?5:7);
 const credit=owner?.id?owner:game.players.find(p=>p.hp)||game.players[0];if(credit)for(const e of game.enemies)if(e.hp&&!e.entry&&Math.hypot(e.x-x,(e.y-y)*1.8)<radius+e.size*.15)damage(e,credit,friendly?32:14,new Set(),Math.sign(e.x-x)||1,'slam');
 for(const i of game.items.slice())if(i.hp&&!i.gone&&!i.flight&&Math.hypot(i.x-x,(i.y-y)*1.8)<radius*.8){i.hp=0;breakItem(i)}
 createFragments({x,y,z:8},'metal',true);
}
function drawArcadeBlast(f){
 const x=f.x-game.camera,t=f.age/f.life;if(x<-100||x>WIDTH+100)return;ctx.save();ctx.beginPath();ctx.rect(0,29,WIDTH,HEIGHT-29);ctx.clip();
 if(f.dust){const colors=MATERIALS[f.material];ctx.globalAlpha=(1-t)*.17;ctx.fillStyle=colors[0];for(let n=0;n<4;n++){ctx.beginPath();ctx.ellipse(x+(n-1.5)*(3+t*9),f.y-8-t*12,5+t*9,3+t*5,0,0,Math.PI*2);ctx.fill()}}
 else{const calm=hdPrefs.calm||!game.fx,power=calm?.5:1;ctx.globalCompositeOperation='screen';hdGlow(x,f.y-9,18+t*35,15+t*21,'255,155,61',Math.max(0,1-t*2.7)*.7*power);ctx.strokeStyle=`rgba(255,213,136,${Math.max(0,1-t*2.3)*power})`;ctx.lineWidth=1.5*(1-t);ctx.beginPath();ctx.ellipse(x,f.groundY??f.y,5+t*48,2+t*15,0,0,Math.PI*2);ctx.stroke();
  for(let n=0;n<6;n++){const a=n*2.399,r=3+t*22;hdGlow(x+Math.cos(a)*r,f.y-10+Math.sin(a)*r*.6-t*12,Math.max(1,9*(1-t)),Math.max(1,10*(1-t)),'255,173,65',Math.max(0,1-t*2)*.7*power)}
  ctx.globalCompositeOperation='source-over';if(t<.42){const r=(9+Math.sin(t/.42*Math.PI)*12)*power,g=ctx.createRadialGradient(x,f.y-11,0,x,f.y-11,r);g.addColorStop(0,'#fff2bf');g.addColorStop(.30,'#ffd276');g.addColorStop(.67,'#ea853be8');g.addColorStop(1,'#b9531800');ctx.fillStyle=g;ctx.globalAlpha=Math.min(1,(.42-t)*5);ctx.beginPath();for(let n=0;n<18;n++){const a=n*Math.PI*2/18,rr=r*(n%2?.72:1.05+.10*Math.sin(n*4.3));const px=x+Math.cos(a)*rr,py=f.y-11+Math.sin(a)*rr*(.88+.08*Math.sin(n));if(n)ctx.lineTo(px,py);else ctx.moveTo(px,py)}ctx.closePath();ctx.fill();ctx.globalAlpha=1}if(!calm&&t<.48){ctx.strokeStyle='#f6bd6b';ctx.lineWidth=.9;ctx.globalAlpha=1-t/.48;for(let n=0;n<9;n++){const a=n*2.399,r=9+t*53;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r*.68,f.y-10+Math.sin(a)*r*.48);ctx.lineTo(x+Math.cos(a)*r,f.y-10+Math.sin(a)*r*.68);ctx.stroke()}ctx.globalAlpha=1}ctx.fillStyle='#7c7268';ctx.globalAlpha=Math.sin(t*Math.PI)*.18*power;for(let n=0;n<3;n++){ctx.beginPath();ctx.ellipse(x+(n-1)*(4+t*10),f.y-10-t*32,5+t*8,6+t*9,0,0,Math.PI*2);ctx.fill()}
 }ctx.restore();
}
const destructionAtmosphere=hdAtmosphere;
hdAtmosphere=function(){destructionAtmosphere();for(const f of arcadeBlasts)drawArcadeBlast(f)};
const destructionSound=renderEffect;
renderEffect=function(rig,output,name,at,hero){if(name==='break'&&breakMaterial){const m=breakMaterial;if(m==='glass'||m==='ice'){noiseBurst(rig,output,at,.19,.11,4100,'highpass');for(const [n,hz]of [2200,3150,4100].entries())tone(rig,output,at+n*.018,hz,.12,.025,'glass',hz*.8);return}if(m==='stone'||m==='ceramic'){noiseBurst(rig,output,at,.16,.14,1300);tone(rig,output,at,240,.07,.065,'triangle',110);return}}
 if(name==='fuseTick'){tone(rig,output,at,1150,.035,.025,'triangle',900);return}destructionSound(rig,output,name,at,hero)};
Object.assign(DragonCampaign,{destruction:{material:materialOf,fragments:createFragments,update:updateDestruction,blasts:arcadeBlasts,explode:arcadeExplosion}});
