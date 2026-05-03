import {
  HouseCount,
  ADJUSTMENT_AREA_RATES,
  NON_ADJUSTMENT_RATES,
  BRACKET_LOW,
  BRACKET_HIGH,
  RATE_LOW,
  RATE_HIGH,
  LOCAL_EDU_TAX_RATE,
  RURAL_SPECIAL_TAX_RATE,
  RURAL_SPECIAL_TAX_AREA_LIMIT,
} from "./takdeukse-constants";

export type { HouseCount };

export interface TakdeukseInput {
  price: number;          // 취득가액 (원)
  houseCount: HouseCount; // 취득 후 주택 수
  isAdjustmentArea: boolean; // 조정대상지역 여부
  area: number;           // 전용면적 (㎡)
}

export interface TakdeukseResult {
  acquisitionTax: number;     // 취득세
  acquisitionRate: number;    // 취득세율 (소수, e.g. 0.01)
  localEduTax: number;        // 지방교육세
  ruralSpecialTax: number;    // 농어촌특별세
  total: number;              // 합계
}

function calcProgressiveRate(price: number): number {
  if (price <= BRACKET_LOW) return RATE_LOW;
  if (price > BRACKET_HIGH) return RATE_HIGH;
  // 6억 초과 ~ 9억 이하 누진 공식
  return ((price * 2 - 600_000_000) / 30_000_000_000) * 100 / 100;
}

function calcAcquisitionRate(
  price: number,
  houseCount: HouseCount,
  isAdjustmentArea: boolean
): number {
  if (houseCount === "corp") return ADJUSTMENT_AREA_RATES.corp!;

  if (houseCount === "1") return calcProgressiveRate(price);

  if (isAdjustmentArea) {
    return ADJUSTMENT_AREA_RATES[houseCount]!;
  }

  // 비조정대상지역
  const nonAdjRate = NON_ADJUSTMENT_RATES[houseCount];
  if (nonAdjRate !== null) return nonAdjRate;
  // 비조정 2주택: 1주택과 동일 누진 계산
  return calcProgressiveRate(price);
}

export function calcTakdeukse(input: TakdeukseInput): TakdeukseResult {
  const { price, houseCount, isAdjustmentArea, area } = input;

  const acquisitionRate = calcAcquisitionRate(price, houseCount, isAdjustmentArea);
  const acquisitionTax = Math.floor(price * acquisitionRate);

  const localEduTax = Math.floor(acquisitionTax * LOCAL_EDU_TAX_RATE);

  const ruralSpecialTax =
    area > RURAL_SPECIAL_TAX_AREA_LIMIT
      ? Math.floor(acquisitionTax * RURAL_SPECIAL_TAX_RATE)
      : 0;

  const total = acquisitionTax + localEduTax + ruralSpecialTax;

  return {
    acquisitionTax,
    acquisitionRate,
    localEduTax,
    ruralSpecialTax,
    total,
  };
}

export function formatRate(rate: number): string {
  const pct = rate * 100;
  // 소수점이 있으면 최대 4자리까지, 없으면 정수
  return pct % 1 === 0 ? `${pct}%` : `${parseFloat(pct.toFixed(4))}%`;
}

export function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR");
}
