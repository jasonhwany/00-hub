// 임대수익률 계산기

export interface ImdaeInput {
  purchasePrice: number;     // 매입가 (원)
  deposit: number;           // 보증금 (원)
  monthlyRent: number;       // 월세 (원)
  annualExpense: number;     // 연간 관리비·수선비 (원, 선택)
}

export interface ImdaeResult {
  netInvestment: number;    // 순투자금 (매입가 - 보증금)
  annualRentIncome: number; // 연임대수입 (월세×12)
  annualNetIncome: number;  // 연순수익 (연임대수입 - 연비용)
  yieldRate: number;        // 수익률 (%)
  jeonseRate: number;       // 전세가율 (%)
}

export function calcImdae(input: ImdaeInput): ImdaeResult | null {
  const { purchasePrice, deposit, monthlyRent, annualExpense } = input;

  if (purchasePrice <= 0 || monthlyRent < 0) return null;

  const netInvestment = purchasePrice - (deposit || 0);
  if (netInvestment <= 0) return null;

  const annualRentIncome = monthlyRent * 12;
  const annualNetIncome = annualRentIncome - (annualExpense || 0);
  const yieldRate = parseFloat(((annualNetIncome / netInvestment) * 100).toFixed(2));
  const jeonseRate = parseFloat(((deposit / purchasePrice) * 100).toFixed(1));

  return {
    netInvestment,
    annualRentIncome,
    annualNetIncome,
    yieldRate,
    jeonseRate,
  };
}

export function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR");
}
