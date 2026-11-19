'use strict';
// Fixed cameras, authored inbetweens and ground-scale environmental detail.
drawGate=function(){};
const MOTION_FOES=new Set([0,3,6,11,12,13,14,15,16,17,18,19]);
const motionEnemyUpdate=updateEnemy;
updateEnemy=function(e,dt,living){const x=e.x,y=e.y;motionEnemyUpdate(e,dt,living);if(e.act==='walk')e.stride=(e.stride||0)+Math.hypot(e.x-x,e.y-y)};
function foeMotionFrame(e){
 if(e.act==='fall')return 15;
 if(e.act==='hit')return 14;
 if(e.act==='walk')return 1+Math.floor((e.stride||0)/Math.max(3.5,e.size*.15))%8;
 if(e.act==='tell'||e.act==='phase'){const duration=e.move?.plan.tell||.7;return e.age<duration*.58?9:10}
 if(e.act==='attack'){
  if(e.storyFoe)return 11+Math.min(2,Math.floor(e.age/Math.max(.01,e.move?.plan.active||.4)*3));
  const tell=.36*difficultyRules().tell;return e.age<tell?(e.age<tell*.6?9:10):11+Math.min(2,Math.floor((e.age-tell)/.37*3));
 }
 if(e.act==='recover')return e.age<.18?13:0;
 return 0;
}
const motionDrawFoe=drawFoe;
drawFoe=function(e){const im=images['foe-motion-'+e.type];if(!MOTION_FOES.has(e.type)||e.boss||(!e.storyFoe&&e.kit)||!READY(im))return motionDrawFoe(e);if(e.entry&&!e.entry.started)return;const fall=e.act==='fall'?clamp(e.age*3.4,0,1):0,x=e.x-game.camera,y=e.y-(e.z||0);if(fall>=1||x<-100||x>WIDTH+100)return;const index=e.type-12,mult=e.storyFoe?(index===2?1.50:index===5?1.9:1.72):1.35,meta=globalThis.DRAGON_MOTION_META?.foes?.[e.type]||{scale:1,anchor:.93,center:.5},size=e.size*mult*meta.scale,cell=im.naturalWidth/4,cellH=im.naturalHeight/4,frame=foeMotionFrame(e);shadow(x,e.y,size*.23,e.z?.3:.48);ctx.save();ctx.translate(x,y);ctx.scale(e.face,1);if(fall){ctx.globalAlpha=1-fall;ctx.translate(0,fall*2)}if(e.act==='hit'&&e.age<.07)ctx.filter='brightness(1.3)';ctx.drawImage(im,frame%4*cell,Math.floor(frame/4)*cellH,cell,cellH,-size*cell/cellH*meta.center,-size*meta.anchor,size*cell/cellH,size);ctx.restore();if(e.hp&&e.hp<e.maxHp){pixel(x-11,y-size-4,22,2,'#132335');pixel(x-11,y-size-4,22*e.hp/e.maxHp,2,e.kit?.color||'#ffe29b')}if(e.storyFoe&&e.act==='tell')label(e.kit.name,x,y-size-8,5.5,e.kit.color,'center')};

