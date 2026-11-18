
const WIDTH = 480;
const HEIGHT = 270;
const HERO_SIZE = 72;
const HERO_SCALE = HERO_SIZE / 55;
const DISTRICT_LENGTH = 1900;
const DISTRICTS = 4;
const WORLD = DISTRICT_LENGTH * DISTRICTS;
const GATES = Array.from({ length: DISTRICTS }, (_, district) =>
  [475, 1020, 1530, district === DISTRICTS - 1 ? 1800 : 1835].map(x => district * DISTRICT_LENGTH + x)).flat();
const DEPTH = [191, 248];
const districtIndex = x => Math.min(DISTRICTS - 1, Math.max(0, Math.floor(x / DISTRICT_LENGTH)));

const DISTRICT_NAMES = [
  ['Τα μπλε παραθυρόφυλλα', 'Στα στενά της Αθήνας', 'Η πλατεία', 'Η αυλή με την αψίδα'],
  ['Η προκυμαία', 'Η ψαραγορά', 'Το καρνάγιο', 'Ο παλιός φάρος'],
  ['Το μονοπάτι', 'Το φωτεινό ξέφωτο', 'Το πέρασμα του καταρράκτη', 'Η μεγάλη βελανιδιά'],
  ['Οι πρώτοι κίονες', 'Ο ναός στον λόφο', 'Το πέτρινο υδραγωγείο', 'Η αυλή του φύλακα'],
  ['Η μεγάλη πύλη', 'Ο διάδρομος με τα βιτρό', 'Η βιβλιοθήκη', 'Η κρύπτη των ιστοριών'],
];

const STAGES = [
  { name: 'Η ΓΕΙΤΟΝΙΑ', subtitle: 'Τα πρώτα ίχνη', boss: 'Βασιλιάς Μανιτάρης', reward: 'Η κάρτα του Δράκου', foes: [0, 1, 2, 5] },
  { name: 'ΤΟ ΛΙΜΑΝΙ', subtitle: 'Περιπέτεια στην προκυμαία', boss: 'Καπετάνιος Μος', reward: 'Η κάρτα του Πειρατή', foes: [3, 4, 5, 1] },
  { name: 'ΤΟ ΜΑΓΙΚΟ ΔΑΣΟΣ', subtitle: 'Ψίθυροι κάτω από τα δέντρα', boss: 'Παφ ο Μέγας', reward: 'Η κάρτα του Δάσους', foes: [6, 7, 8, 2] },
  { name: 'ΤΑ ΕΡΕΙΠΙΑ', subtitle: 'Στη σκιά των κιόνων', boss: 'Πέτρινος Φύλακας', reward: 'Η κάρτα του Κάστρου', foes: [10, 11, 8, 7] },
  { name: 'ΤΟ ΚΑΣΤΡΟ ΤΟΥ GRUFFY', subtitle: 'Η τελευταία ιστορία', boss: 'Gruffy', reward: 'Το πορτοκαλί Yoto', foes: [9, 10, 11, 6] },
];

const FOES = [
  [34, 40, 27, 'guard'], [28, 62, 25, 'rush'], [46, 38, 29, 'guard'],
  [38, 50, 31, 'flank'], [44, 45, 29, 'guard'], [26, 72, 24, 'flank'],
  [38, 54, 29, 'rush'], [33, 62, 28, 'flank'], [40, 45, 29, 'rush'],
  [50, 47, 35, 'guard'], [48, 50, 33, 'flank'], [57, 37, 34, 'guard'],
];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const mix = (a, b, t) => a + (b - a) * t;
const between = (min, max) => mix(min, max, Math.random());
const currentStage = () => STAGES[game.level];
const BASE_DIFFICULTY=Object.freeze({enemyHealth:1,bossHealth:1,incoming:1,speed:1,rest:1,tell:1,energy:8,stageHealth:74,gateHeal:9,appleHeal:32});
const difficultyRules=()=>globalThis.DragonDifficulty?.rules()||BASE_DIFFICULTY;

// Original stage themes. Melody events are [subdivision, scale degree, length].
const SOUNDTRACK = [
  {
    title: 'Απογευματινή βόλτα', bpm: 116, steps: 16, root: 62, color: 'pulse',
    scale: [0, 2, 4, 5, 7, 9, 11],
    chords: [[1, 3, 5], [6, 8, 10], [4, 6, 8], [5, 7, 9], [1, 3, 5], [2, 4, 6], [4, 6, 8], [5, 7, 9]],
    melody: [
      [[0,3,2],[3,5,2],[6,6,2],[8,5,3],[12,3,2],[14,2,2]],
      [[0,1,3],[4,3,2],[7,5,2],[10,6,2],[12,8,3]],
      [[0,9,2],[3,8,2],[6,6,2],[8,4,3],[12,6,3]],
      [[0,7,2],[3,5,2],[6,3,2],[8,2,4],[14,5,2]],
      [[0,8,2],[3,9,2],[6,10,2],[8,8,3],[12,5,2],[14,3,2]],
      [[0,4,3],[4,6,2],[8,9,2],[11,8,2],[14,6,2]],
      [[0,8,3],[4,6,2],[7,5,2],[10,4,2],[13,6,2]],
      [[0,7,2],[3,5,2],[6,2,2],[8,3,2],[11,2,2],[14,1,2]],
    ],
    bass: [[0,0,3],[4,0,2],[7,2,1],[8,0,3],[12,3,2],[14,2,2]],
    arp: [0, 1, 2, 1, 0, 2, 4, 2],
    kick: [0, 6, 8, 14], snare: [4, 12], hat: [2, 4, 6, 8, 10, 12, 14, 15],
  },
  {
    title: 'Στο φως του φάρου', bpm: 87, steps: 12, root: 69, color: 'reed',
    scale: [0, 2, 3, 5, 7, 8, 10],
    chords: [[1, 3, 5], [1, 3, 5], [6, 8, 10], [7, 9, 11], [4, 6, 8], [6, 8, 10], [5, 7, 9], [1, 3, 5]],
    melody: [
      [[0,5,3],[4,3,2],[6,1,2],[9,2,2]],
      [[0,3,3],[3,5,1],[5,6,1],[6,5,3],[10,3,2]],
      [[0,4,2],[3,6,2],[6,8,3],[10,6,2]],
      [[0,7,3],[4,9,2],[6,7,2],[9,5,2]],
      [[0,6,2],[3,8,2],[6,11,3],[10,10,2]],
      [[0,8,3],[4,6,2],[6,4,2],[9,3,2]],
      [[0,2,2],[3,5,3],[6,7,2],[9,11,2]],
      [[0,8,4],[6,5,2],[9,3,2]],
    ],
    bass: [[0,0,4],[5,2,1],[6,0,3],[10,2,2]],
    arp: [0, 2, 1, 3, 2, 1],
    kick: [0, 6], snare: [6], hat: [2, 4, 8, 10],
  },
  {
    title: 'Φωτάκια στο δάσος', bpm: 99, steps: 16, root: 65, color: 'glass',
    scale: [0, 2, 3, 5, 7, 9, 10],
    chords: [[1, 3, 5], [4, 6, 8], [3, 5, 7], [7, 9, 11], [2, 4, 6], [4, 6, 8], [7, 9, 11], [1, 3, 5]],
    melody: [
      [[1,8,3],[6,10,2],[11,12,3]],
      [[0,11,2],[4,9,3],[10,6,3],[15,8,1]],
      [[2,10,2],[5,8,3],[10,5,3]],
      [[0,7,2],[3,9,2],[8,12,3],[13,11,2]],
      [[0,9,3],[5,11,2],[8,13,3],[14,11,2]],
      [[0,6,3],[5,8,2],[9,11,3],[14,9,2]],
      [[2,7,2],[5,9,2],[9,12,3],[14,9,2]],
      [[0,10,3],[5,8,3],[11,5,4]],
    ],
    bass: [[0,0,6],[7,2,2],[10,0,4]],
    arp: [0, 2, 1, 3, 4, 2, 5, 1],
    kick: [0, 10], snare: [8], hat: [3, 6, 11, 14],
  },
  {
    title: 'Ο πέτρινος φύλακας', bpm: 108, steps: 16, root: 64, color: 'reed',
    scale: [0, 1, 3, 5, 7, 8, 10],
    chords: [[1, 3, 5], [2, 4, 6], [1, 3, 5], [4, 6, 8], [6, 8, 10], [7, 9, 11], [2, 4, 6], [1, 3, 5]],
    melody: [
      [[0,1,3],[4,2,2],[6,3,3],[12,5,3]],
      [[0,6,4],[6,5,2],[9,4,2],[12,2,3]],
      [[0,3,3],[4,2,2],[6,1,3],[12,5,2]],
      [[0,4,3],[4,6,2],[6,8,3],[11,7,1],[12,6,3]],
      [[0,8,3],[4,10,2],[6,13,4],[12,10,3]],
      [[0,9,3],[4,7,2],[6,11,3],[12,9,2]],
      [[0,6,3],[4,4,2],[6,9,2],[10,6,2],[12,2,3]],
      [[0,3,3],[4,2,2],[6,1,4],[12,1,3]],
    ],
    bass: [[0,0,4],[6,0,4],[12,2,2],[14,0,2]],
    arp: [0, 2, 1, 3, 0, 1, 2, 1],
    kick: [0, 6, 12], snare: [6, 14], hat: [2, 4, 8, 10, 12, 15],
  },
  {
    title: 'Η καρδιά του κάστρου', bpm: 142, steps: 16, root: 62, color: 'brass',
    scale: [0, 2, 3, 5, 7, 8, 11],
    chords: [[1, 3, 5], [6, 8, 10], [4, 6, 8], [5, 7, 9], [1, 3, 5], [3, 5, 8], [6, 8, 10], [5, 7, 9]],
    melody: [
      [[0,8,2],[2,5,2],[4,8,2],[7,10,1],[8,12,3],[12,11,2],[14,10,2]],
      [[0,8,2],[2,6,2],[4,8,2],[6,10,2],[9,13,3],[13,10,2]],
      [[0,11,2],[3,9,2],[6,8,2],[8,6,2],[12,8,3]],
      [[0,7,2],[2,9,2],[4,12,3],[8,14,3],[12,12,2],[14,7,2]],
      [[0,15,3],[4,12,2],[7,10,1],[8,12,2],[10,11,2],[12,10,3]],
      [[0,8,2],[2,10,2],[4,12,2],[7,10,1],[8,8,3],[12,5,2]],
      [[0,13,3],[4,12,2],[7,10,1],[8,8,2],[10,10,2],[12,13,3]],
      [[0,14,2],[3,12,2],[6,11,2],[8,9,2],[11,7,2],[14,5,2]],
    ],
    bass: [[0,0,2],[2,3,2],[4,0,2],[6,2,2],[8,0,2],[10,3,2],[12,0,2],[14,2,2]],
    arp: [0, 2, 1, 3, 4, 2, 5, 3],
    kick: [0, 3, 6, 8, 10, 14], snare: [4, 12], hat: [2, 6, 10, 12, 14, 15],
  },
];

// Synthesized arcade score and effects, using the same instruments online or offline.
const NOTE = midi => 440 * 2 ** ((midi - 69) / 12);
const audio = { rig: null, transport: null, position: null, pendingScene: null, sceneBus: null, lastEffect: new Map() };

function makeAudioRig(ctx) {
  const music = ctx.createGain();
  const effects = ctx.createGain();
  const mixBus = ctx.createDynamicsCompressor();
  mixBus.threshold.value = -13;
  mixBus.ratio.value = 3;
  mixBus.attack.value = .008;
  music.connect(mixBus);
  effects.connect(mixBus);
  mixBus.connect(ctx.destination);
  const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * .65), ctx.sampleRate);
  let seed = 721;
  const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    samples[i] = seed / 2147483648 - 1;
  }
  const waves = {};
  for (const [name, duty] of [['pulse', .25], ['reed', .36], ['brass', .43]]) {
    const real = new Float32Array(14);
    const imag = new Float32Array(14);
    for (let k = 1; k < real.length; k++) {
      const angle = 2 * Math.PI * k * duty;
      real[k] = Math.sin(angle) / (Math.PI * k ** 1.22);
      imag[k] = (1 - Math.cos(angle)) / (Math.PI * k ** 1.22);
    }
    waves[name] = ctx.createPeriodicWave(real, imag);
  }
  return { ctx, music, effects, noise, waves };
}

function tone(rig, output, at, frequency, duration, volume, color = 'triangle', end = frequency) {
  const { ctx, waves } = rig;
  const oscillator = ctx.createOscillator();
  const amp = ctx.createGain();
  if (waves[color]) oscillator.setPeriodicWave(waves[color]);
  else oscillator.type = color === 'glass' || color === 'bass' ? 'sine' : color;
  oscillator.frequency.setValueAtTime(Math.max(18, frequency), at);
  if (end !== frequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(18, end), at + duration * .88);
  amp.gain.setValueAtTime(.0001, at);
  amp.gain.exponentialRampToValueAtTime(volume, at + Math.min(.012, duration * .24));
  amp.gain.exponentialRampToValueAtTime(volume * (color === 'glass' ? .20 : .55), at + duration * .64);
  amp.gain.exponentialRampToValueAtTime(.0001, at + duration);
  oscillator.connect(amp);
  amp.connect(output);
  let mod, depth;
  if (color === 'glass' || color === 'bass' || color === 'brass') {
    mod = ctx.createOscillator();
    depth = ctx.createGain();
    mod.frequency.value = frequency * (color === 'glass' ? 2.01 : 2);
    depth.gain.setValueAtTime(frequency * (color === 'glass' ? 1.15 : .42), at);
    depth.gain.exponentialRampToValueAtTime(.1, at + duration * .86);
    mod.connect(depth);
    depth.connect(oscillator.frequency);
    mod.start(at);
    mod.stop(at + duration);
  }
  oscillator.onended = () => {
    oscillator.disconnect();
    amp.disconnect();
    mod?.disconnect();
    depth?.disconnect();
  };
  oscillator.start(at);
  oscillator.stop(at + duration + .008);
}

function noiseBurst(rig, output, at, duration, volume, frequency, type = 'bandpass') {
  const { ctx, noise } = rig;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  source.buffer = noise;
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = type === 'bandpass' ? 1.05 : .6;
  amp.gain.setValueAtTime(.0001, at);
  amp.gain.exponentialRampToValueAtTime(volume, at + .004);
  amp.gain.exponentialRampToValueAtTime(.0001, at + duration);
  source.connect(filter);
  filter.connect(amp);
  amp.connect(output);
  source.onended = () => { source.disconnect(); filter.disconnect(); amp.disconnect(); };
  source.start(at);
  source.stop(at + duration + .005);
}

function scalePitch(score, degree) {
  const i = degree - 1;
  return score.root + score.scale[i % 7] + 12 * Math.floor(i / 7);
}

const beatLength = score => 60 / score.bpm / (score.steps === 12 ? 6 : 4);

