import type { Metadata } from "next";
import ContentPage from "../../components/ContentPage";
export const metadata: Metadata = { title: "면책 고지", description: "계산 결과의 적용 범위와 한계를 설명합니다." };
export default function Page(){return <ContentPage eyebrow="Disclaimer" title="면책 고지" intro="중요한 계약이나 신고 전에는 반드시 해당 기관 또는 자격을 갖춘 전문가에게 최종 확인하세요." sections={[
{title:"예상값",paragraphs:["모든 계산 결과는 사용자가 입력한 값과 화면에 표시된 가정을 바탕으로 한 예상값입니다. 신고 시점의 법령, 과세관청 해석, 증빙, 감면·특례와 개인별 상황을 모두 반영하지 못할 수 있습니다."]},
{title:"전문 자문 아님",paragraphs:["사이트의 정보는 세무, 회계, 법률, 투자 또는 금융 자문이 아닙니다. 결과만을 근거로 계약하거나 신고해 발생한 차이에 대해 서비스가 확정 금액을 보증하지 않습니다."]},
{title:"확인이 필요한 경우",paragraphs:["다주택, 법인 거래, 상속·증여 합산, 해외 자산, 비거주자, 특수관계인 거래, 각종 감면과 경정청구처럼 예외가 많은 경우에는 세무사·회계사·변호사 또는 관할 기관에 문의해야 합니다."]}
]}/>}
