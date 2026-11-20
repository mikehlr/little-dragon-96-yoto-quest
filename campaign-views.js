'use strict';
function chapterCell(im,frame,cols,rows,x,y,w,m={anchor:.94,center:.5}){if(!READY(im))return;const source=im===images['world-entrances']?DRAGON_CAMPAIGN_META.entranceFrames[frame]:null,sw=source?.w||im.naturalWidth/cols,sh=source?.h||im.naturalHeight/rows,h=w*sh/sw;ctx.drawImage(im,source?.x??frame%cols*sw,source?.y??Math.floor(frame/cols)*sh,sw,sh,x-w*m.center,y-h*m.anchor,w,h)}
function chapterProp(frame,x,y,w){chapterCell(images['story-props'],frame,4,4,x,y,w,DRAGON_CAMPAIGN_META.props[frame])}
function chapterLightStrength(){if(!chapterState)return 1;const t=clamp(game.section/15*.8+chapterState.age/420*.2,0,1);if(game.level===0)return .10+.90*clamp((t-.12)*1.8,0,1)*(chapterState.flags.power?1:.25);return game.level===4||game.level===5?1:.55+.45*t}
function chapterMidground(){const im=images['ground-transition-'+game.level];if(!READY(im))return;const h=100,w=h*im.naturalWidth/im.naturalHeight,factor=hdPrefs.parallax?.84:1,offset=game.camera*factor,first=Math.floor(offset/w)-1;for(let i=first;i<first+4;i++){ctx.save();const flip=Math.abs(i%2)===1;ctx.translate(i*w-offset+(flip?w:0),190-h*.94);if(flip)ctx.scale(-1,1);ctx.drawImage(im,0,0,w,h);ctx.restore()}}
const chapterPopulate=populateTown;
populateTown=function(level){
 chapterPopulate(level);
 if(level!==0)for(const d of townDoors){const m=DRAGON_CAMPAIGN_META.doors[level];d.type='chapter-door-'+level;d.w=m.worldWidth;d.h=d.w*m.aspect;DRAGON_TOWN_META.doors[d.type]=m}
 if(level===1){for(const i of game.items)if(i.tag==='bench-lamp'){i.kind='chapterProp';i.frame=4;i.w=29;i.decor=true;i.solid=false;i.role='mooring'}}
 if(level===5){game.items=game.items.filter(i=>!i.kind?.startsWith('layout'));for(let d=0;d<4;d++)for(const offset of [700,1260])game.items.push({kind:'chapterProp',decor:true,role:'snow-bench',x:d*DISTRICT_LENGTH+offset,y:195,w:70,solid:true,blockW:25,blockH:4})}
};
const chapterDoors=drawTownDoors;
drawTownDoors=function(){
 chapterMidground();chapterDoors();const im=images['world-entrances'];if(!READY(im))return;
 for(const d of townDoors){if(!d.type.startsWith('chapter-door-'))continue;const x=d.x-game.camera;if(x<-170||x>WIDTH+170)continue;const m=DRAGON_CAMPAIGN_META.doors[game.level],cellW=im.naturalWidth/4,cellH=im.naturalHeight/3;
  shadow(x,d.y+1,d.w*.35,.29);chapterCell(im,m.frame,4,3,x,d.y,d.w,{anchor:m.anchor,center:.5});const b=doorGeometry(d),bx=b.x-game.camera,p=m.panel,frame=m.frame+1,source=DRAGON_CAMPAIGN_META.entranceFrames[frame];
  ctx.save();ctx.beginPath();ctx.rect(bx-1,b.y-1,b.w+3,b.h+3);ctx.clip();const projected=b.w*Math.cos(d.open*1.43),depth=b.h*.10*Math.sin(d.open*1.43);
  for(let k=0;k<32;k++){const u=k/32;ctx.drawImage(im,source.x+p.x*source.w+p.w*source.w*u,source.y+p.y*source.h,p.w*source.w/32+.5,p.h*source.h,bx+projected*u,b.y+depth*u,projected/32+.5,b.h-depth*u*2)}ctx.restore();
 }
};
// The harbor's transport is a launch on water, with a real hinged gangplank, not a road wagon.
const chapterDirectorProp=directorProp;
directorProp=function(frame,level,x,y,w){if(level===1&&(frame===2||frame===3))return chapterCell(images['harbor-launch'],frame-2,2,2,x,y,w,DRAGON_CAMPAIGN_META.boat);return chapterDirectorProp(frame,level,x,y,w)};
const chapterDrawItem=drawItem;
drawItem=function(i){
 const x=i.x-game.camera;if(i.kind==='chapterGangplank'){if(i.scene.vehicle.visible)drawChapterGangplank(i.scene.vehicle);return}if(i.kind==='chapterBerth'||i.kind==='chapterBerthRim'){drawChapterBerth(i,i.kind==='chapterBerthRim');return} if(i.kind==='chapterWarmth'){chapterProp(14,x,i.y,i.w);chapterFire(x,i.y,i.w);return}
 if(i.kind==='chapterProp'){
  if(x<-120||x>WIDTH+120)return;
  if(i.role==='snow-bench'){chapterCell(images['world-entrances'],10,4,3,x,i.y,i.w,DRAGON_CAMPAIGN_META.furniture);return}
  if(i.art==='forest-root')directorProp(5,2,x,i.y,i.w);else chapterProp(i.powered&&i.frame===2?3:i.frame,x,i.y,i.w);if(i.frame===14)chapterFire(x,i.y,i.w);if(i.powered&&hdPrefs.lighting)hdGlow(x,i.y-i.w*.5,22,17,'255,218,135',.21);return;
 }
 if(i.kind==='directorVehicle'&&i.scene.level===1&&i.visible){
  ctx.save();ctx.strokeStyle='#9cc7d38c';ctx.lineWidth=.5;for(let n=0;n<4;n++){const phase=(game.clock*.35+n/4)%1;ctx.beginPath();ctx.ellipse(x,i.y-2,35+phase*35,3+phase*2,0,0,Math.PI*2);ctx.stroke()}ctx.restore();

 }
 chapterDrawItem(i);
};
function chapterFire(x,y,w){const m=DRAGON_CAMPAIGN_META.props[14],emitter=DRAGON_CAMPAIGN_META.fire,h=w*(images['story-props'].naturalHeight/4)/(images['story-props'].naturalWidth/4),fy=y+h*(emitter.y-m.anchor),fx=x+w*(emitter.x-m.center),t=hdPrefs.calm?0:game.clock;ctx.save();if(hdPrefs.lighting){ctx.globalCompositeOperation='screen';hdGlow(fx,fy-4,27,25,'255,174,93',.27);hdGlow(fx,y+2,32,8,'255,175,91',.13);ctx.globalCompositeOperation='source-over'}for(let k=0;k<3;k++){const lean=Math.sin(t*(3+k*.5)+k)*1.8,height=8+Math.sin(t*4+k)*1.5;ctx.fillStyle=['#f18c45','#ffc96b','#fff0ad'][k];ctx.beginPath();ctx.moveTo(fx-3+k,fy);ctx.quadraticCurveTo(fx-4+k+lean,fy-height*.55,fx+lean,fy-height+k);ctx.quadraticCurveTo(fx+4-k+lean,fy-height*.35,fx+3-k,fy);ctx.fill()}ctx.restore()}
const chapterFixtureLights=hdFixtureLights;
hdFixtureLights=function(w,floorOnly){ctx.save();ctx.globalAlpha*=chapterLightStrength();chapterFixtureLights(w,floorOnly);ctx.restore()};
const chapterAtmosphere=hdAtmosphere;
hdAtmosphere=function(){
 const s=chapterState;if(s){const progress=clamp(game.section/15*.8+s.age/420*.2,0,1);ctx.save();if(game.level===0){ctx.fillStyle=`rgba(15,27,61,${progress*.28})`;ctx.fillRect(0,28,WIDTH,HEIGHT-28)}if(game.level===1){const tide=(Math.sin(game.clock*.37)+1)*.5;ctx.fillStyle=`rgba(38,94,123,${.025+tide*.07})`;ctx.fillRect(0,239-tide*5,WIDTH,31+tide*5)}if(game.level===2&&hdPrefs.lighting){ctx.globalCompositeOperation='screen';for(let k=0;k<8;k++)hdGlow((k*79+Math.sin(game.clock*.3+k)*12)%WIDTH,120+k%3*20,2,2,'169,244,176',.17)}
  if(game.level===5){const clock=hdPrefs.calm?0:game.clock;ctx.fillStyle='#d7e8f1a8';for(let k=0;k<(hdPrefs.calm?18:56);k++){const x=((k*47+clock*13+s.wind*clock*2-game.camera*.2)%WIDTH+WIDTH)%WIDTH,y=(k*31+clock*(8+k%5))%HEIGHT;ctx.fillRect(x,y,1,1)}if(s.cold>.1){ctx.strokeStyle=`rgba(182,221,239,${s.cold*.26})`;ctx.lineWidth=6;ctx.strokeRect(2,30,WIDTH-4,HEIGHT-32)}}ctx.restore();}
 chapterAtmosphere();
};
Object.assign(DragonCampaign,{lightStrength:chapterLightStrength});

