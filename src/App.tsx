import { BrowserRouter, Routes, Route } from "react-router-dom";
import { REDIRECT_KEY } from "./redirectPath";
import { ReadingProvider } from "./context/ReadingContext";
import { LocaleProvider } from "./context/LocaleContext";
import { ModeProvider } from "./context/ModeContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import TosPage from "./pages/TosPage";
import PrivacyPage from "./pages/PrivacyPage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";

/**
 * GitHub Pages serves `404.html` for any path with no matching file, so a deep
 * link such as `/blog/getting-started` never reaches the SPA directly.
 * `src/redirect.ts` (used by `public/404.html`) stashes the requested path and
 * bounces the visitor to `/`; here we put that URL back before the router
 * mounts, keeping the address bar and React Router in sync.
 *
 * Safe when there is nothing stashed: it simply does nothing.
 */
function restoreRedirectedPath(): void {
  let target: string | null = null;
  try {
    target = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
  } catch {
    // sessionStorage can throw in private mode; nothing to restore then.
    return;
  }
  if (!target || !target.startsWith("/") || target.startsWith("//")) return;
  if (target === window.location.pathname + window.location.search) return;
  window.history.replaceState(null, "", target);
}

// Runs at module load, which is before <BrowserRouter> reads the first location.
restoreRedirectedPath();

export default function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <ModeProvider>
          <ReadingProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/tos" element={<TosPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                {/* Unknown paths: render the home page instead of a blank screen. */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Layout>
          </ReadingProvider>
        </ModeProvider>
      </LocaleProvider>
    </BrowserRouter>
  );
}
