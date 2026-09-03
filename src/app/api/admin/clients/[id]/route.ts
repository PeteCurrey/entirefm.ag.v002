/**
 * CLIENT ACCOUNT DETAIL & UPDATE API — /api/admin/clients/[id]
 * ============================================================
 * [id] is the client_account id (UUID).
 *
 * GET   — Retrieve single client account with joined organisation and account manager
 * PATCH — Update client account fields (name, account_tier, account_status, account_manager_id)
 *
 * Auth: ENTIREFM internal users only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { getClientAccount } from '@/server/estate';
import { validateAccountManager } from '@/server/estate/account-managers';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const client = await getClientAccount(id);
    if (!client) {
      return NextResponse.json({ error: 'Client account not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, client });
  } catch (error: any) {
    console.error('[CLIENT_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await getClientAccount(id);
    if (!existing) {
      return NextResponse.json({ error: 'Client account not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, account_tier, account_status, account_manager_id } = body;

    const updates: Record<string, any> = {};

    if (name !== undefined) {
      if (!name || typeof name !== 'string' || !name.trim()) {
        return NextResponse.json({ error: 'Client name cannot be empty' }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (account_tier !== undefined) {
      const validTiers = ['ENTERPRISE', 'CORPORATE', 'REGIONAL', 'SME'];
      if (!validTiers.includes(account_tier)) {
        return NextResponse.json({ error: `Invalid account tier: ${account_tier}` }, { status: 400 });
      }
      updates.account_tier = account_tier;
    }

    if (account_status !== undefined) {
      const validStatuses = ['PROSPECT', 'ONBOARDING', 'ACTIVE', 'AT_RISK', 'SUSPENDED', 'CHURNED'];
      if (!validStatuses.includes(account_status)) {
        return NextResponse.json({ error: `Invalid account status: ${account_status}` }, { status: 400 });
      }
      updates.account_status = account_status;
    }

    if (account_manager_id !== undefined) {
      if (account_manager_id === null || account_manager_id === '') {
        updates.account_manager_id = null;
      } else {
        const validMgr = await validateAccountManager(account_manager_id);
        if (!validMgr) {
          return NextResponse.json(
            {
              error: 'The selected account manager does not exist, is inactive, or is not authorised to manage client accounts.',
            },
            { status: 422 }
          );
        }
        updates.account_manager_id = validMgr.id;
      }
    }

    updates.updated_at = new Date().toISOString();

    const { error: updateError } = await dbQuery<any[]>(
      `client_accounts?id=eq.${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        body: updates,
      }
    );

    if (updateError) {
      console.error('[CLIENT_PATCH_ERROR]', updateError);
      return NextResponse.json({ error: `Failed to update client account: ${updateError}` }, { status: 500 });
    }

    const updatedClient = await getClientAccount(id);

    return NextResponse.json({ success: true, client: updatedClient });
  } catch (error: any) {
    console.error('[CLIENT_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
