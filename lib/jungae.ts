// 중개수수료 계산기 — 2024년 기준 (공인중개사법 시행규칙)

export type TransactionType = "sale" | "jeonse" | "monthly";

export interface JungaeInput {
  transactionType: TransactionType;
  salePrice?: number;      // 매매 또는 전세 금액 (원)
  deposit?: number;        // 월세: 보증금 (원)
  monthlyRent?: number;    // 월세: 월세 (원)
}

export interface JungaeResult {
  effectiveAmount: number; // 적용 거래금액 (월세 환산가액 포함)
  maxRate: number;         // 상한 요율
  commission: number;      // 중개보수 (VAT 미포함)
  commissionWithVat: number; // 중개보수 (VAT 10% 포함)
}

// 매매 상한 요율
function getSaleRate(amount: number): number {
  if (amount < 500_000_000) return 0.004;   // 5억 미만: 0.4%
  if (amount < 900_000_000) return 0.005;   // 5억~9억 미만: 0.5%
  return 0.009;                              // 9억 이상: 0.9%
}

// 전세 상한 요율
function getJeonseRate(amount: number): number {
  if (amount < 300_000_000) return 0.003;   // 3억 미만: 0.3%
  if (amount < 600_000_000) return 0.004;   // 3억~6억 미만: 0.4%
  return 0.008;                              // 6억 이상: 0.8%
}

export function calcJungae(input: JungaeInput): JungaeResult | null {
  const { transactionType, salePrice, deposit, monthlyRent } = input;

  let effectiveAmount = 0;
  let maxRate = 0;

  if (transactionType === "sale") {
    if (!salePrice || salePrice <= 0) return null;
    effectiveAmount = salePrice;
    maxRate = getSaleRate(salePrice);
  } else if (transactionType === "jeonse") {
    if (!salePrice || salePrice <= 0) return null;
    effectiveAmount = salePrice;
    maxRate = getJeonseRate(salePrice);
  } else {
    // 월세: 보증금 + (월세 × 100) 환산
    const d = deposit || 0;
    const m = monthlyRent || 0;
    if (d <= 0 && m <= 0) return null;
    effectiveAmount = d + m * 100;
    // 환산 금액이 5천만 미만이면 전세 최저요율 적용
    if (effectiveAmount < 50_000_000) {
      maxRate = 0.005; // 5천만 미만 월세 전용 요율
    } else {
      maxRate = getJeonseRate(effectiveAmount);
    }
  }

  const commission = Math.floor(effectiveAmount * maxRate);
  const commissionWithVat = Math.floor(commission * 1.1);

  return {
    effectiveAmount,
    maxRate,
    commission,
    commissionWithVat,
  };
}

export function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
