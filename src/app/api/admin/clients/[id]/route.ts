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
import { getClientAccount, updateClientAccount } from '@/server/estate';
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
    const { name, account_tier, account_status, account_manager_id, email, phone, organisation_code } = body;

    let validatedManagerId: string | null | undefined = undefined;

    if (account_manager_id !== undefined) {
      if (account_manager_id === null || account_manager_id === '') {
        validatedManagerId = null;
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
        validatedManagerId = validMgr.id;
      }
    }

    if (account_tier !== undefined) {
      const validTiers = ['ENTERPRISE', 'CORPORATE', 'REGIONAL', 'SME'];
      if (!validTiers.includes(account_tier)) {
        return NextResponse.json({ error: `Invalid account tier: ${account_tier}` }, { status: 400 });
      }
    }

    if (account_status !== undefined) {
      const validStatuses = ['PROSPECT', 'ONBOARDING', 'ACTIVE', 'AT_RISK', 'SUSPENDED', 'CHURNED'];
      if (!validStatuses.includes(account_status)) {
        return NextResponse.json({ error: `Invalid account status: ${account_status}` }, { status: 400 });
      }
    }

    const updatedClient = await updateClientAccount(id, {
      name: name !== undefined ? name.trim() : undefined,
      account_tier,
      account_status,
      account_manager_id: validatedManagerId,
      email: email !== undefined ? (email ? email.trim() : null) : undefined,
      phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
      organisation_code: organisation_code !== undefined ? (organisation_code ? organisation_code.trim() : null) : undefined,
    });

    return NextResponse.json({ success: true, client: updatedClient });
  } catch (error: any) {
    console.error('[CLIENT_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

