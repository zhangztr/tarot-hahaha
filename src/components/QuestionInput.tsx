import { useT } from "../hooks/useT";

interface QuestionInputProps {
  value: string;
  onChange: (v: string) => void;
}

export default function QuestionInput({ value, onChange }: QuestionInputProps) {
  const t = useT();

  return (
    <div className="w-full max-w-md">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("question.placeholder")}
        rows={2}
        className="w-full bg-mystic-dark/50 border border-mystic-mid/50 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/20 resize-none focus:outline-none focus:border-mystic-purple/60 focus:ring-1 focus:ring-mystic-purple/30 transition-colors"
      />
    </div>
  );
}
