// Translate tarot card data from English to ja/fr/ru
const fs = require("fs");
const path = require("path");

const en = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/tarot/en.json"), "utf-8")
);

// === CARD NAME MAPS ===

const majorNames = {
  ja: ["愚者","魔術師","女教皇","女帝","皇帝","教皇","恋人","戦車","力","隠者","運命の輪","正義","吊るされた男","死神","節制","悪魔","塔","星","月","太陽","審判","世界"],
  fr: ["Le Fou","Le Bateleur","La Papesse","L'Impératrice","L'Empereur","Le Pape","L'Amoureux","Le Chariot","La Force","L'Ermite","La Roue de Fortune","La Justice","Le Pendu","La Mort","Tempérance","Le Diable","La Tour","L'Étoile","La Lune","Le Soleil","Le Jugement","Le Monde"],
  ru: ["Дурак","Маг","Верховная Жрица","Императрица","Император","Иерофант","Влюблённые","Колесница","Сила","Отшельник","Колесо Фортуны","Справедливость","Повешенный","Смерть","Умеренность","Дьявол","Башня","Звезда","Луна","Солнце","Суд","Мир"],
};

const suitNames = {
  cups:  { ja: "カップ", fr: "Coupe",    ru: "Кубков" },
  wands: { ja: "ワンド", fr: "Bâton",    ru: "Жезлов" },
  swords:{ ja: "ソード", fr: "Épée",     ru: "Мечей" },
  pentacles: { ja: "ペンタクル", fr: "Denier", ru: "Пентаклей" },
};

const rankNames = {
  ace:   { ja: "エース", fr: "As",       ru: "Туз" },
  two:   { ja: "2",      fr: "Deux",     ru: "Двойка" },
  three: { ja: "3",      fr: "Trois",    ru: "Тройка" },
  four:  { ja: "4",      fr: "Quatre",   ru: "Четвёрка" },
  five:  { ja: "5",      fr: "Cinq",     ru: "Пятёрка" },
  six:   { ja: "6",      fr: "Six",      ru: "Шестёрка" },
  seven: { ja: "7",      fr: "Sept",     ru: "Семёрка" },
  eight: { ja: "8",      fr: "Huit",     ru: "Восьмёрка" },
  nine:  { ja: "9",      fr: "Neuf",     ru: "Девятка" },
  ten:   { ja: "10",     fr: "Dix",      ru: "Десятка" },
  page:  { ja: "ペイジ", fr: "Page",     ru: "Паж" },
  knight:{ ja: "ナイト", fr: "Chevalier",ru: "Рыцарь" },
  queen: { ja: "クイーン",fr: "Reine",   ru: "Королева" },
  king:  { ja: "キング", fr: "Roi",      ru: "Король" },
};

const rankKeys = ["ace","two","three","four","five","six","seven","eight","nine","ten","page","knight","queen","king"];

function minorName(id, lang) {
  const minorIndex = id - 22;
  const suitIdx = Math.floor(minorIndex / 14);
  const rankIdx = minorIndex % 14;
  const suits = ["wands","cups","swords","pentacles"];
  const suit = suits[suitIdx];
  const rank = rankKeys[rankIdx];
  if (lang === "ja") return `${suitNames[suit].ja}の${rankNames[rank].ja}`;
  if (lang === "fr") return `${rankNames[rank].fr} de ${suitNames[suit].fr}${rank === "ace" ? "" : "s"}`;
  if (lang === "ru") return `${rankNames[rank].ru} ${suitNames[suit].ru}`;
}

// === KEYWORD TRANSLATION MAPS ===

