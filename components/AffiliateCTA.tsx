"use client";

import { affiliateOffers } from "../lib/affiliateLinks";
import { trackEvent } from "../lib/gtag";

interface AffiliateCTAProps {
  /** affiliateLinks.ts의 키 (계산기 slug) */
  slotKey: string;
  className?: string;
}

/**
 * 제휴 네트워크(애드픽·링크프라이스·텐핑 등) 배너 링크.
 * 계산 결과와 자연스럽게 이어지도록 카드형이 아닌 인라인 텍스트 링크로 노출한다.
 * 해당 slotKey의 href가 비어 있으면(제휴 미연동) 아무것도 렌더링하지 않는다.
 */
export default function AffiliateCTA({ slotKey, className = "" }: AffiliateCTAProps) {
  const offer = affiliateOffers[slotKey];
  if (!offer || !offer.href) return null;

  return (
    <div
      className={`rounded-2xl px-5 py-4 ${className}`}
      style={{ border: "1px solid #E8E4DD", backgroundColor: "#FBF9F5" }}
    >
      <p className="text-sm mb-1.5" style={{ color: "#1A1A1A" }}>
        {offer.description}
      </p>
      <a
        href={offer.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="text-sm font-semibold hover:underline"
        style={{ color: "#B8860B" }}
        onClick={() => trackEvent("affiliate_click", { calculator: slotKey, offer: offer.cta })}
      >
        [{offer.cta}]
      </a>
      <p className="text-[10px] mt-2" style={{ color: "#B0AEA8" }}>
        광고
      </p>
    </div>
  );
}
