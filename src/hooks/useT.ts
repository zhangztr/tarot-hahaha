import { useContext } from "react";
import { LocaleContext, type Locale } from "../context/LocaleContext";
import { ModeContext } from "../context/ModeContext";
import { en, type TranslationKey } from "../i18n/en";
import { zh } from "../i18n/zh";

const translations: Record<Locale, Record<TranslationKey, string>> = { en, zh };

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useFunMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useFunMode must be used within ModeProvider");
  return ctx;
}

export function useT() {
  const { locale } = useLocale();
  return (key: TranslationKey): string => translations[locale][key];
}
