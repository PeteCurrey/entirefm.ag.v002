import React from 'react';
import type { Metadata } from 'next';
import { getSupplierOnboardingDraft } from '@/server/suppliers/store';
import { getOrCreateApplicationDraft } from '@/server/suppliers/supplier-auth-store';
import { listSupplierRfis, getSupplierDecision } from '@/server/suppliers/rfi-store';
import { AdminApplicationReviewClient } from '@/components/admin/suppliers/AdminApplicationReviewClient';

export const metadata: Metadata = {
  title: 'Review Supplier Application | EntireFM Admin',
  description: 'Technical assurance review, RFI creation, and scoped service/geographic approval.',
};

export default async function AdminApplicationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let draft: any = await getSupplierOnboardingDraft(id);
  
  // Merge in Supabase auth-store draft if present
  try {
    const authDraft = await getOrCreateApplicationDraft(id);
    if (authDraft) {
      draft = {
        ...draft,
        ...authDraft,
        legalCompanyName: authDraft.legalCompanyName || draft.legal_company_name,
        tradingName: authDraft.tradingName || draft.trading_name,
        companyNumber: authDraft.companyNumber || draft.company_number,
        vatNumber: authDraft.vatNumber || draft.vat_number,
        selectedServices: authDraft.selectedServices?.length ? authDraft.selectedServices : draft.selected_service_slugs,
        selectedRegions: authDraft.selectedRegions?.length ? authDraft.selectedRegions : draft.selected_regions,
        documentVault: authDraft.documentVault || [],
      };
    }
  } catch (err) {
    // Fallback to strategy store draft
  }

  const rfis = await listSupplierRfis(id);
  const decision = await getSupplierDecision(id);

  return (
    <div className="space-y-6">
      <AdminApplicationReviewClient draft={draft} rfis={rfis} decision={decision} />
    </div>
  );
}
