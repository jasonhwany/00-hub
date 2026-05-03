import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "증여세 계산기 — 부동산·현금 증여세 자동 계산",
  description:
    "부동산·현금 증여 시 납부할 증여세를 즉시 계산하세요. 배우자·직계존속·직계비속·기타친족 공제 자동 적용. 10년 합산 사전증여액 반영.",
  keywords: [
    "증여세 계산기",
    "증여세 계산",
    "부동산 증여세",
    "증여세율",
    "증여재산공제",
    "자녀 증여세",
  ],
  openGraph: {
    title: "증여세 계산기 | MoneyStom7",
    description:
      "증여 금액과 관계에 따른 증여세를 즉시 계산하세요. 공제·세율 자동 적용.",
    url: "https://moneystom7.com/jeungyese",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
