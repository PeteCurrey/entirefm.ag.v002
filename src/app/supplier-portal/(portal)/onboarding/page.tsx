import React from 'react';
import { OnboardingWizardClient } from '@/components/supplier-portal/OnboardingWizardClient';
import { getCurrentSession } from '@/server/identity';
import {
  getSupplierOrganisationById,
  getSupplierOrganisationByOwnerId,
  getOrCreateApplicationDraft,
  validateSupplierAuthUser,
  setSupplierUserOrganisation,
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

  let orgId =
    authState?.supplierUser?.organisation_id ||
    (session?.orgId && session.orgId !== session?.personId ? session.orgId : '');

  if (!orgId && authState?.authUser?.id) {
    const ownedOrg = await getSupplierOrganisationByOwnerId(authState.authUser.id);
    if (ownedOrg) {
      orgId = ownedOrg.id;
      if (authState.supplierUser && !authState.supplierUser.organisation_id) {
        await setSupplierUserOrganisation(authState.authUser.id, ownedOrg.id);
      }
    }
  }

  let draft = null;
  let initialLegalName = '';
  let initialTradingName = '';
  let initialCompanyNumber = '';
  let initialAppRef = '';

  if (orgId) {
    let org = await getSupplierOrganisationById(orgId);
    if (!org && authState?.authUser?.id) {
      org = await getSupplierOrganisationByOwnerId(authState.authUser.id);
    }
    if (org) {
      initialLegalName = org.legalName || '';
      initialTradingName = org.tradingName || '';
      initialCompanyNumber = org.companyNumber || '';
      initialAppRef = org.applicationReference || '';
    }
    draft = await getOrCreateApplicationDraft(orgId);
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
          Supplier Qualification Application
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Complete your trade capabilities, assurance credentials, health &amp; safety standards, and compliance profile. Progress is saved automatically.
        </p>
      </div>

      <OnboardingWizardClient
        initialOrgId={orgId}
        initialAppRef={initialAppRef}
        initialLegalName={initialLegalName}
        initialTradingName={initialTradingName}
        initialCompanyNumber={initialCompanyNumber}
        initialDraft={draft}
      />
    </div>
  );
}
