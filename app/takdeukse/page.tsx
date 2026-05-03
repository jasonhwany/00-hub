import type { Metadata } from "next";
import TakdeukseClient from "./TakdeukseClient";

export const metadata: Metadata = {
  title: "취득세 계산기 2026 — 주택·토지·상가 취득세 자동 계산",
  description:
    "2026년 최신 법령 기준 취득세 계산기. 1주택·2주택·법인 취득, 조정대상지역 여부에 따라 취득세·농어촌특별세·지방교육세를 자동으로 계산합니다. 무료.",
  alternates: { canonical: "https://moneystom7.com/takdeukse" },
  openGraph: {
    title: "취득세 계산기 2026 — 주택·토지·상가 취득세 자동 계산",
    description:
      "2026년 최신 법령 기준 취득세 계산기. 1주택·2주택·법인 취득, 조정대상지역 여부에 따라 취득세·농어촌특별세·지방교육세를 자동으로 계산합니다. 무료.",
    url: "https://moneystom7.com/takdeukse",
    type: "website",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "취득세 계산기",
  url: "https://moneystom7.com/takdeukse",
  description:
    "2026년 최신 법령 기준 취득세 계산기. 1주택·2주택·법인 취득, 조정대상지역 여부에 따라 취득세·농어촌특별세·지방교육세를 자동으로 계산합니다. 무료.",
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
      name: "취득세는 언제 납부해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "취득일로부터 60일 이내에 납부해야 합니다. 상속은 상속개시일이 속하는 달의 말일부터 6개월, 증여는 취득일로부터 60일 이내입니다. 기한 내 미납 시 가산세(3%)가 부과됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "1세대 1주택자도 취득세를 내나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 1세대 1주택자도 취득세를 납부합니다. 다만 생애최초 주택 구입 시 200만원 한도로 취득세가 감면됩니다(2023년 기준). 주택 가액과 면적에 따라 감면 요건이 다를 수 있으니 관할 구청에 확인하세요.",
      },
    },
    {
      "@type": "Question",
      name: "분양권을 취득할 때도 취득세를 내나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "분양권 자체를 취득할 때는 취득세가 없습니다. 그러나 분양권을 유상으로 전매(매수)하는 경우 2021년 이후부터 취득세가 부과됩니다. 주택 완공 후 소유권 이전 시에는 별도로 취득세가 부과됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "농어촌특별세와 지방교육세는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "농어촌특별세는 85㎡ 초과 주택 취득 시 취득세의 10%가 부과되는 국세입니다. 지방교육세는 취득세의 20%로 부과되는 지방세입니다. 두 세금 모두 취득세와 함께 납부합니다.",
      },
    },
    {
      "@type": "Question",
      name: "다주택자 중과세율은 얼마인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "조정대상지역 내 2주택은 8%, 3주택 이상은 12%의 중과세율이 적용됩니다. 비조정대상지역은 2주택까지 일반세율, 3주택은 8%, 4주택 이상은 12%입니다. 2024년 이후 세율 변경이 있을 수 있으니 최신 국세청 고시를 확인하세요.",
      },
    },
  ],
};

export default function TakdeuksePage() {
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
      <TakdeukseClient />
    </>
  );
}
