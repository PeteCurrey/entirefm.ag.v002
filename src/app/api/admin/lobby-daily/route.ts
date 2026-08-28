import { NextResponse } from 'next/server';
import { getEditionById, saveEdition, updateEditionStatus } from '@/server/lobby-daily/store';
import { dispatchApprovedEdition, sendTestDailyEmail, runDailyDraftGeneration } from '@/server/lobby-daily/scheduler';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, editionId, testEmail, updates } = body;

    if (action === 'DRAFT_NOW') {
      const result = await runDailyDraftGeneration();
      return NextResponse.json({ ok: true, result });
    }

    if (!editionId) {
      return NextResponse.json({ error: 'editionId is required' }, { status: 400 });
    }

    const edition = await getEditionById(editionId);
    if (!edition) {
      return NextResponse.json({ error: 'Edition not found' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      const updated = await updateEditionStatus(editionId, 'SCHEDULED', 'ADMIN_MANUAL');
      return NextResponse.json({ ok: true, edition: updated });
    }

    if (action === 'UNAPPROVE') {
      const updated = await updateEditionStatus(editionId, 'AWAITING_APPROVAL', 'ADMIN_MANUAL');
      return NextResponse.json({ ok: true, edition: updated });
    }

    if (action === 'DISPATCH_NOW') {
      // Force status to SCHEDULED if not already, then dispatch
      if (edition.status !== 'SCHEDULED') {
        await updateEditionStatus(editionId, 'SCHEDULED', 'ADMIN_FORCE_DISPATCH');
      }
      const dispatchResult = await dispatchApprovedEdition(editionId, { forceSend: true });
      return NextResponse.json({ ok: true, dispatchResult });
    }

    if (action === 'SEND_TEST') {
      if (!testEmail || !testEmail.includes('@')) {
        return NextResponse.json({ error: 'Valid testEmail is required' }, { status: 400 });
      }
      const testResult = await sendTestDailyEmail(editionId, testEmail.trim());
      return NextResponse.json({ ok: true, testResult });
    }

    if (action === 'UPDATE_CONTENT' && updates) {
      const merged = {
        ...edition,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      const saved = await saveEdition(merged);
      return NextResponse.json({ ok: true, edition: saved });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
