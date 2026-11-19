'use strict';
STAGES.push({name:chapterText('ΤΟ ΠΑΓΩΜΕΝΟ ΠΕΡΑΣΜΑ','THE FROZEN PASS','КРИЖАНИЙ ПЕРЕВАЛ'),subtitle:chapterText('Ζεστά σημάδια μέσα στη χιονοθύελλα','Warm signs in the blizzard','Теплі знаки в хуртовині'),boss:chapterText('Κρυστάλλινος Αίγαγρος','Crystal Ibex','Кришталевий козеріг'),reward:chapterText('Η σφραγίδα της γέφυρας','The bridge seal','Печатка мосту'),foes:[]});
DISTRICT_NAMES.push(['Το πέτρινο καταφύγιο','Ο φάρος του χιονιού','Η γέφυρα των ανέμων','Η πύλη πάνω από τα σύννεφα'].map((s,i)=>chapterText(s,['The stone refuge','The snow beacon','Bridge of winds','Gate above the clouds'][i],['Кам’яний прихисток','Сніговий маяк','Міст вітрів','Брама над хмарами'][i])));
CONTAINERS.push('crate');AMBIENT.push('#acdfff');
SOUNDTRACK.push({...SOUNDTRACK[2],title:'Το ζεστό φυλαχτό',root:54,bpm:96});
hdSceneKeys.push('frost');hdProfiles.push({sky:['#15294e','#587895','#c8dbe6'],hill:'#536b89',mist:'169,207,228',light:'255,207,139',fog:.19});hdFixtures.push([]);
groundTheme.push([8,11,12,13]);GROUND_DETAILS.push([]);roadCache.push([]);LAYOUT_BENCH.push(5);LAYOUT_PLANTER.push(null);
LOCAL_VOICES.push([
 chapterText('Φύλακας καταφυγίου','Refuge keeper','Доглядач прихистку'),
 chapterText('Το ζεστό φυλαχτό δεν είναι διακοσμητικό. Πλησιάστε τα μαγκάλια.','The warm amulet is no decoration. Stay near the braziers.','Теплий амулет не для краси. Тримайтесь біля жарівень.'),
 chapterText('Ο ορειβάτης χάθηκε όταν έσβησε ο φάρος.','The mountaineer got lost when the beacon went out.','Альпініст загубився, коли згас маяк.'),
 chapterText('Περπατήστε χαμηλότερα όταν φυσά. Ο πάγος ψηλά γλιστρά περισσότερο.','Use the lower trail in the wind. The upper ice is less forgiving.','Під час вітру йдіть нижньою стежкою. Крига вгорі підступніша.'),
 chapterText('Ο αίγαγρος φυλάει τη γέφυρα για όποιον χρειάζεται βοήθεια.','The ibex keeps the bridge for those who need help.','Козеріг береже міст для тих, кому потрібна допомога.')]);
CHAPTER_REVEALS.push([STAGES[5].name,LOCAL_VOICES[5][1]]);
const NEW_FOE_NAMES=[
 ['Παγογκόλεμ','Ice Golem','Крижаний голем'],['Κουκουβάγια του χιονιού','Snow Owl','Снігова сова'],['Καβουροπειρατής','Pirate Crab','Краб-пірат'],['Χταπόδι λοστρόμος','Octopus Boatswain','Восьминіг-боцман'],['Γλάρος σκοπός','Gull Lookout','Чайка-дозорець'],['Ψαροναύτης','Fish Sailor','Риба-матрос'],['Αλεπού αγγελιοφόρος','Fox Messenger','Лис-посланець'],['Σκαντζόχοιρος φρουρός','Hedgehog Watchman','Їжак-вартовий'],['Φύλακας βελανιδιού','Acorn Guardian','Жолудевий вартовий'],['Δεντροβοσκός','Tree Shepherd','Деревний пастух'],['Σκαθάρι ταχυδρόμος','Beetle Courier','Жук-листоноша'],['Πέτρινη γκαργκόιλ','Stone Gargoyle','Кам’яна горгулья'],['Χάλκινο αυτόματο','Bronze Automaton','Бронзовий автоматон'],['Άρπυια του ανέμου','Wind Harpy','Вітряна гарпія'],['Χρυσός σκαραβαίος','Golden Scarab','Золотий скарабей'],['Ζωντανό βιβλίο','Living Book','Жива книга'],['Κηροκαλικάντζαρος','Wax Goblin','Восковий гоблін'],['Γελωτοποιός','Jester','Блазень'],['Κουρδιστό ποντίκι','Clockwork Mouse','Заводна миша'],['Λαγός του χιονιού','Snow Hare','Сніговий заєць']
].map(t=>chapterText(...t));
const NEW_FOE_ROLES=['ring','fan','dash','drop','lanes','dash','dash','ring','ring','drop','dash','leap','ring','fan','drop','fan','drop','leap','dash','leap'];
const roleNames={ring:chapterText('Κύκλος φύλακα','Guardian circle','Коло вартового'),fan:chapterText('Μαγική βεντάλια','Magic fan','Магічне віяло'),dash:chapterText('Γρήγορο πέρασμα','Quick dash','Швидкий ривок'),drop:chapterText('Πρόσεχε το σημάδι','Watch the marker','Стежте за міткою'),lanes:chapterText('Σήμα στο πέρασμα','Passage signal','Сигнал у проході'),leap:chapterText('Άλμα από μακριά','A distant leap','Далекий стрибок')};
NEW_FOE_NAMES.forEach((name,i)=>{
 const type=20+i,form=NEW_FOE_ROLES[i],size=[34,29,29,32,27,29,29,29,27,35,27,34,34,31,30,28,28,29,25,29][i],hp=[52,34,44,45,29,38,34,45,42,60,34,58,62,39,44,36,35,39,30,37][i];
 FOES.push([hp,form==='dash'?62:form==='ring'?37:45,size,form==='fan'||form==='drop'?'ranged':'flank']);FAIRY_NAMES.push(name);MOTION_FOES.add(type);
 const color=['#a9e9ff','#e7e8fc','#ffbd85','#cea8ff','#e3f5ff'][i%5],art=[20,21,39].includes(type)?'water':form==='fan'?'magic':form==='drop'?'stone':form==='ring'?'root':'claw';
 const first=strike(roleNames[form],form,.88,.43,1.0,{range:form==='ring'?58:145,radius:form==='ring'?48:30,speed:form==='dash'?222:145,height:42,lanes:form==='fan'?[-13,0,13]:[0],count:form==='drop'?2:1,art});
 const secondForm=form==='dash'?'ring':form==='ring'?'drop':'dash',second=strike(roleNames[secondForm],secondForm,1.05,.38,1.25,{radius:34,speed:175,height:35,count:1,lanes:[0],art});
 FAIRY_KITS.push({name,color,range:form==='ring'||form==='dash'?63:150,moves:{first,second},order:['first','second'],phases:[['first','second']],hover:0,armor:type===32});
});
const LOCAL_NEW_ROSTERS=[[26,27,28,30,32,35,37,38],[22,23,24,25,26,30,33,38],[21,26,27,28,29,30,33,39],[29,30,31,32,33,34,35,38],[21,26,31,32,35,36,37,38],[20,21,27,29,31,33,38,39]];
STAGES.forEach((s,i)=>{const old=i===5?[11,13,17,18,19,6,10,16]:s.foes;s.foes=old.flatMap((t,n)=>[t,LOCAL_NEW_ROSTERS[i][n]])});
const iceMoves={
 fan:strike(chapterText('Ανάσα παγωμένων κρυστάλλων','Crystal breath','Кришталевий подих'),'fan',.95,.44,.95,{lanes:[-16,0,16],speed:160,art:'water'}),
 drop:strike(chapterText('Κρύσταλλοι στο μονοπάτι','Crystals on the trail','Кристали на стежці'),'drop',1.1,.34,1.0,{count:2,radius:29,art:'water'}),
 leap:strike(chapterText('Άλμα του αίγαγρου','Ibex leap','Стрибок козерога'),'leap',.95,.7,.9,{radius:46,height:62,art:'water'}),
 ring:strike(chapterText('Παγωμένος κύκλος','Frozen circle','Крижане коло'),'ring',1.0,.45,.9,{radius:83,art:'water'})};
