import type { DrawnCard, Interpretation, SpreadType } from "../types/tarot";
import type { Locale } from "../context/LocaleContext";
import funnyData from "../data/tarot-funny.json";

function zh(locale: string): boolean { return locale === "zh"; }

function findConnectionsFunny(drawnCards: DrawnCard[], locale: string): string[] {
  const drawnIds = new Set(drawnCards.map((dc) => dc.card.id));
  const seen = new Set<string>();
  const results: string[] = [];

  for (const dc of drawnCards) {
    const funny = funnyData[dc.card.id] as any;
    if (!funny?.connections) continue;

    for (const conn of funny.connections) {
      if (!drawnIds.has(conn.cardId)) continue;

      const a = dc.card.id;
      const b = conn.cardId;
      const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      results.push(zh(locale) ? conn.narrative : (conn.narrativeEn || conn.narrative));
    }
  }

  return results;
}

export function generateInterpretationFunny(
  drawnCards: DrawnCard[],
  spreadType: SpreadType,
  question: string | null,
  locale: Locale
): Interpretation {

  const cardInterpretations = drawnCards.map((dc) => {
    const funny = funnyData[dc.card.id] as any;
    return {
      cardName: zh(locale) ? funny.name : (funny.nameEn || funny.name),
      meaning: dc.isReversed
        ? (zh(locale) ? funny.reversedMeaning : (funny.reversedMeaningEn || funny.reversedMeaning))
        : (zh(locale) ? funny.uprightMeaning : (funny.uprightMeaningEn || funny.uprightMeaning)),
    };
  });

  const summaryParts: string[] = [];
  const themes: string[] = [];

  // Rule 1: Reversal ratio
  const reversedCount = drawnCards.filter((dc) => dc.isReversed).length;
  if (reversedCount === drawnCards.length) {
    summaryParts.push(
      zh(locale)
        ? "全是逆位，老天爷今天主打一个「不」字。别硬刚，今天适合躺平复盘而不是冲锋陷阵。"
        : "All reversed — the universe is hitting Ctrl+Z on your plans today. Don't force it. This is a lie-down-and-rethink kind of day, not a charge-ahead one."
    );
    themes.push(zh(locale) ? "硬骨头模式" : "Hard Mode");
  } else if (reversedCount > drawnCards.length / 2) {
    summaryParts.push(
      zh(locale)
        ? "逆位偏多，说明最近水逆还没走干净。不用慌，逆位不是坏事，是提醒你别头铁。"
        : "Mostly reversed — Mercury must still be in retrograde somewhere. Don't panic; reversed cards aren't bad luck, they're just telling you to stop being so stubborn."
    );
    themes.push(zh(locale) ? "升级打怪中" : "Boss Fight");
  } else if (reversedCount === 0) {
    summaryParts.push(
      zh(locale)
        ? "全是正位！今天气场拉满，买个彩票可能不中但心情一定好。想做什么就去做，宇宙今天不拦你。"
        : "All upright! Your vibes are immaculate. Will you win the lottery? Probably not. Will you feel great? Absolutely. Go do the thing — the universe is not in your way today."
    );
    themes.push(zh(locale) ? "开门红" : "Winning Streak");
  }

  // Rule 2: Suit dominance
  const suitCounts: Record<string, number> = { cups: 0, wands: 0, swords: 0, pentacles: 0 };
  const suitLabels: Record<string, Record<string, string>> = {
    cups: {
      zh: "圣杯能量超标——你最近情感泛滥得像偶像剧主角。不是心动就是心碎，总之心脏很忙。",
      en: "Cups overload — you're emotionally flooded like the lead in a romantic drama. It's either butterflies or heartbreak, and your heart is working overtime either way.",
    },
    wands: {
      zh: "权杖把火力拉满了——你现在就像喝了三杯咖啡，满脑子「我能行」。冲可以，但别把拦你的人当反派。",
      en: "Wands cranked to max — you've had three espressos and now everything feels like a mission. Charge ahead, but maybe don't treat everyone in your way like a final boss.",
    },
    swords: {
      zh: "宝剑扎堆——你的大脑在高速运转，要么在辩论要么在复盘要么在脑补别人的心理活动。累不累？",
      en: "Swords everywhere — your brain is running at 4 AM overthinking speeds. Debating, replaying conversations, imagining what everyone thinks of you. Exhausted yet?",
    },
    pentacles: {
      zh: "钱币主导——满脑子搞钱搞事业搞身体。务实到家了，但别忘了：钱能买床买不到好睡眠。",
      en: "Pentacles running the show — money, hustle, gains. You're in full grind mode. Just remember: money buys a mattress, not good sleep. Touch some grass between meetings.",
    },
  };
  const suitThemeLabels: Record<string, Record<string, string>> = {
    zh: { cupsEnergy: "圣杯能量", wandsEnergy: "权杖能量", swordsEnergy: "宝剑能量", pentaclesEnergy: "钱币能量" },
    en: { cupsEnergy: "Cups Overflow", wandsEnergy: "Big Wands Energy", swordsEnergy: "Galaxy Brain", pentaclesEnergy: "Grindset Mode" },
  };
  for (const dc of drawnCards) {
    if (dc.card.suit && dc.card.suit in suitCounts) {
      suitCounts[dc.card.suit]++;
    }
  }
  const sortedSuits = Object.entries(suitCounts).sort((a, b) => b[1] - a[1]);
  const dominant = sortedSuits[0];

  if (dominant[1] >= 2 && dominant[0] in suitLabels) {
    summaryParts.push(suitLabels[dominant[0]][zh(locale) ? "zh" : "en"]);
    const themeKey = `${dominant[0]}Energy`;
    themes.push(suitThemeLabels[zh(locale) ? "zh" : "en"][themeKey]);
  }

  // Rule 3: Major Arcana presence
  const majorCount = drawnCards.filter((dc) => dc.card.arcana === "major").length;
  if (majorCount >= 2) {
    summaryParts.push(
      zh(locale)
        ? "大牌含量过高——这不是小事，是人生主线剧情。别用「随便吧」的态度面对命运的 VIP 通道。"
        : "Major Arcana density critical — this is not a side quest, this is main storyline energy. Don't show up to destiny's VIP entrance with a 'whatever, we'll see' attitude."
    );
    themes.push(zh(locale) ? "主线剧情" : "Main Quest");
  }

  // Rule 4: Spread-type framing
  if (spreadType === "single") {
    summaryParts.push(
      question
        ? (zh(locale)
          ? "针对你的问题，这一张牌给出了最直接的回应。别看它只有一张，浓缩的都是精华（或者暴击）。"
          : "One card, one answer to your question. It might be concentrated wisdom. It might be a concentrated gut punch. Either way, the universe kept it short."
        )
        : (zh(locale)
          ? "就一张牌，简单直接。它就是你现在的精神 snapshot——不准的话你可以再抽一次反正我也拦不住。"
          : "One card, simple and direct. It's a spiritual snapshot of where you are right now. If it doesn't resonate... I mean, you can always draw again. I'm not your mom."
        )
    );
  } else if (spreadType === "three-past-present") {
    summaryParts.push(
      zh(locale)
        ? "「过去」那张说明你从哪趟浑水里爬出来的，「现在」是你在踩的坑，「未来」是坑前面可能出现的路。连起来看，是不是故事线还挺通顺的？"
        : "\"Past\" shows which swamp you crawled out of. \"Present\" is the pothole you're currently in. \"Future\" is the road that might appear after the pothole. Connect the dots — the storyline actually makes sense, doesn't it?"
    );
  } else if (spreadType === "three-problem-advice") {
    summaryParts.push(
      zh(locale)
        ? "「问题」直接给你指了病灶，「阻碍」就是那块绊脚石本人的名字，「建议」是你最好的行动方向。三张牌凑一起就是：啥问题 + 谁在搞事 + 怎么办。"
        : "\"Problem\" points to what's actually wrong. \"Obstacle\" names the specific obstacle that's been gatekeeping you. \"Advice\" is your best move forward. Together: what's broken + who's blocking + what to do about it."
    );
  }

  // Rule 5: Keyword overlap
  const allKeywords = drawnCards.flatMap((dc) => {
    const funny = funnyData[dc.card.id] as any;
    return zh(locale) ? (funny.keywords || []) : (funny.keywordsEn || funny.keywords || []);
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

  const connectionNarratives = findConnectionsFunny(drawnCards, locale);

  let summary: string;
  if (connectionNarratives.length > 0) {
    summary = connectionNarratives.join("\n\n");
    themes.push(zh(locale) ? "牌面联动" : "Card Combo");
  } else {
    summary = summaryParts.join(" ");
  }

  return {
    cardInterpretations,
    summary,
    themes: [...new Set(themes)],
  };
}
