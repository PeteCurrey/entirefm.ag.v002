import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { parseAssetImportSource, commitImportedAssets } from '@/server/assets/asset-import-service';

export const dynamic = 'force-dynamic';

/**
 * POST /api/assets/import
 * Parses schedule source, extracts candidates & executes duplicate reconciliation.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized — sign in required' }, { status: 401 });
    }

    const body = await req.json();
    const result = await parseAssetImportSource(body, session);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to parse import source' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API_ASSET_IMPORT_PARSE_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error parsing import source' }, { status: 500 });
  }
}

/**
 * PUT /api/assets/import
 * Commits confirmed candidate assets into the live database.
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized — sign in required' }, { status: 401 });
    }

    const body = await req.json();
    const { candidates, siteId } = body;

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: 'No candidate assets provided for import' }, { status: 400 });
    }

    const result = await commitImportedAssets(candidates, session, siteId);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to commit assets' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API_ASSET_IMPORT_COMMIT_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error committing assets' }, { status: 500 });
  }
}
