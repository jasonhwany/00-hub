// 증여세 계산기 — 2024년 기준

export type DonorRelation =
  | "spouse"        // 배우자
  | "lineal_asc"    // 직계존속 (부모·조부모)
  | "lineal_asc_minor" // 직계존속 — 수증자 미성년
  | "lineal_desc"   // 직계비속 (자녀·손자녀)
  | "other_kin"     // 기타친족 (형제자매 등)
  | "other";        // 타인

export interface JeungyeseInput {
  giftAmount: number;         // 증여 금액 (원)
  relation: DonorRelation;    // 증여자와 수증자 관계
  priorGiftAmount: number;    // 10년 내 사전증여액 (원)
}

export interface JeungyeseResult {
  deductionAmount: number;   // 공제금액
  taxBase: number;           // 과세표준
  grossTax: number;          // 산출세액 (공제 전)
  creditAmount: number;      // 신고세액공제 (3%)
  finalTax: number;          // 납부세액
}

// 관계별 증여재산공제 (10년 합산)
const DEDUCTIONS: Record<DonorRelation, number> = {
  spouse: 600_000_000,       // 6억
  lineal_asc: 50_000_000,    // 5천만
  lineal_asc_minor: 20_000_000, // 2천만 (미성년)
  lineal_desc: 50_000_000,   // 5천만
  other_kin: 10_000_000,     // 1천만
  other: 0,
};

// 세율 테이블 (누진공제 방식)
const RATE_TABLE = [
  { limit: 100_000_000,  rate: 0.10, deduction: 0 },
  { limit: 500_000_000,  rate: 0.20, deduction: 10_000_000 },
  { limit: 1_000_000_000, rate: 0.30, deduction: 60_000_000 },
  { limit: 3_000_000_000, rate: 0.40, deduction: 160_000_000 },
  { limit: Infinity,     rate: 0.50, deduction: 460_000_000 },
];

function calcGrossTax(taxBase: number): number {
  if (taxBase <= 0) return 0;
  for (const bracket of RATE_TABLE) {
    if (taxBase <= bracket.limit) {
      return Math.floor(taxBase * bracket.rate - bracket.deduction);
    }
  }
  return 0;
}

export function calcJeungyese(input: JeungyeseInput): JeungyeseResult | null {
  const { giftAmount, relation, priorGiftAmount } = input;
  if (giftAmount <= 0) return null;

  // 10년 합산 금액
  const totalGift = giftAmount + (priorGiftAmount || 0);

  // 공제금액 (합산 기준으로 한도 적용)
  const maxDeduction = DEDUCTIONS[relation];
  const usableDeduction = Math.min(maxDeduction, totalGift);
  const deductionAmount = Math.max(0, usableDeduction - priorGiftAmount);

  // 과세표준 = (이번 증여액 - 이번에 사용 가능한 공제)
  const taxBase = Math.max(0, giftAmount - deductionAmount);

  const grossTax = calcGrossTax(taxBase);

  // 신고세액공제 3% (자진 신고 시)
  const creditAmount = Math.floor(grossTax * 0.03);
  const finalTax = Math.max(0, grossTax - creditAmount);

  return {
    deductionAmount,
    taxBase,
    grossTax,
    creditAmount,
    finalTax,
  };
}

export function getRelationLabel(relation: DonorRelation): string {
  const labels: Record<DonorRelation, string> = {
    spouse: "배우자",
    lineal_asc: "직계존속 (성년)",
    lineal_asc_minor: "직계존속 (미성년)",
    lineal_desc: "직계비속",
    other_kin: "기타친족",
    other: "타인",
  };
  return labels[relation];
}

export function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR");
}