function playMusicStep(rig, output, score, step, at) {
  const subdivision = step % score.steps;
  const measure = Math.floor(step / score.steps);
  const bar = measure % score.chords.length;
  const answer = measure >= score.chords.length;
  const stepTime = beatLength(score);
  const chord = score.chords[bar].map(degree => scalePitch(score, degree));
  const play = (midi, length, volume, color, delay = 0) =>
    tone(rig, output, at + delay, NOTE(midi), length, volume, color);
  for (const [index, degree, length] of score.melody[bar]) {
    if (index === subdivision) {
      const midi = scalePitch(score, degree);
      play(midi, length * stepTime * .86, .107, score.color);
      if (answer && index % 4 === 0) play(midi - 12, length * stepTime * .70, .026, 'triangle', .011);
    }
  }
  for (const [index, degree, length] of score.bass) {
    if (index !== subdivision) continue;
    const midi = chord[degree % 3] - 24 + (degree >= 3 ? 12 : 0);
    play(midi, length * stepTime * .86, .18, 'bass');
  }
  if (subdivision % 2 === 0) {
    const note = score.arp[(subdivision / 2 + (answer ? 2 : 0)) % score.arp.length];
    const midi = chord[note % 3] + (note >= 3 ? 0 : -12);
    play(midi, stepTime * 1.58, answer ? .061 : .050, subdivision % 4 === 0 ? 'glass' : 'triangle');
  }
  if (subdivision === 0 || (answer && subdivision === Math.floor(score.steps / 2))) {
    for (const midi of chord) play(midi - 12, stepTime * (answer ? 4.8 : 7.5), .025, 'triangle');
  }
  if (score.kick.includes(subdivision)) tone(rig, output, at, 139, .105, .21, 'sine', 47);
  if (score.snare.includes(subdivision)) {
    noiseBurst(rig, output, at, .087, .095, 1780);
    tone(rig, output, at, 158, .057, .048, 'triangle', 95);
  }
  if (score.hat.includes(subdivision)) noiseBurst(rig, output, at, .033, .035, 6800, 'highpass');
}

function renderEffect(rig, output, name, at, hero = 1) {
  const pitch = (start, end, duration, volume, color = 'triangle', delay = 0) =>
    tone(rig, output, at + delay, start, duration, volume, color, end);
  const air = (duration, volume, frequency, delay = 0) =>
    noiseBurst(rig, output, at + delay, duration, volume, frequency);
  const notes = (tune, spacing, volume, color = 'glass', delay = 0) =>
    tune.forEach((midi, i) => pitch(NOTE(midi), NOTE(midi), spacing * 2.45, volume, color, delay + i * spacing));
  switch (name) {
    case 'select': notes([81, 86], .038, .075); break;
    case 'jump': pitch(187, 480, .13, .10, 'pulse'); break;
    case 'land': air(.065, .063, 450); break;
    case 'punchSwing': air(.064, .068, 2300); break;
    case 'kickSwing': air(.11, .097, 1670, .11); break;
    case 'punch': air(.077, .19, 1150); pitch(132, 55, .10, .22); break;
    case 'kick': air(.12, .21, 860); pitch(165, 48, .13, .27, 'bass'); break;
    case 'club': air(.14, .26, 630); pitch(182, 57, .14, .25, 'pulse'); break;
    case 'hurt': air(.087, .155, 730); pitch(266, 117, .12, .18, 'reed'); break;
    case 'block':
      pitch(701, 516, .13, .17, 'glass'); pitch(502, 403, .095, .14); air(.048, .12, 2650); break;
    case 'charge': pitch(hero === 1 ? 227 : 170, 740, .19, .16, 'glass'); break;
    case 'release':
      pitch(hero === 1 ? 770 : 465, hero === 1 ? 185 : 85, .29, .22, 'brass');
      pitch(212, 67, .185, .18, 'bass');
      air(.17, .14, hero === 1 ? 2670 : 1470);
      break;
    case 'energyHit': pitch(322, 64, .16, .24, 'brass'); air(.13, .17, 1870); break;
    case 'pickup': notes([72, 79], .055, .11); break;
    case 'throw': pitch(335, 116, .17, .13, 'reed'); air(.15, .086, 1410); break;
    case 'throwHit': pitch(160, 52, .13, .22, 'bass'); air(.10, .16, 800); break;
    case 'break': pitch(166, 54, .11, .22, 'bass'); air(.20, .22, 1130); air(.09, .10, 2380, .052); break;
    case 'heal': notes([76, 79, 84, 88], .057, .12); break;
    case 'ambush': pitch(181, 102, .18, .14, 'reed'); break;
    case 'warning': notes([75, 79], .055, .10, 'pulse'); break;
    case 'enemyShot': pitch(495, 132, .17, .117, 'reed'); air(.11, .075, 1880); break;
    case 'slam': pitch(128, 41, .22, .19, 'bass'); air(.18, .19, 410); break;
    case 'phaseShift': notes([55, 62, 67, 74], .068, .14, 'brass'); break;
    case 'dodge': air(.10, .10, 1760); break;
    case 'boss': notes([45, 45, 44, 43], .12, .19, 'brass'); air(.31, .11, 390, .10); break;
    case 'gate': notes([69, 74, 78], .075, .12); break;
    case 'reward': notes([67, 74, 79, 83, 86], .084, .13); break;
    case 'scene-0': notes([62, 69, 74, 78, 81], .13, .13, 'glass', .20); break;
    case 'scene-1':
      air(.31, .15, 540, .21); pitch(152, 63, .55, .17, 'bass', .25);
      notes([67, 61, 60], .20, .11, 'reed', .43);
      break;
    case 'scene-2':
      notes([69, 76, 80, 86], .13, .15, 'glass', .25);
      air(.24, .06, 1500, .28);
      break;
    case 'scene-3':
      air(.22, .075, 720, .30); notes([65, 69, 72, 77, 81], .11, .12, 'pulse', .23);
      break;
    case 'scene-4':
      notes([62, 69, 74, 78, 81, 86], .16, .15, 'glass', .18);
      for (const midi of [50, 57, 62, 66]) pitch(NOTE(midi), NOTE(midi), 1.1, .095, 'triangle', .59);
      break;
  }
}

function applyAudioVolumes() {
  if (!audio.rig) return;
  const { ctx, music, effects } = audio.rig;
  const quiet = game.mode === 'pause' || (['how', 'settings'].includes(game.mode) && audio.transport);
  music.gain.setTargetAtTime(game.music ? (quiet ? .24 : .66) : 0, ctx.currentTime, .05);
  effects.gain.setTargetAtTime(game.sound ? .84 : 0, ctx.currentTime, .026);
}

function audioNeedsActivation() {
  const button = document.querySelector('#enable-audio');
  const inGame = !['home', 'how', 'settings'].includes(game.mode);
  button.hidden = !inGame || (!game.music && !game.sound) || !window.AudioContext && !window.webkitAudioContext ||
    audio.rig?.ctx.state === 'running';
}

function unlockSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio || (!game.sound && !game.music)) return;
  try {
    audio.rig ??= makeAudioRig(new Audio());
    const { ctx } = audio.rig;
    if (ctx.state === 'running') {
      audioNeedsActivation();
      return;
    }
    ctx.resume().then(() => {
      applyAudioVolumes();
      audioNeedsActivation();
      tickAudio();
    }).catch(audioNeedsActivation);
  } catch {
    audioNeedsActivation();
  }
}

function effect(name, hero = 1) {
  const rig = audio.rig;
  if (!game.sound || !rig || rig.ctx.state !== 'running') return;
  const at = rig.ctx.currentTime + .008;
  const key = name + ':' + hero;
  if ((audio.lastEffect.get(key) ?? -Infinity) + .027 > at) return;
  audio.lastEffect.set(key, at);
  renderEffect(rig, rig.effects, name, at, hero);
}

function audioScene(index) {
  if (audio.sceneBus && audio.rig) {
    const bus = audio.sceneBus;
    const now = audio.rig.ctx.currentTime;
    bus.gain.setTargetAtTime(0, now, .035);
    window.setTimeout(() => bus.disconnect(), 170);
    audio.sceneBus = null;
  }
  audio.pendingScene = index;
  tickAudio();
}

function tickAudio() {
  const rig = audio.rig;
  if (!rig || rig.ctx.state !== 'running') return;
  const at = rig.ctx.currentTime;
  if (audio.pendingScene !== null) {
    const scene = audio.pendingScene;
    audio.pendingScene = null;
    if (game.sound) {
      const bus = rig.ctx.createGain();
      bus.connect(rig.effects);
      audio.sceneBus = bus;
      renderEffect(rig, bus, 'scene-' + scene, at + .01);
      window.setTimeout(() => {
        if (audio.sceneBus === bus) audio.sceneBus = null;
        bus.disconnect();
      }, 2300);
    }
  }
  const sceneMode = game.mode === 'play' || game.mode === 'stage';
  const pauseMode = ['pause', 'settings', 'how'].includes(game.mode);
  const level = game.music && (sceneMode || (pauseMode && audio.transport)) ? game.level : null;
  const prev = audio.transport;
  if (prev && prev.level !== level) {
    prev.bus.gain.setTargetAtTime(0, at, .041);
    audio.position = { level: prev.level, step: prev.step };
    window.setTimeout(() => prev.bus.disconnect(), 210);
    audio.transport = null;
  }
  if (game.mode === 'home' || game.mode === 'ending' || game.mode === 'clear' || game.mode === 'lose') audio.position = null;
  if (level === null) return;
  if (!audio.transport) {
    const bus = rig.ctx.createGain();
    bus.gain.setValueAtTime(0, at);
    bus.gain.setTargetAtTime(1, at, .075);
    bus.connect(rig.music);
    const step = audio.position?.level === level ? audio.position.step : 0;
    audio.transport = { level, step, next: at + .03, bus };
  }
  const transport = audio.transport;
  const score = SOUNDTRACK[level];
  if (transport.next < at - .20) transport.next = at + .025;
  while (transport.next < at + .125) {
    playMusicStep(rig, transport.bus, score, transport.step, Math.max(transport.next, at + .005));
    transport.next += beatLength(score);
    transport.step = (transport.step + 1) % (score.steps * score.chords.length * 2);
  }
}

function syncAudio() {
  applyAudioVolumes();
  audioNeedsActivation();
  tickAudio();
}

const strike = (label, form, tell, active, rest, details = {}) => ({ label, form, tell, active, rest, ...details });
const BOSS_KITS = [
  {
    color: '#eaa873', hp: 204, size: 56, pace: 42, range: 122,
    phases: [['spores'], ['stomp', 'spores'], ['goldenSpores', 'leap', 'stomp']],
    moves: {
      spores: strike('Σπόρια', 'fan', .73, .32, .78, { lanes: [-12, 0, 12], speed: 150, art: 'spore' }),
      stomp: strike('Μανιταροσεισμός', 'ring', .72, .49, .80, { radius: 100, art: 'root' }),
      goldenSpores: strike('Χρυσά σπόρια', 'fan', .56, .72, .68, { lanes: [-22, -8, 8, 22], volley: 2, speed: 171, art: 'spore' }),
      leap: strike('Άλμα του βασιλιά', 'leap', .69, .76, .73, { radius: 53, height: 60, art: 'root' }),
    },
  },
  {
    color: '#82dcfc', hp: 239, size: 57, pace: 55, range: 140,
    phases: [['broadside'], ['deckSlide', 'broadside'], ['crossfire', 'anchor', 'deckSlide']],
    moves: {
      broadside: strike('Ομοβροντία καταστρώματος', 'lanes', .80, .57, .73, { lanes: [0], volley: 2, speed: 214, art: 'water' }),
      deckSlide: strike('Γλίστρημα του καπετάνιου', 'dash', .67, .50, .74, { speed: 305, art: 'water' }),
      crossfire: strike('Διπλή ομοβροντία', 'lanes', .63, .64, .62, { lanes: [-20, 20], volley: 2, speed: 233, art: 'water' }),
      anchor: strike('Πιτσιλιά της άγκυρας', 'drop', .83, .32, .81, { radius: 38, count: 2, art: 'water' }),
    },
  },
  {
    color: '#e5a9ff', hp: 259, size: 62, pace: 52, range: 145,
    phases: [['gust'], ['glide', 'gust'], ['starRain', 'glide', 'tailwind']],
    moves: {
      gust: strike('Πνοή του δάσους', 'fan', .70, .31, .76, { lanes: [-15, 15], speed: 190, art: 'wind' }),
      glide: strike('Χαμηλή πτήση', 'leap', .74, .97, .88, { radius: 50, height: 91, art: 'wind' }),
      starRain: strike('Βροχή από αστέρια', 'drop', .90, .42, .72, { radius: 30, count: 3, art: 'star', lift: 36 }),
      tailwind: strike('Στροβιλισμός', 'ring', .68, .54, .80, { radius: 117, art: 'wind' }),
    },
  },
  {
    color: '#9be8cd', hp: 294, size: 67, pace: 37, range: 92, armor: true,
    phases: [['quake'], ['rollingMarble', 'quake'], ['runes', 'rollingMarble', 'graniteRush']],
    moves: {
      quake: strike('Σεισμός', 'ring', .90, .52, .97, { radius: 125, art: 'stone' }),
      rollingMarble: strike('Κυλιόμενο μάρμαρο', 'lanes', .74, .49, .82, { lanes: [0], volley: 2, speed: 190, art: 'stone' }),
      runes: strike('Ρήγματα των ρούνων', 'drop', .94, .40, .96, { radius: 36, count: 3, art: 'rune' }),
      graniteRush: strike('Έφοδος του φύλακα', 'dash', .78, .56, 1.02, { speed: 253, art: 'stone' }),
    },
  },
  {
    color: '#ffc679', hp: 350, size: 73, pace: 53, range: 111,
    phases: [['storyCards'], ['vaultRush', 'storyCards'], ['pageStorm', 'grandFinale', 'vaultRush']],
    moves: {
      storyCards: strike('Ριπή από κάρτες', 'fan', .74, .40, .76, { lanes: [-18, 0, 18], speed: 204, art: 'card' }),
      vaultRush: strike('Έφοδος του Gruffy', 'dash', .63, .57, .80, { speed: 320, art: 'card' }),
      pageStorm: strike('Θύελλα σελίδων', 'lanes', .68, .77, .74, { lanes: [-22, 0, 22], volley: 3, speed: 218, art: 'card' }),
      grandFinale: strike('Το μεγάλο φινάλε', 'leap', .78, .86, .94, { radius: 86, height: 82, art: 'star' }),
    },
  },
];

const RIVAL_KITS = [
  { name: 'Ελικόπτερο-κουρδιστό', color: '#9fe5fa', hp: 83, size: 51, pace: 53, range: 165, hover: 26,
    phases: [['pellets', 'lowPass']], moves: {
      pellets: strike('Μπαλάκια αφρού', 'lanes', .64, .50, .75, { lanes: [0], volley: 3, speed: 212, art: 'foam' }),
      lowPass: strike('Χαμηλό πέρασμα', 'dash', .71, .49, .70, { speed: 280, art: 'wind' }),
    } },
  { name: 'Το Καρότσι της Προκυμαίας', color: '#ffac88', hp: 110, size: 63, pace: 59, range: 129,
    phases: [['bumper', 'spray']], moves: {
      bumper: strike('Πατημένο γκάζι', 'dash', .70, .65, .78, { speed: 331, art: 'water' }),
      spray: strike('Νερά από τις ρόδες', 'fan', .52, .34, .73, { lanes: [-19, 19], speed: 184, art: 'water' }),
    } },
  { name: 'Το Άτακτο Άνθος', color: '#afe8a6', hp: 111, size: 55, pace: 37, range: 121,
    phases: [['seeds', 'sap']], moves: {
      seeds: strike('Βροχή σπόρων', 'drop', .74, .35, .82, { radius: 32, count: 2, art: 'spore' }),
      sap: strike('Σύννεφο γύρης', 'fan', .64, .41, .75, { lanes: [-15, 15], speed: 153, art: 'spore' }),
    } },
  { name: 'Η Μάσκα των Ερειπίων', color: '#a9d6ef', hp: 124, size: 56, pace: 44, range: 150, hover: 17,
    phases: [['boulders', 'pulse']], moves: {
      boulders: strike('Πέτρινες μπάλες', 'lanes', .73, .64, .81, { lanes: [-15, 15], volley: 2, speed: 178, art: 'stone' }),
      pulse: strike('Παλμός του βράχου', 'ring', .81, .50, .82, { radius: 89, art: 'rune' }),
    } },
  { name: 'Το Κουρδιστό Γκαργκόιλ', color: '#ffcc83', hp: 137, size: 57, pace: 57, range: 145, hover: 13,
    phases: [['gears', 'swoop']], moves: {
      gears: strike('Σπίθες των γραναζιών', 'fan', .66, .37, .69, { lanes: [-21, 0, 21], speed: 192, art: 'star' }),
      swoop: strike('Βουτιά του γκαργκόιλ', 'leap', .73, .81, .83, { radius: 61, height: 72, art: 'star' }),
    } },
];

