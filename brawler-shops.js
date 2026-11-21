'use strict';
Object.assign(ARCADE_ICONS,{shopHealth:'M13 24 3 14C-5 3 8-2 13 6 18-2 31 3 23 14ZM13 10v9m-4-4h8',shopEnergy:'M15 1 4 16h8l-1 11 12-16h-9z',shopClub:'M5 24 2 21 12 9C17-4 28 0 22 10L8 23zM11 12l5 5'});
game.coins=0;let shopHero=null,shopVendor=null;
const SHOP_LABEL=chapterText('ΜΙΚΡΟ ΜΑΓΑΖΙ','LITTLE SHOP','КРАМНИЧКА');
const SHOP_COIN=chapterText('ΝΟΜΙΣΜΑΤΑ','COINS','МОНЕТИ');
const SHOP_GOODS=[
 {id:'health',cost:4,title:chapterText('ΖΩΗ +50','HEALTH +50','ЗДОРОВ’Я +50'),icon:'shopHealth',full:p=>p.hp>=p.maxHp,buy:p=>p.hp=Math.min(p.maxHp,p.hp+50)},
 {id:'energy',cost:3,title:chapterText('ΕΝΕΡΓΕΙΑ +60','ENERGY +60','ЕНЕРГІЯ +60'),icon:'shopEnergy',full:p=>p.energy>=100,buy:p=>p.energy=Math.min(100,p.energy+60)},
 {id:'club',cost:5,title:chapterText('ΚΑΙΝΟΥΡΙΟ ΡΟΠΑΛΟ','NEW CLUB','НОВА БИТКА'),icon:'shopClub',full:p=>!!p.carry&&(p.carry.kind!=='club'||p.carry.uses>=4),buy:p=>p.carry=makeItem('club',p.x,p.y)}
];
const shopStart=start;
start=function(two){return Promise.resolve(shopStart(two)).then(()=>{if(game.mode==='stage')brawlTaught.clear()})};
function shopMarkup(){return `<div class="card shop-card"><p>${SHOP_LABEL}</p><h2>${game.coins} ${SHOP_COIN}</h2><div class="shop-goods">${SHOP_GOODS.map(g=>`<button class="arcade-command" data-go="buy-${g.id}" ${game.coins<g.cost||g.full(shopHero)?'disabled':''}>${arcadeGlyph(g.icon)}<b>${g.title}</b><strong>● ${g.cost}</strong></button>`).join('')}</div>${arcadeButton('shop-close',chapterText('ΠΙΣΩ ΣΤΗ ΔΡΑΣΗ','BACK TO ACTION','НАЗАД ДО БОЮ'),'back','primary')}</div>`}
chapterText('ΠΙΣΩ ΣΤΗ ΔΡΑΣΗ','BACK TO ACTION','НАЗАД ДО БОЮ');
const shopShow=show;
show=function(page){shopShow(page);if(page==='shop'){panel.innerHTML=shopMarkup();screen.setAttribute('aria-label',SHOP_LABEL);panel.querySelector('button:not(:disabled)')?.focus({preventScroll:true})}};
const shopBack=hdBack;
hdBack=function(){if(game.mode==='shop'){show('play');return}shopBack()};
const shopGo=go;
go=function(name){if(name==='shop-close'){show('play');return}if(name.startsWith('buy-')&&game.mode==='shop'){const g=SHOP_GOODS.find(g=>g.id===name.slice(4));if(g&&game.coins>=g.cost&&!g.full(shopHero)){spendCoins(g.cost);g.buy(shopHero);effect('pickup',shopHero.id);show('shop')}return}return shopGo(name)};
talkTown=function(v){if(game.gate==='fight')return;shopVendor=v;shopHero=game.players.filter(p=>p.hp).sort((a,b)=>Math.abs(a.x-v.x)-Math.abs(b.x-v.x))[0];if(shopHero)show('shop')};
const shopUpdate=update;
update=function(dt){shopUpdate(dt);if(game.mode!=='play')return;for(const i of [...game.items])if(i.kind==='coinCache'&&!i.gone&&!i.flight&&game.players.some(p=>p.hp&&p.z<16&&Math.hypot(p.x-i.x,(p.y-i.y)*1.3)<27)){grantCoins(i.tokenValue||3);i.gone=true;game.items=game.items.filter(o=>o!==i);effect('pickup')}
 const v=nearestSpeaker(game.players[0]);if(v&&mobileMatch.matches){const b=touch.querySelector('.pickup');if(b){b.hidden=false;b.disabled=false;b.querySelector('small').textContent=SHOP_LABEL}}};
const shopPickup=pickupAction;
pickupAction=function(p){const v=nearestSpeaker(p);if(v&&game.gate!=='fight'&&p.z<12&&!MOVE_TIME[p.act]){shopVendor=v;shopHero=p;show('shop');return}const i=nearbyItem(p);if(i?.kind==='coinCache'&&!p.carry&&p.z<12){grantCoins(i.tokenValue||3);i.gone=true;game.items=game.items.filter(o=>o!==i);effect('pickup');return}shopPickup(p)};
const shopHud=hud;
hud=function(){shopHud();if(game.mode==='play'){pixel(WIDTH-72,73,64,12,'#142337dd');label('● '+game.coins,WIDTH-13,82,7,'#ffdf92','right')}};

const shopDamage=damage;
damage=function(e,p,n,hits,direction,source){const hp=e.hp;shopDamage(e,p,n,hits,direction,source);if(hp>0&&e.hp===0&&!e.boss&&!e.coinDropped){e.coinDropped=true;game.items.push({...makeItem('coinCache',e.x,e.y),tokenValue:e.rival&&!e.storyFoe?2:1})}};
