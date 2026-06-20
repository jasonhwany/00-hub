'use client';

import { useState, useMemo } from "react";
import { calcJaesanse, formatKRW, type PropertyType } from "../../lib/jaesanse";
import AffiliateCTA from "../../components/AffiliateCTA";
import { useTrackResult } from "../../lib/useTrackResult";

const PROPERTY_OPTIONS: { value: PropertyType; label: string; desc: string }[] = [
  { value: "house", label: "주택", desc: "공시가격×60% 과세" },
  { value: "land", label: "토지", desc: "공시가격×70% 과세" },
  { value: "building", label: "건물", desc: "공시가격×70% 과세" },
];

function ResultRow({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-lg"
      style={{
        backgroundColor: highlight ? "#F5EDD8" : "#F9F7F4",
        border: highlight ? "1px solid #B8860B" : "1px solid #E8E4DD",
      }}
    >
      <div>
        <span
          className="text-sm font-medium"
          style={{ color: highlight ? "#B8860B" : "#1A1A1A" }}
        >
          {label}
        </span>
        {sub && (
          <span className="ml-2 text-xs" style={{ color: "#6B6B6B" }}>
            {sub}
          </span>
        )}
      </div>
      <span
        className="font-semibold tabular-nums"
        style={{
          color: highlight ? "#B8860B" : "#1A1A1A",
          fontSize: highlight ? "1.1rem" : "1rem",
        }}
      >
        {value}원
      </span>
    </div>
  );
}

export default function JaesansePage() {
  const [priceInput, setPriceInput] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("house");

  const publicPrice = Number(priceInput.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    if (publicPrice <= 0) return null;
    return calcJaesanse({ propertyType, publicPrice });
  }, [publicPrice, propertyType]);

  useTrackResult("jaesanse", result);

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPriceInput(raw === "" ? "" : Number(raw).toLocaleString("ko-KR"));
  }

  const inputClass =
    "w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-colors";
  const inputStyle = {
    border: "1px solid #E8E4DD",
    backgroundColor: "#FFFFFF",
    color: "#1A1A1A",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <a
        href="https://moneystom7.com"
        className="inline-flex items-center gap-1 text-sm mb-8"
        style={{ color: "#6B6B6B" }}
      >
        <span aria-hidden="true">←</span>
        moneystom7.com으로 돌아가기
      </a>

      <div className="mb-4">
        <span
          className="inline-block text-xs px-3 py-1 rounded-full font-medium tracking-wide"
          style={{ backgroundColor: "#F5EDD8", color: "#B8860B" }}
        >
          2024년 기준
        </span>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}
      >
        재산세 계산기
      </h1>
      <p className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        주택·토지·건물 보유에 따른 재산세를 미리 계산하세요
      </p>

      <section
        className="rounded-2xl p-6 mb-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        {/* 부동산 유형 */}
        <div>
          <p className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
            부동산 유형
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PROPERTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPropertyType(opt.value)}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left"
                style={{
                  backgroundColor: propertyType === opt.value ? "#B8860B" : "#F9F7F4",
                  color: propertyType === opt.value ? "#FFFFFF" : "#1A1A1A",
                  border: propertyType === opt.value ? "1px solid #B8860B" : "1px solid #E8E4DD",
                }}
              >
                <span className="block">{opt.label}</span>
                <span
                  className="block text-xs mt-0.5"
                  style={{ color: propertyType === opt.value ? "rgba(255,255,255,0.8)" : "#6B6B6B" }}
                >
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 공시가격 */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            공시가격
          </label>
          <div className="relative">
            <input
              id="price"
              type="text"
              inputMode="numeric"
              placeholder="예: 500,000,000"
              value={priceInput}
              onChange={handlePriceChange}
              className={inputClass}
              style={{ ...inputStyle, paddingRight: "2rem" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
          {publicPrice > 0 && (
            <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
              {Math.floor(publicPrice / 10_000).toLocaleString("ko-KR")}만원
            </p>
          )}
        </div>
      </section>

      {/* 결과 */}
      {result !== null ? (
        <section
          className="rounded-2xl p-6 mb-6 space-y-2.5"
          style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6B6B6B" }}>
            계산 결과
          </h3>
          <ResultRow
            label="과세표준"
            value={formatKRW(result.taxBase)}
            sub={propertyType === "house" ? "공시가격×60%" : "공시가격×70%"}
          />
          <ResultRow
            label="재산세"
            value={formatKRW(result.propertyTax)}
          />
          <ResultRow
            label="도시지역분"
            value={formatKRW(result.urbanAreaTax)}
            sub="과세표준×0.14%"
          />
          <ResultRow
            label="지방교육세"
            value={formatKRW(result.localEduTax)}
            sub="재산세×20%"
          />
          <div className="pt-1">
            <ResultRow
              label="합계"
              value={formatKRW(result.total)}
              highlight
            />
          </div>
        </section>
      ) : (
        <section
          className="rounded-2xl p-8 text-center text-sm mb-6"
          style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}
        >
          공시가격을 입력하면 재산세가 자동으로 계산됩니다.
        </section>
      )}

      {/* 제휴 배너 — 결과와 면책문구 사이 */}
      <AffiliateCTA slotKey="jaesanse" className="my-6" />

      <p className="text-xs leading-relaxed text-center" style={{ color: "#6B6B6B" }}>
        본 계산 결과는 참고용이며 실제 납부세액과 다를 수 있습니다.
        <br className="hidden sm:block" />
        정확한 세액은 세무사 또는 관할 지방자치단체에 문의하세요.
      </p>
    </main>
  );
}
