// 평/㎡ 변환기

// 1평 = 3.305785㎡ (정확한 법정 환산값)
export const PYEONG_TO_SQM = 3.305785;
export const SQM_TO_PYEONG = 1 / PYEONG_TO_SQM;

export type ConvertUnit = "pyeong" | "sqm";

export interface PyeongResult {
  inputValue: number;
  inputUnit: ConvertUnit;
  outputValue: number;
  outputUnit: ConvertUnit;
}

export function convertArea(value: number, from: ConvertUnit): PyeongResult | null {
  if (value <= 0) return null;

  if (from === "pyeong") {
    return {
      inputValue: value,
      inputUnit: "pyeong",
      outputValue: parseFloat((value * PYEONG_TO_SQM).toFixed(4)),
      outputUnit: "sqm",
    };
  } else {
    return {
      inputValue: value,
      inputUnit: "sqm",
      outputValue: parseFloat((value * SQM_TO_PYEONG).toFixed(4)),
      outputUnit: "pyeong",
    };
  }
}

export function formatArea(value: number, unit: ConvertUnit): string {
  const rounded = parseFloat(value.toFixed(2));
  return `${rounded.toLocaleString("ko-KR")} ${unit === "pyeong" ? "평" : "㎡"}`;
}
