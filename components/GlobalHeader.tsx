"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MAIN_LINKS = [
  { name: "취득세", href: "/takdeukse" }, { name: "양도소득세", href: "/yangdo" },
  { name: "대출이자", href: "/daeul" }, { name: "종부세", href: "/jongbu" },
  { name: "증여세", href: "/jeungyese" }, { name: "재산세", href: "/jaesanse" },
] as const;
const MORE_LINKS = [
  { name: "부동산 인사이트", href: "/insights" },
  { name: "중개수수료", href: "/jungae" }, { name: "평·㎡ 변환", href: "/pyeong" },
  { name: "임대수익률", href: "/imdae" }, { name: "전월세 전환", href: "/jeonwolse" },
  { name: "연봉 실수령액", href: "/yeonbong" },
] as const;
const ALL_LINKS = [...MAIN_LINKS, ...MORE_LINKS];

export default function GlobalHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between gap-5">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Fiscal Atlas 홈">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition group-hover:border-blue-200 group-hover:shadow-md">
            <Image src="/brand/fiscal-atlas-mark-source.png" alt="" width={40} height={40} className="h-9 w-9 object-contain" priority />
          </span>
          <span>
            <b className="font-brand block text-[17px] font-bold leading-none tracking-[-.025em] text-[#0b1f3a]">Fiscal Atlas</b>
            <small className="mt-1 block text-[8px] font-bold uppercase tracking-[.2em] text-slate-400">Global financial intelligence</small>
          </span>
        </Link>
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="주요 계산기">
          {MAIN_LINKS.map((item) => <NavLink key={item.href} {...item} active={pathname === item.href} />)}
          <div className="relative" ref={ref}>
            <button onClick={() => setOpen(v => !v)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950" aria-expanded={open}>더보기 <span className={`text-[10px] transition ${open ? "rotate-180" : ""}`}>▼</span></button>
            {open && <div className="absolute right-0 top-11 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">{MORE_LINKS.map(item => <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">{item.name}</Link>)}</div>}
          </div>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/insights" className={`hidden rounded-lg px-3 py-2 text-xs font-semibold sm:block ${pathname.startsWith("/insights") ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:text-slate-900"}`}>인사이트</Link>
          <Link href="/methodology" className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 sm:block">계산 기준</Link>
          <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">KR <span className="ml-1 text-slate-400">한국어</span></span>
        </div>
      </div>
      <nav className="overflow-x-auto border-t border-slate-100 lg:hidden" aria-label="모바일 계산기 메뉴" style={{ scrollbarWidth: "none" }}>
        <div className="site-container flex w-max gap-1 py-2">{ALL_LINKS.map(item => <NavLink key={item.href} {...item} active={pathname === item.href} />)}</div>
      </nav>
    </header>
  );
}

function NavLink({ name, href, active }: { name: string; href: string; active: boolean }) {
  return <Link href={href} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`} aria-current={active ? "page" : undefined}>{name}</Link>;
}
