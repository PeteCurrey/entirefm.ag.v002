import { getCurrentSession } from '@/server/identity';
import { listContractorAssignments } from '@/server/supply-chain';
import { redirect } from 'next/navigation';
import EmptyState from '@/components/admin/EmptyState';
import ContractorWorkClient from '@/components/contractor/ContractorWorkClient';

export const dynamic = 'force-dynamic';

export default async function ContractorWorkPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const orgId = session.orgId || session.personId;
  const assignments = await listContractorAssignments(orgId, undefined, session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Work Orders & Assignments</h1>
        <p className="text-brand-mist text-sm mt-1">Review offers, accept or decline dispatches, and track job lifecycle.</p>
      </div>

      <ContractorWorkClient initialAssignments={assignments} />
    </div>
  );
}
