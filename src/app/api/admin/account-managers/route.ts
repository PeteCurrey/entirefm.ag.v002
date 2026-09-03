/**
 * GET /api/admin/account-managers
 * ================================
 * Returns active EntireFM internal team members who are eligible to be
 * assigned as Account Managers on Client Accounts.
 *
 * Used by the New Client Account modal dropdown.
 * Auth-gated to ENTIREFM internal staff only.
 */
import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listEligibleAccountManagers } from '@/server/estate/account-managers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const managers = await listEligibleAccountManagers();
    return NextResponse.json({ success: true, managers });
  } catch (error: any) {
    console.error('[ACCOUNT_MANAGERS_API]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve account managers' },
      { status: 500 }
    );
  }
}
