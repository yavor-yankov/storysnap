// AI image generation pipeline
// Priority: fal.ai (production, face-swap) → HuggingFace (free dev) → mock

import { fal } from "@fal-ai/client";
import { HfInference } from "@huggingface/inference";
import { buildCharacterAnchor } from "@/lib/story/generator";
import type { ChildAttributes } from "@/types";

export interface FaceSwapInput {
  storyId: string;
  pageNumber: number;
  illustrationUrl: string;
  portraitUrls: string[];
  childName: string;
  isPreview: boolean;
}

export interface FaceSwapResult {
  pageNumber: number;
  imageUrl: string;
  textContent: string;
}

// Per-story page text (24 pages each — cycles if fewer defined)
const PAGE_TEXTS: Record<string, string[]> = {
  "kosmichesko-priklyuchenie": [
    "Имало едно време едно храбро дете на име {name}, което обичало да гледа звездите.",
    "Една нощ {name} забелязало светлина в градината — малка ракета, готова за полет!",
    "С биещо сърце {name} се качило вътре и натиснало големия червен бутон.",
    "БУМ! Ракетата профучала нагоре и {name} видяло как Земята ставала все по-малка.",
    "Около {name} блестели милиони звезди — всяка от тях криела своя тайна.",
    "Изведнъж нещо зелено и кръгло се появило пред иллюминатора. Извънземно приятелче!",
    "То се казвало Зорко и поканило {name} да разгледат неговата планета.",
    "Планетата Зора имала розови дървета и лилави реки от сладък сок.",
    "{name} и Зорко яли плодове с вкус на дъга и се смеели до сълзи.",
    "Зорко показал на {name} тайната карта на цялата галактика.",
    "Заедно открили нова звезда и я нарекли на {name} — за вечни времена!",
    "{name} научило как да говори на езика на звездите.",
    "Двамата приятели изградили ракета от кристали и полетели към Млечния път.",
    "По пътя срещнали метеоритен дъжд — и танцували сред него!",
    "Лунният принц ги поканил на чай с лунен мед и звезден прах.",
    "На Луната {name} направило три скока и достигнало до самите облаци.",
    "Слънцето им намигнало и изпратило лъч, за да ги огрее.",
    "Дошло времето за сбогуване. Зорко дал на {name} кристал, който светел в тъмното.",
    "{name} обещало да се върне и Зорко обещало да чака.",
    "Ракетата отново профучала — надолу, надолу, към Земята.",
    "Градината изглеждала точно така, сякаш нищо не се е случило.",
    "{name} влязло вкъщи с кристала в ръка и усмивка на лицето.",
    "Тази нощ {name} заспало с поглед към прозореца, където мигала нова звезда.",
    "Краят. Или може би — само началото на следващото приключение на {name}.",
  ],
  "printsesata-ot-izgreva": [
    "В земята на изгряващото слънце живяло едно дете на име {name}.",
    "Всяка сутрин {name} се събуждало преди всички, за да посрещне зората.",
    "Птиците пеели само за {name} — тя знаела техния език.",
    "Една сутрин в горичката {name} намерило вълшебна корона от злато и рози.",
    "Когато я сложило, светлина заляла цялата гора и животните излезли.",
    "Лисицата, мечката и еленчето се поклонили пред {name}.",
    '"Ти си принцесата на Изгрева!" — провъзгласили те с един глас.',
    "{name} се засмяло и прегърнало всяко животинче едно по едно.",
    "Заедно тръгнали да открият откъде идва вълшебната корона.",
    "Пътят минавал през Серебърната гора, пълна с пеещи цветя.",
    "{name} спряло да изслуша песента им и научило мелодията на пролетта.",
    "Стигнали до Планината на Зората, където живяла мъдрата фея Aurora.",
    '"Коронята принадлежи на онзи, чието сърце е чисто като утринната роса"',
    "Фея Аурора дала на {name} трите дара: мъдрост, доброта и смелост.",
    "{name} използвало мъдростта, за да помогне на изгубеното зайче да намери дома си.",
    "Използвало добротата, за да изцери наранения гарван с листо от магическата гора.",
    "И смелостта — за да спре гръмотевицата, която плашела малкото елени.",
    "Животните пяли в чест на {name} и горите отекнали от радост.",
    "Върнали се в горичката, но вече не сами — с цяло царство от приятели.",
    "Коронята засветила по-ярко от всякога върху главата на {name}.",
    "Залезът боядисал небето в цветовете на прегръдката — розово, злато и оранжево.",
    "{name} погледнало към хоризонта и знаело: утре ще изгрее ново слънце.",
    "Тази вечер историите на {name} щели да пазят сърцата на всички.",
    "И принцесата на Изгрева {name} царувала с любов завинаги.",
  ],
  "supergerojski-den": [
    "{name} се събудило сутринта и усетило нещо различно — силата на герой!",
    "Под възглавницата лежала наметка в цветовете на {name} — оранжева и златна.",
    "Щом я сложило, {name} можело да скача по-високо от всеки покрив в града.",
    "Първата мисия: помогни на котето на г-жа Мария да слезе от дървото.",
    "{name} прелетяло до дървото, подало ръка, и котето заурчало доволно.",
    '"Благодаря, суперхерой!" — извикала г-жа Мария и всички съседи аплодирали.',
    "Втора мисия: спасете пазара от голямото вятърно бурче.",
    "{name} надуло своя супер-дъх и разпръснало облаците.",
    "Слънцето отново огряло и търговците извикали: 'Ура за {name}!'",
    "Трета мисия: намерете изгубеното балонче на малкия Иво.",
    "{name} хвръкнало в небето и настигнало балончето точно преди да се изгуби.",
    "Малкият Иво се засмял и дал на {name} шоколад — наградата на деня.",
    "Но дошло и предизвикателство: Злия Гълчач искал да открадне радостта на детския площад.",
    "{name} застанало смело пред него и казало: 'Тук децата са щастливи!'",
    "Гълчачът се засрамил и признал, че му е самотно.",
    "{name} го поканило да играе и скоро Гълчачът станал добрия Ехо.",
    "Площадката огърмяла от смях и {name} разбрало: истинският герой обединява.",
    "Края на деня — {name} кацнало на покрива и гледало залеза.",
    "Целият град светял долу, пълен с хора, на които {name} помогнало.",
    "Наметката потрепнала в лекия ветрец, сякаш казвала: 'Утре пак!'",
    "{name} се прибрало, сложило наметката под възглавницата.",
    "Мама и татко го прегърнали и {name} усетило — тяхната прегръдка е най-голямата суперсила.",
    "Тази нощ {name} сънувало нови мисии и нови приятели.",
    "Защото когато сърцето е добро, всеки ден е суперхеройски ден за {name}.",
  ],
  "v-dzhunglata-na-priyatelite": [
    "В края на горичката зад дома живяло едно любопитно дете на име {name}.",
    "Един следобед {name} последвало пеперудата и се озовало в непознат свят.",
    "Джунглата! Зелена, буйна, пълна с цветове и звуци.",
    "Голям тукан кацнал на рамото на {name}: 'Добре дошло! Аз съм Туко!'",
    "Туко обяснил: 'Всяко дете, което дойде тук с чисто сърце, ще намери приятели.'",
    "{name} скоро срещнало малкото слонче Ела, което тъжно седяло край локвата.",
    "'Изгубих семейството си' — казало Ела с треперещ хобот.",
    "{name} прегърнало Ела: 'Ще те помогна! Заедно ще ги намерим!'",
    "Тръгнали заедно — {name}, Туко и Ела — навътре в джунглата.",
    "Минали покрай Реката на Папагалите, където птиците пеели в сто цвята.",
    "{name} помогнало на папагала Роко да намери загубеното му яйце.",
    "В замяна Роко показал тайния път към Слоновата поляна.",
    "По пътя {name} срещнало малките маймунки, заседнали на клон.",
    "С хитрост и смях {name} им помогнало да слязат, и те му поднесли сладки плодове.",
    "Накрая стигнали до Слоновата поляна — семейството на Ела чакало там!",
    "Ела затичала и се хвърлила в прегръдките на майка си.",
    "Всички слонове заобиколили {name} и го погалили с хоботи.",
    "'Ти имаш сърцето на джунглата!' — казала мама слон.",
    "{name} разбрало: приятелството расте там, където помагаш без да очакваш нищо.",
    "Туко пеел, Роко танцувал, маймунките се люлеели — партито започнало!",
    "Залезът боядисал джунглата в злато и {name} танцувало с новите си приятели.",
    "Дошло времето за връщане, но {name} взело едно семенце от джунглата.",
    "Засяло го в градинката у дома — и всяка пролет то цъфтяло в памет на приятелите.",
    "Джунглата на приятелите живеела в сърцето на {name} завинаги.",
  ],
  "malkiyat-gotvach": [
    "В малката кухня на бабата {name} открило своята страст — готварството!",
    "Бабата дала на {name} малка бяла престилка и шапка на готвача.",
    "'{name}, днес ще приготвим нещо вълшебно!' — казала тя с усмивка.",
    "Първата рецепта: магическа супа от зеленчуци и смях.",
    "{name} нарязало морковите на звездички — защото красивата форма прави храната по-вкусна.",
    "Тенджерата забулбукала и ухаещата пара накарала всички в дома да дойдат.",
    "Татко, мама и братчето дошли с носове нагоре, следвайки аромата.",
    "'Кой готви тук?' — попитал татко изненадан.",
    "'{name}!' — извикали всички и се засмели.",
    "Следващото предизвикателство: торта за рождения ден на приятелче.",
    "{name} разбило яйцата, смесило брашното и залело с ванилия.",
    "Тестото влязло в пещта и {name} чакало нетърпеливо пред стъклото.",
    "Когато вратата се отворила, из кухнята лъхнало облак от сладост.",
    "Тортата с ягоди и сметана изглеждала като от приказка!",
    "Приятелите откъснали по едно парче и очите им засветили от удоволствие.",
    "'{name}, ти си истински готвач!' — казали те с пълни уста.",
    "Но едно предизвикателство оставало: ястие само от три съставки.",
    "{name} избрало: ябълки, мед и канела — и направило топъл ябълков крамбъл.",
    "Бабата го опитала и сълзи заблестели в очите й от радост.",
    "'Тази рецепта е по-добра от моята!' — призналa тя.",
    "{name} разбрало: в готварството се слагат и любов, и търпение.",
    "В края на деня, с вкусно по устата и брашно по носа, {name} се усмихнало.",
    "Кухнята се превърнала в любимото място на {name} — там ставала магия.",
    "И оттогава малкият готвач {name} готвел с любов за всички около него.",
  ],
  "piratite-na-cherno-more": [
    "На брега на Черно море {name} намерило стара бутилка с карта вътре.",
    "Картата показвала остров с кръст — там се криело съкровище!",
    "{name} построило сал от дървета и наредило платно от старо одеяло.",
    "Вятърът надул платното и приключението започнало!",
    "Вълните танцували около салa и {name} кормилото държало здраво.",
    "На хоризонта се появил кораб с черен флаг — Пиратският отряд на Дядо Бурен!",
    "Но Дядо Бурен не бил злодей — той бил добро старо мореплавателче с бяла брада.",
    "'Хей, младеж! Видях ти смелостта — искаш ли да плаваш с нас?'",
    "{name} се качило на кораба и станало най-малкият пират на Черно море.",
    "Корабът бил пълен с карти, телескопи и стари истории.",
    "Дядо Бурен научил {name} как да чете звездите за навигация.",
    "Буреносните облаци ги задигнали, но {name} не се уплашило — напротив, засмяло се!",
    "'Ха! Бурята е само пореден авантюрист!' — извикало {name}.",
    "Екипажът на пиратите се засмял и полюбил малкия смелчага.",
    "Достигнали острова с кръста на картата.",
    "{name} копало и копало под стария дъб.",
    "Сандъкът с ключалката се появил и всички затаили дъх.",
    "Вътре нямало злато — намерили книга с всички пиратски истории на Черно море.",
    "'{name}, тези истории са по-ценни от злато!' — казал Дядо Бурен.",
    "{name} разбрало: истинското съкровище са преживяванията и приятелите.",
    "Написали нова страница за приключението на {name} в книгата.",
    "Върнали се на брега с книгата, песни и спомени.",
    "Мама чакала на брега с топла супа и прегръдка.",
    "Тази вечер {name} спало, слушайки шума на морето, и сънувало следващото пиратско приключение.",
  ],
  "feyata-na-gorite": [
    "Дълбоко в стария дъбов лес живяло едно тайнствено дете на име {name}.",
    "{name} обичало да слуша шума на листата и да разговаря с буболечките.",
    "Един вечер, когато луната изгряла пълна и ярка, горите оживели.",
    "Малко светлячево топчице кацнало на пръста на {name}: 'Ела с мен!'",
    "Следвайки светлячето, {name} стигнало до поляна, пълна с цветя, светещи в тъмното.",
    "Там феите танцували около огромен гъб, пеейки песни на вятъра.",
    "Кралицата на феите, Silvana, протегнала прозрачното си крило към {name}.",
    "'Детето с доброто сърце — нашата гора има нужда от теб!'",
    "Горите плачели, защото злото Сухолистие краднело цветовете им.",
    "{name} решило да помогне без колебание.",
    "Silvana дала на {name} вълшебна пръчица, направена от светлина и роса.",
    "Тръгнали към Сухолистие — {name} и малкото фейче Лора.",
    "По пътя {name} помогнало на паяка да преплете паяжината си след бурята.",
    "Спасило гнездото на птицата чинка от падащ клон.",
    "И дало вода на изсъхващото цветe в средата на пътеката.",
    "Всяко добро дело правело пръчицата по-ярка.",
    "Достигнали Сухолистие — сиво и тъжно кралство без цвят.",
    "{name} вдигнало пръчицата нагоре и избликнало светлина!",
    "Цветовете се върнали един по един: първо зеленото, после жълтото, после всичко останало.",
    "Сухолистие затрептяло от радост и се преименувало на Цветолистие.",
    "Феите пели, животните танцували, горите светели.",
    "Silvana наредила: '{name} е завинаги приятел на нашата гора.'",
    "{name} получило малко крилца от светлина — за да лети в мечтите.",
    "И завинаги, щом влизало в гората, листата шептели: 'Добре дошло, {name}.'",
  ],
  "dinozavarat-priyatel": [
    "В зеления двор {name} копало и намерило нещо твърдо и кръгло — яйце!",
    "Яйцето се люлеело и от него се чувало тихо чукане.",
    "ПУК! Малка зелена глава изникнала — динозавърче!",
    "'Дино!' — казало {name} и динозавърчето замахало с опашка в знак на одобрение.",
    "Дино бил малък като куче, но яжде само листа и обича прегръдки.",
    "{name} скрило Дино в градинката и двамата станали неразделни.",
    "Дино следвал {name} навсякъде — до детската градина, до парка, до супермаркета.",
    "Хората гледали изненадано, но {name} обяснявало: 'Той е моят приятел!'",
    "Един ден Дино израсъл с един сантиметър — и после с още един.",
    "{name} наблюдавало как Дино расте и се учело за динозаврите от книги.",
    "Дино харесвал мелодиите и когато {name} пеело, той затварял очи доволно.",
    "Заедно играели на прятелство и Дино всеки път намирал {name} след броене.",
    "Но дошъл денят, когато Дино станал прекалено голям за двора.",
    "Очите на Дино гледали тъжно — и {name} разбрало какво трябва да направи.",
    "Намерили карта на резерват за динозаври в далечна зелена долина.",
    "{name} и Дино тръгнали заедно на последното си пътешествие.",
    "По пътя Дино пазел {name} от бурята, покривайки го с крило.",
    "А {name} пазел Дино — показвайки му правилния път.",
    "Стигнали до Зелената долина — там живеели и други динозаври.",
    "Дино зарадвал и животът му светнал — той бил вкъщи.",
    "{name} прегърнало Дино за последен път. 'Ще се върна да те видя, обещавам!'",
    "Дино издал дълъг, топъл вик, който означавал: 'Обичам те, приятелю.'",
    "{name} се върнало вкъщи, но малкото яйце на рафта напомняло за тяхната история.",
    "Понеже истинските приятели остават в сърцето завинаги — и {name} знаело това.",
  ],
  default: [
    "Имало едно време едно дете на име {name}, което обичало приключенията.",
    "{name} живяло в малка, но уютна къщичка с голяма градина.",
    "Всеки ден {name} откривало нещо ново в своя свят.",
    "Едно сутринта {name} се събудило с усещане, че днес е специален ден.",
    "И наистина — зад прозореца чакало вълшебно изненадващо приключение.",
    "{name} облякло любимата си дреха и тръгнало напред с широка усмивка.",
    "По пътя {name} срещнало приятелче, което имало нужда от помощ.",
    "Без колебание {name} протегнало ръка и двамата тръгнали заедно.",
    "Стигнали до красива гора, пълна с пеещи птички и цъфтящи цветя.",
    "Горите им разказали тайни, познати само на онези с отворено сърце.",
    "{name} слушало внимателно и научило много мъдрости.",
    "Появил се и малък дракончe — не страшен, а любопитен и приятелски.",
    "Дракончето се присъединило към групата и ги закарало до вълшебна поляна.",
    "На поляната цветята пеели и листата танцували в лекия ветрец.",
    "{name} танцувало заедно с тях и сърцето му препълнило от радост.",
    "Срещнали и мъдрата бухал, която им дала три ценни съвета.",
    "Съветите помогнали на {name} да реши трудна загадка по пътя напред.",
    "Загадката водела до скрита пещера, пълна с блестящи кристали.",
    "{name} взело един кристал — подарък от приключението.",
    "Слънцето започнало да залязва и {name} знаело, че е дошло времето за връщане.",
    "Сбогувало се с приятелите си с обещание да се върне скоро.",
    "Пътят вкъщи изглеждал по-кратък — може би защото сърцето mu билo леко.",
    "Вкъщи {name} разказало историята на всички и очите им заблестели.",
    "Тази нощ {name} заспало с усмивка и мечти за следващото вълшебно приключение.",
  ],
};

