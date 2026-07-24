import type { DrawnCard } from "../types/tarot";
import { useT, useLocale, useFunMode } from "../hooks/useT";
import funnyData from "../data/tarot-funny.json";

function funnyField(funny: any, field: string, fieldEn: string, locale: string): string {
  return locale === "zh" ? funny[field] : (funny[fieldEn] || funny[field]);
}

function funnyKeywords(funny: any, locale: string): string[] {
  return locale === "zh" ? funny.keywords : (funny.keywordsEn || funny.keywords);
}

interface CardFaceProps {
  drawnCard: DrawnCard;
}

export default function CardFace({ drawnCard }: CardFaceProps) {
  const { card, isReversed, position } = drawnCard;
  const t = useT();
  const { locale } = useLocale();
  const { funMode } = useFunMode();

  const funny = funMode ? (funnyData as any)[card.id] : null;

  const name = funny
    ? funnyField(funny, "name", "nameEn", locale)
    : card.name;
  const meaning = funny
    ? (isReversed
        ? funnyField(funny, "reversedMeaning", "reversedMeaningEn", locale)
        : funnyField(funny, "uprightMeaning", "uprightMeaningEn", locale))
    : (isReversed ? card.reversedMeaning : card.uprightMeaning);
  const keywords = funny
    ? funnyKeywords(funny, locale)
    : card.keywords;
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
