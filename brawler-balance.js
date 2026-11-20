'use strict';
// Formation slots change arrival order, not the identity/health of a learned enemy type.
const balanceEncounter=startEncounter;
startEncounter=function(){balanceEncounter();if(game.gate==='fight')for(const e of game.enemies)if(e.brawl){const cap=Math.round(FOES[e.type][0]*(game.two?1.16:1)*difficultyRules().enemyHealth);e.hp=Math.min(e.hp,cap);e.maxHp=cap;e.size=FOES[e.type][2];e.speed=FOES[e.type][1]*difficultyRules().speed;e.guard=e.brawl.shield}};
const balanceDamage=damage;
damage=function(e,p,n,hits,direction,source){const hp=e.hp;balanceDamage(e,p,n,hits,direction,source);if(hp>0&&e.hp===0&&e.rival&&!e.storyFoe&&!e.boss&&!e.rivalPrize){e.rivalPrize=true;game.items.push(makeItem(game.level%2?'lifeCharm':'maxHeart',e.x,e.y))}};
