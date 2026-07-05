import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useReading } from "../hooks/useReading";
import { useT, useLocale, useFunMode } from "../hooks/useT";
import { generateInterpretation } from "../utils/interpret";
import { generateInterpretationFunny } from "../utils/interpret-funny";
import type { Reading } from "../types/tarot";
import CardGrid from "../components/CardGrid";
import SummaryBlock from "../components/SummaryBlock";

export default function ResultPage() {
  const { reading: ctxReading, clearReading } = useReading();
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();
  const { locale } = useLocale();
  const { funMode } = useFunMode();
  const [showSummary, setShowSummary] = useState(false);

  const routeState = location.state as { reading?: Reading } | null;
  const reading = routeState?.reading ?? ctxReading;

  useEffect(() => {
    if (!reading) {
      navigate("/", { replace: true });
    }
  }, [reading, navigate]);

  const interpretation = useMemo(() => {
    if (!reading) return null;
    if (locale === "zh" && funMode) {
      return generateInterpretationFunny(reading.cards, reading.spreadType, reading.question);
    }
    return generateInterpretation(reading.cards, reading.spreadType, reading.question, locale);
  }, [reading, locale, funMode]);

  useEffect(() => {
    if (!reading) return;
    const cardCount = reading.cards.length;
    const lastDealDelay = (cardCount - 1) * 500;
    const lastFlipDelay = 1200 + (cardCount - 1) * 600 + 700 + 200;
    const total = lastDealDelay + lastFlipDelay;
    const timer = setTimeout(() => setShowSummary(true), total);
    return () => clearTimeout(timer);
  }, [reading]);

  if (!reading || !interpretation) return null;

  const spreadLabel =
    reading.spreadType === "single" ? t("result.singleLabel") : t("result.threeLabel");

  return (
    <div className="w-full flex flex-col items-center pt-8">
      <div className="w-full max-w-2xl flex items-center justify-between mb-10">
        <button
          onClick={() => {
            clearReading();
            navigate("/");
          }}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("result.newReading")}
        </button>

        <span className="text-white/30 text-xs font-medium tracking-widest uppercase">
          {spreadLabel}
        </span>

        <button
          onClick={() => {
            clearReading();
            navigate("/");
          }}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          {t("result.reshuffle")}
        </button>
      </div>

      {reading.question && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/40 text-sm italic mb-8 text-center max-w-md"
        >
          &ldquo;{reading.question}&rdquo;
        </motion.p>
      )}

      <CardGrid drawnCards={reading.cards} started={true} />

      <SummaryBlock interpretation={interpretation} visible={showSummary} />
    </div>
  );
}
