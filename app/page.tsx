import ToolCard from "../components/ToolCard";

const coreTools = [
  {
    name: "취득세 계산기",
    desc: "주택·토지·상가 취득 시 납부할 취득세를 계산합니다.",
    url: "/takdeukse",
    live: true,
  },
  {
    name: "양도소득세 계산기",
    desc: "부동산 매도 시 양도차익에 따른 세금을 계산합니다.",
    url: "/yangdo",
    live: true,
  },
  {
    name: "종합부동산세 계산기",
    desc: "보유 주택 공시가격 기준 종부세를 계산합니다.",
    url: "/jongbu",
    live: true,
  },
  {
    name: "증여세 계산기",
    desc: "부동산·현금 증여 시 납부할 증여세를 계산합니다.",
    url: "/jeungyese",
    live: true,
  },
  {
    name: "재산세 계산기",
    desc: "주택·토지 보유에 따른 재산세를 계산합니다.",
    url: "/jaesanse",
    live: true,
  },
];

const subTools = [
  {
    name: "대출이자 계산기",
    desc: "원리금균등·원금균등·만기일시 상환 방식별 이자를 비교합니다.",
    url: "/daeul",
    live: true,
  },
  {
    name: "중개수수료 계산기",
    desc: "매매·전세·월세 거래 시 법정 중개수수료를 계산합니다.",
    url: "/jungae",
    live: true,
  },
  {
    name: "평/㎡ 변환기",
    desc: "평과 제곱미터를 즉시 변환합니다.",
    url: "/pyeong",
    live: true,
  },
  {
    name: "임대수익률 계산기",
    desc: "투자금 대비 임대 수익률과 수익 기간을 계산합니다.",
    url: "/imdae",
    live: true,
  },
  {
    name: "전월세 전환 계산기",
    desc: "전세 보증금과 월세를 상호 전환합니다.",
    url: "/jeonwolse",
    live: true,
  },
  {
    name: "연봉 실수령액 계산기",
    desc: "4대 보험·소득세 공제 후 월 실수령액을 계산합니다.",
    url: "/yeonbong",
    live: true,
  },
];

const trustBadges = [
  "현행 법령 기준",
  "2026년 최신",
  "계산기 11종",
  "세무사 검토 방식",
];

export default function HubPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      {/* Hero — 2열 레이아웃 */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* 좌: 소개 텍스트 */}
          <div>
            {/* 상단 뱃지 */}
            <div className="mb-4">
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{
                  color: "#B8860B",
                  borderColor: "#D4A017",
                  backgroundColor: "#FDF8EE",
                }}
              >
                2026년 최신 법령 기준 · 무료 계산기
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 leading-tight"
              style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}
            >
              부동산 세금,<br />직접 계산해 보세요
            </h1>
            <p className="text-base mb-5" style={{ color: "#6B6B6B" }}>
              집 사고 팔기 전 취득세·양도세·종부세를<br />미리 정확하게 확인하세요
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/takdeukse"
                className="btn-gold inline-block font-semibold px-6 py-3 rounded-lg text-white text-center"
              >
                취득세 계산하기
              </a>
              <a
                href="#core-tools"
                className="inline-block font-semibold px-6 py-3 rounded-lg transition-colors border text-center"
                style={{ borderColor: "#E8E4DD", color: "#1A1A1A" }}
              >
                모든 계산기 보기
              </a>
            </div>
          </div>

          {/* 우: 주요 계산기 3개 바로가기 카드 */}
          <div className="flex flex-col gap-3">
            {[
              { name: "취득세 계산기", desc: "주택·토지 취득 시 세금 계산", href: "/takdeukse", icon: "🏠" },
              { name: "양도소득세 계산기", desc: "부동산 매도 시 양도차익 세금", href: "/yangdo", icon: "📊" },
              { name: "대출이자 계산기", desc: "원리금·원금균등·만기일시 비교", href: "/daeul", icon: "💰" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-[#B8860B] hover:bg-[#F5EDD8] shadow-sm"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E4DD" }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#1A1A1A" }}>{item.name}</p>
                  <p className="text-xs" style={{ color: "#6B6B6B" }}>{item.desc}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B8860B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-auto flex-shrink-0"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* 신뢰 배지 띠 */}
      <div
        className="rounded-xl px-6 py-3 mb-8"
        style={{ backgroundColor: "#F9F6F1" }}
      >
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {trustBadges.map((badge) => (
            <li
              key={badge}
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#8A6A00" }}
            >
              {/* 체크 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {badge}
            </li>
          ))}
        </ul>
      </div>

      {/* 서비스 소개 카드 */}
      <div
        className="rounded-2xl border p-6 mb-10"
        style={{ borderColor: "#E8E4DD", backgroundColor: "#FFFFFF" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#6B6B6B" }}>
          <strong style={{ color: "#1A1A1A" }}>MoneyStom7</strong>은 부동산 거래의
          세금 부담을 미리 파악할 수 있는 무료 계산기 서비스입니다.
          취득세·양도세·종부세 등 핵심 세금을 현행 법령 기준으로 정확하게 계산합니다.
          세무사 상담 전 자가 점검 용도로 활용하실 수 있습니다.
        </p>
      </div>

      {/* 핵심 도구 — 세금 계산기 */}
      <section id="core-tools" className="mb-12">
        <h2
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ color: "#6B6B6B" }}
        >
          세금 계산기
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreTools.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </section>

      {/* 보조 도구 — 거래 도우미 */}
      <section className="mb-16">
        <h2
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ color: "#6B6B6B" }}
        >
          거래 도우미
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subTools.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs space-y-1" style={{ color: "#6B6B6B" }}>
        <p>2026년 4월 기준 법령 적용</p>
        <p>
          본 계산기는 참고용이며 세무 신고에 법적 효력이 없습니다.
          정확한 세액은 세무사 또는 관할 기관에 문의하세요.
        </p>
        <p className="pt-2">© 2026 MoneyStom7</p>
      </footer>

    </main>
  );
}
