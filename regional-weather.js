'use strict';
// Weather lives in scene depth. The fighting sprites and HUD are never graded.
let regionalReview=null;
const climateBegin=beginStage;
beginStage=function(retry=false){regionalReview=null;climateBegin(retry);chapterState.climateProgress=clamp(game.section/15,0,1)};
const climateUpdate=update;
update=function(dt){climateUpdate(dt);if(game.mode!=='play'||!chapterState)return;
 const route=Math.max(game.section/15,...game.players.filter(p=>p.hp).map(p=>clamp(p.x/GATES[15],0,1)));
 const target=clamp(Math.max(route,chapterState.age/480),0,1),old=chapterState.climateProgress||0;
 chapterState.climateProgress=Math.max(old,mix(old,target,1-Math.exp(-dt/1.6)));
};
function regionalClimate(){
 const progress=regionalReview?.progress??chapterState?.climateProgress??clamp(game.section/15,0,1);
 const t=hdPrefs.calm?0:regionalReview?.time??chapterState?.age??0;
 const build=daySmooth(.12,.87,progress),gust=.5+.5*Math.sin(t*.43+Math.sin(t*.13));
 return {progress,t,build,gust,storm:daySmooth(.18,.78,progress),fog:mix(.52,1.25,build),
  flash:game.level===1&&game.fx&&hdPrefs.lighting&&!hdPrefs.calm?daySmooth(.38,.8,progress)*Math.pow(Math.max(0,Math.sin(Math.PI*clamp(((t+3)%17-12)/1.1,0,1))),2):0};
}
function climateClip(){ctx.beginPath();ctx.rect(0,29,WIDTH,HEIGHT-29);ctx.clip()}
function protectFighters(){
 const shake=game.fx&&!hdPrefs.calm&&game.shake?Math.round(Math.sin(game.clock*221)*game.shake):0;
 for(const a of [...game.players,...game.enemies])if(a.hp>0&&(!a.entry||a.entry.started)){
  const x=a.x-game.camera+shake,y=a.y-(a.z||0),height=a.boss?105:86;
  // Subtract each silhouette separately: overlapping fighters remain protected.
  ctx.beginPath();ctx.rect(0,29,WIDTH,HEIGHT-29);ctx.rect(x-36,y-height,72,height+9);ctx.clip('evenodd');
 }
}

