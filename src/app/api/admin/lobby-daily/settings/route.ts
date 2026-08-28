import { NextResponse } from 'next/server';
import { getLobbyDailySettings, updateLobbyDailySettings } from '@/server/lobby-daily/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getLobbyDailySettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const updated = await updateLobbyDailySettings(body);
    return NextResponse.json({ ok: true, settings: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
