'use strict';
let chapterOutro=null;
chapterText('ΠΑΡΑΛΕΙΨΗ','SKIP','ПРОПУСТИТИ');chapterText('ΠΑΡΑΛΕΙΨΗ ΣΚΗΝΗΣ','SKIP SCENE','ПРОПУСТИТИ СЦЕНУ');chapterText('ΠΙΣΤΑ','STAGE','РІВЕНЬ');chapterText('A / ENTER / ΑΓΓΙΓΜΑ · ΕΠΟΜΕΝΟ','A / ENTER / TAP · NEXT','A / ENTER / ДОТИК · ДАЛІ');chapterText('START / ESC · ΠΑΡΑΛΕΙΨΗ','START / ESC · SKIP','START / ESC · ПРОПУСТИТИ');
function chapterComic(){const end=CHAPTER_ENDS[chapterOutro.level];return `<article class="comic chapter-outro"><header><span>ΠΙΣΤΑ ${CAMPAIGN_ORDER.indexOf(chapterOutro.level)+1} / 6 · ${chapterOutro.page+1} / ${end.pages.length}</span><button type="button" class="chapter-skip" data-go="chapter-skip" aria-label="ΠΑΡΑΛΕΙΨΗ ΣΚΗΝΗΣ">ΠΑΡΑΛΕΙΨΗ ▶</button></header><div class="comic-art"><canvas class="story-canvas" width="1536" height="864" tabindex="0" role="button" aria-label="A / ENTER / ΑΓΓΙΓΜΑ · ΕΠΟΜΕΝΟ"></canvas></div><div class="comic-copy"><h2>${end.title}</h2><p>${end.pages[chapterOutro.page]}</p><div class="arcade-story-hint" data-typing="true">A / ENTER / ΑΓΓΙΓΜΑ · ΕΠΟΜΕΝΟ <span>START / ESC · ΠΑΡΑΛΕΙΨΗ</span></div></div></article>`}
const chapterSceneShow=show;
show=function(page){
 if(page==='clear'&&chapterState&&!chapterState.endShown&&game.gate==='reward'){chapterState.endShown=true;chapterOutro={level:game.level,page:0,time:0};chapterEvent('outro-start');page='chapter-end'}
 chapterSceneShow(page);
 if(page==='chapter-end'){if(!chapterOutro||chapterOutro.level!==game.level)chapterOutro={level:game.level,page:0,time:0};panel.innerHTML=chapterComic();initStoryText();panel.querySelector('.story-canvas')?.focus({preventScroll:true});screen.setAttribute('aria-label',CHAPTER_ENDS[chapterOutro.level].title)}
};
function advanceChapterEnd(skip=false){if(!chapterOutro)return;if(skip){chapterEvent('outro-skip');show('clear');return}if(familyStory&&!familyStory.complete){familyStory.el.textContent=familyStory.text;familyStory.complete=true;familyStory.read=0;panel.querySelector('.arcade-story-hint')?.removeAttribute('data-typing');return}chapterOutro.page++;if(chapterOutro.page>=CHAPTER_ENDS[chapterOutro.level].pages.length){chapterEvent('outro-complete');show('clear')}else show('chapter-end')}
const chapterSceneGo=go;
go=function(name){if(game.mode==='chapter-end'&&(name==='arcadeAdvance'||name==='chapter-skip')){advanceChapterEnd(name==='chapter-skip');return}return chapterSceneGo(name)};
const chapterSceneBack=hdBack;
hdBack=function(){if(game.mode==='chapter-end'){advanceChapterEnd(true);return}chapterSceneBack()};
panel.addEventListener('click',e=>{if(game.mode==='chapter-end'&&!e.target.closest('button'))go('arcadeAdvance')});
function drawChapterEnd(){
 if(!chapterOutro)return;const c=panel.querySelector('.story-canvas');if(!c)return;const level=chapterOutro.level,bg=images['chapter-end-bg-'+level],actors=images['chapter-end-actors-'+level];if(!READY(bg)||!READY(actors))return;
 const g=c.getContext('2d'),w=c.width,h=c.height,m=DRAGON_CAMPAIGN_META.ends[level],t=chapterOutro.time,pan=hdPrefs.calm?0:Math.sin(t*.12)*9,zoom=1.025;
 g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.fillStyle='#142438';g.fillRect(0,0,w,h);const scale=Math.max(w/bg.naturalWidth,h/bg.naturalHeight)*zoom,bw=bg.naturalWidth*scale,bh=bg.naturalHeight*scale;g.drawImage(bg,(w-bw)/2+pan,(h-bh)/2,bw,bh);
 const order=[0,0,0,1,2,3,4,5,6,7,7,7,6,5,4,3,2,1],frame=hdPrefs.calm?0:order[Math.floor(t*5)%order.length],sw=actors.naturalWidth/m.cols,sh=actors.naturalHeight/m.rows,ah=h*m.height,aw=ah*sw/sh,x=w*.54-pan*.4,y=h*.94;
 g.save();g.fillStyle='#101a2b40';g.beginPath();g.ellipse(x,y,aw*.3,12,0,0,Math.PI*2);g.fill();g.drawImage(actors,frame%m.cols*sw,Math.floor(frame/m.cols)*sh,sw,sh,x-aw*m.center,y-ah*m.anchor,aw,ah);g.restore();
 if(hdPrefs.lighting){const glow=g.createRadialGradient(w*.8,h*.12,0,w*.8,h*.12,h*.75);glow.addColorStop(0,level===5?'#ffd59a18':'#ffe6a012');glow.addColorStop(1,'#ffe0a000');g.fillStyle=glow;g.fillRect(0,0,w,h)}
 if(!hdPrefs.calm){g.fillStyle=level===5?'#d9eaff75':'#f3e2ad65';for(let k=0;k<13;k++){const px=(k*131+t*(level===5?13:3))%w,py=(k*89+t*(level===5?22:2))%h;g.fillRect(px,py,level===5?2:1.4,level===5?2:1.4)}}
}
const chapterSceneDraw=draw;
draw=function(){chapterSceneDraw();if(game.mode==='chapter-end')drawChapterEnd()};
const chapterSceneUpdate=update;
update=function(dt){chapterSceneUpdate(dt);if(game.mode==='chapter-end'&&!document.hidden){chapterOutro.time+=dt;updateStoryText(dt)}};
Object.assign(DragonCampaign,{outro:()=>chapterOutro,reviewEnd:async level=>{await loadChapterPack(level);game.level=level;chapterOutro={level,page:0,time:0};show('chapter-end')},drawEnd:drawChapterEnd});
