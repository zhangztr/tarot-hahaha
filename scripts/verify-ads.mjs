import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import vm from "node:vm";
import ts from "typescript";

// Run real component functions/effects with a deterministic host. JSX refs are
// attached before effects, like React's commit phase. No ad network is contacted.
const projectRoot = resolve(import.meta.dirname, "..");
const nodeRequire = createRequire(import.meta.url);
const reading = { cards: [{ cardId: 0 }], spreadType: "single", question: null };

function createHost({ ready = true, throws = false, processed = false } = {}) {
  const frames = new Map();
  const elements = new Map();
  const modules = new Map();
  const intervals = new Map();
  const timeouts = new Map();
  const warnings = [];
  let current;
  let timerId = 0;
  let attempts = 0;
  let cardsReady = false;
  let effects = [];
  const window = {
    setInterval(fn) { intervals.set(++timerId, fn); return timerId; },
    clearInterval(id) { intervals.delete(id); },
  };
  const adQueue = {
    push() {
      attempts++;
      assert.ok([...elements.values()].some((el) => el.type === "ins" && el.isConnected),
        "ad submission must wait until its container is mounted");
      if (throws) throw new Error("AdSense rejected this request");
    },
  };
  if (ready) window.adsbygoogle = adQueue;

  const react = {
    useState(initial) {
      const frame = current;
      const index = frame.index++;
      frame.slots[index] ??= { value: typeof initial === "function" ? initial() : initial };
      return [frame.slots[index].value, (value) => { frame.slots[index].value = value; }];
    },
    useRef(initial) {
      return current.slots[current.index++] ??= { current: initial };
    },
    useMemo(factory) { current.index++; return factory(); },
    useEffect(setup, deps) {
      const frame = current;
      const index = frame.index++;
      const previous = frame.slots[index];
      if (!previous || deps.some((dep, i) => !Object.is(dep, previous.deps[i]))) {
        const effect = { setup, deps, cleanup: previous?.cleanup };
        frame.slots[index] = effect;
        effects.push(effect);
      }
    },
  };
  const jsx = (type, props) => ({ type, props: props ?? {} });
  function loadModule(filename) {
    if (modules.has(filename)) return modules.get(filename).exports;
    const module = { exports: {} };
    modules.set(filename, module);
    const source = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const require = (specifier) => {
      if (specifier === "react") return react;
      if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx };
      if (specifier === "react-router-dom") return {
        useNavigate: () => () => {}, useLocation: () => ({ state: { reading } }),
      };
      if (specifier === "motion/react") return { motion: { div: "div", p: "p" } };
      if (specifier === "lucide-react") return { ArrowLeft: "svg", RotateCcw: "svg" };
      if (specifier.endsWith("/useReading")) return { useReading: () => ({ reading, clearReading() {} }) };
      if (specifier.endsWith("/useT")) return {
        useT: () => (key) => key, useLocale: () => ({ locale: "zh" }), useFunMode: () => ({ funMode: false }),
      };
      if (specifier.endsWith("/useTarotCards")) return {
        useResolvedCards: () => cardsReady ? [{ card: { id: 0 } }] : [], useFunnyCards: () => null,
      };
      if (specifier.includes("/utils/interpret")) return {
        generateInterpretation: () => ({}), generateInterpretationFunny: () => ({}),
      };
      if (/\/(CardGrid|SummaryBlock)$/.test(specifier)) return { default: () => null };
      if (specifier.startsWith(".")) return loadModule(resolve(dirname(filename), `${specifier}.tsx`));
      return nodeRequire(specifier);
    };
    vm.runInNewContext(source, {
      module, exports: module.exports, require, window,
      console: { warn: (...args) => warnings.push(args) },
      setTimeout(fn) { timeouts.set(++timerId, fn); return timerId; },
      clearTimeout(id) { timeouts.delete(id); },
    }, { filename });
    return module.exports;
  }
  const ResultPage = loadModule(join(projectRoot, "src/pages/ResultPage.tsx")).default;

  function renderNode(node, path) {
    if (node == null || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach((child, i) => renderNode(child, `${path}.${i}`));
    if (typeof node.type === "function") {
      const frame = frames.get(path) ?? { slots: [] };
      frames.set(path, frame);
      frame.index = 0;
      current = frame;
      const output = node.type(node.props);
      return renderNode(output, `${path}.render`);
    }
    if (node.type === "ins") {
      const element = elements.get(path) ?? {
        type: "ins", isConnected: true,
        getAttribute(name) { return processed && name === "data-adsbygoogle-status" ? "done" : null; },
        hasAttribute(name) { return this.getAttribute(name) !== null; },
      };
      elements.set(path, element);
      if (node.props.ref) node.props.ref.current = element;
    }
    renderNode(node.props.children, `${path}.children`);
  }
  function render(readyCards) {
    cardsReady = readyCards;
    renderNode(jsx(ResultPage), "root");
    const pending = effects;
    effects = [];
    for (const effect of pending) {
      effect.cleanup?.();
      effect.cleanup = effect.setup();
    }
  }
  function replayEffects() {
    const mounted = [...frames.values()].flatMap((frame) => frame.slots).filter((slot) => slot?.setup);
    mounted.forEach((effect) => effect.cleanup?.());
    mounted.forEach((effect) => { effect.cleanup = effect.setup(); });
  }
  function unmount() {
    for (const frame of frames.values()) frame.slots.forEach((slot) => slot?.cleanup?.());
    for (const element of elements.values()) element.isConnected = false;
    frames.clear();
    elements.clear();
  }
  return {
    render, replayEffects, unmount, warnings,
    get attempts() { return attempts; },
    get polling() { return intervals.size; },
    scriptReady() { window.adsbygoogle = adQueue; },
    tick(count = 1) {
      for (let i = 0; i < count; i++) [...intervals.values()].forEach((fn) => fn());
    },
  };
}

