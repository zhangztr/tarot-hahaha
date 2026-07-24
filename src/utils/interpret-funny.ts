import type { DrawnCard, Interpretation, SpreadType, TarotCard } from "../types/tarot";

function pick<T>(locale: string, variants: Record<string, T> & { en: T }): T {
  return variants[locale] ?? variants.en;
}

function findConnectionsFunny(
  drawnCards: DrawnCard[],
  funnyDeck: TarotCard[]
): string[] {
  const drawnIds = new Set(drawnCards.map((dc) => dc.card.id));
  const seen = new Set<string>();
  const results: string[] = [];

  for (const dc of drawnCards) {
    const funny = funnyDeck.find((c) => c.id === dc.card.id);
    if (!funny?.connections) continue;

    for (const conn of funny.connections) {
      if (!drawnIds.has(conn.cardId)) continue;

      const a = dc.card.id;
      const b = conn.cardId;
      const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      results.push(conn.narrative);
    }
  }

  return results;
}

const t = {
  allReversed: {
    zh: "全是逆位，老天爷今天主打一个「不」字。别硬刚，今天适合躺平复盘而不是冲锋陷阵。",
    en: "All reversed — the universe is hitting Ctrl+Z on your plans today. Don't force it. This is a lie-down-and-rethink kind of day, not a charge-ahead one.",
    ja: "全部逆位置——宇宙があなたの計画にCtrl+Zを押した日。無理するな。今日は突撃する日じゃなくて寝転んで仕切り直す日。",
    fr: "Tout inversé — l'univers a fait Ctrl+Z sur tes plans aujourd'hui. Ne force pas. C'est une journée canapé-réflexion, pas une journée charge-à-fond.",
    ru: "Всё перевёрнуто — вселенная нажала Ctrl+Z на твои планы. Не дави. Сегодня день полежать и переосмыслить, а не штурмовать.",
  },
  allReversedTheme: { zh: "硬骨头模式", en: "Hard Mode", ja: "ハードモード", fr: "Mode Hardcore", ru: "Хард-режим" },
  mostlyReversed: {
    zh: "逆位偏多，说明最近水逆还没走干净。不用慌，逆位不是坏事，是提醒你别头铁。",
    en: "Mostly reversed — Mercury must still be in retrograde somewhere. Don't panic; reversed cards aren't bad luck, they're just telling you to stop being so stubborn.",
    ja: "逆位置多め——水星がまだ逆行してるっぽい。慌てるな。逆位置は不運じゃない、ただ「もっと柔らかく行け」って言ってるだけ。",
    fr: "Surtout inversé — Mercure doit encore rétrograder quelque part. Pas de panique ; les cartes inversées ne portent pas malheur, elles te disent juste d'arrêter d'être aussi têtu.",
    ru: "В основном перевёрнуто — Меркурий, видимо, всё ещё где-то в ретрограде. Без паники; перевёрнутые карты не к неудаче, они просто говорят перестать быть таким упрямым.",
  },
  mostlyReversedTheme: { zh: "升级打怪中", en: "Boss Fight", ja: "ボス戦中", fr: "Combat de Boss", ru: "Битва с боссом" },
  allUpright: {
    zh: "全是正位！今天气场拉满，买个彩票可能不中但心情一定好。想做什么就去做，宇宙今天不拦你。",
    en: "All upright! Your vibes are immaculate. Will you win the lottery? Probably not. Will you feel great? Absolutely. Go do the thing — the universe is not in your way today.",
    ja: "全部正位置！今日のバイブスは完璧。宝くじは当たらないけど気分は最高。やりたいことをやれ——宇宙は今日、君の邪魔をしない。",
    fr: "Tout à l'endroit ! Tes vibes sont immaculées. Tu vas gagner au loto ? Probablement pas. Tu vas te sentir bien ? Absolument. Fais le truc — l'univers n'est pas dans ton chemin aujourd'hui.",
    ru: "Всё прямое! Твои вайбы безупречны. Выиграешь в лотерею? Вряд ли. Будешь чувствовать себя отлично? Абсолютно. Делай дело — вселенная сегодня не на твоём пути.",
  },
  allUprightTheme: { zh: "开门红", en: "Winning Streak", ja: "連勝中", fr: "Série de Victoires", ru: "Полоса побед" },

  suitLabels: {
    cups: {
      zh: "圣杯能量超标——你最近情感泛滥得像偶像剧主角。不是心动就是心碎，总之心脏很忙。",
      en: "Cups overload — you're emotionally flooded like the lead in a romantic drama. It's either butterflies or heartbreak, and your heart is working overtime either way.",
      ja: "カップ過多——感情がドラマの主人公並みに大洪水。ときめきか、それとも失恋か。どっちにしろ心臓が残業中。",
      fr: "Surcharge de Coupes — t'es inondé d'émotions comme le héros d'un drama romantique. C'est soit des papillons soit un cœur brisé, et ton cœur fait des heures sup' dans les deux cas.",
      ru: "Перегруз Кубков — тебя эмоционально затопило как главного героя романтического сериала. Либо бабочки, либо разбитое сердце, и твоё сердце работает сверхурочно в любом случае.",
    },
    wands: {
      zh: "权杖把火力拉满了——你现在就像喝了三杯咖啡，满脑子「我能行」。冲可以，但别把拦你的人当反派。",
      en: "Wands cranked to max — you've had three espressos and now everything feels like a mission. Charge ahead, but maybe don't treat everyone in your way like a final boss.",
      ja: "ワンド全開——エスプレッソ3杯飲んだ状態。すべてがミッションに感じる。突き進め、でも目の前の人全員をラスボス扱いするな。",
      fr: "Bâtons au maximum — t'as pris trois espressos et tout ressemble à une mission. Fonce, mais traite pas tout le monde sur ton chemin comme un boss final.",
      ru: "Жезлы на максимум — ты выпил три эспрессо и теперь всё кажется миссией. Вперёд, но, может, не стоит относиться ко всем на пути как к финальному боссу.",
    },
    swords: {
      zh: "宝剑扎堆——你的大脑在高速运转，要么在辩论要么在复盘要么在脑补别人的心理活动。累不累？",
      en: "Swords everywhere — your brain is running at 4 AM overthinking speeds. Debating, replaying conversations, imagining what everyone thinks of you. Exhausted yet?",
      ja: "ソードだらけ——脳が深夜3時の過剰思考モードでフル回転。議論して、会話をリプレイして、他人の心の中を想像して。疲れない？",
      fr: "Épées partout — ton cerveau tourne à la vitesse de l'overthinking de 4h du mat. Débats, rediffusions de conversations, imagination de ce que tout le monde pense de toi. Pas fatigué ?",
      ru: "Мечи повсюду — твой мозг работает на скорости передумывания в 4 утра. Дебаты, перепроигрывание разговоров, представление того, что все о тебе думают. Ещё не устал?",
    },
    pentacles: {
      zh: "钱币主导——满脑子搞钱搞事业搞身体。务实到家了，但别忘了：钱能买床买不到好睡眠。",
      en: "Pentacles running the show — money, hustle, gains. You're in full grind mode. Just remember: money buys a mattress, not good sleep. Touch some grass between meetings.",
      ja: "ペンタクル祭り——金、仕事、筋肉。ガチ現実モード全開。でも忘れるな：金でベッドは買えるが良い睡眠は買えない。会議の合間に草でも触れ。",
      fr: "Deniers aux commandes — argent, hustle, gains. T'es en mode grind complet. Rappelle-toi juste : l'argent achète un matelas, pas un bon sommeil. Touche de l'herbe entre deux réunions.",
      ru: "Пентакли правят бал — деньги, хастл, достижения. Ты в полном режиме grind. Просто помни: деньги покупают матрас, но не хороший сон. Потрогай траву между встречами.",
    },
  },

  suitThemeLabels: {
    zh: { cupsEnergy: "圣杯能量", wandsEnergy: "权杖能量", swordsEnergy: "宝剑能量", pentaclesEnergy: "钱币能量" },
    en: { cupsEnergy: "Cups Overflow", wandsEnergy: "Big Wands Energy", swordsEnergy: "Galaxy Brain", pentaclesEnergy: "Grindset Mode" },
    ja: { cupsEnergy: "カップ大洪水", wandsEnergy: "ワンド全開", swordsEnergy: "ギャラクシー脳", pentaclesEnergy: "ガチ現実モード" },
    fr: { cupsEnergy: "Déluge de Coupes", wandsEnergy: "Énergie Bâtons", swordsEnergy: "Cerveau Galactique", pentaclesEnergy: "Mode Grind" },
    ru: { cupsEnergy: "Потоп Кубков", wandsEnergy: "Энергия Жезлов", swordsEnergy: "Галактический Мозг", pentaclesEnergy: "Режим Grind" },
  },

  majorInfluence: {
    zh: "大牌含量过高——这不是小事，是人生主线剧情。别用「随便吧」的态度面对命运的 VIP 通道。",
    en: "Major Arcana density critical — this is not a side quest, this is main storyline energy. Don't show up to destiny's VIP entrance with a 'whatever, we'll see' attitude.",
    ja: "大アルカナ濃度危険レベル——これはサブクエじゃない、メインストーリーだ。運命のVIP入り口に「まあ適当で」って態度で来るな。",
    fr: "Densité d'Arcanes Majeurs critique — c'est pas une quête secondaire, c'est l'énergie du scénario principal. Ne te pointe pas à l'entrée VIP du destin avec une attitude 'on verra bien'.",
    ru: "Плотность Старших Арканов критическая — это не побочный квест, это энергия главного сюжета. Не являйся к VIP-входу судьбы с настроем «посмотрим, как пойдёт».",
  },
  majorInfluenceTheme: { zh: "主线剧情", en: "Main Quest", ja: "メインクエスト", fr: "Quête Principale", ru: "Главный квест" },

  singleWithQuestion: {
    zh: "针对你的问题，这一张牌给出了最直接的回应。别看它只有一张，浓缩的都是精华（或者暴击）。",
    en: "One card, one answer to your question. It might be concentrated wisdom. It might be a concentrated gut punch. Either way, the universe kept it short.",
    ja: "一枚のカード、君の質問へのダイレクトな回答。濃縮された知恵かもしれないし、濃縮された腹パンかもしれない。どっちにしても宇宙は簡潔に済ませた。",
    fr: "Une carte, une réponse à ta question. C'est peut-être de la sagesse concentrée. C'est peut-être un coup de poing concentré. Dans tous les cas, l'univers a fait court.",
    ru: "Одна карта, один ответ на твой вопрос. Может быть, это концентрированная мудрость. Может быть, концентрированный удар под дых. В любом случае, вселенная была кратка.",
  },
  singleNoQuestion: {
    zh: "就一张牌，简单直接。它就是你现在的精神 snapshot——不准的话你可以再抽一次反正我也拦不住。",
    en: "One card, simple and direct. It's a spiritual snapshot of where you are right now. If it doesn't resonate... I mean, you can always draw again. I'm not your mom.",
    ja: "一枚だけ、シンプルでダイレクト。今の君の精神のスクショ。しっくり来なかったら……まあもう一回引けばいいんじゃない。僕は君の母親じゃないし。",
    fr: "Une carte, simple et directe. C'est un instantané spirituel de là où t'en es maintenant. Si ça ne résonne pas... écoute, tu peux toujours en tirer une autre. Je suis pas ta mère.",
    ru: "Одна карта, просто и прямо. Это духовный снимок того, где ты сейчас находишься. Если не резонирует... слушай, ты всегда можешь вытянуть ещё одну. Я тебе не мама.",
  },
  pastPresentFuture: {
    zh: "「过去」那张说明你从哪趟浑水里爬出来的，「现在」是你在踩的坑，「未来」是坑前面可能出现的路。连起来看，是不是故事线还挺通顺的？",
    en: "\"Past\" shows which swamp you crawled out of. \"Present\" is the pothole you're currently in. \"Future\" is the road that might appear after the pothole. Connect the dots — the storyline actually makes sense, doesn't it?",
    ja: "「過去」は君がどの沼から這い出てきたか。「現在」は今まさにハマってる穴。「未来」はその穴の先に出てくるかもしれない道。点と点をつなぐと、ほら、意外と筋が通ってるでしょ？",
    fr: "« Passé » montre de quel marécage tu es sorti. « Présent » c'est le nid-de-poule dans lequel t'es actuellement. « Futur » c'est la route qui pourrait apparaître après le nid-de-poule. Relie les points — l'histoire a du sens, non ?",
    ru: "«Прошлое» показывает, из какого болота ты выполз. «Настоящее» — это яма, в которой ты сейчас сидишь. «Будущее» — это дорога, которая может появиться после ямы. Соедини точки — сюжетная линия имеет смысл, не так ли?",
  },
  problemAdvice: {
    zh: "「问题」直接给你指了病灶，「阻碍」就是那块绊脚石本人的名字，「建议」是你最好的行动方向。三张牌凑一起就是：啥问题 + 谁在搞事 + 怎么办。",
    en: "\"Problem\" points to what's actually wrong. \"Obstacle\" names the specific obstacle that's been gatekeeping you. \"Advice\" is your best move forward. Together: what's broken + who's blocking + what to do about it.",
    ja: "「問題」は実際に何がおかしいかを指す。「障害」は君を阻んでいる奴の名前。「助言」は取るべきベストな一手。つまり：何が壊れてるか＋誰が邪魔してるか＋どう対処するか。",
    fr: "« Problème » montre ce qui ne va vraiment pas. « Obstacle » nomme l'obstacle spécifique qui te bloque. « Conseil » est ton meilleur coup à jouer. Ensemble : ce qui est cassé + qui bloque + quoi faire.",
    ru: "«Проблема» указывает, что на самом деле не так. «Препятствие» называет конкретное препятствие, которое тебя блокирует. «Совет» — твой лучший ход вперёд. Вместе: что сломано + кто мешает + что с этим делать.",
  },

  cardComboTheme: { zh: "牌面联动", en: "Card Combo", ja: "カードコンボ", fr: "Combo de Cartes", ru: "Комбо Карт" },
};

