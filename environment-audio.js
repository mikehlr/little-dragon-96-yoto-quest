'use strict';
// Separate environment bus: music and action effects retain their existing gains.
hdPrefs.ambienceVolume=Number.isFinite(hdPrefs.ambienceVolume)?clamp(hdPrefs.ambienceVolume,0,100):40;
hdSettingDefs[1].splice(2,0,['ambienceVolume',chapterText('ΗΧΟΙ ΠΕΡΙΒΑΛΛΟΝΤΟΣ','AMBIENCE','ЗВУКИ ДОВКІЛЛЯ'),chapterText('Χαμηλή μίξη καιρού και τοπίου','Quiet weather and scenery mix','Тиха суміш погоди й довкілля')]);
const ambienceSettingValue=hdSettingValue;
hdSettingValue=function(key){return key==='ambienceVolume'?hdPrefs[key]+'%':ambienceSettingValue(key)};
const ambienceAdjust=hdAdjust;
hdAdjust=function(name,delta=1){if(name!=='hd-ambienceVolume')return ambienceAdjust(name,delta);hdPrefs.ambienceVolume=clamp(hdPrefs.ambienceVolume+delta*10,0,100);hdSave();applyAudioVolumes();show('settings');hdFocus(name)};
function ambienceTarget(param,value,at,tau=.3){
 if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(at);else{const v=param.value;param.cancelScheduledValues(at);param.setValueAtTime(v,at)}param.setTargetAtTime(value,at,tau);
}
function ambienceNoise(ctx){
 const duration=12,fade=Math.floor(ctx.sampleRate*.3),buffer=ctx.createBuffer(2,ctx.sampleRate*duration,ctx.sampleRate);
 for(let ch=0;ch<2;ch++){const data=buffer.getChannelData(ch);let seed=7139+ch*2981;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1}
  for(let i=0;i<fade;i++){const u=i/(fade-1),k=data.length-fade+i;data[k]=data[k]*Math.cos(u*Math.PI/2)+data[i]*Math.sin(u*Math.PI/2)}
 }return buffer;
}
function createEnvironmentAudio(rig){
 const ctx=rig.ctx,output=ctx.createGain(),buffer=ambienceNoise(ctx);output.gain.value=0;output.connect(rig.mixBus);
 const beds={};
 for(const [name,hp,lp,offset]of [['wind',65,650,.3],['sea',40,260,2.1],['rain',1250,6500,4.3],['leaves',1400,4500,6.5],['fire',650,3600,8.4]]){
  const source=ctx.createBufferSource(),high=ctx.createBiquadFilter(),low=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;source.loop=true;source.loopStart=.3;source.loopEnd=12;
  high.type='highpass';high.frequency.value=hp;high.Q.value=.5;low.type='lowpass';low.frequency.value=lp;low.Q.value=.45;gain.gain.value=0;
  source.connect(high);high.connect(low);low.connect(gain);gain.connect(output);source.start(ctx.currentTime,offset);beds[name]={source,high,low,gain};
 }
 return {ctx,output,buffer,beds,level:null,chapter:null,lastTick:-1,duckUntil:0,lastStrike:null,pending:null,voices:new Set(),events:[],target:0,profile:null};
}
function environmentProfile(level,c,day){
 const b=c.build,g=c.gust,night=day?.night||0;
 return [
  {wind:.025+night*.012,sea:0,rain:0,leaves:.008,fire:0,cutoff:420},
  {wind:.04+c.storm*(.035+g*.025),sea:.10*(.75+.25*Math.sin(c.t*.21)),rain:.004+c.storm*.060,leaves:0,fire:0,cutoff:460+c.storm*350},
  {wind:.025+b*.025+g*.012,sea:0,rain:0,leaves:.012+b*.012+g*.009,fire:0,cutoff:360+b*230},
  {wind:.045+b*.05+g*b*.035,sea:0,rain:0,leaves:.004+b*g*.014,fire:0,cutoff:280+b*680},
  {wind:.015,sea:0,rain:0,leaves:0,fire:.022+b*.025+g*.009,cutoff:250},
  {wind:.055+b*.055+g*.025,sea:.024+b*.022,rain:0,leaves:.004+b*g*.012,fire:0,cutoff:360+b*560}
 ][level];
}
function environmentTransient(env,kind,at){
 const ctx=env.ctx,source=ctx.createBufferSource(),low=ctx.createBiquadFilter(),high=ctx.createBiquadFilter(),gain=ctx.createGain(),thunder=kind==='thunder',duration=thunder?4.4:.065;
 source.buffer=env.buffer;low.type='lowpass';low.frequency.setValueAtTime(thunder?240:3400,at);if(thunder)low.frequency.exponentialRampToValueAtTime(65,at+duration);
 high.type='highpass';high.frequency.value=thunder?32:950;high.Q.value=.45;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(thunder?.30:.020,at+(thunder?.22:.004));gain.gain.exponentialRampToValueAtTime(.00001,at+duration);
 source.connect(high);high.connect(low);low.connect(gain);gain.connect(env.output);source.start(at,.3+(env.events.length*(thunder?.73:1.37))%6);source.stop(at+duration+.02);
 const voice={source,gain};env.voices.add(voice);source.onended=()=>{source.disconnect();high.disconnect();low.disconnect();gain.disconnect();env.voices.delete(voice)};
 env.events.push({kind,at,level:env.level});if(env.events.length>32)env.events.shift();
}
function silenceEnvironment(env){
 const at=env.ctx.currentTime;ambienceTarget(env.output.gain,0,at,.035);env.target=0;env.pending=null;
 for(const v of env.voices)if(!v.stopping){v.stopping=true;try{v.source.stop(at+.04)}catch{}}
}
function updateEnvironmentAudio(force=false){
 const rig=audio.rig;if(!rig||rig.ctx.state!=='running')return;
 const active=game.mode==='play'&&!document.hidden&&game.sound&&hdPrefs.sfxVolume>0&&hdPrefs.ambienceVolume>0&&!new URL(location.href).searchParams.has('review');
 if(!rig.environment){if(!active)return;rig.environment=createEnvironmentAudio(rig)}
 const env=rig.environment,at=rig.ctx.currentTime;
 if(!active){if(env.target||env.pending||env.voices.size)silenceEnvironment(env);return}
 if(!force&&at-env.lastTick<.08)return;env.lastTick=at;
 const c=regionalClimate(),p=environmentProfile(game.level,c,cityDay()),chapter=chapterState;
 if(env.level!==game.level||env.chapter!==chapter){silenceEnvironment(env);env.level=game.level;env.chapter=chapter;env.crackleNext=null;env.lastStrike=null}
 const duck=1,musicRoom=game.music&&hdPrefs.musicVolume>0?Math.min(1,hdPrefs.musicVolume/65):1,target=hdPrefs.ambienceVolume/100*hdPrefs.sfxVolume/100*duck*musicRoom;env.target=target;env.profile=p;
 ambienceTarget(env.output.gain,target,at,duck<1?.018:.30);
 for(const [key,bed]of Object.entries(env.beds))ambienceTarget(bed.gain.gain,p[key],at,.6);
 ambienceTarget(env.beds.wind.low.frequency,p.cutoff,at,1.2);
 // Distant thunder follows the same storm strike as the sky, delayed by 650 ms.
 const strike=Math.floor((c.t+3)/17);
 if(hdPrefs.calm||!hdPrefs.lighting||!game.fx)env.pending=null;
 if(game.level===1&&c.flash>.02&&env.lastStrike!==strike){env.lastStrike=strike;env.pending={at:at+.65,chapter,level:game.level,strike}}
 if(env.pending&&at>=env.pending.at){if(env.pending.chapter===chapter&&env.pending.level===game.level&&c.storm>.25)environmentTransient(env,'thunder',at+.005);env.pending=null}
 if(game.level===4){env.crackleNext??=c.t+1.4;if(c.t>=env.crackleNext&&!hdPrefs.calm){environmentTransient(env,'crackle',at+.005);const variation=((Math.sin(c.t*12.9898)*43758.5453)%1+1)%1;env.crackleNext=c.t+1.7+variation*3.6}}
}
const environmentTick=tickAudio;
tickAudio=function(){environmentTick();updateEnvironmentAudio()};
const environmentVolumes=applyAudioVolumes;
applyAudioVolumes=function(){environmentVolumes();updateEnvironmentAudio(true)};
// Impacts use their own effects limiter; continuous ambience is no longer ducked.
const environmentShow=show;
show=function(page){environmentShow(page);updateEnvironmentAudio(true)};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&audio.rig?.environment)silenceEnvironment(audio.rig.environment)});
Object.assign(DragonCampaign,{environmentAudio:{profile:environmentProfile,create:createEnvironmentAudio,transient:environmentTransient,update:updateEnvironmentAudio,snapshot:()=>{const e=audio.rig?.environment;return e?{level:e.level,target:e.target,voices:e.voices.size,pending:!!e.pending,profile:e.profile,events:e.events.slice(),duckUntil:e.duckUntil}:null}}});
