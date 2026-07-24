import { useEffect, useState } from "react";
import { useLocale } from "./useT";
import type { TarotCard } from "../types/tarot";

const tarotModules = import.meta.glob<TarotCard[]>(
  "../data/tarot/*.json",
  { import: "default" }
);

const cache = new Map<string, TarotCard[]>();

export function loadTarotCards(locale: string): Promise<TarotCard[]> {
  if (cache.has(locale)) return Promise.resolve(cache.get(locale)!);

  const loader = tarotModules[`../data/tarot/${locale}.json`];
  if (!loader) {
    return loadTarotCards("en");
  }
  return loader().then((mod) => {
    const cards = (mod as any).cards as TarotCard[];
    cache.set(locale, cards);
    return cards;
  });
}

export function useTarotCards() {
  const { locale } = useLocale();
  const [cards, setCards] = useState<TarotCard[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCards(null);
    loadTarotCards(locale).then((data) => {
      if (!cancelled) setCards(data);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return cards;
}
