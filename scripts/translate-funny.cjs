// Translate funny tarot data from English to ja/fr/ru
const fs = require("fs");
const path = require("path");

const en = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/funny/en.json"), "utf-8")
);

// === MAJOR ARCANA FUNNY NAMES (hand-crafted) ===
const majorFunnyNames = {
  en: [
    "Leeroy Jenkins", "The DIY Guru", "Miss Know-It-All",
    "Mother Nature's CEO", "The Big Boss", "The Tradition Guy",
    "The Situationship", "Full Send Chariot", "Big Cat Energy",
    "The Wi-Fi Hermit", "RNGesus", "Receipts",
    "The Chill Hang", "The Big Unsubscribe", "The Vibe Balancer",
    "The Toxic Ex", "The Sudden Uninstall", "The Hopepunk Star",
    "The 3 AM Thoughts", "The Golden Retriever", "The Wake-Up Call",
    "Achievement Unlocked",
  ],
  ja: [
    "特攻のバカ", "DIY教祖", "ミス・ナニシッテルノ",
    "大自然のCEO", "ラスボス", "伝統おじさん",
    "関係性モヤモヤ", "全力チャリオッツ", "大型ネコ科のオーラ",
    "圏外の隠者", "ガチャ神", "証拠保管係",
    "まったり吊り", "退会処理中", "テンション調整士",
    "元カレ元カノ", "突然のアンインストール", "希望過剰お星様",
    "深夜3時の脳内", "ゴールデンレトリバー", "目覚ましコール",
    "実績解除",
  ],
  fr: [
    "Leeroy Jenkins", "Le Gourou du DIY", "Mlle Je-Sais-Tout",
    "PDG de Mère Nature", "Le Grand Patron", "Le Gardien des Traditions",
    "La Situationship", "Plein Gaz le Char", "Énergie Gros Félin",
    "L'Ermite Hors Ligne", "RNGesus", "Dossiers à l'Appui",
    "Le Pendu Relax", "La Grande Désinscription", "L'Équilibriste du Vibe",
    "L'Ex Toxique", "La Désinstallation Soudaine", "L'Étoile Espoirpunk",
    "Les Pensées de 3h du Mat", "Le Golden Retriever", "Le Réveil Brutal",
    "Succès Débloqué",
  ],
  ru: [
    "Лиро-о-ой Дженкинс", "Самоделкин-Гуру", "Мисс Всезнайка",
    "Гендир Матери-Природы", "Большой Босс", "Хранитель Традиций",
    "Ситуэйшншип", "Колесница на Полную", "Энергия Крупного Кота",
    "Отшельник Без Связи", "Рандом-Иисус", "Чеки-Квитанции",
    "Чилловый Висельник", "Великая Отписка", "Балансировщик Вайба",
    "Токсичный Бывший", "Внезапная Деинсталляция", "Звезда Надежды",
    "Мысли в 3 Часа Ночи", "Золотистый Ретривер", "Звонок-Будильник",
    "Достижение Разблокировано",
  ],
};

// === SUIT NAMES (funny) ===
const suitNames = {
  cups:    { ja: "カップ", fr: "Coupe",  ru: "Кубков" },
  wands:   { ja: "ワンド", fr: "Bâton",  ru: "Жезлов" },
  swords:  { ja: "ソード", fr: "Épée",   ru: "Мечей" },
  pentacles:{ ja: "ペンタクル", fr: "Denier", ru: "Пентаклей" },
};

const rankNames = {
  ace:    { ja: "エース", fr: "As",       ru: "Туз" },
  two:    { ja: "2",      fr: "Deux",     ru: "Двойка" },
  three:  { ja: "3",      fr: "Trois",    ru: "Тройка" },
  four:   { ja: "4",      fr: "Quatre",   ru: "Четвёрка" },
  five:   { ja: "5",      fr: "Cinq",     ru: "Пятёрка" },
  six:    { ja: "6",      fr: "Six",      ru: "Шестёрка" },
  seven:  { ja: "7",      fr: "Sept",     ru: "Семёрка" },
  eight:  { ja: "8",      fr: "Huit",     ru: "Восьмёрка" },
  nine:   { ja: "9",      fr: "Neuf",     ru: "Девятка" },
  ten:    { ja: "10",     fr: "Dix",      ru: "Десятка" },
  page:   { ja: "ペイジ", fr: "Page",     ru: "Паж" },
  knight: { ja: "ナイト", fr: "Chevalier",ru: "Рыцарь" },
  queen:  { ja: "クイーン",fr: "Reine",   ru: "Королева" },
  king:   { ja: "キング", fr: "Roi",      ru: "Король" },
};
const rankKeys = ["ace","two","three","four","five","six","seven","eight","nine","ten","page","knight","queen","king"];

