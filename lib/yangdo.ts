import {
  HouseCount,
  LONG_TERM_DEDUCTION_GENERAL,
  ONEHOUSE_HOLD_RATE_MULTIPLIER,
  ONEHOUSE_HOLD_MAX_RATE,
  ONEHOUSE_RESIDE_RATE_PER_YEAR,
  ONEHOUSE_RESIDE_MIN_YEARS,
  ONEHOUSE_RESIDE_MAX_RATE,
  ONEHOUSE_MAX_COMBINED_RATE,
  NONTAX_PRICE_LIMIT,
  BASIC_DEDUCTION,
  GENERAL_TAX_BRACKETS,
  HEAVY_TAX_2HOUSE,
  HEAVY_TAX_3HOUSE,
  SHORT_TERM_RATE_UNDER1Y,
  SHORT_TERM_RATE_UNDER2Y,
  LOCAL_INCOME_TAX_RATE,
} from "./yangdo-constants";

export type { HouseCount };

// ────────────────────────────────────────────────
// 입력 타입
// ────────────────────────────────────────────────

export interface YangdoInput {
  /** 양도가액 (원) */
  salePrice: number;
  /** 취득가액 (원) */
  acquisitionPrice: number;
  /** 필요경비 (원, 0 가능) */
  necessaryCost: number;
  /** 보유기간 (년, 소수 허용) */
  holdingYears: number;
  /** 주택 수 */
  houseCount: HouseCount;
  /** 1세대 1주택 여부 (houseCount === "1" 일 때만 의미 있음) */
  isOneHousehold: boolean;
  /** 비과세 요건 충족 여부 (1세대 1주택일 때만) */
  meetsNonTaxReq: boolean;
  /** 거주기간 (년, 1세대 1주택 장기보유특별공제용) */
  residingYears: number;
  /** 조정대상지역 여부 (2주택 이상 중과 적용 여부) */
  isAdjustmentArea: boolean;
}

// ────────────────────────────────────────────────
// 출력 타입
// ────────────────────────────────────────────────

export interface YangdoResult {
  /** 비과세 완전 해당 여부 */
  isFullNonTax: boolean;
  /** 양도차익 */
  capitalGain: number;
  /** 장기보유특별공제율 */
  longTermDeductionRate: number;
  /** 장기보유특별공제액 */
  longTermDeduction: number;
  /** 양도소득금액 (= 과세 대상 양도차익 - 장기보유특별공제) */
  transferIncome: number;
  /** 기본공제 (250만원) */
  basicDeduction: number;
  /** 과세표준 */
  taxableBase: number;
  /** 적용 세율 (소수, 일반세율 기준) */
  appliedRate: number;
  /** 중과 여부 */
  isHeavyTax: boolean;
  /** 중과 추가세율 */
  heavyTaxExtra: number;
  /** 단기보유 세율 적용 여부 */
  isShortTerm: boolean;
  /** 양도소득세 */
  transferTax: number;
  /** 지방소득세 */
  localTax: number;
  /** 납부세액 합계 */
  totalTax: number;
}

// ────────────────────────────────────────────────
// 내부 헬퍼
// ────────────────────────────────────────────────

/** 일반 장기보유특별공제율 조회 */
function getGeneralLongTermRate(years: number): number {
  for (const entry of LONG_TERM_DEDUCTION_GENERAL) {
    if (years >= entry.minYears && years < entry.maxYears) {
      return entry.rate;
    }
  }
  return 0;
}

/**
 * 1세대 1주택 장기보유특별공제율 계산
 * 보유공제 + 거주공제, 합산 최대 80%
 */
