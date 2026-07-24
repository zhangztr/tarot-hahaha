import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocale, useFunMode, useT } from "../hooks/useT";
import type { Locale } from "../context/LocaleContext";

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "zh", label: "中文" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "fr", label: "Français" },
  { code: "ru", label: "Русский" },
];

export default function Header() {
  const { locale, setLocale } = useLocale();
  const { funMode, toggleFunMode } = useFunMode();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

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
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <Sparkles className="w-5 h-5 text-mystic-gold" strokeWidth={1.5} />
          <span className="font-serif text-xl text-white tracking-wide group-hover:text-mystic-light transition-colors">
            {t("header.title")}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Funny mode toggle */}
          <button
            onClick={toggleFunMode}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              funMode
                ? "border-mystic-gold/60 text-mystic-gold bg-mystic-gold/10"
                : "border-mystic-mid/40 text-white/50 hover:text-white hover:border-mystic-mid/60"
            }`}
          >
            {funMode ? (locale === "zh" ? "😂 搞笑" : "😂 Funny") : (locale === "zh" ? "正经" : "Normal")}
          </button>

          {/* Language dropdown */}
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-mystic-mid/40 text-sm text-white/70 hover:text-white hover:border-mystic-purple/50 transition-colors"
            >
              <span>{current.label}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50 min-w-[140px]"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2
                        ${lang.code === locale
                          ? "text-mystic-gold bg-mystic-gold/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
}
