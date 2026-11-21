'use strict';
// Audio scheduling is independent of rendering/hit stop; tones are queued ahead on Web Audio time.
// Original DOM listeners retain their unlockSound reference, so initialize at the factory.
const continuousAudioFactory=makeAudioRig;
makeAudioRig=function(ctx){const rig=continuousAudioFactory(ctx);rig.music.gain.value=game.music?hdPrefs.musicVolume/100:0;rig.effects.gain.value=game.sound?hdPrefs.sfxVolume/100:0;
 if(!('startRendering' in ctx)&&!audio.schedulerTimer)audio.schedulerTimer=setInterval(()=>{if(audio.rig?.ctx.state==='closed'){clearInterval(audio.schedulerTimer);audio.schedulerTimer=null;return}if(!document.hidden)tickAudio()},25);
 return rig;
};
