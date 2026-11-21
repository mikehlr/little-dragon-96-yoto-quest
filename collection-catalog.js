'use strict';
const COLLECTION_REGIONS=[0,1,2,3,5,4];
const SOUVENIR_ROWS=[
 [['Καμπανάκι της γειτονιάς','Neighborhood bell','Дзвінок кварталу'],['Κεραμική γάτα','Porcelain cat','Порцелянова кішка'],['Σπίτι με βουκαμβίλια','Bougainvillea house','Будиночок із бугенвілією'],['Μικρή Ακρόπολη','Miniature Acropolis','Мініатюрний Акрополь']],
 [['Πυξίδα του καπετάνιου','Captain’s compass','Компас капітана'],['Μικρό καΐκι','Little fishing boat','Маленький рибальський човен'],['Καράβι στο μπουκάλι','Ship in a bottle','Корабель у пляшці'],['Άγκυρα από σμάλτο','Enamel anchor','Емалева якірна прикраса']],
 [['Ξύλινη αλεπού','Carved fox','Різьблена лисичка'],['Φανάρι πυγολαμπίδας','Firefly lantern','Ліхтарик світлячка'],['Ασημένιο βελανίδι','Silver acorn','Срібний жолудь'],['Μανιταρόσπιτο','Mushroom cottage','Грибний будиночок']],
 [['Μετάλλιο της κουκουβάγιας','Owl medallion','Медальйон сови'],['Ζωγραφισμένος αμφορέας','Painted amphora','Розписана амфора'],['Χρυσός σκαραβαίος','Golden scarab','Золотий скарабей'],['Μικρή μαρμάρινη κολόνα','Miniature marble column','Мармурова колона']],
 [['Χιονόμπαλα του βουνού','Mountain snow globe','Гірська снігова куля'],['Κόκκινο έλκηθρο','Red sled','Червоні санчата'],['Κρυστάλλινη νιφάδα','Crystal snowflake','Кришталева сніжинка'],['Λευκός αίγαγρος','White ibex','Білий козеріг']],
 [['Κουρδιστό ποντικάκι','Clockwork mouse','Заводна мишка'],['Μάσκα γελωτοποιού','Jester mask','Маска блазня'],['Μικρό στέμμα','Little crown','Маленька корона'],['Μουσικό κάστρο','Castle music box','Музична скринька-замок']]
];
const SOUVENIR_LORE=[
 ['Ένα κουδούνισμα και όλη η γειτονιά ξέρει ότι γύρισες.','One ring and the whole neighborhood knows you are home.','Один дзвін — і весь квартал знає, що ти вдома.'],
 ['Η μόνη γάτα που δεν ζητάει δεύτερο πρωινό.','The only cat that never asks for a second breakfast.','Єдина кішка, яка не просить другий сніданок.'],
 ['Μια ολόκληρη γειτονιά χωράει στην παλάμη σου.','A whole neighborhood fits in your palm.','Цілий квартал уміщається в долоні.'],
 ['Μάρμαρο, κολόνες και ιστορίες χιλιάδων χρόνων.','Marble, columns and thousands of years of stories.','Мармур, колони й тисячі років історій.'],
 ['Δείχνει βορρά. Για το μαγαζί, ρώτα τον καπετάνιο.','It points north. For the shop, ask the captain.','Показує північ. Дорогу до крамниці спитай у капітана.'],
 ['Έτοιμο για την πιο μικρή ψαριά του λιμανιού.','Ready for the smallest catch in the harbor.','Готовий до найменшого улову в порту.'],
 ['Πώς μπήκε μέσα; Ο καραβομαραγκός δεν αποκαλύπτει τα κόλπα του.','How did it get inside? A shipwright never tells.','Як він потрапив усередину? Майстер зберігає таємницю.'],
 ['Για να μη σε παρασύρει η επόμενη περιπέτεια.','So the next adventure does not carry you away.','Щоб наступна пригода не віднесла тебе надто далеко.'],
 ['Η αλεπού θυμάται το μονοπάτι για το σπίτι.','The fox remembers the path home.','Лисичка пам’ятає стежку додому.'],
 ['Μικρό φως για τις μεγάλες νύχτες του δάσους.','A little light for long forest nights.','Маленьке світло для довгих лісових ночей.'],
 ['Κάθε μεγάλο δέντρο ξεκίνησε από κάτι τόσο μικρό.','Every great tree started this small.','Кожне велике дерево починалося з такого малого.'],
 ['Το πιο ζεστό σπίτι κάτω από ένα κόκκινο καπέλο.','The coziest home under a red cap.','Найзатишніша оселя під червоною шапкою.'],
 ['Η κουκουβάγια κρατάει τα μυστικά των ερειπίων.','The owl keeps the secrets of the ruins.','Сова береже таємниці руїн.'],
 ['Χώρεσε ταξίδια, θάλασσες και μια ζωγραφισμένη ιστορία.','It holds journeys, seas and a painted story.','У ньому подорожі, моря й намальована історія.'],
 ['Ένας μικρός μηχανισμός με μεγάλη περιέργεια.','A tiny mechanism with a great curiosity.','Крихітний механізм із великою цікавістю.'],
 ['Ένα κομμάτι ναού που χωράει στη βιτρίνα.','A piece of a temple that fits in a display case.','Шматочок храму для твоєї вітрини.'],
 ['Χιόνι όποτε το θέλεις. Χωρίς να παγώνουν τα πόδια σου.','Snow whenever you want, without cold feet.','Сніг коли захочеш — без замерзлих ніг.'],
 ['Η πιο γρήγορη παράδοση δώρων στο παγωμένο πέρασμα.','The fastest gift delivery on the frozen pass.','Найшвидша доставка подарунків на крижаному перевалі.'],
 ['Η νιφάδα που αποφάσισε να μη λιώσει ποτέ.','The snowflake that decided never to melt.','Сніжинка, яка вирішила ніколи не танути.'],
 ['Φύλακας της γέφυρας και φίλος των χαμένων ταξιδιωτών.','Guardian of the bridge and friend of lost travelers.','Вартовий мосту й друг заблукалих мандрівників.'],
 ['Κούρδισέ το και φύλαγε τα κουλουράκια σου.','Wind it up and watch your cookies.','Заведи її й пильнуй печиво.'],
 ['Ένα χαμόγελο που δεν χρειάζεται αστείο.','A smile that needs no joke.','Усмішка, якій не потрібен жарт.'],
 ['Στέμμα μικρό. Ηρωισμός σε κανονικό μέγεθος.','A little crown. Full-sized heroism.','Маленька корона. Справжня велика відвага.'],
 ['Μια περιπέτεια που συνεχίζεται με τη μουσική.','An adventure that continues in music.','Пригода, що триває в музиці.']
];
const SOUVENIRS=SOUVENIR_ROWS.flatMap((row,set)=>row.map((names,n)=>({id:'souvenir-'+set+'-'+n,level:COLLECTION_REGIONS[set],set,frame:set*4+n,cost:[6,10,14,18][n],name:chapterText(...names),lore:chapterText(...SOUVENIR_LORE[set*4+n])})));
const STORY_ROWS=[
 [['Η γάτα ακούει πρώτη','The cat hears first','Кішка чує першою'],['Οι φίλοι στις στέγες','Friends on the rooftops','Друзі на дахах'],['Το φως της γειτονιάς','The neighborhood light','Світло кварталу']],
 [['Η πυξίδα του Μος','Moss’s compass','Компас Мосса'],['Το καΐκι του φεγγαριού','The moonlit boat','Човен під місяцем'],['Νερό στην προκυμαία','Water on the quay','Вода на причалі']],
 [['Το μονοπάτι της αλεπούς','The fox’s trail','Стежка лисички'],['Ο χορός των πυγολαμπίδων','The firefly dance','Танець світлячків'],['Το σημάδι του βελανιδιού','The acorn trail','Жолудева стежка']],
 [['Η πέτρινη κουκουβάγια','The stone owl','Кам’яна сова'],['Ο φύλακας σκαραβαίος','The scarab guardian','Скарабей-вартовий'],['Το φως του κρυστάλλου','The crystal light','Світло кристала']],
 [['Ο λαγός με το κασκόλ','The hare with a scarf','Заєць у шарфі'],['Το ζεστό καταφύγιο','The warm refuge','Теплий прихисток'],['Η γέφυρα του αίγαγρου','The ibex’s bridge','Міст козерога']],
 [['Ο μικρός αγγελιοφόρος','The little courier','Маленький кур’єр'],['Το τελευταίο αστείο','The final joke','Останній жарт'],['Μια ιστορία για όλους','A story for everyone','Історія для всіх']]
];
const STORY_LORE=[
 ['Η γάτα ξύπνησε όταν άκουσε βήματα στη στέγη. Κάποιος είχε πάρει τις ιστορίες των παιδιών.','The cat woke to footsteps on the roof. Someone had taken the children’s stories.','Кішку розбудили кроки на даху. Хтось забрав дитячі історії.'],
 ['Οι φίλοι κοίταξαν πέρα από τις κεραμοσκεπές. Ένα πορτοκαλί ίχνος οδηγούσε στο λιμάνι.','The friends looked beyond the tiled roofs. An orange trail led to the harbor.','Друзі глянули за черепичні дахи. Помаранчевий слід вів до порту.'],
 ['Όταν άναψαν τα φανάρια, η γειτονιά τούς αποχαιρέτησε. Καμία ιστορία δεν τελειώνει στην πρώτη στροφή.','As the lamps lit up, the neighborhood waved goodbye. No story ends at the first corner.','Коли засвітилися ліхтарі, квартал попрощався з друзями. Історія не закінчується за першим рогом.'],
 ['Ο καπετάνιος Μος γνώριζε τον δρόμο. Η πυξίδα του έδειχνε φίλους στην απέναντι ακτή.','Captain Moss knew the way. His compass pointed toward friends on the opposite shore.','Капітан Мосс знав шлях. Його компас указував на друзів на іншому березі.'],
 ['Το μικρό καΐκι περίμενε κάτω από το φεγγάρι. Οι κάρτες θα ταξίδευαν μαζί με τους ήρωες.','The little boat waited under the moon. The cards would travel with the heroes.','Маленький човен чекав під місяцем. Картки попливуть разом із героями.'],
 ['Μια μάνικα έλυσε τον καβγά στην προκυμαία. Ακόμα και οι πιο θυμωμένοι πειρατές γέλασαν βρεγμένοι.','A hose settled the quarrel on the quay. Even the angriest pirates laughed when soaked.','Шланг припинив сварку на причалі. Навіть сердиті пірати сміялися, промокнувши.'],
 ['Η αλεπού δεν μιλούσε, αλλά ήξερε το μονοπάτι. Οι φίλοι ακολούθησαν τα μικρά της ίχνη.','The fox could not speak, but knew the trail. The friends followed its tiny tracks.','Лисичка не говорила, та знала стежку. Друзі пішли за її слідами.'],
 ['Οι πυγολαμπίδες χάθηκαν ανάμεσα στους κυλισμένους κορμούς. Ένα φως τη φορά τις έφερε πάλι μαζί.','The fireflies scattered among rolling logs. One light at a time brought them together.','Світлячки загубилися серед колод. Збираючи вогники, друзі знову об’єднали їх.'],
 ['Τρία βελανίδια σημάδευαν τον σωστό δρόμο. Το δάσος είχε ήδη διαλέξει τους προστάτες του.','Three acorns marked the right path. The forest had already chosen its protectors.','Три жолуді позначали шлях. Ліс уже обрав своїх захисників.'],
 ['Η πέτρινη κουκουβάγια παρακολουθούσε αιώνες. Εκείνο το απόγευμα είδε επιτέλους παιδιά να χαμογελούν.','The stone owl had watched for centuries. That afternoon it finally saw children smiling.','Кам’яна сова спостерігала століттями. Того дня вона нарешті побачила усмішки дітей.'],
 ['Ο σκαραβαίος άνοιξε τα χάλκινα φτερά του. Κάτω από την αψίδα περίμενε άλλη μια ιστορία.','The scarab opened its bronze wings. Another story waited beneath the arch.','Скарабей розкрив бронзові крила. Під аркою чекала ще одна історія.'],
 ['Οι κρύσταλλοι έπεφταν μαζί με τις πέτρες. Με θάρρος και γρήγορα χέρια, οι φίλοι έσωσαν το φως τους.','Crystals fell with the stones. With courage and quick hands, the friends saved their light.','Кристали падали разом із камінням. Завдяки відвазі й спритності друзі врятували їхнє світло.'],
 ['Ο λαγός μοιράστηκε το κασκόλ του. Στο βουνό, ακόμα και μια μικρή καλοσύνη ζεσταίνει.','The hare shared its scarf. On the mountain, even a small kindness brings warmth.','Заєць поділився шарфом. У горах навіть маленька доброта зігріває.'],
 ['Οι ριπές σκόρπισαν τα φανάρια του καταφυγίου. Οι φίλοι τα μάζεψαν για να μη χαθεί κανείς στο χιόνι.','Gusts scattered the refuge lanterns. The friends gathered them so nobody would get lost in the snow.','Пориви розкидали ліхтарі прихистку. Друзі зібрали їх, щоб ніхто не заблукав у снігу.'],
 ['Ο αίγαγρος φύλαγε τη γέφυρα για όσους χρειάζονταν βοήθεια. Οι ήρωες πέρασαν και τον ευχαρίστησαν.','The ibex guarded the bridge for travelers in need. The heroes crossed and thanked it.','Козеріг стеріг міст для тих, кому потрібна допомога. Герої перейшли й подякували йому.'],
 ['Τα κουρδιστά ποντίκια έτρεχαν με τα μηχανάκια τους. Έπρεπε να μάθουν ότι οι ιστορίες δεν παραδίδονται με τρακαρίσματα.','Clockwork mice raced their scooters. They had to learn that stories are not delivered by crashing.','Заводні мишки мчали на скутерах. Їм треба було навчитися доставляти історії без зіткнень.'],
 ['Ο γελωτοποιός άφησε στην άκρη τα κόλπα. Ένα αληθινό γέλιο άξιζε περισσότερο από μια παγίδα.','The jester put his tricks aside. A real laugh was worth more than a trap.','Блазень відклав хитрощі. Щирий сміх дорожчий за пастку.'],
 ['Ο Gruffy ήθελε απλώς παρέα. Οι κάρτες γύρισαν στα παιδιά και η πρώτη ιστορία ακούστηκε για όλους μαζί.','Gruffy only wanted company. The cards returned to the children, and everyone shared the first story.','Ґраффі просто хотів друзів. Картки повернулися до дітей, і першу історію слухали всі разом.']
];
const YOTO_STORIES=STORY_ROWS.flatMap((row,set)=>row.map((names,n)=>({id:COLLECTION_REGIONS[set]+'-'+n,level:COLLECTION_REGIONS[set],set,frame:set*3+n,name:chapterText(...names),lore:chapterText(...STORY_LORE[set*3+n])})));
const COLLECTION_WORDS={title:['Η ΣΥΛΛΟΓΗ ΜΟΥ','MY COLLECTION','МОЯ КОЛЕКЦІЯ'],souvenirs:['ΑΝΑΜΝΗΣΤΙΚΑ','SOUVENIRS','СУВЕНІРИ'],stories:['ΚΑΡΤΕΣ YOTO','YOTO CARDS','КАРТКИ YOTO'],shop:['ΜΑΓΑΖΙ','SHOP','КРАМНИЦЯ'],owned:['ΣΤΗ ΣΥΛΛΟΓΗ','OWNED','У КОЛЕКЦІЇ'],buy:['ΑΓΟΡΑ','BUY','КУПИТИ'],back:['ΠΙΣΩ','BACK','НАЗАД'],locked:['ΕΠΙΣΚΕΨΟΥ ΤΗΝ ΠΕΡΙΟΧΗ','VISIT THE REGION','ВІДВІДАЙ МІСЦЕВІСТЬ'],find:['ΒΡΕΣ ΤΗΝ ΚΑΡΤΑ','FIND THE CARD','ЗНАЙДИ КАРТКУ'],listen:['ΑΚΟΥΣΕ ΤΗ ΜΟΥΣΙΚΗ','PLAY THE MUSIC','СЛУХАТИ МУЗИКУ'],stop:['ΣΤΑΜΑΤΗΣΕ ΤΗ ΜΟΥΣΙΚΗ','STOP MUSIC','ЗУПИНИТИ МУЗИКУ'],set:['ΣΕΤ','SET','НАБІР'],supplies:['ΕΦΟΔΙΑ','SUPPLIES','ПРИПАСИ'],save:['Η συλλογή και τα νομίσματα μένουν σε αυτόν τον browser.','Your collection and coins stay in this browser.','Колекція й монети зберігаються в цьому браузері.'],nosave:['Αποθήκευση μόνο για αυτή την παρτίδα.','Saved for this session only.','Збережено лише на цей сеанс.'],pulse:['ΙΣΤΟΡΙΑ YOTO! +20 ΖΩΗ · +35 ΕΝΕΡΓΕΙΑ · +2 ΝΟΜΙΣΜΑΤΑ','YOTO STORY! +20 HEALTH · +35 ENERGY · +2 COINS','ІСТОРІЯ YOTO! +20 ЗДОРОВ’Я · +35 ЕНЕРГІЇ · +2 МОНЕТИ'],needset:['ΒΡΕΣ ΚΑΙ ΤΙΣ 3 ΚΑΡΤΕΣ ΓΙΑ ΤΗ ΜΟΥΣΙΚΗ','FIND ALL 3 CARDS TO UNLOCK MUSIC','ЗНАЙДИ ВСІ 3 КАРТКИ, ЩОБ ВІДКРИТИ МУЗИКУ'],needcoins:['ΧΡΕΙΑΖΕΣΑΙ ΠΕΡΙΣΣΟΤΕΡΑ ΝΟΜΙΣΜΑΤΑ','MORE COINS NEEDED','ПОТРІБНО БІЛЬШЕ МОНЕТ']};
for(const key of Object.keys(COLLECTION_WORDS))COLLECTION_WORDS[key]=chapterText(...COLLECTION_WORDS[key]);
COLLECTION_WORDS.help=chapterText('Ψάξε τα κιβώτια με την πορτοκαλί κάρτα. Κάθε 3 κάρτες δίνουν στην ομάδα +20 ζωή, +35 ενέργεια και 2 νομίσματα.','Look for crates marked with an orange card. Every 3 cards give the team +20 health, +35 energy and 2 coins.','Шукай ящики з помаранчевою карткою. Кожні 3 картки дають команді +20 здоров’я, +35 енергії та 2 монети.');
COLLECTION_WORDS.muted=chapterText('ΑΝΟΙΞΕ ΤΗ ΜΟΥΣΙΚΗ ΣΤΙΣ ΡΥΘΜΙΣΕΙΣ','ENABLE MUSIC IN SETTINGS','УВІМКНИ МУЗИКУ В НАЛАШТУВАННЯХ');
