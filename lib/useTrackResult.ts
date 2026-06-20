import { useEffect, useRef } from "react";
import { trackEvent } from "./gtag";

/**
 * 계산 결과가 비어있다가(null) 값이 채워지는 시점(rising edge)에 한 번만
 * GA4 "calculation_complete" 이벤트를 보낸다. 입력 중 매 키 입력마다
 * 재계산되는 것과는 무관하게, "계산을 완료한 횟수"만 집계하기 위함.
 */
export function useTrackResult(calculator: string, result: unknown) {
  const fired = useRef(false);

  useEffect(() => {
    if (result !== null && result !== undefined) {
      if (!fired.current) {
        fired.current = true;
        trackEvent("calculation_complete", { calculator });
      }
    } else {
      fired.current = false;
    }
  }, [result, calculator]);
}
