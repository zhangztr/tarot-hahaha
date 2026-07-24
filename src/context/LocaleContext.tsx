import { createContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "zh" | "en" | "ja" | "fr" | "ru";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

function getInitialLocale(): Locale {
  const valid: Locale[] = ["zh", "en", "ja", "fr", "ru"];
  try {
    const stored = localStorage.getItem("tarot-locale");
    if (valid.includes(stored as Locale)) return stored as Locale;
  } catch {}
  return "zh";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("tarot-locale", l);
    } catch {}
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next = prev === "en" ? "zh" : "en";
      try {
        localStorage.setItem("tarot-locale", next);
      } catch {}
      return next;
    });
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
