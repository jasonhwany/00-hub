import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대출이자 계산기 — 원리금균등·원금균등 월 상환금 계산",
  description:
    "주택담보대출·신용대출 이자를 계산하세요. 원리금균등·원금균등·만기일시 3가지 상환방식별 월 상환금과 총 이자를 한눈에 비교.",
  keywords: [
    "대출이자 계산기",
    "원리금균등상환 계산기",
    "원금균등상환 계산기",
    "주담대 이자 계산",
    "대출 이자 계산",
  ],
  openGraph: {
    title: "대출이자 계산기 | MoneyStom7",
    description:
      "원리금균등·원금균등·만기일시 3가지 상환방식별 월 상환금과 총 이자를 비교하세요.",
    url: "https://moneystom7.com/daeul",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