const PHASE_MARKS = [.70, .36];
const arenaLimit = () => Number.isFinite(game.arenaCamera) && ['fight','reward'].includes(game.gate) ? game.arenaCamera + WIDTH - 22 : GATES[game.section] - 20;
const arenaX = x => clamp(x, Number.isFinite(game.arenaCamera) && ['fight','reward'].includes(game.gate) ? game.arenaCamera + 22 : Math.max(game.entry + 18, GATES[game.section] - 370), arenaLimit());

function specialEnemy(level, x, y, rival = false) {
  const kit = (rival ? RIVAL_KITS : BOSS_KITS)[level];
  const rules=difficultyRules();
  const hp = Math.round(kit.hp * (game.two ? 1.17 : 1) * (rival?rules.enemyHealth:rules.bossHealth));
  return {
    type: level, x, y, z: kit.hover || 0, face: -1, hp, maxHp: hp, boss: !rival, rival,
    kit, size: kit.size, speed: kit.pace*rules.speed, act: 'idle', age: 0, phase: 0, hurt: 0, phaseIndex: 0,
    phaseAttack: -1, cycle: 0, cooldown: .55*rules.rest, move: null,
  };
}

function phaseFloor(e) {
  if (!e.boss) return 0;
  if (e.phaseIndex < PHASE_MARKS.length) return Math.ceil(e.maxHp * PHASE_MARKS[e.phaseIndex]);
  return e.phaseAttack === e.phaseIndex ? 0 : 1;
}

function bossDamage(e, amount, direction) {
  const guarded = (e.kit?.armor || e.guard) && ['idle', 'walk', 'tell', 'phase'].includes(e.act) && e.face !== direction;
  return Math.min(e.hp - phaseFloor(e), Math.round(amount * (guarded ? .58 : 1)));
}

function targetsFor(move, living, target) {
  const chosen = move.count === 3
    ? [{ x: target.x - 59, y: target.y - 12 }, target, living.find(p => p !== target) || { x: target.x + 58, y: target.y + 13 }]
    : [target, living.find(p => p !== target) || { x: target.x + 58, y: target.y + 16 }];
  return chosen.map(p => ({ x: arenaX(p.x), y: clamp(p.y, ...DEPTH) }));
}

function startSpecial(e, living, target) {
  const sequence = e.kit.phases[e.phaseIndex];
  const id = sequence[e.cycle++ % sequence.length];
  const authoredPlan=e.kit.moves[id],rules=difficultyRules();
  const plan={...authoredPlan,tell:authoredPlan.tell*rules.tell,rest:authoredPlan.rest*rules.rest};
  const direction = target.x < e.x ? -1 : 1;
  const aimY = clamp(target.y, ...DEPTH);
  const spots = plan.form === 'drop' ? targetsFor(plan, living, target) : [{ x: arenaX(target.x), y: aimY }];
  e.face = direction;
  e.move = { id, plan, direction, aimY, from: e.x, fromY: e.y, spots, launched: 0, hits: new Set() };
  pose(e, 'tell');
  effect('warning');
}

function hazard(e, move, data) {
  const plan = move.plan;
  game.hazards.push({ ...data, age: 0, hits: new Set(), art: plan.art, color: e.kit.color,
    damage: e.rival ? 8 : 10 + e.phaseIndex * 2, owner: e });
}

function launchSpecial(e, move) {
  const plan = move.plan;
  if (plan.form === 'ring') {
    hazard(e, move, { form: 'ring', x: e.x, y: e.y, radius: plan.radius, life: plan.active });
  } else if (plan.form === 'drop') {
    for (const spot of move.spots) hazard(e, move, { ...spot, form: 'drop', radius: plan.radius, life: .47 });
  } else if (plan.form === 'lanes' || plan.form === 'fan') {
    const lanes = plan.lanes;
    for (const offset of lanes) {
      const parallel = plan.form === 'lanes';
      hazard(e, move, { form: 'bolt', x: e.x + e.face * (e.size * .40), y: parallel ? clamp(move.aimY + offset, ...DEPTH) : e.y,
        z: plan.art === 'stone' ? 3 : 19, vx: move.direction * plan.speed, vy: parallel ? 0 : offset * 1.9,
        life: 1.6, radius: plan.art === 'stone' ? 12 : 8 });
    }
  }
  effect(plan.form === 'ring' || plan.form === 'drop' ? 'slam' : 'enemyShot');
}

function specialAttack(e, dt, living) {
  const move = e.move;
  const plan = move.plan;
  e.phaseAttack = e.phaseIndex;
  const shotCount = plan.volley || 1;
  if (move.launched < shotCount && e.age >= move.launched * (plan.active / shotCount)) {
    if (!['dash', 'leap'].includes(plan.form)) launchSpecial(e, move);
    else if (!move.launched) effect('throw');
    move.launched++;
  }
  if (plan.form === 'dash') {
    e.x = arenaX(e.x + move.direction * plan.speed * dt);
    e.y = mix(e.y, move.aimY, Math.min(1, dt * 11));
    for (const p of living) {
      if (p.z < 27 && Math.abs(p.x - e.x) < e.size * .43 + 12 && Math.abs(p.y - e.y) < 17 && !move.hits.has(p)) {
        move.hits.add(p);
        hitHero(p, e.x, e.rival ? 10 : 13 + e.phaseIndex);
      }
    }
  } else if (plan.form === 'leap') {
    const t = clamp(e.age / plan.active, 0, 1);
    const spot = move.spots[0];
    e.x = arenaX(mix(move.from, spot.x, t));
    e.y = mix(move.fromY, spot.y, t);
    e.z = (e.kit.hover || 0) + Math.sin(t * Math.PI) * plan.height;
    if (t >= 1) {
      game.shake = Math.max(game.shake, 3);
      hazard(e, move, { form: 'ring', x: e.x, y: e.y, radius: plan.radius, life: .39 });
      effect('slam');
    }
  } else if (plan.lift) {
    e.z = (e.kit.hover || 0) + Math.sin(clamp(e.age / plan.active, 0, 1) * Math.PI) * plan.lift;
  }
  if (e.age >= plan.active) {
    e.z = e.kit.hover || 0;
    pose(e, 'recover');
  }
}

function updateSpecial(e, dt, living) {
  const target = living.reduce((nearest, p) =>
    Math.hypot(p.x - e.x, (p.y - e.y) * 1.4) < Math.hypot(nearest.x - e.x, (nearest.y - e.y) * 1.4) ? p : nearest);
  e.hurt = Math.max(0, e.hurt - dt);
  if (e.act === 'tell') {
    if (e.age >= e.move.plan.tell) pose(e, 'attack');
    return;
  }
  if (e.act === 'attack') return specialAttack(e, dt, living);
  if (e.act === 'recover') {
    if (e.age < e.move.plan.rest) return;
    e.move = null;
    e.cooldown = (e.rival ? .40 : Math.max(.28, .57 - e.phaseIndex * .11))*difficultyRules().rest;
    pose(e, 'idle');
  }
  if (e.act === 'phase') {
    if (e.age < .56) return;
    return startSpecial(e, living, target);
  }
  if (e.boss && e.phaseIndex < PHASE_MARKS.length && e.phaseAttack === e.phaseIndex && e.hp <= phaseFloor(e)) {
    e.phaseIndex++;
    e.cycle = 0;
    e.move = null;
    pose(e, 'phase');
    spark(e.x, e.y - e.size * .54, e.kit.color, 21);
    effect('phaseShift');
    return;
  }
  e.cooldown -= dt;
  const dx = target.x - e.x;
  const dy = target.y - e.y;
  e.face = dx < 0 ? -1 : 1;
  if (e.cooldown <= 0 && Math.abs(dx) < e.kit.range + 104) return startSpecial(e, living, target);
  if (Math.abs(dx) > e.kit.range * .63 || Math.abs(dy) > 12) {
    pose(e, 'walk');
    if (Math.abs(dx) > e.kit.range * .63)
      e.x = arenaX(e.x + Math.sign(dx) * e.speed * dt);
    e.y = clamp(e.y + clamp(dy, -e.speed * .68 * dt, e.speed * .68 * dt), ...DEPTH);
  } else pose(e, 'idle');
}

function ringDistance(p, x, y) {
  return Math.hypot(p.x - x, (p.y - y) * 1.8);
}

function updateHazards(dt, living) {
  for (const h of game.hazards) {
    h.age += dt;
    if (h.age > h.life) continue;
    if (h.form === 'bolt') {
      h.x += h.vx * dt;
      h.y += h.vy * dt;
    }
    for (const p of living) {
      if (!p.hp || h.hits.has(p)) continue;
      const dist = ringDistance(p, h.x, h.y);
      const impact = h.form === 'bolt'
        ? Math.abs(p.x - h.x) < h.radius + 10 && Math.abs(p.y - h.y) < 13 && p.z < (h.z || 0) + 17
        : h.form === 'drop'
          ? h.age >= .21 && p.z < 26 && dist < h.radius
          : p.z < 21 && Math.abs(dist - h.radius * (h.age / h.life)) < 15;
      if (impact) {
        h.hits.add(p);
        hitHero(p, h.x, h.damage);
      }
    }
  }
  game.hazards = game.hazards.filter(h => h.age <= h.life && h.x > game.entry - 28 && h.x < WORLD + 29);
}

// Each district gets its own authored ordering. Slots define side, lane, delay and role.
const ARENA_RUNS = [
  ['patrol', 'pincer', 'duel', 'relay', 'rush', 'guard', 'cross', 'rival', 'relay', 'rush', 'pincer', 'duel', 'guard', 'cross', 'siege'],
  ['cross', 'rush', 'relay', 'guard', 'patrol', 'pincer', 'siege', 'rival', 'duel', 'cross', 'guard', 'relay', 'rush', 'pincer', 'siege'],
  ['pincer', 'patrol', 'rush', 'duel', 'relay', 'cross', 'guard', 'rival', 'pincer', 'relay', 'rush', 'siege', 'cross', 'duel', 'guard'],
  ['duel', 'guard', 'pincer', 'cross', 'patrol', 'siege', 'relay', 'rival', 'guard', 'rush', 'duel', 'pincer', 'cross', 'siege', 'relay'],
  ['guard', 'relay', 'cross', 'siege', 'duel', 'rush', 'pincer', 'rival', 'siege', 'duel', 'guard', 'rush', 'relay', 'cross', 'pincer'],
];

const FORMATIONS = {
  patrol: { name: 'Περίπολος', slots: [['right', 205, 0], ['right', 239, .36], ['right', 219, .62, 'help']] },
  pincer: { name: 'Και από τις δύο πλευρές!', slots: [['left', 238, 0], ['right', 201, .05], ['left', 211, .46, 'help'], ['right', 232, .66]] },
  duel: { name: 'Πρόκληση του πρωταθλητή', slots: [['right', 223, .16, 'champion'], ['left', 211, .9, 'help']] },
  relay: { name: 'Έρχονται ενισχύσεις', slots: [['right', 217, 0], ['right', 245, .29, 'help'], ['left', 212, 0, 'relay'], ['right', 233, .32, 'relay']] },
  rush: { name: 'Έφοδος!', slots: [['right', 194, 0, 'runner'], ['right', 220, .26, 'runner'], ['right', 246, .51, 'runner'], ['left', 228, .38, 'help']] },
  guard: { name: 'Σπάσε την άμυνα', slots: [['right', 222, 0, 'shield'], ['right', 247, .35, 'help'], ['left', 199, .65]] },
  cross: { name: 'Διασταυρούμενη έφοδος', slots: [['left', 195, 0, 'runner'], ['right', 245, .24, 'runner'], ['left', 233, .57], ['right', 203, .72, 'help']] },
  siege: { name: 'Κράτα τη θέση σου', slots: [['right', 214, 0, 'shield'], ['left', 240, .12], ['right', 198, 0, 'relay'], ['left', 213, .22, 'relay'], ['right', 242, .61, 'help']] },
};

function queueEntrance(e, side, delay, goalX, wait = false) {
  e.entry = { side, delay, goalX, started: false, wait };
  return e;
}

function startEncounter() {
  game.arenaCamera = game.camera;
  const gate = GATES[game.section];
  game.shots = [];
  game.hazards = [];
  game.gate = 'fight';
  game.timer = 2.0;
  if (game.section === GATES.length - 1) {
    game.arenaName = currentStage().boss;
    game.enemies = [queueEntrance(specialEnemy(game.level, gate - 58, 225), 'right', .58, gate - 58)];
    game.shake = 3;
    effect('boss');
    return;
  }
  const kind = ARENA_RUNS[game.level][game.section];
  const roster = currentStage().foes;
  const district = Math.floor(game.section / 4);
  if (kind === 'rival') {
    const rival = specialEnemy(game.level, gate - 61, 222, true);
    game.arenaName = rival.kit.name;
    game.enemies = [queueEntrance(rival, 'right', .42, gate - 61)];
    if (game.two) game.enemies.push(queueEntrance(enemy(roster[0], gate - 205, 244), 'left', .78, gate - 205));
    effect('boss');
    return;
  }
  const formation = FORMATIONS[kind];
  game.arenaName = formation.name;
  game.enemies = formation.slots.flatMap(([side, y, delay, role], i) => {
    if (!game.two && role === 'help') return [];
    const x = gate - (side === 'left' ? 255 + i % 2 * 32 : 32 + i % 3 * 26);
    const e = enemy(roster[(game.section + i * 3 + district) % roster.length], x, y);
    if (role === 'runner') {
      e.speed *= 1.38;
      e.hp = e.maxHp = Math.ceil(e.hp * .78);
    } else if (role === 'shield' || role === 'champion') {
      e.guard = true;
      e.size += role === 'champion' ? 11 : 6;
      e.hp = e.maxHp = Math.ceil(e.hp * (role === 'champion' ? 2.2 : 1.44));
    }
    return [queueEntrance(e, side, delay, x, role === 'relay')];
  });
  effect('ambush');
}

function enterArena(e, dt) {
  const route = e.entry;
  if (!route.started) {
    if (route.wait && game.enemies.some(other => other.hp && !other.entry?.wait && !other.reinforcement)) return;
    route.delay -= dt;
    if (route.delay > 0) return;
    route.started = true;
    const left = route.side === 'left';
    route.target = left ? Math.min(arenaLimit() - 35, Math.max(route.goalX, game.camera + 36, game.entry + 25)) : route.goalX;
    e.x = left ? Math.min(route.target - 36, game.camera - 35) : Math.max(route.target + 40, game.camera + WIDTH + 35);
    e.face = left ? 1 : -1;
    pose(e, 'walk');
  }
  const speed = e.boss ? 164 : e.rival ? 194 : 183;
  e.x += clamp(route.target - e.x, -speed * dt, speed * dt);
  if (Math.abs(e.x - route.target) < .5) {
    e.reinforcement = route.wait;
    e.entry = null;
    if (e.act !== 'hit') pose(e, 'idle');
  }
}

