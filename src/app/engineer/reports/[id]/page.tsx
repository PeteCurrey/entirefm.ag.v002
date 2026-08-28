import { getCurrentSession } from '@/server/identity';
import { getReportInstanceById, canUserAccessReport } from '@/server/field-reports';
import { redirect, notFound } from 'next/navigation';
import ReportViewerClient from '@/components/field-reports/ReportViewerClient';

export const dynamic = 'force-dynamic';

export default async function FieldReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) {
    redirect(`/login?redirect=/engineer/reports/${id}`);
  }

  const pack = await getReportInstanceById(id);
  if (!pack) {
    notFound();
  }

  const authCheck = canUserAccessReport(session, pack.instance);
  if (!authCheck.allowed) {
    redirect('/engineer/jobs?error=unauthorised_report');
  }

  const isReadOnly = pack.instance.status === 'ISSUED' || pack.instance.status === 'SUPERSEDED';

  return <ReportViewerClient initialPack={pack} isReadOnly={isReadOnly} />;
}
