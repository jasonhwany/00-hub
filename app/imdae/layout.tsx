import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "임대수익률 계산기 — 부동산 투자 수익률 자동 계산",
  description:
    "매입가·보증금·월세 기준 임대수익률을 즉시 계산하세요. 순투자금 대비 연 수익률, 전세가율 자동 산출. 부동산 투자 분석에 활용하세요.",
  keywords: [
    "임대수익률 계산기",
    "부동산 수익률",
    "임대 수익률",
    "월세 수익률",
    "전세가율 계산",
    "부동산 투자 계산기",
  ],
  openGraph: {
    title: "임대수익률 계산기 | MoneyStom7",
    description:
      "매입가·보증금·월세로 임대수익률을 즉시 계산하세요. 전세가율 포함.",
    url: "https://moneystom7.com/imdae",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
