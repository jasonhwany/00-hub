/**
 * 이벤트를 GA4(analytics.google.com)와 자체 /admin 대시보드용 DB 양쪽으로 보낸다.
 * 두 경로 모두 관리자 계정/비밀번호 없이는 조회할 수 없고, moneystom7.com
 * 방문자 화면에는 어떤 형태로도 노출되지 않는다.
 */
export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;

  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", name, params);

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: name,
      calculator: params?.calculator ?? params?.tool ?? null,
      offer: params?.offer ?? null,
    }),
    keepalive: true,
  }).catch(() => {
    // 자체 DB 기록 실패는 무시 — GA4는 이미 전송됨
  });
}