function getPageText(storySlug: string, pageNum: number, childName: string): string {
  const texts = PAGE_TEXTS[storySlug] ?? PAGE_TEXTS.default;
  const template = texts[(pageNum - 1) % texts.length];
  return template.replace(/{name}/g, childName);
}

// ─── Story-specific scene context per page ───────────────────────────────────

const STORY_STYLES: Record<string, { scene: string; palette: string; mood: string }> = {
  "kosmichesko-priklyuchenie": {
    scene: "outer space adventure, colorful nebulas, rocket ship, alien planets, floating stars and moons",
    palette: "deep indigo and purple sky, golden stars, bright teal accents, warm orange spaceship",
    mood: "exciting, wonder, cosmic magic",
  },
  "printsesata-ot-izgreva": {
    scene: "magical sunrise kingdom, enchanted forest, golden morning light, castle towers, talking animals",
    palette: "warm rose and gold sunrise, soft lavender shadows, emerald green leaves, pearl white castle",
    mood: "warm, magical, gentle, fairy tale",
  },
  "supergerojski-den": {
    scene: "bright colorful city, superhero flying above rooftops, cape flowing in wind, sunny day",
    palette: "vivid blue sky, bold primary colors, gleaming city buildings, warm sunlight",
    mood: "heroic, energetic, fun, triumphant",
  },
  "v-dzhunglata-na-priyatelite": {
    scene: "lush tropical jungle, friendly exotic animals, waterfall, rainbow, giant colorful flowers",
    palette: "vibrant emerald and lime greens, tropical orange and pink flowers, warm golden light",
    mood: "playful, adventurous, warm, friendship",
  },
  "malkiyat-gotvach": {
    scene: "cozy magical kitchen, huge colorful cakes and pastries, chef hat, wooden spoon, bubbling pots",
    palette: "warm terracotta and cream kitchen, colorful pastries, soft golden candlelight",
    mood: "cozy, joyful, delicious, homey",
  },
  "piratite-na-cherno-more": {
    scene: "pirate ship on glittering ocean, treasure chest, treasure map, seagulls, dramatic sunset sky",
    palette: "deep teal sea, warm orange and gold sunset, weathered wood browns, bright white sails",
    mood: "adventurous, dramatic, exciting, treasure hunt",
  },
  "feyata-na-gorite": {
    scene: "glowing enchanted forest, tiny fairies with light wings, fireflies, glowing mushrooms, moonlight",
    palette: "moonlit silver and deep forest green, glowing golden fairy light, soft purple shadows",
    mood: "magical, serene, mysterious, enchanting",
  },
  "dinozavarat-priyatel": {
    scene: "lush prehistoric jungle, friendly cute baby dinosaur, giant ferns, tropical flowers, blue sky",
    palette: "rich jungle greens, warm earthy browns, bright blue sky, vivid tropical flowers",
    mood: "playful, warm, adventurous, heartwarming friendship",
  },
};

