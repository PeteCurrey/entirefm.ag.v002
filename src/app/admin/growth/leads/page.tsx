import { Metadata } from 'next';
import { listExtendedLeads } from '@/server/growth/store';
import { LeadsWorkspaceClient } from '@/components/admin/growth/LeadsWorkspaceClient';

export const metadata: Metadata = {
  title: 'Inbound Leads & Qualification — EntireCAFM',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function GrowthLeadsPage() {
  const { leads, total } = await listExtendedLeads({ limit: 200 });

  return <LeadsWorkspaceClient initialLeads={leads} totalCount={total} />;
}

