import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isValidSessionToken, getCookieName } from "../../lib/adminAuth";
import { getSql, ensureSchema } from "../../lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 대시보드",
  robots: { index: false, follow: false },
};

interface CountRow {
  calculator: string | null;
  count: string;
}

interface OfferRow {
  calculator: string | null;
  offer: string | null;
  count: string;
}

interface EventRow {
  event_type: string;
  calculator: string | null;
  offer: string | null;
  created_at: string;
}

const CALC_LABELS: Record<string, string> = {
  takdeukse: "취득세 계산기",
  yangdo: "양도소득세 계산기",
  jongbu: "종합부동산세 계산기",
  jeungyese: "증여세 계산기",
  jaesanse: "재산세 계산기",
  daeul: "대출이자 계산기",
  jungae: "중개수수료 계산기",
  pyeong: "평/㎡ 변환기",
  imdae: "임대수익률 계산기",
  jeonwolse: "전월세 전환 계산기",
  yeonbong: "연봉 실수령액 계산기",
};

function label(key: string | null) {
  if (!key) return "(미지정)";
  return CALC_LABELS[key] ?? key;
}

async function getData() {
  await ensureSchema();
  const sql = getSql();

  const [totals, calcCounts, affiliateCounts, toolClicks, recent] = await Promise.all([
    sql`SELECT event_type, COUNT(*)::int AS count FROM events GROUP BY event_type` as unknown as Promise<
      { event_type: string; count: number }[]
    >,
    sql`
      SELECT calculator, COUNT(*) AS count FROM events
      WHERE event_type = 'calculation_complete'
      GROUP BY calculator ORDER BY count DESC
    ` as unknown as Promise<CountRow[]>,
    sql`
      SELECT calculator, offer, COUNT(*) AS count FROM events
      WHERE event_type = 'affiliate_click'
      GROUP BY calculator, offer ORDER BY count DESC
    ` as unknown as Promise<OfferRow[]>,
    sql`
      SELECT calculator, COUNT(*) AS count FROM events
      WHERE event_type = 'tool_card_click'
      GROUP BY calculator ORDER BY count DESC
    ` as unknown as Promise<CountRow[]>,
    sql`
      SELECT event_type, calculator, offer, created_at FROM events
      ORDER BY created_at DESC LIMIT 30
    ` as unknown as Promise<EventRow[]>,
  ]);

  return { totals, calcCounts, affiliateCounts, toolClicks, recent };
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}
    >
      <p className="text-xs mb-1" style={{ color: "#6B6B6B" }}>{label}</p>
      <p className="text-3xl font-bold tabular-nums" style={{ color: "#B8860B", fontFamily: "var(--font-serif)" }}>
        {value.toLocaleString("ko-KR")}
      </p>
    </div>
  );
}

function RankTable({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; count: number }[];
}) {
  return (
    <div className="rounded-2xl p-5" style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}>
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6B6B6B" }}>
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-sm" style={{ color: "#9A9A9A" }}>아직 데이터가 없습니다.</p>
      ) : (
        <div className="space-y-1.5">
          {rows.map((r, i) => (
            <div key={i} className="flex justify-between text-sm py-1" style={{ borderBottom: i < rows.length - 1 ? "1px solid #F0EDE8" : "none" }}>
              <span style={{ color: "#1A1A1A" }}>{r.label}</span>
              <span className="font-semibold tabular-nums" style={{ color: "#B8860B" }}>{r.count.toLocaleString("ko-KR")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }

  const { totals, calcCounts, affiliateCounts, toolClicks, recent } = await getData();

  const totalMap = Object.fromEntries(totals.map((t) => [t.event_type, t.count]));
  const calcRows = calcCounts.map((r) => ({ label: label(r.calculator), count: Number(r.count) }));
  const toolRows = toolClicks.map((r) => ({ label: label(r.calculator), count: Number(r.count) }));
  const affiliateRows = affiliateCounts.map((r) => ({
    label: `${label(r.calculator)} · ${r.offer ?? "(미지정)"}`,
    count: Number(r.count),
  }));

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#1A1A1A" }}>
          관리자 대시보드
        </h1>
        <form action="/api/admin-logout" method="post">
          <button
            type="submit"
            className="text-sm px-3 py-1.5 rounded-md border"
            style={{ borderColor: "#E8E4DD", color: "#6B6B6B" }}
          >
            로그아웃
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="계산 완료" value={totalMap["calculation_complete"] ?? 0} />
        <StatCard label="제휴 배너 클릭" value={totalMap["affiliate_click"] ?? 0} />
        <StatCard label="홈 카드 클릭" value={totalMap["tool_card_click"] ?? 0} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <RankTable title="계산기별 완료 횟수" rows={calcRows} />
        <RankTable title="홈페이지 카드 클릭" rows={toolRows} />
      </div>

      <div className="mb-8">
        <RankTable title="제휴 배너 클릭 (계산기 · 오퍼)" rows={affiliateRows} />
      </div>

      <div className="rounded-2xl p-5" style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6B6B6B" }}>
          최근 이벤트 30건
        </h3>
        {recent.length === 0 ? (
          <p className="text-sm" style={{ color: "#9A9A9A" }}>아직 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-1.5 text-sm">
            {recent.map((r, i) => (
              <div key={i} className="flex justify-between py-1" style={{ borderBottom: i < recent.length - 1 ? "1px solid #F0EDE8" : "none", color: "#1A1A1A" }}>
                <span>
                  {r.event_type} · {label(r.calculator)}
                  {r.offer ? ` · ${r.offer}` : ""}
                </span>
                <span style={{ color: "#9A9A9A" }}>
                  {new Date(r.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
