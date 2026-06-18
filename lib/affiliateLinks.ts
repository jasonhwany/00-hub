/**
 * 계산기별 제휴 배너 설정.
 *
 * 구글 애드센스 대신 애드픽·링크프라이스·텐핑 등 국내 제휴(CPA) 네트워크의
 * 금융/세무 관련 오퍼만 선별해 계산 결과와 맥락이 맞는 페이지에만 노출한다.
 *
 * href가 null이면 AffiliateCTA가 렌더링되지 않음 — 각 네트워크에서 발급받은
 * 실제 트래킹 링크(개인 발행인 코드 포함)가 확정되면 해당 슬롯의 href만
 * 채우면 바로 노출된다.
 */
export interface AffiliateOffer {
  /** 결과 카드에 보여줄 한 줄 설명 (왜 클릭해야 하는지) */
  description: string;
  /** 링크 텍스트 (예: "핀다 금리 비교") */
  cta: string;
  /** 제휴 네트워크에서 발급한 트래킹 URL. 미확정 시 null */
  href: string | null;
}

export const affiliateOffers: Record<string, AffiliateOffer> = {
  takdeukse: {
    description: "취득세, 대출로 충당하면 얼마나 들까요?",
    cta: "대출 한도 비교하기",
    href: null,
  },
  yangdo: {
    description: "양도세 신고, 실제로 비과세 받을 수 있는지 확인해보세요.",
    cta: "세무사 상담 신청",
    href: null,
  },
  jongbu: {
    description: "종부세, 절세 방법이 있는지 확인해보세요.",
    cta: "세무 전문가 상담",
    href: null,
  },
  jeungyese: {
    description: "증여 계획, 공제 한도까지 세무사와 함께 점검해보세요.",
    cta: "세무사 상담 신청",
    href: null,
  },
  jaesanse: {
    description: "실제 신고 시 절세 가능 여부를 확인해보세요.",
    cta: "세무 전문가 상담",
    href: null,
  },
  daeul: {
    description: "더 낮은 금리 상품이 있는지 확인해보세요.",
    cta: "핀다 금리 비교",
    href: null,
  },
  jungae: {
    description: "셀프등기보다 빠른 등기대행 서비스를 비교해보세요.",
    cta: "등기대행 비교하기",
    href: null,
  },
  imdae: {
    description: "이 수익률 기준으로 추천 매물도 확인해보세요.",
    cta: "투자 매물 비교하기",
    href: null,
  },
  jeonwolse: {
    description: "전월세 계약, 등기·확정일자 처리도 한 번에 비교해보세요.",
    cta: "법무 서비스 비교하기",
    href: null,
  },
  yeonbong: {
    description: "세금을 더 줄일 수 있는지 확인해보세요.",
    cta: "삼쩜삼에서 환급액 조회",
    href: null,
  },
};
