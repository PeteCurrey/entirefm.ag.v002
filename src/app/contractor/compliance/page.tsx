import { getCurrentSession } from '@/server/identity';
import { listContractorComplianceDocuments } from '@/server/supply-chain';
import { redirect } from 'next/navigation';
import ContractorComplianceClient from '@/components/contractor/ContractorComplianceClient';

export const dynamic = 'force-dynamic';

export default async function ContractorCompliancePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const orgId = session.orgId || session.personId;
  const docs = await listContractorComplianceDocuments(orgId, session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Compliance & Accreditations</h1>
        <p className="text-brand-mist text-sm mt-1">
          Maintain insurance, health & safety policies, and trade body accreditations for automated dispatch validation.
        </p>
      </div>

      <ContractorComplianceClient initialDocs={docs} orgId={orgId} />
    </div>
  );
}
