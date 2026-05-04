"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// ────────────────────────────────────────────────
// 헤더 메인 링크 (6개 — 데스크탑 기준)
// ────────────────────────────────────────────────
const MAIN_LINKS = [
  { name: "취득세", href: "/takdeukse" },
  { name: "대출이자", href: "/daeul" },
  { name: "양도소득세", href: "/yangdo" },
  { name: "종합부동산세", href: "/jongbu" },
  { name: "증여세", href: "/jeungyese" },
  { name: "재산세", href: "/jaesanse" },
] as const;

// "더보기" 드롭다운에 표시할 나머지 계산기
const MORE_LINKS = [
  { name: "중개수수료 계산기", href: "/jungae" },
  { name: "평/㎡ 변환기", href: "/pyeong" },
  { name: "임대수익률 계산기", href: "/imdae" },
  { name: "전월세 전환 계산기", href: "/jeonwolse" },
  { name: "연봉 실수령액 계산기", href: "/yeonbong" },
] as const;

// 모바일 스크롤 바에는 전체 10개 표시
const ALL_LINKS = [...MAIN_LINKS, ...MORE_LINKS] as const;

export default function GlobalHeader() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 경로 변경 시 드롭다운 닫기
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

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

        {/* 데스크탑: 계산기 링크 + 더보기 (md 이상에서만 표시) */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="주요 계산기"
        >
          {MAIN_LINKS.map(({ name, href }) => {
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

          {/* 더보기 드롭다운 버튼 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMoreOpen((prev) => !prev)}
              className="text-sm px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
              style={{ color: moreOpen ? "#B8860B" : "#6B6B6B" }}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              더보기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{
                  transform: moreOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.15s ease",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {moreOpen && (
              <div
                className="absolute right-0 top-full mt-1 rounded-xl border shadow-lg py-2 min-w-[180px] z-50"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E4DD" }}
                role="menu"
              >
                {MORE_LINKS.map(({ name, href }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm transition-colors"
                      style={
                        isActive
                          ? { backgroundColor: "#F5EDD8", color: "#B8860B", fontWeight: 600 }
                          : { color: "#1A1A1A" }
                      }
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "#F9F6F1";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* 모바일: 가로 스크롤 링크 바 (md 미만에서만 표시) */}
      <nav
        className="md:hidden border-t border-gray-100 overflow-x-auto"
        aria-label="주요 계산기 (모바일)"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex items-center gap-1 px-4 py-2 whitespace-nowrap w-max">
          {ALL_LINKS.map(({ name, href }) => {
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
