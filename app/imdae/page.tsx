'use client';

import { useState, useMemo } from "react";
import { calcImdae, formatKRW } from "../../lib/imdae";

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
        {value}
      </span>
    </div>
  );
}

export default function ImdaePage() {
  const [purchasePriceInput, setPurchasePriceInput] = useState("");
  const [depositInput, setDepositInput] = useState("");
  const [monthlyRentInput, setMonthlyRentInput] = useState("");
  const [annualExpenseInput, setAnnualExpenseInput] = useState("");

  function handleMoneyInput(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setter(raw === "" ? "" : Number(raw).toLocaleString("ko-KR"));
  }

  const purchasePrice = Number(purchasePriceInput.replace(/,/g, "")) || 0;
  const deposit = Number(depositInput.replace(/,/g, "")) || 0;
  const monthlyRent = Number(monthlyRentInput.replace(/,/g, "")) || 0;
  const annualExpense = Number(annualExpenseInput.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    return calcImdae({ purchasePrice, deposit, monthlyRent, annualExpense });
  }, [purchasePrice, deposit, monthlyRent, annualExpense]);

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
          부동산 투자 분석
        </span>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}
      >
        임대수익률 계산기
      </h1>
      <p className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        순투자금 대비 연 임대수익률과 전세가율을 계산하세요
      </p>

      <section
        className="rounded-2xl p-6 mb-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        {/* 매입가 */}
        <div>
          <label htmlFor="purchase" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            매입가
          </label>
          <div className="relative">
            <input
              id="purchase"
              type="text"
              inputMode="numeric"
              placeholder="예: 300,000,000"
              value={purchasePriceInput}
              onChange={(e) => handleMoneyInput(e, setPurchasePriceInput)}
              className={inputClass}
              style={{ ...inputStyle, paddingRight: "2rem" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
          {purchasePrice > 0 && (
            <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
              {Math.floor(purchasePrice / 10_000).toLocaleString("ko-KR")}만원
            </p>
          )}
        </div>

        {/* 보증금 */}
        <div>
          <label htmlFor="deposit" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            보증금
          </label>
          <div className="relative">
            <input
              id="deposit"
              type="text"
              inputMode="numeric"
              placeholder="예: 50,000,000"
              value={depositInput}
              onChange={(e) => handleMoneyInput(e, setDepositInput)}
              className={inputClass}
              style={{ ...inputStyle, paddingRight: "2rem" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
        </div>

        {/* 월세 */}
        <div>
          <label htmlFor="monthly" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            월세
          </label>
          <div className="relative">
            <input
              id="monthly"
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

        {/* 연간 관리비·수선비 (선택) */}
        <div>
          <label htmlFor="expense" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            연간 관리비·수선비
            <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(선택)</span>
          </label>
          <div className="relative">
            <input
              id="expense"
              type="text"
              inputMode="numeric"
              placeholder="예: 2,000,000"
              value={annualExpenseInput}
              onChange={(e) => handleMoneyInput(e, setAnnualExpenseInput)}
              className={inputClass}
              style={{ ...inputStyle, paddingRight: "2rem" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
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
            label="순투자금"
            value={`${formatKRW(result.netInvestment)}원`}
            sub="매입가 - 보증금"
          />
          <ResultRow
            label="연 임대수입"
            value={`${formatKRW(result.annualRentIncome)}원`}
            sub="월세×12"
          />
          <ResultRow
            label="연 순수익"
            value={`${formatKRW(result.annualNetIncome)}원`}
            sub="임대수입 - 연비용"
          />
          <div className="pt-1">
            <ResultRow
              label="임대수익률"
              value={`${result.yieldRate}%`}
              highlight
            />
          </div>
          <div className="pt-1">
            <ResultRow
              label="전세가율"
              value={`${result.jeonseRate}%`}
              sub="보증금/매입가"
            />
          </div>
        </section>
      ) : (
        <section
          className="rounded-2xl p-8 text-center text-sm mb-6"
          style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}
        >
          매입가·보증금·월세를 입력하면 수익률이 자동으로 계산됩니다.
        </section>
      )}

      <p className="text-xs leading-relaxed text-center" style={{ color: "#6B6B6B" }}>
        본 계산 결과는 참고용이며 실제 수익률과 다를 수 있습니다.
        <br className="hidden sm:block" />
        세금·공실·감가상각 등은 반영되지 않습니다.
      </p>
    </main>
  );
}
