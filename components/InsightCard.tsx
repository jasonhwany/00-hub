import Link from "next/link";
import type { InsightPost } from "../lib/insights";
import { formatInsightDate } from "../lib/insights";

const categoryTone = {
  "정책·제도": "bg-indigo-50 text-indigo-700",
  "거래 가이드": "bg-emerald-50 text-emerald-700",
  "시장 읽기": "bg-amber-50 text-amber-700",
};

export default function InsightCard({ post, featured = false }: { post: InsightPost; featured?: boolean }) {
  return (
    <article className={`surface-card group flex h-full flex-col overflow-hidden rounded-2xl ${featured ? "md:grid md:grid-cols-[.85fr_1.15fr]" : ""}`}>
      <div className={`relative overflow-hidden bg-[#0c1d33] ${featured ? "min-h-56" : "h-36"}`}>
        <div className="absolute inset-0 opacity-80" style={{ backgroundImage: "radial-gradient(circle at 22% 25%, #3979f6 0, transparent 25%), radial-gradient(circle at 78% 85%, #1b9a76 0, transparent 25%), linear-gradient(135deg, transparent 35%, rgba(255,255,255,.08))" }} />
        <div className="absolute bottom-5 left-5 text-xs font-bold uppercase tracking-[.18em] text-blue-100">Fiscal Atlas Insight</div>
      </div>
      <div className={`flex flex-1 flex-col ${featured ? "p-7 sm:p-9" : "p-5"}`}>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className={`rounded-full px-2.5 py-1 font-bold ${categoryTone[post.category]}`}>{post.category}</span>
          <time dateTime={post.publishedAt}>{formatInsightDate(post.publishedAt)}</time>
        </div>
        <h2 className={`${featured ? "mt-5 text-2xl sm:text-3xl" : "mt-4 text-lg"} text-balance font-extrabold leading-snug tracking-[-.035em] text-slate-950 group-hover:text-blue-700`}>
          <Link href={`/insights/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{post.description}</p>
        <div className="mt-auto pt-6 text-sm font-bold text-blue-600">{post.readingMinutes}분 읽기 <span aria-hidden>→</span></div>
      </div>
    </article>
  );
}
