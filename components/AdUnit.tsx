"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
  /** AdSense 광고 슬롯 ID */
  slot: string;
  /** 광고 형식: display(기본), fluid(반응형), rectangle */
  format?: "auto" | "fluid" | "rectangle";
  /** 반응형 여부 */
  responsive?: boolean;
  className?: string;
}

/**
 * Google AdSense 광고 단위 컴포넌트
 * 사용법: <AdUnit slot="1234567890" />
 * 승인 전에는 빈 영역으로 표시됩니다.
 */
export default function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      // adsbygoogle 초기화
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // AdSense 스크립트 미로드 시 무시
    }
  }, []);

  return (
    <div
      className={`overflow-hidden text-center ${className}`}
      aria-label="광고"
      style={{ minHeight: "90px" }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8414331859152952"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
