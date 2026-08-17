import type { Metadata } from "next";
import ContentPage from "../../components/ContentPage";
export const metadata: Metadata = { title: "이용약관", description: "MoneyStom7 서비스 이용 조건을 안내합니다." };
export default function Page(){return <ContentPage eyebrow="Terms" title="이용약관" intro="서비스를 이용하기 전에 계산 결과의 성격과 이용자의 책임을 확인해 주세요." sections={[
{title:"서비스의 성격",paragraphs:["MoneyStom7은 일반적인 정보와 예상 계산 결과를 무료로 제공합니다. 결과는 세무 신고, 법률 의견, 투자 권유, 금융기관의 심사 결과가 아니며 개별 상황에 대한 전문 자문을 대체하지 않습니다."]},
{title:"허용되는 이용",paragraphs:["개인적 의사결정과 정보 확인 목적으로 자유롭게 이용할 수 있습니다. 자동화된 대량 수집, 서비스 방해, 결과의 허위 표시, 소스와 콘텐츠의 무단 재판매는 허용하지 않습니다."]},
{title:"정확성과 변경",paragraphs:["합리적인 정확성을 위해 노력하지만 법령, 지역, 적용 시점과 입력 조건에 따라 실제 금액이 달라질 수 있습니다. 기능과 계산 기준은 사전 고지 없이 개선될 수 있으며 중요한 변경은 업데이트 정책에 기록합니다."]},
{title:"외부 링크와 광고",paragraphs:["외부 사이트와 광고는 편의를 위해 제공되며 해당 서비스의 내용과 계약은 각 운영자의 책임입니다. 광고 또는 제휴 관계가 있는 경우 이를 구분해 표시합니다."]}
]}/>}
