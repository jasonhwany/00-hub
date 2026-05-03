import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "평 ㎡ 변환기 — 평수 제곱미터 즉시 변환",
  description:
    "평과 제곱미터(㎡)를 즉시 변환하세요. 1평 = 3.305785㎡ 기준 정확한 환산. 아파트·주택 면적 확인에 유용합니다.",
  keywords: [
    "평수 변환기",
    "평 제곱미터 변환",
    "평 ㎡ 계산기",
    "평수 계산",
    "면적 변환",
    "아파트 평수",
  ],
  openGraph: {
    title: "평/㎡ 변환기 | MoneyStom7",
    description:
      "평과 제곱미터를 즉시 변환하세요. 1평 = 3.305785㎡ 정확한 환산값 적용.",
    url: "https://moneystom7.com/pyeong",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
