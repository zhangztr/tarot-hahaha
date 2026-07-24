const fs = require("fs");
const path = require("path");

const src = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/tarot-funny.json"), "utf-8")
);

const dir = path.join(__dirname, "../src/data/funny");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// zh: use default fields
const zh = src.map((c) => ({
  id: c.id,
  name: c.name,
  uprightMeaning: c.uprightMeaning,
  reversedMeaning: c.reversedMeaning,
  keywords: c.keywords,
  connections: (c.connections || []).map((conn) => ({
    cardId: conn.cardId,
    narrative: conn.narrative,
  })),
}));
fs.writeFileSync(path.join(dir, "zh.json"), JSON.stringify(zh, null, 2), "utf-8");

// en: use *En fields
const en = src.map((c) => ({
  id: c.id,
  name: c.nameEn || c.name,
  uprightMeaning: c.uprightMeaningEn || c.uprightMeaning,
  reversedMeaning: c.reversedMeaningEn || c.reversedMeaning,
  keywords: c.keywordsEn || c.keywords,
  connections: (c.connections || []).map((conn) => ({
    cardId: conn.cardId,
    narrative: conn.narrativeEn || conn.narrative,
  })),
}));
fs.writeFileSync(path.join(dir, "en.json"), JSON.stringify(en, null, 2), "utf-8");

// ja/fr/ru: copy English for now
for (const loc of ["ja", "fr", "ru"]) {
  fs.writeFileSync(path.join(dir, `${loc}.json`), JSON.stringify(en, null, 2), "utf-8");
}

console.log("Done: funny/zh.json, en.json, ja.json, fr.json, ru.json");
