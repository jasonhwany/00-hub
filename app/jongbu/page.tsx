import type { Metadata } from "next";
import JongbuClient from "./JongbuClient";

export const metadata: Metadata = {
  title: "종합부동산세 계산기 2026 — 종부세 자동 계산",
  description:
    "2026년 기준 종합부동산세(종부세) 계산기. 주택 공시가격 합산액과 보유 주택 수를 입력하면 종부세·농어촌특별세까지 자동 계산됩니다. 무료.",
  alternates: { canonical: "https://moneystom7.com/jongbu" },
  openGraph: {
    title: "종합부동산세 계산기 2026 — 종부세 자동 계산",
    description:
      "2026년 기준 종합부동산세(종부세) 계산기. 주택 공시가격 합산액과 보유 주택 수를 입력하면 종부세·농어촌특별세까지 자동 계산됩니다. 무료.",
    url: "https://moneystom7.com/jongbu",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "종합부동산세 계산기",
  url: "https://moneystom7.com/jongbu",
  description:
    "2026년 기준 종합부동산세(종부세) 계산기. 주택 공시가격 합산액과 보유 주택 수를 입력하면 종부세·농어촌특별세까지 자동 계산됩니다. 무료.",
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

export default function JongbuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JongbuClient />
    </>
  );
}
