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
    <div className="space-y-6 font-sans">
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 shadow-xs">
        <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">Work Orders &amp; Assignments</h1>
        <p className="text-[#6D6D68] text-xs mt-1 leading-relaxed">
          Review offers, accept or decline dispatches, and track job lifecycle.
        </p>
      </div>

      <ContractorWorkClient initialAssignments={assignments} />
    </div>
  );
}
