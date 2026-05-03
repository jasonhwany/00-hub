import type { Metadata } from "next";
import DaeulClient from "./DaeulClient";

export const metadata: Metadata = {
  title: "대출이자 계산기 — 원리금균등·원금균등·만기일시 이자 비교",
  description:
    "대출 원리금균등상환, 원금균등상환, 만기일시상환 방식별 월 상환금과 총 이자를 계산하고 비교합니다. 대출금액·금리·기간을 입력하면 상환 스케줄을 즉시 확인할 수 있습니다.",
  alternates: { canonical: "https://moneystom7.com/daeul" },
  openGraph: {
    title: "대출이자 계산기 — 원리금균등·원금균등·만기일시 이자 비교",
    description:
      "대출 원리금균등상환, 원금균등상환, 만기일시상환 방식별 월 상환금과 총 이자를 계산하고 비교합니다. 대출금액·금리·기간을 입력하면 상환 스케줄을 즉시 확인할 수 있습니다.",
    url: "https://moneystom7.com/daeul",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "대출이자 계산기",
  url: "https://moneystom7.com/daeul",
  description:
    "대출 원리금균등상환, 원금균등상환, 만기일시상환 방식별 월 상환금과 총 이자를 계산하고 비교합니다. 대출금액·금리·기간을 입력하면 상환 스케줄을 즉시 확인할 수 있습니다.",
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

export default function DaeulPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DaeulClient />
    </>
  );
}
