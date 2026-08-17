"use client";
import Link from "next/link";
import { trackEvent } from "../lib/gtag";

const tones: Record<string,string>={blue:"bg-blue-50 text-blue-700",indigo:"bg-indigo-50 text-indigo-700",violet:"bg-violet-50 text-violet-700",cyan:"bg-cyan-50 text-cyan-700",emerald:"bg-emerald-50 text-emerald-700"};
export default function ToolCard({name,desc,url,live,tag="Calculator",accent="blue"}:{name:string;desc:string;url:string;live:boolean;tag?:string;accent?:string}){
  return <Link href={live?url:"#"} onClick={()=>live&&trackEvent("tool_card_click",{tool:name})} aria-disabled={!live} className={`group surface-card relative overflow-hidden rounded-2xl p-5 transition duration-200 ${live?"hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5":"pointer-events-none opacity-50"}`}>
    <div className="flex items-center justify-between"><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${tones[accent]??tones.blue}`}>{tag}</span><span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">→</span></div>
    <h3 className="mt-5 text-base font-bold tracking-[-.02em] text-slate-900">{name}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{desc}</p>
    <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>무료 · 입력값 저장 안 함</div>
  </Link>
}
