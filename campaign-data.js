'use strict';
const CAMPAIGN_ORDER=[0,1,2,3,5,4],CAMPAIGN_TEXTS={};
function chapterText(el,en,uk){CAMPAIGN_TEXTS[el]=[en,uk];return el}
const BRAWL_TITLES=[
 ['Η παρέα ανοίγει δρόμο','The friends clear a path','Друзі прокладають шлях'],
 ['Οι πειρατές της προκυμαίας','Pirates on the quay','Пірати на набережній'],
 ['Αναστάτωση στο δάσος','Trouble in the forest','Переполох у лісі'],
 ['Οι φύλακες των ερειπίων','Guardians of the ruins','Вартові руїн'],
 ['Η παρέα φτάνει στο κάστρο','The friends reach the castle','Друзі дісталися замку'],
 ['Περιπέτεια μέσα στο χιόνι','Adventure in the snow','Пригода у снігу']
].map(t=>chapterText(...t));
const CHAPTERS=BRAWL_TITLES.map((title,level)=>Array.from({length:16},(_,section)=>{
 const kind=section===15?'boss':section===7?'rival':[3,8,14].includes(section)?'rest':'fight';
 return {kind,title:kind==='rest'?chapterText('Μια ανάσα — και φύγαμε!','Catch a breath — then go!','Перепочинок — і вперед!'):BRAWL_TITLES[level],section,level};
}));