function getOneHouseLongTermRate(holdingYears: number, residingYears: number): number {
  const baseRate = getGeneralLongTermRate(holdingYears);

  // 보유공제: 일반율 × 2, 최대 40%
  const holdRate = Math.min(baseRate * ONEHOUSE_HOLD_RATE_MULTIPLIER, ONEHOUSE_HOLD_MAX_RATE);

  // 거주공제: 거주연수 × 4%, 2년 이상만 적용, 최대 40%
  const resideRate =
    residingYears >= ONEHOUSE_RESIDE_MIN_YEARS
      ? Math.min(residingYears * ONEHOUSE_RESIDE_RATE_PER_YEAR, ONEHOUSE_RESIDE_MAX_RATE)
      : 0;

  return Math.min(holdRate + resideRate, ONEHOUSE_MAX_COMBINED_RATE);
}

/**
 * 누진세 계산 (일반세율 기준)
 * 반환: { tax, rate } — rate는 최고 구간 세율
 */
function calcProgressiveTax(taxableBase: number): { tax: number; rate: number } {
  if (taxableBase <= 0) return { tax: 0, rate: 0 };

  for (let i = GENERAL_TAX_BRACKETS.length - 1; i >= 0; i--) {
    const bracket = GENERAL_TAX_BRACKETS[i];
    if (taxableBase > bracket.min) {
      const tax = Math.floor(taxableBase * bracket.rate - bracket.deduction);
      return { tax: Math.max(0, tax), rate: bracket.rate };
    }
  }
  return { tax: 0, rate: GENERAL_TAX_BRACKETS[0].rate };
}

// ────────────────────────────────────────────────
// 메인 계산 함수
// ────────────────────────────────────────────────

