"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  calcTakdeukse,
  formatKRW,
  formatRate,
  type HouseCount,
} from "../../lib/takdeukse";
import FaqAccordion from "../../components/FaqAccordion";
import AffiliateCTA from "../../components/AffiliateCTA";

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

const TAKDEUKSE_FAQ = [
  {
    question: "취득세는 언제 납부해야 하나요?",
    answer:
      "취득일로부터 60일 이내에 납부해야 합니다. 상속은 상속개시일이 속하는 달의 말일부터 6개월, 증여는 취득일로부터 60일 이내입니다. 기한 내 미납 시 가산세(3%)가 부과됩니다.",
  },
  {
    question: "1세대 1주택자도 취득세를 내나요?",
    answer:
      "네, 1세대 1주택자도 취득세를 납부합니다. 다만 생애최초 주택 구입 시 200만원 한도로 취득세가 감면됩니다(2023년 기준). 주택 가액과 면적에 따라 감면 요건이 다를 수 있으니 관할 구청에 확인하세요.",
  },
  {
    question: "분양권을 취득할 때도 취득세를 내나요?",
    answer:
      "분양권 자체를 취득할 때는 취득세가 없습니다. 그러나 분양권을 유상으로 전매(매수)하는 경우 2021년 이후부터 취득세가 부과됩니다. 주택 완공 후 소유권 이전 시에는 별도로 취득세가 부과됩니다.",
  },
  {
    question: "농어촌특별세와 지방교육세는 무엇인가요?",
    answer:
      "농어촌특별세는 85㎡ 초과 주택 취득 시 취득세의 10%가 부과되는 국세입니다. 지방교육세는 취득세의 20%로 부과되는 지방세입니다. 두 세금 모두 취득세와 함께 납부합니다.",
  },
  {
    question: "다주택자 중과세율은 얼마인가요?",
    answer:
      "조정대상지역 내 2주택은 8%, 3주택 이상은 12%의 중과세율이 적용됩니다. 비조정대상지역은 2주택까지 일반세율, 3주택은 8%, 4주택 이상은 12%입니다. 2024년 이후 세율 변경이 있을 수 있으니 최신 국세청 고시를 확인하세요.",
  },
];

const HOUSE_COUNT_OPTIONS: { value: HouseCount; label: string }[] = [
  { value: "1", label: "1주택" },
  { value: "2", label: "2주택" },
  { value: "3plus", label: "3주택 이상" },
  { value: "corp", label: "법인" },
];

function ResultRow({
  label,
  value,
  rate,
  highlight,
}: {
  label: string;
  value: number;
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
      <div>
        <span className="text-sm font-medium" style={{ color: highlight ? "#B8860B" : "#6B6B6B" }}>
          {label}
        </span>
        {rate && (
          <span className="ml-2 text-xs" style={{ color: "#6B6B6B" }}>({rate})</span>
        )}
      </div>
      <span
        className="font-semibold tabular-nums"
        style={{ color: highlight ? "#B8860B" : "#1A1A1A", fontSize: highlight ? "1.125rem" : "1rem" }}
      >
        {formatKRW(value)}원
      </span>
    </div>
  );
}