function canHitEnemy(e, elevation) {
  if (!e.hp || (e.entry && (!e.entry.started || e.x < game.camera + 6 || e.x > game.camera + WIDTH - 6))) return false;
  return Math.abs((e.z || 0) - elevation) < 41;
}

const keys = new Set();
const game = {
  mode: 'home', level: 0, two: false, players: [], enemies: [], shots: [],
  particles: [], score: 0, camera: 0, section: 0, gate: 'travel', timer: 0,
  clock: 0, shake: 0, freeze: 0, reward: null, fx: true, sound: true, music: true,
  items: [], cards: 0, district: 0, districtTitle: 0, combo: null, rescues: new Set(),
  checkpoint: null, entry: 0, hazards: [], arenaName: '',
};

function player(id) {
  return { id, x: 0, y: 0, hp: 100, energy: 76, z: 0, vz: 0, face: 1,
    act: 'idle', age: 0, phase: 0, stride: 0, hit: new Set(), inv: 0, fired: false };
}

function start(two) {
  Object.assign(game, { two, score: 0, level: 0, players: two ? [player(1), player(2)] : [player(1)] });
  beginStage();
}

function beginStage(retry = false) {
  const checkpoint = retry && game.checkpoint ? game.checkpoint : { district: 0, score: game.score, cards: 0 };
  const entry = checkpoint.district * DISTRICT_LENGTH;
  Object.assign(game, { camera: entry, arenaCamera: null, section: checkpoint.district * 4, gate: 'travel', timer: 0,
    reward: null, enemies: [], particles: [], shots: [], shake: 0, freeze: 0,
    items: stageItems(game.level).filter(item => item.x >= entry),
    score: checkpoint.score, cards: checkpoint.cards, district: checkpoint.district, districtTitle: 2.2,
    combo: null, rescues: new Set(), checkpoint, entry, hazards: [], arenaName: '' });
  game.players.forEach((p, i) => Object.assign(p, {
    x: entry + 81 - i * 29, y: 214 + i * 16, z: 0, vz: 0, face: 1,
    hp: Math.max(difficultyRules().stageHealth, p.hp), energy: Math.max(65, p.energy),
    act: 'idle', age: 0, phase: 0, stride: 0, inv: 0, carry: null, toss: null, afterLift: null,
    swing: null, spent: false, evade: null, evadeCooldown: 0,
  }));
  show('stage');
}

function enemy(type, x, y) {
  const [hp, speed, size, tactic] = FOES[type];
  const rules=difficultyRules();
  const maxHp = Math.round(hp * (game.two ? 1.16 : 1) * rules.enemyHealth);
  return { type, x, y, boss: false, speed:speed*rules.speed, size, tactic, hp: maxHp, maxHp,
    face: -1, act: 'idle', age: 0, phase: between(0, 2),
    cooldown: between(.55, .95)*rules.rest, fired: false };
}

function pose(entity, act) {
  if (entity.act === act) return;
  entity.act = act;
  entity.age = 0;
}

const MOVE_TIME = { punch: .34, kick: .50, special: .50, hit: .30, land: .14, lift: .23, throw: .34, dodge: .25 };
const isHeld = (player, action) => keys.has(player.id + ':' + action) || padHeld.has(player.id + ':' + action);
const moveX = p => p.id===1 && globalThis.DragonTouch?.active ? DragonTouch.x : Number(isHeld(p, 'right')) - Number(isHeld(p, 'left'));
const moveY = p => p.id===1 && globalThis.DragonTouch?.active ? DragonTouch.y : Number(isHeld(p, 'down')) - Number(isHeld(p, 'up'));
function playerLimits(p) {
  // A locked encounter is one full screen. No separate wall inside the image.
  return [Math.max(game.entry + 22, game.camera + 22), Math.min(WORLD - 22, game.camera + WIDTH - 22)];
}

function action(p, name) {
  if (game.mode !== 'play' || p.hp <= 0 || p.act === 'hit' || p.act === 'special') return;
  const aim = padAim.get(p.id);
  const dx = moveX(p);
  const direction = aim?.x || dx;
  if (p.act === 'lift' && ['pickup', 'punch', 'kick', 'jump', 'special', 'dodge'].includes(name)) {
    p.afterLift = name;
    if (direction) p.face = direction;
    return;
  }
  if (name === 'pickup' || (name === 'punch' && p.carry?.hp)) {
    if (direction && !MOVE_TIME[p.act]) p.face = direction;
    pickupAction(p);
    return;
  }
  if (name === 'dodge') {
    if (p.z > 0 || p.vz || MOVE_TIME[p.act] || p.evadeCooldown > 0) return;
    const dy = moveY(p);
    const rx = dx || (!dy ? aim?.x : 0) || 0;
    const ry = dy || (!dx ? aim?.y : 0) || 0;
    const length = Math.hypot(rx, ry) || 1;
    p.evade = { x: rx / length || (ry ? 0 : p.face), y: ry / length };
    if (p.evade.x) p.face = Math.sign(p.evade.x);
    p.evadeCooldown = .82;
    pose(p, 'dodge');
    effect('dodge', p.id);
    return;
  }
  if (name === 'jump') {
    if (p.z > 0 || p.vz || MOVE_TIME[p.act]) return;
    p.z = .01;
    p.vz = 211;
    pose(p, 'jump');
    effect('jump', p.id);
    return;
  }
  if (MOVE_TIME[p.act]) return;
  if (name === 'special') {
    if (p.energy < 22) return;
    p.energy -= 22;
    if (p.carry?.hp) dropCarried(p);
  }
  if (direction) p.face = direction;
  pose(p, name);
  p.hit = new Set();
  p.fired = false;
  p.swing = name === 'punch' && p.carry?.kind === 'club' ? p.carry : null;
  p.spent = false;
  effect(name === 'special' ? 'charge' : name === 'kick' ? 'kickSwing' : 'punchSwing', p.id);
}

function spark(x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    const life = between(.16, .40);
    game.particles.push({ x, y, vx: between(-74, 74), vy: between(-90, 35),
      life, max: life, color, size: between(1, 3) });
  }
}

function damage(e, owner, amount, hits, direction, source = 'punch') {
  if (e.hp <= 0 || hits.has(e)) return;
  hits.add(e);
  const dealt = bossDamage(e, amount, direction);
  if (dealt <= 0) return;
  e.hp -= dealt;
  if ((!e.kit || e.storyFoe) && !e.entry) e.x = arenaX(e.x + direction * (e.guard ? 5 : 9));
  game.score += dealt * 10;
  if (!game.combo || game.combo.until < game.clock) game.combo = { count: 0, sources: new Set(), until: 0 };
  const chain = game.combo;
  chain.count += 1;
  chain.until = game.clock + 1.65;
  chain.sources.add(source);
  if (chain.count % 4 === 0 && chain.sources.size > 1) {
    game.score += 250 * chain.sources.size;
    owner.energy = Math.min(100, owner.energy + 12);
  }
  owner.energy = Math.min(100, owner.energy + 4);
  owner.lastHit = game.clock;
  if (!e.hp || !e.kit || e.storyFoe) {
    pose(e, e.hp > 0 ? 'hit' : 'fall');
    e.age = 0;
  } else e.hurt = .105;
  game.shake = e.hp ? 1.8 : 3.4;
  game.freeze = .024;
  spark(e.x, e.y - (e.z || 0) - e.size * .53, e.hp ? '#ffe69c' : '#ffad68', e.hp ? 11 : 24);
  effect(source, owner.id);
}

function updatePlayer(p, dt) {
  p.age += dt;
  p.phase += dt;
  p.inv = Math.max(0, p.inv - dt);
  p.evadeCooldown = Math.max(0, p.evadeCooldown - dt);
  p.energy = Math.min(100, p.energy + dt * difficultyRules().energy);
  const dx = moveX(p);
  const dy = moveY(p);
  const air = p.z > 0 || p.vz !== 0;
  if (p.act === 'throw' && p.age >= .105 && p.toss) releaseProp(p);
  if (MOVE_TIME[p.act] && p.age >= MOVE_TIME[p.act]) {
    const queued = p.act === 'lift' && p.afterLift;
    p.afterLift = null;
    pose(p, air ? 'jump' : 'idle');
    if (queued) action(p, queued);
  }
  if (p.act === 'dodge') {
    p.x = clamp(p.x + p.evade.x * 249 * dt, ...playerLimits(p));
    p.y = clamp(p.y + p.evade.y * 179 * dt, ...DEPTH);
    return;
  }
  const aim = dx || padAim.get(p.id)?.x;
  if (aim && !MOVE_TIME[p.act]) p.face = aim;
  const block = isHeld(p, 'block') && !air && !MOVE_TIME[p.act];
  if (block) pose(p, 'block');
  if ((dx || dy) && (!MOVE_TIME[p.act] || air) && !block && p.act !== 'hit') {
    const length = Math.max(1, Math.hypot(dx, dy));
    const load = p.carry?.hp ? .88 : 1;
    const x = clamp(p.x + dx / length * (air ? 105 : 118) * load * dt, ...playerLimits(p));
    const y = clamp(p.y + dy / length * 76 * load * dt, ...DEPTH);
    if (!air) {
      const traveled = Math.hypot(x - p.x, y - p.y);
      if (traveled > .01) {
        const step = Math.floor(p.stride / 30);
        p.stride += traveled;
        if (game.fx && Math.floor(p.stride / 30) !== step) spark(x - p.face * 3, y, '#e9c7aa', 3);
      }
      pose(p, traveled > .01 ? 'walk' : 'idle');
    }
    p.x = x;
    p.y = y;
  } else if (!block && !air && !MOVE_TIME[p.act]) {
    pose(p, 'idle');
  }

  if (air) {
    p.z += p.vz * dt;
    p.vz -= 555 * dt;
    if (p.z <= 0) {
      p.z = p.vz = 0;
      spark(p.x, p.y, '#d6b8a8', 5);
      effect('land', p.id);
      if (p.act === 'jump') pose(p, 'land');
    }
  }
  if (p.act === 'special' && p.age >= .18 && !p.fired) {
    p.fired = true;
    const handX = p.x + p.face * 21 * HERO_SCALE;
    const handY = p.y - p.z - 26 * HERO_SCALE;
    game.shots.push({ x: handX, y: handY, depth: p.y, elevation: p.z,
      direction: p.face, life: 1.65, owner: p, hits: new Set() });
    spark(handX, handY, p.id === 1 ? '#77ebff' : '#ffb961');
    effect('release', p.id);
  }
  const punch = p.act === 'punch' && p.age >= .16 && p.age < .25;
  const kick = p.act === 'kick' && p.age >= .24 && p.age < .38;
  if (punch || kick) {
    const club = punch && p.swing;
    const source = club ? 'club' : kick ? 'kick' : 'punch';
    const amount = club ? 36 : kick ? 26 : 18;
    const sweep = club ? 57 : kick ? 44 : 33;
    if (club && !p.spent) {
      p.spent = true;
      club.uses -= 1;
      if (!club.uses) {
        p.carry = null;
        spark(p.x + p.face * 24 * HERO_SCALE, p.y - p.z - 20 * HERO_SCALE, '#ffd9a1', 9);
        effect('break', p.id);
      }
    }
    for (const e of game.enemies) {
      const reach = sweep + e.size * .27;
      const distance = (e.x - p.x) * p.face;
      if (distance > -3 && distance < reach && Math.abs(e.y - p.y) < 22 && canHitEnemy(e, p.z))
        damage(e, p, amount, p.hit, p.face, source);
    }
    if (p.z < 23) hitItems(p, p.hit, p.x, p.y, sweep + 8, amount);
  }
}

function hitHero(p, sourceX, amount) {
  amount=Math.max(1,Math.round(amount*difficultyRules().incoming));
  if (!p.hp || p.inv > 0 || (p.act === 'dodge' && p.age < .22)) return;
  const block = p.act === 'block' && (sourceX - p.x) * p.face >= 0;
  const perfect = block && p.age < .17;
  p.hp = Math.max(0, p.hp - (perfect ? 0 : block ? Math.max(1, Math.round(amount * .15)) : amount));
  if (perfect) p.energy = Math.min(100, p.energy + 14);
  p.inv = .68;
  if (!block || !p.hp) pose(p, p.hp ? 'hit' : 'fall');
  if (p.toss || !p.hp) dropCarried(p);
  if (!block) game.combo = null;
  spark(p.x, p.y - 20 * HERO_SCALE, perfect ? '#ceffda' : block ? '#7adeff' : '#ffd9a0', perfect ? 19 : 9);
  effect(perfect ? 'pickup' : block ? 'block' : 'hurt', p.id);
}

function updateEnemy(e, dt, living) {
  e.age += dt;
  e.phase += dt;
  if (!e.hp || !living.length) return;
  if (e.entry) return enterArena(e, dt);
  if(e.storyFoe&&e.act==='hit'){if(e.age<.25)return;pose(e,'idle');e.move=null;e.cooldown=Math.max(e.cooldown,.35*difficultyRules().rest)}
  if (e.kit) return updateSpecial(e, dt, living);
  e.cooldown -= dt;
  if (e.act === 'hit' && e.age < .25) return;
  if (e.act === 'attack') {
    const windup = .36*difficultyRules().tell;
    if (e.age >= windup && !e.fired) {
      e.fired = true;
      for (const p of living) {
        const distance = (p.x - e.x) * e.face;
        if (p.z < 22 && Math.abs(p.y - e.y) <= 16 && distance >= -4 && distance <= 26)
          hitHero(p, e.x, e.guard ? 7 : 5);
      }
    }
    if (e.age < windup + .37) return;
    pose(e, 'idle');
  }

  const distanceTo = (p) => Math.hypot(p.x - e.x, (p.y - e.y) * 1.65);
  const target = living.reduce((a, b) => distanceTo(a) <= distanceTo(b) ? a : b);
  const dx = target.x - e.x;
  const dy = target.y - e.y;
  if (Math.abs(dx) > 2) e.face = Math.sign(dx);
  if (Math.abs(dx) <= 18 && Math.abs(dy) < 14) {
    if (e.cooldown > 0) return pose(e, 'idle');
    pose(e, 'attack');
    e.fired = false;
    e.cooldown = between(1.25, 1.7)*difficultyRules().rest;
    return;
  }
  pose(e, 'walk');
  const speed = e.speed * (e.tactic === 'rush' && Math.abs(dx) > 130 ? 1.16 : 1);
  const arc = e.tactic === 'flank' && Math.abs(dx) > 56 ? Math.sin(e.phase * 4) * 17 : 0;
  e.x = arenaX(e.x + clamp(dx - e.face * 9, -speed * dt, speed * dt));
  e.y = clamp(e.y + clamp(dy + arc, -speed * .66 * dt, speed * .66 * dt), ...DEPTH);
}

function updateGate(living, dt) {
  game.timer = Math.max(0, game.timer - dt);
  const limit = GATES[game.section];
  if (game.gate === 'travel' && living.some(p => p.x >= limit - 155)) startEncounter();
  if (game.gate === 'fight' && game.enemies.length && game.enemies.every(e => !e.hp)) {
    game.hazards = [];
    if (game.section < GATES.length - 1) {
      game.gate = 'open';
      game.timer = 1.1;
      living.forEach(p => { p.hp = Math.min(100, p.hp + difficultyRules().gateHeal); });
      effect('gate');
    } else {
      game.gate = 'reward';
      game.timer = 1.75;
      game.reward = { x: game.enemies[0].x, y: game.enemies[0].y };
      effect('reward');
    }
  }
  if (game.gate === 'open' && !game.timer) {
    game.section += 1;
    game.gate = 'travel';
  }
  if (game.gate === 'reward') {
    const { x, y } = game.reward;
    if (!game.timer || (game.timer < 1.15 && living.some(p => Math.hypot(p.x - x, p.y - y) < 27))) {
      game.score += 1000;
      show('clear');
    }
  }
}

