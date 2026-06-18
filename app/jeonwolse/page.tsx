import type { Metadata } from "next";
import JeonwolseClient from "./JeonwolseClient";

export const metadata: Metadata = {
  title: "전월세 전환 계산기 — 전세·월세 상호 전환",
  description:
    "주택임대차보호법 제7조의2에 따른 법정 전환율(연 4%) 기준으로, 전세를 월세로, 월세를 전세로 즉시 전환합니다. 무료.",
  alternates: { canonical: "https://moneystom7.com/jeonwolse" },
  openGraph: {
    title: "전월세 전환 계산기 — 전세·월세 상호 전환",
    description:
      "주택임대차보호법 제7조의2에 따른 법정 전환율(연 4%) 기준으로, 전세를 월세로, 월세를 전세로 즉시 전환합니다. 무료.",
    url: "https://moneystom7.com/jeonwolse",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "전월세 전환 계산기",
  url: "https://moneystom7.com/jeonwolse",
  description:
    "주택임대차보호법 제7조의2에 따른 법정 전환율(연 4%) 기준으로, 전세를 월세로, 월세를 전세로 즉시 전환합니다. 무료.",
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

export default function JeonwolsePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JeonwolseClient />
    </>
  );
}
