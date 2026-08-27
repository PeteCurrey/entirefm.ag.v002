import { NextResponse } from 'next/server';
import { searchLobby } from '@/server/search/lobby-search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const filterGroup = searchParams.get('group') || undefined;

  const result = await searchLobby(q, { filterGroup });
  return NextResponse.json(result);
}
