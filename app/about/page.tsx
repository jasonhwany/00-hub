import type { Metadata } from "next";
import ContentPage from "../../components/ContentPage";
export const metadata: Metadata = { title: "서비스 소개", description: "Fiscal Atlas의 운영 목적과 원칙을 소개합니다.", alternates: { canonical: "https://www.moneystom7.com/about" } };
export default function Page(){return <ContentPage eyebrow="About us" title="복잡한 숫자를 더 나은 결정으로" intro="Fiscal Atlas는 세금과 금융 정보를 누구나 이해하고 비교할 수 있는 실용적인 의사결정 도구로 바꾸는 독립 서비스입니다." sections={[
{title:"우리가 해결하려는 문제",paragraphs:["집을 사고팔거나 대출을 선택하고 급여를 비교할 때 필요한 정보는 여러 기관과 문서에 흩어져 있습니다. MoneyStom7은 사용자가 조건을 입력하면 예상 결과와 계산 과정을 함께 보여주어, 전문가 상담 전에 스스로 질문을 정리할 수 있도록 돕습니다.","현재는 한국의 부동산·세금·급여 계산을 제공하며, 앞으로 공식 자료를 검증할 수 있는 국가부터 영어와 현지 언어 서비스를 단계적으로 확장합니다."]},
{title:"운영 원칙",paragraphs:["정확성보다 확신을 과장하지 않습니다. 계산에 포함된 항목과 제외된 예외를 구분하고, 기준연도와 공식 출처를 표시하며, 법령이 바뀌면 계산 규칙과 설명을 함께 수정합니다."],bullets:["입력한 금액과 개인 조건은 계산을 위해서만 사용","광고·제휴 여부와 무관하게 계산 결과는 동일","오류 제보와 수정 이력을 투명하게 관리","세무·법률 자문이 필요한 경계를 명확하게 안내"]},
{title:"앞으로의 방향",paragraphs:["국가 간 세후 급여, 주거비, 사회보험과 생활비를 같은 기준에서 비교하고, 이주·취업·투자처럼 국경을 넘는 의사결정을 지원하는 글로벌 금융 도구로 발전시키고자 합니다."]}
]}/>}