function regionalFixtures(level){
 const im=hdImages[hdSceneKeys[level]+'-near'];if(!READY(im))return [];
 const w=im.naturalWidth/im.naturalHeight*GROUND_Y,offset=game.camera*(hdPrefs.parallax?.64:0),first=Math.floor(offset/w)-1,out=[];
 for(let n=first;n<first+4;n++)for(const [sx,sy]of hdFixtures[level]||[]){const local=sx/2172*w,x=n*w-offset+(Math.abs(n%2)===1?w-local:local);if(x>-40&&x<WIDTH+40)out.push({x,y:sy/724*GROUND_Y})}
 return out;
}
function climateVeil(rgb,amount,y=29,h=HEIGHT-29){ctx.fillStyle=`rgba(${rgb},${amount})`;ctx.fillRect(0,y,WIDTH,h)}
const climateMistTiles={};
for(const [level,color]of [[3,'#d5ad7b'],[4,'#9186ad']])climateMistTiles[level]=forestFogTiles.map(tile=>{const c=document.createElement('canvas');c.width=tile.width;c.height=tile.height;const g=c.getContext('2d');g.drawImage(tile,0,0);g.globalCompositeOperation='source-in';g.fillStyle=color;g.fillRect(0,0,c.width,c.height);return c});
function climateBands(front,strength){
 const c=regionalClimate(),w=440,factor=hdPrefs.parallax?(front?1.08:.34):1;
 ctx.save();ctx.globalAlpha=strength;
 for(let k=0;k<(front?1:2);k++){const shift=game.camera*(factor+k*.05)-c.t*(4+k*3+c.build*9)+k*159,first=Math.floor(shift/w)-1;
  for(let n=first;n<first+4;n++)ctx.drawImage((climateMistTiles[game.level]||forestFogTiles)[k],n*w-shift,front?240:130+k*20,w+12,front?34:70);
 }
 ctx.restore();
}
function regionalRain(front,mid=false){
 if(game.level!==1)return;const c=regionalClimate(),amount=(.06+c.storm*.94)*(game.fx?1:.4),count=Math.round((front?24:mid?52:100)*amount*(hdPrefs.calm?.35:1));
 ctx.save();if(front)protectFighters();else climateClip();ctx.strokeStyle=front?'#b9d9ef62':'#b1cbe24d';ctx.lineWidth=front?.45:.32;
 const factor=hdPrefs.parallax?(front?1.05:mid?.82:.43):1;
 for(let k=0;k<count;k++){const speed=front?230:mid?185:150,x=((k*79.7-c.t*(25+c.storm*38)-game.camera*factor)%540+540)%540-30,y=((k*61.3+c.t*speed)%270+270)%270;
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-2-c.storm*3,y+5+(front?6:3));ctx.stroke();}
 ctx.restore();
}
function regionalSnow(front,mid=false){
 if(game.level!==5)return;const c=regionalClimate(),count=Math.round((front?15:mid?34:75)*(.2+c.build*.8)*(game.fx?1:.45)*(hdPrefs.calm?.4:1));
 ctx.save();if(front)protectFighters();else climateClip();ctx.fillStyle=front?'#e3f2ffa0':'#deedf4a6';
 for(let k=0;k<count;k++){const speed=front?38:mid?28:19,x=((k*61.1+c.t*(8+c.build*20+c.gust*7)+Math.sin(c.t*.7+k)*5-game.camera*(hdPrefs.parallax?(front?1.08:mid?.8:.39):1))%540+540)%540-30,y=(k*47.7+c.t*(speed+k%7))%HEIGHT;
  ctx.beginPath();ctx.ellipse(x,y,front?.8:.5,front?1.25:.7,-.5,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}
function regionalDust(front,mid=false){
 if(game.level!==3)return;const c=regionalClimate(),count=front?10:mid?28:35;
 ctx.save();if(front)protectFighters();else climateClip();ctx.fillStyle=`rgba(242,195,126,${(front?.18:.28)*(.3+c.build*.7)})`;
 for(let k=0;k<count;k++){const x=((k*53.9+c.t*(16+c.build*32+c.gust*14)-game.camera*(front?1.09:.4))%550+550)%550-35,y=front?244+k%5*4:mid?205+k*23.1%47:65+k*23.1%125;
  ctx.fillRect(x,y,front?2.2:1.1,.5);}
 if(hdPrefs.fog)climateBands(front||mid,(front?.2:.34)*c.build*(.4+c.gust*.6));
 ctx.restore();
}
function harborLightning(){
 const c=regionalClimate();if(c.flash<.001)return;
 ctx.save();climateClip();ctx.globalCompositeOperation='screen';climateVeil('148,181,220',c.flash*.15,29,150);
 const strike=Math.floor((c.t+3)/17),x=72+((strike*137)%330)-game.camera*.018%25;
 ctx.globalAlpha=c.flash;ctx.strokeStyle='#bcd9f0';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(x,33);ctx.lineTo(x-11,55);ctx.lineTo(x+3,53);ctx.lineTo(x-17,85);ctx.lineTo(x-8,82);ctx.lineTo(x-28,116);ctx.stroke();
 ctx.globalAlpha=c.flash*.5;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-11,55);ctx.lineTo(x-32,68);ctx.lineTo(x-30,81);ctx.stroke();ctx.restore();
}
function forestMotes(){
 if(game.level!==2||!hdPrefs.lighting)return;const c=regionalClimate();ctx.save();ctx.globalCompositeOperation='screen';
 for(let k=0;k<18;k++){const x=((k*71+Math.sin(c.t*.28+k)*9-game.camera*.44)%WIDTH+WIDTH)%WIDTH,y=93+k*19%92+Math.sin(c.t*.34+k)*6;hdGlow(x,y,1.8,2.2,'171,225,146',(.08+c.build*.22)*(.7+Math.sin(c.t*.7+k)*.3))}ctx.restore();
}
function castleEmbers(){
 if(game.level!==4||!hdPrefs.lighting)return;const c=regionalClimate();ctx.save();climateClip();ctx.globalCompositeOperation='screen';
 for(const f of regionalFixtures(4)){
  hdGlow(f.x,f.y,18,25,'255,154,81',.12+c.build*.19);
  for(let k=0;k<4;k++){const u=(c.t*(.28+k*.015)+k*.27)%1;ctx.fillStyle=`rgba(255,190,103,${(1-u)*(.2+c.build*.5)})`;ctx.fillRect(f.x+Math.sin(u*8+k)*3+u*4,f.y-u*30,.6,.9)}
 }ctx.restore();
}
function frostAurora(){
 if(game.level!==5||!hdPrefs.lighting)return;const c=regionalClimate();ctx.save();ctx.globalCompositeOperation='screen';
 for(let k=0;k<3;k++){ctx.strokeStyle=`rgba(${k%2?'125,161,231':'110,211,197'},${.025+c.build*.055})`;ctx.lineWidth=9+k*4;ctx.beginPath();ctx.moveTo(-25,70+k*13);ctx.bezierCurveTo(120,30+Math.sin(c.t*.09+k)*12,260,110,WIDTH+25,44+k*14);ctx.stroke()}ctx.restore();
}
const climatePlane=hdSceneryPlane;
hdSceneryPlane=function(im,factor,fixtures){climatePlane(im,factor,fixtures);
 if(!fixtures&&im===hdImages[hdSceneKeys[game.level]+'-far']){harborLightning();regionalRain(false);regionalSnow(false);regionalDust(false);forestMotes();frostAurora();if(game.level===4&&hdPrefs.fog)climateBands(false,.35+regionalClimate().build*.35)}
};
const climatePanorama=panorama;
panorama=function(){climatePanorama();if(!game.level)return;const c=regionalClimate(),grades={1:[.53,.64,.77],2:[.70,.84,.79],3:[.92,.72,.55],4:[.86,.68,.76],5:[.72,.82,.96]},rgb=grades[game.level].map(v=>Math.round(255*mix(1,v,c.build)));
 ctx.save();climateClip();ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgb('+rgb.join(',')+')';ctx.fillRect(0,29,WIDTH,HEIGHT-29);ctx.globalCompositeOperation='source-over';
 if(game.level===1){
  const t=c.t;ctx.strokeStyle=`rgba(169,206,227,${c.storm*.22})`;ctx.lineWidth=.4;
  for(let k=0;k<22;k++){const u=(t*(.8+k%3*.12)+k*.13)%1,x=((k*83.3-game.camera)%530+530)%530-25,y=203+k*23.7%53;ctx.globalAlpha=1-u;ctx.beginPath();ctx.ellipse(x,y,1+u*4,.25+u,0,0,Math.PI*2);ctx.stroke()}
  ctx.globalAlpha=1;if(hdPrefs.lighting){ctx.globalCompositeOperation='screen';for(const f of regionalFixtures(1))hdGlow(f.x,211+(f.x%17),23,3,'213,193,135',c.storm*.12)}
 }
 ctx.restore();regionalRain(false,true);regionalSnow(false,true);regionalDust(false,true);
};
// Keep existing low forest fog, but evolve its density and wind with the chapter.
const climateForestFog=forestFog;
const climateOriginal=document.createElement('canvas'),climateMask=document.createElement('canvas');
function softWeatherProtection(render){
 if(climateOriginal.width!==canvas.width||climateOriginal.height!==canvas.height){climateOriginal.width=climateMask.width=canvas.width;climateOriginal.height=climateMask.height=canvas.height}
 const original=climateOriginal.getContext('2d'),mask=climateMask.getContext('2d'),scale=hdPrefs.resolution;
 original.setTransform(1,0,0,1,0,0);original.globalCompositeOperation='copy';original.drawImage(canvas,0,0);render();
 mask.setTransform(1,0,0,1,0,0);mask.clearRect(0,0,climateMask.width,climateMask.height);mask.globalCompositeOperation='source-over';mask.setTransform(scale,0,0,scale,0,0);
 const shake=game.fx&&!hdPrefs.calm&&game.shake?Math.round(Math.sin(game.clock*221)*game.shake):0;
 for(const a of [...game.players,...game.enemies])if(a.hp>0&&(!a.entry||a.entry.started)){
  const x=a.x-game.camera+shake,y=a.y-(a.z||0)-(a.boss?40:33),rx=a.boss?54:44,ry=a.boss?76:64;
  mask.save();mask.translate(x,y);mask.scale(1,ry/rx);const g=mask.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,'#fff');g.addColorStop(.56,'#fff');g.addColorStop(1,'#ffffff00');mask.fillStyle=g;mask.fillRect(-rx,-rx,rx*2,rx*2);mask.restore();
 }
 mask.setTransform(1,0,0,1,0,0);mask.globalCompositeOperation='source-in';mask.drawImage(climateOriginal,0,0);mask.globalCompositeOperation='source-over';
 ctx.save();ctx.setTransform(scale,0,0,scale,0,0);ctx.drawImage(climateMask,0,0,WIDTH,HEIGHT);ctx.restore();
}
forestFog=function(front){if(front&&game.level===2&&hdPrefs.fog)softWeatherProtection(()=>climateForestFog(true));else climateForestFog(front)};
const climateAtmosphere=hdAtmosphere;
hdAtmosphere=function(){climateAtmosphere();if(!game.level)return;ctx.save();climateClip();protectFighters();regionalRain(true);regionalSnow(true);regionalDust(true);castleEmbers();ctx.restore()};
Object.assign(DragonCampaign.weather,{regional:regionalClimate,reviewRegion:(progress=null,time=0)=>{regionalReview=progress===null?null:{progress:clamp(progress,0,1),time}},protectFighters});
