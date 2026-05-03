import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전월세 전환 계산기 — 전세 월세 상호 전환",
  description:
    "전세 보증금을 월세로, 월세를 전세금으로 전환하세요. 주택임대차보호법 기준 전환율 적용. 법정 상한 전환율 4% 기준 즉시 계산.",
  keywords: [
    "전월세 전환 계산기",
    "전세 월세 전환",
    "월세 전세 전환",
    "전환율 계산",
    "임대차 전환",
    "전세 월세 계산기",
  ],
  openGraph: {
    title: "전월세 전환 계산기 | MoneyStom7",
    description:
      "전세와 월세를 상호 전환하세요. 법정 상한 전환율 기준 즉시 계산.",
    url: "https://moneystom7.com/jeonwolse",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
