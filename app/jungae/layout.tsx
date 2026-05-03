import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "중개수수료 계산기 — 부동산 중개보수 자동 계산",
  description:
    "매매·전세·월세 거래 시 법정 중개수수료(중개보수)를 즉시 계산하세요. 공인중개사법 상한 요율 자동 적용. VAT 포함 금액 확인.",
  keywords: [
    "중개수수료 계산기",
    "중개보수 계산",
    "부동산 중개비",
    "중개수수료율",
    "전세 중개비",
    "매매 중개수수료",
  ],
  openGraph: {
    title: "중개수수료 계산기 | MoneyStom7",
    description:
      "매매·전세·월세 거래 중개수수료를 즉시 계산하세요. 법정 상한 요율 자동 적용.",
    url: "https://moneystom7.com/jungae",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
