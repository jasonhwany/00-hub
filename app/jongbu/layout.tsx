import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "종합부동산세 계산기 — 종부세 자동 계산",
  description:
    "주택 공시가격 기준 종합부동산세(종부세)를 즉시 계산하세요. 1주택·다주택·조정대상지역 세율 자동 적용. 고령자·장기보유 세액공제, 농어촌특별세 포함.",
  keywords: [
    "종합부동산세 계산기",
    "종부세 계산",
    "종부세 계산기",
    "1주택 종부세",
    "다주택 종부세",
    "종합부동산세 세율",
  ],
  openGraph: {
    title: "종합부동산세 계산기 | MoneyStom7",
    description:
      "주택 공시가격 기준 종부세를 즉시 계산하세요. 세액공제·농특세 포함.",
    url: "https://moneystom7.com/jongbu",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
