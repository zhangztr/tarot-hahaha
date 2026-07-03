import type { DrawnCard } from "../types/tarot";
import AnimatedCard from "./AnimatedCard";

interface CardGridProps {
  drawnCards: DrawnCard[];
  started: boolean;
}

export default function CardGrid({ drawnCards, started }: CardGridProps) {
  if (!started) return null;

  return (
    <div className="flex flex-wrap items-start justify-center gap-6">
      {drawnCards.map((dc, index) => (
        <AnimatedCard
          key={`${dc.card.id}-${index}`}
          drawnCard={dc}
          dealDelay={index * 500}
          flipDelay={1200 + index * 600}
        />
      ))}
    </div>
  );
}
