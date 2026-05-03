// 대출이자 계산기 상수

export type RepaymentType = "equal-payment" | "equal-principal" | "bullet";

export const REPAYMENT_OPTIONS: { value: RepaymentType; label: string; desc: string }[] = [
  {
    value: "equal-payment",
    label: "원리금균등",
    desc: "매월 동일 금액 납부",
  },
  {
    value: "equal-principal",
    label: "원금균등",
    desc: "매월 원금 동일, 이자 감소",
  },
  {
    value: "bullet",
    label: "만기일시",
    desc: "만기에 원금 일시 상환",
  },
];

export const PERIOD_UNIT_OPTIONS: { value: "year" | "month"; label: string }[] = [
  { value: "year", label: "년" },
  { value: "month", label: "개월" },
];

// 기본 입력값 예시
export const PLACEHOLDER_AMOUNT = "예: 300,000,000";
export const PLACEHOLDER_RATE = "예: 3.5";
export const PLACEHOLDER_PERIOD = "예: 30";

// 스케줄 기본 노출 행수
export const SCHEDULE_DEFAULT_ROWS = 12;