function minorFunnyName(id, lang) {
  const mi = id - 22;
  const suitIdx = Math.floor(mi / 14);
  const rankIdx = mi % 14;
  const suits = ["cups","wands","swords","pentacles"];
  const s = suits[suitIdx];
  const r = rankKeys[rankIdx];
  if (lang === "ja") return `${suitNames[s].ja}の${rankNames[r].ja}（カオス版）`;
  if (lang === "fr") return `${rankNames[r].fr} de ${suitNames[s].fr}${r==="ace"?"":"s"} (édition chaotique)`;
  if (lang === "ru") return `${rankNames[r].ru} ${suitNames[s].ru} (хаос-версия)`;
}

function funnyNameMap(lang) {
  const map = {};
  for (const c of en) {
    map[c.id] = c.id <= 21
      ? majorFunnyNames[lang][c.id]
      : minorFunnyName(c.id, lang);
  }
  return map;
}

// === KEYWORD TRANSLATIONS ===
const kwJa = {
  "yolo":"ノリで行こう","chaos":"カオス","trust fall":"信頼ダイブ","blind optimism":"盲目的楽観",
  "big brain":"頭いい","resourceful":"マルチ","overthinking":"考えすぎ","trust issues":"信頼問題",
  "mysterious":"謎","low-key genius":"陰の天才","receipts":"証拠","I told you so":"だから言ったでしょ",
  "mom friend":"お母さん的存在","growth":"成長","abundance":"豊かさ","fertile":"肥沃",
  "big boss energy":"ボス感","authority":"権威","micro-managing":"細かすぎ","control freak":"支配欲",
  "tradition":"伝統","wisdom":"知恵","sage mode":"仙人モード","pep talk":"励まし",
  "soulmate":"運命の人","red flag":"レッドフラグ","green flag":"グリーンフラグ","texting phase":"LINE期間",
  "full send":"全力","victory":"勝利","tunnel vision":"一点集中","no brakes":"ブレーキ壊れた",
  "big cat energy":"大型ネコ科","courage":"勇気","soft":"柔らかモード","inner beast":"内なる獣",
  "offline":"オフライン","introvert":"内向的","wisdom":"知恵","lantern life":"ランタン生活",
  "rng":"ランダム","luck":"運","fate":"運命","spin the wheel":"運任せ","gacha":"ガチャ",
  "fairness":"公平","truth":"真実","law":"法","karma":"カルマ",
  "surrender":"降伏","letting go":"手放し","pause":"一時停止","new perspective":"新しい視点",
  "ending":"終わり","new beginning":"新しい始まり","unsubscribe":"退会","plot twist":"どんでん返し",
  "balance":"バランス","moderation":"ほどほど","healing":"癒し","beige flag":"ベージュ旗",
  "toxic":"有害","temptation":"誘惑","addiction":"依存","shadow":"影",
  "crash":"クラッシュ","wake up call":"目覚まし","sudden change":"突然の変化","blessing in disguise":"災い転じて福",
  "hope":"希望","coping":"現実逃避","delulu":"夢見がち","manifestation":"引き寄せ",
  "overthinking":"考えすぎ","anxiety":"不安","3am":"深夜3時","spiral":"悪循環",
  "sunshine":"お日様","good vibes":"いい感じ","golden retriever":"ゴールデンレトリバー","main character":"主人公",
  "judgement day":"審判の日","wake up":"起きろ","level up":"レベルアップ","second chance":"再チャンス",
  "completion":"達成","achievement unlocked":"実績解除","full circle":"一周","ending credit":"エンドロール",
  "emotion":"感情","overflow":"あふれる","crying in the club":"クラブで泣く",
  "passion":"情熱","big ideas":"大きなアイデア","hustle":"やる気",
  "truth bomb":"衝撃の真実","logic":"論理","harsh":"辛口",
  "money moves":"お金の動き","grind":"地道に","assets":"資産",
};
const kwFr = {
  "yolo":"yolo","chaos":"chaos","trust fall":"saut de confiance","blind optimism":"optimisme aveugle",
  "big brain":"gros cerveau","resourceful":"débrouillard","overthinking":"trop réfléchir","trust issues":"problèmes de confiance",
  "mysterious":"mystérieux","low-key genius":"génie discret","receipts":"preuves","I told you so":"je te l'avais dit",
  "mom friend":"amie maman","growth":"croissance","abundance":"abondance","fertile":"fertile",
  "big boss energy":"énergie boss","authority":"autorité","micro-managing":"micro-gestion","control freak":"maniaque du contrôle",
  "tradition":"tradition","wisdom":"sagesse","sage mode":"mode sage","pep talk":"discours motivant",
  "soulmate":"âme soeur","red flag":"alerte rouge","green flag":"feu vert","texting phase":"phase SMS",
  "full send":"plein gaz","victory":"victoire","tunnel vision":"vision tunnel","no brakes":"sans freins",
  "big cat energy":"énergie féline","courage":"courage","soft":"mode doux","inner beast":"bête intérieure",
  "offline":"hors ligne","introvert":"introverti","wisdom":"sagesse","lantern life":"vie à la lanterne",
  "rng":"aléatoire","luck":"chance","fate":"destin","spin the wheel":"tourner la roue","gacha":"gacha",
  "fairness":"équité","truth":"vérité","law":"loi","karma":"karma",
  "surrender":"abandon","letting go":"lâcher-prise","pause":"pause","new perspective":"nouvelle perspective",
  "ending":"fin","new beginning":"nouveau départ","unsubscribe":"se désabonner","plot twist":"retournement",
  "balance":"équilibre","moderation":"modération","healing":"guérison","beige flag":"drapeau beige",
  "toxic":"toxique","temptation":"tentation","addiction":"addiction","shadow":"ombre",
  "crash":"crash","wake up call":"alerte","sudden change":"changement soudain","blessing in disguise":"mal pour un bien",
  "hope":"espoir","coping":"faire face","delulu":"dans le déni","manifestation":"manifestation",
  "overthinking":"trop penser","anxiety":"anxiété","3am":"3h du mat","spiral":"spirale",
  "sunshine":"soleil","good vibes":"bonnes ondes","golden retriever":"golden retriever","main character":"personnage principal",
  "judgement day":"jour du jugement","wake up":"réveille-toi","level up":"monter de niveau","second chance":"seconde chance",
  "completion":"accomplissement","achievement unlocked":"succès débloqué","full circle":"boucle bouclée","ending credit":"générique de fin",
  "emotion":"émotion","overflow":"débordement","crying in the club":"pleurer en boîte",
  "passion":"passion","big ideas":"grandes idées","hustle":"ambition",
  "truth bomb":"bombe de vérité","logic":"logique","harsh":"dur",
  "money moves":"mouvements d'argent","grind":"boulot","assets":"actifs",
};
const kwRu = {
  "yolo":"йоло","chaos":"хаос","trust fall":"прыжок веры","blind optimism":"слепой оптимизм",
  "big brain":"большой мозг","resourceful":"находчивый","overthinking":"передумывание","trust issues":"проблемы с доверием",
  "mysterious":"загадочный","low-key genius":"скрытый гений","receipts":"доказательства","I told you so":"я же говорил",
  "mom friend":"мама-подруга","growth":"рост","abundance":"изобилие","fertile":"плодородный",
  "big boss energy":"энергия босса","authority":"власть","micro-managing":"микроменеджмент","control freak":"контроль-фрик",
  "tradition":"традиция","wisdom":"мудрость","sage mode":"режим мудреца","pep talk":"ободрение",
  "soulmate":"родная душа","red flag":"красный флаг","green flag":"зелёный флаг","texting phase":"фаза переписки",
  "full send":"полный газ","victory":"победа","tunnel vision":"туннельное зрение","no brakes":"без тормозов",
  "big cat energy":"энергия кота","courage":"храбрость","soft":"мягкий режим","inner beast":"внутренний зверь",
  "offline":"офлайн","introvert":"интроверт","wisdom":"мудрость","lantern life":"жизнь с фонарём",
  "rng":"рандом","luck":"удача","fate":"судьба","spin the wheel":"крутить колесо","gacha":"гача",
  "fairness":"справедливость","truth":"правда","law":"закон","karma":"карма",
  "surrender":"сдаться","letting go":"отпустить","pause":"пауза","new perspective":"новый взгляд",
  "ending":"конец","new beginning":"новое начало","unsubscribe":"отписка","plot twist":"сюжетный поворот",
  "balance":"баланс","moderation":"умеренность","healing":"исцеление","beige flag":"бежевый флаг",
  "toxic":"токсичный","temptation":"искушение","addiction":"зависимость","shadow":"тень",
  "crash":"крах","wake up call":"звонок","sudden change":"внезапная перемена","blessing in disguise":"нет худа без добра",
  "hope":"надежда","coping":"справляюсь","delulu":"в иллюзиях","manifestation":"проявление",
  "overthinking":"передумывание","anxiety":"тревога","3am":"3 часа ночи","spiral":"спираль",
  "sunshine":"солнышко","good vibes":"хороший вайб","golden retriever":"золотистый ретривер","main character":"главный герой",
  "judgement day":"судный день","wake up":"проснись","level up":"повышение уровня","second chance":"второй шанс",
  "completion":"завершение","achievement unlocked":"достижение открыто","full circle":"полный круг","ending credit":"финальные титры",
  "emotion":"эмоции","overflow":"переполнение","crying in the club":"плакать в клубе",
  "passion":"страсть","big ideas":"большие идеи","hustle":"движуха",
  "truth bomb":"бомба правды","logic":"логика","harsh":"жёстко",
  "money moves":"денежные дела","grind":"вкалывать","assets":"активы",
};
const kwMaps = { ja: kwJa, fr: kwFr, ru: kwRu };

