// 재산세 계산기 — 2024년 기준

export type PropertyType = "house" | "land" | "building";

export interface JaesanseInput {
  propertyType: PropertyType;
  publicPrice: number; // 공시가격 (원)
}

export interface JaesanseResult {
  taxBase: number;          // 과세표준
  propertyTax: number;      // 재산세
  urbanAreaTax: number;     // 도시지역분 (과세표준의 0.14%)
  localEduTax: number;      // 지방교육세 (재산세의 20%)
  total: number;            // 합계
}

// 주택 공정시장가액비율 60%
const HOUSE_MARKET_RATIO = 0.60;
// 토지·건물 공정시장가액비율 70%
const LAND_BUILDING_MARKET_RATIO = 0.70;

// 주택 세율 테이블
const HOUSE_RATE_TABLE = [
  { limit: 60_000_000,   rate: 0.001, deduction: 0 },
  { limit: 150_000_000,  rate: 0.0015, deduction: 30_000 },
  { limit: 300_000_000,  rate: 0.0025, deduction: 180_000 },
  { limit: Infinity,     rate: 0.004, deduction: 630_000 },
];

// 일반 토지 세율 (종합합산)
const LAND_RATE_TABLE = [
  { limit: 50_000_000,   rate: 0.002, deduction: 0 },
  { limit: 1_000_000_000, rate: 0.003, deduction: 50_000 },
  { limit: Infinity,     rate: 0.005, deduction: 2_050_000 },
];

// 건물 세율 (단일)
const BUILDING_RATE = 0.0025;

function calcTaxFromTable(
  taxBase: number,
  table: { limit: number; rate: number; deduction: number }[]
): number {
  for (const bracket of table) {
    if (taxBase <= bracket.limit) {
      return Math.floor(taxBase * bracket.rate - bracket.deduction);
    }
  }
  return 0;
}

export function calcJaesanse(input: JaesanseInput): JaesanseResult | null {
  const { propertyType, publicPrice } = input;
  if (publicPrice <= 0) return null;

  let taxBase: number;
  let propertyTax: number;

  if (propertyType === "house") {
    taxBase = Math.floor(publicPrice * HOUSE_MARKET_RATIO);
    propertyTax = calcTaxFromTable(taxBase, HOUSE_RATE_TABLE);
  } else if (propertyType === "land") {
    taxBase = Math.floor(publicPrice * LAND_BUILDING_MARKET_RATIO);
    propertyTax = calcTaxFromTable(taxBase, LAND_RATE_TABLE);
  } else {
    // 건물
    taxBase = Math.floor(publicPrice * LAND_BUILDING_MARKET_RATIO);
    propertyTax = Math.floor(taxBase * BUILDING_RATE);
  }

  // 도시지역분: 과세표준의 0.14% (주택·토지·건물 공통)
  const urbanAreaTax = Math.floor(taxBase * 0.0014);

  // 지방교육세: 재산세의 20%
  const localEduTax = Math.floor(propertyTax * 0.20);

  const total = propertyTax + urbanAreaTax + localEduTax;

  return {
    taxBase,
    propertyTax,
    urbanAreaTax,
    localEduTax,
    total,
  };
}

export function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR");
}
