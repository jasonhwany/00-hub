const tools = [
  {
    id: "01",
    name: "복리 계산기",
    desc: "원금·이율·기간으로 미래 자산을 계산해보세요.",
    url: "https://calc.moneystom7.com",
    emoji: "📈",
    live: true,
  },
  {
    id: "02",
    name: "단위 변환기",
    desc: "길이·무게·온도 등 모든 단위를 빠르게 변환.",
    url: "https://unit.moneystom7.com",
    emoji: "📐",
    live: true,
  },
  {
    id: "03",
    name: "QR코드 생성기",
    desc: "URL·텍스트를 QR코드로 즉시 생성.",
    url: "https://qr.moneystom7.com",
    emoji: "🔲",
    live: true,
  },
  {
    id: "04",
    name: "비밀번호 생성기",
    desc: "강력하고 안전한 비밀번호를 무료로 생성.",
    url: "https://pass.moneystom7.com",
    emoji: "🔐",
    live: true,
  },
  {
    id: "05",
    name: "PDF 텍스트 추출",
    desc: "PDF 파일에서 텍스트를 빠르게 추출.",
    url: "https://pdf.moneystom7.com",
    emoji: "📄",
    live: true,
  },
  {
    id: "06",
    name: "세계 시간대 변환기",
    desc: "전 세계 도시의 현재 시간을 한눈에.",
    url: "https://time.moneystom7.com",
    emoji: "🌏",
    live: true,
  },
  {
    id: "07",
    name: "BMI 계산기",
    desc: "키·몸무게로 체질량지수와 건강 상태를 확인.",
    url: "https://bmi.moneystom7.com",
    emoji: "⚖️",
    live: true,
  },
  {
    id: "08",
    name: "견적서 생성기",
    desc: "간단한 입력으로 견적서를 즉시 출력.",
    url: "https://invoice.moneystom7.com",
    emoji: "📋",
    live: true,
  },
  {
    id: "09",
    name: "JSON 포매터",
    desc: "JSON 데이터를 보기 좋게 정렬·검증.",
    url: "https://json.moneystom7.com",
    emoji: "🧹",
    live: true,
  },
  {
    id: "10",
    name: "로또 번호 생성기",
    desc: "행운의 로또 번호를 무작위로 추천.",
    url: "https://lotto.moneystom7.com",
    emoji: "🎰",
    live: true,
  },
];

export default function HubPage() {
  const liveCount = tools.filter((t) => t.live).length;

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          💰 MoneyStom7
        </h1>
        <p className="text-xl text-gray-400 mb-2">
          무료 금융·생활 계산기 모음
        </p>
        <p className="text-sm text-gray-500">
          현재{" "}
          <span className="text-emerald-400 font-semibold">{liveCount}개</span>{" "}
          서비스 운영 중 · 총 100개 출시 예정
        </p>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <a
            key={tool.id}
            href={tool.live ? tool.url : undefined}
            className={[
              "block rounded-xl border p-5 transition-all",
              tool.live
                ? "border-gray-700 hover:border-emerald-500 hover:bg-gray-900 cursor-pointer"
                : "border-gray-800 opacity-50 cursor-not-allowed",
            ].join(" ")}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{tool.emoji}</span>
              <span className="font-semibold text-gray-100">{tool.name}</span>
              {tool.live ? (
                <span className="ml-auto text-xs bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              ) : (
                <span className="ml-auto text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                  준비중
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{tool.desc}</p>
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-xs text-gray-600">
        <p>© 2026 MoneyStom7 · 모든 서비스 무료 제공</p>
      </footer>
    </main>
  );
}
