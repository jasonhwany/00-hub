"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ────────────────────────────────────────────────
// 헤더에 표시할 6개 계산기 링크 목록
// ────────────────────────────────────────────────
const NAV_LINKS = [
  { name: "취득세", href: "/takdeukse" },
  { name: "대출이자", href: "/daeul" },
  { name: "양도소득세", href: "/yangdo" },
  { name: "중개수수료", href: "/jungae" },
  { name: "종합부동산세", href: "/jongbu" },
  { name: "증여세", href: "/jeungyese" },
] as const;

export default function GlobalHeader() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-gray-200"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* 메인 헤더 바 */}
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* 로고 */}
        <Link
          href="/"
          className="flex-shrink-0 font-bold text-base tracking-tight transition-opacity hover:opacity-70"
          style={{ color: "#B8860B" }}
          aria-label="MoneyStom7 홈으로"
        >
          moneystom7
        </Link>

        {/* 데스크탑: 계산기 링크 (md 이상에서만 표시) */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="주요 계산기"
        >
          {NAV_LINKS.map(({ name, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="text-sm px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
                style={
                  isActive
                    ? {
                        backgroundColor: "#F5EDD8",
                        color: "#B8860B",
                        fontWeight: 600,
                      }
                    : {
                        color: "#6B6B6B",
                      }
                }
                aria-current={isActive ? "page" : undefined}
              >
                {name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 모바일: 가로 스크롤 링크 바 (md 미만에서만 표시) */}
      <nav
        className="md:hidden border-t border-gray-100 overflow-x-auto"
        aria-label="주요 계산기 (모바일)"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex items-center gap-1 px-4 py-2 whitespace-nowrap w-max">
          {NAV_LINKS.map(({ name, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="text-sm px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
                style={
                  isActive
                    ? {
                        backgroundColor: "#F5EDD8",
                        color: "#B8860B",
                        fontWeight: 600,
                      }
                    : {
                        color: "#6B6B6B",
                      }
                }
                aria-current={isActive ? "page" : undefined}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
