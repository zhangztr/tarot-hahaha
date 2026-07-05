import { HashRouter, Routes, Route } from "react-router-dom";
import { ReadingProvider } from "./context/ReadingContext";
import { LocaleProvider } from "./context/LocaleContext";
import { ModeProvider } from "./context/ModeContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";

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
              </Routes>
            </Layout>
          </ReadingProvider>
        </ModeProvider>
      </LocaleProvider>
    </HashRouter>
  );
}
