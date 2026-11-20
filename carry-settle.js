'use strict';
// Authored weight transfers: input/physics stay immediate; only the displayed gait settles.
const CARRY_BRIDGE_TIME=.16, CARRY_BRAKE_FRAME=.028;
const CARRY_BRIDGE_HANDS={
 1:[[.708,.606],[.707,.587],[.700,.536],[.716,.516],[.702,.607],[.710,.592],[.708,.570],[.710,.554]],
 2:[[.667,.603],[.684,.564],[.683,.520],[.697,.514],[.667,.627],[.680,.604],[.683,.585],[.707,.569]]
};
function canSettleCarry(p){return !!p.carry&&p.hp>0&&!(p.z>0)&&['idle','walk'].includes(p.act)&&READY(images['carry-bridge-'+(p.hero||p.id)])}
function advanceCarrySettle(p,dt,distance){
 if(!canSettleCarry(p)){delete p.carryFlow;return}
 let s=p.carryFlow;
 if(!s||s.item!==p.carry||s.hero!==(p.hero||p.id)){
  s=p.carryFlow={item:p.carry,hero:p.hero||p.id,mode:'idle',row:0,progress:0,phase:0};
 }
 const moving=p.act==='walk';
 if(moving){
  if(s.mode==='idle'||s.mode==='settle'){s.mode='start'}
  else if(s.mode==='brake')s.mode='walk';
  if(s.mode==='start'){
   s.progress=Math.min(1,s.progress+dt/CARRY_BRIDGE_TIME);
   if(s.progress>=1){s.mode='walk';s.phase=s.row}
  }else s.phase=(s.phase+distance/7.5)%8;
 }else{
  if(s.mode==='start')s.mode='settle';
  else if(s.mode==='walk'){
   s.mode='brake';s.end=Math.ceil((s.phase-.00001)/4)*4;
   if(s.end<s.phase)s.end+=4;
  }
  if(s.mode==='brake'){
   s.phase=Math.min(s.end,s.phase+dt/CARRY_BRAKE_FRAME);
   if(s.phase>=s.end){s.row=s.end%8;s.phase=s.row;s.progress=1;s.mode='settle'}
  }else if(s.mode==='settle'){
   s.progress=Math.max(0,s.progress-dt/CARRY_BRIDGE_TIME);
   if(s.progress<=0)s.mode='idle';
  }
 }
}
const settlePlayerUpdate=updatePlayer;
updatePlayer=function(p,dt){const stride=p.stride;settlePlayerUpdate(p,dt);advanceCarrySettle(p,dt,Math.max(0,p.stride-stride))};
const settleWalkFrame=carryWalkFrame;
carryWalkFrame=function(p){const s=p.carryFlow;return s&&s.item===p.carry&&['walk','brake'].includes(s.mode)?(p.carry.kind==='club'?0:8)+Math.floor(s.phase)%8:settleWalkFrame(p)};
DragonCarry.frame=carryWalkFrame;
function carryBridgeRig(p){
 const s=p.carryFlow,hero=p.hero||p.id,row=s?.item===p.carry?s.row:0,progress=s?.item===p.carry?s.progress:0;
 const local=row+Math.min(3,Math.floor(progress*4)),club=p.carry.kind==='club',frame=(club?0:8)+local;
 const hand=club?null:CARRY_BRIDGE_HANDS[hero][local],m=DRAGON_CARRY_META[hero];
 return {image:images['carry-bridge-'+hero],frame,height:m.height,anchor:.975,hand,box:hand?[hand[0]-.13,hand[1]-.065,.26,.13]:null};
}
const settleHeroFrame=drawHeroFrame;
drawHeroFrame=function(p){
 if(!canSettleCarry(p))return settleHeroFrame(p);
 const s=p.carryFlow;
 if(s?.item===p.carry&&s.mode==='brake')return settleHeroFrame({...p,act:'walk'});
 if(p.act==='walk'&&(!s||s.mode==='walk'))return settleHeroFrame(p);
 const rig=carryBridgeRig(p),im=rig.image,sw=im.naturalWidth/4,sh=im.naturalHeight/4,h=rig.height,w=h*sw/sh;
 ctx.drawImage(im,rig.frame%4*sw,Math.floor(rig.frame/4)*sh,sw,sh,-w*.5,-h*rig.anchor,w,h);
 if(p.carry.kind!=='club')drawRegisteredLoad(p,p.carry,rig);
};
DragonCarry.settle={version:'2.15',advance:advanceCarrySettle,rig:carryBridgeRig,duration:CARRY_BRIDGE_TIME};
DragonCarry.settle.review=function(hero,kind,t){
 const p=Object.assign(player(1),{hero,x:190,y:235,inv:0});p.carry=makeItem(kind,0,0);p.carry.nativeLevel=0;
 for(let age=0;age<t;){const dt=Math.min(.016,t-age);age+=dt;const moving=age>=.5&&age<1.8||age>=2.5&&age<2.65||age>=2.72&&age<4;
  p.act=moving?'walk':'idle';p.face=age<2.72?1:-1;const distance=moving?dt*90:0;p.stride+=distance;p.x+=distance*p.face;advanceCarrySettle(p,dt,distance);
 }
 game.players=[p];game.clock=t;draw();
};
