import type { Metadata } from "next";
import YangdoClient from "./YangdoClient";

export const metadata: Metadata = {
  title: "양도소득세 계산기 2026 — 부동산 매도 세금 계산",
  description:
    "2026년 기준 부동산 양도소득세 계산기. 1세대1주택 비과세, 장기보유특별공제, 다주택 중과세율을 반영하여 양도세를 정확하게 계산합니다. 무료.",
  alternates: { canonical: "https://moneystom7.com/yangdo" },
  openGraph: {
    title: "양도소득세 계산기 2026 — 부동산 매도 세금 계산",
    description:
      "2026년 기준 부동산 양도소득세 계산기. 1세대1주택 비과세, 장기보유특별공제, 다주택 중과세율을 반영하여 양도세를 정확하게 계산합니다. 무료.",
    url: "https://moneystom7.com/yangdo",
    type: "website",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "양도소득세 계산기",
  url: "https://moneystom7.com/yangdo",
  description:
    "2026년 기준 부동산 양도소득세 계산기. 1세대1주택 비과세, 장기보유특별공제, 다주택 중과세율을 반영하여 양도세를 정확하게 계산합니다. 무료.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "ko",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  provider: {
    "@type": "Organization",
    name: "MoneyStom7",
    url: "https://moneystom7.com",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "1세대 1주택 비과세란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1세대가 국내에 1주택만 보유하고 2년 이상 보유(조정대상지역은 2년 이상 거주도 필요)한 후 양도할 경우, 양도가액 12억원까지는 양도소득세가 비과세됩니다. 12억원 초과분에 대해서는 과세됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "장기보유특별공제란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "부동산을 3년 이상 보유한 경우 양도차익에서 일정 비율을 공제해 주는 제도입니다. 1세대 1주택(거주요건 충족)은 보유기간 연 4% + 거주기간 연 4%로 최대 80%까지 공제됩니다. 일반 부동산은 보유기간 연 2%로 최대 30%까지 공제됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "양도소득세 필요경비에는 무엇이 포함되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "취득 시 납부한 취득세, 법무사 비용, 중개수수료가 포함됩니다. 또한 자본적 지출(발코니 확장, 시스템 에어컨 설치 등 구조 변경 공사비)도 포함됩니다. 단순 유지보수(도배, 장판 등) 비용은 제외됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "일시적 2주택 비과세 특례란?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "기존 주택을 보유한 상태에서 새 주택을 취득한 경우, 새 주택 취득일로부터 3년 이내에 기존 주택을 양도하면 1세대 1주택으로 보아 비과세 혜택을 받을 수 있습니다. 조정대상지역 내 신규취득 시에는 요건이 다를 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "양도소득세는 언제 신고·납부하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "양도일이 속하는 달의 말일부터 2개월 이내에 예정신고를 해야 합니다. 예정신고를 한 경우 확정신고는 생략할 수 있습니다. 신고 기한을 놓치면 무신고 가산세(20%)와 납부지연 가산세가 부과됩니다.",
      },
    },
  ],
};

export default function YangdoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <YangdoClient />
    </>
  );
}