const CHAPTER_HINTS={};
const CHAPTER_ENDS=[
 ['ΤΟ ΔΡΟΜΟΛΟΓΙΟ ΣΥΝΕΧΙΖΕΤΑΙ','THE ROUTE CONTINUES','МАРШРУТ ТРИВАЄ',
 'Ο ταχυδρόμος βρήκε τη σωστή σφραγίδα. Το φορτίο με το Yoto πέρασε από την ψαραγορά.','The postman found the right seal. The cargo with Yoto passed through the fish market.','Листоноша знайшов потрібну печатку. Вантаж із Yoto пройшов рибний ринок.',
 'Τα φώτα της γειτονιάς άναψαν πίσω τους. Μπροστά τους περίμενε η τελευταία βάρκα.','The neighborhood lights came on behind them. Ahead waited the last boat.','Позаду загорілися вогні кварталу. Попереду чекав останній човен.'],
 ['Η ΠΥΞΙΔΑ ΔΕΙΧΝΕΙ ΠΡΑΣΙΝΟ','THE COMPASS POINTS GREEN','КОМПАС УКАЗУЄ НА ЗЕЛЕНЬ',
 'Ο Καπετάνιος Μος παρέδωσε την πυξίδα. Η κάρτα του δέντρου άνοιγε ένα πέρασμα στην απέναντι ακτή.','Captain Moss handed over the compass. The tree card opened a passage on the opposite shore.','Капітан Мосс віддав компас. Картка дерева відкривала прохід на протилежному березі.',
 'Οι φίλοι άφησαν την παλίρροια πίσω. Το δάσος είχε ακούσει ήδη ότι έρχονταν.','The friends left the tide behind. The forest already knew they were coming.','Друзі залишили приплив позаду. Ліс уже знав про їхнє наближення.'],
 ['Η ΣΥΜΦΩΝΙΑ ΤΟΥ ΑΛΣΟΥΣ','THE GROVE’S AGREEMENT','УГОДА ГАЮ',
 'Ο Παφ τελείωσε το παιχνίδι του. Χάρισε στους ταξιδιώτες έναν μικρό ηλιακό φακό.','The thirsty root became a bridge. Puff gave the travelers a small sun lens.','Спраглий корінь став мостом. Пафф подарував мандрівникам маленьку сонячну лінзу.',
 'Με φως, όχι με βιασύνη, θα άνοιγαν τον επόμενο δρόμο ανάμεσα στους παλιούς κίονες.','Light, rather than haste, would open the next road among the old columns.','Саме світло відкрило б наступну дорогу між старими колонами.'],
 ['ΤΟ ΒΟΥΝΟ ΚΡΑΤΑ ΤΟ ΚΛΕΙΔΙ','THE MOUNTAIN HOLDS THE KEY','ГОРА ЗБЕРІГАЄ КЛЮЧ',
 'Ο φύλακας έδειξε το μονοπάτι πάνω από τα σύννεφα και χάρισε στα παιδιά το ζεστό φυλαχτό.','The mirrors revealed a path above the clouds. The guardian entrusted the children with the warm amulet.','Дзеркала показали шлях над хмарами. Вартовий довірив дітям теплий амулет.',
 'Το κάστρο ήταν κοντά, αλλά η γέφυρά του έφτανε πρώτα στο παγωμένο πέρασμα.','The castle was near, but its bridge first led through the frozen pass.','Замок був близько, та його міст спершу вів через крижаний перевал.'],
 ['ΜΙΑ ΘΕΣΗ ΔΙΠΛΑ ΣΤΟ YOTO','A PLACE BESIDE YOTO','МІСЦЕ ПОРУЧ ІЗ YOTO',
 'Ο Gruffy άκουσε επιτέλους μια ιστορία μαζί με φίλους. Δεν χρειαζόταν να κρύβει άλλες κάρτες.','Gruffy finally heard a story with friends. He no longer needed to hide any cards.','Ґраффі нарешті слухав історію з друзями. Більше не треба було ховати картки.',
 'Το πορτοκαλί Yoto θα γύριζε σπίτι. Αυτή τη φορά, η παρέα θα ήταν λίγο μεγαλύτερη.','The orange Yoto would return home. This time, the group would be a little bigger.','Помаранчевий Yoto повернеться додому. Цього разу компанія буде трохи більшою.'],
 ['ΖΕΣΤΑ ΦΩΤΑ ΠΕΡΑ ΑΠΟ ΤΟ ΧΙΟΝΙ','WARM LIGHTS BEYOND THE SNOW','ТЕПЛІ ВОГНІ ЗА СНІГОМ',
 'Η παρέα πέρασε τους φύλακες του χιονιού. Ο κρυστάλλινος αίγαγρος άνοιξε τη γέφυρα.','The mountaineer reached the refuge. The crystal ibex recognized the seal and opened the bridge.','Альпініст дістався прихистку. Кришталевий козеріг упізнав печатку й відкрив міст.',
 'Το φυλαχτό έλαμπε ζεστά. Στην άλλη πλευρά, το κάστρο περίμενε τους δύο τελευταίους αναγνώστες.','The amulet glowed warmly. Across the bridge, the castle awaited its last two readers.','Амулет тепло сяяв. За мостом замок чекав на двох останніх читачів.']
].map(row=>({title:chapterText(...row.slice(0,3)),pages:[chapterText(...row.slice(3,6)),chapterText(...row.slice(6,9))]}));

CHAPTER_ENDS[0].pages[0]=chapterText('Οι φύλακες έκαναν στην άκρη. Το ίχνος του Yoto οδηγούσε στην προκυμαία.','The guards stepped aside. Yoto’s trail led to the quay.','Вартові відступили. Слід Yoto вів до набережної.');
CHAPTER_ENDS[2].pages[0]=chapterText('Ο Παφ τελείωσε το παιχνίδι του. Χάρισε στους ταξιδιώτες έναν μικρό ηλιακό φακό.','Puff finished his game and gave the travelers a little sun lens.','Пафф завершив гру й подарував мандрівникам маленьку сонячну лінзу.');
CHAPTER_ENDS[3].pages[0]=chapterText('Ο φύλακας έδειξε το μονοπάτι πάνω από τα σύννεφα και χάρισε στα παιδιά το ζεστό φυλαχτό.','The guardian showed the path above the clouds and gave the children the warm amulet.','Вартовий показав шлях над хмарами й подарував дітям теплий амулет.');
CHAPTER_ENDS[5].pages[0]=chapterText('Η παρέα πέρασε τους φύλακες του χιονιού. Ο κρυστάλλινος αίγαγρος άνοιξε τη γέφυρα.','The friends passed the snow guardians. The crystal ibex opened the bridge.','Друзі пройшли снігових вартових. Кришталевий козеріг відкрив міст.');
