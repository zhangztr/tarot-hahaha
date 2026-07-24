import { Link } from "react-router-dom";
import { useLocale, useT } from "../hooks/useT";
import blogManifest from "../data/blog/manifest.json";

interface BlogEntry {
  slug: string;
  date: string;
  zh: { title: string; summary: string };
  en: { title: string; summary: string };
}

const entries = blogManifest as BlogEntry[];

const sorted = [...entries].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function BlogListPage() {
  const { locale } = useLocale();
  const t = useT();

  return (
    <div className="flex-1 w-full max-w-2xl pt-8">
      <h1 className="font-serif text-2xl text-white mb-6">{t("blog.title")}</h1>

      {sorted.length === 0 ? (
        <p className="text-white/40 text-sm">{t("blog.noPosts")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((entry) => {
            const meta = locale === "zh" ? entry.zh : entry.en;
            const dateStr = new Date(entry.date).toLocaleDateString(
              locale === "zh" ? "zh-CN" : "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            );

            return (
              <Link
                key={entry.slug}
                to={`/blog/${entry.slug}`}
                className="block bg-white/[0.03] border border-white/10 rounded-xl p-5
                  hover:bg-white/[0.06] hover:border-white/20 transition-colors group"
              >
                <h2 className="font-serif text-lg text-white/90 group-hover:text-white transition-colors mb-2">
                  {meta.title}
                </h2>
                <p className="text-white/45 text-sm leading-relaxed mb-3 line-clamp-2">
                  {meta.summary}
                </p>
                <time className="text-white/25 text-xs">
                  {t("blog.publishedOn")} {dateStr}
                </time>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
