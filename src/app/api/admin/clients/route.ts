import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listClientAccounts, createClientAccount, getClientAccount } from '@/server/estate';
import { validateAccountManager } from '@/server/estate/account-managers';


export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const clients = await listClientAccounts();
    return NextResponse.json({ success: true, clients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      account_tier,
      account_status,
      email,
      phone,
      organisation_code,
      account_manager_id,
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Client name is required.' }, { status: 400 });
    }

    // Server-side validate account_manager_id when provided
    let validatedManagerId: string | undefined;
    if (account_manager_id) {
      if (typeof account_manager_id !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Invalid account_manager_id format.' },
          { status: 400 }
        );
      }
      const manager = await validateAccountManager(account_manager_id);
      if (!manager) {
        return NextResponse.json(
          {
            success: false,
            error:
              'The selected account manager does not exist, is inactive, or is not authorised to manage client accounts.',
          },
          { status: 422 }
        );
      }
      validatedManagerId = manager.id;
    }

    const client = await createClientAccount({
      name: name.trim(),
      account_tier,
      account_status,
      email,
      phone,
      organisation_code,
      account_manager_id: validatedManagerId,
    });

    // Fetch the full client record with joins so the response matches ClientAccount shape
    const fullClient = await getClientAccount(client.id);

    return NextResponse.json({ success: true, client: fullClient || client }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
