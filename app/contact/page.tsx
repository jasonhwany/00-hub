import type { Metadata } from "next";
import ContentPage from "../../components/ContentPage";
export const metadata: Metadata = { title: "문의하기", description: "오류 제보, 콘텐츠 및 서비스 문의 방법입니다." };
export default function Page(){return <ContentPage eyebrow="Contact" title="문의하기" intro="계산 오류, 오래된 기준, 접근성 문제와 새로운 국가·도구 제안을 보내주세요." sections={[
{title:"문의할 때 포함할 내용",paragraphs:["빠른 확인을 위해 이용한 계산기 주소, 입력 조건, 예상한 결과, 실제 표시된 결과와 근거 자료 링크를 함께 알려주세요. 주민등록번호, 계좌번호, 계약서 원본 등 민감한 개인정보는 보내지 마세요."],bullets:["계산 오류 및 공식 자료 변경 제보","접근성·모바일 사용 문제","번역 및 국가별 제도 제안","기업 광고·데이터·API 협업 문의"]},
{title:"연락 방법",paragraphs:["이메일: velvet8360@gmail.com", "운영 여건에 따라 답변까지 시간이 걸릴 수 있으며 개별 세금 신고나 법률 판단에 대한 상담은 제공하지 않습니다."]}
]}/>}
