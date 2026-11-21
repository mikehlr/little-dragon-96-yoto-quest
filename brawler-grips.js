'use strict';
// Hand registrations are measured inside a fixed native body camera, never body rescaling.
const LOAD_HANDS={"1":[{"x":0.69586,"y":0.53035,"box":[0.59602,0.45743,0.19968,0.15543]},{"x":0.69649,"y":0.53355,"box":[0.598,0.45423,0.19696,0.16502]},{"x":0.69649,"y":0.53035,"box":[0.598,0.45743,0.19696,0.15224]},{"x":0.70223,"y":0.53355,"box":[0.59602,0.46062,0.21242,0.15224]},{"x":0.69586,"y":0.53822,"box":[0.59602,0.46545,0.19968,0.15191]},{"x":0.70128,"y":0.53822,"box":[0.598,0.45908,0.20655,0.15828]},{"x":0.69649,"y":0.53822,"box":[0.598,0.46545,0.19696,0.15828]},{"x":0.70541,"y":0.5414,"box":[0.59602,0.46226,0.21879,0.15828]}],"2":[{"x":0.67994,"y":0.53355,"box":[0.59602,0.45104,0.16783,0.15543]},{"x":0.67891,"y":0.53355,"box":[0.598,0.45423,0.16182,0.15224]},{"x":0.68051,"y":0.53674,"box":[0.598,0.45104,0.16502,0.15863]},{"x":0.68153,"y":0.54313,"box":[0.59602,0.46062,0.17102,0.15543]},{"x":0.67994,"y":0.53503,"box":[0.59602,0.45271,0.16783,0.15828]},{"x":0.67891,"y":0.52866,"box":[0.598,0.44952,0.16182,0.1551]},{"x":0.68051,"y":0.52866,"box":[0.598,0.44634,0.16502,0.1551]},{"x":0.68153,"y":0.52866,"box":[0.59602,0.44952,0.17102,0.1551]}]};
Object.assign(AIR_HANDS[1],{4:[.605,.825],6:[.605,.550],8:[.625,.470],13:[.665,.505],14:[.665,.550],15:[.665,.505]});
Object.assign(AIR_HANDS[2],{4:[.570,.855],6:[.580,.540],8:[.480,.460],13:[.650,.510],14:[.650,.550],15:[.660,.490]});
function registeredCarry(p){if(['airClub','airThrow'].includes(p.act))return false;const i=p.carry||p.toss||(p.act==='punch'?p.swing:null);return !!i&&(DragonCarry.uses(p)||carryPose(p)>=0)}
const registeredBody=drawHeroFrame,registeredProp=drawCarried;
const registeredAction=action;
action=function(p,name){if(p?.carry&&p.z===0&&['attack','punch','kick'].includes(name))name='punch';return registeredAction(p,name)};
carryObjectUnderlay=function(){};
drawHeroFrame=function(p){if(!registeredCarry(p))return registeredBody(p);const i=p.carry||p.toss||p.swing;if(DragonCarry.uses(p)&&i.kind==='club')return registeredBody(p);
 if(i.kind==='club'){drawRegisteredClub(p);return registeredBody(p)}
 registeredBody(p);drawRegisteredLoad(p,i);
};
drawCarried=function(p,i){if(registeredCarry(p))return;return registeredProp(p,i)};
function drawRegisteredClub(p){const frame=carryPose(p),g=airGrip(p,frame),hero=p.hero||p.id,front=frame===4?(hero===1?[.63,.83]:[.64,.85]):[5,6].includes(frame)?(hero===1?[.665,.55]:[.64,.52]):null;if(front){g.x+=(front[0]-AIR_HANDS[hero][frame][0])*g.size;g.y+=(front[1]-AIR_HANDS[hero][frame][1])*g.size}let angle=frame===8?1.10:-.6;if(frame===10)angle=-1.7+p.age*.8;else if(frame===11)angle=mix(.25,1.25,clamp((p.age-.15)/.10,0,1));else if(frame===12)angle=1.5;else if(frame===4)angle=-.2;else if(frame===14)angle=-1.0;else if(frame===15)angle=.5;
 const im=images.items,cell=im.naturalWidth/5,size=36;ctx.save();ctx.translate(g.x,g.y);ctx.rotate(angle);ctx.drawImage(im,0,cell,cell,cell,-size*.225,-size*.685,size,size);ctx.restore()}
function drawRegisteredLoad(p,i,rig=null){const hero=p.hero||p.id,walk=DragonCarry.uses(p),frame=rig?rig.frame:walk?carryWalkFrame(p):carryPose(p),im=rig?rig.image:images[walk?'carry-walk-'+hero:'carry-'+hero];let size,anchor,center,hand,box;
 if(rig){size=rig.height;anchor=rig.anchor;center=.5;hand=rig.hand;box=rig.box}
 else if(walk){const m=DRAGON_CARRY_META[hero];size=m.height;anchor=m.anchor;center=m.center;const v=LOAD_HANDS[hero][frame-8];hand=[v.x,v.y];box=v.box}
 else{const m=DRAGON_SPRITE_CAMERA['carry-'+hero];size=HERO_SIZE*m.scale;anchor=m.anchor;center=.5;hand=AIR_HANDS[hero][frame];box=[Math.max(0,hand[0]-.13),hand[1]-.06,.26,.12]}
 if(!hand)return;const x=(hand[0]-center)*size,y=(hand[1]-anchor)*size,forward=frame===7&&!walk&&!rig?10:2,root=y+(walk&&!rig?7:9);
 ctx.save();ctx.translate(x+forward,root);if(i.kind==='waterBlaster')globalThis.DragonSurprises?.drawGunAtHand(-2,-9,28);else if(i.kind==='regionCrate')directorProp(0,i.nativeLevel,0,0,29);else if(i.kind==='bonusBarrel')bonusSprite(0,0,0,29);else if(i.kind==='glassJar')drawGlassJar({x:game.camera,y:0,held:true});else if(i.kind==='powderBarrel')drawPowderBarrel({x:game.camera,y:0,held:true});else if(i.kind==='storyChest'||i.kind==='storyUrn')roadSprite(i.kind==='storyChest'?0:2,0,0,29,29);else stamp(images.items,ITEM[i.kind].sprite,5,29);ctx.restore();
 if(i.kind==='regionCrate'&&i.storyCardKey){ctx.save();ctx.translate(x+forward,root);globalThis.DragonCollection?.drawCacheMark(0,-9,6);ctx.restore()}
 const sw=im.naturalWidth/4,sh=im.naturalHeight/(rig?.rows||4),[bx,by,bw,bh]=box;ctx.drawImage(im,(frame%4+bx)*sw,(Math.floor(frame/4)+by)*sh,bw*sw,bh*sh,(bx-center)*size,(by-anchor)*size,bw*size,bh*size);
}
