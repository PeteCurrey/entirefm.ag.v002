import React from 'react';
import { OnboardingWizardClient } from '@/components/supplier-portal/OnboardingWizardClient';
import { getCurrentSession } from '@/server/identity';
import {
  getSupplierOrganisationById,
  getOrCreateApplicationDraft,
  validateSupplierAuthUser,
} from '@/server/suppliers/supplier-auth-store';

export const metadata = {
  title: 'Supplier Application | EntireFM Partner Network',
  description: 'Complete your supplier qualification, trade accreditation, and company assurance profile.',
};

export default async function OnboardingWizardPage() {
  const session = await getCurrentSession();
  const authState = session
    ? await validateSupplierAuthUser(session.personId || session.authUserId || '')
    : null;

  const orgId =
    authState?.supplierUser?.organisation_id ||
    (session?.orgId && session.orgId !== session?.personId ? session.orgId : '');

  let initialLegalName = '';
  let initialTradingName = '';
  let initialCompanyNumber = '';
  let initialAppRef = '';

  if (orgId) {
    const org = await getSupplierOrganisationById(orgId);
    if (org) {
      initialLegalName = org.legalName || '';
      initialTradingName = org.tradingName || '';
      initialCompanyNumber = org.companyNumber || '';
      initialAppRef = org.applicationReference || '';
    }
    const draft = await getOrCreateApplicationDraft(orgId);
    if (draft) {
      if (!initialLegalName) initialLegalName = draft.legalCompanyName || '';
      if (!initialTradingName) initialTradingName = draft.tradingName || '';
      if (!initialCompanyNumber) initialCompanyNumber = draft.companyNumber || '';
      if (!initialAppRef) initialAppRef = draft.applicationReference || '';
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
        initialCompanyNumber={initialCompanyNumber}
      />
    </div>
  );
}
