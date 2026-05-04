/**
 * 연봉 실수령액 계산 모듈
 * 기준: 2026년 근로소득 간이세액표, 4대 보험 요율
 *
 * 4대 보험 요율 (2026년 기준, 근로자 부담분)
 * - 국민연금: 4.5%
 * - 건강보험: 3.545%
 * - 장기요양보험: 건강보험료 × 12.95%
 * - 고용보험: 0.9%
 *
 * 소득세: 근로소득 간이세액표 간소화 공식 적용
 * 지방소득세: 소득세의 10%
 */

// ── 4대 보험 요율 ──────────────────────────────────────────
export const INSURANCE_RATES = {
  nationalPension: 0.045,        // 국민연금 4.5% (월 소득 590만원 상한)
  healthInsurance: 0.03545,      // 건강보험 3.545%
  longTermCare: 0.1295,          // 장기요양보험 (건강보험료 × 12.95%)
  employmentInsurance: 0.009,    // 고용보험 0.9%
} as const;

// 국민연금 월 기준소득월액 상한: 5,900,000원
const NP_MAX_MONTHLY = 5_900_000;

// ── 근로소득세 간이세액표 (월 급여 구간별, 부양가족 수 고려) ──
// 실제 간이세액표를 단순화한 공식 기반 근사치
// 출처: 국세청 근로소득 간이세액표(조견표) 2024~2026년 적용
//
// 과세표준 계산:
// 1. 월 급여에서 비과세(식대) 공제
// 2. 근로소득공제 적용
// 3. 인적공제 (1인 150만원/년, 본인 포함) 적용
// 4. 연간 과세표준에 세율 적용
// 5) 간이세액표는 이를 월 단위로 역산한 표

// 근로소득공제 함수 (연간 총급여 기준)
function calcLaborDeduction(annualSalary: number): number {
  if (annualSalary <= 5_000_000) return annualSalary * 0.7;
  if (annualSalary <= 15_000_000) return 3_500_000 + (annualSalary - 5_000_000) * 0.4;
  if (annualSalary <= 45_000_000) return 7_500_000 + (annualSalary - 15_000_000) * 0.15;
  if (annualSalary <= 100_000_000) return 12_000_000 + (annualSalary - 45_000_000) * 0.05;
  return 14_750_000 + (annualSalary - 100_000_000) * 0.02;
}

// 종합소득세 세율 적용 (연간 과세표준)
function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 14_000_000) return taxableIncome * 0.06;
  if (taxableIncome <= 50_000_000)
    return 840_000 + (taxableIncome - 14_000_000) * 0.15;
  if (taxableIncome <= 88_000_000)
    return 6_240_000 + (taxableIncome - 50_000_000) * 0.24;
  if (taxableIncome <= 150_000_000)
    return 15_360_000 + (taxableIncome - 88_000_000) * 0.35;
  if (taxableIncome <= 300_000_000)
    return 37_060_000 + (taxableIncome - 150_000_000) * 0.38;
  if (taxableIncome <= 500_000_000)
    return 94_060_000 + (taxableIncome - 300_000_000) * 0.40;
  if (taxableIncome <= 1_000_000_000)
    return 174_060_000 + (taxableIncome - 500_000_000) * 0.42;
  return 384_060_000 + (taxableIncome - 1_000_000_000) * 0.45;
}

export interface YeonbongInput {
  annualSalary: number;        // 연봉 (원)
  dependents: number;          // 부양가족 수 (본인 포함, 1~10)
  hasMealAllowance: boolean;   // 비과세 식대 월 20만원 포함 여부
  hasPrivatePension: boolean;  // 개인연금 공제 (연 400만원) 여부
}

export interface YeonbongResult {
  // 월별
  monthlyGross: number;          // 월 세전 급여
  monthlyNationalPension: number;  // 월 국민연금
  monthlyHealthInsurance: number;  // 월 건강보험
  monthlyLongTermCare: number;     // 월 장기요양보험
  monthlyEmploymentInsurance: number; // 월 고용보험
  monthlyIncomeTax: number;        // 월 소득세
  monthlyLocalIncomeTax: number;   // 월 지방소득세
  monthlyTotalDeduction: number;   // 월 총 공제액
  monthlyNet: number;              // 월 실수령액

  // 연간
  annualNationalPension: number;
  annualHealthInsurance: number;
  annualLongTermCare: number;
  annualEmploymentInsurance: number;
  annualIncomeTax: number;
  annualLocalIncomeTax: number;
  annualTotalDeduction: number;
  annualNet: number;

  // 세율 정보
  effectiveRate: number;  // 실효세율 (총 공제 / 연봉)
}

