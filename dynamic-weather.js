'use strict';
const CITY_DAY_KEYS=[
 {at:0,rgb:[1,.84,.70]}, {at:.26,rgb:[1,1,1]}, {at:.51,rgb:[1,.76,.53]},
 {at:.68,rgb:[.61,.39,.43]}, {at:.84,rgb:[.08,.13,.25]}, {at:1,rgb:[.065,.10,.20]}
];
const daySmooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
let weatherReview=null;
function cityDay(){const p=weatherReview??chapterState?.dayProgress??clamp(game.section/15,0,1);let a=CITY_DAY_KEYS[0],b=CITY_DAY_KEYS.at(-1);for(let i=1;i<CITY_DAY_KEYS.length;i++)if(p<=CITY_DAY_KEYS[i].at){a=CITY_DAY_KEYS[i-1];b=CITY_DAY_KEYS[i];break}const t=daySmooth(a.at,b.at,p);return {progress:p,rgb:a.rgb.map((v,i)=>mix(v,b.rgb[i],t)),night:daySmooth(.55,.84,p),sun:1-daySmooth(.51,.79,p)}}
const weatherBegin=beginStage;
beginStage=function(retry=false){weatherReview=null;weatherBegin(retry);chapterState.dayProgress=clamp(game.section/15,0,1);if(game.level===0)for(let d=0;d<4;d++)for(const x of [850,1300,1750])game.items.push({kind:'layoutRoad',decor:true,solid:true,frame:5,x:d*DISTRICT_LENGTH+x,y:198,w:53,h:84,tag:'cycle-lamp',blockW:6,blockH:3})};
const weatherUpdate=update;
update=function(dt){weatherUpdate(dt);if(game.mode==='play'&&game.level===0&&chapterState){const distance=Math.max(game.section/15,...game.players.filter(p=>p.hp).map(p=>clamp(p.x/GATES[15],0,1))),target=Math.max(distance*.99,chapterState.age/420),old=chapterState.dayProgress||0;chapterState.dayProgress=Math.min(1,Math.max(old,old+(target-old)*(1-Math.exp(-dt/.85))))}};
chapterLightStrength=function(){if(game.level===0)return cityDay().night;return game.level===4||game.level===5?1:.8};
const weatherSceneLights=hdSceneLights;
hdSceneLights=function(front){if(game.level===0&&!front){ctx.save();ctx.globalAlpha*=cityDay().sun;weatherSceneLights(front);ctx.restore();return}weatherSceneLights(front)};
function cityLightSources(){const out=[];for(const i of game.items)if(i.kind==='layoutRoad'&&i.frame===5){const x=i.x-game.camera;if(x>-90&&x<WIDTH+90)out.push({x,y:i.y-i.h*.79,ground:i.y+23,rx:76,ry:93,power:.94,pole:true})}
 const im=hdImages['athens-near'];if(READY(im)){const w=im.naturalWidth/im.naturalHeight*GROUND_Y,offset=game.camera*(hdPrefs.parallax?.64:0),first=Math.floor(offset/w)-1;for(let n=first;n<first+4;n++){const flip=Math.abs(n%2)===1;for(const [sx,sy]of hdFixtures[0]){const local=sx/2172*w,x=n*w-offset+(flip?w-local:local);if(x>-45&&x<WIDTH+45)out.push({x,y:sy/724*GROUND_Y,ground:201,rx:30,ry:38,power:.72,pole:false})}}}return out}
