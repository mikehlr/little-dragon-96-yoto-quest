'use strict';
const CAMPAIGN_ORDER=[0,1,2,3,5,4],CAMPAIGN_TEXTS={};
function chapterText(el,en,uk){CAMPAIGN_TEXTS[el]=[en,uk];return el}
const CHAPTER_ROWS=[
`fight|Ποιος έκλεισε το συνεργείο;|Who locked the workshop?|Хто замкнув майстерню?
rescue|Ελευθέρωσε τον ταχυδρόμο|Free the postman|Звільніть листоношу
chase|Πρόλαβε τον αγγελιοφόρο|Catch the messenger|Наздоженіть посланця
read|Διάβασε το χαμένο δρομολόγιο|Read the lost delivery route|Прочитайте загублений маршрут
fight|Οι σκουπιστές κρύβουν το πέρασμα|The sweepers block the passage|Підмітальники перекрили прохід
carry|Φέρε το ανταλλακτικό στον πίνακα|Bring the spare part to the panel|Принесіть деталь до щитка
defend|Κράτησε το ρεύμα ανοιχτό|Keep the power running|Не дайте вимкнути струм
rival|Ο φύλακας του δρομολογίου|The route keeper|Вартовий маршруту
event|Η γειτονιά ανάβει τα φώτα της|The neighborhood lights up|У кварталі загоряються вогні
escort|Συνόδεψε τον ταχυδρόμο στην αψίδα|Escort the postman to the arch|Проведіть листоношу до арки
fight|Ενέδρα πάνω από την πλατεία|An ambush above the square|Засідка над площею
sequence|Σύνδεσε τα τρία σήματα|Connect the three signals|З’єднайте три сигнали
fight|Το μπαούλο της προκυμαίας|The quay chest|Скриня на набережній
fight|Σταμάτησε το τελευταίο φορτίο|Stop the final shipment|Зупиніть останній вантаж
rest|Πάρε προμήθειες για τη θάλασσα|Take supplies for the sea|Візьміть припаси для моря
boss|Η σφραγίδα του λιμανιού|The harbor seal|Печатка гавані`,
`fight|Η αποθήκη των παράξενων φορτίων|The warehouse of strange cargo|Склад дивних вантажів
carry|Πήγαινε το σκοινί στο βίντσι|Bring the rope to the winch|Принесіть мотузку до лебідки
defend|Κράτησε την αντλία σε λειτουργία|Keep the pump running|Не дайте зупинити помпу
event|Το νερό αφήνει ελεύθερη την προβλήτα|The water clears the pier|Вода звільняє причал
fight|Η βάρδια του γερανού|The crane crew|Зміна біля крана
chase|Πρόλαβε τον λαθρέμπορο με τον χάρτη|Catch the smuggler with the map|Наздоженіть контрабандиста з картою
rescue|Άνοιξε το κλουβί του καπετάνιου|Open the captain’s cage|Відчиніть клітку капітана
rival|Ο λοστρόμος θέλει εξηγήσεις|The boatswain wants answers|Боцман вимагає пояснень
sequence|Στείλε το σήμα του φάρου|Send the lighthouse signal|Подайте сигнал маяка
escort|Πέρνα τον καπετάνιο από την παλίρροια|Guide the captain past the tide|Проведіть капітана повз приплив
fight|Επισκέπτες από το κατάστρωμα|Visitors from the deck|Гості з палуби
fight|Το βαρέλι που δεν ταξιδεύει μόνο του|A barrel that never travels alone|Бочка подорожує не сама
read|Ποιο φορτίο πάει στο δάσος;|Which cargo goes to the forest?|Який вантаж прямує до лісу?
fight|Η τελευταία βάρκα φεύγει|The last boat is leaving|Останній човен відпливає
rest|Ένα ήσυχο λεπτό πριν από το ταξίδι|A quiet minute before sailing|Тиха хвилина перед подорожжю
boss|Η πυξίδα του Καπετάνιου Μος|Captain Moss’s compass|Компас капітана Мосса`,
`fight|Οι φύλακες άκουσαν ξένα βήματα|The guardians heard strangers|Вартові почули чужі кроки
sequence|Ξύπνησε τα μουσικά μανιτάρια|Wake the musical mushrooms|Розбудіть музичні гриби
rescue|Ελευθέρωσε τον βοτανοπώλη|Free the herbalist|Звільніть травника
event|Οι πυγολαμπίδες δείχνουν μονοπάτι|Fireflies reveal a path|Світляки показують стежку
fight|Κάποιος κοιμάται στον κούφιο κορμό|Someone sleeps in the hollow stump|Хтось спить у порожньому пні
carry|Πότισε τη διψασμένη ρίζα|Water the thirsty root|Полийте спраглий корінь
defend|Προστάτεψε τη γέφυρα που μεγαλώνει|Protect the growing bridge|Захистіть міст, що росте
rival|Ο λύκος της μεγάλης βελανιδιάς|The wolf of the great oak|Вовк великого дуба
chase|Το σκαθάρι πήρε τον ηλιόσπορο|The beetle took the sun seed|Жук забрав сонячне зерно
read|Μάθε τη συμφωνία του άλσους|Learn the grove’s agreement|Дізнайтеся угоду гаю
fight|Τέλος το πότισμα για τους φύλακες|The guardians stop watering|Вартові полишили поливання
sequence|Λύσε τα τρία δεμένα σύμβολα|Release the three bound symbols|Звільніть три зв’язані символи
fight|Κάθοδος από τα ψηλά κλαδιά|A descent from high branches|Спуск із високих гілок
fight|Το καρότσι των χαμένων σπόρων|The wagon of lost seeds|Віз загубленого насіння
escort|Οδήγησε τον βοτανοπώλη στο ξέφωτο|Guide the herbalist to the clearing|Проведіть травника на галявину
boss|Ο Παφ δοκιμάζει τους ταξιδιώτες|Puff tests the travelers|Пафф випробовує мандрівників`,
`fight|Η πύλη δεν αναγνωρίζει επισκέπτες|The gate knows no visitors|Брама не впізнає гостей
read|Διάβασε τη σειρά στο μωσαϊκό|Read the mosaic sequence|Прочитайте порядок на мозаїці
sequence|Ήλιος, κύμα, φύλλο|Sun, wave, leaf|Сонце, хвиля, листок
event|Ο παλιός δρόμος ξαναφαίνεται|The old road reappears|Старий шлях знову відкривається
fight|Το πιθάρι του φύλακα|The guardian’s jar|Глек вартового
carry|Τοποθέτησε τον φακό στη βάση|Place the lens on its pedestal|Поставте лінзу на підставку
defend|Κράτησε σταθερή την ηλιαχτίδα|Keep the sunbeam steady|Утримайте сонячний промінь
rival|Ο λιθοξόος του ναού|The temple stoneworker|Каменяр храму
rescue|Βγάλε την αρχειοφύλακα από το κλουβί|Free the archivist from the cage|Звільніть архіваріуса з клітки
escort|Πέρασε μαζί της τις ρωγμές|Cross the cracks together|Перейдіть тріщини разом
fight|Φύλακες πάνω από την αψίδα|Guardians above the arch|Вартові над аркою
sequence|Στρέψε το φως προς το βουνό|Turn the light toward the mountain|Спрямуйте світло до гори
fight|Η τελευταία βάρδια του ναού|The temple’s final shift|Остання зміна храму
fight|Το βαγονάκι του χάλκινου κλειδιού|The wagon of the bronze key|Віз бронзового ключа
rest|Το φυλαχτό κρατά ακόμη ζέστη|The amulet still holds warmth|Амулет іще зберігає тепло
boss|Ο φύλακας του ορεινού περάσματος|The mountain passage guardian|Вартовий гірського проходу`,
`fight|Η βιβλιοθήκη περιμένει επιστροφές|The library awaits its returns|Бібліотека чекає повернень
carry|Επέστρεψε το κόκκινο βιβλίο|Return the red book|Поверніть червону книгу
sequence|Σβήσε τις τρεις σφραγίδες συναγερμού|Disable the three alarm seals|Вимкніть три печатки тривоги
event|Η κάτω λωρίδα μένει στη σκιά|The lower lane stays in shadow|Нижня смуга залишається в тіні
fight|Οι βοηθοί άφησαν το διάβασμα|The assistants stopped reading|Помічники полишили читання
rescue|Ελευθέρωσε τη βιβλιοθηκάριο|Free the librarian|Звільніть бібліотекаря
escort|Πέρνα μαζί της από τα φανάρια|Pass the lanterns together|Пройдіть ліхтарі разом
rival|Η μάγισσα της αυλής|The court witch|Відьма двору
read|Διάβασε το ημερολόγιο του Gruffy|Read Gruffy’s diary|Прочитайте щоденник Ґраффі
defend|Δώσε ξανά φωνή στο Yoto|Give Yoto its voice back|Поверніть Yoto голос
fight|Φρουροί πίσω από το παραπέτασμα|Guards behind the curtain|Варта за завісою
sequence|Βάλε τις ιστορίες στη σωστή σειρά|Put the stories in order|Розташуйте історії по порядку
fight|Το μπαούλο των ξεχασμένων αναγνωστών|The chest of forgotten readers|Скриня забутих читачів
fight|Το τελευταίο καρότσι της βιβλιοθήκης|The library’s final carriage|Останній бібліотечний віз
chase|Πρόλαβε το κουρδιστό ποντίκι|Catch the clockwork mouse|Наздоженіть заводну мишу
boss|Ο Gruffy θέλει μια ιστορία|Gruffy wants a story|Ґраффі хоче історію`,
`fight|Οι φύλακες της χιονισμένης εισόδου|Guardians of the snowy entrance|Вартові засніженого входу
read|Διάβασε τον χάρτη των καταφυγίων|Read the refuge map|Прочитайте карту прихистків
carry|Φέρε τον θερμό κρύσταλλο στο μαγκάλι|Bring the warm crystal to the brazier|Принесіть теплий кристал до жарівні
event|Το πρώτο καταφύγιο ζεσταίνεται|The first refuge warms up|Перший прихисток зігрівається
fight|Ο χιονιστής δεν παραμερίζει|The snow shoveler will not move|Прибиральник снігу не відступає
defend|Κράτησε τον φάρο μέσα στη χιονοθύελλα|Keep the beacon through the blizzard|Збережіть маяк у хуртовині
rescue|Βοήθησε τον χαμένο ορειβάτη|Help the lost mountaineer|Допоможіть загубленому альпіністу
rival|Ο νεαρός αίγαγρος φυλάει τον χάρτη|The young ibex guards the map|Молодий козеріг охороняє карту
sequence|Άναψε τα τρία σημάδια διάσωσης|Light the three rescue markers|Запаліть три рятувальні знаки
escort|Πήγαινε τον ορειβάτη στη ζεστασιά|Bring the mountaineer to warmth|Проведіть альпініста в тепло
fight|Σκοινιά πάνω από τον πάγο|Ropes above the ice|Мотузки над кригою
chase|Το λαγουδάκι κρατά τη σφραγίδα|The hare carries the seal|Заєць несе печатку
fight|Μια κρυψώνα μέσα στο χιόνι|A hiding place in the snow|Схованка у снігу
fight|Το έλκηθρο φέρνει τη νυχτερινή βάρδια|The sled brings the night shift|Сани привезли нічну зміну
rest|Ζεστά χέρια πριν από τη γέφυρα|Warm hands before the bridge|Зігрійте руки перед мостом
boss|Ο κρυστάλλινος αίγαγρος ανοίγει τον δρόμο|The crystal ibex opens the way|Кришталевий козеріг відкриває шлях`
];
const CHAPTERS=CHAPTER_ROWS.map((rows,level)=>rows.split('\n').map((row,section)=>{const [kind,el,en,uk]=row.split('|');return {kind,title:chapterText(el,en,uk),section,level}}));
const CHAPTER_CLUES=[
 ['Το δρομολόγιο γράφει: πακέτο, ρεύμα, προκυμαία.','The route says: parcel, power, quay.','Маршрут каже: пакунок, струм, набережна.'],
 ['Το φορτίο με την κάρτα του δέντρου αναχωρεί τώρα.','The cargo with the tree card is leaving now.','Вантаж із карткою дерева відправляється зараз.'],
 ['Φως, νερό και φίλοι ανοίγουν τα ερείπια.','Light, water and friends open the ruins.','Світло, вода й друзі відкривають руїни.'],
 ['Ήλιος, κύμα, φύλλο. Οι καθρέφτες δείχνουν το παγωμένο βουνό.','Sun, wave, leaf. The mirrors point to the frozen mountain.','Сонце, хвиля, листок. Дзеркала вказують на крижану гору.'],
 ['Δεν ήθελε θησαυρό. Ήθελε κάποιον να ακούσει μαζί του.','He wanted no treasure. He wanted someone to listen with him.','Йому не потрібен скарб. Він хотів слухати разом із кимось.'],
 ['Το φυλαχτό κρατά τη ζέστη. Άναψε τα καταφύγια.','The amulet holds warmth. Light the refuges.','Амулет зберігає тепло. Запаліть прихистки.']
].map(t=>chapterText(...t));
const CHAPTER_HINTS={
 rescue:chapterText('Νίκησε τον φύλακα. Μετά άνοιξε το κλουβί με ΧΡΗΣΗ.','Defeat the guard. Then open the cage with USE.','Здолайте вартового. Тоді відчиніть клітку кнопкою ДІЯ.'),
 carry:chapterText('Μετέφερε ή πέτα το αντικείμενο στη φωτισμένη βάση.','Carry or throw the object onto the lit pedestal.','Принесіть або киньте предмет на освітлену підставку.'),
 defend:chapterText('Μείνε στον κύκλο και κράτησε τους επισκέπτες μακριά.','Stay in the circle and keep the visitors away.','Залишайтесь у колі й стримуйте гостей.'),
 escort:chapterText('Μείνε κοντά στον φίλο σου μέχρι τη φωτεινή έξοδο.','Stay near your friend until the lit exit.','Тримайтесь поруч із другом до освітленого виходу.'),
 chase:chapterText('Πρόλαβε τον αγγελιοφόρο πριν καλέσει παρέα.','Catch the messenger before they call company.','Наздоженіть посланця, поки він не покликав друзів.'),
 sequence:chapterText('ΧΡΗΣΗ στα σύμβολα, με τη σειρά που φαίνεται επάνω.','USE the symbols in the order shown above.','Натискайте ДІЯ біля символів у вказаному вгорі порядку.'),
 read:chapterText('Πλησίασε την επιγραφή και πάτησε ΧΡΗΣΗ.','Approach the inscription and press USE.','Підійдіть до напису й натисніть ДІЯ.')
};
const CHAPTER_ENDS=[
 ['ΤΟ ΔΡΟΜΟΛΟΓΙΟ ΣΥΝΕΧΙΖΕΤΑΙ','THE ROUTE CONTINUES','МАРШРУТ ТРИВАЄ',
 'Ο ταχυδρόμος βρήκε τη σωστή σφραγίδα. Το φορτίο με το Yoto πέρασε από την ψαραγορά.','The postman found the right seal. The cargo with Yoto passed through the fish market.','Листоноша знайшов потрібну печатку. Вантаж із Yoto пройшов рибний ринок.',
 'Τα φώτα της γειτονιάς άναψαν πίσω τους. Μπροστά τους περίμενε η τελευταία βάρκα.','The neighborhood lights came on behind them. Ahead waited the last boat.','Позаду загорілися вогні кварталу. Попереду чекав останній човен.'],
 ['Η ΠΥΞΙΔΑ ΔΕΙΧΝΕΙ ΠΡΑΣΙΝΟ','THE COMPASS POINTS GREEN','КОМПАС УКАЗУЄ НА ЗЕЛЕНЬ',
 'Ο Καπετάνιος Μος παρέδωσε την πυξίδα. Η κάρτα του δέντρου άνοιγε ένα πέρασμα στην απέναντι ακτή.','Captain Moss handed over the compass. The tree card opened a passage on the opposite shore.','Капітан Мосс віддав компас. Картка дерева відкривала прохід на протилежному березі.',
 'Οι φίλοι άφησαν την παλίρροια πίσω. Το δάσος είχε ακούσει ήδη ότι έρχονταν.','The friends left the tide behind. The forest already knew they were coming.','Друзі залишили приплив позаду. Ліс уже знав про їхнє наближення.'],
 ['Η ΣΥΜΦΩΝΙΑ ΤΟΥ ΑΛΣΟΥΣ','THE GROVE’S AGREEMENT','УГОДА ГАЮ',
 'Η διψασμένη ρίζα έγινε γέφυρα. Ο Παφ χάρισε στους ταξιδιώτες έναν μικρό ηλιακό φακό.','The thirsty root became a bridge. Puff gave the travelers a small sun lens.','Спраглий корінь став мостом. Пафф подарував мандрівникам маленьку сонячну лінзу.',
 'Με φως, όχι με βιασύνη, θα άνοιγαν τον επόμενο δρόμο ανάμεσα στους παλιούς κίονες.','Light, rather than haste, would open the next road among the old columns.','Саме світло відкрило б наступну дорогу між старими колонами.'],
 ['ΤΟ ΒΟΥΝΟ ΚΡΑΤΑ ΤΟ ΚΛΕΙΔΙ','THE MOUNTAIN HOLDS THE KEY','ГОРА ЗБЕРІГАЄ КЛЮЧ',
 'Οι καθρέφτες έδειξαν ένα μονοπάτι πάνω από τα σύννεφα. Ο φύλακας εμπιστεύτηκε στα παιδιά το ζεστό φυλαχτό.','The mirrors revealed a path above the clouds. The guardian entrusted the children with the warm amulet.','Дзеркала показали шлях над хмарами. Вартовий довірив дітям теплий амулет.',
 'Το κάστρο ήταν κοντά, αλλά η γέφυρά του έφτανε πρώτα στο παγωμένο πέρασμα.','The castle was near, but its bridge first led through the frozen pass.','Замок був близько, та його міст спершу вів через крижаний перевал.'],
 ['ΜΙΑ ΘΕΣΗ ΔΙΠΛΑ ΣΤΟ YOTO','A PLACE BESIDE YOTO','МІСЦЕ ПОРУЧ ІЗ YOTO',
 'Ο Gruffy άκουσε επιτέλους μια ιστορία μαζί με φίλους. Δεν χρειαζόταν να κρύβει άλλες κάρτες.','Gruffy finally heard a story with friends. He no longer needed to hide any cards.','Ґраффі нарешті слухав історію з друзями. Більше не треба було ховати картки.',
 'Το πορτοκαλί Yoto θα γύριζε σπίτι. Αυτή τη φορά, η παρέα θα ήταν λίγο μεγαλύτερη.','The orange Yoto would return home. This time, the group would be a little bigger.','Помаранчевий Yoto повернеться додому. Цього разу компанія буде трохи більшою.'],
 ['ΖΕΣΤΑ ΦΩΤΑ ΠΕΡΑ ΑΠΟ ΤΟ ΧΙΟΝΙ','WARM LIGHTS BEYOND THE SNOW','ТЕПЛІ ВОГНІ ЗА СНІГОМ',
 'Ο ορειβάτης έφτασε στο καταφύγιο. Ο κρυστάλλινος αίγαγρος αναγνώρισε τη σφραγίδα και άνοιξε τη γέφυρα.','The mountaineer reached the refuge. The crystal ibex recognized the seal and opened the bridge.','Альпініст дістався прихистку. Кришталевий козеріг упізнав печатку й відкрив міст.',
 'Το φυλαχτό έλαμπε ζεστά. Στην άλλη πλευρά, το κάστρο περίμενε τους δύο τελευταίους αναγνώστες.','The amulet glowed warmly. Across the bridge, the castle awaited its last two readers.','Амулет тепло сяяв. За мостом замок чекав на двох останніх читачів.']
].map(row=>({title:chapterText(...row.slice(0,3)),pages:[chapterText(...row.slice(3,6)),chapterText(...row.slice(6,9))]}));
