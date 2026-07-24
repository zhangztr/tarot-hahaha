import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocale, useT } from "../hooks/useT";
import blogManifest from "../data/blog/manifest.json";

interface BlogEntry {
  slug: string;
  date: string;
  title: Record<string, string>;
  summary: Record<string, string>;
}

const entries = blogManifest as BlogEntry[];

const mdModules = import.meta.glob<string>(
  "../data/blog/*.md",
  { query: "?raw", import: "default" }
);

function localize(field: Record<string, string>, locale: string): string {
  return field[locale] || field["en"] || "";
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const t = useT();

  const [content, setContent] = useState<string | null>(null);

  const entry = entries.find((e) => e.slug === slug);

  useEffect(() => {
    if (!entry) return;
    const loader = mdModules[`../data/blog/${entry.slug}-${locale}.md`];
    if (!loader) {
      setContent(null);
      return;
    }
    loader().then((mod) => setContent(mod));
  }, [entry, locale]);

  if (!entry) {
    return (
      <div className="flex-1 w-full max-w-2xl pt-8">
        <p className="text-white/40 text-sm">{t("blog.postNotFound")}</p>
        <Link to="/blog" className="text-mystic-gold/80 text-sm hover:underline">
          {t("blog.backToList")}
        </Link>
      </div>
    );
  }

  const dateStr = new Date(entry.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 w-full max-w-2xl pt-8">
      <Link
        to="/blog"
        className="text-white/40 text-sm hover:text-white/70 transition-colors"
      >
        {t("blog.backToList")}
      </Link>

      <article className="mt-4">
        <h1 className="font-serif text-2xl text-white mb-2">
          {localize(entry.title, locale)}
        </h1>
        <time className="text-white/30 text-sm">
          {t("blog.publishedOn")} {dateStr}
        </time>

        <div className="mt-8 bg-white/[0.03] border border-white/10 rounded-xl p-6 sm:p-8">
          {content === null ? (
            <p className="text-white/40 text-sm">{t("blog.loading")}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none
              prose-headings:text-white/90 prose-headings:font-serif prose-headings:mt-6 prose-headings:mb-3
              prose-p:text-white/60 prose-p:leading-relaxed
              prose-a:text-mystic-gold/80 prose-a:no-underline hover:prose-a:text-mystic-gold
              prose-strong:text-white/80
              prose-li:text-white/60
              prose-ul:my-3 prose-li:my-1
              [&_h1]:text-xl [&_h2]:text-lg [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-2
              [&_h3]:text-base [&_h3]:text-white/80">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
