'use client';

import { useState, useMemo } from "react";
import { calcJongbu, formatKRW, type JongbuResult } from "../../lib/jongbu";
import AdUnit from "../../components/AdUnit";

const HOUSE_OPTIONS = [
  { value: 1, label: "1주택" },
  { value: 2, label: "2주택" },
  { value: 3, label: "3주택 이상" },
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

export default function JongbuPage() {
  const [totalPublicPrice, setTotalPublicPrice] = useState("");
  const [houseCount, setHouseCount] = useState(1);
  const [isAdjustmentArea, setIsAdjustmentArea] = useState(false);
  const [isSingleHousehold, setIsSingleHousehold] = useState(false);
  const [ownershipYears, setOwnershipYears] = useState("");
  const [ownerAge, setOwnerAge] = useState("");

  const price = Number(totalPublicPrice.replace(/,/g, "")) || 0;
  const years = Number(ownershipYears) || 0;
  const age = Number(ownerAge) || 0;

  const result: JongbuResult | null = useMemo(() => {
    if (price <= 0) return null;
    return calcJongbu({
      totalPublicPrice: price,
      houseCount,
      isAdjustmentArea: houseCount === 2 ? isAdjustmentArea : false,
      isSingleHousehold: houseCount === 1 ? isSingleHousehold : false,
      ownershipYears: years,
      ownerAge: age,
    });
  }, [price, houseCount, isAdjustmentArea, isSingleHousehold, years, age]);

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setTotalPublicPrice(raw === "" ? "" : Number(raw).toLocaleString("ko-KR"));
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
        종합부동산세 계산기
      </h1>
      <p className="text-base mb-10" style={{ color: "#6B6B6B" }}>
        보유 주택 공시가격 합산 기준 종부세를 미리 계산하세요
      </p>

      <section
        className="rounded-2xl p-6 mb-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        {/* 공시가격 합산 */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
            공시가격 합산
          </label>
          <div className="relative">
            <input
              id="price"
              type="text"
              inputMode="numeric"
              placeholder="예: 1,200,000,000"
              value={totalPublicPrice}
              onChange={handlePriceChange}
              className={inputClass}
              style={{ ...inputStyle, paddingRight: "2rem" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>원</span>
          </div>
          {price > 0 && (
            <p className="mt-1.5 text-xs" style={{ color: "#6B6B6B" }}>
              {Math.floor(price / 10_000).toLocaleString("ko-KR")}만원
            </p>
          )}
        </div>

        {/* 주택 수 */}
        <div>
          <p className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>주택 수</p>
          <div className="grid grid-cols-3 gap-2">
            {HOUSE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setHouseCount(opt.value)}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: houseCount === opt.value ? "#B8860B" : "#F9F7F4",
                  color: houseCount === opt.value ? "#FFFFFF" : "#1A1A1A",
                  border: houseCount === opt.value ? "1px solid #B8860B" : "1px solid #E8E4DD",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 조정대상지역 (2주택만) */}
        {houseCount === 2 && (
          <div>
            <p className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>조정대상지역 여부</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: true, label: "예 (조정대상지역)" },
                { value: false, label: "아니오 (비조정지역)" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setIsAdjustmentArea(opt.value)}
                  className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isAdjustmentArea === opt.value ? "#B8860B" : "#F9F7F4",
                    color: isAdjustmentArea === opt.value ? "#FFFFFF" : "#1A1A1A",
                    border: isAdjustmentArea === opt.value ? "1px solid #B8860B" : "1px solid #E8E4DD",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1세대 1주택 (1주택만) */}
        {houseCount === 1 && (
          <>
            <div>
              <p className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>1세대 1주택 여부</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: true, label: "예" },
                  { value: false, label: "아니오" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setIsSingleHousehold(opt.value)}
                    className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: isSingleHousehold === opt.value ? "#B8860B" : "#F9F7F4",
                      color: isSingleHousehold === opt.value ? "#FFFFFF" : "#1A1A1A",
                      border: isSingleHousehold === opt.value ? "1px solid #B8860B" : "1px solid #E8E4DD",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 1세대 1주택이면 보유기간·연령 입력 */}
            {isSingleHousehold && (
              <>
                <div>
                  <label htmlFor="years" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
                    보유기간
                    <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(장기보유 세액공제)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="years"
                      type="number"
                      min="0"
                      max="50"
                      placeholder="예: 10"
                      value={ownershipYears}
                      onChange={(e) => setOwnershipYears(e.target.value)}
                      className={inputClass}
                      style={{ ...inputStyle, paddingRight: "2rem" }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>년</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A1A" }}>
                    연령 (만 나이)
                    <span className="ml-1.5 text-xs font-normal" style={{ color: "#6B6B6B" }}>(고령자 세액공제)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="age"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="예: 65"
                      value={ownerAge}
                      onChange={(e) => setOwnerAge(e.target.value)}
                      className={inputClass}
                      style={{ ...inputStyle, paddingRight: "2rem" }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#6B6B6B" }}>세</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* 결과 */}
      {result !== null ? (
        result.total === 0 ? (
          <section
            className="rounded-2xl p-6 mb-6 text-center"
            style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}
          >
            <p className="text-sm font-medium" style={{ color: "#2A6B4A" }}>
              과세 대상 아님
            </p>
            <p className="text-xs mt-1" style={{ color: "#6B6B6B" }}>
              공시가격이 기본공제액({houseCount === 1 && isSingleHousehold ? "12억" : "9억"}) 이하입니다.
            </p>
          </section>
        ) : (
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
              sub="(공시가격-공제액)×60%"
            />
            <ResultRow
              label="종합부동산세 (산출)"
              value={formatKRW(result.jongbuTax)}
            />
            {result.totalCredit > 0 && (
              <ResultRow
                label="세액공제"
                value={`-${formatKRW(result.totalCredit)}`}
                sub={`고령자·장기보유 합산`}
              />
            )}
            <ResultRow
              label="종합부동산세"
              value={formatKRW(result.finalJongbu)}
            />
            <ResultRow
              label="농어촌특별세"
              value={formatKRW(result.ruralSpecialTax)}
              sub="종부세의 20%"
            />
            <div className="pt-1">
              <ResultRow
                label="합계"
                value={formatKRW(result.total)}
                highlight
              />
            </div>
          </section>
        )
      ) : (
        <section
          className="rounded-2xl p-8 text-center text-sm mb-6"
          style={{ border: "1px dashed #E8E4DD", color: "#6B6B6B" }}
        >
          공시가격을 입력하면 종합부동산세가 자동으로 계산됩니다.
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
