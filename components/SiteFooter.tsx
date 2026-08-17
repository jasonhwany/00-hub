import Link from "next/link";

const groups = [
  { title: "서비스", links: [["세금 계산기", "/#calculators"], ["부동산 인사이트", "/insights"], ["계산 방법론", "/methodology"], ["업데이트 정책", "/editorial-policy"]] },
  { title: "Fiscal Atlas", links: [["서비스 소개", "/about"], ["문의하기", "/contact"], ["광고·제휴", "/advertise"]] },
  { title: "정책", links: [["개인정보처리방침", "/privacy"], ["이용약관", "/terms"], ["면책 고지", "/disclaimer"]] },
];

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="site-container grid gap-10 py-12 lg:grid-cols-[1.35fr_2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold tracking-[-.02em] text-slate-950">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#142b49] text-sm text-white">M</span>
            Fiscal Atlas
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
            복잡한 세금과 금융 의사결정을 이해하기 쉬운 계산과 근거로 바꿉니다. 모든 결과는 참고용이며 입력값은 브라우저에서 계산됩니다.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 2026년 기준 · 지속 업데이트
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => <li key={href}><Link href={href} className="text-sm text-slate-600 transition hover:text-blue-600">{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="site-container flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Fiscal Atlas. All rights reserved.</p>
          <p>본 서비스는 세무·법률 자문을 대체하지 않습니다.</p>
        </div>
      </div>
    </footer>
  );
}
