import { getCurrentSession } from '@/server/identity';
import { getVisitById } from '@/server/field/operations-store';
import { dbQuery } from '@/server/db/client';
import { notFound } from 'next/navigation';
import FieldJobScreen from '@/components/engineer/FieldJobScreen';

export const dynamic = 'force-dynamic';

export default async function VisitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentSession();

  // Look in operations store first (for in-memory simulations)
  const memoryVisit = await getVisitById(id);

  if (memoryVisit) {
    return (
      <FieldJobScreen
        visit={memoryVisit}
        tasks={memoryVisit.ppm_tasks || []}
        readings={[]}
        parts={memoryVisit.parts_used || []}
        serviceReport={memoryVisit.service_report ?? null}
        session={{
          personId: session?.personId || '',
          displayName: session?.name || 'Field Operative',
        }}
      />
    );
  }

  // Query canonical visits table
  let { data: visits } = await dbQuery<any[]>(
    `visits?id=eq.${encodeURIComponent(id)}&select=*,work_order:work_orders(*),site:sites(*),asset:assets(*)`
  );

  // If not found as visit ID, check if ID corresponds to a work_order
  if (!visits || visits.length === 0) {
    const { data: woData } = await dbQuery<any[]>(
      `work_orders?id=eq.${encodeURIComponent(id)}&select=*,site:sites(*),asset:assets(*)`
    );
    if (woData && woData.length > 0) {
      const wo = woData[0];
      // Check if a visit exists for this work order
      const { data: existingVisits } = await dbQuery<any[]>(
        `visits?work_order_id=eq.${encodeURIComponent(wo.id)}&order=created_at.desc&limit=1&select=*,work_order:work_orders(*),site:sites(*),asset:assets(*)`
      );
      if (existingVisits && existingVisits.length > 0) {
        visits = existingVisits;
      } else {
        // Construct a synthetic visit view from the canonical work order
        visits = [
          {
            id: `WO-VIS-${wo.id}`,
            work_order_id: wo.id,
            work_order: wo,
            site: wo.site,
            asset: wo.asset,
            status: wo.status,
            scheduled_start_at: wo.target_start_at || wo.created_at,
            scheduled_end_at: wo.target_completion_at,
            site_notes: wo.description,
          },
        ];
      }
    }
  }

  if (!visits || visits.length === 0) notFound();
  const visit = visits[0];

  // Fetch tasks for this visit's work order using canonical 'tasks' table
  const workOrderId = visit.work_order_id || visit.work_order?.id;
  const { data: tasks } = workOrderId
    ? await dbQuery<any[]>(
        `tasks?work_order_id=eq.${encodeURIComponent(workOrderId)}&order=sequence.asc&select=*`
      )
    : { data: [] };

  // Fetch existing readings and parts if available
  const [readingsRes, partsRes] = await Promise.all([
    dbQuery<any[]>(`field_readings?visit_id=eq.${encodeURIComponent(visit.id)}&order=captured_at.asc&select=*`),
    dbQuery<any[]>(`field_parts_used?visit_id=eq.${encodeURIComponent(visit.id)}&order=created_at.asc&select=*`),
  ]);

  // Fetch service report if exists
  const { data: reports } = await dbQuery<any[]>(
    `service_reports?visit_id=eq.${encodeURIComponent(visit.id)}&order=created_at.desc&select=*`
  );

  return (
    <FieldJobScreen
      visit={visit}
      tasks={tasks || []}
      readings={readingsRes.data || []}
      parts={partsRes.data || []}
      serviceReport={reports?.[0] ?? null}
      session={{
        personId: session?.personId || '',
        displayName: session?.name || 'Field Operative',
      }}
    />
  );
}
