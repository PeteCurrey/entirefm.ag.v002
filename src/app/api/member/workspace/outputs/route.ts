import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { listSavedToolOutputs, saveToolOutput } from '@/server/workspace/workspace-store';

const SaveOutputSchema = z.object({
  site_profile_id: z.string().uuid().nullable().optional(),
  tool_name: z.string().min(1, 'Tool name is required'),
  title: z.string().max(150).nullable().optional(),
  inputs_json: z.record(z.any()).default({}),
  outputs_json: z.record(z.any()).default({}),
  summary_kpis: z.record(z.any()).default({}),
  pdf_reference: z.string().nullable().optional(),
});

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteProfileId = searchParams.get('siteProfileId') || undefined;
  const toolName = searchParams.get('toolName') || undefined;

  try {
    const outputs = await listSavedToolOutputs(session.memberId, { siteProfileId, toolName });
    return NextResponse.json({ success: true, data: outputs }, { status: 200 });
  } catch (err: any) {
    console.error('[WORKSPACE_OUTPUTS_GET_ERROR]:', err);
    return NextResponse.json({ success: false, error: 'FETCH_FAILED' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = SaveOutputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_FAILED', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const saved = await saveToolOutput(session.memberId, parsed.data);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err: any) {
    console.error('[WORKSPACE_OUTPUTS_POST_ERROR]:', err);
    return NextResponse.json({ success: false, error: 'SAVE_FAILED' }, { status: 500 });
  }
}
