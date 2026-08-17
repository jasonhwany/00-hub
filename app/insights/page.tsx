import type { Metadata } from "next";
import InsightCard from "../../components/InsightCard";
import { insightPosts } from "../../lib/insights";

export const metadata: Metadata = {
  title: "부동산 인사이트",
  description: "부동산 거래, 세금, 대출과 주거비를 이해하기 쉽게 설명하는 Fiscal Atlas의 실전 가이드입니다.",
  alternates: { canonical: "/insights" },
  openGraph: { title: "부동산 인사이트 | Fiscal Atlas", description: "복잡한 부동산 정보를 실제 의사결정에 필요한 숫자와 기준으로 설명합니다.", url: "/insights", type: "website" },
};

export default function InsightsPage() {
  const [featured, ...posts] = insightPosts;
  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="site-container py-14 sm:py-16">
          <p className="eyebrow">Real estate intelligence</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-[-.045em] text-slate-950 sm:text-5xl">뉴스보다 한 걸음 더,<br className="hidden sm:block" /> 내 결정에 필요한 부동산 정보</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">정책과 시장의 변화를 단순히 전달하지 않습니다. 거래 전에 확인할 기준과 계산 방법, 공식 출처를 함께 정리합니다.</p>
        </div>
      </section>
      <section className="site-container py-10 sm:py-14">
        <InsightCard post={featured} featured />
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {posts.map((post) => <InsightCard key={post.slug} post={post} />)}
        </div>
        <aside className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5 text-sm leading-6 text-blue-950">
          <strong className="block font-extrabold">정보 이용 안내</strong>
          <p className="mt-1 text-blue-900/80">콘텐츠는 일반적인 정보 제공을 목적으로 합니다. 세금·대출·법률은 개인의 조건과 적용 시점에 따라 달라질 수 있으므로 중요한 결정 전에는 관계 기관 또는 전문가에게 확인하세요.</p>
        </aside>
      </section>
    </main>
  );
}
