import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useT } from "../hooks/useT";

interface DrawButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function DrawButton({ onClick, disabled, loading }: DrawButtonProps) {
  const t = useT();

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className="px-10 py-4 rounded-full bg-mystic-purple hover:bg-mystic-light text-white font-medium flex items-center gap-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(107,63,160,0.4)]"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {t("draw.shuffling")}
        </>
      ) : (
        <>
          {t("draw.button")}
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </motion.button>
  );
}
