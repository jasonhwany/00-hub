"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { calcYeonbong, formatKRW, formatRate } from "../../lib/yeonbong";
import FaqAccordion from "../../components/FaqAccordion";
import AdUnit from "../../components/AdUnit";

function updateURL(params: Record<string, string>) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  });
  window.history.replaceState({}, "", url.toString());
}

const YEONBONG_FAQ = [
  {
    question: "연봉 실수령액은 어떻게 계산하나요?",
    answer:
      "연봉을 12로 나눈 월 세전 급여에서 4대 보험(국민연금 4.5%, 건강보험 3.545%, 장기요양보험 건강보험료×12.95%, 고용보험 0.9%)과 소득세, 지방소득세(소득세×10%)를 공제한 금액이 월 실수령액입니다.",
  },
  {
    question: "부양가족 수가 실수령액에 영향을 미치나요?",
    answer:
      "네, 부양가족 수(본인 포함)가 늘수록 인적공제가 늘어나 소득세가 줄어듭니다. 1인당 연 150만원씩 추가 공제됩니다.",
  },
  {
    question: "비과세 식대란 무엇인가요?",
    answer:
      "회사에서 지급하는 식대 중 월 20만원(연 240만원)까지는 비과세 처리됩니다. 식대가 급여에 포함된 경우 이 금액만큼 과세 대상 소득이 줄어들어 소득세가 감소합니다.",
  },
  {
    question: "국민연금 상한액이 있나요?",
    answer:
      "네, 국민연금은 기준소득월액 상한이 590만원입니다. 월급이 590만원을 초과해도 590만원 기준으로 계산되므로 최대 납부액은 월 265,500원입니다.",
  },
  {
    question: "실제 원천징수액과 계산기 결과가 다를 수 있나요?",
    answer:
      "네, 이 계산기는 2026년 간이세액표 기반의 추정치입니다. 실제 원천징수는 회사의 급여 계산 방식, 각종 비과세·공제 항목에 따라 다를 수 있습니다. 연말정산을 통해 최종 세액이 정산됩니다.",
  },
];

function DeductionRow({
  label,
  monthly,
  annual,
  rate,
  highlight,
}: {
  label: string;
  monthly: number;
  annual: number;
  rate?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-lg"
      style={{
        backgroundColor: highlight ? "#F5EDD8" : "#F8F8F5",
        border: highlight ? "1px solid #B8860B" : "1px solid #E8E4DD",
      }}
    >
      <div className="flex-1 min-w-0">
        <span
          className="text-sm font-medium"
          style={{ color: highlight ? "#B8860B" : "#6B6B6B" }}
        >
          {label}
        </span>
        {rate && (
          <span className="ml-2 text-xs" style={{ color: "#6B6B6B" }}>
            ({rate})
          </span>
        )}
      </div>
      <div className="text-right ml-4">
        <span
          className="font-semibold tabular-nums block"
          style={{
            color: highlight ? "#B8860B" : "#1A1A1A",
            fontSize: highlight ? "1.125rem" : "1rem",
          }}
        >
          {formatKRW(monthly)}원
        </span>
        <span className="text-xs tabular-nums" style={{ color: "#6B6B6B" }}>
          연 {formatKRW(annual)}원
        </span>
      </div>
    </div>
  );
}

// 연봉 구간 프리셋
const PRESETS = [
  { label: "3,000만", value: 30_000_000 },
  { label: "4,000만", value: 40_000_000 },
  { label: "5,000만", value: 50_000_000 },
  { label: "6,000만", value: 60_000_000 },
  { label: "8,000만", value: 80_000_000 },
  { label: "1억", value: 100_000_000 },
];