function drawChapterBerth(i,front){const im=images['harbor-berth'];if(!READY(im))return;const w=185,h=w*im.naturalHeight/im.naturalWidth,x=i.x-game.camera-w/2,y=207-h*.92,cut=.68,sy=front?im.naturalHeight*cut:0,sh=im.naturalHeight*(front?1-cut:cut);ctx.drawImage(im,0,sy,im.naturalWidth,sh,x,y+(front?h*cut:0),w,h*(front?1-cut:cut));}

function drawChapterGangplank(i){const x=i.x-game.camera;
  const r=i.scene.actor.entry,depart=i.depart?clamp((i.departAge||0)/.7,0,1):0;
  if(i.scene.boardLowered||r?.mode==='vehicle'&&r.time>1.35||i.depart&&depart<1){const p=cargoBox(i),from={x:x+17,y:p.y+p.h},to={x:x-35,y:232},angle=Math.atan2(to.y-from.y,to.x-from.x),length=Math.hypot(to.x-from.x,to.y-from.y),im=images['harbor-launch'];ctx.save();ctx.translate(from.x,from.y);ctx.rotate(angle+(i.scene.boardLowered?0:1-clamp(((r?.time||0)-1.35)/.4,0,1))*1.3-depart*1.3);const sw=im.naturalWidth/2,sh=im.naturalHeight/2,m=DRAGON_CAMPAIGN_META.plank;ctx.drawImage(im,m.x*sw,sh+m.y*sh,m.w*sw,m.h*sh,0,-length*m.h*sh/(m.w*sw)/2,length,length*m.h*sh/(m.w*sw));ctx.restore()}
}
