import { shuffle } from "./shuffle";
import { SPREAD_POSITIONS, type DrawnCardLight, type SpreadType, type TarotCard } from "../types/tarot";

export function drawCards(deck: TarotCard[], spreadType: SpreadType): DrawnCardLight[] {
  const count = spreadType === "single" ? 1 : 3;
  const shuffled = shuffle(deck);
  const positions = SPREAD_POSITIONS[spreadType];

  return shuffled.slice(0, count).map((card, index) => ({
    cardId: card.id,
    isReversed: Math.random() > 0.5,
    position: positions[index],
  }));
}
