'use strict';
MOVE_TIME.airClub=.43;MOVE_TIME.airThrow=.36;
const brawlAirAction=action;
action=function(p,name){if(p&&game.mode==='play'&&p.z>0&&p.carry&&['attack','punch','kick','pickup'].includes(name)){
 if(p.hp<=0||p.airKickUsed||MOVE_TIME[p.act])return;p.face=Math.sign(moveX(p))||p.face;p.airKickUsed=true;p.airHeldActive=true;p.hit=new Set();p.spent=false;p.charge=0;p.chargeSpent=true;p.running=false;
 if(p.carry.kind==='club'&&name!=='pickup'){p.swing=p.carry;pose(p,'airClub');effect('punchSwing',p.id)}else{p.toss=p.carry;p.carry=null;pose(p,'airThrow');p.fired=false}return}brawlAirAction(p,name)};
const brawlAirUpdate=updatePlayer;
updatePlayer=function(p,dt){brawlAirUpdate(p,dt);if(p.act==='airClub'){
 if(p.age>=.20&&p.age<.32){if(!p.spent){p.spent=true;p.swing.uses--;if(p.swing.uses<=0)p.carry=null}for(const e of game.enemies){const d=(e.x-p.x)*p.face;if(d>-4&&d<57+e.size*.27&&Math.abs(e.y-p.y)<22&&canHitEnemy(e,p.z))damage(e,p,36,p.hit,p.face,'club')}if(p.z<24)hitItems(p,p.hit,p.x,p.y,63,36,p.face)}
 if(p.z<=0){pose(p,'land');p.swing=null}
 }else if(p.act==='airThrow'){if(p.age>=.11&&!p.fired&&p.toss){p.fired=true;releaseProp(p)}if(p.z<=0){if(p.toss&&!p.fired){p.fired=true;releaseProp(p)}pose(p,'land')}}if(p.airHeldActive){if(p.z>0&&p.act==='idle')pose(p,'jump');if(p.z<=0)p.airHeldActive=false}
};
const brawlRelease=releaseProp;
releaseProp=function(p){brawlRelease(p);const i=game.items.at(-1);if(i?.flight?.owner===p){i.z+=p.z;if(p.act==='airThrow'||p.act==='throw'){const g=airGrip(p,7);i.x=p.x+p.face*(g.x+10);i.z=p.z-g.y-9}}};
function brawlAirProxy(p){return {...p,act:p.act==='airClub'?'punch':'throw',age:p.age*(p.act==='airClub'?MOVE_TIME.punch/MOVE_TIME.airClub:1)}}
const brawlAirFrame=drawHeroFrame;
drawHeroFrame=function(p){if(p.act==='airClub'){drawAirClub(p);return brawlAirFrame(brawlAirProxy(p))}if(p.act==='airThrow'){brawlAirFrame(brawlAirProxy(p));if(p.toss){drawAirPayload(p);restoreAirPalms(p)}return}return brawlAirFrame(p)};
const brawlAirHeld=drawCarried;
drawCarried=function(p,i){if(p.act==='airClub'||p.act==='airThrow')return;return brawlAirHeld(p,i)};
const brawlHeldPose=heldPropPose;
heldPropPose=function(p,club){return brawlHeldPose(p.act==='airClub'||p.act==='airThrow'?brawlAirProxy(p):p,club)};

// Native hand registration on the already-authored carry atlas. The body camera never changes.
const AIR_HANDS={1:{10:[.243,.270],11:[.810,.457],12:[.583,.747],5:[.605,.550],7:[.840,.450]},2:{10:[.283,.177],11:[.783,.407],12:[.590,.676],5:[.560,.540],7:[.820,.400]}};
function airGrip(p,frame){const hero=p.hero||p.id,m=DRAGON_SPRITE_CAMERA['carry-'+hero],size=HERO_SIZE*m.scale,g=AIR_HANDS[hero][frame];return {x:(g[0]-.5)*size,y:(g[1]-m.anchor)*size,size,frame,hero}}
function drawAirClub(p){if(!p.swing||p.age>=.43)return;const age=brawlAirProxy(p).age,frame=age<.15?10:age<.25?11:12,g=airGrip(p,frame),angle=frame===10?-1.7+age*.8:frame===11?mix(.25,1.25,(age-.15)/.10):1.5,im=images.items,cell=im.naturalWidth/5,size=36;ctx.save();ctx.translate(g.x,g.y);ctx.rotate(angle);ctx.drawImage(im,0,cell,cell,cell,-size*.225,-size*.685,size,size);ctx.restore()}
function drawAirPayload(p){const g=airGrip(p,p.age<.085?5:7),i=p.toss;ctx.save();ctx.translate(g.x+(g.frame===7?10:2),g.y+9);if(i.kind==='regionCrate')directorProp(0,i.nativeLevel,0,0,29);else if(i.kind==='bonusBarrel')bonusSprite(0,0,0,29);else if(i.kind==='storyChest'||i.kind==='storyUrn')roadSprite(i.kind==='storyChest'?0:2,0,0,29,29);else stamp(images.items,ITEM[i.kind].sprite,5,29);ctx.restore()}
function restoreAirPalms(p){const g=airGrip(p,p.age<.085?5:7),im=images['carry-'+g.hero],sw=im.naturalWidth/4,sh=im.naturalHeight/4,hands=g.frame===5?(g.hero===1?[[.54,.55],[.665,.55]]:[[.50,.54],[.64,.52]]):[AIR_HANDS[g.hero][7]],meta=DRAGON_SPRITE_CAMERA['carry-'+g.hero];for(const [x,y]of hands){const a=.09,b=.105;ctx.drawImage(im,(g.frame%4+x-a/2)*sw,(Math.floor(g.frame/4)+y-b/2)*sh,a*sw,b*sh,(x-a/2-.5)*g.size,(y-b/2-meta.anchor)*g.size,a*g.size,b*g.size)}}
