/**
 * Verification harness for the GitHub Pages 404 SPA fallback.
 * Run `npm run verify:spa` after a build (it reads the built chunks).
 *
 * It executes the BUILT redirect chunk inside a mocked browser to prove:
 *   - the deep-link path is stashed under the key the SPA reads
 *   - the visitor is bounced with location.replace("/")
 *   - the root path never stashes (no redirect loop)
 *   - locale detection order is localStorage -> navigator.language -> en
 * and then executes the real restoreRedirectedPath() from App.tsx to prove the
 * stashed path is turned back into a URL, while open-redirect inputs are
 * rejected.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

const REDIRECT_KEY = "tarot-redirect-path"; // must match src/redirectPath.ts
const projectRoot = join(import.meta.dirname, "..");
const assetsDir = join(projectRoot, "dist", "assets");
if (!existsSync(assetsDir)) {
  console.error("dist/assets not found — run `npm run build` first.");
  process.exit(1);
}

const chunkName = readdirSync(assetsDir).find((f) => f.startsWith("redirect-") && f.endsWith(".js"));
if (!chunkName) throw new Error("redirect chunk not found in dist/assets");
const code = readFileSync(join(assetsDir, chunkName), "utf8");

// The chunk is an ES module that imports its locale table from a shared chunk.
// We inject those bindings instead, so drop the import statement.
const importPattern = /^import\s*\{[^}]*\}\s*from\s*["'][^"']+["'];?/m;
if (!importPattern.test(code)) {
  throw new Error(`expected an import statement at the top of ${chunkName}`);
}
const codeWithoutImport = code.replace(importPattern, "");

// The chunk imports its locale table from a shared chunk, so build a stub from
// the real i18n sources. This makes the test fail if a language file is missing
// the redirect keys, or if the chunk asks for the wrong property name.
const locales = ["zh", "en", "ja", "fr", "ru"];
const i18n = {};
for (const locale of locales) {
  const source = readFileSync(join(projectRoot, "src", "i18n", `${locale}.ts`), "utf8");
  const read = (key) => {
    const match = source.match(new RegExp(`"${key}":\\s*"([^"]*)"`));
    if (!match) throw new Error(`src/i18n/${locale}.ts is missing "${key}"`);
    return match[1];
  };
  i18n[locale] = {
    "redirect.message": read("redirect.message"),
    "redirect.goHome": read("redirect.goHome"),
  };
}

// Alias mapping is copied from the chunk's own import statement:
//   import{r as i,f as r,j as d,e as l,z as m,R as g}
const stubModule = {
  r: i18n.fr,
  f: i18n.ru,
  j: i18n.ja,
  e: i18n.en,
  z: i18n.zh,
  R: REDIRECT_KEY,
};

function run({ pathname, search = "", storedLocale = null, language = "en-US" }) {
  const store = new Map();
  if (storedLocale) store.set("tarot-locale", storedLocale);
  const session = new Map();
  const replaced = [];
  const dom = new Map([
    ["redirect-message", { textContent: "" }],
    ["redirect-home", { textContent: "" }],
  ]);

  const sandbox = {
    navigator: { language, languages: [language] },
    localStorage: { getItem: (k) => store.get(k) ?? null },
    sessionStorage: { setItem: (k, v) => session.set(k, v) },
    document: {
      getElementById: (id) => dom.get(id) ?? null,
      documentElement: { lang: "" },
    },
    window: { location: { pathname, search, replace: (u) => replaced.push(u) } },
  };
  sandbox.globalThis = sandbox;

  vm.createContext(sandbox);
  const wrapper = new vm.Script(
    `(function(__m){ const {r:i,f:r,j:d,e:l,z:m,R:g} = __m; ${codeWithoutImport} })`
  );
  wrapper.runInContext(sandbox)(stubModule);

  return {
    stashed: session.get(REDIRECT_KEY) ?? null,
    replaced,
    lang: sandbox.document.documentElement.lang,
    message: dom.get("redirect-message").textContent,
    home: dom.get("redirect-home").textContent,
  };
}

const cases = [
  { name: "deep link /blog/getting-started", args: { pathname: "/blog/getting-started" }, expectStash: "/blog/getting-started", expectReplace: "/" },
  { name: "deep link with query ?ref=abc", args: { pathname: "/blog", search: "?ref=abc" }, expectStash: "/blog?ref=abc", expectReplace: "/" },
  { name: "root / must NOT stash", args: { pathname: "/" }, expectStash: null, expectReplace: "/" },
  { name: "zh locale from localStorage", args: { pathname: "/blog", storedLocale: "zh" }, expectStash: "/blog", expectReplace: "/", expectLang: "zh", expectMessage: "正在跳转…" },
  { name: "ja locale from navigator", args: { pathname: "/blog", language: "ja-JP" }, expectStash: "/blog", expectReplace: "/", expectLang: "ja", expectMessage: "リダイレクト中…" },
  { name: "ru locale from navigator", args: { pathname: "/blog", language: "ru-RU" }, expectStash: "/blog", expectReplace: "/", expectLang: "ru" },
  { name: "unknown locale falls back to en", args: { pathname: "/blog", language: "de-DE" }, expectStash: "/blog", expectReplace: "/", expectLang: "en", expectMessage: "Redirecting…" },
];

let failures = 0;
for (const c of cases) {
  const out = run(c.args);
  const checks = [
    ["stash", out.stashed, c.expectStash],
    ["replace", out.replaced[0], c.expectReplace],
    ["replace called once", out.replaced.length, 1],
  ];
  if (c.expectLang) checks.push(["lang", out.lang, c.expectLang]);
  if (c.expectMessage) checks.push(["message", out.message, c.expectMessage]);

  const bad = checks.filter(([, actual, expected]) => actual !== expected);
  if (bad.length) {
    failures++;
    console.log(`FAIL  ${c.name}`);
    for (const [label, actual, expected] of bad) {
      console.log(`        ${label}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
    }
  } else {
    console.log(`ok    ${c.name}`);
  }
}

// The SPA side reads this exact key; keep the two files in sync.
const appSource = readFileSync(join(projectRoot, "src", "redirectPath.ts"), "utf8");
if (!appSource.includes(`"${REDIRECT_KEY}"`)) {
  failures++;
  console.log(`FAIL  src/redirectPath.ts does not define ${REDIRECT_KEY}`);
} else {
  console.log(`ok    shared key matches src/redirectPath.ts`);
}

// ---------------------------------------------------------------------------
// SPA side: execute the real restoreRedirectedPath() extracted from App.tsx.
// This is the guard that turns a stashed path back into a URL, so it must
// reject anything that could become an open redirect.
// ---------------------------------------------------------------------------
const appTsx = readFileSync(join(projectRoot, "src", "App.tsx"), "utf8");
const start = appTsx.indexOf("function restoreRedirectedPath");
const end = appTsx.indexOf("\n}", start);
if (start < 0 || end < 0) throw new Error("could not extract restoreRedirectedPath from src/App.tsx");
const restoreFnSource = appTsx.slice(start, end + 2);

// Strip the few TypeScript annotations so plain Node can execute the function.
const restoreJs = restoreFnSource
  .replace(/function restoreRedirectedPath\(\): void \{/, "function restoreRedirectedPath() {")
  .replace(/let target: string \| null = null;/, "let target = null;");

function runRestore({ stashed, currentPath }) {
  const session = new Map([[REDIRECT_KEY, stashed]]);
  const replaceStateCalls = [];
  const sandbox = {
    sessionStorage: {
      getItem: (k) => session.get(k) ?? null,
      removeItem: (k) => session.delete(k),
    },
    window: {
      location: { pathname: currentPath, search: "" },
      history: { replaceState: (_s, _t, url) => replaceStateCalls.push(url) },
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  try {
    // The IIFE receives the key and invokes the function itself, mimicking the
    // module-load call in App.tsx.
    new vm.Script(
      `(function(REDIRECT_KEY){ ${restoreJs}; restoreRedirectedPath(); })`
    ).runInContext(sandbox)(REDIRECT_KEY);
  } catch (error) {
    console.log(`        [runRestore threw] ${error && error.message}`);
  }
  return {
    navigated: replaceStateCalls[0] ?? null,
    cleared: !session.has(REDIRECT_KEY),
    debug: { calls: replaceStateCalls.length, keys: [...session.keys()] },
  };
}

const restoreCases = [
  { name: "restores stashed deep link", args: { stashed: "/blog/getting-started", currentPath: "/" }, expectNav: "/blog/getting-started" },
  { name: "restores path with query", args: { stashed: "/blog?ref=abc", currentPath: "/" }, expectNav: "/blog?ref=abc" },
  { name: "nothing stashed -> no navigation", args: { stashed: null, currentPath: "/" }, expectNav: null },
  { name: "rejects protocol-relative //evil.com", args: { stashed: "//evil.com", currentPath: "/" }, expectNav: null },
  { name: "rejects absolute https://evil.com", args: { stashed: "https://evil.com", currentPath: "/" }, expectNav: null },
  { name: "skips navigation when already there", args: { stashed: "/blog", currentPath: "/blog" }, expectNav: null },
];

for (const c of restoreCases) {
  const out = runRestore(c.args);
  const bad = [];
  if (out.navigated !== c.expectNav) {
    bad.push(`navigate: got ${JSON.stringify(out.navigated)}, want ${JSON.stringify(c.expectNav)}`);
  }
  if (c.args.stashed && !out.cleared) bad.push("stashed key was not cleared (would loop)");
  if (bad.length) {
    failures++;
    console.log(`FAIL  ${c.name}`);
    for (const b of bad) console.log(`        ${b}`);
    console.log(`        [debug] ${JSON.stringify(out.debug)}`);
  } else {
    console.log(`ok    ${c.name}`);
  }
}

// ---------------------------------------------------------------------------
// Bundling order: the restore call must run BEFORE the app renders, otherwise a
// deep link would resolve to the home page instead of the requested route.
// Both are module-level calls at the end of the built bundle, so compare their
// offsets. The markers below are the real call sites (React ships the literal
// strings "createRoot"/"render(", so match the invocation with its arguments).
// ---------------------------------------------------------------------------
const mainChunkName = readdirSync(assetsDir).find((f) => f.startsWith("main-") && f.endsWith(".js"));
if (!mainChunkName) throw new Error("main chunk not found in dist/assets");
const mainBundle = readFileSync(join(assetsDir, mainChunkName), "utf8");

// Match the restore body and the real root render invocation. React ships the
// literal strings "createRoot"/"render(", so anchor on the call with arguments.
const restoreBodyIdx = mainBundle.indexOf("sessionStorage.getItem(");
const replaceStateIdx = mainBundle.indexOf('replaceState(null,"",');
const rootCallIdx = mainBundle.indexOf("createRoot(document.getElementById(");
const renderCallIdx = rootCallIdx >= 0 ? mainBundle.indexOf(".render(", rootCallIdx) : -1;

const orderChecks = [
  ["restore body located", restoreBodyIdx >= 0],
  ["replaceState call located", replaceStateIdx >= 0],
  ["real root render located", rootCallIdx >= 0 && renderCallIdx > rootCallIdx],
  ["restore runs before render", restoreBodyIdx >= 0 && rootCallIdx > restoreBodyIdx],
];
for (const [label, ok] of orderChecks) {
  if (ok) {
    console.log(`ok    ${label}`);
  } else {
    failures++;
    console.log(`FAIL  ${label}`);
  }
}

console.log(failures ? `\n${failures} check(s) FAILED` : "\nall checks passed");
process.exit(failures ? 1 : 0);