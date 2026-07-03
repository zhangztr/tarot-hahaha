import type { DrawnCard, Interpretation, SpreadType } from "../types/tarot";
import type { Locale } from "../context/LocaleContext";
import { en, type TranslationKey } from "../i18n/en";
import { zh } from "../i18n/zh";

const tMap = { en, zh };

export function generateInterpretation(
  drawnCards: DrawnCard[],
  spreadType: SpreadType,
  question: string | null,
  locale: Locale
): Interpretation {
  const t = tMap[locale];
  const cardInterpretations = drawnCards.map((dc) => ({
    cardName: locale === "zh" ? dc.card.nameZh : dc.card.name,
    meaning: locale === "zh"
      ? (dc.isReversed ? dc.card.reversedMeaningZh : dc.card.uprightMeaningZh)
      : (dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning),
  }));

  const summaryParts: string[] = [];
  const themes: string[] = [];

  // Rule 1: Reversal ratio
  const reversedCount = drawnCards.filter((dc) => dc.isReversed).length;
  if (reversedCount === drawnCards.length) {
    summaryParts.push(t["interpret.allReversed"]);
    themes.push(t["theme.strongResistance"]);
  } else if (reversedCount > drawnCards.length / 2) {
    summaryParts.push(t["interpret.mostlyReversed"]);
    themes.push(t["theme.challenge"]);
  } else if (reversedCount === 0) {
    summaryParts.push(t["interpret.allUpright"]);
    themes.push(t["theme.clarity"]);
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

  if (dominant[1] >= 2) {
    const key = `interpret.${dominant[0]}Dominant` as TranslationKey;
    const themeKey = `theme.${dominant[0]}Energy` as TranslationKey;
    summaryParts.push(t[key]);
    themes.push(t[themeKey]);
  }

  // Rule 3: Major Arcana presence
  const majorCount = drawnCards.filter((dc) => dc.card.arcana === "major").length;
  if (majorCount >= 2) {
    summaryParts.push(t["interpret.majorInfluence"]);
    themes.push(t["theme.majorInfluence"]);
  }

  // Rule 4: Spread-type framing
  if (spreadType === "single") {
    summaryParts.push(
      question ? t["interpret.singleFrameQ"] : t["interpret.singleFrame"]
    );
  } else if (spreadType === "three-past-present") {
    summaryParts.push(t["interpret.pastPresentFrame"]);
  } else if (spreadType === "three-problem-advice") {
    summaryParts.push(t["interpret.problemAdviceFrame"]);
  }

  // Rule 5: Keyword overlap
  const keywordsList = locale === "zh"
    ? drawnCards.flatMap((dc) => dc.card.keywordsZh)
    : drawnCards.flatMap((dc) => dc.card.keywords);
  const freq = new Map<string, number>();
  for (const kw of keywordsList) {
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
