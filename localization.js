'use strict';
// Canonical Greek remains in game state. Localization happens before text layout/rendering.
const LANGUAGES=[{id:'el',name:'ΕΛΛΗΝΙΚΑ'},{id:'en',name:'ENGLISH'},{id:'uk',name:'УКРАЇНСЬКА'}];
let language='el',languageOrigin='home';
try{const saved=localStorage.getItem('little-dragon-language'),query=new URL(location.href).searchParams.get('lang');const initial=saved||query;if(LANGUAGES.some(l=>l.id===initial))language=initial}catch{}
const extraLocale={PLAYER:['ΠΑΙΚΤΗΣ','PLAYER','ГРАВЕЦЬ'],'AREA CLEAR   GO ▶':['ΠΕΡΙΟΧΗ ΚΑΘΑΡΗ · ΠΡΟΧΩΡΑ ▶','AREA CLEAR · GO ▶','ЗОНУ ОЧИЩЕНО · ВПЕРЕД ▶'],'GO ▶':['ΠΡΟΧΩΡΑ ▶','GO ▶','ВПЕРЕД ▶'],COMBO:['ΣΕΡΙ','COMBO','КОМБО'],'FILM GRAIN':['ΥΦΗ ΦΙΛΜ','FILM GRAIN','ЗЕРНИСТІСТЬ'],'PRESS A / ×':['ΠΑΤΑ A / ×','PRESS A / ×','НАТИСНИ A / ×']};
const regexSlash=String.fromCharCode(92);
const escapePattern=s=>Array.from(s).map(c=>'^$.*+?()[]{}|'.includes(c)||c===regexSlash?regexSlash+c:c).join('');
const translationKeys=[...Object.keys(DRAGON_LOCALES),...Object.keys(extraLocale)].sort((a,b)=>b.length-a.length);
const translationPattern=new RegExp('(?<!['+regexSlash+'p{L}])(?:'+translationKeys.map(escapePattern).join('|')+')(?!['+regexSlash+'p{L}])','gu');
const translationCache={el:new Map(),en:new Map(),uk:new Map()};
function translationValue(key){if(extraLocale[key])return extraLocale[key][{el:0,en:1,uk:2}[language]];return language==='el'?key:DRAGON_LOCALES[key]?.[language==='en'?0:1]??key}
function translate(value){const source=String(value??''),cache=translationCache[language];if(cache.has(source))return cache.get(source);const trimmed=source.trim();let result;
 if(Object.hasOwn(DRAGON_LOCALES,trimmed)||Object.hasOwn(extraLocale,trimmed))result=source.slice(0,source.indexOf(trimmed))+translationValue(trimmed)+source.slice(source.indexOf(trimmed)+trimmed.length);
 else result=source.replace(translationPattern,key=>translationValue(key));
 if(cache.size>4096)cache.clear();cache.set(source,result);return result;
}
const textOrigins=new WeakMap(),attributeOrigins=new WeakMap();
function localizeText(node){if(node.parentElement?.closest('script,style,[data-native-language]'))return;const last=textOrigins.get(node),source=last&&node.nodeValue===last.translated?last.source:node.nodeValue,translated=translate(source);textOrigins.set(node,{source,translated});if(node.nodeValue!==translated)node.nodeValue=translated}
function localizeElement(el){if(el.closest?.('[data-native-language]'))return;let origins=attributeOrigins.get(el);if(!origins){origins={};attributeOrigins.set(el,origins)}for(const name of ['aria-label','title','alt','placeholder'])if(el.hasAttribute(name)){const current=el.getAttribute(name),last=origins[name],source=last&&current===last.translated?last.source:current,translated=translate(source);origins[name]={source,translated};if(current!==translated)el.setAttribute(name,translated)}}
function localizeTree(root){if(root.nodeType===Node.TEXT_NODE)return localizeText(root);if(root.nodeType!==Node.ELEMENT_NODE)return;localizeElement(root);const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);for(let n=walker.nextNode();n;n=walker.nextNode()){if(n.nodeType===Node.TEXT_NODE)localizeText(n);else localizeElement(n)}}
new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')localizeText(r.target);else if(r.type==='attributes')localizeElement(r.target);else for(const n of r.addedNodes)localizeTree(n)}}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt','placeholder']});
for(const method of ['fillText','strokeText','measureText']){const native=CanvasRenderingContext2D.prototype[method];CanvasRenderingContext2D.prototype[method]=function(value,...args){return native.call(this,translate(value),...args)}}
const localizedStoryInit=initStoryText;
initStoryText=function(){localizedStoryInit();if(!familyStory)return;familyStory.text=translate(familyStory.text);familyStory.chars=Array.from(familyStory.text);familyStory.el.setAttribute('aria-label',familyStory.text)};
ARCADE_ICONS.language='M13 1a12 12 0 1 0 0 24 12 12 0 0 0 0-24ZM1 13h24M13 1q-10 12 0 24M13 1q10 12 0 24';
const languageHome=hdHome;
hdHome=function(){return languageHome()+`<div class="arcade-language-shortcut">${arcadeButton('languages','ΕΛ · EN · УК','language')}</div>`};
hdSettingDefs[3].unshift(['language','ΓΛΩΣΣΑ','ΕΛ · EN · УК']);
const languageValue=hdSettingValue;
hdSettingValue=function(key){return key==='language'?LANGUAGES.find(l=>l.id===language).name:languageValue(key)};
function applyLanguage(){document.documentElement.lang=language;document.documentElement.style.setProperty('--story-reveal-hint',JSON.stringify(translate('A / ΑΓΓΙΓΜΑ · ΟΛΟ ΤΟ ΚΕΙΜΕΝΟ')));document.documentElement.style.setProperty('--hero-ready-text',JSON.stringify(translate('ΕΤΟΙΜΟΣ! ·')+' '));document.querySelector('link[rel="manifest"]').href=language==='el'?'manifest.webmanifest?v=2.4':`manifest-${language}.webmanifest?v=2.4`;localizeTree(document.body)}
function setLanguage(code){if(!LANGUAGES.some(l=>l.id===code))return;language=code;try{localStorage.setItem('little-dragon-language',code)}catch{}applyLanguage()}
function languageScreen(){return `<div class="card language-screen"><h2>ΔΙΑΛΕΞΕ ΓΛΩΣΣΑ</h2><div class="menu-links">${LANGUAGES.map(l=>`<button type="button" class="arcade-command ${l.id===language?'active':''}" data-go="language-${l.id}" data-native-language="true" lang="${l.id}" aria-pressed="${l.id===language}"><span class="command-icon">${arcadeGlyph('language')}</span><b>${l.name}</b><span class="command-chevron" aria-hidden="true">▶</span></button>`).join('')}</div>${arcadeButton('back','ΠΙΣΩ','back')}</div>`}
const languageShow=show;
show=function(page){languageShow(page);if(page==='languages'){panel.innerHTML=languageScreen();hdFocus('language-'+language)}applyLanguage()};
const languageGo=go;
go=function(name){if(name==='languages'){languageOrigin=game.mode;show('languages');return}if(name.startsWith('language-')){setLanguage(name.slice(9));show(languageOrigin);return}languageGo(name)};
const languageAdjust=hdAdjust;
hdAdjust=function(name,delta=1){if(name==='hd-language'){const index=LANGUAGES.findIndex(l=>l.id===language);setLanguage(LANGUAGES[(index+delta+LANGUAGES.length)%LANGUAGES.length].id);show('settings');hdFocus(name);return}languageAdjust(name,delta)};
const languageBack=hdBack;
hdBack=function(){if(game.mode==='languages')show(languageOrigin);else languageBack()};
globalThis.DragonI18n={t:translate,set:setLanguage,get:()=>language,languages:LANGUAGES,keys:Object.keys(DRAGON_LOCALES),refresh:()=>show(game.mode)};
show(game.mode);
