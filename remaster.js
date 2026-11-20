'use strict';
// Full-HD presentation. Physics and hit detection remain in the original world units.
const HD_VERSION='2.8';
const HD_DEFAULT={resolution:4,display:'hd',lighting:true,fog:true,grain:1,parallax:true,calm:false,contrast:false,musicVolume:65,sfxVolume:80,music:true,sound:true};
let hdPrefs={...HD_DEFAULT};
try{Object.assign(hdPrefs,JSON.parse(localStorage.getItem('little-dragon-hd-settings')||'{}'))}catch{}
hdPrefs.resolution=[2,3,4].includes(hdPrefs.resolution)?hdPrefs.resolution:4;
for(const k of ['musicVolume','sfxVolume'])hdPrefs[k]=clamp(Number(hdPrefs[k])||0,0,100);
hdPrefs.grain=[0,1,2].includes(hdPrefs.grain)?hdPrefs.grain:1;
hdPrefs.display=['hd','pixel','crt'].includes(hdPrefs.display)?hdPrefs.display:'hd';
game.music=hdPrefs.music!==false;game.sound=hdPrefs.sound!==false;
let hdTab=0,hdLastPage='home',hdLastInput='keyboard',hdPadLabel='generic',hdSettingsOrigin='home',hdGuideOrigin='home',hdLoaded=false,hdLoadDone=0,hdUserNavigated=false;
const hdMenuPads=new Map(),hdFrameTimes=[];
const HD_ART={floor:'assets/hd-floor.webp'};
for(const scene of ['athens','harbor','forest','ruins','castle'])for(const plane of ['near','far'])HD_ART[scene+'-'+plane]=`assets/hd-${plane}-${scene}.webp`;
HD_ART['castle-near']='assets/castle-unlit.webp';
const hdImages={};
const hdImageURLs=new Map(Object.values(images).map(im=>[im.src,im]));
for(const [key,url] of Object.entries(HD_ART)){const absolute=new URL(url,document.baseURI).href;let im=hdImageURLs.get(absolute);if(!im){im=new Image();im.src=url;hdImageURLs.set(absolute,im)}hdImages[key]=im}
const hdLoadImages=[...hdImageURLs.values()];
const hdLoadTotal=hdLoadImages.length;
function hdLoadTick(){hdLoadDone++;const el=document.querySelector('#hd-loading');if(el)el.textContent=`ΦΟΡΤΩΣΗ HD · ${Math.round(hdLoadDone/hdLoadTotal*100)}%`}
const hdDecodeRetries=new Map();
async function hdDecodeImage(im){for(let attempt=0;attempt<3;attempt++){try{await im.decode();return}catch(error){if(attempt===2)throw new Error('HD image could not decode: '+im.src,{cause:error});const src=im.src;hdDecodeRetries.set(src,attempt+1);await new Promise(resolve=>setTimeout(resolve,80*(attempt+1)));im.removeAttribute('src');im.src=src;await Promise.resolve()}}}
// Bound simultaneous native decoding and share duplicate source URLs. A failed
// decode retries the actual image, rather than leaving the title at 99% forever.
let hdNextImage=0;
const hdAssetReady=Promise.all(Array.from({length:4},async()=>{while(hdNextImage<hdLoadImages.length){const im=hdLoadImages[hdNextImage++];await hdDecodeImage(im);hdLoadTick()}}));
const hdProfiles=[
 {sky:['#243d70','#c9878c','#ffd7a2'],hill:'#666887',mist:'232,174,141',light:'255,209,141',fog:.10},
 {sky:['#101d43','#3f5a7c','#83abb4'],hill:'#31455f',mist:'125,179,192',light:'255,205,128',fog:.28},
 {sky:['#0e2939','#2e6163','#75937b'],hill:'#20444f',mist:'119,186,163',light:'237,236,151',fog:.33},
 {sky:['#3b355f','#b07d91','#f7b78a'],hill:'#6b6582',mist:'205,173,184',light:'255,213,155',fog:.14},
 {sky:['#0e112a','#242446','#655174'],hill:'#25243c',mist:'153,139,186',light:'255,174,104',fog:.25},
];
const hdSceneKeys=['athens','harbor','forest','ruins','castle'];
function hdSave(){hdPrefs.music=game.music;hdPrefs.sound=game.sound;try{localStorage.setItem('little-dragon-hd-settings',JSON.stringify(hdPrefs))}catch{}}
function hdResize(){canvas.width=WIDTH*hdPrefs.resolution;canvas.height=HEIGHT*hdPrefs.resolution;ctx.setTransform(hdPrefs.resolution,0,0,hdPrefs.resolution,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';document.documentElement.classList.toggle('calm',!!hdPrefs.calm);document.documentElement.classList.toggle('high-contrast',!!hdPrefs.contrast)}
hdResize();
const hdAudioVolumes=applyAudioVolumes;
applyAudioVolumes=function(){hdAudioVolumes();if(audio.rig){const rig=audio.rig,quiet=game.mode==='pause'||(['how','settings'].includes(game.mode)&&audio.transport);rig.music.gain.setTargetAtTime(game.music?hdPrefs.musicVolume/100*(quiet?.36:1):0,rig.ctx.currentTime,.03);rig.effects.gain.setTargetAtTime(game.sound?hdPrefs.sfxVolume/100:0,rig.ctx.currentTime,.03)}};
// Cache subtle full-resolution noise once. It is composited before the HUD, never over menus.
const hdNoise=Array.from({length:4},(_,frame)=>{const c=document.createElement('canvas');c.width=960;c.height=540;const q=c.getContext('2d'),d=q.createImageData(c.width,c.height);let seed=1987+frame*7919;for(let i=0;i<d.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=(seed>>>24);d.data[i]=d.data[i+1]=d.data[i+2]=n;d.data[i+3]=28}q.putImageData(d,0,0);return c});
const hdClouds=Array.from({length:3},(_,layer)=>{const c=document.createElement('canvas');c.width=1536;c.height=256;const q=c.getContext('2d');for(let i=0;i<12;i++){const x=(i*173+layer*67)%1536,y=45+(i*31)%110,r=60+(i*17)%90,g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(255,225,207,${.055+layer*.015})`);g.addColorStop(1,'rgba(255,225,207,0)');q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2)}return c});
function hdGlow(x,y,rx,ry,rgb,a){ctx.save();ctx.translate(x,y);ctx.scale(1,ry/rx);const g=ctx.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(.35,`rgba(${rgb},${a*.5})`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.fillRect(-rx,-rx,rx*2,rx*2);ctx.restore()}
function hdRepeat(im,width,height,y,factor,alpha=1){if(!READY(im))return;const offset=game.camera*factor;ctx.save();ctx.globalAlpha=alpha;for(let x=-((offset%width)+width)%width-width;x<WIDTH;x+=width)ctx.drawImage(im,x,y,width,height);ctx.restore()}
function hdHills(factor,y,color,seed){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-30,130);for(let x=-30;x<=WIDTH+30;x+=3){const wx=x+game.camera*factor;const yy=y+Math.sin(wx*.010+seed)*13+Math.sin(wx*.023+seed)*5;ctx.lineTo(x,yy)}ctx.lineTo(WIDTH+30,150);ctx.closePath();ctx.fill()}
panorama=function(){
 const profile=hdProfiles[game.level],depth=hdPrefs.parallax?1:0;
 const sky=ctx.createLinearGradient(0,0,0,GROUND_Y);profile.sky.forEach((c,i)=>sky.addColorStop(i/2,c));ctx.fillStyle=sky;ctx.fillRect(0,0,WIDTH,HEIGHT);
 for(let l=0;l<3;l++)hdRepeat(hdClouds[l],640,105,-8+l*8,depth*(.025+l*.025),1);
 hdHills(depth*.10,52,profile.hill,game.level);
 ctx.globalAlpha=.45;hdHills(depth*.19,70,profile.hill,3+game.level);ctx.globalAlpha=1;
 // True transparent near silhouettes over a reconstructed clean distant plate.
 hdSceneryPlane(hdImages[hdSceneKeys[game.level]+'-far'],depth*.22,false);
 if(game.level!==4){ctx.save();ctx.beginPath();ctx.rect(0,28,WIDTH,77);ctx.clip();ctx.globalCompositeOperation='screen';for(let l=0;l<2;l++)hdRepeat(hdClouds[l],640,105,12+l*8,depth*(.025+l*.025),.58);ctx.restore()}
 if(hdPrefs.fog)hdMist(false);
 hdSceneryPlane(hdImages[hdSceneKeys[game.level]+'-near'],depth*.64,true);
 const seam=ctx.createLinearGradient(0,174,0,191);seam.addColorStop(0,'#15182700');seam.addColorStop(1,'#15182788');ctx.fillStyle=seam;ctx.fillRect(0,174,WIDTH,17);
 drawPavement();
 if(hdPrefs.lighting)hdSceneLights(false);
 if(game.gate==='fight')drawGate(GATES[game.section]-18-game.camera);
};
function hdSceneryPlane(im,factor,fixtures){if(!READY(im))return;const w=im.naturalWidth/im.naturalHeight*GROUND_Y,offset=game.camera*factor,first=Math.floor(offset/w)-1;for(let i=first;i<first+4;i++){const x=i*w-offset,flip=Math.abs(i%2)===1;ctx.save();ctx.translate(x+(flip?w:0),0);if(flip)ctx.scale(-1,1);ctx.drawImage(im,0,0,w,GROUND_Y);if(fixtures&&hdPrefs.lighting)hdFixtureLights(w,false);if(!fixtures&&game.level===1)hdWater(w);ctx.restore()}}
function hdWater(w){const t=hdPrefs.calm?0:game.clock;ctx.save();ctx.beginPath();ctx.rect(0,GROUND_Y*.64,w,GROUND_Y*.36);ctx.clip();ctx.globalCompositeOperation='screen';for(let i=0;i<34;i++){const x=(i*41+t*1.8)%w,y=GROUND_Y*.66+(i*17)%(GROUND_Y*.31);ctx.strokeStyle=`rgba(161,203,232,${.06+.04*Math.sin(t*.8+i)})`;ctx.lineWidth=.28;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+5,y+Math.sin(t+i)*.3,x+12+(i%7),y);ctx.stroke()}ctx.restore()}
const hdFixtures=[[[123,510],[317,510],[979,510],[1177,510],[1636,292]],[[258,267],[571,209],[618,523],[750,540],[1240,390],[1476,514],[1697,400],[1948,574]],[],[],[[109,345],[928,345],[1516,345],[1990,345]]];
function hdFixtureLights(w,floorOnly){const rgb=hdProfiles[game.level].light,t=hdPrefs.calm?0:game.clock;ctx.save();ctx.globalCompositeOperation='screen';for(const [sx,sy]of hdFixtures[game.level]){const x=sx/2172*w,y=sy/724*GROUND_Y,pulse=1+Math.sin(t*1.7+sx)*.035;if(floorOnly)hdGlow(x,205,30,9,rgb,.07*pulse);else{hdGlow(x,y,13,20,rgb,.17*pulse);if(game.level===4){ctx.fillStyle='#fff0b0';ctx.beginPath();ctx.ellipse(x+Math.sin(t*3+sx)*.2,y-.8,.5,1.6,0,0,Math.PI*2);ctx.fill()}}}ctx.restore()}
drawPavement=function(){
 const im=hdImages.floor;if(!READY(im)){ctx.fillStyle='#4a4053';ctx.fillRect(0,GROUND_Y,WIDTH,HEIGHT-GROUND_Y);return}
 const band=im.naturalHeight/5,scale=hdPrefs.resolution;
 // Texture is sampled from native HD rows rather than enlarged from the legacy 84-pixel strip.
 const tile=560,first=Math.floor(game.camera/tile)-1;
 for(let i=first;i<first+4;i++){const x=i*tile-game.camera,flip=Math.abs(i%2)===1;ctx.save();ctx.translate(x+(flip?tile:0),0);if(flip)ctx.scale(-1,1);ctx.drawImage(im,0,game.level*band,im.naturalWidth,band,0,GROUND_Y,tile,HEIGHT-GROUND_Y);ctx.restore()}
 const shade=ctx.createLinearGradient(0,GROUND_Y,0,HEIGHT);shade.addColorStop(0,'#0b102777');shade.addColorStop(.25,'#17203a0a');shade.addColorStop(1,'#100d2038');ctx.fillStyle=shade;ctx.fillRect(0,GROUND_Y,WIDTH,HEIGHT-GROUND_Y);
 if(hdPrefs.lighting&&game.level===1){ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<5;i++){const x=(i*154-game.camera*.64)%620;hdGlow(x,202+Math.sin(i)*7,28,2,hdProfiles[1].light,.13)}ctx.restore()}
};
function hdMist(front){const p=hdProfiles[game.level],t=hdPrefs.calm?0:game.clock;ctx.save();const density=game.fx?p.fog:p.fog*.4;for(let i=0;i<4;i++){const factor=(front?1.20:.39)+i*.035;const x=((i*161-game.camera*(hdPrefs.parallax?factor:0)+t*(front?3:1.5))%720+720)%720-120;const y=(front?255:173)+Math.sin(t*.17+i)*3;hdGlow(x,y,110+i*8,front?13:19,p.mist,density*(front?.21:.32))}ctx.restore()}
function hdSceneLights(front){
 const p=hdProfiles[game.level],t=hdPrefs.calm?0:game.clock;
 ctx.save();ctx.globalCompositeOperation='screen';
 if(!front){
  if([0,2,3].includes(game.level)){
   ctx.save();ctx.beginPath();ctx.moveTo(280,-20);ctx.lineTo(329,-20);ctx.lineTo(214,GROUND_Y);ctx.lineTo(86,GROUND_Y);ctx.closePath();const ray=ctx.createLinearGradient(300,10,160,190);ray.addColorStop(0,`rgba(${p.light},.09)`);ray.addColorStop(1,`rgba(${p.light},0)`);ctx.fillStyle=ray;ctx.fill();ctx.restore();
  }
 }else{
  // Intermittent pools track their world fixtures; static architecture never warps.
  if(game.level===1||game.level===4){const im=hdImages[hdSceneKeys[game.level]+'-near'],w=im?im.naturalWidth/im.naturalHeight*GROUND_Y:558,offset=game.camera*(hdPrefs.parallax ? .64 : 0),first=Math.floor(offset/w)-1;for(let i=first;i<first+3;i++){ctx.save();const flip=Math.abs(i%2)===1;ctx.translate(i*w-offset+(flip?w:0),0);if(flip)ctx.scale(-1,1);hdFixtureLights(w,true);ctx.restore()}}
  for(const s of game.shots)hdGlow(s.x-game.camera,s.y,20,15,s.owner?.id===2?'100,224,250':'255,207,117',.28);
 }
 ctx.restore();
}
closerScenery=function(){
 const depth=hdPrefs.parallax?1.12:1;ctx.save();
 // Clean vector foreground silhouettes with generous clear space around the fighting lane.
 const first=Math.floor(game.camera*depth/370)-1;
 for(let i=first;i<first+4;i++){
  const x=i*370-game.camera*depth+45;
  if(game.level===0){ctx.strokeStyle='#242c3b';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-100,0);ctx.quadraticCurveTo(x+60,44,x+300,1);ctx.stroke();for(let k=0;k<3;k++){ctx.fillStyle=['#b56a82','#bf926d','#638e8f'][k];ctx.beginPath();ctx.moveTo(x+k*36,13);ctx.lineTo(x+13+k*36,16);ctx.lineTo(x+6+k*36,30);ctx.closePath();ctx.fill()}}
  else if(game.level===2){ctx.fillStyle='#102e35';for(let k=0;k<7;k++){ctx.save();ctx.translate(x+k*7,-2);ctx.rotate(Math.sin(i+k)*.5);ctx.beginPath();ctx.ellipse(0,10,4,17,0,0,Math.PI*2);ctx.fill();ctx.restore()}}
  else if(game.level===4){ctx.fillStyle='#191928';ctx.fillRect(x,-10,7,36);ctx.fillStyle='#403549';ctx.fillRect(x+1,0,1,30)}
  if(game.level===2||game.level===3){ctx.save();ctx.translate(x,274);for(let k=0;k<5;k++){ctx.rotate(.3);ctx.fillStyle=k%2?'#263f35':'#18383a';ctx.beginPath();ctx.ellipse(k*2,-5-k,2.2,8,.4+k*.3,0,Math.PI*2);ctx.fill()}ctx.restore()}
 }
 ctx.restore();
 if(hdPrefs.fog)hdMist(true);
}
const hdOriginalShadow=shadow;
shadow=function(x,y,w,shade=.54){ctx.save();if(hdPrefs.lighting){ctx.translate(x,y+1);ctx.scale(1,.24);const grad=ctx.createRadialGradient(0,0,0,0,0,w*1.55);grad.addColorStop(0,`rgba(12,10,24,${shade})`);grad.addColorStop(1,'rgba(12,10,24,0)');ctx.fillStyle=grad;ctx.fillRect(-w*1.55,-w*1.55,w*3.1,w*3.1)}else hdOriginalShadow(x,y,w,shade);ctx.restore()};
// Fractional world positions now retain their subpixel precision on the HD backing canvas.
pixel=function(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)};
label=function(text,x,y,size,color,align='left'){ctx.font=`800 ${size}px "Trebuchet MS",sans-serif`;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillStyle='#111322cc';ctx.fillText(text,x+.35,y+.5);ctx.fillStyle=color;ctx.fillText(text,x,y)};
function hdAtmosphere(){
 if(hdPrefs.lighting)hdSceneLights(true);
 if(game.level===2&&game.fx){ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<17;i++){const t=hdPrefs.calm?0:game.clock;const x=((i*71-game.camera*.77+t*(i%2?2:-2))%550+550)%550-25;const y=85+i*9%133+Math.sin(t*.8+i)*6;hdGlow(x,y,2.6,2.6,'131,244,207',.32+.13*Math.sin(t+i))}ctx.restore()}
 if(hdPrefs.grain){ctx.save();ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=hdPrefs.grain===2?.18:.085;const frame=hdPrefs.calm?0:Math.floor(game.clock*12)%4;ctx.drawImage(hdNoise[frame],0,0,WIDTH,HEIGHT);ctx.restore()}
 const vignette=ctx.createRadialGradient(WIDTH/2,HEIGHT/2,80,WIDTH/2,HEIGHT/2,300);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'rgba(9,9,23,.24)');ctx.fillStyle=vignette;ctx.fillRect(0,0,WIDTH,HEIGHT);
}
const hdOriginalHud=hud;
const hdPixelBuffer=document.createElement('canvas');let hdCRTMask=null;
function hdDisplayFilter(){
 if(hdPrefs.display==='hd')return;
 const width=hdPrefs.display==='pixel'?480:384,height=Math.round(width*HEIGHT/WIDTH);
 if(hdPixelBuffer.width!==width){hdPixelBuffer.width=width;hdPixelBuffer.height=height}
 const q=hdPixelBuffer.getContext('2d',{alpha:false});q.imageSmoothingEnabled=true;q.drawImage(canvas,0,0,width,height);
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;if(hdPrefs.display==='crt')ctx.filter='contrast(1.08) saturate(1.12)';ctx.drawImage(hdPixelBuffer,0,0,canvas.width,canvas.height);ctx.filter='none';
 if(hdPrefs.display==='crt'){
  if(!hdCRTMask||hdCRTMask.width!==canvas.width){hdCRTMask=document.createElement('canvas');hdCRTMask.width=canvas.width;hdCRTMask.height=canvas.height;const mask=hdCRTMask.getContext('2d');const pitch=canvas.width/384;mask.fillStyle='#050a1c38';for(let y=0;y<canvas.height;y+=pitch)mask.fillRect(0,y,canvas.width,Math.max(1,pitch*.30));for(let x=0;x<canvas.width;x+=3){mask.fillStyle='rgba(255,100,85,.025)';mask.fillRect(x,0,1,canvas.height);mask.fillStyle='rgba(100,185,255,.025)';mask.fillRect(x+2,0,1,canvas.height)}}
  ctx.drawImage(hdCRTMask,0,0);const v=ctx.createRadialGradient(canvas.width/2,canvas.height/2,canvas.height*.3,canvas.width/2,canvas.height/2,canvas.width*.65);v.addColorStop(0,'transparent');v.addColorStop(1,'#03051777');ctx.fillStyle=v;ctx.fillRect(0,0,canvas.width,canvas.height);
 }
 ctx.restore();
}
hud=function(){hdAtmosphere();hdDisplayFilter();hdOriginalHud()};
const hdOriginalDraw=draw;
draw=function(){const start=performance.now();ctx.setTransform(hdPrefs.resolution,0,0,hdPrefs.resolution,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';const fx=game.fx;if(hdPrefs.calm)game.fx=false;hdOriginalDraw();game.fx=fx;hdFrameTimes.push(performance.now()-start);if(hdFrameTimes.length>600)hdFrameTimes.shift()};

const HD_TABS=['ΕΙΚΟΝΑ','ΗΧΟΣ','ΧΕΙΡΙΣΜΟΣ','ΠΡΟΣΒΑΣΗ'];
const hdSettingDefs=[
 [['resolution','ΑΝΑΛΥΣΗ',''],['display','ΦΙΛΤΡΟ ΕΙΚΟΝΑΣ','Καθαρό HD, pixel ή CRT οθόνη'],['lighting','ΦΩΤΙΣΜΟΣ & ΣΚΙΕΣ','Τοπικό φως και σκιές επαφής'],['fog','ΑΤΜΟΣΦΑΙΡΑ','Ομίχλη ανάλογα με την πίστα'],['grain','FILM GRAIN','Διακριτική κινηματογραφική υφή'],['parallax','ΒΑΘΟΣ','Ανεξάρτητα επίπεδα κύλισης']],
 [['musicVolume','ΜΟΥΣΙΚΗ','Ένταση μουσικής'],['sfxVolume','ΗΧΗΤΙΚΑ ΕΦΕ','Ένταση δράσης'],['music','ΜΟΥΣΙΚΗ ON / OFF',''],['sound','ΕΦΕ ON / OFF','']],
 [['pad','ΕΝΑ ΧΕΙΡΙΣΤΗΡΙΟ','Ανάθεση σε παίκτη'],['guide','ΟΔΗΓΟΣ ΚΟΥΜΠΙΩΝ','Xbox / PlayStation / πληκτρολόγιο'],['full','ΠΛΗΡΗΣ ΟΘΟΝΗ','']],
 [['calm','ΗΡΕΜΗ ΛΕΙΤΟΥΡΓΙΑ','Χωρίς shake, ήπια σταθερά εφέ'],['contrast','ΥΨΗΛΗ ΑΝΤΙΘΕΣΗ UI','Πιο έντονο περίγραμμα επιλογής']]
];
function hdSettingValue(key){if(key==='resolution')return {2:'960 × 540',3:'1440 × 810',4:'1920 × 1080'}[hdPrefs.resolution];if(key==='display')return {hd:'ΚΑΘΑΡΟ HD',pixel:'PIXEL',crt:'CRT'}[hdPrefs.display];if(key==='grain')return ['ΚΛΕΙΣΤΟ','ΔΙΑΚΡΙΤΙΚΟ','ΚΙΝΗΜΑΤΟΓΡΑΦΙΚΟ'][hdPrefs.grain];if(key==='pad')return 'ΠΑΙΚΤΗΣ '+preferredPadPlayer;if(key==='musicVolume'||key==='sfxVolume')return hdPrefs[key]+'%';if(key==='guide')return 'ΠΡΟΒΟΛΗ';if(key==='full')return 'ΑΝΟΙΓΜΑ';return (key in hdPrefs?hdPrefs[key]:game[key])?'ΝΑΙ':'ΟΧΙ'}
function hdSettings(){return `<div class="console-settings"><header><span class="eyebrow">LITTLE DRAGON · HD</span><h2>ΡΥΘΜΙΣΕΙΣ</h2></header><nav class="settings-tabs" aria-label="Κατηγορίες ρυθμίσεων">${HD_TABS.map((s,i)=>`<button data-go="tab${i}" class="${i===hdTab?'active':''}" aria-pressed="${i===hdTab}">${s}</button>`).join('')}</nav><div class="setting-list">${hdSettingDefs[hdTab].map(([key,label,hint])=>`<button class="setting-row" data-go="hd-${key}" aria-label="${label}: ${hdSettingValue(key)}"><span><b>${label}</b>${hint?`<small>${hint}</small>`:''}</span><strong><i>‹</i> ${hdSettingValue(key)} <i>›</i></strong></button>`).join('')}</div><div id="pad-status" aria-live="polite"></div><button class="back-command" data-go="back">↩ ΕΠΙΣΤΡΟΦΗ</button></div>`}
function hdHints(){const ps=hdPadLabel==='ps';return `<div class="console-hints" aria-hidden="true"><span><i>✥</i> ΕΠΙΛΟΓΗ</span><span><i>${ps?'×':'A'}</i> ΕΠΙΒΕΒΑΙΩΣΗ</span><span><i>${ps?'○':'B'}</i> ΠΙΣΩ</span>${game.mode==='settings'?'<span><i>LB / RB</i> ΚΑΤΗΓΟΡΙΑ</span>':''}</div>`}
function hdHome(){return `<div class="title-scene"><span class="edition-mark">THE HIGH DEFINITION ADVENTURE</span><h1 class="logo">LITTLE<br><span>DRAGON</span><em>’96</em></h1><p class="subtitle">YOTO QUEST</p><div class="console-menu" role="group" aria-label="Αρχικό μενού">${[['two','ΠΑΙΞΤΕ ΜΑΖΙ','Δύο παίκτες · μία περιπέτεια'],['one','ΕΝΑΣ ΠΑΙΚΤΗΣ','Διάλεξε τον ήρωά σου'],['how','ΧΕΙΡΙΣΜΟΣ','Μάθε τις κινήσεις σου'],['settings','ΡΥΘΜΙΣΕΙΣ','Εικόνα · ήχος · χειριστήριο']].map(([key,title,hint],i)=>`<button data-go="${key}" ${i===0?'class="primary"':''} ${!hdLoaded&&i<2?'disabled':''}><span class="menu-arrow">◆</span><span><b>${title}</b><small>${hint}</small></span></button>`).join('')}</div><span class="title-note">5 ΚΟΣΜΟΙ · 2 ΗΡΩΕΣ · ΟΛΕΣ ΟΙ ΙΣΤΟΡΙΕΣ</span>${!hdLoaded?`<span id="hd-loading" role="status">ΦΟΡΤΩΣΗ HD · ${Math.round(hdLoadDone/hdLoadTotal*100)}%</span>`:''}</div>`}
function hdGuide(){return `<div class="console-guide"><span class="eyebrow">ΠΑΙΞΕ ΜΕ ΤΟΝ ΤΡΟΠΟ ΣΟΥ</span><h2>ΧΕΙΡΙΣΜΟΣ</h2><div class="guide-grid"><div class="controller-diagram" aria-hidden="true"><div class="pad-wing left"></div><div class="pad-wing right"></div><b class="pad-cross">✥</b><span class="pad-stick">●</span><div class="pad-face"><i>Y / △</i><i>X / □</i><i>B / ○</i><i>A / ×</i></div></div><div class="guide-lines"><p><b>ΜΟΧΛΟΣ / ΣΤΑΥΡΟΣ</b>Κίνηση · επιλογή μενού</p><p><b>A / ×</b>Άλμα · επιβεβαίωση</p><p><b>X / □ · B / ○</b>Γροθιά · κλωτσιά</p><p><b>Y / △ · R1 / RB</b>Ενέργεια · σήκωμα / ρίψη</p><p><b>L1 / LB · L3 / R3</b>Άμυνα · αποφυγή</p><p><b>OPTIONS / MENU</b>Παύση · συνέχεια</p></div></div><p class="keyboard-guide">ΠΛΗΚΤΡΟΛΟΓΙΟ · P1: βελάκια, J/K/L, Space, H/U/I<br>P2: WASD, F/G/R, T, Y/E/Q · Enter: επιλογή · Esc: πίσω</p><div id="pad-status" aria-live="polite"></div><button class="back-command primary" data-go="back">↩ ΕΠΙΣΤΡΟΦΗ</button></div>`}
const hdBaseShow=show;
show=function(page){
 hdLastPage=game.mode;
 if(page==='settings'&&!['settings','how'].includes(game.mode))hdSettingsOrigin=game.mode==='play'?'pause':game.mode;
 if(page==='how'&&game.mode!=='how')hdGuideOrigin=game.mode;
 hdBaseShow(page);
 if(page==='home')panel.innerHTML=hdHome();
 else if(page==='settings')panel.innerHTML=hdSettings();
 else if(page==='how')panel.innerHTML=hdGuide();
 screen.querySelector('.console-hints')?.remove();
 if(page!=='play')screen.insertAdjacentHTML('beforeend',hdHints());
 screen.setAttribute('aria-label',page==='home'?'Αρχικό μενού':page==='settings'?'Ρυθμίσεις':page==='how'?'Χειρισμός':'Μενού παιχνιδιού');
 panel.querySelector('button:not(:disabled)')?.focus({preventScroll:true});
 document.querySelector('#enable-audio').hidden=true;
};
function hdFocus(name){const el=panel.querySelector(`[data-go="${name}"]`);el?.focus({preventScroll:true});el?.scrollIntoView({block:'nearest',inline:'nearest'})}
function hdAdjust(name,delta=1){
 const key=name.replace(/^hd-/,'');
 if(key==='guide'){previous='settings';show('how');return}
 if(key==='full'){go('full');return}
 if(key==='pad')preferredPadPlayer=preferredPadPlayer===1?2:1;
 else if(key==='resolution'){const vals=[2,3,4],idx=vals.indexOf(hdPrefs.resolution);hdPrefs.resolution=vals[(idx+delta+vals.length)%vals.length]}
 else if(key==='display'){const values=['hd','pixel','crt'];hdPrefs.display=values[(values.indexOf(hdPrefs.display)+delta+3)%3]}
 else if(key==='grain')hdPrefs.grain=(hdPrefs.grain+delta+3)%3;
 else if(key==='musicVolume'||key==='sfxVolume')hdPrefs[key]=clamp(hdPrefs[key]+delta*10,0,100);
 else if(key==='music'||key==='sound')game[key]=!game[key];
 else if(key in hdPrefs)hdPrefs[key]=!hdPrefs[key];
 hdSave();hdResize();applyAudioVolumes();show('settings');hdFocus(name);
}
const hdBaseGo=go;
go=function(name){
 hdUserNavigated=true;
 if(name==='back'){hdBack();return}
 if(name.startsWith('tab')){hdTab=Number(name.slice(3));show('settings');hdFocus('tab'+hdTab);return}
 if(name.startsWith('hd-')){unlockSound();hdAdjust(name);return}
 if(name==='back'&&game.mode==='how'&&previous==='settings'){show('settings');return}
 hdBaseGo(name);
};
function hdMove(dx,dy){
 hdUserNavigated=true;
 const current=document.activeElement;
 if(game.mode==='settings'){
  const name=current?.dataset.go||'',rows=[...panel.querySelectorAll('.setting-row')];
  if(name.startsWith('tab')){if(dy){(dy>0?rows[0]:panel.querySelector('[data-go="back"]'))?.focus({preventScroll:true})}else if(dx){hdTab=(hdTab+dx+4)%4;show('settings');hdFocus('tab'+hdTab)}return}
  if(dy){let target;if(name==='back')target=dy<0?rows.at(-1):panel.querySelector('[data-go="tab'+hdTab+'"]');else{const i=rows.indexOf(current);target=rows[i+dy]||(dy<0?panel.querySelector('[data-go="tab'+hdTab+'"]'):panel.querySelector('[data-go="back"]'))}target?.focus({preventScroll:true});target?.scrollIntoView({block:'nearest'});return}
 }
 if(game.mode==='settings'&&dx&&current?.dataset.go?.startsWith('hd-')){hdAdjust(current.dataset.go,dx);return}
 const buttons=[...panel.querySelectorAll('button:not(:disabled)')].filter(b=>b.getClientRects().length);
 if(!buttons.length)return;
 if(!buttons.includes(current)){buttons[0].focus({preventScroll:true});return}
 const r=current.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;
 let best=null,score=Infinity;
 for(const b of buttons){if(b===current)continue;const q=b.getBoundingClientRect(),vx=q.x+q.width/2-x,vy=q.y+q.height/2-y,forward=vx*dx+vy*dy;if(forward<5)continue;const off=Math.abs(vy*dx-vx*dy),s=forward+off*2.4;if(s<score){score=s;best=b}}
 if(!best){const idx=buttons.indexOf(current);best=buttons[(idx+(dy||dx)+buttons.length)%buttons.length]}
 best.focus({preventScroll:true});best.scrollIntoView({block:'nearest',inline:'nearest'});
}
moveMenu=hdMove;
function hdBack(){if(game.mode==='play')show('pause');else if(game.mode==='pause')show('play');else if(game.mode==='how')show(hdGuideOrigin);else if(game.mode==='settings')show(hdSettingsOrigin);else if(game.mode!=='home')show('home')}
const hdPollGameplay=pollPads;
pollPads=function(time){
 const pads=readPads();if(pads.length){hdLastInput='pad';hdPadLabel=/dualsense|dualshock|054c|playstation/i.test(pads[0].id)?'ps':'generic'}
 if(game.mode==='play'){
  for(const pad of pads)hdMenuPads.set(pad.index,{buttons:pad.buttons.map(b=>b.pressed||b.value>.45),dir:'',at:0});
  hdPollGameplay(time);return;
 }
 padHeld.clear();padAim.clear();if(document.hidden)return;
 for(const index of [...hdMenuPads.keys()])if(!pads.some(p=>p.index===index))hdMenuPads.delete(index);
 for(const pad of pads){
  const buttons=pad.buttons.map(b=>b.pressed||b.value>.45),s=hdMenuPads.get(pad.index)||{buttons:[],dir:'',at:0},edge=i=>buttons[i]&&!s.buttons[i];
  // Seed the gameplay edge detector, so confirmation cannot also jump on the first play frame.
  const existing=padStates.get(pad.index);if(existing)existing.buttons=buttons;else padStates.set(pad.index,{seat:-1,buttons,direction:'',repeatAt:0});
  const dx=Number(buttons[15]||(pad.axes[0]||0)>.38)-Number(buttons[14]||(pad.axes[0]||0)<-.38),dy=Number(buttons[13]||(pad.axes[1]||0)>.38)-Number(buttons[12]||(pad.axes[1]||0)<-.38),dir=dx+':'+dy;
  if(edge(1)||edge(8))hdBack();
  else if(game.mode==='settings'&&(edge(4)||edge(5))){hdTab=(hdTab+(edge(5)?1:3))%4;show('settings');hdFocus('tab'+hdTab)}
  else if(edge(0)){if(['intro','ending','chapter-end'].includes(game.mode))go('arcadeAdvance');else{const b=document.activeElement;if(panel.contains(b)&&b.matches('button'))b.click();else panel.querySelector('button')?.click()}}
  else if(edge(9)){if(game.mode==='chapter-end')go('chapter-skip');else if(game.mode==='intro')go('skipIntro');else if(game.mode==='ending')go('arcadeAdvance');else if(game.mode==='pause')show('play');else if(['difficulty','characters'].includes(game.mode)){const b=document.activeElement;panel.contains(b)&&b.matches('button')?b.click():panel.querySelector('button.primary')?.click()}else if(['stage','clear','lose'].includes(game.mode))panel.querySelector('button.primary')?.click();else panel.querySelector('button')?.focus({preventScroll:true})}
  else if((dx||dy)&&(s.dir!==dir||time>=s.at)){hdMove(dx,dx?0:dy);s.at=time+(s.dir===dir?150:320)}
  s.buttons=buttons;s.dir=dir;hdMenuPads.set(pad.index,s);
 }
 const status=document.querySelector('#pad-status');if(status)status.textContent=pads.length?`${pads.length} χειριστήρι${pads.length===1?'ο':'α'} συνδεδεμέν${pads.length===1?'ο':'α'} · A / × επιλογή · B / ○ πίσω`:'Χειριστήριο: σύνδεσέ το και πάτησε ένα κουμπί. Όλα τα μενού λειτουργούν και με βελάκια / Enter.';
};
addEventListener('keydown',e=>{
 if(game.mode==='play')return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter',' ','Escape','Home','End'].includes(e.key)){
  e.preventDefault();e.stopImmediatePropagation();hdLastInput='keyboard';if(e.repeat&&['Enter',' ','Escape'].includes(e.key))return;
  if(e.key==='Escape')hdBack();else if(e.key==='Enter'||e.key===' '){if(game.mode==='chapter-end'&&document.activeElement?.dataset.go==='chapter-skip')go('chapter-skip');else if(['intro','ending','chapter-end'].includes(game.mode))go('arcadeAdvance');else document.activeElement?.matches('button')?document.activeElement.click():panel.querySelector('button')?.click()}
  else if(e.key==='Home'||e.key==='End'){const b=[...panel.querySelectorAll('button')];b[e.key==='Home'?0:b.length-1]?.focus()}
  else hdMove(e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0,e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0);
 }
},true);
addEventListener('gamepaddisconnected',()=>{if(game.mode==='play'&&!readPads().length){keys.clear();show('pause')}});
document.addEventListener('pointermove',()=>{hdLastInput='pointer'},{passive:true});
hdAssetReady.then(()=>{hdLoaded=true;const focus=hdUserNavigated?document.activeElement?.dataset.go:null;show(game.mode);if(focus)hdFocus(focus);document.documentElement.dataset.hdReady='true'}).catch(e=>{console.error(e);const p=document.createElement('p');p.className='asset-error';p.textContent='Δεν φορτώθηκαν όλα τα HD γραφικά. Ανανέωσε τη σελίδα.';screen.append(p)});
show('home');
globalThis.DragonHD={version:HD_VERSION,prefs:hdPrefs,profiles:hdProfiles,layers:[.025,.075,.10,.19,.64,1,1.12,1.20],ready:hdAssetReady,frameTimes:hdFrameTimes};
