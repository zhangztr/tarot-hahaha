import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { DrawnCard } from "../types/tarot";
import CardBack from "./CardBack";
import CardFace from "./CardFace";

interface AnimatedCardProps {
  drawnCard: DrawnCard;
  dealDelay: number;
  flipDelay: number;
}

export default function AnimatedCard({ drawnCard, dealDelay, flipDelay }: AnimatedCardProps) {
  const [flipped, setFlipped] = useState(false);
  const flippedRef = useRef(false);

  useEffect(() => {
    let innerTimer: ReturnType<typeof setTimeout>;
    const outerTimer = setTimeout(() => {
      const jitter = Math.random() * 200;
      innerTimer = setTimeout(() => {
        if (!flippedRef.current) {
          flippedRef.current = true;
          setFlipped(true);
        }
      }, jitter);
    }, flipDelay);
    return () => {
      clearTimeout(outerTimer);
      clearTimeout(innerTimer);
    };
  }, [flipDelay]);

  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: dealDelay / 1000,
      }}
      whileHover={flipped ? { y: -8, filter: "drop-shadow(0 0 16px rgba(168, 85, 247, 0.5))" } : {}}
      className="w-56 h-80 sm:w-60 sm:h-80 cursor-pointer"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front (card back before flip) */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardBack />
        </div>

        {/* Back (card face after flip) */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardFace drawnCard={drawnCard} />
        </div>
      </motion.div>
    </motion.div>
  );
}
