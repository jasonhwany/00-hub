import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import GlobalHeader from "../components/GlobalHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://moneystom7.com"),
  title: {
    default: "MoneyStom7 — 한국 부동산·세금 계산기",
    template: "%s | MoneyStom7",
  },
  description:
    "취득세, 양도소득세, 종합부동산세 등 한국 부동산 세금을 직접 계산하세요. 집 사고 팔기 전 꼭 확인하는 무료 계산기 모음.",
  keywords: ["취득세 계산기", "양도소득세 계산기", "종합부동산세 계산기", "부동산 세금 계산기", "종부세 계산기", "부동산 계산기"],
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
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen antialiased"
        style={{ backgroundColor: "#FAFAF7", color: "#1A1A1A" }}
      >
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8414331859152952"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <GlobalHeader />
        {children}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GN51TN6PS4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GN51TN6PS4');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8414331859152952"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
