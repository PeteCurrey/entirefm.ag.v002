import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { getWorkOrder, updateWorkOrderStatus, deleteWorkOrder, WorkStatus } from '@/server/work';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getCurrentSession();
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const workOrder = await getWorkOrder(id);

    if (!workOrder) {
      return NextResponse.json({ success: false, error: 'Work order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, workOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await getCurrentSession();
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { status, notes, priority, title, description } = body;

    let updatedWo;

    if (status) {
      updatedWo = await updateWorkOrderStatus(id, status as WorkStatus, {
        session: session || undefined,
        notes,
      });
    }

    // If other fields need updating
    if (priority || title || description) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const filter = isUuid ? `id=eq.${encodeURIComponent(id)}` : `work_order_number=eq.${encodeURIComponent(id)}`;
      const updates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (priority) updates.priority = priority;
      if (title) updates.title = title.trim();
      if (description) updates.description = description.trim();

      const { data, error } = await dbQuery(`work_orders?${filter}`, {
        method: 'PATCH',
        body: updates,
      });

      if (error) {
        throw new Error(error);
      }
      if (data?.[0]) updatedWo = data[0];
    }

    return NextResponse.json({ success: true, workOrder: updatedWo });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getCurrentSession();
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    await deleteWorkOrder(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
