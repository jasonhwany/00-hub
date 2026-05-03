// 종합부동산세 계산기 — 2024년 기준

export type HouseType = "1" | "2" | "3plus" | "2adj";

export interface JongbuInput {
  totalPublicPrice: number;   // 공시가격 합산 (원)
  houseCount: number;         // 주택 수
  isAdjustmentArea: boolean;  // 조정대상지역 여부 (2주택 해당 시)
  isSingleHousehold: boolean; // 1세대 1주택 여부
  ownershipYears: number;     // 보유기간 (년)
  ownerAge: number;           // 연령 (만 나이)
}

export interface JongbuResult {
  taxBase: number;           // 과세표준
  jongbuTax: number;         // 종합부동산세
  ageTaxCredit: number;      // 고령자 세액공제
  longTermTaxCredit: number; // 장기보유 세액공제
  totalCredit: number;       // 세액공제 합계
  finalJongbu: number;       // 세액공제 후 종부세
  ruralSpecialTax: number;   // 농어촌특별세 (종부세의 20%)
  total: number;             // 최종 합계
}

// 공정시장가액비율 (2024년)
const MARKET_VALUE_RATIO = 0.60;

// 기본공제금액
const BASIC_DEDUCTION_SINGLE = 1_200_000_000; // 1세대 1주택 12억
const BASIC_DEDUCTION_OTHER = 900_000_000;    // 그 외 9억

// 세율 테이블
// 1주택 / 조정외 2주택: 동일 세율
const RATES_GENERAL = [
  { limit: 300_000_000,  rate: 0.005, deduction: 0 },
  { limit: 600_000_000,  rate: 0.007, deduction: 600_000 },
  { limit: 1_200_000_000, rate: 0.010, deduction: 2_400_000 },
  { limit: 5_000_000_000, rate: 0.014, deduction: 7_200_000 },
  { limit: 9_400_000_000, rate: 0.020, deduction: 37_200_000 },
  { limit: Infinity,     rate: 0.027, deduction: 103_000_000 },
];

// 3주택 이상 / 조정대상지역 2주택: 중과 세율
const RATES_HEAVY = [
  { limit: 300_000_000,  rate: 0.012, deduction: 0 },
  { limit: 600_000_000,  rate: 0.016, deduction: 1_200_000 },
  { limit: 1_200_000_000, rate: 0.022, deduction: 4_800_000 },
  { limit: 5_000_000_000, rate: 0.036, deduction: 21_600_000 },
  { limit: 9_400_000_000, rate: 0.050, deduction: 91_600_000 },
  { limit: Infinity,     rate: 0.050, deduction: 91_600_000 },
];

// 고령자 세액공제율 (1세대 1주택 단독 소유)
function getAgeCreditRate(age: number): number {
  if (age >= 70) return 0.30;
  if (age >= 65) return 0.20;
  if (age >= 60) return 0.10;
  return 0;
}

// 장기보유 세액공제율 (1세대 1주택 단독 소유)
function getLongTermCreditRate(years: number): number {
  if (years >= 15) return 0.50;
  if (years >= 10) return 0.40;
  if (years >= 5) return 0.20;
  return 0;
}

function calcTaxByRate(taxBase: number, isHeavy: boolean): number {
  const table = isHeavy ? RATES_HEAVY : RATES_GENERAL;
  for (const bracket of table) {
    if (taxBase <= bracket.limit) {
      return Math.floor(taxBase * bracket.rate - bracket.deduction);
    }
  }
  return 0;
}

export function calcJongbu(input: JongbuInput): JongbuResult | null {
  const {
    totalPublicPrice,
    houseCount,
    isAdjustmentArea,
    isSingleHousehold,
    ownershipYears,
    ownerAge,
  } = input;

  if (totalPublicPrice <= 0) return null;

  // 기본공제 적용
  const deduction = isSingleHousehold && houseCount === 1
    ? BASIC_DEDUCTION_SINGLE
    : BASIC_DEDUCTION_OTHER;

  const afterDeduction = totalPublicPrice - deduction;
  if (afterDeduction <= 0) {
    return {
      taxBase: 0,
      jongbuTax: 0,
      ageTaxCredit: 0,
      longTermTaxCredit: 0,
      totalCredit: 0,
      finalJongbu: 0,
      ruralSpecialTax: 0,
      total: 0,
    };
  }

  // 과세표준 = (공시가격 합계 - 기본공제) × 공정시장가액비율
  const taxBase = Math.floor(afterDeduction * MARKET_VALUE_RATIO);

  // 중과 여부 판단
  const isHeavy = houseCount >= 3 || (houseCount === 2 && isAdjustmentArea);

  const jongbuTax = Math.max(0, calcTaxByRate(taxBase, isHeavy));

  // 세액공제 (1세대 1주택 단독 소유자만 적용)
  let ageTaxCredit = 0;
  let longTermTaxCredit = 0;
  if (isSingleHousehold && houseCount === 1) {
    ageTaxCredit = Math.floor(jongbuTax * getAgeCreditRate(ownerAge));
    longTermTaxCredit = Math.floor(jongbuTax * getLongTermCreditRate(ownershipYears));
  }

  // 공제 합계 한도: 세액의 80%
  const maxCredit = Math.floor(jongbuTax * 0.80);
  const totalCredit = Math.min(ageTaxCredit + longTermTaxCredit, maxCredit);

  const finalJongbu = Math.max(0, jongbuTax - totalCredit);
  const ruralSpecialTax = Math.floor(finalJongbu * 0.20); // 농특세 20%
  const total = finalJongbu + ruralSpecialTax;

  return {
    taxBase,
    jongbuTax,
    ageTaxCredit,
    longTermTaxCredit,
    totalCredit,
    finalJongbu,
    ruralSpecialTax,
    total,
  };
}

export function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR");
}
