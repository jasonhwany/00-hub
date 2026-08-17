import Link from "next/link";

export type ContentSection = { title: string; paragraphs: string[]; bullets?: string[] };

export default function ContentPage({ eyebrow, title, intro, updated = "2026년 8월 17일", sections }: { eyebrow: string; title: string; intro: string; updated?: string; sections: ContentSection[] }) {
  return (
    <main className="content-container py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-7 text-xs font-medium text-slate-400"><Link href="/" className="hover:text-blue-600">홈</Link><span className="mx-2">/</span>{title}</nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-2xl text-balance text-[2rem] font-extrabold tracking-[-.035em] text-slate-950 sm:text-[2.35rem]">{title}</h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">{intro}</p>
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500"><span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold">최근 업데이트 {updated}</span></div>
        <article className="mt-10 space-y-5">
          {sections.map(section => <section key={section.title} className="surface-card rounded-2xl p-6 sm:p-8"><h2 className="text-lg font-bold tracking-[-.02em] text-slate-900">{section.title}</h2><div className="mt-4 space-y-3">{section.paragraphs.map((p,i)=><p key={i} className="text-sm leading-7 text-slate-600">{p}</p>)}</div>{section.bullets && <ul className="mt-4 space-y-2">{section.bullets.map(item=><li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />{item}</li>)}</ul>}</section>)}
        </article>
      </div>
    </main>
  );
}
