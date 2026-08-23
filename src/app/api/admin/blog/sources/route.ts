import { NextResponse } from 'next/server';
import { memoryStore } from '@/server/blog/store';
import { BlogSource } from '@/server/blog/types';

export async function GET() {
  return NextResponse.json(memoryStore.sources);
}

export async function POST(req: Request) {
  const body = await req.json();
  const source: BlogSource = {
    id: `src-${Date.now()}`,
    name: body.name,
    url: body.url,
    publisher: body.publisher,
    dateAccessed: new Date().toISOString(),
    sourceType: body.sourceType || 'REGULATORY_SPECIFICATION',
    trustLevel: body.trustLevel || 'OFFICIAL_GOV',
    notes: body.notes,
    postCount: 0,
  };
  memoryStore.sources.push(source);
  return NextResponse.json(source, { status: 201 });
}
