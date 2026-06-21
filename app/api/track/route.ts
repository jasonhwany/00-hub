import { NextRequest, NextResponse } from "next/server";
import { getSql, ensureSchema } from "../../../lib/db";

const ALLOWED_EVENTS = new Set(["calculation_complete", "affiliate_click", "tool_card_click"]);

let schemaReady = false;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = String(body?.event ?? "");
    if (!ALLOWED_EVENTS.has(eventType)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const calculator = body?.calculator ? String(body.calculator).slice(0, 64) : null;
    const offer = body?.offer ? String(body.offer).slice(0, 128) : null;

    if (!schemaReady) {
      await ensureSchema();
      schemaReady = true;
    }

    const sql = getSql();
    await sql`
      INSERT INTO events (event_type, calculator, offer)
      VALUES (${eventType}, ${calculator}, ${offer})
    `;

    return NextResponse.json({ ok: true });
  } catch {
    // 추적 실패는 사용자 경험에 영향을 주지 않도록 조용히 무시
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
