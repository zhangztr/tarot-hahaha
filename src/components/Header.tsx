import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useLocale, useFunMode, useT } from "../hooks/useT";

export default function Header() {
  const { locale, toggleLocale } = useLocale();
  const { funMode, toggleFunMode } = useFunMode();
  const t = useT();

  return (
    <>
      {/* Contact banner */}
      <div className="w-full bg-mystic-dark/60 border-b border-mystic-mid/20 py-2 px-6 text-center">
        <span className="text-white/50 text-xs">
          {t("header.contact")} ztry666@qq.com
          <span className="mx-2 text-mystic-mid/50">|</span>
          {t("header.slogan")}
        </span>
      </div>

      <header className="w-full py-6 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <Sparkles className="w-5 h-5 text-mystic-gold" strokeWidth={1.5} />
          <span className="font-serif text-xl text-white tracking-wide group-hover:text-mystic-light transition-colors">
            {locale === "zh" ? "塔罗秘境" : "Arcana"}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Funny mode toggle — only visible in Chinese */}
          {locale === "zh" && (
            <button
              onClick={toggleFunMode}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                funMode
                  ? "border-mystic-gold/60 text-mystic-gold bg-mystic-gold/10"
                  : "border-mystic-mid/40 text-white/50 hover:text-white hover:border-mystic-mid/60"
              }`}
            >
              {funMode ? "😂 搞笑" : "正经模式"}
            </button>
          )}

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="w-16 py-1.5 rounded-full border border-mystic-mid/40 text-xs font-medium text-white/60 hover:text-white hover:border-mystic-purple/50 transition-colors"
          >
            {locale === "zh" ? "EN" : "中文"}
          </button>
        </div>
      </header>
    </>
  );
}
