export type HouseCount = "1" | "2" | "3plus" | "corp";

export const ADJUSTMENT_AREA_RATES: Record<HouseCount, number | null> = {
  "1": null,   // 1주택: 별도 누진 계산
  "2": 0.08,   // 조정지역 2주택: 8%
  "3plus": 0.12, // 조정지역 3주택 이상: 12%
  corp: 0.12,  // 법인: 12%
};

export const NON_ADJUSTMENT_RATES: Record<HouseCount, number | null> = {
  "1": null,   // 1주택: 별도 누진 계산
  "2": null,   // 비조정 2주택: 1~3% (1주택 기준과 동일)
  "3plus": 0.08, // 비조정 3주택: 8%
  corp: 0.12,  // 법인: 12%
};

// 1주택 / 비조정 2주택 구간 경계
export const BRACKET_LOW = 600_000_000;   // 6억
export const BRACKET_HIGH = 900_000_000;  // 9억
export const RATE_LOW = 0.01;             // 1%
export const RATE_HIGH = 0.03;            // 3%

// 부가세
export const LOCAL_EDU_TAX_RATE = 0.1;          // 지방교육세: 취득세의 10%
export const RURAL_SPECIAL_TAX_RATE = 0.1;      // 농어촌특별세: 취득세의 10%
export const RURAL_SPECIAL_TAX_AREA_LIMIT = 85; // 85㎡ 이하는 농특세 0
