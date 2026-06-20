/**
 * GA4로 커스텀 이벤트를 보낸다. 이 데이터는 analytics.google.com에 로그인한
 * 계정(관리자)만 볼 수 있고, moneystom7.com 자체에는 어떤 형태로도 노출되지 않는다.
 */
export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", name, params);
}
