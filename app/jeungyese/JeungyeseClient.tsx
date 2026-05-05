'use client';

import { useState, useMemo } from "react";
import {
  calcJeungyese,
  getRelationLabel,
  formatKRW,
  type DonorRelation,
} from "../../lib/jeungyese";
import AdUnit from "../../components/AdUnit";

const RELATION_OPTIONS: { value: DonorRelation; label: string; deduction: string }[] = [
  { value: "spouse", label: "배우자", deduction: "6억 공제" },
  { value: "lineal_asc", label: "직계존속 (성년)", deduction: "5천만 공제" },
  { value: "lineal_asc_minor", label: "직계존속 (미성년)", deduction: "2천만 공제" },
  { value: "lineal_desc", label: "직계비속", deduction: "5천만 공제" },
  { value: "other_kin", label: "기타친족", deduction: "1천만 공제" },
  { value: "other", label: "타인", deduction: "공제 없음" },
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

export default function JeungyesePage() {
  const [giftInput, setGiftInput] = useState("");
  const [priorGiftInput, setPriorGiftInput] = useState("");
  const [relation, setRelation] = useState<DonorRelation>("lineal_desc");

  const giftAmount = Number(giftInput.replace(/,/g, "")) || 0;
  const priorGiftAmount = Number(priorGiftInput.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    if (giftAmount <= 0) return null;
    return calcJeungyese({ giftAmount, relation, priorGiftAmount });
  }, [giftAmount, relation, priorGiftAmount]);

  function handleMoneyInput(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setter(raw === "" ? "" : Number(raw).toLocaleString("ko-KR"));
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
        증여세 계산기
      </h1>
      <p className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        부동산·현금 증여 시 납부할 증여세를 미리 계산하세요
      </p>

      <section
        className="rounded-2xl p-6 mb-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        {/* 관계 선택 */}
        <div>
          <p className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
            수증자와의 관계
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {RELATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRelation(opt.value)}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left"
                style={{
                  backgroundColor: relation === opt.value ? "#B8860B" : "#F9F7F4",
                  color: relation === opt.value ? "#FFFFFF" : "#1A1A1A",
                  border: relation === opt.value ? "1px solid #B8860B" : "1px solid #E8E4DD",
                }}
              >
                <span className="block">{opt.label}</span>
                <span
                  className="block text-xs mt-0.5"
                  style={{ color: relation === opt.value ? "rgba(255,255,255,0.8)" : "#6B6B6B" }}
                >
                  {opt.deduction}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 증여 금액 */}
        <div>
          <label htmlFor="gift" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            이번 증여 금액
          </label>
          <div className="relative">
            <input
              id="gift"
              type="text"
              inputMode="numeric"
              placeholder="예: 100,000,000"
              value={giftInput}
              onChange={(e) => handleMoneyInput(e, setGiftInput)}
              className={inputClass}
              style={{ ...inputStyle, paddingRight: "2rem" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
          {giftAmount > 0 && (
            <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
              {Math.floor(giftAmount / 10_000).toLocaleString("ko-KR")}만원
            </p>
          )}
        </div>

        {/* 10년 내 사전증여액 */}
        <div>
          <label htmlFor="prior" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            10년 내 사전증여액
            <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(없으면 0 또는 빈칸)</span>
          </label>
          <div className="relative">
            <input
              id="prior"
              type="text"
              inputMode="numeric"
              placeholder="예: 20,000,000"
              value={priorGiftInput}
              onChange={(e) => handleMoneyInput(e, setPriorGiftInput)}
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
            계산 결과 — {getRelationLabel(relation)} 증여
          </h3>
          <ResultRow
            label="증여재산공제"
            value={`-${formatKRW(result.deductionAmount)}원`}
          />
          <ResultRow
            label="과세표준"
            value={`${formatKRW(result.taxBase)}원`}
          />
          <ResultRow
            label="산출세액"
            value={`${formatKRW(result.grossTax)}원`}
          />
          <ResultRow
            label="신고세액공제"
            value={`-${formatKRW(result.creditAmount)}원`}
            sub="3% (자진신고 시)"
          />
          <div className="pt-1">
            <ResultRow
              label="납부세액"
              value={`${formatKRW(result.finalTax)}원`}
              highlight
            />
          </div>
          {result.finalTax === 0 && (
            <p className="text-xs text-center pt-2" style={{ color: "#2A6B4A" }}>
              공제 한도 이내로 납부세액이 없습니다.
            </p>
          )}
        </section>
      ) : (
        <section
          className="rounded-2xl p-8 text-center text-sm mb-6"
          style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}
        >
          증여 금액을 입력하면 증여세가 자동으로 계산됩니다.
        </section>
      )}

      {/* 광고 — 결과와 면책문구 사이 */}
      <AdUnit slot="3821905648" className="my-6" />

      <p className="text-xs leading-relaxed text-center" style={{ color: "#6B6B6B" }}>
        본 계산 결과는 참고용이며 실제 납부세액과 다를 수 있습니다.
        <br className="hidden sm:block" />
        정확한 세액은 세무사 또는 관할 세무서에 문의하세요.
      </p>
    </main>
  );
}
