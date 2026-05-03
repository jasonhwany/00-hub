// ────────────────────────────────────────────────
// 양도소득세 상수 (2026년 4월 기준)
// ────────────────────────────────────────────────

export type HouseCount = "1" | "2" | "3plus";

// ── 장기보유특별공제 (일반) ──────────────────────
// 보유기간 3년 이상부터 적용, 1년 단위로 2%씩 증가
// 최대 15년 이상 → 30%
export interface LongTermDeductionEntry {
  minYears: number;   // 이상
  maxYears: number;   // 미만 (999: 상한 없음)
  rate: number;       // 소수 (0.06 = 6%)
}

export const LONG_TERM_DEDUCTION_GENERAL: LongTermDeductionEntry[] = [
  { minYears: 3,  maxYears: 4,   rate: 0.06 },
  { minYears: 4,  maxYears: 5,   rate: 0.08 },
  { minYears: 5,  maxYears: 6,   rate: 0.10 },
  { minYears: 6,  maxYears: 7,   rate: 0.12 },
  { minYears: 7,  maxYears: 8,   rate: 0.14 },
  { minYears: 8,  maxYears: 9,   rate: 0.16 },
  { minYears: 9,  maxYears: 10,  rate: 0.18 },
  { minYears: 10, maxYears: 11,  rate: 0.20 },
  { minYears: 11, maxYears: 12,  rate: 0.22 },
  { minYears: 12, maxYears: 13,  rate: 0.24 },
  { minYears: 13, maxYears: 14,  rate: 0.26 },
  { minYears: 14, maxYears: 15,  rate: 0.28 },
  { minYears: 15, maxYears: 999, rate: 0.30 },
];

// 1세대 1주택 보유공제율: 일반율 × 2, 상한 40%
export const ONEHOUSE_HOLD_RATE_MULTIPLIER = 2;
export const ONEHOUSE_HOLD_MAX_RATE = 0.40;

// 1세대 1주택 거주공제율: 거주연수 × 4%, 2년 이상 적용, 상한 40%
export const ONEHOUSE_RESIDE_RATE_PER_YEAR = 0.04;
export const ONEHOUSE_RESIDE_MIN_YEARS = 2;
export const ONEHOUSE_RESIDE_MAX_RATE = 0.40;

// 1세대 1주택 합산 최대 80%
export const ONEHOUSE_MAX_COMBINED_RATE = 0.80;

// ── 1세대 1주택 비과세 기준 ──────────────────────
export const NONTAX_THRESHOLD = 12_000_000_000 / 10; // 12억 원: 1_200_000_000
// (실제 12억)
export const NONTAX_PRICE_LIMIT = 1_200_000_000;

// ── 기본공제 ─────────────────────────────────────
export const BASIC_DEDUCTION = 2_500_000; // 연 250만원

// ── 일반세율 (누진세) ─────────────────────────────
export interface TaxBracket {
  min: number;        // 초과 기준 (이 금액 초과)
  max: number;        // 이하 기준 (999조: 상한 없음)
  rate: number;       // 세율 소수
  deduction: number;  // 누진공제 (원)
}

export const GENERAL_TAX_BRACKETS: TaxBracket[] = [
  { min: 0,              max: 14_000_000,  rate: 0.06, deduction: 0 },
  { min: 14_000_000,     max: 50_000_000,  rate: 0.15, deduction: 1_260_000 },
  { min: 50_000_000,     max: 88_000_000,  rate: 0.24, deduction: 5_760_000 },
  { min: 88_000_000,     max: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { min: 150_000_000,    max: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { min: 300_000_000,    max: 500_000_000, rate: 0.40, deduction: 25_940_000 },
  { min: 500_000_000,    max: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { min: 1_000_000_000,  max: Infinity,    rate: 0.45, deduction: 65_940_000 },
];

// ── 중과세율 추가분 ───────────────────────────────
export const HEAVY_TAX_2HOUSE = 0.20;   // 2주택: +20%p
export const HEAVY_TAX_3HOUSE = 0.30;   // 3주택 이상: +30%p

// ── 단기보유 세율 ─────────────────────────────────
export const SHORT_TERM_RATE_UNDER1Y = 0.70;  // 1년 미만 보유
export const SHORT_TERM_RATE_UNDER2Y = 0.60;  // 1년 이상 ~ 2년 미만

// ── 지방소득세 ────────────────────────────────────
export const LOCAL_INCOME_TAX_RATE = 0.10;    // 양도소득세의 10%