const groundTheme=[[0,1,2,3,11,12,13],[0,1,4,5,6,7],[3,8,9,10,11,8],[2,11,12,13,15],[0,6,12,14,15]];
const GROUND_DETAILS=STAGES.map((_,level)=>Array.from({length:74},(_,i)=>{const types=groundTheme[level],frame=types[(i*7+Math.floor(i/4))%types.length];return {frame,x:65+i*101+(i*37+level*29)%53,y:198+(i*19+level*7)%44,w:[48,42,77,36,45,55,74,73,42,35,59,35,67,74,85,64][frame],phase:i*.71}}));
function detailSprite(frame,x,y,w,h){const im=images['ground-details'];if(!READY(im))return;const cell=im.naturalWidth/4,cellH=im.naturalHeight/4;ctx.drawImage(im,frame%4*cell,Math.floor(frame/4)*cellH,cell,cellH,x-w/2,y-h/2,w,h)}
const floorTiles=new Map();
function prepareFloorTiles(){for(let level=0;level<5;level++){const im=images['floor-variants-'+level];if(!READY(im))continue;for(let variant=0;variant<3;variant++){const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=Math.round(im.naturalHeight/3);const g=c.getContext('2d');g.drawImage(im,0,variant*im.naturalHeight/3,im.naturalWidth,im.naturalHeight/3,0,0,c.width,c.height);g.globalCompositeOperation='destination-in';const mask=g.createLinearGradient(0,0,c.width,0);mask.addColorStop(0,'#fff0');mask.addColorStop(.027,'#ffff');mask.addColorStop(.973,'#ffff');mask.addColorStop(1,'#fff0');g.fillStyle=mask;g.fillRect(0,0,c.width,c.height);floorTiles.set(level+':'+variant,c)}}}
const motionPavement=drawPavement;
drawPavement=function(){motionPavement();const tile=600,first=Math.floor(game.camera/tile)-1;for(let i=first;i<first+4;i++){const variant=((i*7+Math.floor(i/3)+game.level)%3+3)%3,im=floorTiles.get(game.level+':'+variant);if(!im)continue;const x=i*tile-game.camera-17;ctx.save();ctx.translate(x,0);if(i%2){ctx.translate(tile+34,0);ctx.scale(-1,1)}ctx.drawImage(im,0,GROUND_Y,tile+34,HEIGHT-GROUND_Y);ctx.restore()}const shade=ctx.createLinearGradient(0,GROUND_Y,0,HEIGHT);shade.addColorStop(0,'#10182c69');shade.addColorStop(.3,'#17203a05');shade.addColorStop(1,'#100d2026');ctx.fillStyle=shade;ctx.fillRect(0,GROUND_Y,WIDTH,HEIGHT-GROUND_Y);for(const prop of GROUND_DETAILS[game.level]){const x=prop.x-game.camera;if(x<-90||x>WIDTH+90)continue;const h=prop.w*(prop.frame===9?.60:.34);ctx.save();ctx.translate(x,prop.y);if(prop.frame===3&&!hdPrefs.calm)ctx.rotate(Math.sin(game.clock*.7+prop.phase)*.035);detailSprite(prop.frame,0,0,prop.w,h);if(prop.frame===6&&hdPrefs.lighting){const t=hdPrefs.calm?0:game.clock;ctx.strokeStyle='#b5ddeb44';ctx.lineWidth=.35;for(let i=0;i<3;i++){const v=(t*.25+i/3)%1;ctx.globalAlpha=(1-v)*.32;ctx.beginPath();ctx.ellipse(0,0,prop.w*.38*v,h*.32*v,0,0,Math.PI*2);ctx.stroke()}}ctx.restore()}};

Object.assign(ITEM,{bonusBarrel:{width:34,hp:27},brokenBarrel:{width:34},energyFlask:{width:20},coinCache:{width:24},treasureBeetle:{width:22}});
const motionBreakItem=breakItem;
breakItem=function(item){if(item.gone)return;const barrel=item.kind==='bonusBarrel';motionBreakItem(item);if(barrel){game.items.push({...makeItem('brokenBarrel',item.x,item.y),decor:true});if(Math.floor(item.x)%3===0)game.items.push({...makeItem('treasureBeetle',item.x,item.y),bonusLife:8,direction:item.x-game.camera>WIDTH*.6?-1:1})}};
const motionUpdateItems=updateItems;
updateItems=function(dt){motionUpdateItems(dt);for(const item of game.items)if(item.kind==='treasureBeetle'){item.bonusLife-=dt;item.x+=item.direction*37*dt;const lo=game.camera+24,hi=game.camera+WIDTH-24;if(item.x<lo||item.x>hi){item.x=clamp(item.x,lo,hi);item.direction*=-1}if(item.bonusLife<=0)item.gone=true}game.items=game.items.filter(i=>!i.gone)};
const motionStageItems=stageItems;
stageItems=function(level){const items=motionStageItems(level);let count=0;for(const item of items)if(item.hp&&++count%6===0){item.kind='bonusBarrel';item.hp=27;item.loot=count%12===0?'coinCache':'energyFlask'}return items};
function bonusSprite(frame,x,y,w){const im=images['bonus-props'];if(!READY(im))return;const cell=im.naturalWidth/4;ctx.drawImage(im,frame%4*cell,Math.floor(frame/4)*cell,cell,cell,x-w/2,y-w*.94,w,w)}
const motionDrawItem=drawItem;
drawItem=function(item){if(!['bonusBarrel','brokenBarrel','energyFlask','coinCache','treasureBeetle'].includes(item.kind))return motionDrawItem(item);const beetle=item.kind==='treasureBeetle',x=item.x-game.camera,y=item.y-(item.z||0)-(beetle?5+Math.sin(game.clock*9)*1.5:0),w=ITEM[item.kind].width;if(item.gone||x<-50||x>WIDTH+50)return;shadow(x,item.y,w*.27,.32);ctx.save();ctx.translate(x,y);if(beetle){ctx.scale(item.direction,1);ctx.globalAlpha=clamp(item.bonusLife,0,1)}if(item.flight)ctx.rotate(item.flight.spin);bonusSprite(item.kind==='bonusBarrel'?0:item.kind==='brokenBarrel'?1:item.kind==='energyFlask'?5:beetle?3:7,0,0,w);ctx.restore()};
const motionDrawCarried=drawCarried;
drawCarried=function(p,prop){if(prop.kind!=='bonusBarrel')return motionDrawCarried(p,prop);const [x,y,turn]=heldPropPose(p,false);ctx.save();ctx.translate(x*HERO_SCALE,y*HERO_SCALE);ctx.rotate(turn);bonusSprite(0,0,14,34);ctx.restore()};
const motionPickup=pickupAction;
pickupAction=function(p){if(p.z>11||MOVE_TIME[p.act]||p.carry||rescueTarget(p))return motionPickup(p);const item=nearbyItem(p);if(['energyFlask','coinCache','treasureBeetle'].includes(item?.kind)){game.items=game.items.filter(i=>i!==item);if(item.kind==='energyFlask'){p.energy=Math.min(100,p.energy+32);game.bonusNotice={text:'+32 ΕΝΕΡΓΕΙΑ',until:game.clock+1.3};effect('heal',p.id)}else{const value=item.kind==='treasureBeetle'?750:500;game.score+=value;game.bonusNotice={text:item.kind==='treasureBeetle'?'ΧΡΥΣΟ ΣΚΑΘΑΡΙ +750':'+500',until:game.clock+1.3};effect('reward',p.id)}spark(p.x,p.y-20,item.kind==='energyFlask'?'#87dcff':'#ffdf87',12);return}motionPickup(p)};
const motionHud=hud;
hud=function(){motionHud();if(game.bonusNotice?.until>game.clock){const fade=Math.min(1,(game.bonusNotice.until-game.clock)*3);ctx.save();ctx.globalAlpha=fade;label(game.bonusNotice.text,WIDTH/2,HEIGHT-13,8,'#ffe3a0','center');ctx.restore()}};

