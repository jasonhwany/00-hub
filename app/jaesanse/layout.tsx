import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "재산세 계산기 — 주택·토지 재산세 자동 계산",
  description:
    "주택·토지·건물 보유에 따른 재산세를 즉시 계산하세요. 공정시장가액비율 자동 적용. 도시지역분·지방교육세 포함 총 세액 확인.",
  keywords: [
    "재산세 계산기",
    "재산세 계산",
    "주택 재산세",
    "토지 재산세",
    "재산세율",
    "도시지역분",
  ],
  openGraph: {
    title: "재산세 계산기 | MoneyStom7",
    description:
      "주택·토지 공시가격 기준 재산세를 즉시 계산하세요. 도시지역분·지방교육세 포함.",
    url: "https://moneystom7.com/jaesanse",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
