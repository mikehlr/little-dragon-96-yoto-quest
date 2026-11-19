'use strict';
function usesCarryWalk(p){return !!p.carry&&['walk','idle'].includes(p.act)&&READY(images['carry-walk-'+(p.hero||p.id)])}
function carryWalkFrame(p){return (p.carry?.kind==='club'?0:8)+(p.act==='walk'?Math.floor(p.stride/7.5)%8:0)}
function carryObjectUnderlay(p){
 const item=p.carry;if(item.kind==='club')return;const hero=p.hero||p.id,m=DRAGON_CARRY_META[hero],w=m.height*m.aspect,grip=[.70,.55],x=(grip[0]-m.center)*w,y=(grip[1]-m.anchor)*m.height,def=ITEM[item.kind];
 if(item.kind==='bonusBarrel'){bonusSprite(0,x+5,y+2,31);return}
 const im=images.items,cell=im.naturalWidth/5,f=def.sprite,size=def.width,bottom=DRAGON_CARRY_ITEMS[f]||.94;
 ctx.drawImage(im,f%5*cell,Math.floor(f/5)*cell,cell,cell,x-size*.30,y-size*bottom,size,size);
}
const carryMotionFrame=drawHeroFrame;
drawHeroFrame=function(p){
 if(!usesCarryWalk(p))return carryMotionFrame(p);const hero=p.hero||p.id,im=images['carry-walk-'+hero],m=DRAGON_CARRY_META[hero],f=carryWalkFrame(p),sw=im.naturalWidth/4,sh=im.naturalHeight/4,h=m.height,w=h*sw/sh;
 // The prop sits behind the actual fingers. A club is authored into its grip and has one owner.
 carryObjectUnderlay(p);ctx.drawImage(im,f%4*sw,Math.floor(f/4)*sh,sw,sh,-w*m.center,-h*m.anchor,w,h);
};
const carryMotionProp=drawCarried;
drawCarried=function(p,item){if(usesCarryWalk(p))return;carryMotionProp(p,item)};
globalThis.DragonCarry={version:'2.6',uses:usesCarryWalk,frame:carryWalkFrame};
