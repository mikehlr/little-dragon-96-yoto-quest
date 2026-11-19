'use strict';
// Furniture is composed into curb pockets, not sprinkled into the fighting lanes.
Object.assign(ITEM,{layoutFurniture:{width:64},layoutRoad:{width:55},layoutSupply:{width:39}});
const LAYOUT_BENCH=[0,4,5,6,7],LAYOUT_PLANTER=[1,2,null,null,3];
let layoutObjects=[];
function furnitureMeta(frame){return globalThis.DRAGON_DIRECTOR_META?.furniture?.[frame]||{anchor:.94,center:.5,footWidth:.8}}
function layoutSprite(im,frame,cols,rows,x,y,w,meta){if(!READY(im))return;const sw=im.naturalWidth/cols,sh=im.naturalHeight/rows,h=w*sh/sw;ctx.drawImage(im,frame%cols*sw,Math.floor(frame/cols)*sh,sw,sh,x-w*(meta.center??.5),y-h*(meta.anchor??.95),w,h)}
function layoutFurniture(frame,x,y,w,tag){const m=furnitureMeta(frame);return {kind:'layoutFurniture',decor:true,solid:true,frame,x,y,w,tag,blockW:Math.max(5,w*(m.footWidth||.8)*.44),blockH:4}}
function composeStreet(level){
 game.items=game.items.filter(i=>i.kind!=='townProp');layoutObjects=[];
 for(let district=0;district<4;district++){
  const offset=district*DISTRICT_LENGTH,stall=game.items.find(i=>i.kind==='townStall'&&i.district===district),vendor=townVendors.find(v=>v.district===district);
  if(stall&&vendor){stall.x=offset+220;stall.y=207;vendor.x=stall.x-4;vendor.y=202;stall.blockW=43;stall.blockH=5;
   layoutObjects.push({kind:'layoutSupply',decor:true,solid:true,x:stall.x+92,y:202,frame:6,w:35,tag:'market-supplies',blockW:14,blockH:4});
   const planter=level===2?2:LAYOUT_PLANTER[level];if(planter!==null)layoutObjects.push(layoutFurniture(planter,stall.x-93,201,level===4?35:31,'market-edge'));
  }
  for(const x of [700,1260]){
   layoutObjects.push(layoutFurniture(LAYOUT_BENCH[level],offset+x,195,68,'rest-bench'));
   if(level<2)layoutObjects.push({kind:'layoutRoad',decor:true,solid:true,frame:5,x:offset+x-52,y:194,w:53,h:84,tag:'bench-lamp',blockW:6,blockH:3});
   const planter=LAYOUT_PLANTER[level];if(planter!==null)layoutObjects.push(layoutFurniture(planter,offset+x+51,195,29,'bench-planter'));
   else layoutObjects.push({kind:'layoutRoad',decor:true,frame:level===2?10:7,x:offset+x+56,y:194,w:level===2?28:37,tag:'native-ground-edge'});
  }
  layoutObjects.push({kind:'layoutRoad',decor:true,solid:true,frame:level===4?9:8,x:offset+1142,y:195,w:level===4?43:53,tag:level===4?'library-cart':'spring',blockW:19,blockH:4});
  layoutObjects.push({kind:'layoutRoad',decor:true,frame:11,x:offset+1592,y:194,w:33,tag:'route-sign'});
 }
 game.items.push(...layoutObjects.filter(i=>i.x>=game.entry-100));
 // The old cache remains inspectable, but no longer owns an unsorted scenery pass.
 roadCache[level]=layoutObjects.map(i=>({type:i.tag,x:i.x,y:i.y,w:i.w}));
}
const layoutPopulate=populateTown;
populateTown=function(level){layoutPopulate(level);composeStreet(level)};
drawRoad=function(){};
function layoutWater(x,y,w){const a=globalThis.DRAGON_EXPANSION_META?.props?.[8]?.anchor||.9613,mouth={x:x+w*.03,y:y-w*(a-.43)},basin={x,y:y-w*(a-.60)},t=hdPrefs.calm?0:game.clock;ctx.save();ctx.strokeStyle='#c5edffb8';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(mouth.x,mouth.y);ctx.quadraticCurveTo(mouth.x+Math.sin(t*2)*.4,mouth.y+6,basin.x,basin.y);ctx.stroke();for(let k=0;k<4;k++){const p=(t*.8+k/4)%1;ctx.fillStyle='#d2f3ffc9';ctx.beginPath();ctx.ellipse(mix(mouth.x,basin.x,p),mix(mouth.y,basin.y,p),.4,.9,0,0,Math.PI*2);ctx.fill()}for(let k=0;k<3;k++){const p=(t*.6+k/3)%1;ctx.globalAlpha=(1-p)*.5;ctx.strokeStyle='#c4e7f6';ctx.lineWidth=.4;ctx.beginPath();ctx.ellipse(basin.x,basin.y+1,2+p*w*.14,.5+p*1.7,0,0,Math.PI*2);ctx.stroke()}ctx.restore()}
const layoutDrawItem=drawItem;
drawItem=function(i){
 if(!i.kind?.startsWith('layout'))return layoutDrawItem(i);const x=i.x-game.camera;if(x<-120||x>WIDTH+120)return;
 if(i.kind==='layoutFurniture'){const m=furnitureMeta(i.frame);shadow(x,i.y,i.blockW*.9,.24);layoutSprite(images['street-furniture'],i.frame,4,2,x,i.y,i.w,m);return}
 if(i.kind==='layoutSupply'){layoutSprite(images['market-stalls'],i.frame,4,2,x,i.y,i.w,{anchor:.95,center:.5});return}
 if(i.frame===5){const im=images['grounded-street-lamp'],h=i.h,w=h*im.naturalWidth/im.naturalHeight;shadow(x,i.y,6,.28);ctx.drawImage(im,x-w/2,i.y-h*.992,w,h);if(hdPrefs.lighting){const strength=globalThis.DragonCampaign?.lightStrength()??1;ctx.save();ctx.globalCompositeOperation='screen';hdGlow(x,i.y-h*.77,18,25,'255,207,135',.20*strength);hdGlow(x,i.y+1,29,6,'255,207,135',.09*strength);ctx.restore()}return}
 const m=globalThis.DRAGON_EXPANSION_META?.props?.[i.frame]||{anchor:.95,center:.5};shadow(x,i.y,i.w*.30,.20);layoutSprite(images['road-props'],i.frame,4,3,x,i.y,i.w,m);if(i.frame===8)layoutWater(x,i.y,i.w);if(i.frame===10&&hdPrefs.lighting)hdGlow(x,i.y-i.w*.25,13,7,'93,231,211',.15);
};
globalThis.DragonLayout={objects:()=>layoutObjects,benchFrames:LAYOUT_BENCH,compose:composeStreet};