const BASE_STYLE =
  "beautiful children's book illustration, professional watercolor and digital art style, " +
  "soft painterly textures, gentle brushstrokes, warm light, rich detailed background, " +
  "cute cartoon-realistic child character, expressive big eyes, rounded shapes, " +
  "award-winning picture book quality, Pixar-inspired warmth, full composition, no text";

const NEGATIVE_PROMPT =
  "ugly, deformed, blurry, low quality, bad anatomy, extra limbs, realistic photo, " +
  "dark, scary, horror, violence, adult content, text, watermark, signature, logo, " +
  "cropped, out of frame, grainy, oversaturated, harsh lighting";

async function generateWithHuggingFace(params: {
  childName: string;
  pageNumber: number;
  storySlug: string;
  isPreview: boolean;
  customPrompt?: string;
}): Promise<string> {
  const hf = new HfInference(process.env.HF_TOKEN);
  const style = STORY_STYLES[params.storySlug] ?? {
    scene: "magical fairy tale adventure",
    palette: "soft pastel rainbow colors",
    mood: "warm, whimsical, magical",
  };

  const prompt = params.customPrompt ?? (
    `${BASE_STYLE}, ` +
    `${style.scene}, ` +
    `${style.palette}, ` +
    `${style.mood} atmosphere, ` +
    `adorable child hero named ${params.childName}, ` +
    `storybook page ${params.pageNumber}, ` +
    `children's picture book spread, square format`
  );

  const result = await hf.textToImage({
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    inputs: prompt,
    parameters: {
      negative_prompt: NEGATIVE_PROMPT,
      num_inference_steps: params.isPreview ? 25 : 40,
      guidance_scale: 8.5,
      width: 1024,
      height: 1024,
    },
  });

  // SDK returns Blob at runtime; cast to access arrayBuffer()
  const blob = result as unknown as Blob;
  const buffer = Buffer.from(await blob.arrayBuffer());
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

// ─── fal.ai generation ───────────────────────────────────────────────────────

async function generateWithFal(params: {
  portraitUrl: string;
  childName: string;
  pageNumber: number;
  storySlug: string;
  isPreview: boolean;
  customPrompt?: string;
}): Promise<string> {
  fal.config({ credentials: process.env.FAL_KEY });
  const style = STORY_STYLES[params.storySlug] ?? {
    scene: "magical fairy tale adventure",
    palette: "soft pastel rainbow colors",
    mood: "warm, whimsical, magical",
  };

  const prompt = params.customPrompt ?? (
    `${BASE_STYLE}, ` +
    `${style.scene}, ` +
    `${style.palette}, ` +
    `${style.mood} atmosphere, ` +
    `child hero ${params.childName} as main character, ` +
    `storybook page ${params.pageNumber}, square format`
  );

  const result = (await fal.subscribe("fal-ai/ip-adapter-face-id", {
    input: {
      prompt,
      negative_prompt: NEGATIVE_PROMPT,
      face_image_url: params.portraitUrl,
      num_inference_steps: params.isPreview ? 25 : 35,
      guidance_scale: 8.0,
    },
    logs: false,
  })) as unknown as { images: { url: string }[] };

  return result.images[0].url;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * generatePreviewPages — 5 pages, used on /create before payment.
 * Accepts pre-generated story pages (with imagePrompts) from the story generator,
 * or falls back to PAGE_TEXTS + auto-built prompts.
 */
export async function generatePreviewPages(params: {
  storySlug: string;
  storyId: string;
  portraitUrls: string[];
  childName: string;
  pageCount?: number;
  storyPages?: Array<{ pageNumber: number; storyText: string; imagePrompt: string }>;
  childAge?: number;
  childGender?: "boy" | "girl" | "unisex";
  childAttributes?: ChildAttributes;
}): Promise<FaceSwapResult[]> {
  const { storySlug, childName, portraitUrls, pageCount = 5, storyPages,
          childAge, childGender, childAttributes } = params;
  return runGeneration({ storySlug, childName, portraitUrls, pageCount, isPreview: true,
                         storyPages, childAge, childGender, childAttributes });
}

/**
 * generateFullPages — called from the Stripe webhook after payment.
 * pageCount defaults to 24; set BOOK_PAGE_COUNT env var to override (e.g. 10 for testing).
 */
export async function generateFullPages(params: {
  storySlug: string;
  storyId: string;
  portraitUrls: string[];
  childName: string;
  pageCount?: number;
  storyPages?: Array<{ pageNumber: number; storyText: string; imagePrompt: string }>;
  childAge?: number;
  childGender?: "boy" | "girl" | "unisex";
  childAttributes?: ChildAttributes;
}): Promise<FaceSwapResult[]> {
  const { storySlug, childName, portraitUrls, pageCount = 24, storyPages,
          childAge, childGender, childAttributes } = params;
  return runGeneration({ storySlug, childName, portraitUrls, pageCount, isPreview: false,
                         storyPages, childAge, childGender, childAttributes });
}

// ─── Provider priority: Replicate → fal.ai → HuggingFace → mock ──────────────

async function runGeneration(params: {
  storySlug: string;
  childName: string;
  portraitUrls: string[];
  pageCount: number;
  isPreview: boolean;
  storyPages?: Array<{ pageNumber: number; storyText: string; imagePrompt: string }>;
  childAge?: number;
  childGender?: "boy" | "girl" | "unisex";
  childAttributes?: ChildAttributes;
}): Promise<FaceSwapResult[]> {
  const { storySlug, childName, portraitUrls, pageCount, isPreview, storyPages,
          childAge, childGender, childAttributes } = params;

  // Character anchor — prepended to fallback image prompts for visual consistency
  const characterAnchor = buildCharacterAnchor({ childAge, childGender, attributes: childAttributes });

  const hasReplicate = !!process.env.REPLICATE_API_TOKEN;
  const hasFal       = !!process.env.FAL_KEY;
  const hasHf        = !!process.env.HF_TOKEN;
  const portraitUrl  = portraitUrls[0] ?? "";

  // Base seed keeps character consistent; per-page offset varies composition
  const baseSeed = Math.floor(Math.random() * 900_000) + 1000;

  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

  // ── Helper: get text + imagePrompt for a page ──────────────────────────────
  function getPageData(pageNum: number): { storyText: string; imagePrompt: string } {
    const pre = storyPages?.find((p) => p.pageNumber === pageNum);
    // If the AI story generator already produced imagePrompts, use them as-is —
    // they already have the character anchor baked in via generator.ts.
    if (pre) return { storyText: pre.storyText, imagePrompt: pre.imagePrompt };

    // Fallback path: build a prompt from PAGE_TEXTS + character anchor
    const storyText = getPageText(storySlug, pageNum, childName);
    const style = STORY_STYLES[storySlug] ?? {
      scene: "magical adventure",
      palette: "soft pastel colours",
      mood: "warm, whimsical",
    };
    const imagePrompt =
      `${characterAnchor}. ` +
      `Page ${pageNum}: ${storyText.replace(new RegExp(childName, "gi"), "the child").slice(0, 200)}. ` +
      `Setting: ${style.scene}. Colour palette: ${style.palette}. Mood: ${style.mood} atmosphere. ` +
      `The same child character maintaining exact face from reference portrait photo appears as hero. ` +
      BASE_STYLE;

    return { storyText, imagePrompt };
  }

  // ── Replicate path (primary) ───────────────────────────────────────────────
  if (hasReplicate) {
    console.log(`[Generation] Using Replicate (${process.env.REPLICATE_MODEL ?? "flux-kontext-dev"})`);
    try {
      const { generateReplicatePages } = await import("@/lib/ai/replicate");
      const inputs = pageNumbers.map((i) => {
        const { imagePrompt } = getPageData(i);
        // Each page gets a unique seed offset so compositions differ while character stays consistent
        const seed = baseSeed + i * 37;
        return { prompt: imagePrompt, portraitUrl: portraitUrl || undefined, pageNumber: i, seed, isPreview };
      });

      const batchSize = isPreview ? 5 : 6;
      const results = await generateReplicatePages(inputs, batchSize);

      // Ensure all imageUrls are strings (Replicate SDK can return URL objects)
      const normalizedResults = results.map((r) => ({
        ...r,
        imageUrl: typeof r.imageUrl === "string"
          ? r.imageUrl
          : typeof (r.imageUrl as unknown as { toString: () => string })?.toString === "function"
            ? (r.imageUrl as unknown as { toString: () => string }).toString()
            : `mock:replicate-error:${r.pageNumber}`,
      }));

      // If ALL pages failed (e.g. 402 no credits), fall through to next provider
      const allFailed = normalizedResults.every((r) => r.imageUrl.startsWith("mock:replicate-error"));
      if (allFailed) {
        console.warn("[Generation] Replicate returned all errors — falling through to next provider");
        throw new Error("All Replicate pages failed");
      }

      return normalizedResults.map((r) => ({
        pageNumber: r.pageNumber,
        imageUrl: r.imageUrl,
        textContent: getPageData(r.pageNumber).storyText,
      })).sort((a, b) => a.pageNumber - b.pageNumber);
    } catch (err) {
      console.error("[Generation] Replicate failed, falling back to fal.ai:", err);
    }
  }

  // ── fal.ai path (secondary) ────────────────────────────────────────────────
  if (hasFal) {
    console.log("[Generation] Using fal.ai (ip-adapter-face-id)");
    try {
      const pages = await Promise.all(
        pageNumbers.map(async (i) => {
          const { storyText, imagePrompt } = getPageData(i);
          try {
            const imageUrl = await generateWithFal({
              portraitUrl,
              childName,
              pageNumber: i,
              storySlug,
              isPreview,
              customPrompt: imagePrompt,
            });
            return { pageNumber: i, imageUrl, textContent: storyText };
          } catch (falErr) {
            console.error(`[Generation] fal.ai page ${i} failed:`, falErr);
            return { pageNumber: i, imageUrl: `mock:fal-error:${i}`, textContent: storyText };
          }
        })
      );
      return pages.sort((a, b) => a.pageNumber - b.pageNumber);
    } catch (err) {
      console.error("[Generation] fal.ai failed, falling back to HuggingFace:", err);
    }
  }

  // ── HuggingFace path (free fallback) ───────────────────────────────────────
  if (hasHf) {
    console.log("[Generation] Using HuggingFace SDXL (free, no face-swap)");
    const pages = await Promise.all(
      pageNumbers.map(async (i) => {
        const { storyText, imagePrompt } = getPageData(i);
        try {
          const imageUrl = await generateWithHuggingFace({ childName, pageNumber: i, storySlug, isPreview, customPrompt: imagePrompt });
          return { pageNumber: i, imageUrl, textContent: storyText };
        } catch {
          return { pageNumber: i, imageUrl: `mock:hf-error:${i}`, textContent: storyText };
        }
      })
    );
    return pages.sort((a, b) => a.pageNumber - b.pageNumber);
  }

  // ── Mock path (no API keys) ────────────────────────────────────────────────
  console.log("[Generation] No AI keys configured — using mock placeholders");
  return pageNumbers.map((i) => ({
    pageNumber: i,
    imageUrl: `mock:page:${storySlug}:${i}:${isPreview ? "preview" : "full"}`,
    textContent: getPageData(i).storyText,
  }));
}