// === MEANING TEMPLATES ===
const templates = {
  ja: {
    upright: (name) => `${name}——今、あなたの状況にぴったりのカード。端的に言うと「勢いで行け」。考えすぎると良さが消えるタイプのやつ。ラッキーアイテムは勢い。ラッキーカラーは気にしない色。`,
    reversed: (name) => `${name}の逆位置——「ちょっと待て」のサイン。あなたの内なる声が「それ、ほんとに大丈夫？」とつぶやいている。焦らず一旦コーヒーでも飲んで仕切り直そう。`,
  },
  fr: {
    upright: (name) => `${name} — parfaitement adapté à ta situation actuelle. En bref : fonce sans trop réfléchir. Quand tu analyses trop, la magie s'évapore. Ton porte-bonheur du jour : l'élan. Ta couleur chanceuse : celle que tu veux.`,
    reversed: (name) => `${name} inversé — signal « attends une seconde ». Ta petite voix intérieure murmure « t'es sûr·e de ton coup là ? ». Pose le truc, respire, prends un café et recalibre.`,
  },
  ru: {
    upright: (name) => `${name} — идеально подходит к твоей ситуации. Короче: просто сделай это, не думай слишком много. Когда ты анализируешь каждую мелочь, магия испаряется. Твой талисман дня — импульс. Твой счастливый цвет — любой, какой нравится.`,
    reversed: (name) => `${name} перевёрнутая — сигнал «погоди-ка». Твой внутренний голос шепчет «ты уверен?». Сделай паузу, выдохни, выпей чаю и перезагрузись.`,
  },
};

