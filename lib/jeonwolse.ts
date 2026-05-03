// 전월세 전환 계산기
// 주택임대차보호법 제7조의2: 월세 = (전세금 - 보증금) × 전환율 / 12

export type ConvertDirection = "jeonse_to_monthly" | "monthly_to_jeonse";

export interface JeonwolseInput {
  direction: ConvertDirection;
  jeonseDeposit?: number;   // 전세→월세: 전세금 (원)
  newDeposit?: number;      // 전세→월세: 새 보증금 (원)
  existingDeposit?: number; // 월세→전세: 현재 보증금 (원)
  monthlyRent?: number;     // 월세→전세: 현재 월세 (원)
  conversionRate: number;   // 전환율 (%, 기본 4)
}

export interface JeonwolseResult {
  monthlyRent?: number;     // 전환된 월세 (원)
  jeonseEquivalent?: number; // 전환된 전세금 (원)
  conversionRate: number;   // 적용 전환율 (%)
}

export function calcJeonwolse(input: JeonwolseInput): JeonwolseResult | null {
  const { direction, conversionRate } = input;
  const rate = conversionRate / 100;

  if (direction === "jeonse_to_monthly") {
    const jeonseDeposit = input.jeonseDeposit || 0;
    const newDeposit = input.newDeposit || 0;
    if (jeonseDeposit <= 0) return null;
    if (newDeposit >= jeonseDeposit) return null;

    const monthlyRent = Math.floor(((jeonseDeposit - newDeposit) * rate) / 12);
    return { monthlyRent, conversionRate };
  } else {
    const existingDeposit = input.existingDeposit || 0;
    const monthlyRent = input.monthlyRent || 0;
    if (monthlyRent <= 0) return null;

    // 전세금 = 보증금 + (월세 × 12 / 전환율)
    const jeonseEquivalent = Math.floor(existingDeposit + (monthlyRent * 12) / rate);
    return { jeonseEquivalent, conversionRate };
  }
}

export function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR");
}
