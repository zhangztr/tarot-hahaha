import { type SpreadType } from "../types/tarot";
import { useT } from "../hooks/useT";

const SPREAD_DESCRIPTIONS: Record<SpreadType, string> = {
  single: "spread.single.desc",
  "three-past-present": "spread.past-present.desc",
  "three-problem-advice": "spread.problem-advice.desc",
};

const SPREAD_LABEL_KEYS: Record<SpreadType, string> = {
  single: "spread.single",
  "three-past-present": "spread.past-present",
  "three-problem-advice": "spread.problem-advice",
};

const spreadTypes: SpreadType[] = ["single", "three-past-present", "three-problem-advice"];

interface SpreadSelectorProps {
  value: SpreadType;
  onChange: (v: SpreadType) => void;
}

export default function SpreadSelector({ value, onChange }: SpreadSelectorProps) {
  const t = useT();

  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      <label className="text-white/50 text-xs font-medium tracking-widest uppercase">
        {t("spread.label")}
      </label>
      {spreadTypes.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
            value === type
              ? "border-mystic-purple bg-mystic-purple/10 text-white"
              : "border-mystic-mid/30 bg-transparent text-white/50 hover:border-mystic-mid/60 hover:text-white/70"
          }`}
        >
          <span className="font-medium text-sm">{t(SPREAD_LABEL_KEYS[type] as any)}</span>
          <span className="block text-xs text-white/40 mt-0.5">
            {t(SPREAD_DESCRIPTIONS[type] as any)}
          </span>
        </button>
      ))}
    </div>
  );
}
