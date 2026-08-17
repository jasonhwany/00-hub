export type InsightSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type InsightPost = {
  slug: string;
  title: string;
  description: string;
  category: "정책·제도" | "거래 가이드" | "시장 읽기";
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  summary: string[];
  sections: InsightSection[];
  relatedTool: { label: string; href: string; description: string };
  sources: { label: string; href: string }[];
};

export const insightPosts: InsightPost[] = [
  {
    slug: "real-estate-contract-checklist",
    title: "부동산 매매계약 전 반드시 확인할 7가지",
    description: "등기부, 건축물대장, 세금과 자금계획까지 부동산 매매계약 전에 확인할 항목을 순서대로 정리했습니다.",
    category: "거래 가이드",
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    readingMinutes: 7,
    summary: [
      "계약 상대방과 등기부상 소유자가 같은지 먼저 확인합니다.",
      "등기부만 보지 말고 건축물대장과 토지이용계획도 함께 확인합니다.",
      "계약금 외에 취득세·중개보수·등기비용을 포함한 총비용을 계산합니다.",
    ],
    sections: [
      {
        heading: "1. 계약 상대방과 소유자를 대조하세요",
        paragraphs: ["등기사항증명서의 소유자 이름과 계약 상대방의 신분증을 대조해야 합니다. 대리인이 계약한다면 위임장과 인감증명서, 본인의 계약 의사를 추가로 확인하는 것이 안전합니다."],
      },
      {
        heading: "2. 권리관계는 계약 직전 다시 확인하세요",
        paragraphs: ["근저당권, 가압류, 가처분, 전세권처럼 소유권 행사에 영향을 줄 수 있는 권리가 있는지 살펴보세요. 서류를 미리 받았더라도 계약 당일 최신 상태로 다시 발급하는 편이 좋습니다."],
        bullets: ["등기사항증명서 갑구: 소유권과 압류·가압류 확인", "등기사항증명서 을구: 근저당권·전세권 확인", "잔금일 말소 조건은 특약에 구체적으로 기재"],
      },
      {
        heading: "3. 실제 건물과 공적 장부를 비교하세요",
        paragraphs: ["건축물대장의 용도·면적·위반건축물 표시와 실제 현황이 같은지 확인합니다. 토지이용계획확인서로 용도지역과 각종 규제도 살펴보세요. 장부와 현황이 다르면 대출이나 향후 매도에 영향을 줄 수 있습니다."],
      },
      {
        heading: "4. 잔금까지의 자금계획을 숫자로 만드세요",
        paragraphs: ["매매대금만 준비하면 끝나는 것이 아닙니다. 취득세, 지방교육세, 농어촌특별세, 중개보수, 법무사 비용과 이사비 등을 합산해야 합니다. 대출은 예상 한도가 아니라 실제 심사 가능 금액을 기준으로 계획하세요."],
      },
      {
        heading: "5. 특약은 책임과 기한까지 적으세요",
        paragraphs: ["‘하자는 매도인이 처리한다’처럼 모호한 문장보다 대상, 처리 기한, 비용 부담과 미이행 시 조치를 구체적으로 적는 것이 좋습니다. 구두 합의는 계약서 특약에 반영해야 분쟁을 줄일 수 있습니다."],
      },
      {
        heading: "6. 관리비와 체납 여부를 확인하세요",
        paragraphs: ["공동주택이라면 관리사무소를 통해 관리비 체납과 장기수선충당금 정산 방식을 확인하세요. 임차인이 있는 주택은 보증금, 계약기간과 인도 조건도 함께 확인해야 합니다."],
      },
      {
        heading: "7. 잔금일에도 마지막 확인이 필요합니다",
        paragraphs: ["잔금 송금 직전에 등기사항증명서를 다시 확인하고, 약속한 권리가 말소됐는지 확인합니다. 열쇠와 서류를 인도받은 뒤 소유권이전등기와 전입신고 등 후속 절차를 진행하세요."],
      },
    ],
    relatedTool: { label: "취득세 예상액 계산하기", href: "/takdeukse", description: "매매대금 외에 필요한 세금까지 자금계획에 반영해 보세요." },
    sources: [
      { label: "대법원 인터넷등기소", href: "https://www.iros.go.kr" },
      { label: "정부24 건축물대장 안내", href: "https://www.gov.kr" },
      { label: "토지이음", href: "https://www.eum.go.kr" },
    ],
  },
  {
    slug: "jeonse-to-monthly-rent-conversion",
    title: "전세와 월세, 어떤 선택이 유리할까?",
    description: "보증금의 기회비용과 대출이자, 월세를 같은 기준으로 환산해 주거비를 비교하는 방법을 설명합니다.",
    category: "시장 읽기",
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    readingMinutes: 6,
    summary: [
      "전세와 월세는 보증금 차액에 들어가는 금융비용을 포함해 비교해야 합니다.",
      "대출금리와 보유 현금의 예상 수익률에 따라 결과가 달라집니다.",
      "숫자가 비슷하다면 거주기간과 현금 유동성을 함께 고려해야 합니다.",
    ],
    sections: [
      { heading: "단순 월세만 비교하면 안 되는 이유", paragraphs: ["전세는 매달 임대료가 없지만 큰 보증금이 묶입니다. 보증금을 대출받았다면 이자가 발생하고, 자기자금이라면 다른 곳에 활용하지 못하는 기회비용이 생깁니다. 따라서 보증금 차액을 월 비용으로 바꿔 월세와 비교해야 합니다."] },
      { heading: "비교의 기본 공식", paragraphs: ["두 집의 보증금 차액에 연간 자금비용률을 곱한 뒤 12개월로 나누면 월 환산 비용을 구할 수 있습니다. 여기에 실제 월세와 관리비 차이를 더하면 비교가 쉬워집니다."], bullets: ["월 환산 금융비용 = 보증금 차액 × 연 자금비용률 ÷ 12", "월 총주거비 = 월세 + 월 환산 금융비용 + 추가 관리비", "대출금과 자기자금에는 서로 다른 비용률을 적용"] },
      { heading: "예시로 비교해 보기", paragraphs: ["전세 보증금 3억원과 보증금 5천만원·월세 100만원을 비교한다고 가정해 보겠습니다. 차액 2억5천만원의 자금비용률이 연 4%라면 월 환산 비용은 약 83만원입니다. 이 조건에서는 숫자상 전세의 금융비용이 월세 100만원보다 낮지만, 실제 대출비용과 보증금 안전성까지 확인해야 합니다."] },
      { heading: "숫자 외에 함께 볼 조건", paragraphs: ["짧게 거주한다면 중개보수와 이사 비용의 영향이 커집니다. 현금이 사업이나 투자에 필요하다면 월세가 유동성 측면에서 나을 수 있습니다. 반대로 장기 거주하고 보증금을 안전하게 회수할 수 있다면 전세의 예측 가능성이 장점이 될 수 있습니다."], bullets: ["예상 거주기간", "보증금 반환 안전성", "금리 변동 가능성", "비상자금 확보 여부"] },
    ],
    relatedTool: { label: "전월세 전환율 계산하기", href: "/jeonwolse", description: "현재 계약 조건을 입력해 보증금과 월세를 같은 기준으로 비교하세요." },
    sources: [
      { label: "국가법령정보센터 주택임대차보호법", href: "https://www.law.go.kr" },
      { label: "국토교통부 실거래가 공개시스템", href: "https://rt.molit.go.kr" },
    ],
  },
  {
    slug: "mortgage-payment-guide",
    title: "주택담보대출 상환방식 3가지 비교",
    description: "원리금균등·원금균등·만기일시상환의 월 부담과 총이자 차이를 이해하기 쉽게 비교합니다.",
    category: "정책·제도",
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    readingMinutes: 5,
    summary: [
      "원리금균등은 매월 납입액이 일정해 가계 계획을 세우기 쉽습니다.",
      "원금균등은 초반 부담이 크지만 동일 조건에서 총이자가 상대적으로 적습니다.",
      "대출 비교 시 금리뿐 아니라 상환방식과 중도상환 조건도 확인해야 합니다.",
    ],
    sections: [
      { heading: "원리금균등상환", paragraphs: ["대출 원금과 이자를 합친 월 납입액이 만기까지 일정한 방식입니다. 매달 지출을 예측하기 쉽지만 초기에는 납입액 중 이자의 비중이 높고 원금 감소 속도가 상대적으로 느립니다."] },
      { heading: "원금균등상환", paragraphs: ["원금을 전체 기간으로 똑같이 나누고 남은 원금에 대한 이자를 더해 내는 방식입니다. 초기 납입액은 크지만 시간이 지날수록 이자가 줄어 월 부담이 낮아집니다. 같은 금리와 기간이라면 일반적으로 원리금균등보다 총이자가 적습니다."] },
      { heading: "만기일시상환", paragraphs: ["대출기간에는 주로 이자를 내고 원금은 만기에 한꺼번에 상환합니다. 당장의 월 부담은 작아 보이지만 원금이 줄지 않아 총이자가 커질 수 있고, 만기 때 상환하거나 연장해야 하는 위험이 있습니다."] },
      { heading: "내게 맞는 방식 고르기", paragraphs: ["현재 소득뿐 아니라 금리 상승, 소득 감소와 예상치 못한 지출까지 고려해야 합니다. 월 납입액이 감당 가능한 범위인지 먼저 확인하고, 조기상환 계획이 있다면 중도상환수수료 조건도 비교하세요."], bullets: ["매월 안정적으로 낼 수 있는 최대 금액", "전체 기간에 부담하는 총이자", "향후 소득 변화", "중도상환 가능성과 수수료"] },
    ],
    relatedTool: { label: "대출이자 직접 비교하기", href: "/daeul", description: "대출금액·금리·기간을 입력해 상환방식별 월 납입액을 확인하세요." },
    sources: [
      { label: "금융감독원 금융소비자정보포털 파인", href: "https://fine.fss.or.kr" },
      { label: "한국주택금융공사", href: "https://www.hf.go.kr" },
    ],
  },
];

export function getInsightPost(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}

export function formatInsightDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(`${value}T00:00:00+09:00`));
}
