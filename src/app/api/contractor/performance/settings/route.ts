import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/server/db/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');

    if (!orgId) {
      return NextResponse.json({ error: 'Organisation ID required' }, { status: 400 });
    }

    const { data } = await dbQuery<any[]>(
      `organisations?id=eq.${encodeURIComponent(orgId)}&select=id,name,public_performance_visible&limit=1`
    );

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Organisation not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      publicPerformanceVisible: Boolean(data[0].public_performance_visible),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orgId, publicPerformanceVisible } = body;

    if (!orgId || typeof publicPerformanceVisible !== 'boolean') {
      return NextResponse.json({ error: 'Valid orgId and publicPerformanceVisible boolean required' }, { status: 400 });
    }

    const { data, error } = await dbQuery<any[]>(
      `organisations?id=eq.${encodeURIComponent(orgId)}`,
      {
        method: 'PATCH',
        body: { public_performance_visible: publicPerformanceVisible, updated_at: new Date().toISOString() },
        headers: { Prefer: 'return=representation' },
      }
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      publicPerformanceVisible,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
