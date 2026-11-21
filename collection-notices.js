'use strict';
const COLLECTION_NOTICE_TEXT={
 card:chapterText('ΝΕΑ ΚΑΡΤΑ YOTO!','NEW YOTO CARD!','НОВА КАРТКА YOTO!'),
 souvenir:chapterText('ΝΕΟ ΑΝΑΜΝΗΣΤΙΚΟ!','NEW SOUVENIR!','НОВИЙ СУВЕНІР!'),
 music:chapterText('ΞΕΚΛΕΙΔΩΣΕ Η ΜΟΥΣΙΚΗ ΤΗΣ ΠΕΡΙΟΧΗΣ!','REGION MUSIC UNLOCKED!','МУЗИКУ МІСЦЕВОСТІ ВІДКРИТО!'),
 complete:chapterText('ΟΛΟΚΛΗΡΩΘΗΚΕ ΤΟ ΣΕΤ!','SET COMPLETE!','НАБІР ЗІБРАНО!'),
 album:chapterText('ΣΤΗ ΣΥΛΛΟΓΗ ΜΟΥ','IN MY COLLECTION','У МОЇЙ КОЛЕКЦІЇ'),
 pulse:chapterText('+20 ΖΩΗ · +35 ΕΝΕΡΓΕΙΑ · +2 ΝΟΜΙΣΜΑΤΑ','+20 HEALTH · +35 ENERGY · +2 COINS','+20 ЗДОРОВ’Я · +35 ЕНЕРГІЇ · +2 МОНЕТИ')
};
const collectionNoticeQueue=[];
let collectionNoticeActive=null,collectionNoticeElapsed=0,collectionNoticeLast=0;
const collectionNotice=document.createElement('aside');
collectionNotice.className='collection-notice';collectionNotice.hidden=true;
collectionNotice.setAttribute('role','status');collectionNotice.setAttribute('aria-live','polite');collectionNotice.setAttribute('aria-atomic','true');document.body.append(collectionNotice);
function queueCollectionNotice(item,kind,pulse=false){
 const total=kind==='card'?3:4,count=collectionSetCount(item.level,kind==='card');
 collectionNoticeQueue.push({item,kind,pulse,count,total,complete:count===total});
}
function paintCollectionNotice(n){
 const words=COLLECTION_NOTICE_TEXT,headline=n.complete?(n.kind==='card'?words.music:words.complete):words[n.kind];
 collectionNotice.innerHTML=`<div class="notice-medallion">${collectionSvg(n.kind==='card'?'story-cards':'souvenirs',n.item.frame)}</div><div class="notice-copy"><small>${words[n.kind]}</small><strong>${n.item.name}</strong><b>${headline===words[n.kind]?words.album:headline}</b><span>${STAGES[n.item.level].name} · ${n.count}/${n.total}${n.pulse?' · '+words.pulse:''}</span></div><i class="notice-timer" aria-hidden="true"></i>`;
 collectionNotice.dataset.complete=String(n.complete);collectionNotice.dataset.calm=String(hdPrefs.calm||matchMedia('(prefers-reduced-motion: reduce)').matches);
}
function positionCollectionNotice(){
 const r=canvas.getBoundingClientRect(),playing=game.mode==='play';
 const top=playing?(r.top>=140?r.top-130:Math.max(8,r.top+r.height*.29)):Math.max(8,innerHeight-155);
 collectionNotice.style.top=Math.max(8,Math.min(top,innerHeight-(collectionNotice.offsetHeight||130)-8))+'px';
 collectionNotice.style.right=Math.max(8,playing?innerWidth-r.right+8:12)+'px';
}
function tickCollectionNotice(now){
 const dt=collectionNoticeLast?Math.min(100,now-collectionNoticeLast):0;collectionNoticeLast=now;
 const suspended=document.hidden||game.mode==='pause';
 if(!suspended){
  if(!collectionNoticeActive&&collectionNoticeQueue.length){collectionNoticeActive=collectionNoticeQueue.shift();collectionNoticeElapsed=0;paintCollectionNotice(collectionNoticeActive);effect(collectionNoticeActive.complete?'collection-unlock':'collection-found')}
  if(collectionNoticeActive){collectionNoticeElapsed+=dt;const duration=collectionNoticeActive.complete?5600:4300;collectionNotice.style.setProperty('--notice-progress',String(Math.max(0,1-collectionNoticeElapsed/duration)));collectionNotice.dataset.leaving=String(collectionNoticeElapsed>duration-250);positionCollectionNotice();if(collectionNoticeElapsed>=duration){collectionNoticeActive=null;collectionNotice.innerHTML=''}}
 }
 collectionNotice.hidden=!collectionNoticeActive||suspended;
 requestAnimationFrame(tickCollectionNotice);
}
requestAnimationFrame(tickCollectionNotice);
const collectionSoundBase=renderEffect;
renderEffect=function(rig,output,name,at,hero=1){
 if(name==='collection-found'){
  [659.25,987.77,1318.51].forEach((f,n)=>{tone(rig,output,at+n*.075,f,.14,.075,'triangle');tone(rig,output,at+n*.075,f*2,.10,.018,'sine')});return;
 }
 if(name==='collection-unlock'){
  [523.25,659.25,783.99,1046.50].forEach((f,n)=>tone(rig,output,at+n*.095,f,.19,.065,'triangle'));
  [1046.50,1318.51,1567.98].forEach(f=>tone(rig,output,at+.42,f,.40,.032,'sine'));return;
 }
 return collectionSoundBase(rig,output,name,at,hero);
};
globalThis.DragonCollectionNotices={version:'2.19',enqueue:queueCollectionNotice,state:()=>({active:collectionNoticeActive,queued:collectionNoticeQueue.length,elapsed:collectionNoticeElapsed})};
