/**
 * GitHub Pages SPA fallback for 404.html.
 *
 * GitHub Pages has no rewrite rules, so a deep link such as
 * `/blog/getting-started` hits no file and GitHub serves `404.html` instead.
 * This module runs on that page: it stashes the requested path and sends the
 * visitor back to the root, where the SPA boots and `restoreRedirectedPath()`
 * (see App.tsx) puts the original URL back with `history.replaceState`.
 *
 * This file is a SEPARATE build entry, so it is never pulled into the main
 * bundle — the SPA never imports it, only `/404.html` does.
 */
import { REDIRECT_KEY } from "./redirectPath";
import { en } from "./i18n/en";
import { zh } from "./i18n/zh";
import { ja } from "./i18n/ja";
import { fr } from "./i18n/fr";
import { ru } from "./i18n/ru";

const translations = { zh, en, ja, fr, ru };
type Locale = keyof typeof translations;

function detectLocale(): Locale {
  const valid = Object.keys(translations) as Locale[];

  // Same key the SPA uses, so a returning visitor sees their own language.
  try {
    const stored = localStorage.getItem("tarot-locale");
    if (stored && valid.includes(stored as Locale)) return stored as Locale;
  } catch {
    // localStorage can throw in private mode or a sandboxed frame.
  }

  const candidates = [navigator.language, ...(navigator.languages ?? [])];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const base = candidate.toLowerCase().split("-")[0];
    if (base && valid.includes(base as Locale)) return base as Locale;
  }
  return "en";
}

function main() {
  const path = window.location.pathname + window.location.search;

  // Never bounce the root itself — that would be an infinite redirect loop.
  const isRoot = window.location.pathname === "/";

  const t = translations[detectLocale()];

  // Swap in translated copy as soon as the script runs, so a slow connection
  // never leaves raw English placeholders on screen.
  const message = document.getElementById("redirect-message");
  if (message) message.textContent = t["redirect.message"];
  const home = document.getElementById("redirect-home");
  if (home) home.textContent = t["redirect.goHome"];
  document.documentElement.lang = detectLocale();

  if (!isRoot) {
    try {
      sessionStorage.setItem(REDIRECT_KEY, path);
    } catch {
      // Without sessionStorage the visitor still lands on the home page; the
      // deep link is simply lost rather than showing a broken 404.
    }
  }

  // `replace` keeps the bogus 404 URL out of the back-button history.
  window.location.replace("/");
}

main();
