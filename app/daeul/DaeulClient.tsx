"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  calcDaeul,
  formatKRW,
  formatManwon,
  type DaeulResult,
  type ScheduleRow,
} from "../../lib/daeul";
import {
  REPAYMENT_OPTIONS,
  PERIOD_UNIT_OPTIONS,
  PLACEHOLDER_AMOUNT,
  PLACEHOLDER_RATE,
  PLACEHOLDER_PERIOD,
  SCHEDULE_DEFAULT_ROWS,
  type RepaymentType,
} from "../../lib/daeul-constants";
import AdUnit from "../../components/AdUnit";

// ────────────────────────────────────────────────
// 도넛 차트 컴포넌트 (순수 SVG, 외부 라이브러리 불필요)
// ────────────────────────────────────────────────

function DonutChart({ principal, totalInterest }: { principal: number; totalInterest: number }) {
  const total = principal + totalInterest;
  if (total <= 0) return null;

  // 도넛 SVG 파라미터
  const SIZE = 200;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R = 78;       // 바깥 반지름
  const r = 50;       // 안쪽 반지름 (도넛 두께)
  const GAP = 2;      // 조각 사이 간격(도)

  // 각 조각 비율
  const principalRatio = principal / total;
  const interestRatio = totalInterest / total;
  const interestPct = ((totalInterest / principal) * 100).toFixed(1);

  // 각도를 SVG 좌표로 변환 (12시 방향 = -90도 기준)
  function polarToXY(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  // arc path 생성 (시작각, 끝각, 외반지름, 내반지름)
  function arcPath(startDeg: number, endDeg: number, outerR: number, innerR: number) {
    const start = startDeg + GAP / 2;
    const end = endDeg - GAP / 2;
    const largeArc = end - start > 180 ? 1 : 0;
    const o1 = polarToXY(start, outerR);
    const o2 = polarToXY(end, outerR);
    const i1 = polarToXY(end, innerR);
    const i2 = polarToXY(start, innerR);
    return [
      `M ${o1.x} ${o1.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
      `L ${i1.x} ${i1.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${i2.x} ${i2.y}`,
      "Z",
    ].join(" ");
  }

  const principalEndDeg = 360 * principalRatio;

  // interestRatio를 사용하여 lint 경고 방지
  void interestRatio;

  return (
    <div className="flex flex-col items-center gap-4 pt-4 pb-2">

      {/* 도넛 SVG */}
      <div className="relative" style={{ width: SIZE, height: SIZE, maxWidth: "100%" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          style={{ display: "block", maxWidth: "100%", height: "auto" }}
          aria-label={`원금 대비 이자 ${interestPct}% 도넛 차트`}
          role="img"
        >
          {/* 원금 조각 (파란 계열) */}
          <path d={arcPath(0, principalEndDeg, R, r)} fill="#3B82F6" />
          {/* 총이자 조각 (주황 계열) */}
          <path d={arcPath(principalEndDeg, 360, R, r)} fill="#F97316" />

          {/* 중앙 텍스트 */}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="#6B6B6B"
          >
            원금 대비 이자
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fontWeight="700"
            fill="#1A1A1A"
          >
            {interestPct}%
          </text>
        </svg>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: "#3B82F6" }} />
          <span style={{ color: "#6B6B6B" }}>원금</span>
          <span className="font-semibold tabular-nums" style={{ color: "#1A1A1A" }}>
            {formatManwon(principal)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: "#F97316" }} />
          <span style={{ color: "#6B6B6B" }}>총이자</span>
          <span className="font-semibold tabular-nums" style={{ color: "#1A1A1A" }}>
            {formatManwon(totalInterest)}
          </span>
        </div>
      </div>

    </div>
  );
}

const inputStyle = {
  backgroundColor: "#FAFAF7",
  border: "1px solid #E8E4DD",
  color: "#1A1A1A",
};

const activeBtn = { backgroundColor: "#B8860B", border: "1px solid #B8860B", color: "#FFFFFF" };
const inactiveBtn = { backgroundColor: "#FAFAF7", border: "1px solid #E8E4DD", color: "#1A1A1A" };

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
        backgroundColor: highlight ? "#F5EDD8" : "#F8F8F5",
        border: highlight ? "1px solid #B8860B" : "1px solid #E8E4DD",
      }}
    >
      <div>
        <span className="text-sm font-medium" style={{ color: highlight ? "#B8860B" : "#6B6B6B" }}>{label}</span>
        {sub && <span className="ml-2 text-xs" style={{ color: "#6B6B6B" }}>{sub}</span>}
      </div>
      <span
        className="font-semibold tabular-nums"
        style={{ color: highlight ? "#B8860B" : "#1A1A1A", fontSize: highlight ? "1.125rem" : "1rem" }}
      >
        {value}
      </span>
    </div>
  );
}

// ────────────────────────────────────────────────
// 상환방식 비교 테이블 컴포넌트
// ────────────────────────────────────────────────

function RepaymentCompareTable({
  principal,
  annualRate,
  months,
  selectedType,
}: {
  principal: number;
  annualRate: number;
  months: number;
  selectedType: RepaymentType;
}) {
  // 3가지 방식 동시 계산 (메모이제이션 불필요 — 부모에서 isValid 조건부 렌더링)
  let ep: DaeulResult | null = null;
  let epr: DaeulResult | null = null;
  let bl: DaeulResult | null = null;

  try {
    ep  = calcDaeul({ principal, annualRate, months, repaymentType: "equal-payment" });
    epr = calcDaeul({ principal, annualRate, months, repaymentType: "equal-principal" });
    bl  = calcDaeul({ principal, annualRate, months, repaymentType: "bullet" });
  } catch {
    return null;
  }

  if (!ep || !epr || !bl) return null;

  // 총이자 최소 방식 판별
  const minInterest = Math.min(ep.totalInterest, epr.totalInterest, bl.totalInterest);
  const isMinInterest = {
    "equal-payment":   ep.totalInterest  === minInterest,
    "equal-principal": epr.totalInterest === minInterest,
    "bullet":          bl.totalInterest  === minInterest,
  };

  // 컬럼 스타일 (선택된 방식 강조)
  function colStyle(type: RepaymentType): React.CSSProperties {
    return selectedType === type
      ? { backgroundColor: "#FEF9EC", borderLeft: "2px solid #B8860B", borderRight: "2px solid #B8860B" }
      : {};
  }

  function headerColStyle(type: RepaymentType): React.CSSProperties {
    return selectedType === type
      ? { backgroundColor: "#F5EDD8", borderLeft: "2px solid #B8860B", borderRight: "2px solid #B8860B", color: "#B8860B", fontWeight: 700 }
      : { color: "#6B6B6B" };
  }

  const fmt = (v: number) => v.toLocaleString("ko-KR") + "원";

  return (
    <section
      aria-label="상환방식 비교"
      className="rounded-2xl mb-6 overflow-hidden"
      style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}
    >
      {/* 섹션 헤더 */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ backgroundColor: "#F8F8F5", borderBottom: "1px solid #E8E4DD" }}
      >
        <span aria-hidden="true" className="text-base">📊</span>
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#6B6B6B" }}>
          상환방식 비교
        </h3>
      </div>

      {/* 테이블 가로 스크롤 (모바일) */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 360 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
              <th className="px-4 py-3 text-left font-medium w-28" style={{ color: "#6B6B6B" }}></th>
              {(["equal-payment", "equal-principal", "bullet"] as RepaymentType[]).map((type) => (
                <th
                  key={type}
                  className="px-4 py-3 text-center font-medium"
                  style={headerColStyle(type)}
                >
                  <span className="block">
                    {type === "equal-payment" ? "원리금균등" : type === "equal-principal" ? "원금균등" : "만기일시"}
                  </span>
                  {/* 선택 표시 */}
                  {selectedType === type && (
                    <span className="text-xs font-normal mt-0.5 block" style={{ color: "#B8860B" }}>
                      현재 선택
                    </span>
                  )}
                  {/* 이자 최소 뱃지 */}
                  {isMinInterest[type] && (
                    <span
                      className="inline-block text-xs px-1.5 py-0.5 rounded mt-1 font-medium"
                      style={{ backgroundColor: "#EAF4EE", color: "#2A6B4A" }}
                    >
                      이자 최소
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 월 상환금 행 */}
            <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
              <td className="px-4 py-3 font-medium" style={{ color: "#1A1A1A" }}>
                <span className="block">월 상환금</span>
                <span className="text-xs font-normal" style={{ color: "#6B6B6B" }}>첫달 기준</span>
              </td>
              <td className="px-4 py-3 text-center tabular-nums" style={{ color: "#1A1A1A", ...colStyle("equal-payment") }}>
                {fmt(ep.firstPayment)}
              </td>
              <td className="px-4 py-3 text-center tabular-nums" style={{ color: "#1A1A1A", ...colStyle("equal-principal") }}>
                <span className="block">{fmt(epr.firstPayment)}</span>
                <span className="text-xs" style={{ color: "#6B6B6B" }}>(점감)</span>
              </td>
              <td className="px-4 py-3 text-center tabular-nums" style={{ color: "#1A1A1A", ...colStyle("bullet") }}>
                {fmt(bl.firstPayment)}
              </td>
            </tr>

            {/* 총 이자 행 */}
            <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
              <td className="px-4 py-3 font-medium" style={{ color: "#1A1A1A" }}>총 이자</td>
              <td className="px-4 py-3 text-center tabular-nums" style={{ color: "#B8860B", ...colStyle("equal-payment") }}>
                {fmt(ep.totalInterest)}
              </td>
              <td className="px-4 py-3 text-center tabular-nums" style={{ color: "#B8860B", ...colStyle("equal-principal") }}>
                {fmt(epr.totalInterest)}
              </td>
              <td className="px-4 py-3 text-center tabular-nums" style={{ color: "#B8860B", ...colStyle("bullet") }}>
                {fmt(bl.totalInterest)}
              </td>
            </tr>

            {/* 총 상환금 행 (강조) */}
            <tr>
              <td className="px-4 py-3 font-semibold" style={{ color: "#1A1A1A" }}>총 상환금</td>
              <td
                className="px-4 py-3 text-center tabular-nums font-semibold"
                style={{
                  color: selectedType === "equal-payment" ? "#B8860B" : "#1A1A1A",
                  ...colStyle("equal-payment"),
                  borderBottom: selectedType === "equal-payment" ? "2px solid #B8860B" : undefined,
                }}
              >
                {fmt(ep.totalPayment)}
              </td>
              <td
                className="px-4 py-3 text-center tabular-nums font-semibold"
                style={{
                  color: selectedType === "equal-principal" ? "#B8860B" : "#1A1A1A",
                  ...colStyle("equal-principal"),
                  borderBottom: selectedType === "equal-principal" ? "2px solid #B8860B" : undefined,
                }}
              >
                {fmt(epr.totalPayment)}
              </td>
              <td
                className="px-4 py-3 text-center tabular-nums font-semibold"
                style={{
                  color: selectedType === "bullet" ? "#B8860B" : "#1A1A1A",
                  ...colStyle("bullet"),
                  borderBottom: selectedType === "bullet" ? "2px solid #B8860B" : undefined,
                }}
              >
                {fmt(bl.totalPayment)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 안내 텍스트 */}
      <p className="px-4 py-2.5 text-xs" style={{ color: "#6B6B6B", borderTop: "1px solid #E8E4DD", backgroundColor: "#FAFAF7" }}>
        원금균등 방식의 월 상환금은 매월 감소하며, 첫달 기준 금액을 표시합니다.
      </p>
    </section>
  );
}

function ScheduleTable({ schedule, repaymentType }: { schedule: ScheduleRow[]; repaymentType: RepaymentType }) {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll ? schedule : schedule.slice(0, SCHEDULE_DEFAULT_ROWS);

  return (
    <section aria-label="상환 스케줄" className="rounded-2xl overflow-hidden mb-6" style={{ border: "1px solid #E8E4DD" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#F8F8F5", borderBottom: "1px solid #E8E4DD" }}>
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#6B6B6B" }}>상환 스케줄</h3>
        <span className="text-xs" style={{ color: "#6B6B6B" }}>총 {schedule.length}회차</span>
      </div>

      <div className="overflow-x-auto" style={{ backgroundColor: "#FFFFFF" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#F8F8F5" }}>
              <th className="px-3 py-2.5 text-right font-medium w-12" style={{ color: "#6B6B6B" }}>회차</th>
              <th className="px-3 py-2.5 text-right font-medium" style={{ color: "#6B6B6B" }}>월상환금</th>
              <th className="px-3 py-2.5 text-right font-medium" style={{ color: "#6B6B6B" }}>원금</th>
              <th className="px-3 py-2.5 text-right font-medium" style={{ color: "#6B6B6B" }}>이자</th>
              <th className="px-3 py-2.5 text-right font-medium" style={{ color: "#6B6B6B" }}>잔여원금</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.month}
                className="tabular-nums"
                style={{
                  borderTop: "1px solid #E8E4DD",
                  backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAFAF7",
                }}
              >
                <td className="px-3 py-2.5 text-right" style={{ color: "#6B6B6B" }}>{row.month}</td>
                <td className="px-3 py-2.5 text-right font-medium" style={{ color: "#1A1A1A" }}>{formatKRW(row.payment)}</td>
                <td className="px-3 py-2.5 text-right" style={{ color: "#2A6B4A" }}>{formatKRW(row.principal)}</td>
                <td className="px-3 py-2.5 text-right" style={{ color: "#B8860B" }}>{formatKRW(row.interest)}</td>
                <td className="px-3 py-2.5 text-right" style={{ color: "#6B6B6B" }}>{formatKRW(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {schedule.length > SCHEDULE_DEFAULT_ROWS && (
        <div className="p-3 text-center" style={{ borderTop: "1px solid #E8E4DD" }}>
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-medium transition-colors"
            style={{ color: "#B8860B" }}
          >
            {showAll ? "접기" : `전체 보기 (${schedule.length - SCHEDULE_DEFAULT_ROWS}회차 더보기)`}
          </button>
        </div>
      )}
    </section>
  );
}

// URL 쿼리스트링 업데이트 (history를 쌓지 않음)
function updateURL(params: Record<string, string>) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  });
  window.history.replaceState({}, "", url.toString());
}

export default function DaeulPage() {
  const [amountInput, setAmountInput] = useState("");
  const [rateInput, setRateInput] = useState("");
  const [periodInput, setPeriodInput] = useState("");
  const [periodUnit, setPeriodUnit] = useState<"year" | "month">("year");
  const [repaymentType, setRepaymentType] = useState<RepaymentType>("equal-payment");
  const [copyDone, setCopyDone] = useState(false);

  // 결과 영역 스크롤용 ref
  const resultRef = useRef<HTMLElement>(null);

  // 최초 로드 시 URL 파라미터로 입력값 초기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = params.get("amount");
    const r = params.get("rate");
    const p = params.get("period");
    const u = params.get("unit");
    const t = params.get("type");
    if (a) setAmountInput(Number(a).toLocaleString("ko-KR"));
    if (r) setRateInput(r);
    if (p) setPeriodInput(p);
    if (u === "month" || u === "year") setPeriodUnit(u);
    if (t === "equal-payment" || t === "equal-principal" || t === "bullet") setRepaymentType(t);
  }, []);

  // 입력값 변경 시 URL 동기화
  const syncURL = useCallback((
    a: string, r: string, p: string, u: string, t: string
  ) => {
    updateURL({
      amount: a.replace(/,/g, ""),
      rate: r,
      period: p,
      unit: u,
      type: t,
    });
  }, []);

  const principal = Number(amountInput.replace(/,/g, "")) || 0;
  const annualRate = Number(rateInput) || 0;
  const periodRaw = Number(periodInput) || 0;
  const months = periodUnit === "year" ? periodRaw * 12 : periodRaw;
  const isValid = principal > 0 && annualRate > 0 && months > 0;

  const result: DaeulResult | null = useMemo(() => {
    if (!isValid) return null;
    try { return calcDaeul({ principal, annualRate, months, repaymentType }); }
    catch { return null; }
  }, [principal, annualRate, months, repaymentType, isValid]);

  // 결과 첫 생성 시 모바일에서만 자동 스크롤
  const prevResultRef = useRef<DaeulResult | null>(null);
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

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") {
      setAmountInput("");
      syncURL("", rateInput, periodInput, periodUnit, repaymentType);
      return;
    }
    const formatted = Number(raw).toLocaleString("ko-KR");
    setAmountInput(formatted);
    syncURL(formatted, rateInput, periodInput, periodUnit, repaymentType);
  }

  function getPaymentDisplay(r: DaeulResult): string {
    if (repaymentType === "bullet") return `${formatKRW(r.firstPayment)}원 (월이자)`;
    if (r.isFixedPayment) return `${formatKRW(r.firstPayment)}원`;
    return `${formatKRW(r.firstPayment)}원 ~ ${formatKRW(r.lastPayment)}원`;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">

      <a href="https://moneystom7.com" className="inline-flex items-center gap-1 text-sm transition-colors mb-8" style={{ color: "#6B6B6B" }}>
        <span aria-hidden="true">←</span>
        moneystom7.com으로 돌아가기
      </a>

      <div className="mb-4">
        <span className="inline-block text-xs px-3 py-1 rounded-full font-medium tracking-wide" style={{ backgroundColor: "#EAF4EE", color: "#2A6B4A" }}>
          2026년 4월 기준
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}>
        대출이자 계산기
      </h1>
      <h2 className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        원리금균등·원금균등·만기일시 상환 방식별 이자를 계산하세요
      </h2>

      <section className="rounded-2xl p-6 mb-6 space-y-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}>

        {/* 대출금액 */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>대출금액</label>
          <div className="relative">
            <input id="amount" type="text" inputMode="numeric" placeholder={PLACEHOLDER_AMOUNT}
              value={amountInput} onChange={handleAmountChange}
              className="w-full rounded-lg px-4 py-3 pr-8 focus:outline-none transition-colors" style={inputStyle} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
          {principal > 0 && <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>{formatManwon(principal)}</p>}
          {/* 대출금액 슬라이더: 1,000만원 ~ 20억원, step 500만원 */}
          <div className="mt-3">
            <input
              type="range"
              min={10_000_000}
              max={2_000_000_000}
              step={5_000_000}
              value={principal || 10_000_000}
              onChange={(e) => {
                const val = Number(e.target.value);
                const formatted = val.toLocaleString("ko-KR");
                setAmountInput(formatted);
                syncURL(formatted, rateInput, periodInput, periodUnit, repaymentType);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label="대출금액 슬라이더"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "#6B6B6B" }}>
              <span>1,000만원</span>
              <span>20억원</span>
            </div>
          </div>
        </div>

        {/* 연이율 */}
        <div>
          <label htmlFor="rate" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>연이율</label>
          <div className="relative">
            <input id="rate" type="number" inputMode="decimal" placeholder={PLACEHOLDER_RATE}
              value={rateInput} onChange={(e) => { setRateInput(e.target.value); syncURL(amountInput, e.target.value, periodInput, periodUnit, repaymentType); }} min="0" max="100" step="0.1"
              className="w-full rounded-lg px-4 py-3 pr-8 focus:outline-none transition-colors" style={inputStyle} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>%</span>
          </div>
          {/* 연이율 슬라이더: 1% ~ 20%, step 0.1 */}
          <div className="mt-3">
            <input
              type="range"
              min={1}
              max={20}
              step={0.1}
              value={annualRate || 1}
              onChange={(e) => { setRateInput(e.target.value); syncURL(amountInput, e.target.value, periodInput, periodUnit, repaymentType); }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label="연이율 슬라이더"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "#6B6B6B" }}>
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>
        </div>

        {/* 대출기간 */}
        <div>
          <span className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>대출기간</span>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input id="period" type="number" inputMode="numeric" placeholder={PLACEHOLDER_PERIOD}
                value={periodInput} onChange={(e) => { setPeriodInput(e.target.value); syncURL(amountInput, rateInput, e.target.value, periodUnit, repaymentType); }} min="1"
                className="w-full rounded-lg px-4 py-3 focus:outline-none transition-colors" style={inputStyle} />
            </div>
            <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #E8E4DD" }}>
              {PERIOD_UNIT_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => { setPeriodUnit(opt.value); syncURL(amountInput, rateInput, periodInput, opt.value, repaymentType); }}
                  className="px-4 py-3 text-sm font-medium transition-colors"
                  style={periodUnit === opt.value ? activeBtn : inactiveBtn}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {months > 0 && periodUnit === "year" && (
            <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>{months}개월</p>
          )}
          {/* 대출기간 슬라이더: 1년 ~ 40년, step 1년 (year 단위 고정) */}
          <div className="mt-3">
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={periodUnit === "year" ? (periodRaw || 1) : Math.max(1, Math.round(periodRaw / 12)) || 1}
              onChange={(e) => {
                const yearVal = Number(e.target.value);
                const newPeriod = periodUnit === "year" ? String(yearVal) : String(yearVal * 12);
                if (periodUnit === "year") {
                  setPeriodInput(String(yearVal));
                } else {
                  setPeriodInput(String(yearVal * 12));
                }
                syncURL(amountInput, rateInput, newPeriod, periodUnit, repaymentType);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label="대출기간 슬라이더"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "#6B6B6B" }}>
              <span>1년</span>
              <span>40년</span>
            </div>
          </div>
        </div>

        {/* 상환방식 */}
        <div>
          <fieldset>
            <legend className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>상환방식</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {REPAYMENT_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => { setRepaymentType(opt.value); syncURL(amountInput, rateInput, periodInput, periodUnit, opt.value); }}
                  className="py-3 px-3 rounded-lg text-sm font-medium transition-colors text-left"
                  style={repaymentType === opt.value ? activeBtn : inactiveBtn}>
                  <span className="block font-semibold">{opt.label}</span>
                  <span className="block text-xs mt-0.5" style={{ color: repaymentType === opt.value ? "rgba(255,255,255,0.8)" : "#6B6B6B" }}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {/* 결과 카드 */}
      {result ? (
        <section ref={resultRef} aria-label="계산 결과" className="rounded-2xl p-6 space-y-2.5 mb-6" style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#6B6B6B" }}>계산 결과</h3>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href).then(() => {
                  setCopyDone(true);
                  setTimeout(() => setCopyDone(false), 2000);
                });
              }}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ border: "1px solid #B8860B", color: copyDone ? "#FFFFFF" : "#B8860B", backgroundColor: copyDone ? "#B8860B" : "transparent" }}
            >
              {copyDone ? "✓ 링크 복사됨!" : "🔗 결과 공유하기"}
            </button>
          </div>
          <ResultRow
            label={repaymentType === "bullet" ? "월 납부 이자" : repaymentType === "equal-principal" ? "월 상환금 범위" : "월 상환금"}
            value={getPaymentDisplay(result)}
            sub={repaymentType === "bullet" ? `만기 일시 상환 ${formatKRW(principal)}원` : repaymentType === "equal-principal" ? "첫달 ~ 마지막달" : undefined}
          />
          <ResultRow label="총 이자" value={`${formatKRW(result.totalInterest)}원`}
            sub={principal > 0 && result.totalInterest > 0 ? `원금의 ${((result.totalInterest / principal) * 100).toFixed(1)}%` : undefined} />
          <div className="pt-1">
            <ResultRow label="총 상환금" value={`${formatKRW(result.totalPayment)}원`} highlight />
          </div>

          {/* 원금 vs 총이자 도넛 차트 */}
          <div className="pt-2" style={{ borderTop: "1px solid #E8E4DD" }}>
            <DonutChart principal={principal} totalInterest={result.totalInterest} />
          </div>
        </section>
      ) : (
        <section className="rounded-2xl p-8 text-center text-sm mb-6" style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}>
          대출금액, 연이율, 대출기간을 입력하면 이자가 자동으로 계산됩니다.
        </section>
      )}

      {/* 상환방식 비교 테이블 */}
      {isValid && <RepaymentCompareTable
        principal={principal}
        annualRate={annualRate}
        months={months}
        selectedType={repaymentType}
      />}

      {result && <ScheduleTable schedule={result.schedule} repaymentType={repaymentType} />}

      {/* 광고 — 스케줄 테이블과 면책문구 사이 */}
      <AdUnit slot="3821905648" className="my-6" />

      <p className="text-xs leading-relaxed text-center" style={{ color: "#6B6B6B" }}>
        본 계산 결과는 참고용이며 실제 납부금액과 다를 수 있습니다.
        <br className="hidden sm:block" />
        정확한 상환금액은 해당 금융기관에 문의하세요.
      </p>

    </main>
  );
}
