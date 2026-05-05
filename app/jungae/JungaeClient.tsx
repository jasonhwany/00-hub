'use client';

import { useState, useMemo } from "react";
import { calcJungae, formatKRW, formatRate, type TransactionType } from "../../lib/jungae";
import AdUnit from "../../components/AdUnit";

const TRANSACTION_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "sale", label: "매매" },
  { value: "jeonse", label: "전세" },
  { value: "monthly", label: "월세" },
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
        {value}
      </span>
    </div>
  );
}

export default function JungaePage() {
  const [transactionType, setTransactionType] = useState<TransactionType>("sale");
  const [salePriceInput, setSalePriceInput] = useState("");
  const [depositInput, setDepositInput] = useState("");
  const [monthlyRentInput, setMonthlyRentInput] = useState("");

  function handleMoneyInput(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setter(raw === "" ? "" : Number(raw).toLocaleString("ko-KR"));
  }

  const salePrice = Number(salePriceInput.replace(/,/g, "")) || 0;
  const deposit = Number(depositInput.replace(/,/g, "")) || 0;
  const monthlyRent = Number(monthlyRentInput.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    return calcJungae({
      transactionType,
      salePrice: transactionType !== "monthly" ? salePrice : undefined,
      deposit: transactionType === "monthly" ? deposit : undefined,
      monthlyRent: transactionType === "monthly" ? monthlyRent : undefined,
    });
  }, [transactionType, salePrice, deposit, monthlyRent]);

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
          공인중개사법 시행규칙 기준
        </span>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}
      >
        중개수수료 계산기
      </h1>
      <p className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        매매·전세·월세 거래 시 법정 중개보수를 미리 계산하세요
      </p>

      <section
        className="rounded-2xl p-6 mb-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        {/* 거래 유형 */}
        <div>
          <p className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
            거래 유형
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TRANSACTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTransactionType(opt.value);
                  setSalePriceInput("");
                  setDepositInput("");
                  setMonthlyRentInput("");
                }}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: transactionType === opt.value ? "#B8860B" : "#F9F7F4",
                  color: transactionType === opt.value ? "#FFFFFF" : "#1A1A1A",
                  border: transactionType === opt.value ? "1px solid #B8860B" : "1px solid #E8E4DD",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 매매·전세: 거래금액 */}
        {(transactionType === "sale" || transactionType === "jeonse") && (
          <div>
            <label htmlFor="salePrice" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
              {transactionType === "sale" ? "매매 금액" : "전세 금액"}
            </label>
            <div className="relative">
              <input
                id="salePrice"
                type="text"
                inputMode="numeric"
                placeholder="예: 500,000,000"
                value={salePriceInput}
                onChange={(e) => handleMoneyInput(e, setSalePriceInput)}
                className={inputClass}
                style={{ ...inputStyle, paddingRight: "2rem" }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
            </div>
            {salePrice > 0 && (
              <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
                {Math.floor(salePrice / 10_000).toLocaleString("ko-KR")}만원
              </p>
            )}
          </div>
        )}

        {/* 월세: 보증금 + 월세 */}
        {transactionType === "monthly" && (
          <>
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
            <div
              className="rounded-lg px-4 py-3 text-xs"
              style={{ backgroundColor: "#F9F7F4", color: "#6B6B6B", border: "1px solid #E8E4DD" }}
            >
              환산가액 = 보증금 + (월세 × 100)
            </div>
          </>
        )}
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
          {transactionType === "monthly" && (
            <ResultRow
              label="환산가액"
              value={`${formatKRW(result.effectiveAmount)}원`}
              sub="보증금 + 월세×100"
            />
          )}
          <ResultRow
            label="상한 요율"
            value={formatRate(result.maxRate)}
          />
          <ResultRow
            label="중개보수 (VAT 별도)"
            value={`${formatKRW(result.commission)}원`}
          />
          <div className="pt-1">
            <ResultRow
              label="중개보수 (VAT 포함)"
              value={`${formatKRW(result.commissionWithVat)}원`}
              highlight
            />
          </div>
        </section>
      ) : (
        <section
          className="rounded-2xl p-8 text-center text-sm mb-6"
          style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}
        >
          거래 금액을 입력하면 중개수수료가 자동으로 계산됩니다.
        </section>
      )}

      {/* 상한 요율표 */}
      <section
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6B6B6B" }}>
          법정 상한 요율표
        </h3>
        <div className="space-y-1 text-xs" style={{ color: "#1A1A1A" }}>
          <div className="flex justify-between py-1" style={{ borderBottom: "1px solid #F0EDE8" }}>
            <span style={{ color: "#6B6B6B" }}>매매 5억 미만</span><span>0.4%</span>
          </div>
          <div className="flex justify-between py-1" style={{ borderBottom: "1px solid #F0EDE8" }}>
            <span style={{ color: "#6B6B6B" }}>매매 5억~9억 미만</span><span>0.5%</span>
          </div>
          <div className="flex justify-between py-1" style={{ borderBottom: "1px solid #F0EDE8" }}>
            <span style={{ color: "#6B6B6B" }}>매매 9억 이상</span><span>0.9%</span>
          </div>
          <div className="flex justify-between py-1" style={{ borderBottom: "1px solid #F0EDE8" }}>
            <span style={{ color: "#6B6B6B" }}>전세 3억 미만</span><span>0.3%</span>
          </div>
          <div className="flex justify-between py-1" style={{ borderBottom: "1px solid #F0EDE8" }}>
            <span style={{ color: "#6B6B6B" }}>전세 3억~6억 미만</span><span>0.4%</span>
          </div>
          <div className="flex justify-between py-1">
            <span style={{ color: "#6B6B6B" }}>전세 6억 이상</span><span>0.8%</span>
          </div>
        </div>
      </section>

      {/* 광고 — 요율표와 면책문구 사이 */}
      <AdUnit slot="3821905648" className="my-6" />

      <p className="text-xs leading-relaxed text-center" style={{ color: "#6B6B6B" }}>
        본 계산 결과는 참고용이며 실제 수수료는 협의에 따라 달라질 수 있습니다.
        <br className="hidden sm:block" />
        중개보수는 상한 요율 이내에서 협의로 결정됩니다.
      </p>
    </main>
  );
}