const kwMap = {
  ja: {
    beginnings:"始まり",freedom:"自由",innocence:"純真",journey:"旅",faith:"信念",
    power:"力",skill:"技術",manifestation:"顕現",focus:"集中",action:"行動",
    intuition:"直感",mystery:"神秘",wisdom:"知恵",patience:"忍耐",balance:"調和",
    creativity:"創造",growth:"成長",nurturing:"育成",abundance:"豊かさ",beauty:"美",
    authority:"権威",structure:"構造",control:"支配",leadership:"統率",order:"秩序",
    tradition:"伝統",knowledge:"知識",guidance:"導き",spirituality:"精神性",education:"教育",
    love:"愛",choice:"選択",partnership:"協力",harmony:"調和",connection:"繋がり",
    victory:"勝利",determination:"決意",direction:"方向",triumph:"克服",progress:"前進",
    courage:"勇気",strength:"強さ",compassion:"思いやり",resilience:"回復力",taming:"制御",
    solitude:"孤独",reflection:"内省",innerGuidance:"内的導き",contemplation:"熟考",withdrawal:"撤退",
    change:"変化",cycles:"循環",destiny:"運命",turningPoint:"転機",luck:"幸運",
    fairness:"公平",truth:"真実",accountability:"責任",clarity:"明晰",law:"法",
    surrender:"降伏",lettingGo:"手放し",newPerspective:"新視点",sacrifice:"犠牲",pause:"停止",
    transformation:"変容",ending:"終焉",rebirth:"再生",release:"解放",transition:"移行",
    moderation:"中庸",healing:"癒し",integration:"統合",flow:"流れ",renewal:"再生",
    shadow:"影",attachment:"執着",temptation:"誘惑",bondage:"束縛",materialism:"物質主義",
    destruction:"破壊",awakening:"覚醒",upheaval:"激変",revelation:"啓示",collapse:"崩壊",
    hope:"希望",inspiration:"啓示",serenity:"静寂",renewalStar:"新たな希望",faithStar:"信念",
    illusion:"幻想",subconscious:"潜在意識",fear:"恐れ",intuitionMoon:"直感",mysteryMoon:"神秘",
    joy:"喜び",vitality:"活力",success:"成功",celebration:"祝福",radiance:"輝き",
    rebirthJudge:"復活",reckoning:"清算",calling:"召命",absolution:"赦し",awakeningJudge:"覚醒",
    completion:"完成",fulfillment:"達成",wholeness:"全体性",integrationWorld:"統合",achievement:"成就",
    emotion:"感情",relationship:"関係",loveCup:"愛",intimacy:"親密",compassionCup:"共感",
    creativityWand:"創造",passion:"情熱",inspirationWand:"閃き",ambition:"野心",initiative:"率先",
    thought:"思考",truthSword:"真実",claritySword:"明晰",communication:"対話",justiceSword:"正義",
    wealth:"富",security:"安定",health:"健康",prosperity:"繁栄",grounding:"地に足",
  },
  fr: {
    beginnings:"commencements",freedom:"liberté",innocence:"innocence",journey:"voyage",faith:"foi",
    power:"pouvoir",skill:"compétence",manifestation:"manifestation",focus:"concentration",action:"action",
    intuition:"intuition",mystery:"mystère",wisdom:"sagesse",patience:"patience",balance:"équilibre",
    creativity:"créativité",growth:"croissance",nurturing:"nourrir",abundance:"abondance",beauty:"beauté",
    authority:"autorité",structure:"structure",control:"contrôle",leadership:"leadership",order:"ordre",
    tradition:"tradition",knowledge:"connaissance",guidance:"guidance",spirituality:"spiritualité",education:"éducation",
    love:"amour",choice:"choix",partnership:"partenariat",harmony:"harmonie",connection:"connexion",
    victory:"victoire",determination:"détermination",direction:"direction",triumph:"triomphe",progress:"progrès",
    courage:"courage",strength:"force",compassion:"compassion",resilience:"résilience",taming:"apprivoisement",
    solitude:"solitude",reflection:"réflexion",innerGuidance:"guide intérieur",contemplation:"contemplation",withdrawal:"retrait",
    change:"changement",cycles:"cycles",destiny:"destin",turningPoint:"tournant",luck:"chance",
    fairness:"équité",truth:"vérité",accountability:"responsabilité",clarity:"clarté",law:"loi",
    surrender:"abandon",lettingGo:"lâcher-prise",newPerspective:"nouvelle perspective",sacrifice:"sacrifice",pause:"pause",
    transformation:"transformation",ending:"fin",rebirth:"renaissance",release:"libération",transition:"transition",
    moderation:"modération",healing:"guérison",integration:"intégration",flow:"flux",renewal:"renouveau",
    shadow:"ombre",attachment:"attachement",temptation:"tentation",bondage:"asservissement",materialism:"matérialisme",
    destruction:"destruction",awakening:"éveil",upheaval:"bouleversement",revelation:"révélation",collapse:"effondrement",
    hope:"espoir",inspiration:"inspiration",serenity:"sérénité",renewalStar:"renouveau",faithStar:"foi",
    illusion:"illusion",subconscious:"subconscient",fear:"peur",intuitionMoon:"intuition",mysteryMoon:"mystère",
    joy:"joie",vitality:"vitalité",success:"succès",celebration:"célébration",radiance:"rayonnement",
    rebirthJudge:"renaissance",reckoning:"bilan",calling:"appel",absolution:"absolution",awakeningJudge:"éveil",
    completion:"achèvement",fulfillment:"accomplissement",wholeness:"intégrité",integrationWorld:"intégration",achievement:"réussite",
    emotion:"émotion",relationship:"relation",loveCup:"amour",intimacy:"intimité",compassionCup:"compassion",
    creativityWand:"créativité",passion:"passion",inspirationWand:"inspiration",ambition:"ambition",initiative:"initiative",
    thought:"pensée",truthSword:"vérité",claritySword:"clarté",communication:"communication",justiceSword:"justice",
    wealth:"richesse",security:"sécurité",health:"santé",prosperity:"prospérité",grounding:"ancrage",
  },
  ru: {
    beginnings:"начала",freedom:"свобода",innocence:"невинность",journey:"путь",faith:"вера",
    power:"сила",skill:"мастерство",manifestation:"проявление",focus:"фокус",action:"действие",
    intuition:"интуиция",mystery:"тайна",wisdom:"мудрость",patience:"терпение",balance:"равновесие",
    creativity:"творчество",growth:"рост",nurturing:"забота",abundance:"изобилие",beauty:"красота",
    authority:"власть",structure:"структура",control:"контроль",leadership:"лидерство",order:"порядок",
    tradition:"традиция",knowledge:"знание",guidance:"руководство",spirituality:"духовность",education:"образование",
    love:"любовь",choice:"выбор",partnership:"партнёрство",harmony:"гармония",connection:"связь",
    victory:"победа",determination:"решимость",direction:"направление",triumph:"триумф",progress:"прогресс",
    courage:"храбрость",strength:"сила",compassion:"сострадание",resilience:"стойкость",taming:"укрощение",
    solitude:"уединение",reflection:"размышление",innerGuidance:"внутренний свет",contemplation:"созерцание",withdrawal:"уход",
    change:"перемены",cycles:"циклы",destiny:"судьба",turningPoint:"поворот",luck:"удача",
    fairness:"справедливость",truth:"истина",accountability:"ответ",clarity:"ясность",law:"закон",
    surrender:"смирение",lettingGo:"отпускание",newPerspective:"новый взгляд",sacrifice:"жертва",pause:"пауза",
    transformation:"трансформация",ending:"конец",rebirth:"возрождение",release:"освобождение",transition:"переход",
    moderation:"умеренность",healing:"исцеление",integration:"объединение",flow:"поток",renewal:"обновление",
    shadow:"тень",attachment:"привязанность",temptation:"искушение",bondage:"рабство",materialism:"материализм",
    destruction:"разрушение",awakening:"пробуждение",upheaval:"потрясение",revelation:"откровение",collapse:"крах",
    hope:"надежда",inspiration:"вдохновение",serenity:"безмятежность",renewalStar:"обновление",faithStar:"вера",
    illusion:"иллюзия",subconscious:"подсознание",fear:"страх",intuitionMoon:"интуиция",mysteryMoon:"тайна",
    joy:"радость",vitality:"жизненность",success:"успех",celebration:"праздник",radiance:"сияние",
    rebirthJudge:"возрождение",reckoning:"расплата",calling:"призвание",absolution:"прощение",awakeningJudge:"пробуждение",
    completion:"завершение",fulfillment:"исполнение",wholeness:"целостность",integrationWorld:"интеграция",achievement:"достижение",
    emotion:"эмоции",relationship:"отношения",loveCup:"любовь",intimacy:"близость",compassionCup:"сострадание",
    creativityWand:"творчество",passion:"страсть",inspirationWand:"вдохновение",ambition:"амбиции",initiative:"инициатива",
    thought:"мысль",truthSword:"истина",claritySword:"ясность",communication:"общение",justiceSword:"справедливость",
    wealth:"богатство",security:"безопасность",health:"здоровье",prosperity:"процветание",grounding:"заземление",
  },
};

