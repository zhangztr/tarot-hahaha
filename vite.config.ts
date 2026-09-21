import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, normalizePath, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * GitHub Pages cannot rewrite unknown paths to `index.html`, so deep links rely
 * on `public/404.html` (built into `dist/404.html`). Two build details:
 *
 * 1. `src/redirect.ts` is added as its own Rollup input, which guarantees it is
 *    a separate chunk and never gets inlined into the main SPA bundle.
 * 2. Vite does not process `public/`, so the hashed filename of that chunk is
 *    unknown at build time. `__REDIRECT_SCRIPT__` in `404.html` is a valid HTML
 *    comment, so the un-injected file still parses; `writeBundle` swaps it for
 *    the real `<script src>` tag once the hash is known.
 */
const REDIRECT_TOKEN = "__REDIRECT_SCRIPT__";

function spaFallbackPlugin(): Plugin {
  return {
    name: "tarot-spa-fallback",

    // `vite dev` has no static-host fallback, so a deep link such as
    // /blog/getting-started would 404 locally even though it works in
    // production. Rewrite extensionless navigation requests to index.html.
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? "/";
        const pathname = url.split("?")[0];
        const isViteInternal = pathname.startsWith("/@") || pathname.startsWith("/node_modules/");
        const hasExtension = /\.[^/]+$/.test(pathname);
        if (!isViteInternal && !hasExtension && pathname !== "/") {
          req.url = "/index.html";
        }
        next();
      });
    },

    async writeBundle(options, bundle) {
      const chunk = Object.values(bundle).find(
        (item) => item.type === "chunk" && item.isEntry && item.name === "redirect"
      );
      if (!chunk) {
        this.error('404 fallback chunk "redirect" was not emitted');
      }

      const scriptTag = `<script type="module" crossorigin src="/${normalizePath(chunk.fileName)}"></script>`;
      const target = join(options.dir ?? "dist", "404.html");
      const html = await readFile(target, "utf8");
      if (!html.includes(REDIRECT_TOKEN)) {
        this.error(`404.html is missing the ${REDIRECT_TOKEN} placeholder`);
        return;
      }
      await writeFile(target, html.replace(REDIRECT_TOKEN, scriptTag), "utf8");
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallbackPlugin()],
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        redirect: fileURLToPath(new URL("./src/redirect.ts", import.meta.url)),
      },
    },
  },
});
