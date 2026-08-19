import type { Metadata } from "next";
import ContentPage from "../../components/ContentPage";
export const metadata: Metadata = { title: "개인정보처리방침", description: "MoneyStom7 개인정보 처리와 쿠키 사용을 안내합니다." };
export default function Page(){return <ContentPage eyebrow="Privacy" title="개인정보처리방침" intro="MoneyStom7은 계산에 필요한 정보를 최소한으로 처리하고 사용자가 입력한 재무 정보를 별도로 저장하지 않는 것을 기본 원칙으로 합니다." sections={[
{title:"처리하는 정보",paragraphs:["계산기에 입력하는 가격, 급여, 기간, 가족 수 등의 값은 브라우저에서 결과를 계산하는 데 사용되며 개별 사용자를 식별하는 형태로 저장하지 않습니다. 서비스 안정성과 이용 현황 파악을 위해 접속 일시, 페이지, 기기·브라우저 종류와 같은 기술 정보가 분석 도구에 의해 처리될 수 있습니다."]},
{title:"쿠키와 외부 서비스",paragraphs:["Google을 포함한 제3자 광고 사업자는 쿠키를 사용하여 사용자의 본 사이트 또는 다른 웹사이트 방문 기록을 바탕으로 광고를 게재할 수 있습니다. Google의 광고 쿠키 사용으로 Google과 파트너는 사용자의 방문 기록에 기반한 맞춤 광고를 제공할 수 있습니다.","사용자는 Google 광고 설정(https://adssettings.google.com)에서 맞춤 광고를 사용 중지할 수 있습니다. 제3자 광고 사업자의 맞춤 광고 쿠키는 YourAdChoices(https://www.aboutads.info/choices)에서 일부 사용 중지할 수 있습니다. Google Analytics와 Google AdSense는 방문 통계, 광고 제공 및 부정 이용 방지를 위해 쿠키 또는 유사 기술을 사용할 수 있으며, 적용 지역에서는 동의 관리 화면을 제공합니다."]},
{title:"문의 정보",paragraphs:["문의 양식 또는 이메일로 연락하면 회신을 위해 이름, 이메일, 문의 내용을 처리합니다. 목적이 끝나면 관련 법령상 보관 의무가 없는 한 안전하게 삭제합니다."]},
{title:"이용자의 선택",paragraphs:["브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있으며, 적용되는 법률에 따라 개인정보 열람·정정·삭제 또는 처리 제한을 요청할 수 있습니다. 요청은 문의 페이지를 통해 접수합니다."]},
{title:"국외 이용자",paragraphs:["글로벌 서비스 확대 시 EEA·영국·스위스에는 Google 인증 동의 관리 플랫폼을 적용하고, 지역별 개인정보 권리와 데이터 이전 안내를 추가합니다."]}
]}/>}