function translateKeywords(kws, lang) {
  const map = kwMap[lang];
  if (!map) return kws;
  return kws.map(k => map[k.toLowerCase()] || k);
}

// === MEANING TEMPLATES ===

const meaningTemplates = {
  ja: {
    prefix: "", suffix: "。",
    majorUpright: (name) => `${name}のカードは、新たな段階と内なる成長を象徴しています。このカードは、自己信頼と前進への準備が整ったことを示唆しています。直感を信じて進んでください。`,
    majorReversed: (name) => `${name}の逆位置は、内なる混乱や方向性の喪失を示しています。このカードが逆位置で現れたときは、立ち止まって内省し、何が自分を妨げているのかを見つめ直す時です。`,
    minorUpright: (name) => `${name}は、日々の生活の中で前向きな動きと機会を示しています。細部に注意を払い、実践的なステップを踏むことで、望む結果に近づくでしょう。`,
    minorReversed: (name) => `${name}の逆位置は、小さな障害や遅れを示唆しています。計画を見直し、焦らずに対処することで、この一時的な混乱を乗り越えられます。`,
    conn: (a, b, lang) => {
      const t = (s) => s;
      return `${a}と${b}が共に現れたとき、それらは互いのエネルギーを増幅します。一見異なる二つの力が、実は同じ目的地へと導いていることに気づくでしょう。流れに身を任せ、両方のメッセージを受け取ってください。`;
    },
  },
  fr: {
    prefix: "", suffix: ".",
    majorUpright: (name) => `La carte de ${name} symbolise une nouvelle phase et une croissance intérieure. Elle suggère que vous êtes prêt à avancer avec confiance. Faites confiance à votre intuition et allez de l'avant.`,
    majorReversed: (name) => `${name} inversé indique une confusion intérieure ou une perte de direction. Lorsque cette carte apparaît inversée, c'est le moment de s'arrêter, de réfléchir et de réévaluer ce qui vous retient.`,
    minorUpright: (name) => `${name} indique un mouvement positif et des opportunités dans votre vie quotidienne. Prêtez attention aux détails et prenez des mesures concrètes pour vous rapprocher du résultat souhaité.`,
    minorReversed: (name) => `${name} inversé suggère de petits obstacles ou des retards. Révisez vos plans et abordez-les avec patience pour surmonter cette perturbation temporaire.`,
    conn: (a, b) => `Lorsque ${a} et ${b} apparaissent ensemble, leurs énergies s'amplifient mutuellement. Deux forces apparemment différentes vous mènent en réalité vers la même destination. Acceptez le flux et recevez les deux messages.`,
  },
  ru: {
    prefix: "", suffix: ".",
    majorUpright: (name) => `Карта ${name} символизирует новый этап и внутренний рост. Она говорит о том, что вы готовы двигаться вперёд с уверенностью. Доверьтесь своей интуиции и идите вперёд.`,
    majorReversed: (name) => `Перевёрнутая карта ${name} указывает на внутреннее смятение или потерю направления. Когда эта карта появляется перевёрнутой, пришло время остановиться, поразмышлять и пересмотреть то, что вас сдерживает.`,
    minorUpright: (name) => `${name} указывает на позитивное движение и возможности в вашей повседневной жизни. Обратите внимание на детали и предпримите практические шаги, чтобы приблизиться к желаемому результату.`,
    minorReversed: (name) => `Перевёрнутая карта ${name} указывает на небольшие препятствия или задержки. Пересмотрите свои планы и подойдите к ним с терпением, чтобы преодолеть это временное нарушение.`,
    conn: (a, b) => `Когда ${a} и ${b} появляются вместе, их энергии усиливают друг друга. Две, казалось бы, разные силы на самом деле ведут вас к одной цели. Примите поток и получите оба послания.`,
  },
};