export function calcYeonbong(input: YeonbongInput): YeonbongResult {
  const { annualSalary, dependents, hasMealAllowance, hasPrivatePension } = input;

  // 월 세전 급여
  const monthlyGross = Math.floor(annualSalary / 12);

  // ── 4대 보험 계산 ─────────────────────────────────────────
  // 국민연금: 월 소득 기준, 상한 590만원
  const npBase = Math.min(monthlyGross, NP_MAX_MONTHLY);
  const monthlyNationalPension = Math.floor(npBase * INSURANCE_RATES.nationalPension);

  // 건강보험: 월 세전 급여 기준
  const monthlyHealthInsurance = Math.floor(monthlyGross * INSURANCE_RATES.healthInsurance);

  // 장기요양보험: 건강보험료 기준
  const monthlyLongTermCare = Math.floor(monthlyHealthInsurance * INSURANCE_RATES.longTermCare);

  // 고용보험
  const monthlyEmploymentInsurance = Math.floor(monthlyGross * INSURANCE_RATES.employmentInsurance);

  // ── 소득세 계산 ────────────────────────────────────────────
  // 과세 대상 연봉 = 연봉 - 비과세 식대(연 240만원 if 해당)
  const mealDeduction = hasMealAllowance ? 2_400_000 : 0;
  const taxableAnnualSalary = annualSalary - mealDeduction;

  // 근로소득공제
  const laborDeduction = calcLaborDeduction(taxableAnnualSalary);

  // 근로소득금액
  const laborIncome = taxableAnnualSalary - laborDeduction;

  // 인적공제: 1인당 150만원 (본인 포함, 최소 1)
  const personalDeduction = Math.max(1, dependents) * 1_500_000;

  // 개인연금 소득공제 (연 400만원 한도, 납입액의 100%)
  const privatePensionDeduction = hasPrivatePension ? 4_000_000 : 0;

  // 과세표준
  const taxableIncome = Math.max(0, laborIncome - personalDeduction - privatePensionDeduction);

  // 연간 소득세 산출
  let annualIncomeTax = calcIncomeTax(taxableIncome);

  // 근로소득세액공제: 산출세액 130만원 이하 55%, 130만원 초과 분 30% (한도 66만원)
  let taxCredit = 0;
  if (annualIncomeTax <= 1_300_000) {
    taxCredit = Math.floor(annualIncomeTax * 0.55);
  } else {
    taxCredit = Math.floor(1_300_000 * 0.55 + (annualIncomeTax - 1_300_000) * 0.30);
  }
  taxCredit = Math.min(taxCredit, 660_000);
  annualIncomeTax = Math.max(0, annualIncomeTax - taxCredit);

  const monthlyIncomeTax = Math.floor(annualIncomeTax / 12);
  const monthlyLocalIncomeTax = Math.floor(monthlyIncomeTax * 0.1);

  // ── 월별 집계 ───────────────────────────────────────────────
  const monthlyTotalDeduction =
    monthlyNationalPension +
    monthlyHealthInsurance +
    monthlyLongTermCare +
    monthlyEmploymentInsurance +
    monthlyIncomeTax +
    monthlyLocalIncomeTax;

  const monthlyNet = monthlyGross - monthlyTotalDeduction;

  // ── 연간 집계 ───────────────────────────────────────────────
  const annualNationalPension = monthlyNationalPension * 12;
  const annualHealthInsurance = monthlyHealthInsurance * 12;
  const annualLongTermCare = monthlyLongTermCare * 12;
  const annualEmploymentInsurance = monthlyEmploymentInsurance * 12;
  const annualLocalIncomeTax = monthlyLocalIncomeTax * 12;
  const annualTotalDeduction = monthlyTotalDeduction * 12;
  const annualNet = annualSalary - annualTotalDeduction;

  const effectiveRate = annualSalary > 0 ? annualTotalDeduction / annualSalary : 0;

  return {
    monthlyGross,
    monthlyNationalPension,
    monthlyHealthInsurance,
    monthlyLongTermCare,
    monthlyEmploymentInsurance,
    monthlyIncomeTax,
    monthlyLocalIncomeTax,
    monthlyTotalDeduction,
    monthlyNet,
    annualNationalPension,
    annualHealthInsurance,
    annualLongTermCare,
    annualEmploymentInsurance,
    annualIncomeTax,
    annualLocalIncomeTax,
    annualTotalDeduction,
    annualNet,
    effectiveRate,
  };
}

export function formatKRW(n: number): string {
  return Math.round(n).toLocaleString("ko-KR");
}

export function formatRate(r: number): string {
  return (r * 100).toFixed(2) + "%";
}
