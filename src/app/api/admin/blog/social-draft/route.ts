import { NextResponse } from 'next/server';
import { generateLinkedInDraft } from '@/server/newsletter/linkedin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const draft = generateLinkedInDraft(body);
    return NextResponse.json({ success: true, draft });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