export default function YeonbongClient() {
  const [salaryInput, setSalaryInput] = useState("");
  const [dependents, setDependents] = useState(1);
  const [hasMealAllowance, setHasMealAllowance] = useState(true);
  const [hasPrivatePension, setHasPrivatePension] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  const resultRef = useRef<HTMLElement>(null);

  // URL 파라미터 초기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sal = params.get("salary");
    const dep = params.get("dependents");
    const meal = params.get("meal");
    const pension = params.get("pension");
    if (sal) setSalaryInput(Number(sal).toLocaleString("ko-KR"));
    if (dep) setDependents(Math.min(10, Math.max(1, Number(dep))));
    if (meal === "false") setHasMealAllowance(false);
    if (pension === "true") setHasPrivatePension(true);
  }, []);

  const syncURL = useCallback(
    (sal: string, dep: number, meal: boolean, pension: boolean) => {
      updateURL({
        salary: sal.replace(/,/g, ""),
        dependents: String(dep),
        meal: String(meal),
        pension: String(pension),
      });
    },
    []
  );

  const salary = Number(salaryInput.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    if (salary <= 0) return null;
    return calcYeonbong({
      annualSalary: salary,
      dependents,
      hasMealAllowance,
      hasPrivatePension,
    });
  }, [salary, dependents, hasMealAllowance, hasPrivatePension]);

  // 첫 결과 생성 시 모바일 스크롤
  const prevResultRef = useRef<ReturnType<typeof calcYeonbong> | null>(null);
  useEffect(() => {
    if (result !== null && prevResultRef.current === null && resultRef.current) {
      if (window.innerWidth < 768) {
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
    prevResultRef.current = result;
  }, [result]);

  function handleSalaryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") {
      setSalaryInput("");
      syncURL("", dependents, hasMealAllowance, hasPrivatePension);
      return;
    }
    const formatted = Number(raw).toLocaleString("ko-KR");
    setSalaryInput(formatted);
    syncURL(formatted, dependents, hasMealAllowance, hasPrivatePension);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <a
        href="https://moneystom7.com"
        className="inline-flex items-center gap-1 text-sm transition-colors mb-8"
        style={{ color: "#6B6B6B" }}
      >
        <span aria-hidden="true">←</span>
        moneystom7.com으로 돌아가기
      </a>

      <div className="mb-4">
        <span
          className="inline-block text-xs px-3 py-1 rounded-full font-medium tracking-wide"
          style={{ backgroundColor: "#EAF4EE", color: "#2A6B4A" }}
        >
          2026년 기준
        </span>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}
      >
        연봉 실수령액 계산기
      </h1>
      <p className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        4대 보험·소득세 공제 후 실제 월 수령액을 확인하세요
      </p>

      {/* 입력 섹션 */}
      <section
        className="rounded-2xl p-6 mb-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        {/* 연봉 입력 */}
        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "#1A1A1A" }}
          >
            연봉
          </label>

          {/* 프리셋 버튼 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => {
                  const formatted = p.value.toLocaleString("ko-KR");
                  setSalaryInput(formatted);
                  syncURL(formatted, dependents, hasMealAllowance, hasPrivatePension);
                }}
                className="text-xs px-3 py-1.5 rounded-full transition-colors"
                style={
                  salary === p.value
                    ? { backgroundColor: "#B8860B", color: "#FFFFFF", border: "1px solid #B8860B" }
                    : { backgroundColor: "#F9F6F1", color: "#6B6B6B", border: "1px solid #E8E4DD" }
                }
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              id="salary"
              type="text"
              inputMode="numeric"
              placeholder="예: 48,000,000"
              value={salaryInput}
              onChange={handleSalaryChange}
              className="w-full rounded-lg px-4 py-3 pr-8 focus:outline-none transition-colors"
              style={{
                backgroundColor: "#FAFAF7",
                border: "1px solid #E8E4DD",
                color: "#1A1A1A",
              }}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
              style={{ color: "#6B6B6B" }}
            >
              원
            </span>
          </div>

          {salary > 0 && (
            <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
              {salary >= 100_000_000
                ? `${(salary / 100_000_000).toFixed(salary % 100_000_000 === 0 ? 0 : 1)}억 원`
                : `${Math.floor(salary / 10_000).toLocaleString("ko-KR")}만 원`}
            </p>
          )}

          {/* 슬라이더 */}
          <div className="mt-3">
            <input
              type="range"
              min={10_000_000}
              max={200_000_000}
              step={1_000_000}
              value={salary || 30_000_000}
              onChange={(e) => {
                const val = Number(e.target.value);
                const formatted = val.toLocaleString("ko-KR");
                setSalaryInput(formatted);
                syncURL(formatted, dependents, hasMealAllowance, hasPrivatePension);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label="연봉 슬라이더"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "#6B6B6B" }}>
              <span>1,000만원</span>
              {salary > 0 && (
                <span className="font-medium" style={{ color: "#B8860B" }}>
                  {salary >= 100_000_000
                    ? `${(salary / 100_000_000).toFixed(1)}억 원`
                    : `${Math.floor(salary / 10_000).toLocaleString("ko-KR")}만 원`}
                </span>
              )}
              <span>2억원</span>
            </div>
          </div>
        </div>

        {/* 부양가족 수 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
            부양가족 수{" "}
            <span className="ml-1 text-xs font-normal" style={{ color: "#6B6B6B" }}>
              (본인 포함)
            </span>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const v = Math.max(1, dependents - 1);
                setDependents(v);
                syncURL(salaryInput, v, hasMealAllowance, hasPrivatePension);
              }}
              className="w-10 h-10 rounded-lg text-xl font-bold flex items-center justify-center transition-colors"
              style={{ border: "1px solid #E8E4DD", color: "#1A1A1A", backgroundColor: "#FAFAF7" }}
              aria-label="부양가족 수 감소"
            >
              -
            </button>
            <span
              className="w-12 text-center text-lg font-semibold tabular-nums"
              style={{ color: "#1A1A1A" }}
              aria-live="polite"
            >
              {dependents}명
            </span>
            <button
              type="button"
              onClick={() => {
                const v = Math.min(10, dependents + 1);
                setDependents(v);
                syncURL(salaryInput, v, hasMealAllowance, hasPrivatePension);
              }}
              className="w-10 h-10 rounded-lg text-xl font-bold flex items-center justify-center transition-colors"
              style={{ border: "1px solid #E8E4DD", color: "#1A1A1A", backgroundColor: "#FAFAF7" }}
              aria-label="부양가족 수 증가"
            >
              +
            </button>
            <span className="text-xs" style={{ color: "#6B6B6B" }}>
              1인당 연 150만원 추가 공제
            </span>
          </div>
        </div>

        {/* 비과세 식대 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
            비과세 식대 포함{" "}
            <span className="ml-1 text-xs font-normal" style={{ color: "#6B6B6B" }}>
              (월 20만원, 연 240만원)
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: true, label: "포함 (일반적)" },
              { value: false, label: "미포함" },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  setHasMealAllowance(opt.value);
                  syncURL(salaryInput, dependents, opt.value, hasPrivatePension);
                }}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                style={
                  hasMealAllowance === opt.value
                    ? { backgroundColor: "#B8860B", border: "1px solid #B8860B", color: "#FFFFFF" }
                    : { backgroundColor: "#FAFAF7", border: "1px solid #E8E4DD", color: "#1A1A1A" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 개인연금 공제 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
            개인연금 공제{" "}
            <span className="ml-1 text-xs font-normal" style={{ color: "#6B6B6B" }}>
              (연 400만원 한도)
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: true, label: "적용" },
              { value: false, label: "미적용" },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  setHasPrivatePension(opt.value);
                  syncURL(salaryInput, dependents, hasMealAllowance, opt.value);
                }}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                style={
                  hasPrivatePension === opt.value
                    ? { backgroundColor: "#B8860B", border: "1px solid #B8860B", color: "#FFFFFF" }
                    : { backgroundColor: "#FAFAF7", border: "1px solid #E8E4DD", color: "#1A1A1A" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      {result ? (
        <section
          ref={resultRef}
          aria-label="계산 결과"
          className="rounded-2xl p-6 space-y-2.5 mb-6"
          style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#6B6B6B" }}
            >
              계산 결과
            </h2>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href).then(() => {
                  setCopyDone(true);
                  setTimeout(() => setCopyDone(false), 2000);
                });
              }}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{
                border: "1px solid #B8860B",
                color: copyDone ? "#FFFFFF" : "#B8860B",
                backgroundColor: copyDone ? "#B8860B" : "transparent",
              }}
            >
              {copyDone ? "복사됨!" : "결과 공유하기"}
            </button>
          </div>

          {/* 월 실수령액 강조 */}
          <DeductionRow
            label="월 실수령액"
            monthly={result.monthlyNet}
            annual={result.annualNet}
            highlight
          />

          {/* 공제 내역 */}
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B6B6B" }}>
              월 공제 내역
            </p>
            <div className="space-y-2">
              <DeductionRow
                label="국민연금"
                monthly={result.monthlyNationalPension}
                annual={result.annualNationalPension}
                rate="4.5% (상한 590만원)"
              />
              <DeductionRow
                label="건강보험"
                monthly={result.monthlyHealthInsurance}
                annual={result.annualHealthInsurance}
                rate="3.545%"
              />
              <DeductionRow
                label="장기요양보험"
                monthly={result.monthlyLongTermCare}
                annual={result.annualLongTermCare}
                rate="건강보험료×12.95%"
              />
              <DeductionRow
                label="고용보험"
                monthly={result.monthlyEmploymentInsurance}
                annual={result.annualEmploymentInsurance}
                rate="0.9%"
              />
              <DeductionRow
                label="소득세"
                monthly={result.monthlyIncomeTax}
                annual={result.annualIncomeTax}
                rate="근로소득 간이세액표"
              />
              <DeductionRow
                label="지방소득세"
                monthly={result.monthlyLocalIncomeTax}
                annual={result.annualLocalIncomeTax}
                rate="소득세×10%"
              />
            </div>
          </div>

          {/* 합계 및 실효세율 */}
          <div className="pt-1 space-y-2">
            <DeductionRow
              label="총 공제액"
              monthly={result.monthlyTotalDeduction}
              annual={result.annualTotalDeduction}
            />
            <div
              className="flex items-center justify-between py-3 px-4 rounded-lg"
              style={{ backgroundColor: "#F9F6F1", border: "1px solid #E8E4DD" }}
            >
              <span className="text-sm font-medium" style={{ color: "#6B6B6B" }}>
                실효 공제율
              </span>
              <span className="font-semibold tabular-nums" style={{ color: "#1A1A1A" }}>
                {formatRate(result.effectiveRate)}
              </span>
            </div>
          </div>
        </section>
      ) : (
        <section
          className="rounded-2xl p-8 text-center text-sm mb-6"
          style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}
        >
          연봉을 입력하면 월 실수령액과 공제 내역이 자동으로 계산됩니다.
        </section>
      )}

      {/* 광고 — 결과와 FAQ 사이 */}
      <AdUnit slot="3821905648" className="my-6" />

      <FaqAccordion items={YEONBONG_FAQ} />

      <p
        className="text-xs leading-relaxed text-center"
        style={{ color: "#6B6B6B" }}
      >
        본 계산 결과는 2026년 기준 추정치이며 실제 원천징수액과 다를 수 있습니다.
        <br className="hidden sm:block" />
        정확한 급여 명세는 회사 급여 담당자 또는 세무사에 문의하세요.
      </p>
    </main>
  );
}