BOSS_KITS.push({color:'#b3e7ff',hp:282,size:63,pace:48,range:148,phases:[['fan'],['drop','fan'],['leap','ring','fan']],moves:iceMoves});
RIVAL_KITS.push({color:'#d5e9ff',hp:116,size:41,pace:58,range:135,phases:[['fan','leap']],moves:iceMoves});
ARENA_RUNS.push(['patrol','pincer','duel','relay','rush','guard','cross','rival','relay','rush','pincer','duel','guard','cross','siege']);
DIRECTOR_PLAN.push(['door','work','cover','rope','door','vehicle','work','rival','door','cover','rope','work','door','vehicle','cover','boss']);DIRECTOR_TYPES.push(20);
DIRECTOR_CAPTIONS.push({door:STAGES[5].subtitle,work:CHAPTERS[5][4].title,rope:CHAPTERS[5][10].title,cover:CHAPTERS[5][12].title,vehicle:CHAPTERS[5][13].title});
// Keep the five actual arrival methods, now attached to story causes rather than repeated fights.
CHAPTERS.forEach((beats,level)=>{let n=0;for(const beat of beats)DIRECTOR_PLAN[level][beat.section]=beat.kind==='fight'?['door','work','rope','cover','vehicle'][n++]:beat.kind==='rival'?'rival':beat.kind==='boss'?'boss':'quiet'});
for(const f of Object.values(FORMATIONS)){while(f.slots.filter(s=>s[3]!=='help').length<3)f.slots.push(['left',227,.55])}
const campaignSpecialEnemy=specialEnemy;
specialEnemy=function(level,x,y,rival=false){const e=campaignSpecialEnemy(level,x,y,rival);if(level===5)e.frostBoss=true;return e};
const campaignFoeFrame=foeMotionFrame;
foeMotionFrame=function(e){if(e.type<20&&!e.frostBoss)return campaignFoeFrame(e);if(e.act==='walk')return Math.floor((e.stride||0)/Math.max(3.5,e.size*.15))%8;return ({idle:8,tell:9,phase:9,attack:10,recover:11,block:12,hit:13,fall:14})[e.act]??15};
const campaignDrawFoe=drawFoe;
drawFoe=function(e){if(!e.frostBoss)return campaignDrawFoe(e);if(e.entry&&!e.entry.started)return;const im=images['frost-boss'];if(!READY(im))return;const m=DRAGON_CAMPAIGN_META.foes.boss,h=e.size*m.scale,sw=im.naturalWidth/4,sh=im.naturalHeight/4,f=foeMotionFrame(e),fall=e.act==='fall'?clamp(e.age*3.4,0,1):0;if(fall>=1)return;shadow(e.x-game.camera,e.y,h*.20,.4);ctx.save();ctx.translate(e.x-game.camera,e.y-e.z);ctx.scale(e.face,1);ctx.globalAlpha=1-fall;ctx.drawImage(im,f%4*sw,Math.floor(f/4)*sh,sw,sh,-h*sw/sh*m.center,-h*m.anchor,h*sw/sh,h);ctx.restore()};