function update(dt) {
  if (game.mode !== 'play') return;
  game.clock += dt;
  game.districtTitle = Math.max(0, game.districtTitle - dt);
  game.shake = Math.max(0, game.shake - 20 * dt);
  game.freeze = Math.max(0, game.freeze - dt);
  if (game.freeze) return;

  const living = game.players.filter(p => p.hp > 0);
  if (!living.length) return show('lose');
  for (const p of game.players) {
    if (p.hp) updatePlayer(p, dt);
    else p.age += dt;
  }
  for (const e of game.enemies) updateEnemy(e, dt, living);
  for (const shot of game.shots) {
    shot.x += shot.direction * 275 * dt;
    shot.life -= dt;
    for (const e of game.enemies) {
      if (canHitEnemy(e, shot.elevation) && Math.abs(e.x - shot.x) < e.size * .35 + 9 &&
          Math.abs(e.y - shot.depth) < 24 && shot.y > e.y - (e.z || 0) - e.size - 13)
        damage(e, shot.owner, 33, shot.hits, shot.direction, 'energyHit');
    }
    hitItems(shot.owner, shot.hits, shot.x, shot.depth, 12, 30, shot.direction);
  }
  updateItems(dt);
  updateHazards(dt, living);
  game.shots = game.shots.filter(shot => shot.life > 0 && shot.x > -24 && shot.x < WORLD + 24);
  for (const p of game.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 140 * dt;
    p.life -= dt;
  }
  game.particles = game.particles.filter(p => p.life > 0);
  updateGate(living, dt);

  const left = Math.min(...living.map(p => p.x));
  const right = Math.max(...living.map(p => p.x));
  const district = districtIndex(right);
  if (district > game.district) {
    game.district = district;
    game.districtTitle = 2.2;
    game.checkpoint = { district, score: game.score, cards: game.cards };
  }
  if (['fight','reward'].includes(game.gate) && Number.isFinite(game.arenaCamera)) {
    game.camera = game.arenaCamera;
  } else {
    // One-sided arcade window: advance when the leader pushes the window,
    // retain the trailing co-op player, and never drift backwards.
    const aim = Math.max(game.camera, right - WIDTH * .58);
    const high = Math.max(game.camera, Math.min(WORLD - WIDTH, left - 22));
    game.camera = clamp(mix(game.camera, aim, 1-Math.exp(-dt*8)), game.camera, high);
  }
}

const ITEM = {
  pot: { sprite: 0, width: 27, hp: 23 }, barrel: { sprite: 1, width: 34, hp: 24 },
  bundle: { sprite: 2, width: 29, hp: 22 }, amphora: { sprite: 3, width: 30, hp: 23 },
  crate: { sprite: 4, width: 35, hp: 24 }, club: { sprite: 5, width: 36 },
  card: { sprite: 6, width: 17 }, apple: { sprite: 7, width: 17 },
  debris: { sprite: 8, width: 23 },
};
const CONTAINERS = ['pot', 'barrel', 'bundle', 'amphora', 'crate'];

function makeItem(kind, x, y, loot = null) {
  return { kind, x, y, z: 0, hp: ITEM[kind].hp, uses: kind === 'club' ? 4 : 0, loot, flight: null };
}

function stageItems(level) {
  const type = CONTAINERS[level];
  const items = [makeItem(type, 183, 229, 'apple'), makeItem('club', 245, 210)];
  GATES.forEach((gate, i) => {
    items.push(makeItem(type, gate - 204, 198 + (i % 3) * 21, i % 4 === 1 ? 'apple' : 'card'));
    items.push(makeItem(type, gate - 69, 241 - (i % 2) * 30, i % 4 === 2 ? 'club' : null));
    if (i % 4 === 0) items.push(makeItem('club', gate + 65, 226));
  });
  return items;
}

function nearbyItem(p) {
  let nearest = null;
  let best = 34;
  for (const item of game.items) {
    if (item.gone || item.decor || item.flight || item.kind === 'debris' || (item.kind === 'apple' && p.hp >= 100)) continue;
    const distance = Math.hypot(item.x - p.x, (item.y - p.y) * 1.45);
    if (distance < best) {
      nearest = item;
      best = distance;
    }
  }
  return nearest;
}

function rescueTarget(p) {
  if (game.rescues.has(districtIndex(p.x))) return null;
  return game.players.find(other => other !== p && other.hp <= 0 && Math.hypot(other.x - p.x, (other.y - p.y) * 1.3) < 43);
}

function pickupAction(p) {
  if (p.z > 11 || MOVE_TIME[p.act]) return;
  if (p.carry) {
    p.toss = p.carry;
    p.carry = null;
    pose(p, 'throw');
    return;
  }
  const ally = rescueTarget(p);
  if (ally) {
    game.rescues.add(districtIndex(p.x));
    Object.assign(ally, { hp: 42, energy: 32, z: 0, vz: 0, inv: 1.8, act: 'land', age: 0 });
    spark(ally.x, ally.y - 22, '#aaffda', 19);
    effect('heal', p.id);
    return;
  }
  const item = nearbyItem(p);
  if (!item) return;
  game.items = game.items.filter(other => other !== item);
  if (item.kind === 'apple') {
    p.hp = Math.min(100, p.hp + difficultyRules().appleHeal);
    effect('heal', p.id);
    spark(p.x, p.y - 20, '#aaffc8', 12);
  } else if (item.kind === 'card') {
    game.score += 600;
    game.cards += 1;
    p.energy = Math.min(100, p.energy + 25);
    effect('pickup', p.id);
    spark(p.x, p.y - 27, '#ffdf86', 17);
  } else {
    p.carry = item;
    pose(p, 'lift');
    effect('pickup', p.id);
  }
}

function releaseProp(p) {
  const item = p.toss;
  p.toss = null;
  item.x = p.x + p.face * 25 * HERO_SCALE;
  item.y = p.y;
  item.z = 25 * HERO_SCALE;
  item.flight = { owner: p, direction: p.face, speed: item.kind === 'club' ? 335 : 277, rise: 98, spin: 0 };
  game.items.push(item);
  effect('throw', p.id);
}

function dropCarried(p) {
  const item = p.carry || p.toss;
  if (!item) return;
  p.carry = p.toss = null;
  Object.assign(item, { x: p.x, y: p.y, z: 0, flight: null });
  game.items.push(item);
}

function breakItem(item) {
  if (item.gone) return;
  item.gone = true;
  spark(item.x, item.y - item.z - 7, '#ffd193', 16);
  effect('break');
  game.items.push({ ...makeItem('debris', item.x, item.y), linger: 1.7 });
  if (item.loot) game.items.push(makeItem(item.loot, clamp(item.x, 23, WORLD - 32), item.y));
}

function hitItems(p, hits, x, y, reach, amount, direction = p.face) {
  for (const item of game.items.slice()) {
    const dx = (item.x - x) * direction;
    if (!item.hp || item.gone || item.flight || hits.has(item) || dx < -8 || dx > reach || Math.abs(item.y - y) > 19) continue;
    hits.add(item);
    item.hp = Math.max(0, item.hp - amount);
    if (item.hp) {
      spark(item.x, item.y - 9, '#f2cf9d', 6);
      effect('punch');
    } else breakItem(item);
  }
}

function updateItems(dt) {
  for (const item of game.items.slice()) {
    if (item.kind === 'debris') {
      item.linger -= dt;
      if (item.linger <= 0) item.gone = true;
      continue;
    }
    const f = item.flight;
    if (!f) continue;
    item.x += f.direction * f.speed * dt;
    item.z += f.rise * dt;
    f.rise -= 430 * dt;
    f.spin += dt * f.direction * 13;
    if (item.z > 0 && item.z < 59) {
      const target = game.enemies.find(e => canHitEnemy(e, item.z - 15) && Math.abs(e.x - item.x) < e.size * .4 + 12 &&
        Math.abs(e.y - item.y) < 23 && item.z < e.size + 23);
      if (target) {
        damage(target, f.owner, item.kind === 'club' ? 37 : 45, new Set(), f.direction, 'throwHit');
        breakItem(item);
      }
    }
    if (item.z <= 0 || item.x < 16 || item.x > WORLD - 16) {
      item.x = clamp(item.x, 23, WORLD - 32);
      item.z = 0;
      if (item.kind === 'club' && !item.gone) {
        item.flight = null;
        effect('land');
      } else breakItem(item);
    }
  }
  game.items = game.items.filter(item => !item.gone);
}

const canvas = document.querySelector('#game');
canvas.tabIndex = -1;
const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;
const images = Object.fromEntries(Object.entries(ART).filter(([key]) => key !== 'cover' && !key.startsWith('comic-')).map(([key, src]) => {
  const image = new Image();
  image.dataset.art = key;
  image.src = src;
  return [key, image];
}));

const READY = image => image?.complete && image.naturalWidth;
const CELL = 112;
const ANCHOR = 101;
const HERO = {
  idle: [0, 0, 0, 4], walk: [1, 2, 3, 2], punch: [4, 5, 6, 7],
  kick: [8, 9, 10, 11], block: [12], jump: [13], land: [14],
  hit: [14, 4], fall: [14], special: [4, 15, 15, 15],
};
const HERO_MOTION = {
  jump: [8, 9, 10, 9], land: [11, 8], block: [12], hit: [13, 12], fall: [13, 14],
};
const STRIKE_FRAMES = [0, 1, 2, 3, 4, 4, 5, 6, 7];
const COLORS = ['#ffd280', '#70dfe9'];
const AMBIENT = ['#ffad71', '#ffd880', '#7dffd6', '#ffbe79', '#ff8d67'];
const LANTERNS = [
  [[548, 81], [1584, 82]],
  [[471, 40], [1526, 40]],
  [],
  [[396, 149], [1109, 142], [1549, 135]],
  [[78, 99], [155, 101], [380, 115], [658, 123], [907, 124], [1181, 121], [1413, 100], [1782, 131]],
];
const GROUND_Y = 186;
const ROUTE_UNIT = 1536;
// Positions are in stage coordinates. Upper props hang into the view and lower
// props cross the foot of the screen, ahead of actors and ground.
const SCENERY_PROPS = [
  [[10, 62, 86, 49], [523, 68, 88, 48], [1060, 65, 89, 47], [1695, 68, 97, 48]],
  [[10, 262, 65, 99], [570, 265, 75, 102], [1190, 268, 74, 98], [1735, 263, 70, 96]],
  [[7, 66, 112, 63], [470, 55, 90, 57], [1080, 66, 115, 68], [1620, 52, 101, 58]],
  [[-16, 249, 91, 246], [667, 242, 94, 234], [1250, 250, 85, 247], [1900, 250, 87, 234]],
  [[35, 153, 74, 82], [580, 155, 75, 88], [1165, 154, 75, 92], [1695, 151, 70, 78]],
];

function pixel(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
}

function label(text, x, y, size, color, align = 'left') {
  ctx.font = 'bold ' + size + 'px "Trebuchet MS", sans-serif';
  ctx.textAlign = align;
  ctx.fillStyle = '#120f20';
  ctx.fillText(text, x + 1, y + 1);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function panorama() {
  const layer = images['route-' + (game.level + 1)];
  const stageX = Math.min(ROUTE_UNIT * DISTRICTS - WIDTH, game.camera * ROUTE_UNIT / DISTRICT_LENGTH);
  const sky = images.distant;
  pixel(-10, -10, WIDTH + 20, HEIGHT + 20, '#312644');
  if (READY(sky)) {
    const strip = sky.height / STAGES.length;
    const skyX = game.camera / (WORLD - WIDTH) * (sky.width - WIDTH);
    ctx.drawImage(sky, skyX, strip * game.level, WIDTH, strip, 0, 0, WIDTH, GROUND_Y);
  }
  if (READY(layer)) ctx.drawImage(layer, stageX, 0, WIDTH, GROUND_Y, 0, 0, WIDTH, GROUND_Y);
  drawPavement();
  const light = AMBIENT[game.level];
  if (game.fx) {
    drawStageLight(light, stageX);
    for (let i = 0; i < 26; i++) {
      const depth = i % 3;
      const x = ((i * 137 - game.camera * (.31 + depth * .34) + (5 - depth * 3) * game.clock) % 507 + 507) % 507 - 12;
      const y = 41 + (i * 73) % 210 + Math.sin(game.clock * .7 + i) * (2 + depth * 2);
      ctx.globalAlpha = (.16 + depth * .08) * (.5 + .5 * Math.sin(game.clock * 1.3 + i));
      pixel(x, y, depth > 1 ? 2 : 1, 1 + Number(depth > 1), light);
    }
    ctx.globalAlpha = 1;
  }
  if (game.gate === 'fight') drawGate(GATES[game.section] - 18 - game.camera);
}

function drawPavement() {
  const floor = images.ground;
  if (!READY(floor)) return;
  const strip = floor.height / STAGES.length;
  for (let x = -Math.round(game.camera) % floor.width; x < WIDTH + 10; x += floor.width)
    ctx.drawImage(floor, 0, strip * game.level, floor.width, strip, x, GROUND_Y, floor.width, HEIGHT - GROUND_Y);
  const depth = ctx.createLinearGradient(0, GROUND_Y, 0, HEIGHT);
  depth.addColorStop(0, '#1d162a91');
  depth.addColorStop(.35, '#2b1b4024');
  depth.addColorStop(.76, '#100d2700');
  depth.addColorStop(1, '#15112935');
  pixel(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y, depth);
  for (let i = Math.floor(game.camera / 57); i <= (game.camera + WIDTH) / 57; i++) {
    const x = i * 57 + i * 17 % 23 - game.camera;
    const y = 195 + i * 29 % 66;
    pixel(x + 2, y + 1, 3 + i % 3, 1, '#20132a50');
    pixel(x, y, 2 + i % 3, 1, AMBIENT[game.level] + '61');
    if (i % 4 === 0) pixel(x + 6, y - 4, 2, 1, '#fee6aa55');
  }
}

function drawStageLight(color, stageX) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (const [worldX, y] of LANTERNS[game.level]) {
    const x = worldX * ROUTE_UNIT / DISTRICT_LENGTH - stageX;
    if (x < -27 || x > WIDTH + 27) continue;
    const radius = 20 + 4 * Math.sin(game.clock * 9 + worldX);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, color + '36');
    glow.addColorStop(1, color + '00');
    pixel(x - radius, y - radius, radius * 2, radius * 2, glow);
  }
  if (game.level === 1 || game.level === 2) {
    for (let i = 0; i < 24; i++) {
      const forest = game.level === 2;
      const worldX = (forest ? 1120 : 818) + i * (forest ? 14 : 24);
      const x = worldX * ROUTE_UNIT / DISTRICT_LENGTH - stageX + Math.sin(game.clock * 1.5 + i) * 5;
      const y = forest ? 155 + ((game.clock * 17 + i * 11) % 28) : 122 + (i * 19) % 56;
      ctx.globalAlpha = .10 + .26 * (.5 + .5 * Math.sin(game.clock * 5 + i));
      pixel(x, y, (forest ? 1 : 3) + i % 3, 1, forest ? '#88f9ff' : '#ffd598');
    }
  }
  ctx.restore();
}

