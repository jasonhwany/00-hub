import type { Metadata } from "next";
import "./globals.css";

const geist = { variable: "--font-geist" };

export const metadata: Metadata = {
  metadataBase: new URL("https://moneystom7.com"),
  title: {
    default: "MoneyStom7 — 무료 금융·생활 계산기 모음",
    template: "%s | MoneyStom7",
  },
  description:
    "복리 계산기, 대출 계산기, 환율 변환 등 100가지 무료 금융·생활 도구를 한곳에서. 광고 없이 빠르게 계산하세요.",
  keywords: ["무료 계산기", "금융 계산기", "복리 계산기", "대출 계산기", "재테크"],
  openGraph: {
    siteName: "MoneyStom7",
    locale: "ko_KR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={geist.variable}>
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
