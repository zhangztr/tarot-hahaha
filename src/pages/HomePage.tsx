import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import type { SpreadType, TarotCard } from "../types/tarot";
import { useReading } from "../hooks/useReading";
import { useT } from "../hooks/useT";
import { drawCards } from "../utils/draw";
import tarotDataRaw from "../data/tarot.json";
import QuestionInput from "../components/QuestionInput";
import SpreadSelector from "../components/SpreadSelector";
import DrawButton from "../components/DrawButton";
import ShuffleAnimation from "../components/ShuffleAnimation";

const tarotData = tarotDataRaw as { cards: TarotCard[] };

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [spreadType, setSpreadType] = useState<SpreadType>("three-past-present");
  const [loading, setLoading] = useState(false);

  const { setReading } = useReading();
  const navigate = useNavigate();
  const t = useT();

  const handleDraw = () => {
    setLoading(true);

    setTimeout(() => {
      const cards = drawCards(tarotData.cards, spreadType);
      const reading = {
        cards,
        spreadType,
        question: question.trim() || null,
        timestamp: Date.now(),
      };
      setReading(reading);
      setLoading(false);
      navigate("/result", { state: { reading } });
    }, 2300);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-lg pt-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h1 className="font-serif text-3xl sm:text-4xl text-white mb-3 leading-[1.15]">
          {t("home.headline1")}
          <br />
          <span className="text-mystic-gold">{t("home.headline2")}</span>{" "}
          {t("home.headline3")}
        </h1>
        <p className="text-white/50 text-sm max-w-sm mx-auto">
          {t("home.subtitle")}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="shuffle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center gap-6"
          >
            <ShuffleAnimation active={loading} />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="w-full flex flex-col items-center gap-6"
          >
            <QuestionInput value={question} onChange={setQuestion} />
            <SpreadSelector value={spreadType} onChange={setSpreadType} />
            <DrawButton onClick={handleDraw} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
