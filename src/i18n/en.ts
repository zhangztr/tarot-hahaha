export const en = {
  // Header
  "header.title": "Arcana",
  "header.contact": "Contact me:",
  "header.slogan": "Grateful for your feedback — looking forward to working with you",

  // HomePage
  "home.headline1": "Unveil What the",
  "home.headline2": "Universe",
  "home.headline3": "Holds",
  "home.subtitle": "Draw from the ancient wisdom of Tarot. Ask a question, choose a spread, and let the cards speak.",

  // QuestionInput
  "question.placeholder": "What's on your mind? (optional)",

  // SpreadSelector
  "spread.label": "Choose Your Spread",
  "spread.single": "Single Card",
  "spread.single.desc": "Quick guidance for the moment",
  "spread.past-present": "Past · Present · Future",
  "spread.past-present.desc": "Understand how past, present, and future connect",
  "spread.problem-advice": "Problem · Obstacle · Advice",
  "spread.problem-advice.desc": "Identify the core issue and find a path forward",

  // DrawButton
  "draw.button": "Draw Cards",
  "draw.shuffling": "Shuffling...",

  // ResultPage
  "result.newReading": "New Reading",
  "result.reshuffle": "Reshuffle",
  "result.singleLabel": "Single Card Reading",
  "result.threeLabel": "Three Card Reading",

  // CardFace
  "card.majorArcana": "Major Arcana",
  "card.reversed": "Reversed",
  "card.upright": "Upright",

  // Spread positions
  "position.single": "Your Card",
  "position.past": "Past",
  "position.present": "Present",
  "position.future": "Future",
  "position.problem": "Problem",
  "position.obstacle": "Obstacle",
  "position.advice": "Advice",

  // Suits
  "suit.cups": "Cups",
  "suit.wands": "Wands",
  "suit.swords": "Swords",
  "suit.pentacles": "Pentacles",

  // SummaryBlock
  "summary.title": "Your Reading",

  // Interpretation engine
  "interpret.allReversed": "All cards appear reversed, suggesting significant internal resistance or external obstacles at play.",
  "interpret.mostlyReversed": "More cards are reversed than upright, indicating a period of challenge and introspection.",
  "interpret.allUpright": "All cards are upright, suggesting clarity, forward momentum, and alignment.",
  "interpret.cupsDominant": "A strong emotional current runs through this reading. Matters of the heart, relationships, and intuition are at the forefront.",
  "interpret.wandsDominant": "Strong action energy is present. This reading speaks to ambition, creativity, and forward drive.",
  "interpret.swordsDominant": "The intellect dominates. Logic, communication, and mental clarity — or conflict — are key themes.",
  "interpret.pentaclesDominant": "Material and practical concerns take center stage. Focus on finances, career, health, and tangible results.",
  "interpret.majorInfluence": "Multiple Major Arcana cards signal that fate or larger life forces are at work — this is not a trivial matter.",
  "interpret.singleFrame": "This card represents the core energy surrounding your situation right now.",
  "interpret.singleFrameQ": "This card represents the core energy surrounding your question right now.",
  "interpret.pastPresentFrame": "The Past card reveals the foundation, the Present card shows your current state, and the Future card hints at what is unfolding.",
  "interpret.problemAdviceFrame": "The Problem card identifies the core issue, the Obstacle card reveals what stands in your way, and the Advice card offers guidance forward.",

  // Themes
  "theme.strongResistance": "Strong Resistance",
  "theme.challenge": "Challenge",
  "theme.clarity": "Clarity",
  "theme.cupsEnergy": "Cups Energy",
  "theme.wandsEnergy": "Wands Energy",
  "theme.swordsEnergy": "Swords Energy",
  "theme.pentaclesEnergy": "Pentacles Energy",
  "theme.majorInfluence": "Major Arcana Influence",
  "theme.cardSynergy": "Card Synergy",
} as const;

export type TranslationKey = keyof typeof en;
