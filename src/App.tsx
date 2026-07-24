import { HashRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <HashRouter>
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
              </Routes>
            </Layout>
          </ReadingProvider>
        </ModeProvider>
      </LocaleProvider>
    </HashRouter>
  );
}
