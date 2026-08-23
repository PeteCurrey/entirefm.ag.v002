import { NextResponse } from 'next/server';
import { memoryStore } from '@/server/blog/store';
import { runWeeklyAutomationCycle } from '@/server/blog/automation';

export async function GET() {
  return NextResponse.json({
    settings: memoryStore.settings,
    jobs: memoryStore.jobs.slice(0, 20),
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (body._action === 'UPDATE_SETTINGS') {
    Object.assign(memoryStore.settings, body.settings);
    return NextResponse.json(memoryStore.settings);
  }
  if (body._action === 'RUN_CYCLE') {
    const result = await runWeeklyAutomationCycle();
    return NextResponse.json(result);
  }
  if (body._action === 'EMERGENCY_HOLD') {
    memoryStore.settings.emergencyHold = body.enabled;
    return NextResponse.json({ emergencyHold: memoryStore.settings.emergencyHold });
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
