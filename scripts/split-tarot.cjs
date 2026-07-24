// Split tarot.json into per-locale files
const fs = require("fs");
const path = require("path");

const src = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/tarot.json"), "utf-8")
);

const locales = ["en", "zh", "ja", "fr", "ru"];

const map = { en: "en", zh: "Zh" };
// ja/fr/ru start as copies of en — translations filled in next step
for (const loc of ["ja", "fr", "ru"]) map[loc] = "en";

for (const loc of locales) {
  const suffix = map[loc];
  const isZh = suffix === "Zh";
  const isEnFallback = suffix === "en" && loc !== "en";

  const cards = src.cards.map((c) => ({
    id: c.id,
    name: isZh ? c.nameZh : c.name,
    arcana: c.arcana,
    suit: c.suit,
    uprightMeaning: isZh ? c.uprightMeaningZh : c.uprightMeaning,
    reversedMeaning: isZh ? c.reversedMeaningZh : c.reversedMeaning,
    keywords: isZh ? c.keywordsZh : c.keywords,
    connections: (c.connections || []).map((conn) => ({
      cardId: conn.cardId,
      narrative: isZh ? conn.narrativeZh : conn.narrative,
    })),
  }));

  const dir = path.join(__dirname, "../src/data/tarot");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, `${loc}.json`),
    JSON.stringify({ cards }, null, 2),
    "utf-8"
  );
}

console.log("Done. Created:", locales.map((l) => `src/data/tarot/${l}.json`).join(", "));
// ja, fr, ru are English copies — need real translations
