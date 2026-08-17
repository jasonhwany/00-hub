import type { Metadata } from "next";
import ContentPage from "../../components/ContentPage";
export const metadata: Metadata = { title: "계산 방법론", description: "MoneyStom7 계산기의 자료 선정, 계산, 검증 방법을 설명합니다.", alternates: { canonical: "https://www.moneystom7.com/methodology" } };
export default function Page(){return <ContentPage eyebrow="Methodology" title="계산 결과를 만드는 방법" intro="결과 숫자뿐 아니라 어떤 기준과 가정으로 계산했는지를 확인할 수 있어야 신뢰할 수 있다고 믿습니다." sections={[
{title:"자료 우선순위",paragraphs:["법령정보센터, 국세청, 행정안전부, 금융위원회, 고용노동부와 4대 사회보험 기관처럼 해당 제도를 직접 운영하는 기관의 자료를 우선합니다. 보도자료나 민간 자료는 설명 보조용으로만 사용하며 공식 원문과 충돌하면 공식 원문을 따릅니다."]},
{title:"계산 규칙",paragraphs:["계산식은 입력값 정규화, 과세표준 산정, 공제 적용, 세율 적용, 부가세목 계산, 반올림 순서로 분리합니다. 사용자에게는 핵심 중간값을 보여주고 내부적으로 경계값·최솟값·최댓값을 테스트합니다."],bullets:["기준연도와 관할 지역을 명시","포함·제외 항목을 결과와 함께 표시","누진세율은 구간별 금액으로 검증","법령 개정 전후 규칙을 별도 버전으로 관리"]},
{title:"결과의 한계",paragraphs:["온라인 계산기는 모든 특례, 유권해석, 개인별 증빙을 반영할 수 없습니다. 결과는 예상 범위를 이해하고 상담을 준비하기 위한 참고값이며 신고서나 금융기관의 확정 금액을 대체하지 않습니다."]},
{title:"오류와 수정",paragraphs:["오류 제보가 접수되면 재현, 공식 근거 확인, 계산 테스트, 배포 순서로 처리합니다. 결과에 영향을 주는 수정은 적용일과 변경 내용을 편집 정책에 기록합니다."]}
]}/>}
