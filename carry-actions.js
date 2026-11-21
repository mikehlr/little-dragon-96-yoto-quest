'use strict';
// Authored anticipation/contact/recovery on the same physics timeline as damage and release.
const CARRY_ACTION_HANDS={
 1:{12:[.64,.63],13:[.65,.55],14:[.67,.50],15:[.65,.63],20:[.65,.62],21:[.61,.52],22:[.75,.47],23:[.65,.62]},
 2:{12:[.63,.64],13:[.65,.56],14:[.67,.51],15:[.65,.64],20:[.65,.64],21:[.62,.51],22:[.76,.49],23:[.65,.64]}
};
const CARRY_AIR_HANDS={1:[[.66,.60],[.65,.55],[.79,.49],[.65,.60],[.65,.63],[.65,.60],[.65,.57],[.65,.57]],2:[[.66,.62],[.65,.57],[.80,.48],[.66,.62],[.64,.63],[.65,.62],[.65,.61],[.65,.59]]};
function carryActionPhase(age,times){let frame=0;while(frame<times.length&&age>=times[frame])frame++;return frame}
function carryActionRig(p){
 const hero=p.hero||p.id,item=p.carry||p.toss||(['punch','airClub'].includes(p.act)?p.swing:null)||(['throw','airThrow','jump'].includes(p.act)?p.carryAction?.item:null);
 if(!item||p.hp<=0||!READY(images['carry-actions-'+hero]))return null;
 const club=item.kind==='club';let frame,airSheet=false,hand=null,imageOverride=null,height=DRAGON_CARRY_META[hero].height;
 if(p.act==='punch'&&club)frame=item.uses>0?carryActionPhase(p.age,[.035,.095,.16,.235,.265,.295,.32]):23;
 else if(p.act==='airClub'&&club&&item.uses<=0){airSheet=true;frame=(hero-1)*4+3;height*=.90}
 else if(p.act==='airClub'&&club&&item.uses>0){const phase=carryActionPhase(p.age,[.09,.20,.30,.37]);frame=hero===1?[16,17,18,19,19][phase]:[16,16,17,18,19][phase]}
 else if(p.act==='jump'&&p.carry){const base=club?8:12;frame=base+(p.age<.045?0:p.vz>70?1:p.vz< -100&&p.z<20?1:2)}
 else if(p.act==='land'&&p.carry){if(club){if(p.age>=.09){imageOverride=images['carry-bridge-'+hero];frame=0}else frame=p.age<.045?11:8}else{airSheet=true;frame=8+(hero-1)*4+Math.min(3,Math.floor(p.age/.14*4));hand=CARRY_AIR_HANDS[hero][4+frame%4]}}
 else if(p.act==='throw'||p.act==='airThrow'){
  const phase=carryActionPhase(p.age,[.035,.095,.20]);
  if(p.act==='airThrow'){airSheet=true;frame=(hero-1)*4+phase;hand=CARRY_AIR_HANDS[hero][phase];height*=.90}
  else frame=20+phase;
 }else if(p.act==='jump'&&!p.carry&&p.carryAction?.air){airSheet=true;frame=(hero-1)*4+3;height*=.90}
 else return null;
 const image=imageOverride||images[airSheet?'carry-air-load':'carry-actions-'+hero];if(!READY(image))return null;
 const throwClub=club&&['throw','airThrow'].includes(p.act);
 if((!club||throwClub)&&!hand)hand=CARRY_ACTION_HANDS[hero][frame];
 return {image,frame,rows:airSheet||imageOverride?4:6,height,anchor:.975,hand,box:hand?[hand[0]-.13,hand[1]-.065,.26,.13]:null,item,club,throwClub,held:!!(p.carry||p.toss)};
}
const actionCarryAction=action;
action=function(p,name){const item=p?.carry,previous=p?.act;const result=actionCarryAction(p,name);if(item&&p.act!==previous&&['punch','jump','throw','airClub','airThrow'].includes(p.act))p.carryAction={item,air:p.z>0};return result};
const actionCarryUpdate=updatePlayer;
updatePlayer=function(p,dt){actionCarryUpdate(p,dt);if(!['punch','jump','land','throw','airClub','airThrow'].includes(p.act)||p.hp<=0)delete p.carryAction};
const actionCarryBody=drawHeroFrame;
drawHeroFrame=function(p){const rig=carryActionRig(p);if(!rig)return actionCarryBody(p);const im=rig.image,sw=im.naturalWidth/4,sh=im.naturalHeight/rig.rows,h=rig.height,w=h*sw/sh;
 if(rig.throwClub&&rig.held){const image=images.items,cell=image.naturalWidth/5,size=ITEM.club.width;ctx.save();ctx.translate((rig.hand[0]-.5)*h,(rig.hand[1]-rig.anchor)*h);ctx.rotate(1.10);ctx.drawImage(image,0,cell,cell,cell,-size*.225,-size*.685,size,size);ctx.restore()}
 ctx.drawImage(im,rig.frame%4*sw,Math.floor(rig.frame/4)*sh,sw,sh,-w*.5,-h*rig.anchor,w,h);
 if(!rig.club&&rig.held&&rig.hand)drawRegisteredLoad(p,rig.item,rig);
};
const actionCarryProp=drawCarried;
drawCarried=function(p,item){if(carryActionRig(p))return;return actionCarryProp(p,item)};
const actionCarryRelease=releaseProp;
releaseProp=function(p){const item=p.toss,rig=carryActionRig(p);actionCarryRelease(p);if(item&&rig?.hand&&item.flight?.owner===p){const x=(rig.hand[0]-.5)*rig.height,y=(rig.hand[1]-rig.anchor)*rig.height;
 if(item.kind==='club'){const a=1.10,size=ITEM.club.width,hx=-.275*size,hy=.185*size,rx=Math.cos(a)*hx-Math.sin(a)*hy,ry=Math.sin(a)*hx+Math.cos(a)*hy;item.x=p.x+p.face*(x-rx);item.z=p.z-y+ry;item.flight.spin=a*p.face;item.flight.registeredClub=true;item.flight.carryMirror=p.face}
 else{item.x=p.x+p.face*(x+2);item.z=p.z-y-9}
}};
const actionCarryItem=drawItem;
drawItem=function(item){if(item.kind!=='club'||!item.flight?.registeredClub)return actionCarryItem(item);const x=item.x-game.camera,size=ITEM.club.width;if(x< -size||x>WIDTH+size)return;shadow(x,item.y+1,size*.31,.24);const im=images.items,cell=im.naturalWidth/5,face=item.flight.carryMirror;ctx.save();ctx.translate(x,item.y-item.z);ctx.scale(face,1);ctx.rotate(item.flight.spin*face);ctx.drawImage(im,0,cell,cell,cell,-size/2,-size/2,size,size);ctx.restore()};
DragonCarry.actions={version:'2.16',rig:carryActionRig};
DragonCarry.actions.review=function(hero,kind,t){
 game.level=0;game.camera=game.arenaCamera=0;game.gate='fight';game.enemies=[];game.items=[];game.shots=[];game.hazards=[];game.particles=[];game.districtTitle=0;townSpeech=null;
 const h=Object.assign(player(1),{hero,x:240,y:235,inv:0});const give=()=>{h.carry=makeItem(kind,0,0);h.carry.nativeLevel=0;h.carryAction=null;h.carryFlow=null};give();game.players=[h];game.mode='play';
 let ground=false,jump=false,air=false,second=false,secondJump=false;
 for(let age=0;age<t;){const dt=Math.min(.016,t-age);age+=dt;
  if(age>=.4&&!ground){action(h,'attack');ground=true}
  if(age>=1.15&&!jump){give();action(h,'jump');jump=true}
  if(age>=1.40&&!air){action(h,'attack');air=true}
  if(age>=2.5&&!second){give();second=true}
  if(age>=2.7&&!secondJump){action(h,'jump');secondJump=true}
  updatePlayer(h,dt);updateItems(dt);
 }
 game.mode='pause';screen.hidden=true;game.clock=t;draw();
};