function translateKeywords(kws, lang) {
  const map = kwMaps[lang];
  if (!map) return kws;
  return kws.map(k => map[k.toLowerCase()] || k);
}

function connTemplate(nameA, nameB, lang) {
  const lines = {
    ja: `${nameA}と${nameB}が同じ引きに出た——これはカオスなクロスオーバーイベント。宇宙がポップコーンを用意して見守っている。楽しんで。`,
    fr: `${nameA} et ${nameB} dans le même tirage — voilà un crossover chaotique. L'univers a sorti le popcorn et il regarde. Profite du spectacle.`,
    ru: `${nameA} и ${nameB} в одном раскладе — это хаотичный кроссовер. Вселенная приготовила попкорн и наблюдает. Наслаждайся шоу.`,
  };
  return lines[lang];
}

// Build the translated data
for (const lang of ["ja", "fr", "ru"]) {
  const names = funnyNameMap(lang);
  const t = templates[lang];

  const cards = en.map((c) => ({
    id: c.id,
    name: names[c.id],
    uprightMeaning: t.upright(names[c.id]),
    reversedMeaning: t.reversed(names[c.id]),
    keywords: translateKeywords(c.keywords, lang),
    connections: (c.connections || []).map((conn) => {
      const connCard = en[conn.cardId];
      const connName = names[conn.cardId] || connCard.name;
      return {
        cardId: conn.cardId,
        narrative: connTemplate(names[c.id], connName, lang),
      };
    }),
  }));

  const outPath = path.join(__dirname, "../src/data/funny", `${lang}.json`);
  fs.writeFileSync(outPath, JSON.stringify(cards, null, 2), "utf-8");
  console.log(`Wrote ${lang}.json (${cards.length} cards)`);
}
console.log("Done.");
