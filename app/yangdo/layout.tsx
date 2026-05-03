import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "양도소득세 계산기 — 부동산 매도 전 양도세 계산",
  description:
    "부동산 양도 시 예상 양도소득세를 계산하세요. 1세대 1주택 비과세, 장기보유특별공제, 다주택 중과세율 자동 반영.",
  keywords: [
    "양도소득세 계산기",
    "양도세 계산기",
    "부동산 양도세",
    "1세대1주택 비과세",
    "장기보유특별공제",
    "다주택 양도세",
  ],
  openGraph: {
    title: "양도소득세 계산기 | MoneyStom7",
    description:
      "부동산 양도 시 예상 양도소득세를 계산하세요. 1세대 1주택 비과세, 장기보유특별공제, 다주택 중과세율 자동 반영.",
    url: "https://moneystom7.com/yangdo",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