const nightOriginal=document.createElement('canvas'),nightMask=document.createElement('canvas');
function nightRestoreMask(g,x,y,rx,ry,a){g.save();g.translate(x,y);g.scale(1,ry/rx);const r=g.createRadialGradient(0,0,0,0,0,rx);r.addColorStop(0,'rgba(255,255,255,'+a+')');r.addColorStop(.4,'rgba(255,255,255,'+a*.65+')');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(-rx,-rx,rx*2,rx*2);g.restore()}
function renderCityNight(){if(game.level!==0)return;const day=cityDay(),shake=game.fx&&!hdPrefs.calm&&game.shake?Math.round(Math.sin(game.clock*221)*game.shake):0,sources=cityLightSources().map(s=>({...s,x:s.x+shake})),scale=hdPrefs.resolution;
 if(nightOriginal.width!==canvas.width||nightOriginal.height!==canvas.height){nightOriginal.width=nightMask.width=canvas.width;nightOriginal.height=nightMask.height=canvas.height}
 const original=nightOriginal.getContext('2d'),mask=nightMask.getContext('2d');original.setTransform(1,0,0,1,0,0);original.globalCompositeOperation='copy';original.drawImage(canvas,0,0);
 ctx.save();ctx.setTransform(scale,0,0,scale,0,0);ctx.beginPath();ctx.rect(0,28,WIDTH,HEIGHT-28);ctx.clip();ctx.globalCompositeOperation='multiply';const rgb=day.rgb.map((v,i)=>Math.round(255*Math.max(hdPrefs.lighting?0:[.22,.27,.39][i],v)));ctx.fillStyle='rgb('+rgb.join(',')+')';ctx.fillRect(0,28,WIDTH,HEIGHT-28);ctx.globalCompositeOperation='source-over';
 if(hdPrefs.lighting&&day.night>.001){mask.setTransform(1,0,0,1,0,0);mask.clearRect(0,0,nightMask.width,nightMask.height);mask.setTransform(scale,0,0,scale,0,0);mask.globalCompositeOperation='source-over';for(const s of sources){nightRestoreMask(mask,s.x,s.y+27,s.rx,s.ry,s.power*day.night);if(s.pole)nightRestoreMask(mask,s.x+8,s.ground,65,16,.85*day.night)}
  for(const p of game.players)if(p.hp)nightRestoreMask(mask,p.x-game.camera+shake,p.y-p.z-26,38,43,(hdPrefs.contrast?.38:.25)*day.night);
  mask.setTransform(1,0,0,1,0,0);mask.globalCompositeOperation='source-in';mask.drawImage(nightOriginal,0,0);mask.globalCompositeOperation='source-over';ctx.drawImage(nightMask,0,0,WIDTH,HEIGHT);
  ctx.globalCompositeOperation='screen';for(const s of sources){const pulse=hdPrefs.calm?1:1+Math.sin(game.clock*1.3+s.x*.017)*.025;hdGlow(s.x,s.y,13,18,'255,202,119',.32*day.night*pulse);if(s.pole){const cone=ctx.createLinearGradient(s.x,s.y,s.x+8,s.ground);cone.addColorStop(0,'rgba(255,207,127,'+.14*day.night+')');cone.addColorStop(1,'rgba(255,197,103,0)');ctx.fillStyle=cone;ctx.beginPath();ctx.moveTo(s.x-2,s.y+3);ctx.lineTo(s.x+2,s.y+3);ctx.lineTo(s.x+48,s.ground);ctx.quadraticCurveTo(s.x+8,s.ground+12,s.x-38,s.ground);ctx.closePath();ctx.fill();hdGlow(s.x+8,s.ground,63,13,'255,191,101',.18*day.night)}}
 }
 if(day.night>.2){ctx.globalCompositeOperation='source-over';ctx.translate(shake,0);drawTells();for(const h of game.hazards)drawEnemyHazard(h);for(const s of game.shots)drawShot(s)}
 ctx.restore();
}
function forestFogTexture(seed){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d'),im=g.createImageData(c.width,c.height);const hash=(x,y)=>{let n=(x*374761393+y*668265263+seed*69069)|0;n=(n^(n>>>13))*1274126177;return ((n^(n>>>16))>>>0)/4294967295},noise=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy,s=u*u*(3-2*u),t=v*v*(3-2*v);return mix(mix(hash(ix,iy),hash(ix+1,iy),s),mix(hash(ix,iy+1),hash(ix+1,iy+1),s),t)};for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const u=x/c.width,v=y/c.height,n=noise(x/82,y/30)*.55+noise(x/31,y/13)*.30+noise(x/13,y/6)*.15,shape=Math.pow(Math.sin(Math.PI*u),.65)*Math.exp(-Math.pow((v-.53)/.29,2)),a=Math.max(0,n-.19)*shape*.82,k=(y*c.width+x)*4;im.data[k]=178;im.data[k+1]=206;im.data[k+2]=208;im.data[k+3]=Math.round(a*255)}g.putImageData(im,0,0);return c}
const forestFogTiles=[forestFogTexture(19),forestFogTexture(83),forestFogTexture(137)];
function forestFog(front){if(game.level!==2||!hdPrefs.fog)return;const evolution=typeof regionalClimate==='function'?regionalClimate():{t:hdPrefs.calm?0:game.clock,fog:1,build:0},t=evolution.t,factor=hdPrefs.parallax?(front?1.10:.38):1,w=front?390:460,h=front?56:83;ctx.save();ctx.globalAlpha=(front?(game.section===15?.44:.56):.81)*evolution.fog;for(let layer=0;layer<(front?2:3);layer++){const shift=game.camera*(factor+layer*.035)-t*(front?9+layer*3+evolution.build*4:4+layer*2+evolution.build*3)+layer*137,first=Math.floor(shift/w)-1,y=front?210+layer*26:116+layer*17;for(let n=first;n<first+4;n++)ctx.drawImage(forestFogTiles[layer],n*w-shift,y,w+9,h)}ctx.restore()}
const weatherPlane=hdSceneryPlane;
hdSceneryPlane=function(im,factor,fixtures){weatherPlane(im,factor,fixtures);if(!fixtures&&im===hdImages[hdSceneKeys[game.level]+'-far']){if(game.level===2)forestFog(false);if(game.level===0&&cityDay().night>.01){ctx.save();ctx.globalAlpha=cityDay().night;ctx.fillStyle='#e6f1ff';for(let k=0;k<29;k++){const x=((k*73.17-game.camera*.025)%WIDTH+WIDTH)%WIDTH,y=31+(k*17.3)%31;ctx.fillRect(x,y,k%5? .6:1,k%5?.6:1)}ctx.beginPath();ctx.arc(WIDTH-72-game.camera*.012%35,44,7,0,Math.PI*2);ctx.fill();ctx.restore()}}};
const weatherCloser=closerScenery;
closerScenery=function(){weatherCloser();forestFog(true)};
const weatherAtmosphere=hdAtmosphere;
hdAtmosphere=function(){renderCityNight();weatherAtmosphere()};
Object.assign(DragonCampaign,{lightStrength:chapterLightStrength,weather:{city:cityDay,sources:cityLightSources,review:p=>{weatherReview=p},fog:forestFog}});