export function generateInterpretationFunny(
  drawnCards: DrawnCard[],
  spreadType: SpreadType,
  question: string | null,
  locale: string,
  funnyDeck: TarotCard[]
): Interpretation {

  const cardInterpretations = drawnCards.map((dc) => {
    const funny = funnyDeck.find((c) => c.id === dc.card.id);
    if (!funny) return {
      cardName: dc.card.name,
      meaning: dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning,
    };
    return {
      cardName: funny.name,
      meaning: dc.isReversed ? funny.reversedMeaning : funny.uprightMeaning,
    };
  });

  const summaryParts: string[] = [];
  const themes: string[] = [];

  // Rule 1: Reversal ratio
  const reversedCount = drawnCards.filter((dc) => dc.isReversed).length;
  if (reversedCount === drawnCards.length) {
    summaryParts.push(pick(locale, t.allReversed));
    themes.push(pick(locale, t.allReversedTheme));
  } else if (reversedCount > drawnCards.length / 2) {
    summaryParts.push(pick(locale, t.mostlyReversed));
    themes.push(pick(locale, t.mostlyReversedTheme));
  } else if (reversedCount === 0) {
    summaryParts.push(pick(locale, t.allUpright));
    themes.push(pick(locale, t.allUprightTheme));
  }

  // Rule 2: Suit dominance
  const suitCounts: Record<string, number> = { cups: 0, wands: 0, swords: 0, pentacles: 0 };
  for (const dc of drawnCards) {
    if (dc.card.suit && dc.card.suit in suitCounts) {
      suitCounts[dc.card.suit]++;
    }
  }
  const sortedSuits = Object.entries(suitCounts).sort((a, b) => b[1] - a[1]);
  const dominant = sortedSuits[0];

  if (dominant[1] >= 2 && dominant[0] in t.suitLabels) {
    summaryParts.push(pick(locale, t.suitLabels[dominant[0] as keyof typeof t.suitLabels]));
    const themeKey = `${dominant[0]}Energy`;
    const labels = pick(locale, t.suitThemeLabels) as Record<string, string>;
    themes.push(labels[themeKey]);
  }

  // Rule 3: Major Arcana presence
  const majorCount = drawnCards.filter((dc) => dc.card.arcana === "major").length;
  if (majorCount >= 2) {
    summaryParts.push(pick(locale, t.majorInfluence));
    themes.push(pick(locale, t.majorInfluenceTheme));
  }

  // Rule 4: Spread-type framing
  if (spreadType === "single") {
    summaryParts.push(
      question
        ? pick(locale, t.singleWithQuestion)
        : pick(locale, t.singleNoQuestion)
    );
  } else if (spreadType === "three-past-present") {
    summaryParts.push(pick(locale, t.pastPresentFuture));
  } else if (spreadType === "three-problem-advice") {
    summaryParts.push(pick(locale, t.problemAdvice));
  }

  // Rule 5: Keyword overlap
  const allKeywords = drawnCards.flatMap((dc) => {
    const funny = funnyDeck.find((c) => c.id === dc.card.id);
    return funny?.keywords || [];
  });
  const freq = new Map<string, number>();
  for (const kw of allKeywords) {
    freq.set(kw, (freq.get(kw) || 0) + 1);
  }
  const repeated = [...freq.entries()]
    .filter(([, count]) => count >= 2)
    .map(([kw]) => kw);

  if (repeated.length > 0) {
    themes.push(...repeated.slice(0, 3));
  }

  const connectionNarratives = findConnectionsFunny(drawnCards, funnyDeck);

  let summary: string;
  if (connectionNarratives.length > 0) {
    summary = connectionNarratives.join("\n\n");
    themes.push(pick(locale, t.cardComboTheme));
  } else {
    summary = summaryParts.join(" ");
  }

  return {
    cardInterpretations,
    summary,
    themes: [...new Set(themes)],
  };
}
