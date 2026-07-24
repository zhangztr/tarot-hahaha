export interface TarotCardConnection {
  cardId: number;
  narrative: string;
}

export interface TarotCard {
  id: number;
  name: string;
  arcana: "major" | "minor";
  suit: "cups" | "wands" | "swords" | "pentacles" | null;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  connections?: TarotCardConnection[];
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: string;
}

export type SpreadType = "single" | "three-past-present" | "three-problem-advice";

export const SPREAD_POSITIONS: Record<SpreadType, string[]> = {
  single: ["position.single"],
  "three-past-present": ["position.past", "position.present", "position.future"],
  "three-problem-advice": ["position.problem", "position.obstacle", "position.advice"],
};

export interface Reading {
  cards: DrawnCard[];
  spreadType: SpreadType;
  question: string | null;
  timestamp: number;
}

export interface Interpretation {
  cardInterpretations: { cardName: string; meaning: string }[];
  summary: string;
  themes: string[];
}
