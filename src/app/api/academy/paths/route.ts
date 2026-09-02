import { NextResponse } from 'next/server';
import { listPublishedPaths } from '@/server/academy/academy-store';

/**
 * GET /api/academy/paths
 * =======================
 * Returns all published learning paths.
 */
export async function GET() {
  try {
    const paths = await listPublishedPaths();
    return NextResponse.json({ paths });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to list learning paths.' },
      { status: 500 }
    );
  }
}
