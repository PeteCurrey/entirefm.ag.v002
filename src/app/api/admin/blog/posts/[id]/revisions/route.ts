import { NextRequest, NextResponse } from 'next/server';
import { listPostRevisions } from '@/server/blog/posts';

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const revisions = await listPostRevisions(id);
  return NextResponse.json(revisions);
}
