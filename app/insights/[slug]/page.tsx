import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InsightCard from "../../../components/InsightCard";
import { formatInsightDate, getInsightPost, insightPosts } from "../../../lib/insights";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return insightPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsightPost(slug);
  if (!post) return {};
  const url = `/insights/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.description, url, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt },
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getInsightPost(slug);
  if (!post) notFound();
  const related = insightPosts.filter((item) => item.slug !== post.slug).slice(0, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "ko-KR",
    mainEntityOfPage: `https://www.moneystom7.com/insights/${post.slug}`,
    author: { "@type": "Organization", name: "Fiscal Atlas 편집팀", url: "https://www.moneystom7.com/editorial-policy" },
    publisher: { "@type": "Organization", name: "Fiscal Atlas", url: "https://www.moneystom7.com" },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-[min(760px,calc(100%-40px))] py-12 sm:py-16">
            <Link href="/insights" className="text-sm font-bold text-blue-600 hover:text-blue-800">← 부동산 인사이트</Link>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 font-bold text-blue-700">{post.category}</span>
              <time dateTime={post.publishedAt}>{formatInsightDate(post.publishedAt)}</time><span>·</span><span>{post.readingMinutes}분 읽기</span>
            </div>
            <h1 className="mt-5 text-balance text-3xl font-extrabold leading-[1.25] tracking-[-.045em] text-slate-950 sm:text-[2.65rem]">{post.title}</h1>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">{post.description}</p>
            <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#142b49] font-extrabold text-white">FA</span><span><b className="block text-sm text-slate-800">Fiscal Atlas 편집팀</b>공식 자료를 기준으로 검토합니다.</span></div>
          </div>
        </header>
        <div className="mx-auto grid w-[min(760px,calc(100%-40px))] gap-10 py-10 sm:py-14">
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-7" aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="text-sm font-extrabold text-blue-950">핵심 내용</h2>
            <ul className="mt-4 space-y-3">{post.summary.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-blue-950/85"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />{item}</li>)}</ul>
          </section>
          {post.sections.map((section) => <section key={section.heading}>
            <h2 className="text-2xl font-extrabold tracking-[-.035em] text-slate-950">{section.heading}</h2>
            <div className="mt-4 space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph} className="text-[15px] leading-8 text-slate-700">{paragraph}</p>)}</div>
            {section.bullets && <ul className="mt-5 space-y-2 rounded-xl border border-slate-200 bg-white p-5">{section.bullets.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="font-bold text-blue-600">✓</span>{item}</li>)}</ul>}
          </section>)}
          <Link href={post.relatedTool.href} className="group rounded-2xl bg-[#0c1d33] p-6 text-white shadow-lg shadow-slate-900/10 sm:p-8">
            <span className="text-xs font-bold uppercase tracking-[.14em] text-blue-300">Related calculator</span>
            <h2 className="mt-3 text-xl font-extrabold">{post.relatedTool.label} <span className="inline-block transition group-hover:translate-x-1">→</span></h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{post.relatedTool.description}</p>
          </Link>
          <section className="border-t border-slate-200 pt-7">
            <h2 className="text-sm font-extrabold text-slate-900">공식 자료 및 참고 출처</h2>
            <ul className="mt-3 space-y-2">{post.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">{source.label} ↗</a></li>)}</ul>
            <p className="mt-6 text-xs leading-5 text-slate-500">최종 수정일: {formatInsightDate(post.updatedAt)} · 본 글은 일반 정보이며 개인별 세무·법률·금융 자문을 대신하지 않습니다.</p>
          </section>
        </div>
      </article>
      <section className="border-t border-slate-200 bg-white"><div className="site-container py-12"><h2 className="text-xl font-extrabold tracking-[-.03em] text-slate-950">함께 읽으면 좋은 글</h2><div className="mt-5 grid gap-5 md:grid-cols-2">{related.map((item) => <InsightCard key={item.slug} post={item} />)}</div></div></section>
    </main>
  );
}
