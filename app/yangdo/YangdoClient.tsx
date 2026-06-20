"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  calcYangdo,
  formatKRW,
  formatRate,
  formatManwon,
  type HouseCount,
} from "../../lib/yangdo";
import FaqAccordion from "../../components/FaqAccordion";
import AffiliateCTA from "../../components/AffiliateCTA";
import { useTrackResult } from "../../lib/useTrackResult";

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

const YANGDO_FAQ = [
  {
    question: "1세대 1주택 비과세란 무엇인가요?",
    answer:
      "1세대가 국내에 1주택만 보유하고 2년 이상 보유(조정대상지역은 2년 이상 거주도 필요)한 후 양도할 경우, 양도가액 12억원까지는 양도소득세가 비과세됩니다. 12억원 초과분에 대해서는 과세됩니다.",
  },
  {
    question: "장기보유특별공제란 무엇인가요?",
    answer:
      "부동산을 3년 이상 보유한 경우 양도차익에서 일정 비율을 공제해 주는 제도입니다. 1세대 1주택(거주요건 충족)은 보유기간 연 4% + 거주기간 연 4%로 최대 80%까지 공제됩니다. 일반 부동산은 보유기간 연 2%로 최대 30%까지 공제됩니다.",
  },
  {
    question: "양도소득세 필요경비에는 무엇이 포함되나요?",
    answer:
      "취득 시 납부한 취득세, 법무사 비용, 중개수수료가 포함됩니다. 또한 자본적 지출(발코니 확장, 시스템 에어컨 설치 등 구조 변경 공사비)도 포함됩니다. 단순 유지보수(도배, 장판 등) 비용은 제외됩니다.",
  },
  {
    question: "일시적 2주택 비과세 특례란?",
    answer:
      "기존 주택을 보유한 상태에서 새 주택을 취득한 경우, 새 주택 취득일로부터 3년 이내에 기존 주택을 양도하면 1세대 1주택으로 보아 비과세 혜택을 받을 수 있습니다. 조정대상지역 내 신규취득 시에는 요건이 다를 수 있습니다.",
  },
  {
    question: "양도소득세는 언제 신고·납부하나요?",
    answer:
      "양도일이 속하는 달의 말일부터 2개월 이내에 예정신고를 해야 합니다. 예정신고를 한 경우 확정신고는 생략할 수 있습니다. 신고 기한을 놓치면 무신고 가산세(20%)와 납부지연 가산세가 부과됩니다.",
  },
];

const inputStyle = {
  backgroundColor: "#FAFAF7",
  border: "1px solid #E8E4DD",
  color: "#1A1A1A",
};

function ResultRow({
  label,
  value,
  sub,
  highlight,
  minus,
}: {
  label: string;
  value: number | string;
  sub?: string;
  highlight?: boolean;
  minus?: boolean;
}) {
  const displayValue =
    typeof value === "number" ? `${formatKRW(value)}원` : value;

  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-lg"
      style={{
        backgroundColor: highlight ? "#F5EDD8" : "#F8F8F5",
        border: highlight ? "1px solid #B8860B" : "1px solid #E8E4DD",
      }}
    >
      <div>
        <span className="text-sm font-medium" style={{ color: highlight ? "#B8860B" : "#6B6B6B" }}>
          {label}
        </span>
        {sub && <span className="ml-2 text-xs" style={{ color: "#6B6B6B" }}>{sub}</span>}
      </div>
      <span
        className="font-semibold tabular-nums"
        style={{
          color: highlight ? "#B8860B" : minus ? "#B85C0B" : "#1A1A1A",
          fontSize: highlight ? "1.125rem" : "1rem",
        }}
      >
        {minus && typeof value === "number" && value > 0 ? "- " : ""}
        {displayValue}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #E8E4DD", margin: "4px 0" }} />;
}


const HOUSE_COUNT_OPTIONS: { value: HouseCount; label: string }[] = [
  { value: "1", label: "1주택" },
  { value: "2", label: "2주택" },
  { value: "3plus", label: "3주택 이상" },
];

const activeBtn = { backgroundColor: "#B8860B", border: "1px solid #B8860B", color: "#FFFFFF" };
const inactiveBtn = { backgroundColor: "#FAFAF7", border: "1px solid #E8E4DD", color: "#1A1A1A" };

// useMoneyInput에 외부 초기값 설정 기능 추가
function useMoneyInputWithSetter(init = "") {
  const [raw, setRaw] = useState(init);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    if (digits === "") { setRaw(""); return; }
    setRaw(Number(digits).toLocaleString("ko-KR"));
  }

  const value = Number(raw.replace(/,/g, "")) || 0;
  return { raw, setRaw, handleChange, value };
}