export function calcYangdo(input: YangdoInput): YangdoResult {
  const {
    salePrice,
    acquisitionPrice,
    necessaryCost,
    holdingYears,
    houseCount,
    isOneHousehold,
    meetsNonTaxReq,
    residingYears,
    isAdjustmentArea,
  } = input;

  // ── Step 1. 양도차익 ────────────────────────────
  const rawCapitalGain = salePrice - acquisitionPrice - necessaryCost;
  // 양도차익이 음수(손실)이면 세액 없음
  if (rawCapitalGain <= 0) {
    return zeroResult(rawCapitalGain < 0 ? 0 : 0);
  }

  // ── Step 4. 1세대 1주택 비과세 처리 ────────────
  const isOne = houseCount === "1" && isOneHousehold;

  // 완전 비과세: 12억 이하 + 요건 충족
  if (isOne && meetsNonTaxReq && salePrice <= NONTAX_PRICE_LIMIT) {
    return {
      isFullNonTax: true,
      capitalGain: rawCapitalGain,
      longTermDeductionRate: 0,
      longTermDeduction: 0,
      transferIncome: 0,
      basicDeduction: 0,
      taxableBase: 0,
      appliedRate: 0,
      isHeavyTax: false,
      heavyTaxExtra: 0,
      isShortTerm: false,
      transferTax: 0,
      localTax: 0,
      totalTax: 0,
    };
  }

  // 12억 초과 1주택: 과세 양도차익 비율 계산
  let capitalGain = rawCapitalGain;
  if (isOne && meetsNonTaxReq && salePrice > NONTAX_PRICE_LIMIT) {
    // 과세 양도차익 = 양도차익 × (양도가액 - 12억) / 양도가액
    capitalGain = Math.floor(
      rawCapitalGain * (salePrice - NONTAX_PRICE_LIMIT) / salePrice
    );
  }

  // ── 단기보유 여부 판단 ───────────────────────────
  const isUnder1Year = holdingYears < 1;
  const isUnder2Year = holdingYears >= 1 && holdingYears < 2;
  const isShortTerm = isUnder1Year || isUnder2Year;

  // ── 중과 여부 판단 ───────────────────────────────
  // 단기보유이면 중과 미중복
  const isHeavyTax =
    !isShortTerm &&
    isAdjustmentArea &&
    (houseCount === "2" || houseCount === "3plus");

  // 중과 시 장기보유특별공제 미적용
  const canApplyLongTerm = !isHeavyTax && !isShortTerm;

  // ── Step 2. 장기보유특별공제 ────────────────────
  let longTermDeductionRate = 0;
  if (canApplyLongTerm && holdingYears >= 3) {
    if (isOne && meetsNonTaxReq) {
      longTermDeductionRate = getOneHouseLongTermRate(holdingYears, residingYears);
    } else {
      longTermDeductionRate = getGeneralLongTermRate(holdingYears);
    }
  }
  const longTermDeduction = Math.floor(capitalGain * longTermDeductionRate);

  // ── Step 3. 양도소득금액 ─────────────────────────
  const transferIncome = capitalGain - longTermDeduction;

  // ── Step 5. 기본공제 ─────────────────────────────
  const basicDeduction = Math.min(BASIC_DEDUCTION, transferIncome);
  const taxableBase = Math.max(0, transferIncome - basicDeduction);

  // ── Step 6 / 7 / 8. 세율 적용 ──────────────────
  let transferTax = 0;
  let appliedRate = 0;
  let heavyTaxExtra = 0;

  if (isShortTerm) {
    // 단기보유 고정세율
    const shortRate = isUnder1Year ? SHORT_TERM_RATE_UNDER1Y : SHORT_TERM_RATE_UNDER2Y;
    appliedRate = shortRate;
    transferTax = Math.floor(taxableBase * shortRate);
  } else if (isHeavyTax) {
    // 중과: 일반 누진세 계산 후 추가세율 적용
    const { tax: baseTax, rate: baseRate } = calcProgressiveTax(taxableBase);
    heavyTaxExtra =
      houseCount === "2" ? HEAVY_TAX_2HOUSE : HEAVY_TAX_3HOUSE;
    appliedRate = baseRate;
    // 중과 세액 = 일반 누진세액 + 과세표준 × 추가세율
    transferTax = Math.floor(baseTax + taxableBase * heavyTaxExtra);
  } else {
    // 일반 누진세율
    const { tax, rate } = calcProgressiveTax(taxableBase);
    appliedRate = rate;
    transferTax = tax;
  }

  // ── Step 9. 지방소득세 ───────────────────────────
  const localTax = Math.floor(transferTax * LOCAL_INCOME_TAX_RATE);
  const totalTax = transferTax + localTax;

  return {
    isFullNonTax: false,
    capitalGain,
    longTermDeductionRate,
    longTermDeduction,
    transferIncome,
    basicDeduction,
    taxableBase,
    appliedRate,
    isHeavyTax,
    heavyTaxExtra,
    isShortTerm,
    transferTax,
    localTax,
    totalTax,
  };
}

/** 양도차익 0 이하일 때 반환하는 빈 결과 */
function zeroResult(_capitalGain: number): YangdoResult {
  return {
    isFullNonTax: false,
    capitalGain: 0,
    longTermDeductionRate: 0,
    longTermDeduction: 0,
    transferIncome: 0,
    basicDeduction: 0,
    taxableBase: 0,
    appliedRate: 0,
    isHeavyTax: false,
    heavyTaxExtra: 0,
    isShortTerm: false,
    transferTax: 0,
    localTax: 0,
    totalTax: 0,
  };
}

// ────────────────────────────────────────────────
// 포맷 유틸
// ────────────────────────────────────────────────

/** 원화 포맷 (콤마 구분, 단위 없음) */
export function formatKRW(value: number): string {
  return Math.round(value).toLocaleString("ko-KR");
}

/** 퍼센트 포맷 (소수 → %, 불필요한 소수점 제거) */
export function formatRate(rate: number): string {
  const pct = rate * 100;
  return pct % 1 === 0 ? `${pct}%` : `${parseFloat(pct.toFixed(1))}%`;
}

/** 만원 단위 부가 설명 */
export function formatManwon(value: number): string {
  const manwon = Math.floor(value / 10_000);
  return `${manwon.toLocaleString("ko-KR")}만원`;
}