function closerScenery() {
  const art = images.foreground;
  if (!READY(art)) return;
  const silhouettes = SCENERY_PROPS[game.level];
  const firstDistrict = districtIndex(game.camera - 100);
  const lastDistrict = districtIndex(game.camera + WIDTH);
  for (let district = firstDistrict; district <= lastDistrict; district++) {
    for (const [worldX, y, w, h] of silhouettes) {
      const x = worldX - (game.camera - district * DISTRICT_LENGTH) * 1.18;
      if (x < -w || x > WIDTH + w) continue;
      const coversHero = y > 190 && game.players.some(p => p.hp && Math.abs(p.x - game.camera - x) < w * .58);
      ctx.save();
      ctx.translate(Math.round(x), y);
      ctx.globalAlpha = coversHero ? .4 : .91;
      stamp(art, game.level, 5, w, h);
      ctx.restore();
    }
  }
  const first = Math.floor(game.camera * 1.10 / 403);
  for (let i = first - 1; i <= first + 2; i++) {
    const x = 120 + i * 403 - game.camera * 1.10;
    if (x < -63 || x > WIDTH + 63) continue;
    ctx.save();
    ctx.translate(Math.round(x), 279 + (i % 2) * 6);
    ctx.globalAlpha = .84;
    stamp(art, game.level + 5, 5, 76, 58);
    ctx.restore();
  }
  const shade = ctx.createLinearGradient(0, 245, 0, HEIGHT);
  shade.addColorStop(0, '#08061900');
  shade.addColorStop(1, '#0d0a2460');
  pixel(0, 245, WIDTH, HEIGHT - 245, shade);
}

function drawGate(x) {
  if (x < -12 || x > WIDTH + 12) return;
  ctx.globalAlpha = .18;
  pixel(x - 4, 178, 9, 79, '#ffc376');
  ctx.globalAlpha = .8;
  for (let i = 0; i < 10; i++) {
    const y = 178 + ((i * 8 + game.clock * 22) % 79);
    pixel(x + i % 3 - 1, y, 2, 3, '#ffc879');
  }
  ctx.globalAlpha = 1;
}

function shadow(x, y, w, shade = .54) {
  ctx.fillStyle = 'rgba(27,15,37,' + shade + ')';
  ctx.beginPath();
  ctx.ellipse(x, y + 1, w, w * .20, 0, 0, Math.PI * 2);
  ctx.fill();
}

function frameFor(p) {
  const indices = HERO[p.act] || HERO.idle;
  if (p.act === 'walk' || p.act === 'idle')
    return indices[Math.floor(p.phase * (p.act === 'walk' ? 11 : 3)) % indices.length];
  const duration = MOVE_TIME[p.act] || .6;
  return indices[Math.min(indices.length - 1, Math.floor(p.age / duration * indices.length))];
}

function stamp(image, frame, columns, width, height = width) {
  if (!READY(image)) return;
  const cell = image.naturalWidth / columns;
  const left = (frame % columns) * cell;
  const top = Math.floor(frame / columns) * cell;
  const camera = globalThis.DRAGON_SPRITE_CAMERA?.[image.dataset.art];
  const anchor = camera?.anchor ?? ANCHOR / CELL;
  const scale = camera?.scale ?? 1;
  ctx.drawImage(image, left, top, cell, cell, -width * scale / 2, -height * scale * anchor, width * scale, height * scale);
}

function carryPose(p) {
  if (p.act === 'throw') return p.age < .085 ? 5 : 7;
  const item = p.carry || (p.act === 'punch' && p.swing);
  if (!item) return -1;
  if (p.act === 'lift') return p.age < .10 ? 4 : p.age < .18 ? 5 : 6;
  if (p.act === 'block' || p.act === 'dodge') return 14;
  if (p.act === 'jump') return 13;
  if (p.act === 'land') return 4;
  if (p.act === 'hit') return 15;
  if (p.act === 'special' || p.act === 'kick') return -1;
  if (item.kind === 'club') {
    if (p.act === 'punch') return p.age < .15 ? 10 : p.age < .25 ? 11 : 12;
    if (p.act === 'walk') return Math.floor(p.stride / 9) % 2 ? 9 : 8;
    return 8;
  }
  return p.act === 'walk' ? Math.floor(p.stride / 14) % 4 : 6;
}

function drawHeroFrame(p) {
  const hero = p.hero || p.id;
  const carry = images['carry-' + hero];
  const frame = carryPose(p);
  if (frame >= 0 && READY(carry)) {
    stamp(carry, frame, 4, HERO_SIZE);
    return;
  }
  if (p.act === 'throw') {
    stamp(images[hero === 1 ? 'giorgos' : 'thodoris'], p.age < .19 ? 15 : 7, 4, HERO_SIZE);
    return;
  }
  if (p.act === 'punch' || p.act === 'kick') {
    const combat = images['p' + hero + '-combat'];
    if (READY(combat)) {
      const time = Math.floor(p.age / MOVE_TIME[p.act] * STRIKE_FRAMES.length);
      const frame = STRIKE_FRAMES[Math.min(STRIKE_FRAMES.length - 1, time)];
      stamp(combat, frame + (p.act === 'kick' ? 8 : 0), 4, HERO_SIZE);
      return;
    }
  }
  const extra = images['p' + hero + '-motion'];
  const normal = images[hero === 1 ? 'giorgos' : 'thodoris'];
  if (READY(extra)) {
    if (p.act === 'dodge') {
      stamp(extra, p.age < .13 ? 12 : 11, 4, HERO_SIZE);
      return;
    }
    if (p.act === 'walk') {
      stamp(extra, Math.floor(p.stride / 7.5) % 8, 4, HERO_SIZE);
      return;
    }
    const timeline = HERO_MOTION[p.act];
    if (timeline) {
      const duration = MOVE_TIME[p.act] || (p.act === 'jump' ? .77 : .39);
      const frame = timeline[Math.min(timeline.length - 1, Math.floor(p.age / duration * timeline.length))];
      stamp(extra, frame, 4, HERO_SIZE);
      return;
    }
  }
  stamp(normal, frameFor(p), 4, HERO_SIZE);
}

function strikeTrail(p) {
  if (p.act === 'dodge') {
    for (let i = 0; i < 4; i++) {
      ctx.globalAlpha = (1 - p.age / MOVE_TIME.dodge) * (.34 - i * .06);
      pixel(-16 - i * 5, -4 - i * 3, 13, 1, '#d9eedf');
    }
    ctx.globalAlpha = 1;
    return;
  }
  const kick = p.act === 'kick';
  if (!kick && p.act !== 'punch') return;
  const start = kick ? .19 : .115;
  const span = kick ? .22 : .18;
  const at = (p.age - start) / span;
  if (at <= 0 || at >= 1) return;
  const radius = kick ? 24 : p.swing ? 34 : 17;
  const swing = kick ? -2.1 + at * 1.92 : -1.74 + at * 1.05;
  const arc = kick ? 1.06 : .58;
  ctx.save();
  ctx.scale(HERO_SCALE, HERO_SCALE);
  ctx.translate(4, kick ? -19 : -26);
  ctx.lineCap = 'round';
  ctx.globalAlpha = Math.sin(at * Math.PI) * .77;
  ctx.strokeStyle = p.id === 1 ? '#9aeeff' : '#ffcc8d';
  ctx.lineWidth = kick ? 2.1 : 1.6;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * .68, 0, swing, swing + arc);
  ctx.stroke();
  ctx.globalAlpha *= .54;
  ctx.strokeStyle = '#fff3cd';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius + 3, radius * .73, 0, swing + .12, swing + arc * .94);
  ctx.stroke();
  ctx.restore();
}

