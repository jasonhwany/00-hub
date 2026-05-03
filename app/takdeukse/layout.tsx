import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "취득세 계산기 — 주택 취득세 자동 계산",
  description:
    "주택 취득 시 납부할 취득세를 즉시 계산하세요. 1주택·다주택·법인, 조정대상지역 여부에 따른 세율 자동 적용. 지방교육세·농어촌특별세 포함.",
  keywords: [
    "취득세 계산기",
    "취득세 계산",
    "주택 취득세",
    "부동산 취득세",
    "다주택 취득세",
    "조정대상지역 취득세",
  ],
  openGraph: {
    title: "취득세 계산기 | MoneyStom7",
    description:
      "주택 취득세를 즉시 계산하세요. 1주택·다주택·법인, 조정대상지역 여부 자동 반영.",
    url: "https://moneystom7.com/takdeukse",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
