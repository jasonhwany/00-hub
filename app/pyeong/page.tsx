import type { Metadata } from "next";
import PyeongClient from "./PyeongClient";

export const metadata: Metadata = {
  title: "평 ㎡ 변환기 — 평수·제곱미터 즉시 변환",
  description:
    "평과 제곱미터(㎡)를 즉시 상호 변환합니다. 자주 쓰는 평수(10평~50평) 빠른 선택 기능을 제공합니다. 무료.",
  alternates: { canonical: "https://moneystom7.com/pyeong" },
  openGraph: {
    title: "평 ㎡ 변환기 — 평수·제곱미터 즉시 변환",
    description:
      "평과 제곱미터(㎡)를 즉시 상호 변환합니다. 자주 쓰는 평수(10평~50평) 빠른 선택 기능을 제공합니다. 무료.",
    url: "https://moneystom7.com/pyeong",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "평 ㎡ 변환기",
  url: "https://moneystom7.com/pyeong",
  description:
    "평과 제곱미터(㎡)를 즉시 상호 변환합니다. 자주 쓰는 평수(10평~50평) 빠른 선택 기능을 제공합니다. 무료.",
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

export default function PyeongPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PyeongClient />
    </>
  );
}
