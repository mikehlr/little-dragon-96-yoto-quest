'use strict';
Object.assign(ITEM,{chapterWatcher:{width:39}});
const effectChapterBegin=beginStage;
beginStage=function(retry=false){effectChapterBegin(retry);if(game.level===4)for(let d=0;d<4;d++)for(const offset of [360,1100]){const e=chapterEnemyFactory(35,d*DISTRICT_LENGTH+offset,197);e.face=-1;e.act='idle';game.items.push({kind:'chapterWatcher',decor:true,x:e.x,y:197,actor:e})}};
function chapterGroundZones(){const m=chapterState?.active;if(!m)return;ctx.save();if(m.kind==='defend'){const x=m.x-game.camera;ctx.fillStyle='#e9c77b16';ctx.strokeStyle='#e6cb8c';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,m.y,43,12.3,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#d6f5c6';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,m.y,44,13,0,-Math.PI/2,-Math.PI/2+m.progress*Math.PI*2);ctx.stroke()}
 if(m.kind==='escort'){const x=m.goal-game.camera;ctx.strokeStyle='#a7efd4';ctx.lineWidth=1;ctx.strokeRect(x-12,225,24,13)}
 if(m.kind==='carry'&&m.target){const x=m.target.x-game.camera;ctx.strokeStyle='#f5d89a';ctx.beginPath();ctx.ellipse(x,m.target.y+2,25,7,0,0,Math.PI*2);ctx.stroke()}
 if(m.kind==='sequence'&&game.level===3){const done=m.pads.filter(p=>p.on);ctx.globalCompositeOperation='screen';ctx.strokeStyle='#f8d88a77';ctx.lineWidth=1.5;ctx.beginPath();for(const p of done){const x=p.x-game.camera;ctx.moveTo(x,p.y-18);ctx.lineTo(x-17,GROUND_Y-12)}ctx.stroke()}
 ctx.restore()}
const effectPanorama=panorama;
panorama=function(){effectPanorama();chapterGroundZones()};
const effectDrawItem=drawItem;
drawItem=function(i){if(i.kind!=='chapterWatcher')return effectDrawItem(i);const x=i.x-game.camera;if(x<-100||x>WIDTH+100)return;const e=i.actor;e.act=chapterState?.flags.quiet&&chapterState.alarm<.15?'recover':'idle';e.age=1;drawFoe(e);const center=x+Math.sin(game.clock*.55+i.x)*30,y=230;ctx.save();ctx.fillStyle=chapterState.alarm>.7?'#ffb97622':'#ffe6a018';ctx.beginPath();ctx.moveTo(x,169);ctx.lineTo(center-65,y);ctx.quadraticCurveTo(center,y+7,center+65,y);ctx.closePath();ctx.fill();ctx.strokeStyle='#d3bc7c44';ctx.lineWidth=.5;ctx.beginPath();ctx.ellipse(center,y,65,7,0,0,Math.PI*2);ctx.stroke();ctx.restore()};
const effectPlayer=updatePlayer;
updatePlayer=function(p,dt){const x=p.x,y=p.y,stride=p.stride||0;effectPlayer(p,dt);const s=chapterState;if(!s||game.mode!=='play'||p.z>10||!p.hp)return;
 if(game.level===5&&p.y<212&&p.act==='walk'){p.x=x+(p.x-x)*.84;p.y=y+(p.y-y)*.84;p.stride=stride+Math.hypot(p.x-x,p.y-y)}
 if((game.level===2||game.level===5)&&s.wind&&p.act!=='respawn'){const factor=p.act==='block'?.2:1,nx=clamp(p.x+s.wind*factor*dt,...playerLimits(p));if(!game.items.some(i=>i.solid&&!i.gone&&Math.abs(nx-i.x)<(i.blockW||10)+7&&Math.abs(p.y-i.y)<(i.blockH||3)+3))p.x=nx}
};
function addChapterRubble(){const living=game.players.filter(p=>p.hp>0);if(!living.length)return;const p=living[Math.floor(chapterState.age/4)%living.length];chapterState.hazards.push({x:clamp(p.x+Math.sin(chapterState.age)*10,game.camera+35,game.camera+WIDTH-35),y:clamp(p.y,...DEPTH),age:0,hits:new Set()});chapterEvent('rubble-warning')}
function updateChapterEffects(dt){
 const s=chapterState;if(!s||game.mode!=='play')return;const m=s.active,t=game.clock,phase=t%11;
 s.wind=(game.level===2||game.level===5)&&phase>7&&phase<10?(Math.floor(t/11)%2?1:-1)*(game.level===5?10:6):0;
 if(game.level===5){const near=game.players.some(p=>p.hp&&game.items.some(i=>i.kind==='chapterWarmth'&&Math.hypot(p.x-i.x,(p.y-i.y)*1.1)<66));s.cold=clamp(s.cold+dt*(near?-.28:.035),0,1);for(const p of game.players)if(p.hp){if(near)p.energy=Math.min(100,p.energy+dt*4);else if(s.cold>.75)p.energy=Math.max(0,p.energy-dt*1.8)}}
 if(game.level===1&&!s.flags.power){const high=(Math.sin(t*.37)+1)*.5>.85;for(const p of game.players)if(high&&p.y>237&&p.z<10){p.x=clamp(p.x-dt*5,...playerLimits(p))}}
 if(game.level===4){let watched=false;for(const w of game.items.filter(i=>i.kind==='chapterWatcher')){const center=w.x+Math.sin(t*.55+w.x)*30;for(const p of game.players)if(p.hp&&p.z<10&&p.y>209&&p.y<235&&Math.abs(p.x-center)<60&&p.act!=='block'){watched=true;break}}s.alarm=clamp(s.alarm+dt*(watched?.20:-.08),0,1)}
 if(game.level===3&&m&&['defend','escort'].includes(m.kind)){const bucket=Math.floor(m.age/4);if(bucket>0&&bucket!==(m.lastRubble||0)){m.lastRubble=bucket;addChapterRubble()}}
 for(const h of s.hazards){h.age+=dt;if(h.age>1.5&&h.age<1.8)for(const p of game.players)if(p.hp&&p.z<14&&!h.hits.has(p)&&Math.abs(p.x-h.x)<15&&Math.abs(p.y-h.y)<11){h.hits.add(p);hitHero(p,h.x,game.difficulty==='easy'?3:5)}}s.hazards=s.hazards.filter(h=>h.age<2.05);
 if(m&&mobileMatch.matches){const button=touch.querySelector('.pickup');if(button){button.hidden=false;button.disabled=false;const small=button.querySelector('small');if(small)small.textContent='ΧΡΗΣΗ';button.setAttribute('aria-label','ΧΡΗΣΗ')}}
}
const effectChapterUpdate=update;
update=function(dt){effectChapterUpdate(dt);updateChapterEffects(dt)};
const effectCloser=closerScenery;
closerScenery=function(){effectCloser();const s=chapterState;if(!s)return;const clock=hdPrefs.calm?0:game.clock;
 if(s.wind){ctx.save();ctx.strokeStyle=game.level===5?'#deefff55':'#d3e0a644';ctx.lineWidth=.5;for(let k=0;k<8;k++){const x=((k*79+clock*s.wind*11)%WIDTH+WIDTH)%WIDTH,y=85+k*19;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+s.wind*2,y-3);ctx.stroke()}ctx.restore()}
 for(const h of s.hazards){const x=h.x-game.camera;ctx.save();ctx.strokeStyle='#e7c987';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(x,h.y,15,5,0,0,Math.PI*2);ctx.stroke();if(h.age<1.25)label('!',x,h.y-8,10,'#f9d991','center');else if(h.age<1.7){const z=Math.max(0,(1-(h.age-1.25)/.45)*160);const cell=images.items.naturalWidth/5;ctx.drawImage(images.items,3*cell,cell,cell,cell,x-11,h.y-z-17,22,22)}ctx.restore()}
};
chapterText('ΣΥΝΑΓΕΡΜΟΣ','ALARM','ТРИВОГА');chapterText('ΣΤΗ ΣΚΙΑ','IN SHADOW','У ТІНІ');chapterText('ΖΕΣΤΑΣΙΑ','WARMTH','ТЕПЛО');
