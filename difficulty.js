'use strict';
const DIFFICULTIES=Object.freeze({
 easy:Object.freeze({name:'ΕΥΚΟΛΟ',mark:'I',tag:'Η ιστορία σε περιμένει',description:'Πιο ήπιες μάχες, περισσότερο περιθώριο αντίδρασης και περισσότερη ανάκτηση.',rules:Object.freeze({enemyHealth:.70,bossHealth:.78,incoming:.60,speed:.90,rest:1.25,tell:1.25,energy:10,stageHealth:100,gateHeal:16,appleHeal:44})}),
 normal:Object.freeze({name:'ΚΑΝΟΝΙΚΟ',mark:'II',tag:'Η αρχική περιπέτεια',description:'Η αρχική ισορροπία. Μάθε τις κινήσεις, συνδύασε επιθέσεις και παίξε έξυπνα.',rules:BASE_DIFFICULTY}),
 hard:Object.freeze({name:'ΔΥΣΚΟΛΟ',mark:'III',tag:'Απέδειξε την τέχνη σου',description:'Πιο ανθεκτικοί αντίπαλοι, πιο δυνατά χτυπήματα και λιγότερος χρόνος αντίδρασης.',rules:Object.freeze({enemyHealth:1.25,bossHealth:1.20,incoming:1.35,speed:1.08,rest:.88,tell:.88,energy:7,stageHealth:60,gateHeal:5,appleHeal:24})})
});
let selectedDifficulty='normal';
try{const saved=localStorage.getItem('little-dragon-difficulty');if(Object.hasOwn(DIFFICULTIES,saved))selectedDifficulty=saved}catch{}
game.difficulty='normal';
globalThis.DragonDifficulty={profiles:DIFFICULTIES,rules:()=>DIFFICULTIES[game.difficulty]?.rules||BASE_DIFFICULTY};
function difficultyScreen(){return `<div class="difficulty-screen"><span class="eyebrow">${selectedTwo?'ΔΥΟ ΠΑΙΚΤΕΣ · ΜΙΑ ΟΜΑΔΑ':'ΕΝΑΣ ΠΑΙΚΤΗΣ · ΜΙΑ ΑΠΟΣΤΟΛΗ'}</span><h2>ΔΙΑΛΕΞΕ ΠΡΟΚΛΗΣΗ</h2><p class="difficulty-intro">Η ίδια περιπέτεια. Με τον δικό σου ρυθμό.</p><div class="difficulty-options" role="group" aria-label="Επίπεδο δυσκολίας">${Object.entries(DIFFICULTIES).map(([key,p])=>`<button data-go="difficulty-${key}" class="difficulty-choice ${key===selectedDifficulty?'primary selected':''}" aria-label="${p.name}. ${p.description}"><span class="difficulty-mark" aria-hidden="true">${p.mark}</span><b>${p.name}</b><strong>${p.tag}</strong><span>${p.description}</span></button>`).join('')}</div><button class="back-command" data-go="back">↩ ΑΡΧΙΚΟ ΜΕΝΟΥ</button></div>`}
const difficultyShow=show;
show=function(page){difficultyShow(page);if(page==='difficulty'){panel.innerHTML=difficultyScreen();screen.setAttribute('aria-label','Επιλογή δυσκολίας');hdFocus('difficulty-'+selectedDifficulty)}else if(['stage','pause','lose','clear'].includes(page)){const badge=panel.querySelector('.card>.muted');if(badge)badge.textContent+=' · '+DIFFICULTIES[game.difficulty].name}};
const difficultyGo=go;
go=function(name){
 if(name==='one'||name==='two'){selectedTwo=name==='two';show('difficulty');return}
 if(name.startsWith('difficulty-')){const key=name.slice(11);if(!Object.hasOwn(DIFFICULTIES,key))return;selectedDifficulty=key;game.difficulty=key;try{localStorage.setItem('little-dragon-difficulty',key)}catch{}panelIndex=0;unlockSound();effect('select');show('intro');return}
 difficultyGo(name);
};