const cases = {
  "waits for a mounted container before submitting an ad"() {
    const host = createHost();
    host.render(false);
    assert.equal(host.attempts, 0);
    host.render(true);
    assert.equal(host.attempts, 1);
    host.unmount();
  },
  "does not resubmit on StrictMode effect replay or re-render"() {
    const host = createHost();
    host.render(true);
    host.replayEffects();
    host.render(true);
    assert.equal(host.attempts, 1);
    host.unmount();
  },
  "waits for a delayed script and stops polling after submission"() {
    const host = createHost({ ready: false });
    host.render(true);
    host.replayEffects();
    assert.equal(host.polling, 1);
    host.tick(3);
    assert.equal(host.attempts, 0);
    host.scriptReady();
    host.tick();
    assert.equal(host.attempts, 1);
    assert.equal(host.polling, 0);
    host.unmount();
  },
  "stops polling when the script remains unavailable"() {
    const host = createHost({ ready: false });
    host.render(true);
    host.tick(50);
    assert.equal(host.polling, 0);
    assert.equal(host.attempts, 0);
    host.unmount();
  },
  "contains ad errors and does not retry the failed container"() {
    const host = createHost({ ready: false, throws: true });
    host.render(true);
    host.scriptReady();
    assert.doesNotThrow(() => host.tick());
    host.replayEffects();
    host.render(true);
    assert.equal(host.attempts, 1);
    assert.equal(host.warnings.length, 1);
    assert.equal(host.polling, 0);
    host.unmount();
  },
  "contains synchronous errors when the script is already ready"() {
    const host = createHost({ throws: true });
    assert.doesNotThrow(() => host.render(true));
    host.replayEffects();
    assert.equal(host.attempts, 1);
    assert.equal(host.warnings.length, 1);
    assert.equal(host.polling, 0);
    host.unmount();
  },
  "cleans polling up on unmount and initializes a new container"() {
    const host = createHost({ ready: false });
    host.render(true);
    host.unmount();
    assert.equal(host.polling, 0);
    host.scriptReady();
    host.tick();
    assert.equal(host.attempts, 0);
    host.render(true);
    assert.equal(host.attempts, 1);
    host.unmount();
  },
  "skips containers already processed by AdSense"() {
    const host = createHost({ processed: true });
    host.render(true);
    assert.equal(host.attempts, 0);
    assert.equal(host.polling, 0);
    host.unmount();
  },
};

let failures = 0;
for (const [name, run] of Object.entries(cases)) {
  try { run(); console.log(`ok    ${name}`); }
  catch (error) { failures++; console.error(`FAIL  ${name}\n${error.stack}`); }
}
if (failures) process.exitCode = 1;
else console.log("\nall ad lifecycle checks passed");
