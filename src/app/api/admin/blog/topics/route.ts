import { NextResponse } from 'next/server';
import { memoryStore } from '@/server/blog/store';
import { runTopicDiscovery } from '@/server/blog/research';

export async function GET() {
  return NextResponse.json(memoryStore.topics);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body._action === 'DISCOVER') {
      const discovered = await runTopicDiscovery();
      return NextResponse.json({ discovered: discovered.length, topics: memoryStore.topics });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
