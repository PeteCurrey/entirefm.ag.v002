import React from 'react';
import { OnboardingWizardClient } from '@/components/supplier-portal/OnboardingWizardClient';
import { getCurrentSession } from '@/server/identity';
import { getSupplierOrganisationById, getOrCreateApplicationDraft } from '@/server/suppliers/supplier-auth-store';

export const metadata = {
  title: 'Supplier Application | EntireFM Partner Network',
  description: 'Complete your supplier qualification, trade accreditation, and company assurance profile.',
};

export default async function OnboardingWizardPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';

  let initialLegalName = '';
  let initialTradingName = '';
  let initialAppRef = '';

  if (orgId && orgId !== session?.personId) {
    const org = await getSupplierOrganisationById(orgId);
    if (org) {
      initialLegalName = org.legalName || '';
      initialTradingName = org.tradingName || '';
      initialAppRef = org.applicationReference || '';
    }
    const draft = await getOrCreateApplicationDraft(orgId);
    if (draft && !initialAppRef) {
      initialAppRef = draft.applicationReference || '';
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
          Supplier Application
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Complete your company profile and supplier assurance information. Your progress is saved automatically.
        </p>
      </div>

      <OnboardingWizardClient
        initialOrgId={orgId}
        initialAppRef={initialAppRef}
        initialLegalName={initialLegalName}
        initialTradingName={initialTradingName}
      />
    </div>
  );
}
