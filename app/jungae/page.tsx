import type { Metadata } from "next";
import JungaeClient from "./JungaeClient";

export const metadata: Metadata = {
  title: "중개수수료 계산기 — 매매·전세·월세 법정 중개보수 계산",
  description:
    "매매·전세·월세 거래 시 공인중개사법 시행규칙 기준 법정 중개수수료 상한액을 자동으로 계산합니다. 무료.",
  alternates: { canonical: "https://moneystom7.com/jungae" },
  openGraph: {
    title: "중개수수료 계산기 — 매매·전세·월세 법정 중개보수 계산",
    description:
      "매매·전세·월세 거래 시 공인중개사법 시행규칙 기준 법정 중개수수료 상한액을 자동으로 계산합니다. 무료.",
    url: "https://moneystom7.com/jungae",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "중개수수료 계산기",
  url: "https://moneystom7.com/jungae",
  description:
    "매매·전세·월세 거래 시 공인중개사법 시행규칙 기준 법정 중개수수료 상한액을 자동으로 계산합니다. 무료.",
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

export default function JungaePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JungaeClient />
    </>
  );
}
