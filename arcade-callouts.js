'use strict';
function arcadeCalloutText(key){const words={clear:['ΠΕΡΙΟΧΗ ΚΑΘΑΡΗ','AREA CLEAR','ЗОНУ ОЧИЩЕНО'],go:['ΠΡΟΧΩΡΑ!','GO!','ВПЕРЕД!'],fight:['ΜΑΧΗ!','FIGHT!','ДО БОЮ!'],combo:['ΣΕΡΙ','COMBO','КОМБО']};return words[key][({el:0,en:1,uk:2})[globalThis.DragonI18n?.get()||'el']]}
function arcadePlate(x,y,w,h,tint){ctx.beginPath();ctx.moveTo(x+7,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w-7,y+h);ctx.lineTo(x,y+h);ctx.closePath();const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#374766f5');g.addColorStop(.5,'#111a30f5');g.addColorStop(1,'#293246f5');ctx.fillStyle=g;ctx.fill();ctx.lineWidth=.8;ctx.strokeStyle=tint;ctx.stroke();ctx.save();ctx.clip();ctx.globalAlpha*=.12;ctx.strokeStyle=tint;ctx.lineWidth=3;const drift=hdPrefs.calm?0:game.clock*16%12;for(let px=x-w;px<x+w*2;px+=12){ctx.beginPath();ctx.moveTo(px+drift,y);ctx.lineTo(px+drift-h,y+h);ctx.stroke()}ctx.restore()}
function arcadeMetal(text,x,y,size,width,tint='#ffe998'){ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${size}px "Arial Black","Trebuchet MS",sans-serif`;const fit=Math.min(1,width/Math.max(1,ctx.measureText(text).width));ctx.translate(x,y);ctx.scale(fit,1);ctx.lineJoin='round';ctx.strokeStyle='#060c1e';ctx.lineWidth=3;ctx.strokeText(text,0,1);const g=ctx.createLinearGradient(0,-size*.5,0,size*.5);g.addColorStop(0,'#fffce0');g.addColorStop(.40,tint);g.addColorStop(.51,'#ca8530');g.addColorStop(.56,'#fff4b5');g.addColorStop(1,tint);ctx.fillStyle=g;ctx.fillText(text,0,0);ctx.restore()}
function arcadeChevron(x,y,size,phase){ctx.save();ctx.translate(x+(hdPrefs.calm?0:Math.sin(phase)*1.4),y);ctx.beginPath();ctx.moveTo(-size*.6,-size);ctx.lineTo(size*.3,-size);ctx.lineTo(size,0);ctx.lineTo(size*.3,size);ctx.lineTo(-size*.6,size);ctx.lineTo(size*.1,0);ctx.closePath();ctx.fillStyle='#ffd95d';ctx.shadowColor='#ffad32';ctx.shadowBlur=hdPrefs.calm?0:4;ctx.fill();ctx.restore()}
function arcadeBanner(kind,x,y,text){const calm=hdPrefs.calm,t=calm?0:game.clock;if(kind==='clear'){
 arcadePlate(x-105,y-15,210,33,'#ffe291');arcadeMetal(arcadeCalloutText('clear'),x-9,y-6,8.5,174,'#b9ffe6');arcadeMetal(arcadeCalloutText('go'),x-9,y+7,17,165);arcadeChevron(x+83,y+4,7,t*5);
 }else if(kind==='go'){arcadePlate(x-91,y-13,94,24,'#ffdf80');arcadeMetal(arcadeCalloutText('go'),x-49,y-1,12,72);arcadeChevron(x-8,y-1,5,t*5)}
 else if(kind==='combo'){const count=String(text).match(/^\d+/)?.[0]||'';arcadeMetal(count+' × '+arcadeCalloutText('combo'),x-48,y-1,13,116,'#ffb769')}
 else {const w=Math.min(266,Math.max(110,String(text).length*5+20));arcadePlate(x-w/2,y-12,w,21,'#9eefff');arcadeMetal(text,x,y-1,10.5,w-14,'#b7f7ff')}
}
const plainArcadeLabel=label;
label=function(text,x,y,size,color,align='left'){
 if(text==='AREA CLEAR   GO ▶')return arcadeBanner('clear',x,y,text);
 if(text==='GO ▶')return arcadeBanner('go',x,y,text);
 if(/^\d+× COMBO$/.test(String(text)))return arcadeBanner('combo',x,y,text);
 if(game.mode==='play'&&game.gate==='fight'&&game.timer&&text===game.arenaName){arcadePlate(x-113,y-13,226,30,'#ffbb70');arcadeMetal(arcadeCalloutText('fight'),x,y-2,17,190);return plainArcadeLabel(text,x,y+10,6.2,'#ffe1ad','center')}
 if(align==='center'&&y===65&&game.enemies.some(e=>e.boss&&e.hp>0))return arcadeBanner('notice',x,y,text);
 if(align==='center'&&y===84&&game.enemies.some(e=>e.boss&&e.hp>0))return arcadeBanner('notice',x,y,text);
 if(align==='center'&&y===HEIGHT-13&&game.bonusNotice?.text===text)return arcadeBanner('notice',x,y,text);
 return plainArcadeLabel(text,x,y,size,color,align);
};
globalThis.DragonCallouts={version:'2.16',draw:arcadeBanner,text:arcadeCalloutText};