export default function TakdeuksePage() {
  const [priceInput, setPriceInput] = useState("");
  const [houseCount, setHouseCount] = useState<HouseCount>("1");
  const [isAdjustmentArea, setIsAdjustmentArea] = useState(true);
  const [areaInput, setAreaInput] = useState("");
  const [copyDone, setCopyDone] = useState(false);

  // 결과 영역 스크롤용 ref
  const resultRef = useRef<HTMLElement>(null);

  // 최초 로드 시 URL 파라미터로 입력값 초기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pr = params.get("price");
    const hc = params.get("houseCount");
    const adj = params.get("adjustment");
    const ar = params.get("area");
    if (pr) setPriceInput(Number(pr).toLocaleString("ko-KR"));
    if (hc === "1" || hc === "2" || hc === "3plus" || hc === "corp") setHouseCount(hc);
    if (adj === "false") setIsAdjustmentArea(false);
    if (ar) setAreaInput(ar);
  }, []);

  // 입력값 변경 시 URL 동기화
  const syncURL = useCallback((
    pr: string, hc: string, adj: boolean, ar: string
  ) => {
    updateURL({
      price: pr.replace(/,/g, ""),
      houseCount: hc,
      adjustment: String(adj),
      area: ar,
    });
  }, []);

  const price = Number(priceInput.replace(/,/g, "")) || 0;
  const area = Number(areaInput) || 0;

  const showAdjustmentToggle = houseCount === "2" || houseCount === "3plus";

  const result = useMemo(() => {
    if (price <= 0 || area <= 0) return null;
    return calcTakdeukse({
      price,
      houseCount,
      isAdjustmentArea: showAdjustmentToggle ? isAdjustmentArea : false,
      area,
    });
  }, [price, houseCount, isAdjustmentArea, area, showAdjustmentToggle]);

  // 결과 첫 생성 시 모바일에서만 자동 스크롤
  const prevResultRef = useRef<ReturnType<typeof calcTakdeukse> | null>(null);
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

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") {
      setPriceInput("");
      syncURL("", houseCount, isAdjustmentArea, areaInput);
      return;
    }
    const formatted = Number(raw).toLocaleString("ko-KR");
    setPriceInput(formatted);
    syncURL(formatted, houseCount, isAdjustmentArea, areaInput);
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
          2026년 4월 기준
        </span>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}
      >
        취득세 계산기
      </h1>
      <h2 className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        주택 취득 시 납부할 취득세를 미리 계산하세요
      </h2>

      <section
        className="rounded-2xl p-6 mb-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        {/* 취득가액 */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            취득가액
          </label>
          <div className="relative">
            <input
              id="price"
              type="text"
              inputMode="numeric"
              placeholder="예: 500,000,000"
              value={priceInput}
              onChange={handlePriceChange}
              className="w-full rounded-lg px-4 py-3 pr-8 focus:outline-none transition-colors"
              style={{
                backgroundColor: "#FAFAF7",
                border: "1px solid #E8E4DD",
                color: "#1A1A1A",
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>
              원
            </span>
          </div>
          {price > 0 && (
            <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
              {Math.floor(price / 10_000).toLocaleString("ko-KR")}만원
            </p>
          )}
          {/* 취득가액 슬라이더: 1,000만원 ~ 50억원, step 1,000만원 */}
          <div className="mt-3">
            <input
              type="range"
              min={10_000_000}
              max={5_000_000_000}
              step={10_000_000}
              value={price || 10_000_000}
              onChange={(e) => {
                const val = Number(e.target.value);
                const formatted = val.toLocaleString("ko-KR");
                setPriceInput(formatted);
                syncURL(formatted, houseCount, isAdjustmentArea, areaInput);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label="취득가액 슬라이더"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "#6B6B6B" }}>
              <span>1,000만원</span>
              {/* 슬라이더 현재 값 중앙 표시 */}
              {price > 0 && (
                <span className="font-medium" style={{ color: "#B8860B" }}>
                  {price >= 100_000_000
                    ? `${(price / 100_000_000).toFixed(price % 100_000_000 === 0 ? 0 : 1)}억 원`
                    : `${Math.floor(price / 10_000).toLocaleString("ko-KR")}만 원`}
                </span>
              )}
              <span>50억원</span>
            </div>
          </div>
        </div>

        {/* 주택 수 */}
        <div>
          <fieldset>
            <legend className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
              주택 수 (취득 후 기준)
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {HOUSE_COUNT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setHouseCount(opt.value); syncURL(priceInput, opt.value, isAdjustmentArea, areaInput); }}
                  className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                  style={
                    houseCount === opt.value
                      ? { backgroundColor: "#B8860B", border: "1px solid #B8860B", color: "#FFFFFF" }
                      : { backgroundColor: "#FAFAF7", border: "1px solid #E8E4DD", color: "#1A1A1A" }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* 조정대상지역 */}
        {showAdjustmentToggle && (
          <div>
            <fieldset>
              <legend className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                조정대상지역 여부
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: true, label: "예 (조정대상지역)" },
                  { value: false, label: "아니오 (비조정지역)" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => { setIsAdjustmentArea(opt.value); syncURL(priceInput, houseCount, opt.value, areaInput); }}
                    className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={
                      isAdjustmentArea === opt.value
                        ? { backgroundColor: "#B8860B", border: "1px solid #B8860B", color: "#FFFFFF" }
                        : { backgroundColor: "#FAFAF7", border: "1px solid #E8E4DD", color: "#1A1A1A" }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {/* 전용면적 */}
        <div>
          <label htmlFor="area" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            전용면적
            <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>
              (농어촌특별세 계산에 사용됩니다)
            </span>
          </label>
          <div className="relative">
            <input
              id="area"
              type="number"
              inputMode="decimal"
              placeholder="예: 84.99"
              value={areaInput}
              onChange={(e) => { setAreaInput(e.target.value); syncURL(priceInput, houseCount, isAdjustmentArea, e.target.value); }}
              className="w-full rounded-lg px-4 py-3 pr-10 focus:outline-none transition-colors"
              style={{
                backgroundColor: "#FAFAF7",
                border: "1px solid #E8E4DD",
                color: "#1A1A1A",
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>
              ㎡
            </span>
          </div>
          {area > 0 && (
            <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
              약 {(area / 3.305785).toFixed(1)}평 &middot;{" "}
              {area > 85 ? "85㎡ 초과 — 농어촌특별세 부과" : "85㎡ 이하 — 농어촌특별세 면제"}
            </p>
          )}
        </div>
      </section>

      {/* 결과 카드 */}
      {result ? (
        <section
          ref={resultRef}
          aria-label="계산 결과"
          className="rounded-2xl p-6 space-y-2.5 mb-6"
          style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#6B6B6B" }}>
              계산 결과
            </h3>
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
          <ResultRow label="취득세" value={result.acquisitionTax} rate={formatRate(result.acquisitionRate)} />
          <ResultRow label="지방교육세" value={result.localEduTax} rate="취득세의 10%" />
          <ResultRow label="농어촌특별세" value={result.ruralSpecialTax} rate={area > 85 ? "취득세의 10%" : "85㎡ 이하 면제"} />
          <div className="pt-1">
            <ResultRow label="합계" value={result.total} highlight />
          </div>
        </section>
      ) : (
        <section
          className="rounded-2xl p-8 text-center text-sm mb-6"
          style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}
        >
          취득가액과 전용면적을 입력하면 세액이 자동으로 계산됩니다.
        </section>
      )}

      {/* 제휴 배너 — 결과와 FAQ 사이 */}
      <AffiliateCTA slotKey="takdeukse" className="my-6" />

      <FaqAccordion items={TAKDEUKSE_FAQ} />

      <p className="text-xs leading-relaxed text-center" style={{ color: "#6B6B6B" }}>
        본 계산 결과는 참고용이며 실제 납부세액과 다를 수 있습니다.
        <br className="hidden sm:block" />
        정확한 세액은 세무사 또는 관할 지방자치단체에 문의하세요.
      </p>

    </main>
  );
}