export default function YangdoPage() {
  const saleInput = useMoneyInputWithSetter();
  const acqInput = useMoneyInputWithSetter();
  const costInput = useMoneyInputWithSetter();

  const [holdingInput, setHoldingInput] = useState("");
  const holdingYears = Number(holdingInput) || 0;

  const [houseCount, setHouseCount] = useState<HouseCount>("1");
  const [isOneHousehold, setIsOneHousehold] = useState(true);
  const [meetsNonTaxReq, setMeetsNonTaxReq] = useState(false);
  const [residingInput, setResidingInput] = useState("");
  const residingYears = Number(residingInput) || 0;
  const [isAdjustmentArea, setIsAdjustmentArea] = useState(true);
  const [copyDone, setCopyDone] = useState(false);

  // 결과 영역 스크롤용 ref
  const resultRef = useRef<HTMLElement>(null);

  // 최초 로드 시 URL 파라미터로 입력값 초기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sale = params.get("sale");
    const acq = params.get("acq");
    const cost = params.get("cost");
    const holding = params.get("holding");
    const hc = params.get("houseCount");
    const oneHH = params.get("oneHousehold");
    const nonTax = params.get("nonTax");
    const residing = params.get("residing");
    const adj = params.get("adjustment");
    if (sale) saleInput.setRaw(Number(sale).toLocaleString("ko-KR"));
    if (acq) acqInput.setRaw(Number(acq).toLocaleString("ko-KR"));
    if (cost) costInput.setRaw(Number(cost).toLocaleString("ko-KR"));
    if (holding) setHoldingInput(holding);
    if (hc === "1" || hc === "2" || hc === "3plus") setHouseCount(hc);
    if (oneHH === "false") setIsOneHousehold(false);
    if (nonTax === "true") setMeetsNonTaxReq(true);
    if (residing) setResidingInput(residing);
    if (adj === "false") setIsAdjustmentArea(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 입력값 변경 시 URL 동기화
  const syncURL = useCallback((p: {
    sale?: string; acq?: string; cost?: string; holding?: string;
    houseCount?: string; oneHousehold?: boolean; nonTax?: boolean;
    residing?: string; adjustment?: boolean;
  }) => {
    updateURL({
      sale: (p.sale ?? saleInput.raw).replace(/,/g, ""),
      acq: (p.acq ?? acqInput.raw).replace(/,/g, ""),
      cost: (p.cost ?? costInput.raw).replace(/,/g, ""),
      holding: p.holding ?? holdingInput,
      houseCount: p.houseCount ?? houseCount,
      oneHousehold: String(p.oneHousehold ?? isOneHousehold),
      nonTax: String(p.nonTax ?? meetsNonTaxReq),
      residing: p.residing ?? residingInput,
      adjustment: String(p.adjustment ?? isAdjustmentArea),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleInput.raw, acqInput.raw, costInput.raw, holdingInput, houseCount, isOneHousehold, meetsNonTaxReq, residingInput, isAdjustmentArea]);

  const showOneHouseholdSection = houseCount === "1";
  const showAdjustmentSection = houseCount === "2" || houseCount === "3plus";

  const result = useMemo(() => {
    if (saleInput.value <= 0 || acqInput.value <= 0 || holdingYears <= 0) return null;
    return calcYangdo({
      salePrice: saleInput.value,
      acquisitionPrice: acqInput.value,
      necessaryCost: costInput.value,
      holdingYears,
      houseCount,
      isOneHousehold: showOneHouseholdSection ? isOneHousehold : false,
      meetsNonTaxReq: showOneHouseholdSection && isOneHousehold ? meetsNonTaxReq : false,
      residingYears: showOneHouseholdSection && isOneHousehold ? residingYears : 0,
      isAdjustmentArea: showAdjustmentSection ? isAdjustmentArea : false,
    });
  }, [saleInput.value, acqInput.value, costInput.value, holdingYears, houseCount, isOneHousehold, meetsNonTaxReq, residingYears, isAdjustmentArea, showOneHouseholdSection, showAdjustmentSection]);

  useTrackResult("yangdo", result);

  // 결과 첫 생성 시 모바일에서만 자동 스크롤
  const prevResultRef = useRef<ReturnType<typeof calcYangdo> | null>(null);
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

  function getRateLabel(): string {
    if (!result) return "";
    if (result.isShortTerm) return `단기보유 ${formatRate(result.appliedRate)} (고정)`;
    if (result.isHeavyTax) return `일반 ${formatRate(result.appliedRate)} + 중과 ${formatRate(result.heavyTaxExtra)}`;
    return formatRate(result.appliedRate);
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
        양도소득세 계산기
      </h1>
      <h2 className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        부동산 매도 시 예상 양도세를 미리 계산하세요
      </h2>

      <section className="rounded-2xl p-6 mb-6 space-y-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}>

        {/* 양도가액 */}
        <div>
          <label htmlFor="salePrice" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>양도가액</label>
          <div className="relative">
            <input id="salePrice" type="text" inputMode="numeric" placeholder="예: 1,000,000,000"
              value={saleInput.raw} onChange={(e) => { saleInput.handleChange(e); syncURL({ sale: e.target.value }); }}
              className="w-full rounded-lg px-4 py-3 pr-8 focus:outline-none transition-colors" style={inputStyle} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
          {saleInput.value > 0 && <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>{formatManwon(saleInput.value)}</p>}
        </div>

        {/* 취득가액 */}
        <div>
          <label htmlFor="acqPrice" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>취득가액</label>
          <div className="relative">
            <input id="acqPrice" type="text" inputMode="numeric" placeholder="예: 500,000,000"
              value={acqInput.raw} onChange={(e) => { acqInput.handleChange(e); syncURL({ acq: e.target.value }); }}
              className="w-full rounded-lg px-4 py-3 pr-8 focus:outline-none transition-colors" style={inputStyle} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
          {acqInput.value > 0 && <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>{formatManwon(acqInput.value)}</p>}
        </div>

        {/* 필요경비 */}
        <div>
          <label htmlFor="cost" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            필요경비
            <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(중개수수료·취득세·인테리어비 등, 선택)</span>
          </label>
          <div className="relative">
            <input id="cost" type="text" inputMode="numeric" placeholder="예: 10,000,000"
              value={costInput.raw} onChange={(e) => { costInput.handleChange(e); syncURL({ cost: e.target.value }); }}
              className="w-full rounded-lg px-4 py-3 pr-8 focus:outline-none transition-colors" style={inputStyle} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
        </div>

        {/* 보유기간 */}
        <div>
          <label htmlFor="holding" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>보유기간</label>
          <div className="relative">
            <input id="holding" type="number" inputMode="decimal" placeholder="예: 5"
              value={holdingInput} onChange={(e) => { setHoldingInput(e.target.value); syncURL({ holding: e.target.value }); }} min="0" step="0.5"
              className="w-full rounded-lg px-4 py-3 pr-8 focus:outline-none transition-colors" style={inputStyle} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>년</span>
          </div>
          {holdingYears > 0 && (
            <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
              {holdingYears < 1 ? "1년 미만 — 단기보유 70% 세율 적용"
                : holdingYears < 2 ? "1년 이상 2년 미만 — 단기보유 60% 세율 적용"
                : holdingYears < 3 ? "2년 이상 3년 미만 — 일반세율, 장기보유특별공제 미적용"
                : `${holdingYears}년 — 장기보유특별공제 적용 가능`}
            </p>
          )}
        </div>

        {/* 주택 수 */}
        <div>
          <fieldset>
            <legend className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>주택 수 (취득 후 기준)</legend>
            <div className="grid grid-cols-3 gap-2">
              {HOUSE_COUNT_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => { setHouseCount(opt.value); syncURL({ houseCount: opt.value }); }}
                  className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                  style={houseCount === opt.value ? activeBtn : inactiveBtn}>
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* 1세대 1주택 섹션 */}
        {showOneHouseholdSection && (
          <div className="space-y-4 pt-5" style={{ borderTop: "1px solid #E8E4DD" }}>
            <fieldset>
              <legend className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>1세대 1주택 여부</legend>
              <div className="grid grid-cols-2 gap-2">
                {[{ value: true, label: "예 (1세대 1주택)" }, { value: false, label: "아니오" }].map((opt) => (
                  <button key={String(opt.value)} type="button" onClick={() => { setIsOneHousehold(opt.value); syncURL({ oneHousehold: opt.value }); }}
                    className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={isOneHousehold === opt.value ? activeBtn : inactiveBtn}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {isOneHousehold && (
              <>
                <fieldset>
                  <legend className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
                    비과세 요건 충족 여부
                    <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(조정: 보유 2년+거주 2년 / 비조정: 보유 3년)</span>
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ value: true, label: "예 (충족)" }, { value: false, label: "아니오 (미충족)" }].map((opt) => (
                      <button key={String(opt.value)} type="button" onClick={() => { setMeetsNonTaxReq(opt.value); syncURL({ nonTax: opt.value }); }}
                        className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                        style={meetsNonTaxReq === opt.value ? activeBtn : inactiveBtn}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="residing" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
                    거주기간
                    <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(장기보유특별공제 거주공제 계산용)</span>
                  </label>
                  <div className="relative">
                    <input id="residing" type="number" inputMode="decimal" placeholder="예: 3"
                      value={residingInput} onChange={(e) => { setResidingInput(e.target.value); syncURL({ residing: e.target.value }); }} min="0" step="1"
                      className="w-full rounded-lg px-4 py-3 pr-8 focus:outline-none transition-colors" style={inputStyle} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>년</span>
                  </div>
                  {residingYears > 0 && (
                    <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
                      {residingYears < 2 ? "2년 미만 — 거주공제 미적용" : `거주공제 ${Math.min(residingYears * 4, 40)}% 적용`}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* 조정대상지역 (2주택 이상) */}
        {showAdjustmentSection && (
          <div className="pt-5" style={{ borderTop: "1px solid #E8E4DD" }}>
            <fieldset>
              <legend className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                조정대상지역 여부
                <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(중과세율 적용 여부)</span>
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {[{ value: true, label: "예 (조정대상지역)" }, { value: false, label: "아니오 (비조정지역)" }].map((opt) => (
                  <button key={String(opt.value)} type="button" onClick={() => { setIsAdjustmentArea(opt.value); syncURL({ adjustment: opt.value }); }}
                    className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={isAdjustmentArea === opt.value ? activeBtn : inactiveBtn}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </section>

      {/* 결과 카드 */}
      {result ? (
        result.isFullNonTax ? (
          <section
            ref={resultRef}
            aria-label="비과세 결과"
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: "#EAF4EE", border: "1px solid #2A6B4A" }}
          >
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href).then(() => {
                    setCopyDone(true);
                    setTimeout(() => setCopyDone(false), 2000);
                  });
                }}
                className="px-4 py-2 rounded-lg text-sm transition-colors"
                style={{ border: "1px solid #2A6B4A", color: copyDone ? "#FFFFFF" : "#2A6B4A", backgroundColor: copyDone ? "#2A6B4A" : "transparent" }}
              >
                {copyDone ? "✓ 링크 복사됨!" : "🔗 결과 공유하기"}
              </button>
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg mb-1" style={{ color: "#2A6B4A" }}>
                1세대 1주택 비과세 요건 충족
              </p>
              <p className="text-3xl font-bold tabular-nums" style={{ color: "#2A6B4A" }}>
                납부세액 0원
              </p>
              <p className="text-xs mt-3" style={{ color: "#2A6B4A" }}>
                양도가액 12억원 이하, 비과세 요건 충족 — 양도소득세 전액 면제
              </p>
            </div>
          </section>
        ) : (
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
            <ResultRow label="양도차익" value={result.capitalGain} />
            <ResultRow label="장기보유특별공제" value={result.longTermDeduction}
              sub={result.longTermDeductionRate > 0 ? formatRate(result.longTermDeductionRate) : result.isHeavyTax ? "중과 — 미적용" : result.isShortTerm ? "단기보유 — 미적용" : "보유 3년 미만 — 미적용"}
              minus={result.longTermDeduction > 0} />
            <ResultRow label="양도소득금액" value={result.transferIncome} />
            <Divider />
            <ResultRow label="기본공제" value={result.basicDeduction} sub="연 250만원" minus={result.basicDeduction > 0} />
            <ResultRow label="과세표준" value={result.taxableBase} />
            <Divider />
            <ResultRow label="적용세율" value={getRateLabel()}
              sub={result.isHeavyTax ? `조정대상지역 ${houseCount === "2" ? "2주택" : "3주택 이상"} 중과` : result.isShortTerm ? "단기보유 고정세율" : "일반 누진세율"} />
            <ResultRow label="양도소득세" value={result.transferTax} />
            <ResultRow label="지방소득세" value={result.localTax} sub="양도소득세의 10%" />
            <div className="pt-1">
              <ResultRow label="납부세액 합계" value={result.totalTax} highlight />
            </div>
          </section>
        )
      ) : (
        <section className="rounded-2xl p-8 text-center text-sm mb-6" style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}>
          양도가액, 취득가액, 보유기간을 입력하면 세액이 자동으로 계산됩니다.
        </section>
      )}

      {/* 제휴 배너 — 결과와 FAQ 사이 */}
      <AffiliateCTA slotKey="yangdo" className="my-6" />

      <FaqAccordion items={YANGDO_FAQ} />

      <p className="text-xs leading-relaxed text-center" style={{ color: "#6B6B6B" }}>
        본 계산 결과는 참고용이며 실제 납부세액과 다를 수 있습니다.
        <br className="hidden sm:block" />
        정확한 세액은 세무사 또는 관할 세무서에 문의하세요.
      </p>

    </main>
  );
}
