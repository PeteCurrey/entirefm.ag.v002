import { Metadata } from 'next';
import { getCurrentSession, requireContractorSession } from '@/server/identity';
import {
  getPersonalisedContractorIntelligence,
  evaluateCompanyWatch,
  evaluateCredentialWatch,
} from '@/server/intelligence/intelligence-engine';
import { ContractorIntelligenceClient } from '@/components/contractor/ContractorIntelligenceClient';

export const metadata: Metadata = {
  title: 'Contractor Intelligence & Compliance Watch | EntireFM',
  description: 'Authoritative statutory updates, safety notices, and credential surveillance for EntireFM contractor partners.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorIntelligencePage() {
  const session = await getCurrentSession();
  const validSession = requireContractorSession(session);

  const orgId = validSession.orgId;

  const [feed, companyWatch, credentialWatch] = await Promise.all([
    getPersonalisedContractorIntelligence(orgId, validSession),
    evaluateCompanyWatch(orgId, validSession),
    evaluateCredentialWatch(orgId, validSession),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ContractorIntelligenceClient
        initialFeed={feed}
        initialCompanyWatch={companyWatch}
        initialCredentialWatch={credentialWatch}
      />
    </div>
  );
}
