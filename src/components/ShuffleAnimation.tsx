import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import CardBack from "./CardBack";

const CARD_COUNT = 6;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface CardState {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

function buildPositions(phase: string): CardState[] {
  const states: CardState[] = [];

  for (let i = 0; i < CARD_COUNT; i++) {
    let x = 0;
    let y = 0;
    let rotate = 0;
    let scale = 1;

    switch (phase) {
      case "rise": {
        // Tight stack with slight offsets, coming from below
        x = (Math.random() - 0.5) * 8;
        y = 40 + i * 3;
        rotate = (Math.random() - 0.5) * 6;
        scale = 0.85 + Math.random() * 0.1;
        break;
      }
      case "spread": {
        // Fan out in an arc
        const angle = ((i / (CARD_COUNT - 1)) - 0.5) * 100;
        const radius = 140;
        const rad = (angle * Math.PI) / 180;
        x = Math.sin(rad) * radius;
        y = Math.cos(rad) * 40 - 20;
        rotate = angle * 0.5;
        scale = 1;
        break;
      }
      case "shuffle1":
      case "shuffle2": {
        // Messy cluster — cards interleaving at different depths
        const row = i < 3 ? 0 : 1;
        const col = i % 3;
        x = (col - 1) * 50 + (Math.random() - 0.5) * 20;
        y = row * 30 - 15 + (Math.random() - 0.5) * 15;
        rotate = (Math.random() - 0.5) * 25;
        scale = 0.9 + Math.random() * 0.15;
        break;
      }
      case "gather": {
        // Tight compact stack — dramatic snap to center
        x = (Math.random() - 0.5) * 3;
        y = i * 1.5;
        rotate = (Math.random() - 0.5) * 2;
        scale = 0.88;
        break;
      }
      case "drop": {
        // Scatter and fall away — dramatic exit
        const dir = (i < CARD_COUNT / 2 ? -1 : 1);
        x = dir * (80 + Math.random() * 120) + (Math.random() - 0.5) * 40;
        y = 180 + Math.random() * 120 + i * 15;
        rotate = dir * (30 + Math.random() * 50);
        scale = 0.55 + Math.random() * 0.2;
        break;
      }
    }

    states.push({ id: i, x, y, rotate, scale });
  }

  return states;
}

interface ShuffleAnimationProps {
  active: boolean;
}

export default function ShuffleAnimation({ active }: ShuffleAnimationProps) {
  const [phase, setPhase] = useState<string>("rise");
  const [order, setOrder] = useState(() =>
    Array.from({ length: CARD_COUNT }, (_, i) => i)
  );

  useEffect(() => {
    if (!active) return;
    setPhase("rise");
    setOrder(Array.from({ length: CARD_COUNT }, (_, i) => i));

    const t1 = setTimeout(() => setPhase("spread"),        300);
    const t2 = setTimeout(() => {
      setOrder(shuffled(order));
      setPhase("shuffle1");
    },                                                       650);
    const t3 = setTimeout(() => {
      setOrder(shuffled(order));
      setPhase("shuffle2");
    },                                                       950);
    const t4 = setTimeout(() => setPhase("gather"),         1250);
    const t5 = setTimeout(() => setPhase("drop"),           1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [active]);

  if (!active) return null;

  const positions = buildPositions(phase);

  return (
    <AnimatePresence>
      <div className="relative w-full h-72 flex items-center justify-center">
        {/* Ambient glow behind cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="absolute w-32 h-32 rounded-full bg-mystic-purple/15 blur-3xl"
        />

        {order.map((cardId, idx) => {
          const pos = positions.find((p) => p.id === cardId)!;
          return (
            <motion.div
              key={cardId}
              layout
              initial={{ y: 200, opacity: 0, scale: 0.7 }}
              animate={{
                x: pos.x,
                y: pos.y,
                rotate: pos.rotate,
                scale: pos.scale,
                opacity: phase === "drop" ? 0 : 1,
              }}
              exit={{ y: -200, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: phase === "gather" ? 300 : phase === "drop" ? 80 : phase === "shuffle1" || phase === "shuffle2" ? 200 : 120,
                damping: phase === "gather" ? 20 : phase === "drop" ? 12 : phase === "shuffle1" || phase === "shuffle2" ? 14 : 18,
                mass: phase === "drop" ? 0.8 : 0.5,
              }}
              className="absolute w-16 h-24 sm:w-20 sm:h-28"
              style={{ zIndex: idx }}
            >
              <CardBack />
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
}
