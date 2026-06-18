'use client';

import { useState, useMemo } from "react";
import { calcJeonwolse, formatKRW, type ConvertDirection } from "../../lib/jeonwolse";
import AffiliateCTA from "../../components/AffiliateCTA";

const DIRECTION_OPTIONS: { value: ConvertDirection; label: string; desc: string }[] = [
  { value: "jeonse_to_monthly", label: "전세 → 월세", desc: "전세금을 보증금+월세로" },
  { value: "monthly_to_jeonse", label: "월세 → 전세", desc: "보증금+월세를 전세금으로" },
];

export default function JeonwolsePage() {
  const [direction, setDirection] = useState<ConvertDirection>("jeonse_to_monthly");
  const [jeonsePriceInput, setJeonsePriceInput] = useState("");
  const [newDepositInput, setNewDepositInput] = useState("");
  const [existingDepositInput, setExistingDepositInput] = useState("");
  const [monthlyRentInput, setMonthlyRentInput] = useState("");
  const [conversionRate, setConversionRate] = useState("4");

  function handleMoneyInput(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setter(raw === "" ? "" : Number(raw).toLocaleString("ko-KR"));
  }

  const jeonseDeposit = Number(jeonsePriceInput.replace(/,/g, "")) || 0;
  const newDeposit = Number(newDepositInput.replace(/,/g, "")) || 0;
  const existingDeposit = Number(existingDepositInput.replace(/,/g, "")) || 0;
  const monthlyRent = Number(monthlyRentInput.replace(/,/g, "")) || 0;
  const rate = parseFloat(conversionRate) || 4;

  const result = useMemo(() => {
    return calcJeonwolse({
      direction,
      jeonseDeposit: direction === "jeonse_to_monthly" ? jeonseDeposit : undefined,
      newDeposit: direction === "jeonse_to_monthly" ? newDeposit : undefined,
      existingDeposit: direction === "monthly_to_jeonse" ? existingDeposit : undefined,
      monthlyRent: direction === "monthly_to_jeonse" ? monthlyRent : undefined,
      conversionRate: rate,
    });
  }, [direction, jeonseDeposit, newDeposit, existingDeposit, monthlyRent, rate]);

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
          주택임대차보호법 제7조의2 기준
        </span>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}
      >
        전월세 전환 계산기
      </h1>
      <p className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        전세와 월세를 상호 전환하여 비교하세요
      </p>

      <section
        className="rounded-2xl p-6 mb-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        {/* 전환 방향 */}
        <div>
          <p className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
            전환 방향
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DIRECTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setDirection(opt.value);
                  setJeonsePriceInput("");
                  setNewDepositInput("");
                  setExistingDepositInput("");
                  setMonthlyRentInput("");
                }}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left"
                style={{
                  backgroundColor: direction === opt.value ? "#B8860B" : "#F9F7F4",
                  color: direction === opt.value ? "#FFFFFF" : "#1A1A1A",
                  border: direction === opt.value ? "1px solid #B8860B" : "1px solid #E8E4DD",
                }}
              >
                <span className="block font-semibold">{opt.label}</span>
                <span
                  className="block text-xs mt-0.5"
                  style={{ color: direction === opt.value ? "rgba(255,255,255,0.8)" : "#6B6B6B" }}
                >
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 전세 → 월세 입력 */}
        {direction === "jeonse_to_monthly" && (
          <>
            <div>
              <label htmlFor="jeonsePrice" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
                현재 전세금
              </label>
              <div className="relative">
                <input
                  id="jeonsePrice"
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 300,000,000"
                  value={jeonsePriceInput}
                  onChange={(e) => handleMoneyInput(e, setJeonsePriceInput)}
                  className={inputClass}
                  style={{ ...inputStyle, paddingRight: "2rem" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
              </div>
              {jeonseDeposit > 0 && (
                <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
                  {Math.floor(jeonseDeposit / 10_000).toLocaleString("ko-KR")}만원
                </p>
              )}
            </div>
            <div>
              <label htmlFor="newDeposit" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
                새 보증금
                <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(없으면 0 또는 빈칸)</span>
              </label>
              <div className="relative">
                <input
                  id="newDeposit"
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 50,000,000"
                  value={newDepositInput}
                  onChange={(e) => handleMoneyInput(e, setNewDepositInput)}
                  className={inputClass}
                  style={{ ...inputStyle, paddingRight: "2rem" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
              </div>
            </div>
          </>
        )}

        {/* 월세 → 전세 입력 */}
        {direction === "monthly_to_jeonse" && (
          <>
            <div>
              <label htmlFor="existingDeposit" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
                현재 보증금
              </label>
              <div className="relative">
                <input
                  id="existingDeposit"
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 50,000,000"
                  value={existingDepositInput}
                  onChange={(e) => handleMoneyInput(e, setExistingDepositInput)}
                  className={inputClass}
                  style={{ ...inputStyle, paddingRight: "2rem" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
              </div>
            </div>
            <div>
              <label htmlFor="monthlyRent" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
                현재 월세
              </label>
              <div className="relative">
                <input
                  id="monthlyRent"
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 1,000,000"
                  value={monthlyRentInput}
                  onChange={(e) => handleMoneyInput(e, setMonthlyRentInput)}
                  className={inputClass}
                  style={{ ...inputStyle, paddingRight: "2rem" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
              </div>
            </div>
          </>
        )}

        {/* 전환율 */}
        <div>
          <label htmlFor="rate" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            전환율
            <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(법정 상한: 4%)</span>
          </label>
          <div className="relative">
            <input
              id="rate"
              type="number"
              inputMode="decimal"
              min="0.1"
              max="20"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              className={inputClass}
              style={{ ...inputStyle, paddingRight: "2rem" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>%</span>
          </div>
          <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
            주택임대차보호법상 법정 상한 전환율은 연 4%입니다. 이를 초과하는 전환율은 무효입니다.
          </p>
        </div>
      </section>

      {/* 결과 */}
      {result !== null ? (
        <section
          className="rounded-2xl p-6 mb-6"
          style={{ border: "1px solid #B8860B", backgroundColor: "#F5EDD8" }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#B8860B" }}>
            전환 결과 (전환율 {rate}% 적용)
          </h3>
          {direction === "jeonse_to_monthly" && result.monthlyRent !== undefined && (
            <div className="text-center">
              <p className="text-sm mb-1" style={{ color: "#6B6B6B" }}>전환 월세</p>
              <p
                className="text-4xl font-bold tabular-nums"
                style={{ color: "#B8860B", fontFamily: "var(--font-serif)" }}
              >
                {formatKRW(result.monthlyRent)}
              </p>
              <p className="text-lg font-medium mt-1" style={{ color: "#1A1A1A" }}>원 / 월</p>
              <p className="text-xs mt-3" style={{ color: "#6B6B6B" }}>
                = (전세금 {formatKRW(jeonseDeposit)}원 - 보증금 {formatKRW(newDeposit)}원) × {rate}% ÷ 12
              </p>
            </div>
          )}
          {direction === "monthly_to_jeonse" && result.jeonseEquivalent !== undefined && (
            <div className="text-center">
              <p className="text-sm mb-1" style={{ color: "#6B6B6B" }}>전환 전세금</p>
              <p
                className="text-4xl font-bold tabular-nums"
                style={{ color: "#B8860B", fontFamily: "var(--font-serif)" }}
              >
                {formatKRW(result.jeonseEquivalent)}
              </p>
              <p className="text-lg font-medium mt-1" style={{ color: "#1A1A1A" }}>원</p>
              <p className="text-xs mt-3" style={{ color: "#6B6B6B" }}>
                = 보증금 {formatKRW(existingDeposit)}원 + (월세 {formatKRW(monthlyRent)}원 × 12 ÷ {rate}%)
              </p>
            </div>
          )}
        </section>
      ) : (
        <section
          className="rounded-2xl p-8 text-center text-sm mb-6"
          style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}
        >
          금액을 입력하면 전환 결과가 자동으로 계산됩니다.
        </section>
      )}

      {/* 제휴 배너 — 결과와 면책문구 사이 */}
      <AffiliateCTA slotKey="jeonwolse" className="my-6" />

      <p className="text-xs leading-relaxed text-center" style={{ color: "#6B6B6B" }}>
        본 계산 결과는 참고용이며 실제 계약 조건과 다를 수 있습니다.
        <br className="hidden sm:block" />
        법정 상한 전환율(4%)을 초과하는 전환은 무효입니다.
      </p>
    </main>
  );
}
