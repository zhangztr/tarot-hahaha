import { motion } from "motion/react";
import type { Interpretation } from "../types/tarot";
import { useT } from "../hooks/useT";

interface SummaryBlockProps {
  interpretation: Interpretation;
  visible: boolean;
}

export default function SummaryBlock({ interpretation, visible }: SummaryBlockProps) {
  const t = useT();
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mt-12"
    >
      <div className="grid gap-6 mb-8">
        {interpretation.cardInterpretations.map((ci, i) => (
          <div
            key={i}
            className="bg-mystic-dark/40 border border-mystic-mid/30 rounded-xl p-5"
          >
            <h3 className="font-serif text-mystic-gold text-lg mb-2">
              {ci.cardName}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">{ci.meaning}</p>
          </div>
        ))}
      </div>

      <div className="bg-mystic-dark/40 border border-mystic-purple/30 rounded-xl p-5 mb-6">
        <h3 className="font-serif text-white text-lg mb-3">{t("summary.title")}</h3>
        <p className="text-white/80 text-sm leading-relaxed">
          {interpretation.summary}
        </p>
      </div>

      {interpretation.themes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {interpretation.themes.map((theme) => (
            <span
              key={theme}
              className="px-3 py-1 rounded-full bg-mystic-purple/15 border border-mystic-purple/30 text-mystic-light text-xs font-medium"
            >
              {theme}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
