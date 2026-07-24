import { Link } from "react-router-dom";
import { useT } from "../hooks/useT";

export default function Footer() {
  const t = useT();

  return (
    <footer className="w-full border-t border-white/10 bg-black/20">
      <div className="max-w-2xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-white/30 text-xs">
          {t("footer.copyright")}
        </span>
        <nav className="flex items-center gap-4 text-xs text-white/40">
          <Link to="/blog" className="hover:text-white/70 transition-colors">
            {t("footer.blog")}
          </Link>
          <span className="text-white/20">|</span>
          <Link to="/tos" className="hover:text-white/70 transition-colors">
            {t("footer.tos")}
          </Link>
          <span className="text-white/20">|</span>
          <Link to="/privacy" className="hover:text-white/70 transition-colors">
            {t("footer.privacy")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