function drawHero(p) {
  const x = p.x - game.camera;
  const y = p.y - p.z;
  shadow(x, p.y, (p.z > 0 ? 10 : 12) * HERO_SCALE, p.z > 0 ? .28 : .52);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(p.face, 1);
  if (p.inv > 0 && Math.floor(game.clock * 19) % 2) ctx.globalAlpha = .68;
  if (!p.hp) {
    if (!READY(images['p' + (p.hero || p.id) + '-motion'])) ctx.rotate(-1.04 * Math.min(1, p.age * 4));
    ctx.globalAlpha = Math.max(0, 1 - (p.age - .8) * 2);
  }
  const walking = p.act === 'walk';
  if (walking) ctx.translate(0, -Math.abs(Math.sin(p.stride / 30 * Math.PI)) * 1.45);
  if (p.act === 'idle') ctx.translate(0, -Math.round((Math.sin(p.phase * 3.8) + 1) / 2));
  drawHeroFrame(p);
  if (game.fx) strikeTrail(p);
  const held = p.carry || p.toss || (p.act === 'punch' && p.age < .25 ? p.swing : null);
  if (held) drawCarried(p, held);
  ctx.restore();
  if (!p.hp) {
    if (game.two && !game.rescues.has(districtIndex(p.x))) label('ΒΟΗΘΕΙΑ', x, p.y - 12, 7, '#b4ffdf', 'center');
    return;
  }
  const color = COLORS[p.id - 1];
  if (p.act === 'block') {
    ctx.globalAlpha = .43 + Math.sin(game.clock * 16) * .12;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.ellipse(x + p.face * 7 * HERO_SCALE, y - 21 * HERO_SCALE, 12 * HERO_SCALE, 19 * HERO_SCALE, 0, -.9, 1.5);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  if (p.act === 'special' && !p.fired) {
    const charge = 1 + p.age * 37;
    ctx.globalAlpha = Math.min(1, p.age * 6);
    pixel(x + p.face * 19 * HERO_SCALE - charge / 2, y - 26 * HERO_SCALE - charge / 2, charge, charge, color);
    ctx.globalAlpha = 1;
  }
  if (game.two) label('P' + p.id, x, y + 8, 6, color, 'center');
  if (!held && !p.z && (nearbyItem(p) || rescueTarget(p)))
    label(p.id === 1 ? 'U / R1' : 'E / R1', x, y - HERO_SIZE * .94, 7, '#ffe6ae', 'center');
}

function heldPropPose(p, club) {
  const step = p.act === 'walk' ? Math.sin(p.stride * .20) : 0;
  if (p.act === 'lift') {
    const t = clamp(p.age / MOVE_TIME.lift, 0, 1);
    return [mix(10, club ? 14 : 16, t), mix(-6, -25, t * t * (3 - 2 * t)), club ? -.8 * t : 0];
  }
  if (p.act === 'throw') return [mix(9, 25, clamp(p.age / .105, 0, 1)), -25, -.24];
  if (club && p.act === 'punch') {
    if (p.age < .15) return [mix(16, -5, p.age / .15), -29, mix(-.72, -2.12, p.age / .15)];
    if (p.age < .25) return [26, -25, mix(-.26, .46, (p.age - .15) / .10)];
    return [16, -17, .67];
  }
  if (p.act === 'block' || p.act === 'dodge') return [13, -17, club ? -.55 : .14];
  if (p.act === 'jump') return [13, -28, -.20];
  if (p.act === 'land') return [14, -12, .23];
  if (p.act === 'hit') return [8, -22, -.39];
  if (p.act === 'kick') return [12, -25, club ? -.93 : -.15];
  if (p.act === 'special') return [-11, -20, -.53];
  return [club ? 15 + step * 2 : 16, -24 + step, club ? -.81 + step * .17 : step * .045];
}

function drawCarried(p, prop) {
  const item = ITEM[prop.kind];
  const club = prop.kind === 'club';
  const [x, y, turn] = heldPropPose(p, club);
  const size = item.width;
  ctx.save();
  ctx.translate(x * HERO_SCALE, y * HERO_SCALE);
  ctx.rotate(turn);
  ctx.translate(club ? size * .21 : 0, size * (club ? .20 : ANCHOR / CELL - .5));
  stamp(images.items, item.sprite, 5, size);
  ctx.restore();
}

function drawItem(item) {
  const { sprite, width } = ITEM[item.kind];
  const x = item.x - game.camera;
  if (x < -width || x > WIDTH + width) return;
  shadow(x, item.y + 1, width * .31, item.flight ? .24 : .49);
  ctx.save();
  const bob = item.kind === 'apple' || item.kind === 'card' ? 3 + Math.sin(game.clock * 5 + item.x) * 2 : 0;
  ctx.translate(x, item.y - item.z - bob);
  if (item.flight) {
    ctx.rotate(item.flight.spin);
    ctx.translate(0, width * (ANCHOR / CELL - .5));
  }
  if (item.kind === 'debris') ctx.globalAlpha = Math.min(1, item.linger * 1.7);
  if (!item.flight && bob) {
    ctx.shadowColor = item.kind === 'card' ? '#ffcc74' : '#a9ffa0';
    ctx.shadowBlur = 5;
  }
  stamp(images.items, sprite, 5, width);
  ctx.restore();
}

function drawFoe(e) {
  if (e.entry && !e.entry.started) return;
  const x = e.x - game.camera;
  const y = e.y;
  if (x < -e.size || x > WIDTH + e.size) return;
  const attack = e.act === 'attack';
  const wind = e.kit ? e.act === 'tell' : attack && e.age < .36*difficultyRules().tell;
  const stride = e.act === 'walk' ? Math.sin(e.phase * 16) : 0;
  const defeat = e.act === 'fall' ? clamp(e.age * 3.4, 0, 1) : 0;
  if (defeat >= 1) return;
  // Keep ordinary foes compact and let bosses read larger than either hero.
  const size = e.size * (e.boss ? 1.53 : e.rival ? 1.27 : 1.35);
  shadow(x, y, size * Math.max(.14, .26 - (e.z || 0) * .0011), e.z ? .31 : .54);
  if (wind) {
    ctx.globalAlpha = .25 + Math.sin(game.clock * 24) * .13;
    shadow(x, y, e.size * .56, .47);
    ctx.strokeStyle = '#ffcb79';
    ctx.beginPath();
    ctx.ellipse(x, y + 1, e.size * .54, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.save();
  const hover = e.kit?.hover ? Math.sin(e.phase * 6) * 3 : 0;
  const lift = e.hp ? Math.min((e.z || 0) + hover, e.y - size * .84 - 30) : (e.z || 0) * (1 - defeat);
  ctx.translate(x + (attack && !wind ? e.face * 3 : 0), y - Math.abs(stride) * (e.boss ? 1.5 : 2.8) - lift);
  // The atlas for bosses faces left. Regular monsters and heroes face right.
  ctx.scale(e.face * (e.kit ? -1 : 1), 1);
  ctx.rotate(stride * .054 - defeat * 1.27 + (wind && !e.kit ? -.16 : 0));
  if ((e.act === 'hit' && e.age < .09) || e.hurt > 0) ctx.filter = 'brightness(1.7)';
  if (defeat) ctx.globalAlpha = 1 - defeat;
  let frame = e.type;
  if (e.boss && attack && !wind) frame += 5;
  if (!e.kit && e.act === 'walk' && stride > 0) frame += 12;
  if (!e.kit && attack && !wind) frame += 24;
  const motion = images['boss-motion'];
  const signature = { tell: 0, attack: 5, recover: 10, phase: 0 }[e.act];
  if (e.rival) {
    stamp(images.rivals, e.type + (e.act === 'tell' || attack ? 5 : 0), 5, size);
  } else if (e.boss && signature !== undefined && READY(images['special-boss'])) {
    stamp(images['special-boss'], e.type + signature, 5, size);
  } else if (e.boss && READY(motion) && ((e.act === 'walk' && stride > 0) || e.act === 'hit')) {
    stamp(motion, e.type + (e.act === 'hit' ? 5 : 0), 5, size);
  } else {
    stamp(images[e.boss ? 'bosses' : 'foes'], frame, e.boss ? 5 : 4, size, size * (wind && !e.boss ? .93 : 1));
  }
  ctx.restore();
  if (!e.kit && e.hp && (e.guard || e.hp < e.maxHp)) {
    pixel(x - 9, y - e.size - 4, 18, 2, '#261628');
    pixel(x - 9, y - e.size - 4, e.hp / e.maxHp * 18, 2, e.guard ? '#ffe294' : '#ffa873');
  }
}

function groundSigil(x, y, radius, color, progress) {
  ctx.save();
  ctx.fillStyle = color + '22';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.ellipse(x - game.camera, y, radius, radius / 1.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = .8;
  ctx.beginPath();
  ctx.ellipse(x - game.camera, y, radius * progress, radius * progress / 1.8, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function laneWarning(from, to, fromY, toY, color, progress) {
  ctx.save();
  ctx.strokeStyle = color + '56';
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(from - game.camera, fromY);
  ctx.lineTo(to - game.camera, toY);
  ctx.stroke();
  ctx.lineWidth = 1.35;
  ctx.strokeStyle = color;
  ctx.setLineDash([5, 6]);
  ctx.lineDashOffset = -progress * 22;
  ctx.stroke();
  ctx.restore();
}

function drawTells() {
  for (const e of game.enemies) {
    if (!e.hp || !e.move || e.act !== 'tell') continue;
    const { plan, direction, aimY, spots } = e.move;
    const t = clamp(e.age / plan.tell, 0, 1);
    const color = e.kit.color;
    if (plan.form === 'ring') groundSigil(e.x, e.y, plan.radius, color, t);
    if (plan.form === 'leap' || plan.form === 'drop')
      for (const spot of spots) groundSigil(spot.x, spot.y, plan.radius, color, t);
    if (plan.form === 'dash') laneWarning(e.x, arenaX(e.x + direction * plan.speed * plan.active), e.y, aimY, color, t);
    if (plan.form === 'lanes' || plan.form === 'fan') {
      const end = e.x + direction * Math.min(WIDTH + 75, plan.speed * 1.6);
      for (const lane of plan.lanes) {
        if (plan.form === 'lanes') {
          const y = clamp(aimY + lane, ...DEPTH);
          laneWarning(e.x, end, y, y, color, t);
        } else laneWarning(e.x, end, e.y, e.y + lane * 2.65, color, t);
      }
    }
  }
}

function drawEnemyHazard(h) {
  const x = h.x - game.camera;
  const t = h.age / h.life;
  if (h.form === 'ring') {
    groundSigil(h.x, h.y, Math.max(2, h.radius * t), h.color, .91);
    return;
  }
  if (h.form === 'drop') {
    groundSigil(h.x, h.y, h.radius, h.color, Math.min(1, t * 2));
    const fall = Math.max(0, 117 * (1 - h.age / .21));
    if (fall) {
      const height = h.y - fall;
      pixel(x - 3, height - 19, 6, 24, h.color + '93');
      pixel(x - 2, height - 6, 4, 9, '#fff6d6');
    }
    return;
  }
  const y = h.y - h.z;
  const radius = h.radius;
  ctx.save();
  ctx.translate(x, y);
  if (h.art === 'card') {
    ctx.rotate(h.age * Math.sign(h.vx) * 13);
    stamp(images.items, 6, 5, 18);
  } else if (h.art === 'stone') {
    ctx.rotate(h.age * Math.sign(h.vx) * 10);
    pixel(-radius * .72, -radius * .72, radius * 1.44, radius * 1.44, '#8787a1');
    pixel(-radius * .62, -radius * .68, radius * 1.18, 3, h.color);
    pixel(-radius * .51, radius * .2, 7, 2, '#554b6d');
  } else {
    const tail = Math.sign(-h.vx);
    pixel(tail * (radius + 5) - 5, -2, 12, 3, h.color + '75');
    pixel(-radius, -radius * .57, radius * 2, radius * 1.14, h.color);
    pixel(-radius * .52, -radius * .40, radius * .98, radius * .56, '#fff6d7');
    if (h.art === 'star' || h.art === 'spore') pixel(-1, -radius - 3, 2, 5, h.color);
  }
  ctx.restore();
}

function drawEntries() {
  for (const side of ['left', 'right']) {
    const coming = game.enemies.find(e => e.hp && e.entry?.side === side &&
      (e.entry.started ? (side === 'left' ? e.x < game.camera : e.x > game.camera + WIDTH) : !e.entry.wait && e.entry.delay > 0));
    if (!coming) continue;
    const left = side === 'left';
    const x = left ? 15 : WIDTH - 15;
    const y = coming.y - 21 - (coming.z || 0);
    label(left ? '▶' : '◀', x, y, 14, coming.kit?.color || '#ffe4ad', 'center');
  }
}

function drawShot(shot) {
  const x = shot.x - game.camera;
  const y = shot.y;
  const color = shot.owner.id === 1 ? '#5ce8ff' : '#ff9854';
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const glow = ctx.createRadialGradient(x, y, 0, x, y, 22);
  glow.addColorStop(0, '#fff4d5');
  glow.addColorStop(.32, color + 'aa');
  glow.addColorStop(1, color + '00');
  pixel(x - 22, y - 22, 44, 44, glow);
  for (let i = 1; i < 8; i++) {
    ctx.globalAlpha = 1 - i / 9;
    pixel(x - shot.direction * (10 + i * 4), y + Math.sin(game.clock * 38 + i) * 5, 7, 2, color);
  }
  ctx.globalAlpha = 1;
  pixel(x - 9, y - 4, 18, 8, color);
  pixel(x - 4, y - 2, 13, 4, '#fff6df');
  ctx.restore();
}

function drawReward() {
  if (!game.reward) return;
  const x = game.reward.x - game.camera;
  const y = game.reward.y - 23 + Math.sin(game.clock * 6) * 4;
  const final = game.level === STAGES.length - 1;
  pixel(x - 12, y - 13, 24, 25, '#e8985d44');
  pixel(x - 7, y - 8, 14, 16, final ? '#ff9252' : '#ffdc8b');
  pixel(x - 4, y - 5, 8, 8, '#5d435c');
  if (final) {
    pixel(x - 5, y - 10, 3, 2, '#ff9252');
    pixel(x + 2, y - 10, 3, 2, '#ff9252');
    pixel(x - 2, y - 2, 1, 1, '#fff5b8');
    pixel(x + 2, y - 2, 1, 1, '#fff5b8');
  } else label('Y', x, y + 1, 6, '#fff5b8', 'center');
}

function gauge(x, y, width, ratio, color) {
  pixel(x, y, width, 6, '#4c3b54');
  if (ratio > 0) {
    pixel(x + 1, y + 1, Math.max(0, (width - 2) * ratio), 4, color);
    pixel(x + 1, y + 1, Math.max(0, (width - 2) * ratio), 1, '#ffffff55');
  }
}

function hud() {
  pixel(0, 0, WIDTH, 28, '#171322eb');
  pixel(0, 27, WIDTH, 1, '#d0966d');
  for (const p of game.players) {
    const i = p.id - 1;
    const x = i ? 343 : 8;
    const color = COLORS[i];
    const portrait = images[(p.hero || p.id) === 1 ? 'giorgos' : 'thodoris'];
    pixel(x, 4, 18, 19, color);
    pixel(x + 1, 5, 16, 17, '#322639');
    if (READY(portrait)) { const k=portrait.naturalWidth/448; ctx.drawImage(portrait, 35*k, 7*k, 39*k, 40*k, x + 1, 5, 16, 17); }
    label('P'+p.id+' '+((p.hero || p.id)===1?'ΓΙΩΡΓΟΣ':'ΘΟΔΩΡΗΣ'), x + 22, 10, 8, color);
    gauge(x + 22, 12, 103, p.hp / 100, color);
    pixel(x + 23, 20, p.energy, 2, i ? '#ff995f' : '#68d4fb');
    if (p.carry?.kind === 'club') {
      for (let use = 0; use < p.carry.uses; use++) pixel(x + 112 + use * 4, 23, 3, 2, '#ffc17b');
    }
  }
  label(currentStage().name, WIDTH / 2, 10, 8, '#ffda9d', 'center');
  label((game.district + 1) + '/' + DISTRICTS + '   ·   ' + game.score + (game.cards ? '   ✦ ' + game.cards : ''),
    WIDTH / 2, 21, 8, '#f3dce4', 'center');
  const boss = game.enemies.find(e => e.kit && e.hp && !e.storyFoe);
  if (boss) {
    pixel(141, 32, 198, 18, '#1a1426ed');
    if (boss.rival) label(boss.kit.name, WIDTH / 2, 41, 9, boss.kit.color, 'center');
    else {
      label(currentStage().boss, 155, 41, 9, boss.kit.color);
      label('ΦΑΣΗ ' + (boss.phaseIndex + 1) + '/3', 325, 41, 8, '#ffe2b0', 'right');
    }
    gauge(156, 44, 168, boss.hp / boss.maxHp, boss.kit.color);
    if (!boss.rival) {
      for (const threshold of PHASE_MARKS) pixel(157 + threshold * 166, 44, 1, 6, '#21182e');
    }
    const note = boss.act === 'tell' ? boss.move.plan.label :
      boss.rival ? '' : boss.act === 'phase' ? 'ΑΛΛΑΓΗ ΦΑΣΗΣ' : boss.act === 'recover' ? 'ΕΥΚΑΙΡΙΑ!' : '';
    if (note) {
      const width = note.length * 6 + 16;
      pixel((WIDTH - width) / 2, 54, width, 15, '#191629d9');
      label(note, WIDTH / 2, 65, 10, boss.kit.color, 'center');
    }
  } else if (game.gate === 'open') {
    label('AREA CLEAR   GO ▶', WIDTH / 2, 48, 13, '#afffd2', 'center');
  } else if (game.gate === 'fight' && game.timer) {
    label(game.arenaName, WIDTH / 2, 48, 11, '#ffd89b', 'center');
  } else if (game.gate === 'travel' && game.section > 0) {
    label('GO ▶', WIDTH - 15, 47, 10, '#b6f9d3', 'right');
  }
  if (!boss && game.districtTitle && game.gate === 'travel') {
    pixel(131, 35, 218, 20, '#1a1729d9');
    label(DISTRICT_NAMES[game.level][game.district], WIDTH / 2, 48, 11, '#ffdda2', 'center');
  }
  if (game.combo?.count >= 3 && game.combo.until > game.clock) {
    const combo = game.combo;
    label(combo.count + '× COMBO', WIDTH - 13, 64, 12, combo.sources.size > 1 ? '#ffe093' : '#e9d8f6', 'right');
  }
}

function draw() {
  if (game.mode === 'home' || game.mode === 'intro' || game.mode === 'ending') return;
  ctx.save();
  if (game.fx && game.shake) ctx.translate(Math.round(Math.sin(game.clock * 221) * game.shake), 0);
  panorama();
  drawTells();
  const objects = [...game.enemies, ...game.players, ...game.items].sort((a, b) => a.y - b.y);
  for (const object of objects) {
    if (object.id) drawHero(object);
    else if (object.kind) drawItem(object);
    else drawFoe(object);
  }
  closerScenery();
  for (const hazard of game.hazards) drawEnemyHazard(hazard);
  drawEntries();
  for (const shot of game.shots) drawShot(shot);
  drawReward();
  for (const p of game.particles) {
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    pixel(p.x - game.camera, p.y, p.size, p.size, p.color);
  }
  ctx.restore();
  hud();
}

const padHeld = new Set();
const padAim = new Map();
const padStates = new Map();
const PAD_ACTIONS = [[0, 'jump'], [1, 'kick'], [2, 'punch'], [3, 'special'], [5, 'pickup'], [10, 'dodge'], [11, 'dodge']];
let preferredPadPlayer = 1;

function readPads() {
  try {
    return Array.from(navigator.getGamepads?.() || []).filter(pad => pad?.connected && pad.mapping === 'standard');
  } catch {
    return [];
  }
}

function moveMenu(dx, dy) {
  const buttons = Array.from(panel.querySelectorAll('button:not(:disabled)'));
  const current = document.activeElement;
  if (!buttons.includes(current)) return buttons[0]?.focus();
  const center = button => {
    const rect = button.getBoundingClientRect();
    return [rect.x + rect.width / 2, rect.y + rect.height / 2];
  };
  const [x, y] = center(current);
  let best;
  let bestDistance = Infinity;
  for (const button of buttons) {
    const [bx, by] = center(button);
    const forward = (bx - x) * dx + (by - y) * dy;
    if (forward < 6) continue;
    const offAxis = Math.abs((by - y) * dx - (bx - x) * dy);
    const distance = forward + offAxis * 3;
    if (distance < bestDistance) {
      best = button;
      bestDistance = distance;
    }
  }
  best?.focus();
}

function pollPads(time) {
  padHeld.clear();
  padAim.clear();
  if (document.hidden) return;
  const pads = readPads();
  if (game.mode === 'settings' || game.mode === 'how') {
    const status = document.querySelector('#pad-status');
    const message = pads.length > 0
      ? (pads.length === 1 ? '1 χειριστήριο συνδεδεμένο.' : pads.length + ' χειριστήρια συνδεδεμένα.')
      : 'Πάτησε ένα κουμπί στο χειριστήριο για να το αναγνωρίσει ο browser.';
    if (status && status.textContent !== message) status.textContent = message;
  }
  const indices = new Set(pads.map(pad => pad.index));
  for (const index of padStates.keys()) {
    if (!indices.has(index)) padStates.delete(index);
  }
  for (const pad of pads) {
    if (!padStates.has(pad.index)) {
      padStates.set(pad.index, { seat: -1, buttons: [], direction: '', repeatAt: 0 });
    }
  }
  const taken = new Set(Array.from(padStates.values(), state => state.seat));
  for (const state of padStates.values()) {
    if (state.seat >= 0) continue;
    state.seat = [0, 1].find(seat => !taken.has(seat)) ?? -1;
    taken.add(state.seat);
  }
  // If two pads are assigned, newly attached extra pads can only navigate menus.
  const assigned = [false, false];
  let menuHandled = false;
  const mode = game.mode;
  for (const pad of pads) {
    const state = padStates.get(pad.index);
    const buttons = pad.buttons.map(button => button.pressed || button.value >= .45);
    const pressed = index => buttons[index] && !state.buttons[index];
    const x = pad.axes[0] || 0;
    const y = pad.axes[1] || 0;
    const left = buttons[14] || x < -.3;
    const right = buttons[15] || x > .3;
    const up = buttons[12] || y < -.3;
    const down = buttons[13] || y > .3;
    const center = [8, 9, 16].some(pressed) || (/dualsense|dualshock|054c|wireless controller/i.test(pad.id) && pressed(17));
    if (!menuHandled && center && (mode === 'play' || mode === 'pause')) {
      show(mode === 'play' ? 'pause' : 'play');
      menuHandled = true;
    } else if (mode === 'play' && game.mode === 'play') {
      let seat = state.seat;
      if (pads.length === 1) seat = game.two ? preferredPadPlayer - 1 : 0;
      if (!game.two) seat = 0;
      const p = game.players[seat];
      if (p && !assigned[seat]) {
        assigned[seat] = true;
        if (left) padHeld.add(p.id + ':left');
        if (right) padHeld.add(p.id + ':right');
        if (up) padHeld.add(p.id + ':up');
        if (down) padHeld.add(p.id + ':down');
        const rx = pad.axes[2] || 0;
        const ry = pad.axes[3] || 0;
        padAim.set(p.id, { x: Math.abs(rx) > .43 ? Math.sign(rx) : 0, y: Math.abs(ry) > .43 ? Math.sign(ry) : 0 });
        if (buttons[4] || buttons[6] || buttons[7]) padHeld.add(p.id + ':block');
        for (const [index, name] of PAD_ACTIONS) {
          if (pressed(index)) action(p, name);
        }
      }
    } else if (!menuHandled && mode !== 'play') {
      const dx = Number(right) - Number(left);
      const dy = Number(down) - Number(up);
      const direction = dx + ':' + dy;
      if (pressed(0)) {
        const current = document.activeElement;
        if (panel.contains(current) && current.matches('button')) current.click();
        else panel.querySelector('button')?.click();
        menuHandled = true;
      } else if (pressed(1) && ['pause', 'how', 'settings'].includes(mode)) {
        show(mode === 'pause' ? 'play' : previous);
        menuHandled = true;
      } else if ((dx || dy) && (state.direction !== direction || time >= state.repeatAt)) {
        moveMenu(dx, dx ? 0 : dy);
        state.repeatAt = time + (state.direction === direction ? 155 : 285);
        menuHandled = true;
      }
      state.direction = direction;
    }
    state.buttons = buttons;
  }
}

const screen = document.querySelector('#screen');
const panel = document.querySelector('#panel');
const pause = document.querySelector('#pause');
const touch = document.querySelector('#touch');
const PAD_STATUS = '<span class="muted" id="pad-status" aria-live="polite"></span>';
const button = (name, text, primary = false) =>
  '<button type="button" data-go="' + name + '"' + (primary ? ' class="primary"' : '') + '>' + text + '</button>';
const card = (eyebrow, title, text, buttons) =>
  '<div class="frame card"><div class="muted">' + eyebrow + '</div><h2>' + title +
  '</h2><p>' + text + '</p><div class="menu-links">' + buttons + '</div></div>';

const INTRO = [
  ['ΜΙΑ ΙΣΤΟΡΙΑ ΑΚΟΜΑ', '«Διάλεξε μια κάρτα, Θοδωρή. Σήμερα θα ακούσουμε μια καινούργια ιστορία!»', 'Οι δύο ξάδερφοι διαλέγουν κάρτες δίπλα στο πορτοκαλί Yoto.'],
  ['Ο ΝΥΧΤΕΡΙΝΟΣ ΕΠΙΣΚΕΠΤΗΣ', 'Τη νύχτα, δυο τριχωτά χέρια γλίστρησαν από το παράθυρο και πήραν το Yoto μαζί με τις κάρτες.', 'Ο Gruffy σκύβει στο ανοιχτό παράθυρο τη νύχτα.'],
  ['ΕΝΑ ΙΧΝΟΣ', '«Πού είναι το Yoto;» Στη θέση του, ο Γιώργος βρήκε έναν χάρτη που έδειχνε ένα κάστρο.', 'Ο Γιώργος βρίσκει έναν χάρτη στο τραπέζι.'],
  ['ΔΥΟ ΞΑΔΕΡΦΙΑ, ΜΙΑ ΑΠΟΣΤΟΛΗ', '«Από τη γειτονιά μέχρι το κάστρο, πάμε μαζί. Θα βρούμε όλες τις ιστορίες!»', 'Ο Γιώργος και ο Θοδωρής ετοιμάζονται να φύγουν.'],
  ['ΜΙΑ ΙΣΤΟΡΙΑ ΓΙΑ ΟΛΟΥΣ', 'Οι κάρτες και το πορτοκαλί Yoto γύρισαν στα παιδιά. Ο Gruffy ήθελε απλώς να ακούσει μια ιστορία, κι έτσι διάλεξαν την πρώτη όλοι μαζί.', 'Οι δύο ξάδερφοι και ο Gruffy μοιράζονται τις ιστορίες του Yoto.'],
];
const SCENE_STYLES = ['warm', 'moon', 'clue', 'petals', 'gold'];
const SCENE_FOCUS = [[50, 49], [60, 42], [47, 54], [51, 43], [50, 53]];
const CONTROLS = [
  ['Κίνηση', '↑ ← ↓ →', 'W A S D'], ['Γροθιά', 'J', 'F'], ['Κλωτσιά', 'K', 'G'],
  ['Άμυνα (κράτημα)', 'L', 'R'], ['Άλμα', 'Space', 'T'], ['Ενεργειακή βολή', 'H', 'Y'],
  ['Σήκωμα / ρίψη / βοήθεια', 'U', 'E'],
  ['Αποφυγή', 'I', 'Q'],
];
let selectedTwo = false;
let previous = 'home';
let panelIndex = 0;

function comic(index) {
  const [headline, dialogue, description] = INTRO[index];
  const ending = index === INTRO.length - 1;
  const [x, y] = SCENE_FOCUS[index];
  const motes = Array.from({ length: 22 }, (_, i) => {
    const x = (17 + i * 37) % 100;
    const y = 13 + (11 + i * 19) % 87;
    return '<i style="--x:' + x + '%;--y:' + y + '%;--s:' + (2 + i % 5) +
      'px;--delay:' + (-i * .35) + 's;--duration:' + (4 + i % 6) + 's"></i>';
  }).join('');
  return '<article class="frame comic ' + (game.fx ? 'cinematic' : '') + '" data-scene="' + SCENE_STYLES[index] +
    '" style="--scene-x:' + x + '%;--scene-y:' + y + '%"><div class="comic-art"><img src="' + ART['cinema-bg-' + (index + 1)] +
    '" alt="' + description + '"><div class="comic-light" aria-hidden="true"></div><div class="comic-motes" aria-hidden="true">' +
    motes + '</div><div class="comic-wipe" aria-hidden="true"></div></div><div class="comic-copy"><h2>' + headline + '</h2><p>' + dialogue +
    '</p><div class="comic-nav"><span class="muted">' +
    (ending ? 'Τελικό σκορ ' + game.score : (index + 1) + ' / 4') + '</span>' +
    button(ending ? 'home' : 'nextIntro', ending ? 'ΑΡΧΙΚΟ ΜΕΝΟΥ' : index === 3 ? 'ΠΑΜΕ! ▶' : 'ΣΥΝΕΧΕΙΑ ▶', true) +
    '</div></div></article>';
}

function show(page) {
  game.mode = page;
  keys.clear();
  padHeld.clear();
  padAim.clear();
  screen.hidden = page === 'play';
  pause.hidden = touch.hidden = page !== 'play';
  screen.dataset.page = page;
  syncAudio();
  audioScene(page === 'intro' ? panelIndex : page === 'ending' ? INTRO.length - 1 : null);
  if (page === 'play') {
    canvas.focus({ preventScroll: true });
    return;
  }
  const stage = currentStage();
  const number = (game.level + 1) + ' / ' + STAGES.length;
  switch (page) {
    case 'home':
      panel.innerHTML = '<h1 class="logo">LITTLE<br>DRAGON ’96</h1><p class="subtitle">YOTO QUEST</p>' +
        '<div class="menu-main">' + button('two', '▶ 2 ΠΑΙΚΤΕΣ', true) +
        button('one', '▶ 1 ΠΑΙΚΤΗΣ') + '</div><div class="menu-links">' +
        button('how', 'ΟΔΗΓΙΕΣ') + button('settings', 'ΡΥΘΜΙΣΕΙΣ') + button('full', '⛶ ΠΛΗΡΗΣ ΟΘΟΝΗ') + '</div>';
      break;
    case 'intro':
      panel.innerHTML = comic(panelIndex);
      break;
    case 'ending':
      panel.innerHTML = comic(INTRO.length - 1);
      break;
    case 'stage':
      panel.innerHTML = card('ΠΙΣΤΑ ' + number, stage.name,
        stage.subtitle + '<br><span class="hero-select">' + (game.two ? 'Γιώργος + Θοδωρής' : 'Γιώργος') + '</span>' +
        (game.entry ? '<br><span class="muted">Συνέχεια από το τμήμα ' + (game.district + 1) + '/4</span>' :
          game.level === 0 ? '<br><span class="muted">Σήκωσε και πέτα αντικείμενα με U / E ή R1.</span>' : ''),
        button('resume', '▶ ΠΑΜΕ!', true));
      break;
    case 'clear':
      panel.innerHTML = card('ΠΙΣΤΑ ' + number, 'ΜΠΡΑΒΟ!', 'Ανακτήσατε<br><strong>' + stage.reward +
        '</strong><br>Κρυμμένες κάρτες ' + game.cards + ' · Σκορ ' + game.score,
        button('nextStage', game.level === 4 ? 'ΤΟ ΦΙΝΑΛΕ ▶' : 'ΕΠΟΜΕΝΗ ΠΙΣΤΑ ▶', true));
      break;
    case 'lose':
      panel.innerHTML = card('ΠΙΣΤΑ ' + number, 'ΑΛΛΗ ΜΙΑ ΦΟΡΑ;', 'Οι ήρωες χρειάζονται λίγη ξεκούραση.',
        button('retry', 'ΞΑΝΑΠΡΟΣΠΑΘΗΣΕ', true) + button('home', 'ΑΡΧΙΚΗ'));
      break;
    case 'pause':
      panel.innerHTML = card(stage.name, 'ΠΑΥΣΗ', '',
        button('resume', 'ΣΥΝΕΧΕΙΑ', true) + button('how', 'ΟΔΗΓΙΕΣ') + button('settings', 'ΡΥΘΜΙΣΕΙΣ') + button('home', 'ΑΡΧΙΚΗ'));
      break;
    case 'settings':
      panel.innerHTML = card('', 'ΡΥΘΜΙΣΕΙΣ', PAD_STATUS,
        button('music', 'ΜΟΥΣΙΚΗ ' + (game.music ? 'ON' : 'OFF')) +
        button('sound', 'ΗΧΗΤΙΚΑ ΕΦΕ ' + (game.sound ? 'ON' : 'OFF')) + button('fx', 'CRT / ΕΦΕ ' + (game.fx ? 'ON' : 'OFF')) +
        button('pad', '1 ΧΕΙΡΙΣΤΗΡΙΟ → P' + preferredPadPlayer) +
        button('full', '⛶ ΠΛΗΡΗΣ ΟΘΟΝΗ') + button('back', 'ΠΙΣΩ'));
      break;
    case 'how':
      panel.innerHTML = '<div class="frame card"><h2>ΧΕΙΡΙΣΜΟΣ</h2><table class="controls"><thead><tr><th scope="col">Κίνηση</th>' +
        '<th scope="col">Γιώργος</th><th scope="col">Θοδωρής</th></tr></thead><tbody>' +
        CONTROLS.map(([label, p1, p2]) => '<tr><th scope="row">' + label + '</th><td>' + p1 + '</td><td>' + p2 + '</td></tr>').join('') +
        '</tbody></table><p><br><strong>PS5 DualSense</strong><br>Αριστερός μοχλός ή σταυρός για κίνηση · δεξιός μοχλός για στόχευση · □ γροθιά · ○ κλωτσιά · × άλμα · △ βολή · L1 / L2 / R2 άμυνα · R1 σήκωμα / ρίψη · L3 / R3 αποφυγή · Options παύση.</p>' +
        '<p>Με ρόπαλο στο χέρι, το κουμπί γροθιάς κάνει χτύπημα με ρόπαλο.</p>' +
        '<p>Στις Ρυθμίσεις μπορείς να το ορίσεις για τον P2.</p><p>' + PAD_STATUS + '</p>' +
        '<div class="menu-links">' + button('back', 'ΠΙΣΩ', true) + '</div></div>';
      break;
  }
  panel.querySelector('button')?.focus({ preventScroll: true });
}

function go(name) {
  unlockSound();
  effect('select');
  switch (name) {
    case 'two':
    case 'one':
      selectedTwo = name === 'two';
      panelIndex = 0;
      show('intro');
      break;
    case 'nextIntro':
      panelIndex += 1;
      if (panelIndex === 4) start(selectedTwo);
      else show('intro');
      break;
    case 'resume':
      show('play');
      break;
    case 'nextStage':
      if (game.level === STAGES.length - 1) show('ending');
      else {
        game.level += 1;
        beginStage();
      }
      break;
    case 'retry':
      beginStage(true);
      break;
    case 'how':
    case 'settings':
      previous = game.mode;
      show(name);
      break;
    case 'back':
      show(previous);
      break;
    case 'sound':
      game.sound = !game.sound;
      unlockSound();
      show('settings');
      panel.querySelector('[data-go="sound"]').focus();
      break;
    case 'music':
      game.music = !game.music;
      unlockSound();
      show('settings');
      panel.querySelector('[data-go="music"]').focus();
      break;
    case 'fx':
      game.fx = !game.fx;
      show('settings');
      break;
    case 'pad':
      preferredPadPlayer = preferredPadPlayer === 1 ? 2 : 1;
      show('settings');
      panel.querySelector('[data-go="pad"]').focus();
      break;
    case 'full':
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else document.documentElement.requestFullscreen?.().catch(() => {});
      break;
    case 'home':
      show('home');
      break;
  }
}

const KEY_MAP = {
  ArrowUp: '1:up', ArrowDown: '1:down', ArrowLeft: '1:left', ArrowRight: '1:right',
  KeyJ: '1:punch', KeyK: '1:kick', KeyL: '1:block', Space: '1:jump', KeyH: '1:special', KeyU: '1:pickup', KeyI: '1:dodge',
  KeyW: '2:up', KeyS: '2:down', KeyA: '2:left', KeyD: '2:right',
  KeyF: '2:punch', KeyG: '2:kick', KeyR: '2:block', KeyT: '2:jump', KeyY: '2:special', KeyE: '2:pickup', KeyQ: '2:dodge',
};
const ACTIONS = ['punch', 'kick', 'jump', 'special', 'pickup', 'dodge'];
function press(key) {
  if (!keys.has(key)) {
    const [id, name] = key.split(':');
    const p = game.players[Number(id) - 1];
    if (p && ACTIONS.includes(name)) action(p, name);
    keys.add(key);
  }
}

panel.addEventListener('click', (event) => {
  const selected = event.target.closest('[data-go]');
  if (selected) go(selected.dataset.go);
});
pause.addEventListener('click', () => show('pause'));
document.addEventListener('pointerdown', unlockSound, { passive: true });
document.querySelector('#enable-audio').addEventListener('click', unlockSound);
window.addEventListener('keydown', (event) => {
  if (!event.repeat) unlockSound();
  if (event.code === 'Escape') {
    event.preventDefault();
    if (event.repeat) return;
    if (game.mode === 'play') show('pause');
    else if (game.mode === 'pause') show('play');
    else if (game.mode === 'how' || game.mode === 'settings') show(previous);
    return;
  }
  const key = KEY_MAP[event.code];
  if (key && game.mode === 'play') {
    event.preventDefault();
    press(key);
  }
});
window.addEventListener('keyup', (event) => keys.delete(KEY_MAP[event.code]));
window.addEventListener('blur', () => keys.clear());
for (const control of touch.querySelectorAll('[data-key]')) {
  const key = '1:' + control.dataset.key;
  control.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    control.setPointerCapture(event.pointerId);
    press(key);
  });
  control.addEventListener('lostpointercapture', () => keys.delete(key));
}

screen.style.setProperty('--scene', 'url("' + ART.cover + '")');
show('home');
let lastFrame = 0;
function frame(time) {
  const dt = Math.min(.032, (time - lastFrame) / 1000);
  lastFrame = time;
  pollPads(time);
  update(dt);
  tickAudio();
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
