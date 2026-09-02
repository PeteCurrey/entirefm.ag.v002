import { NextResponse } from 'next/server';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import {
  findPlausibleMatches,
  confirmEstateClientLink,
  dismissEstateClientSuggestion,
  unlinkEstateClientAsset,
  getLinkedClientAsset,
} from '@/server/estate/client-asset-matcher';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = getMemberSessionFromRequest(request);
    if (!session || !session.authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const estateAssetId = url.searchParams.get('estateAssetId');
    const serialNumber = url.searchParams.get('serialNumber');
    const manufacturer = url.searchParams.get('manufacturer');
    const model = url.searchParams.get('model');
    const assetType = url.searchParams.get('assetType');

    if (!estateAssetId) {
      return NextResponse.json({ error: 'estateAssetId is required' }, { status: 400 });
    }

    // Check if already linked
    const linkedRecord = await getLinkedClientAsset(session.authUserId, estateAssetId);

    // Find plausible suggestions
    const matches = linkedRecord
      ? []
      : await findPlausibleMatches(session.authUserId, {
          id: estateAssetId,
          serialNumber,
          manufacturer,
          model,
          assetType,
        });

    return NextResponse.json({
      success: true,
      isLinked: Boolean(linkedRecord),
      linkedClientAsset: linkedRecord?.client_asset || null,
      matches,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = getMemberSessionFromRequest(request);
    if (!session || !session.authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, estateAssetId, clientAssetId } = body;

    if (!action || !estateAssetId || !clientAssetId) {
      return NextResponse.json(
        { error: 'action, estateAssetId, and clientAssetId are required' },
        { status: 400 }
      );
    }

    if (action === 'confirm') {
      const result = await confirmEstateClientLink(
        session.authUserId,
        estateAssetId,
        clientAssetId
      );
      return NextResponse.json(result);
    }

    if (action === 'dismiss') {
      const success = await dismissEstateClientSuggestion(
        session.authUserId,
        estateAssetId,
        clientAssetId
      );
      return NextResponse.json({ success });
    }

    if (action === 'unlink') {
      const success = await unlinkEstateClientAsset(
        session.authUserId,
        estateAssetId,
        clientAssetId
      );
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
