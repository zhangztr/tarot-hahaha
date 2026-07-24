import type { DrawnCard } from "../types/tarot";
import { useT, useFunMode } from "../hooks/useT";
import { useFunnyCards } from "../hooks/useTarotCards";

interface CardFaceProps {
  drawnCard: DrawnCard;
}

export default function CardFace({ drawnCard }: CardFaceProps) {
  const { card, isReversed, position } = drawnCard;
  const t = useT();
  const { funMode } = useFunMode();

  const funnyDeck = useFunnyCards();
  const funny = funMode && funnyDeck ? funnyDeck.find((c) => c.id === card.id) : null;

  const name = funny ? funny.name : card.name;
  const meaning = funny
    ? (isReversed ? funny.reversedMeaning : funny.uprightMeaning)
    : (isReversed ? card.reversedMeaning : card.uprightMeaning);
  const keywords = funny ? funny.keywords : card.keywords;
  const arcanaLabel = card.arcana === "major" ? t("card.majorArcana") : "";
  const suitLabel = card.suit ? t(`suit.${card.suit}` as any) : "";
  const arcanaDisplay = card.arcana === "major" ? arcanaLabel : suitLabel;

  return (
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-mystic-dark via-mystic-mid/60 to-mystic-dark border-2 border-mystic-purple/50 p-4 flex flex-col overflow-hidden">
      <span className="text-mystic-gold text-xs font-medium tracking-widest uppercase mb-1">
        {t(position as any)}
      </span>

      <h3 className="font-serif text-white text-base leading-tight mb-2">
        {name}
      </h3>

      <div className="flex gap-2 mb-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-mystic-purple/20 text-mystic-light font-medium">
          {arcanaDisplay}
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
            isReversed
              ? "bg-red-900/30 text-red-300"
              : "bg-teal-900/30 text-mystic-teal"
          }`}
        >
          {isReversed ? t("card.reversed") : t("card.upright")}
        </span>
      </div>

      <p className="text-white/70 text-xs leading-relaxed flex-1 overflow-y-auto">
        {meaning}
      </p>

      <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-mystic-mid/50">
        {keywords.slice(0, 4).map((kw: string) => (
          <span
            key={kw}
            className="text-[10px] px-1.5 py-0.5 rounded-full bg-mystic-mid/50 text-white/50"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
