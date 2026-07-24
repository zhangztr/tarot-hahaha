import ReactMarkdown from "react-markdown";
import { useT } from "../hooks/useT";

export default function PrivacyPage() {
  const t = useT();

  return (
    <div className="flex-1 w-full max-w-2xl pt-8">
      <h1 className="font-serif text-2xl text-white mb-6">{t("privacy.title")}</h1>
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 sm:p-8">
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-white/90 prose-headings:font-serif prose-headings:mt-6 prose-headings:mb-3
          prose-p:text-white/60 prose-p:leading-relaxed
          prose-a:text-mystic-gold/80 prose-a:no-underline hover:prose-a:text-mystic-gold
          prose-strong:text-white/80
          prose-li:text-white/60
          [&_h2]:text-lg [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-2">
          <ReactMarkdown>{t("privacy.content")}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
