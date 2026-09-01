/**
 * CANONICAL WORK ORDER DETAIL ROUTE — /clients/work-orders/[id]
 * =============================================================
 * Operational ticket lifecycle, SLA radar, evidence gallery,
 * arrival verification, and digital client sign-off.
 */

import React from 'react';
import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { computeSlaStatus } from '@/server/work';
import { WorkOrderDetailClient } from '@/components/work-orders/WorkOrderDetailClient';

export const metadata: Metadata = {
  title: 'Work Order Details — EntireFM Client Portal',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ClientWorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) {
    redirect(`/login?redirect=/clients/work-orders/${id}`);
  }

  // Fetch work order with relations
  const { data: wos, error } = await dbQuery<any[]>(
    `work_orders?id=eq.${encodeURIComponent(id)}&select=*,site:sites(id,name,site_code,address_line1,city,postcode,organisation_id),asset:assets(id,asset_reference,name,category,manufacturer,model),provider:organisations!work_orders_provider_organisation_id_fkey(id,name,phone,email),lead_engineer:persons!work_orders_lead_engineer_id_fkey(first_name,last_name,phone,email)`
  );

  if (error || !wos || wos.length === 0) {
    notFound();
  }

  const wo = wos[0];

  // Authorization check: Must match client organisation
  const isInternal = session.orgType === 'ENTIREFM' || session.viewAsContext?.isViewAs;
  if (!isInternal && session.orgType === 'CLIENT') {
    if (wo.organisation_id !== session.orgId && wo.site?.organisation_id !== session.orgId) {
      redirect('/login?error=forbidden_client');
    }
  }

  // Fetch timeline activities, visits, scans, quotes, and attachments
  const [activitiesRes, visitsRes, scansRes, quotesRes, docsRes] = await Promise.all([
    dbQuery<any[]>(
      `work_activities?work_order_id=eq.${encodeURIComponent(id)}&select=id,activity_type,message,metadata,created_at,actor:persons(first_name,last_name)&order=created_at.asc`
    ),
    dbQuery<any[]>(
      `visits?work_order_id=eq.${encodeURIComponent(id)}&select=*,assigned_resource:persons(first_name,last_name)&order=visit_number.asc`
    ),
    dbQuery<any[]>(
      `asset_scans?work_order_id=eq.${encodeURIComponent(id)}&select=id,scan_event_type,created_at,latitude,longitude,notes,person:persons(first_name,last_name)&order=created_at.desc`
    ),
    dbQuery<any[]>(
      `quotes?work_order_id=eq.${encodeURIComponent(id)}&select=id,quote_number,title,total_price_gbp,status,items,created_at&order=created_at.desc`
    ),
    dbQuery<any[]>(
      `documents?metadata->>work_order_id=eq.${encodeURIComponent(id)}&select=id,title,file_url,created_at`
    ),
  ]);

  const targetDate = wo.sla_resolution_due_at ? new Date(wo.sla_resolution_due_at) : (wo.target_completion_at ? new Date(wo.target_completion_at) : undefined);
  const isCompleted = ['COMPLETED', 'CLOSED'].includes(wo.status);
  const slaStatus = computeSlaStatus(targetDate, isCompleted);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <WorkOrderDetailClient
        workOrder={{
          ...wo,
          sla_status: slaStatus,
          activities: activitiesRes.data || [],
          visits: visitsRes.data || [],
          scans: scansRes.data || [],
          quotes: quotesRes.data || [],
          documents: docsRes.data || [],
        }}
        sessionUser={{
          id: session.personId || '',
          name: session.name,
          role: session.role,
          orgType: session.orgType,
        }}
      />
    </div>
  );
}
