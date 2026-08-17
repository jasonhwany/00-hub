import type { Metadata } from "next";
import ContentPage from "../../components/ContentPage";
export const metadata: Metadata = { title: "편집 및 업데이트 정책", description: "콘텐츠 작성과 검수, 업데이트 원칙을 공개합니다." };
export default function Page(){return <ContentPage eyebrow="Editorial policy" title="편집 및 업데이트 정책" intro="정확하고 독립적인 금융 정보를 제공하기 위해 작성, 검증, 수정 원칙을 공개합니다." sections={[
{title:"작성과 검증",paragraphs:["설명 콘텐츠는 공식 기관 자료를 토대로 직접 작성합니다. 계산식은 자료의 시행일과 적용 대상을 확인하고 대표 사례와 경계 조건으로 검증합니다. 외부 글을 자동 복제하거나 출처 없이 재가공하지 않습니다."]},
{title:"업데이트 주기",paragraphs:["세율·공제·사회보험처럼 연도별로 바뀌는 항목은 정기 점검하고, 법령 개정이나 정부 발표가 확인되면 수시 점검합니다. 페이지에는 기준연도와 최근 확인일을 표시합니다."],bullets:["연초 정기 제도 점검","정부 개정 발표 시 수시 반영","사용자 오류 제보 접수 후 재검증","오래된 자료는 경고 표시 또는 공개 중단"]},
{title:"광고와 편집의 분리",paragraphs:["광고주나 제휴사가 계산 결과, 상품 순위, 설명의 결론을 바꿀 수 없습니다. 경제적 이해관계가 있는 링크와 콘텐츠는 광고 또는 제휴임을 명확하게 표시합니다."]},
{title:"정정 원칙",paragraphs:["오류가 결과에 영향을 주면 우선 노출을 제한하고 수정 후 재검증합니다. 중요한 변경은 무엇이 왜 바뀌었는지 확인할 수 있도록 기록합니다."]}
]}/>}
