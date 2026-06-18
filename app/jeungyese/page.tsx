import type { Metadata } from "next";
import JeungyeseClient from "./JeungyeseClient";

export const metadata: Metadata = {
  title: "증여세 계산기 — 부동산·현금 증여세 자동 계산",
  description:
    "배우자, 직계존비속 등 관계별 증여재산공제를 반영하여 증여세를 자동 계산합니다. 10년 내 사전증여액 합산까지 반영됩니다. 무료.",
  alternates: { canonical: "https://moneystom7.com/jeungyese" },
  openGraph: {
    title: "증여세 계산기 — 부동산·현금 증여세 자동 계산",
    description:
      "배우자, 직계존비속 등 관계별 증여재산공제를 반영하여 증여세를 자동 계산합니다. 10년 내 사전증여액 합산까지 반영됩니다. 무료.",
    url: "https://moneystom7.com/jeungyese",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "증여세 계산기",
  url: "https://moneystom7.com/jeungyese",
  description:
    "배우자, 직계존비속 등 관계별 증여재산공제를 반영하여 증여세를 자동 계산합니다. 10년 내 사전증여액 합산까지 반영됩니다. 무료.",
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

export default function JeungyesePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JeungyeseClient />
    </>
  );
}
