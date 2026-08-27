import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import {
  getAllIntelligenceItems,
  getItemsPendingReview,
  adminReviewIntelligenceItem,
  getAdminIntelligenceSummary,
} from '@/server/intelligence/intelligence-engine';
import { sourceRegistry } from '@/server/intelligence/source-registry';

export const dynamic = 'force-dynamic';

// GET — admin intelligence overview, queues, and source health
export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  requireAdminSession(session); // Throws if not admin — 403 handled in catch

  const view = request.nextUrl.searchParams.get('view') || 'summary';

  try {
    if (view === 'pending') {
      const pending = getItemsPendingReview();
      return NextResponse.json({ pendingItems: pending, count: pending.length });
    }

    if (view === 'all') {
      const items = getAllIntelligenceItems();
      return NextResponse.json({ items, count: items.length });
    }

    if (view === 'sources') {
      const sources = sourceRegistry.getAllSources();
      return NextResponse.json({ sources });
    }

    // Default: summary dashboard
    const summary = getAdminIntelligenceSummary();
    return NextResponse.json({ summary });
  } catch (err: any) {
    if (err.message?.includes('Access denied') || err.message?.includes('Authentication') || err.message?.includes('admin')) {
      return NextResponse.json({ error: 'Administrator access required' }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Admin intelligence unavailable' }, { status: 500 });
  }
}

// POST — admin review action on intelligence items
export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  const validAdmin = requireAdminSession(session);

  try {
    const body = await request.json();
    const { action, itemId, notes } = body;

    if (!itemId) return NextResponse.json({ error: 'itemId is required' }, { status: 400 });

    if (action === 'APPROVE' || action === 'REJECT') {
      const updated = await adminReviewIntelligenceItem(
        itemId,
        action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        validAdmin.personId,
        notes
      );
      return NextResponse.json({ item: updated });
    }

    return NextResponse.json({ error: `Unknown admin action: ${action}` }, { status: 400 });
  } catch (err: any) {
    if (err.message?.includes('Access denied') || err.message?.includes('admin')) {
      return NextResponse.json({ error: 'Administrator access required' }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Admin action failed' }, { status: 500 });
  }
}
