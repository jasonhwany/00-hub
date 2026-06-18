import type { Metadata } from "next";
import JaesanseClient from "./JaesanseClient";

export const metadata: Metadata = {
  title: "재산세 계산기 — 주택·토지·건물 보유세 자동 계산",
  description:
    "주택·토지·건물 보유 시 납부할 재산세를 공시가격 기준으로 자동 계산합니다. 도시지역분, 지방교육세까지 한 번에 확인하세요. 무료.",
  alternates: { canonical: "https://moneystom7.com/jaesanse" },
  openGraph: {
    title: "재산세 계산기 — 주택·토지·건물 보유세 자동 계산",
    description:
      "주택·토지·건물 보유 시 납부할 재산세를 공시가격 기준으로 자동 계산합니다. 도시지역분, 지방교육세까지 한 번에 확인하세요. 무료.",
    url: "https://moneystom7.com/jaesanse",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "재산세 계산기",
  url: "https://moneystom7.com/jaesanse",
  description:
    "주택·토지·건물 보유 시 납부할 재산세를 공시가격 기준으로 자동 계산합니다. 도시지역분, 지방교육세까지 한 번에 확인하세요. 무료.",
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

export default function JaesansePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JaesanseClient />
    </>
  );
}
