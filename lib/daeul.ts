import { RepaymentType } from "./daeul-constants";

export type { RepaymentType };

// ────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────

export interface DaeulInput {
  principal: number;       // 대출원금 (원)
  annualRate: number;      // 연이율 (%, 예: 3.5)
  months: number;          // 대출기간 (개월)
  repaymentType: RepaymentType;
}

/** 회차별 상환 내역 */
export interface ScheduleRow {
  month: number;           // 회차
  payment: number;         // 월 상환금
  principal: number;       // 원금 상환액
  interest: number;        // 이자 납부액
  balance: number;         // 잔여원금
}

export interface DaeulResult {
  /** 원리금균등·만기일시: 고정 월 상환금 / 원금균등: 첫 달 상환금 */
  firstPayment: number;
  /** 원금균등: 마지막 달 상환금 (원리금균등·만기일시에서는 firstPayment와 동일) */
  lastPayment: number;
  totalPayment: number;    // 총 상환금
  totalInterest: number;   // 총 이자
  schedule: ScheduleRow[]; // 회차별 상환 스케줄
  isFixedPayment: boolean; // true면 고정 월 상환금, false면 범위 표시
}

// ────────────────────────────────────────────────
// 계산 함수
// ────────────────────────────────────────────────

/**
 * 원리금균등상환 (Equal Payment / Annuity)
 * 월상환금 = P × r / (1 - (1+r)^-n)
 */
function calcEqualPayment(input: DaeulInput): DaeulResult {
  const { principal, annualRate, months } = input;
  const r = annualRate / 100 / 12; // 월이율

  // 이율이 0인 경우 (무이자)
  const monthlyPayment =
    r === 0
      ? principal / months
      : (principal * r) / (1 - Math.pow(1 + r, -months));

  const schedule: ScheduleRow[] = [];
  let balance = principal;

  for (let m = 1; m <= months; m++) {
    const interest = Math.round(balance * r);
    // 마지막 회차는 잔여원금 전부 상환 (반올림 오차 보정)
    const principalPaid =
      m === months
        ? balance
        : Math.round(monthlyPayment - interest);
    const payment = principalPaid + interest;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({ month: m, payment, principal: principalPaid, interest, balance });
  }

  const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
  const totalInterest = totalPayment - principal;

  return {
    firstPayment: Math.round(monthlyPayment),
    lastPayment: Math.round(monthlyPayment),
    totalPayment,
    totalInterest,
    schedule,
    isFixedPayment: true,
  };
}

/**
 * 원금균등상환 (Equal Principal)
 * 월원금 = P / n
 * 월이자 = 잔여원금 × r
 */
function calcEqualPrincipal(input: DaeulInput): DaeulResult {
  const { principal, annualRate, months } = input;
  const r = annualRate / 100 / 12;
  const monthlyPrincipal = Math.floor(principal / months);

  const schedule: ScheduleRow[] = [];
  let balance = principal;

  for (let m = 1; m <= months; m++) {
    const interest = Math.round(balance * r);
    // 마지막 회차는 남은 원금 전부 상환
    const principalPaid = m === months ? balance : monthlyPrincipal;
    const payment = principalPaid + interest;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({ month: m, payment, principal: principalPaid, interest, balance });
  }

  const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
  const totalInterest = totalPayment - principal;

  return {
    firstPayment: schedule[0].payment,
    lastPayment: schedule[schedule.length - 1].payment,
    totalPayment,
    totalInterest,
    schedule,
    isFixedPayment: false,
  };
}

/**
 * 만기일시상환 (Bullet / Interest-only)
 * 매달 이자만 납부, 만기에 원금 일시 상환
 */
function calcBullet(input: DaeulInput): DaeulResult {
  const { principal, annualRate, months } = input;
  const r = annualRate / 100 / 12;
  const monthlyInterest = Math.round(principal * r);

  const schedule: ScheduleRow[] = [];

  for (let m = 1; m <= months; m++) {
    const isLast = m === months;
    const principalPaid = isLast ? principal : 0;
    const payment = principalPaid + monthlyInterest;
    const balance = isLast ? 0 : principal;

    schedule.push({
      month: m,
      payment,
      principal: principalPaid,
      interest: monthlyInterest,
      balance,
    });
  }

  const totalInterest = monthlyInterest * months;
  const totalPayment = principal + totalInterest;

  return {
    firstPayment: monthlyInterest,
    lastPayment: principal + monthlyInterest,
    totalPayment,
    totalInterest,
    schedule,
    isFixedPayment: false, // 마지막 달에 원금이 더해지므로 범위로 표시
  };
}

/**
 * 대출이자 메인 계산 함수
 */
export function calcDaeul(input: DaeulInput): DaeulResult {
  if (input.principal <= 0 || input.months <= 0 || input.annualRate < 0) {
    throw new Error("유효하지 않은 입력값입니다.");
  }

  switch (input.repaymentType) {
    case "equal-payment":
      return calcEqualPayment(input);
    case "equal-principal":
      return calcEqualPrincipal(input);
    case "bullet":
      return calcBullet(input);
  }
}

// ────────────────────────────────────────────────
// 포맷 유틸
// ────────────────────────────────────────────────

/** 원화 포맷 (콤마 구분, 단위 없음) */
export function formatKRW(value: number): string {
  return Math.round(value).toLocaleString("ko-KR");
}

/** 만원 단위 변환 표시 */
export function formatManwon(value: number): string {
  const manwon = Math.floor(value / 10_000);
  return `${manwon.toLocaleString("ko-KR")}만원`;
}
