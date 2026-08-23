import { NextResponse } from 'next/server';
import { generateWeeklyBriefingDraft } from '@/server/newsletter/automation';
import { getAutomationSettings, updateAutomationSettings } from '@/server/newsletter/store';

export async function GET() {
  const settings = await getAutomationSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const updated = await updateAutomationSettings(body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const issueNumber = body.issueNumber || 1;
    const result = await generateWeeklyBriefingDraft(issueNumber);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