function storyMotionSample(index,t){
 if(hdPrefs.calm)return {frame:index===1?11:0,x:0,y:0};
 const rate=10;
 if(index===1){const local=Math.max(0,t-.4);return {frame:Math.min(11,Math.floor(local*rate)),x:Math.pow(clamp((t-2.4)/1.7,0,1),2)*1.15,y:0}}
 // Twelve authored neighboring poses, followed by a short planted rest.
 const sequence=index===0?[0,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1]:Array.from({length:12},(_,i)=>i);
 const period=index===3?2.6:index===2?2.8:2.1,local=t%period;
 return {frame:sequence[Math.min(sequence.length-1,Math.floor(local*rate))],x:0,y:0};
}
drawStory=function(){const target=panel.querySelector('.story-canvas');if(!target)return;const g=target.getContext('2d'),index=storyIndex,bg=images['cinema-bg-'+(index+1)],actors=images['story-motion-'+(index+1)];if(!READY(bg)||!READY(actors))return;const w=target.width,h=target.height;g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.fillStyle='#12182b';g.fillRect(0,0,w,h);const t=hdPrefs.calm?0:storyTime,pan=hdPrefs.calm?0:Math.sin(Math.min(t,7)/7*Math.PI*.5)*8,zoom=hdPrefs.calm?1:1+Math.min(t,7)*.0014;g.save();g.translate(w/2,h/2);g.scale(zoom,zoom);g.translate(-w/2-pan,-h/2);g.drawImage(bg,-12,-8,w+24,h+16);const sample=storyMotionSample(index,t),sw=actors.naturalWidth/2,rows=globalThis.DRAGON_MOTION_META?.storyRows?.[index],row=Math.floor(sample.frame/2),sy=rows?rows[row]:row*actors.naturalHeight/6,sh=rows?rows[row+1]-sy:actors.naturalHeight/6;g.drawImage(actors,sample.frame%2*sw,sy+1,sw,sh-2,sample.x*w,(globalThis.DRAGON_MOTION_META?.storyRowOffsets?.[index]?.[row]||0)*w/sw,w,w*(sh-2)/sw);g.restore();
 if(!hdPrefs.calm&&storyTime>.68&&storyTime<1.18){const words=['ΚΛΙΚ!','ΧΡΑΠ!','ΩΧ!','ΠΑΜΕ!','ΧΑ ΧΑ!'],u=clamp((storyTime-.68)/.18,0,1),scale=.8+.2*Math.sin(u*Math.PI/2);g.save();g.translate(w*.79,h*.21);g.rotate(-.08);g.scale(scale,scale);g.font='900 64px Trebuchet MS';g.textAlign='center';g.lineWidth=9;g.strokeStyle='#18213d';g.strokeText(words[index],0,0);g.fillStyle='#ffe0a1';g.fillText(words[index],0,0);g.restore();if(!storySound){effect(index===1?'throw':index===2?'warning':index===4?'reward':'pickup');storySound=true}}
};
const motionReady=hdAssetReady.then(()=>{prepareFloorTiles();document.documentElement.dataset.motionReady='true'});
globalThis.DragonMotion={version:'2.5',ready:motionReady,foeFrame:foeMotionFrame,storySample:storyMotionSample,ground:GROUND_DETAILS};
