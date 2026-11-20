'use strict';
let chapterLoadToken=0,chapterLoadOrigin='home',chapterLoadingAction=null,activeChapterPack=null;
const chapterShared=new Map();
function chapterPackKeys(level,extra=[]){return [...new Set(['world-entrances','story-props','ground-transition-'+level,'chapter-end-bg-'+level,'chapter-end-actors-'+level,...STAGES[level].foes.filter(t=>t>=20).map(t=>'foe-motion-'+t),...(level===1?['harbor-launch','harbor-berth']:[]),...(level===5?['frost-far','frost-near','floor-variants-5','frost-boss','director-life-5','director-props-5']:[]),...extra])]}
async function chapterLoadImage(key){const src=WORLD_ART[key];if(!src)throw Error('Missing world asset '+key);if(chapterShared.has(key))return chapterShared.get(key);const im=new Image();im.dataset.art=key;im.src=src;for(let attempt=0;attempt<3;attempt++){try{await im.decode();if(['world-entrances','story-props'].includes(key))chapterShared.set(key,im);return im}catch(e){if(attempt===2)throw Error('World asset could not decode: '+key,{cause:e});im.removeAttribute('src');im.src=src;await new Promise(r=>setTimeout(r,80*(attempt+1)))}}}
async function loadChapterPack(level,extra=[],progress=()=>{},isCurrent=()=>true){
 const keys=chapterPackKeys(level,extra);if(activeChapterPack?.level===level&&keys.every(k=>READY(images[k])))return;
 const loaded=new Map();let next=0,done=0;
 await Promise.all(Array.from({length:3},async()=>{while(next<keys.length){const key=keys[next++],im=READY(images[key])?images[key]:await chapterLoadImage(key);loaded.set(key,im);progress(++done,keys.length)}}));
 if(!isCurrent())return;
 // Keep a single extra world pack in memory instead of decoding every new atlas on mobile.
 if(activeChapterPack)for(const key of activeChapterPack.keys)if(!loaded.has(key)&&!chapterShared.has(key)){delete images[key];if(key==='frost-far'||key==='frost-near')delete hdImages[key]}
 for(const [key,im]of loaded)images[key]=im;
 if(level===5){hdImages['frost-far']=images['frost-far'];hdImages['frost-near']=images['frost-near']}
 activeChapterPack={level,keys};prepareFloorTiles();
}
function cancelChapterLoad(){chapterLoadToken++;chapterLoadingAction=null;show(chapterLoadOrigin)}
async function withChapterPack(level,action){
 const token=++chapterLoadToken;if(!['chapter-loading','chapter-load-error'].includes(game.mode))chapterLoadOrigin=['intro','ending'].includes(game.mode)?'home':game.mode;chapterLoadingAction=()=>withChapterPack(level,action);show('chapter-loading');
 try{await loadChapterPack(level,[],(done,total)=>{if(token===chapterLoadToken){const status=panel.querySelector('[data-chapter-progress]');if(status)status.textContent=Math.round(done/total*100)+'%'}} ,()=>token===chapterLoadToken);if(token!==chapterLoadToken)return;chapterLoadingAction=null;action()}
 catch(e){if(token!==chapterLoadToken)return;console.error(e);show('chapter-load-error')}
}
const packShow=show;
show=function(page){packShow(page);if(page==='chapter-loading'||page==='chapter-load-error'){panel.innerHTML=`<div class="mode-screen"><h2>${page==='chapter-loading'?'ΕΤΟΙΜΑΖΕΤΑΙ Η ΠΕΡΙΟΧΗ':'Η ΠΕΡΙΟΧΗ ΔΕΝ ΦΟΡΤΩΘΗΚΕ'}</h2><p data-chapter-progress role="status" aria-live="polite">${page==='chapter-loading'?'0%':'Δοκίμασε ξανά ή γύρισε πίσω.'}</p>${page==='chapter-load-error'?arcadeButton('chapter-load-retry','ΞΑΝΑΠΡΟΣΠΑΘΗΣΕ','retry'):''}${arcadeButton('chapter-load-cancel','ΠΙΣΩ','back')}</div>`;panel.querySelector('button')?.focus({preventScroll:true})}};
const packStart=start;
start=function(two){const target=selectedMode==='practice'?practiceStage:0;return withChapterPack(target,()=>packStart(two))};
const packBack=hdBack;
hdBack=function(){if(['chapter-loading','chapter-load-error'].includes(game.mode)){cancelChapterLoad();return}packBack()};
const packGo=go;
go=function(name){if(name==='chapter-load-cancel'){cancelChapterLoad();return}if(name==='chapter-load-retry'){chapterLoadingAction?.();return}if(name==='nextStage'&&game.sessionMode!=='practice'){const next=CAMPAIGN_ORDER.indexOf(game.level)+1;if(next===CAMPAIGN_ORDER.length){show('ending');return}return withChapterPack(CAMPAIGN_ORDER[next],()=>{game.level=CAMPAIGN_ORDER[next];beginStage()})}return packGo(name)};
practiceLevelsScreen=function(){return `<div class="mode-screen practice-screen"><h2>ΔΙΑΛΕΞΕ ΠΙΣΤΑ</h2><p>PRACTICE · ${selectedTwo?'2 ΠΑΙΚΤΕΣ':'1 ΠΑΙΚΤΗΣ'}</p><div class="practice-levels">${CAMPAIGN_ORDER.map((level,n)=>`<button type="button" class="practice-level ${practiceStage===level?'primary':''}" data-go="practice-stage-${level}" aria-label="${n+1}. ${STAGES[level].name}"><img src="${level===5?'assets/frost-far-thumb.webp':'assets/hd-far-'+hdSceneKeys[level]+'.webp'}" alt="" draggable="false"><span><i>${String(n+1).padStart(2,'0')}</i><b>${STAGES[level].name}</b></span></button>`).join('')}</div>${arcadeButton('back','ΠΙΣΩ','back')}</div>`};
chapterText('ΕΤΟΙΜΑΖΕΤΑΙ Η ΠΕΡΙΟΧΗ','PREPARING THE AREA','ПІДГОТОВКА МІСЦЕВОСТІ');chapterText('Η ΠΕΡΙΟΧΗ ΔΕΝ ΦΟΡΤΩΘΗΚΕ','THE AREA DID NOT LOAD','МІСЦЕВІСТЬ НЕ ЗАВАНТАЖИЛАСЯ');chapterText('Δοκίμασε ξανά ή γύρισε πίσω.','Try again or go back.','Спробуйте ще раз або поверніться назад.');
