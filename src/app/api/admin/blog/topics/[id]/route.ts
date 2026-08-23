import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/server/blog/store';
import { generateDraftFromTopic } from '@/server/blog/generation';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const topic = memoryStore.topics.find((t) => t.id === id);
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (body._action === 'APPROVE') {
    topic.status = 'APPROVED';
    return NextResponse.json(topic);
  }
  if (body._action === 'REJECT') {
    topic.status = 'REJECTED';
    return NextResponse.json(topic);
  }
  if (body._action === 'GENERATE') {
    const post = await generateDraftFromTopic(topic);
    return NextResponse.json(post);
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
