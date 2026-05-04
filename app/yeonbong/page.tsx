import type { Metadata } from "next";
import YeonbongClient from "./YeonbongClient";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 2026 — 4대보험·세금 공제 후 월급 계산",
  description:
    "2026년 기준 연봉 실수령액 계산기. 국민연금·건강보험·장기요양·고용보험·소득세 자동 계산. 부양가족 수, 비과세 식대 반영. 월 실수령액을 즉시 확인하세요.",
  alternates: { canonical: "https://moneystom7.com/yeonbong" },
  keywords: [
    "연봉 실수령액",
    "연봉 실수령액 계산기",
    "월 실수령액",
    "세후 월급",
    "4대보험 계산기",
    "소득세 계산기",
    "연봉 세금 계산",
  ],
  openGraph: {
    title: "연봉 실수령액 계산기 2026 — 4대보험·세금 공제 후 월급 계산",
    description:
      "2026년 기준 연봉 실수령액 계산기. 국민연금·건강보험·장기요양·고용보험·소득세 자동 계산. 월 실수령액을 즉시 확인하세요.",
    url: "https://moneystom7.com/yeonbong",
    type: "website",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "연봉 실수령액 계산기",
  url: "https://moneystom7.com/yeonbong",
  description:
    "2026년 기준 연봉 실수령액 계산기. 국민연금·건강보험·장기요양·고용보험·소득세 자동 계산. 월 실수령액을 즉시 확인하세요.",
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
      name: "연봉 실수령액은 어떻게 계산하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "연봉을 12로 나눈 월 세전 급여에서 4대 보험(국민연금 4.5%, 건강보험 3.545%, 장기요양보험 건강보험료×12.95%, 고용보험 0.9%)과 소득세, 지방소득세(소득세×10%)를 공제한 금액이 월 실수령액입니다.",
      },
    },
    {
      "@type": "Question",
      name: "부양가족 수가 실수령액에 영향을 미치나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 부양가족 수(본인 포함)가 늘수록 인적공제가 늘어나 소득세가 줄어듭니다. 1인당 연 150만원씩 추가 공제됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "비과세 식대란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "회사에서 지급하는 식대 중 월 20만원(연 240만원)까지는 비과세 처리됩니다. 식대가 급여에 포함된 경우 이 금액만큼 과세 대상 소득이 줄어들어 소득세가 감소합니다.",
      },
    },
    {
      "@type": "Question",
      name: "국민연금 상한액이 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 국민연금은 기준소득월액 상한이 590만원입니다. 월급이 590만원을 초과해도 590만원 기준으로 계산되므로 최대 납부액은 265,500원입니다.",
      },
    },
    {
      "@type": "Question",
      name: "실제 원천징수액과 계산기 결과가 다를 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 이 계산기는 2026년 간이세액표 기반의 추정치입니다. 실제 원천징수는 회사의 급여 계산 방식, 각종 비과세·공제 항목에 따라 다를 수 있습니다. 연말정산을 통해 최종 세액이 정산됩니다.",
      },
    },
  ],
};

export default function YeonbongPage() {
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
      <YeonbongClient />
    </>
  );
}
