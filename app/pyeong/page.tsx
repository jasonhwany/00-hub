'use client';

import { useState } from "react";
import { convertArea, type ConvertUnit } from "../../lib/pyeong";

const COMMON_SIZES = [
  { label: "10평 (33㎡)", pyeong: 10 },
  { label: "20평 (66㎡)", pyeong: 20 },
  { label: "25평 (83㎡)", pyeong: 25 },
  { label: "33평 (109㎡)", pyeong: 33 },
  { label: "40평 (132㎡)", pyeong: 40 },
  { label: "50평 (165㎡)", pyeong: 50 },
];

export default function PyeongPage() {
  const [inputValue, setInputValue] = useState("");
  const [unit, setUnit] = useState<ConvertUnit>("pyeong");

  const numValue = parseFloat(inputValue) || 0;
  const result = numValue > 0 ? convertArea(numValue, unit) : null;

  function handleQuickSelect(pyeong: number) {
    setUnit("pyeong");
    setInputValue(String(pyeong));
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
          1평 = 3.305785㎡
        </span>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}
      >
        평 / ㎡ 변환기
      </h1>
      <p className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        평과 제곱미터를 즉시 변환합니다
      </p>

      <section
        className="rounded-2xl p-6 mb-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        {/* 단위 선택 */}
        <div>
          <p className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
            입력 단위
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(["pyeong", "sqm"] as ConvertUnit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => { setUnit(u); setInputValue(""); }}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: unit === u ? "#B8860B" : "#F9F7F4",
                  color: unit === u ? "#FFFFFF" : "#1A1A1A",
                  border: unit === u ? "1px solid #B8860B" : "1px solid #E8E4DD",
                }}
              >
                {u === "pyeong" ? "평 입력" : "㎡ 입력"}
              </button>
            ))}
          </div>
        </div>

        {/* 숫자 입력 */}
        <div>
          <label htmlFor="areaInput" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            면적 입력
          </label>
          <div className="relative">
            <input
              id="areaInput"
              type="number"
              inputMode="decimal"
              min="0"
              placeholder={unit === "pyeong" ? "예: 25.7" : "예: 84.99"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={inputClass}
              style={{ ...inputStyle, paddingRight: "3rem" }}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none"
              style={{ color: "#B8860B" }}
            >
              {unit === "pyeong" ? "평" : "㎡"}
            </span>
          </div>
        </div>
      </section>

      {/* 결과 */}
      {result !== null ? (
        <section
          className="rounded-2xl p-6 mb-6 text-center"
          style={{ border: "1px solid #B8860B", backgroundColor: "#F5EDD8" }}
        >
          <p className="text-sm mb-1" style={{ color: "#6B6B6B" }}>
            {result.inputValue} {unit === "pyeong" ? "평" : "㎡"} =
          </p>
          <p
            className="text-4xl font-bold tabular-nums"
            style={{ color: "#B8860B", fontFamily: "var(--font-serif)" }}
          >
            {result.outputValue.toLocaleString("ko-KR")}
          </p>
          <p className="text-lg font-medium mt-1" style={{ color: "#1A1A1A" }}>
            {unit === "pyeong" ? "㎡" : "평"}
          </p>
        </section>
      ) : (
        <section
          className="rounded-2xl p-8 text-center text-sm mb-6"
          style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}
        >
          면적을 입력하면 즉시 변환됩니다.
        </section>
      )}

      {/* 빠른 선택 */}
      <section
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6B6B6B" }}>
          자주 쓰는 평수
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {COMMON_SIZES.map((s) => (
            <button
              key={s.pyeong}
              type="button"
              onClick={() => handleQuickSelect(s.pyeong)}
              className="py-2 px-2 rounded-lg text-xs transition-colors"
              style={{
                backgroundColor: "#F9F7F4",
                color: "#1A1A1A",
                border: "1px solid #E8E4DD",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <p className="text-xs leading-relaxed text-center" style={{ color: "#6B6B6B" }}>
        1평 = 3.305785㎡ (법정 환산값 기준)
      </p>
    </main>
  );
}
