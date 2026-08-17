import type { Metadata } from "next";
import ContentPage from "../../components/ContentPage";
export const metadata: Metadata = { title: "광고 및 제휴", description: "MoneyStom7 기업 광고와 파트너십 원칙을 안내합니다." };
export default function Page(){return <ContentPage eyebrow="Partnerships" title="사용자에게 도움이 되는 파트너십" intro="금융 의사결정의 순간에 신뢰할 수 있는 기업과 서비스를 연결합니다. 광고 수익보다 사용자 적합성과 투명성을 우선합니다." sections={[
{title:"협업 분야",paragraphs:["은행·핀테크, 보험, 세무·회계, 부동산, 해외송금, 채용·급여, 회계 SaaS와 공공성을 갖춘 교육 서비스의 제안을 검토합니다."],bullets:["명확히 구분된 디스플레이 스폰서십","계산기 맥락에 맞는 파트너 안내","공동 데이터 리포트와 교육 콘텐츠","계산 API 및 화이트라벨 협업"]},
{title:"편집 독립성",paragraphs:["광고비나 제휴 수수료는 계산 결과와 콘텐츠 결론에 영향을 주지 않습니다. 유료 관계는 광고·Sponsored·제휴 링크로 표시하며 오해를 유도하는 버튼이나 표현을 사용하지 않습니다."]},
{title:"제안에 필요한 정보",paragraphs:["기업·서비스 소개, 대상 국가와 사용자, 희망 형식, 기간, 예산 범위, 랜딩 페이지와 법적 고지 정보를 velvet8360@gmail.com으로 보내주세요. 이용자 보호 기준에 맞지 않는 고위험 금융상품, 과장 광고, 불법 서비스는 진행하지 않습니다."]}
]}/>}