function translateCard(card, lang) {
  const isMajor = card.arcana === "major";
  const name = isMajor
    ? majorNames[lang][card.id]
    : minorName(card.id, lang);
  const t = meaningTemplates[lang];

  const upright = isMajor ? t.majorUpright(name) : t.minorUpright(name);
  const reversed = isMajor ? t.majorReversed(name) : t.minorReversed(name);
  const keywords = translateKeywords(card.keywords, lang);

  const connections = (card.connections || []).map((conn) => {
    const connCard = en.cards[conn.cardId];
    const connName = connCard.arcana === "major"
      ? majorNames[lang][connCard.id]
      : minorName(connCard.id, lang);
    return {
      cardId: conn.cardId,
      narrative: t.conn(name, connName, lang),
    };
  });

  return {
    id: card.id,
    name: name,
    arcana: card.arcana,
    suit: card.suit,
    uprightMeaning: t.prefix + upright + t.suffix,
    reversedMeaning: t.prefix + reversed + t.suffix,
    keywords,
    connections,
  };
}

for (const lang of ["ja", "fr", "ru"]) {
  const cards = en.cards.map((c) => translateCard(c, lang));
  const outPath = path.join(__dirname, "../src/data/tarot", `${lang}.json`);
  fs.writeFileSync(outPath, JSON.stringify({ cards }, null, 2), "utf-8");
  console.log(`Wrote ${lang}.json (${cards.length} cards)`);
}
console.log("Done.");
