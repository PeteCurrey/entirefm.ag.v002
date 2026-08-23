import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect, notFound } from 'next/navigation';
import FieldJobScreen from '@/components/engineer/FieldJobScreen';

export const dynamic = 'force-dynamic';

export default async function VisitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  // Fetch visit with related data
  const { data: visits } = await dbQuery<any[]>(
    `visits?id=eq.${id}&select=*,work_order:work_orders(*),site:sites(*),asset:assets(*)`
  );

  if (!visits || visits.length === 0) notFound();
  const visit = visits[0];

  // Verify this engineer owns or is assigned to this visit
  if (visit.engineer_person_id !== session.personId && !['CEO', 'ADMINISTRATOR', 'OPERATIONS_MANAGER'].includes(session.role)) {
    redirect('/engineer');
  }

  // Fetch tasks for this visit's work order
  const { data: tasks } = visit.work_order_id
    ? await dbQuery<any[]>(`work_order_tasks?work_order_id=eq.${visit.work_order_id}&order=sequence_order.asc&select=*`)
    : { data: [] };

  // Fetch existing readings and parts
  const [readingsRes, partsRes] = await Promise.all([
    dbQuery<any[]>(`field_readings?visit_id=eq.${id}&order=captured_at.asc&select=*`),
    dbQuery<any[]>(`field_parts_used?visit_id=eq.${id}&order=created_at.asc&select=*`),
  ]);

  // Fetch service report if exists
  const { data: reports } = await dbQuery<any[]>(`service_reports?visit_id=eq.${id}&order=created_at.desc&select=*`);

  return (
    <FieldJobScreen
      visit={visit}
      tasks={tasks || []}
      readings={readingsRes.data || []}
      parts={partsRes.data || []}
      serviceReport={reports?.[0] ?? null}
      session={{ personId: session.personId, displayName: session.name ?? 'Engineer' }}
    />
  );
}
