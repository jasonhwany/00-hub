import Link from "next/link";
import ToolCard from "../components/ToolCard";

const taxTools = [
  { name:"취득세 계산기",desc:"주택·토지·상가 취득 시 세금과 부가세목을 계산합니다.",url:"/takdeukse",tag:"Property",accent:"blue" },
  { name:"양도소득세 계산기",desc:"양도차익, 보유기간, 공제를 반영해 예상 세액을 확인합니다.",url:"/yangdo",tag:"Capital gains",accent:"indigo" },
  { name:"종합부동산세 계산기",desc:"주택 공시가격과 보유 조건에 따른 종부세를 추정합니다.",url:"/jongbu",tag:"Holding tax",accent:"violet" },
  { name:"증여세 계산기",desc:"관계별 공제와 사전증여액을 반영한 증여세를 계산합니다.",url:"/jeungyese",tag:"Gift tax",accent:"cyan" },
  { name:"재산세 계산기",desc:"주택·토지 보유에 따른 재산세와 부가세목을 확인합니다.",url:"/jaesanse",tag:"Property tax",accent:"emerald" },
];
const financeTools = [
  { name:"대출이자 계산기",desc:"세 가지 상환 방식의 월 납입금과 총이자를 비교합니다.",url:"/daeul",tag:"Loan",accent:"blue" },
  { name:"중개수수료 계산기",desc:"매매·전세·월세 거래의 법정 중개보수를 계산합니다.",url:"/jungae",tag:"Real estate",accent:"indigo" },
  { name:"평·㎡ 변환기",desc:"평과 제곱미터를 즉시 변환하고 대표 면적을 비교합니다.",url:"/pyeong",tag:"Converter",accent:"cyan" },
  { name:"임대수익률 계산기",desc:"실투자금 대비 월세 수익과 투자 회수기간을 분석합니다.",url:"/imdae",tag:"Investment",accent:"emerald" },
  { name:"전월세 전환 계산기",desc:"보증금과 월세를 법정 전환율 기준으로 비교합니다.",url:"/jeonwolse",tag:"Housing",accent:"violet" },
  { name:"연봉 실수령액 계산기",desc:"4대 보험과 세금 공제 후 월 실수령액을 추정합니다.",url:"/yeonbong",tag:"Salary",accent:"blue" },
];

