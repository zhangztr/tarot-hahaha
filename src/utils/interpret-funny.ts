import type { DrawnCard, Interpretation, SpreadType } from "../types/tarot";
import funnyData from "../data/tarot-funny.json";

export function generateInterpretationFunny(
  drawnCards: DrawnCard[],
  spreadType: SpreadType,
  question: string | null
): Interpretation {
  const cardInterpretations = drawnCards.map((dc) => {
    const funny = funnyData[dc.card.id];
    return {
      cardName: funny.name,
      meaning: dc.isReversed ? funny.reversedMeaning : funny.uprightMeaning,
    };
  });

  const summaryParts: string[] = [];
  const themes: string[] = [];
  const themeMap: Record<string, string> = {
    "强力阻碍": "硬骨头模式",
    "挑战期": "升级打怪中",
    "清晰顺利": "开门红",
    "圣杯能量": "情感泛滥区",
    "权杖能量": "打了鸡血",
    "宝剑能量": "头脑风暴中",
    "钱币能量": "搞钱要紧",
    "大牌影响": "主线剧情",
  };

  // Rule 1: Reversal ratio
  const reversedCount = drawnCards.filter((dc) => dc.isReversed).length;
  if (reversedCount === drawnCards.length) {
    summaryParts.push("全是逆位，老天爷今天主打一个「不」字。别硬刚，今天适合躺平复盘而不是冲锋陷阵。");
    themes.push(themeMap["强力阻碍"]);
  } else if (reversedCount > drawnCards.length / 2) {
    summaryParts.push("逆位偏多，说明最近水逆还没走干净。不用慌，逆位不是坏事，是提醒你别头铁。");
    themes.push(themeMap["挑战期"]);
  } else if (reversedCount === 0) {
    summaryParts.push("全是正位！今天气场拉满，买个彩票可能不中但心情一定好。想做什么就去做，宇宙今天不拦你。");
    themes.push(themeMap["清晰顺利"]);
  }

  // Rule 2: Suit dominance
  const suitCounts: Record<string, number> = { cups: 0, wands: 0, swords: 0, pentacles: 0 };
  const suitLabels: Record<string, string> = {
    cups: "圣杯能量超标——你最近情感泛滥得像偶像剧主角。不是心动就是心碎，总之心脏很忙。",
    wands: "权杖把火力拉满了——你现在就像喝了三杯咖啡，满脑子「我能行」。冲可以，但别把拦你的人当反派。",
    swords: "宝剑扎堆——你的大脑在高速运转，要么在辩论要么在复盘要么在脑补别人的心理活动。累不累？",
    pentacles: "钱币主导——满脑子搞钱搞事业搞身体。务实到家了，但别忘了：钱能买床买不到好睡眠。",
  };
  for (const dc of drawnCards) {
    if (dc.card.suit && dc.card.suit in suitCounts) {
      suitCounts[dc.card.suit]++;
    }
  }
  const sortedSuits = Object.entries(suitCounts).sort((a, b) => b[1] - a[1]);
  const dominant = sortedSuits[0];

  if (dominant[1] >= 2 && dominant[0] in suitLabels) {
    summaryParts.push(suitLabels[dominant[0]]);
    const themeKey = `${dominant[0]}Energy`;
    const labelMap: Record<string, string> = {
      cupsEnergy: "圣杯能量",
      wandsEnergy: "权杖能量",
      swordsEnergy: "宝剑能量",
      pentaclesEnergy: "钱币能量",
    };
    themes.push(themeMap[labelMap[themeKey]]);
  }

  // Rule 3: Major Arcana presence
  const majorCount = drawnCards.filter((dc) => dc.card.arcana === "major").length;
  if (majorCount >= 2) {
    summaryParts.push("大牌含量过高——这不是小事，是人生主线剧情。别用「随便吧」的态度面对命运的 VIP 通道。");
    themes.push(themeMap["大牌影响"]);
  }

  // Rule 4: Spread-type framing
  if (spreadType === "single") {
    summaryParts.push(
      question
        ? "针对你的问题，这一张牌给出了最直接的回应。别看它只有一张，浓缩的都是精华（或者暴击）。"
        : "就一张牌，简单直接。它就是你现在的精神 snapshot——不准的话你可以再抽一次反正我也拦不住。"
    );
  } else if (spreadType === "three-past-present") {
    summaryParts.push("「过去」那张说明你从哪趟浑水里爬出来的，「现在」是你在踩的坑，「未来」是坑前面可能出现的路。连起来看，是不是故事线还挺通顺的？");
  } else if (spreadType === "three-problem-advice") {
    summaryParts.push("「问题」直接给你指了病灶，「阻碍」就是那块绊脚石本人的名字，「建议」是你最好的行动方向。三张牌凑一起就是：啥问题 + 谁在搞事 + 怎么办。");
  }

  // Rule 5: Keyword overlap
  const allKeywords = drawnCards.flatMap((dc) => funnyData[dc.card.id].keywords);
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

  return {
    cardInterpretations,
    summary: summaryParts.join(" "),
    themes: [...new Set(themes)],
  };
}
