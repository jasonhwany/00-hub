import type { Metadata } from "next";
import ImdaeClient from "./ImdaeClient";

export const metadata: Metadata = {
  title: "임대수익률 계산기 — 매입가·보증금·월세로 수익률 계산",
  description:
    "매입가, 보증금, 월세를 입력하면 순투자금 대비 연 임대수익률과 전세가율을 자동으로 계산합니다. 부동산 투자 분석에 활용하세요. 무료.",
  alternates: { canonical: "https://moneystom7.com/imdae" },
  openGraph: {
    title: "임대수익률 계산기 — 매입가·보증금·월세로 수익률 계산",
    description:
      "매입가, 보증금, 월세를 입력하면 순투자금 대비 연 임대수익률과 전세가율을 자동으로 계산합니다. 부동산 투자 분석에 활용하세요. 무료.",
    url: "https://moneystom7.com/imdae",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "임대수익률 계산기",
  url: "https://moneystom7.com/imdae",
  description:
    "매입가, 보증금, 월세를 입력하면 순투자금 대비 연 임대수익률과 전세가율을 자동으로 계산합니다. 부동산 투자 분석에 활용하세요. 무료.",
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

export default function ImdaePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImdaeClient />
    </>
  );
}