export default function HubPage(){return <main>
  <section className="relative overflow-hidden bg-[#071426] text-white">
    <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 75% 20%, #3979f6 0, transparent 26%), radial-gradient(circle at 20% 90%, #2463eb 0, transparent 22%)"}} />
    <div className="site-container relative grid gap-12 py-16 lg:grid-cols-[1fr_.82fr] lg:items-center lg:gap-16 lg:py-20">
      <div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.07] px-3 py-1.5 text-xs font-semibold text-blue-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>2026년 기준 · 공식 자료 기반</div>
        <h1 className="mt-6 max-w-xl text-balance text-[2.35rem] font-extrabold leading-[1.18] tracking-[-.04em] sm:text-[2.75rem]">중요한 금융 결정,<br/><span className="text-blue-300">숫자와 근거</span>로 확인하세요.</h1>
        <p className="mt-6 max-w-lg text-[15px] leading-7 text-slate-300 sm:text-base">세금, 대출, 주거비와 급여를 계산하고 결과가 만들어진 기준까지 이해할 수 있습니다. 한국에서 시작해 세계 각국의 생활경제 도구로 확장합니다.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="#calculators" className="btn-primary rounded-xl px-6 py-3.5 text-center text-sm font-bold">계산기 둘러보기</Link><Link href="/methodology" className="rounded-xl border border-white/20 bg-white/[.06] px-6 py-3.5 text-center text-sm font-bold text-white hover:bg-white/10">계산 기준 확인</Link></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Metric value="11" label="사용 가능한 계산기"/><Metric value="100%" label="무료 · 가입 불필요"/><Metric value="Local" label="입력값 브라우저 계산"/><Metric value="Global" label="국가별 서비스 준비"/>
        <div className="col-span-full mt-2 rounded-2xl border border-white/10 bg-white/[.06] p-5 backdrop-blur"><p className="text-xs font-bold uppercase tracking-[.14em] text-blue-300">Our standard</p><p className="mt-2 text-sm leading-6 text-slate-300">적용연도, 계산 가정, 공식 출처와 한계를 함께 공개합니다. 광고나 제휴가 계산 결과를 바꾸지 않습니다.</p></div>
      </div>
    </div>
  </section>

  <section className="border-b border-slate-200 bg-white"><div className="site-container grid divide-y divide-slate-100 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
    <TrustItem title="공식 자료 우선" text="정부·공공기관 원문 기준"/><TrustItem title="계산 과정 공개" text="세율·공제·중간값 설명"/><TrustItem title="독립적 운영" text="광고와 편집 기준 분리"/>
  </div></section>

  <section id="calculators" className="site-container py-14 sm:py-16">
    <div className="max-w-xl"><p className="eyebrow">Korea calculators</p><h2 className="mt-3 text-[1.7rem] font-extrabold tracking-[-.035em] text-slate-950">한국 세금과 부동산 계산</h2><p className="mt-3 text-sm leading-6 text-slate-600">거래 전에 예상 부담을 확인하고 전문가에게 물어볼 내용을 준비하세요.</p></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{taxTools.map(t=><ToolCard key={t.url} {...t} live />)}</div>
    <div className="mt-14 max-w-xl"><p className="eyebrow">Everyday finance</p><h2 className="mt-3 text-[1.7rem] font-extrabold tracking-[-.035em] text-slate-950">생활 금융 도구</h2><p className="mt-3 text-sm leading-6 text-slate-600">대출, 급여, 임대수익과 부동산 거래 조건을 같은 화면에서 비교합니다.</p></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{financeTools.map(t=><ToolCard key={t.url} {...t} live />)}</div>
  </section>

  <section className="border-y border-slate-200 bg-white"><div className="site-container grid gap-10 py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
    <div><p className="eyebrow">Built for trust</p><h2 className="mt-3 text-[1.7rem] font-extrabold leading-snug tracking-[-.035em] text-slate-950">결과보다 중요한 것은<br/>결과를 믿을 수 있는 이유입니다.</h2><p className="mt-5 max-w-md text-sm leading-7 text-slate-600">MoneyStom7은 계산 공식을 숨기지 않습니다. 적용 범위와 예외, 자료의 기준일, 전문가 확인이 필요한 상황을 함께 설명합니다.</p><Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800">운영 원칙 자세히 보기 <span>→</span></Link></div>
    <div className="grid gap-3 sm:grid-cols-2"><Feature n="01" title="기준연도 표시" text="법령과 요율이 적용되는 시점을 분명하게 표시합니다."/><Feature n="02" title="공식 출처" text="운영 기관과 법령 원문을 우선해 검증합니다."/><Feature n="03" title="예외와 한계" text="온라인 계산이 반영하지 못하는 조건을 설명합니다."/><Feature n="04" title="변경 이력" text="결과에 영향을 주는 업데이트를 기록합니다."/></div>
  </div></section>

  <section className="site-container py-16"><div className="overflow-hidden rounded-3xl bg-blue-600 px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-blue-100">Global roadmap</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-.03em]">국가 간 세후 급여와 생활비 비교를 준비하고 있습니다.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">영어 서비스와 미국·영국·일본의 공식 세금 규칙을 순차적으로 지원합니다.</p></div><Link href="/contact" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 lg:mt-0">국가·기능 제안하기</Link></div></section>
</main>}

function Metric({value,label}:{value:string;label:string}){return <div className="rounded-2xl border border-white/10 bg-white/[.06] p-5 backdrop-blur"><strong className="text-2xl font-extrabold tracking-tight text-white">{value}</strong><p className="mt-1 text-xs text-slate-400">{label}</p></div>}
function TrustItem({title,text}:{title:string;text:string}){return <div className="px-6 py-4"><p className="flex items-center gap-2 text-sm font-bold text-slate-800"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-[10px] text-emerald-600">✓</span>{title}</p><p className="ml-7 mt-1 text-xs text-slate-500">{text}</p></div>}
function Feature({n,title,text}:{n:string;title:string;text:string}){return <div className="surface-card rounded-2xl p-5"><span className="text-xs font-black text-blue-500">{n}</span><h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div>}
