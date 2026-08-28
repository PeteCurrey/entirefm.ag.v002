import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSupplierApplicationById } from '@/server/suppliers/applications-repo';
import { listSupplierRfis, getSupplierDecision } from '@/server/suppliers/rfi-store';
import { AdminApplicationReviewClient } from '@/components/admin/suppliers/AdminApplicationReviewClient';

export const metadata: Metadata = {
  title: 'Review Supplier Application | EntireFM Admin',
  description: 'Technical assurance review, RFI creation, and scoped service/geographic approval.',
};

export const dynamic = 'force-dynamic';

export default async function AdminApplicationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load canonical application from live Supabase data
  const app = await getSupplierApplicationById(id);
  if (!app) {
    notFound();
  }

  const rfis = await listSupplierRfis(id);
  const decision = await getSupplierDecision(id);

  // Shape into draft-compatible shape for AdminApplicationReviewClient
  const draft = {
    supplier_id: app.id,
    application_reference: app.applicationReference,
    legalCompanyName: app.companyName,
    legal_company_name: app.companyName,
    tradingName: app.tradingName,
    trading_name: app.tradingName,
    companyNumber: app.companyNumber,
    company_number: app.companyNumber,
    vatNumber: app.vatNumber,
    vat_number: app.vatNumber,
    primaryContactName: app.applicantName,
    primaryContactEmail: app.applicantEmail,
    generalEmail: app.applicantEmail,
    selectedServices: app.trades,
    selected_service_slugs: app.trades,
    selectedRegions: app.coverage,
    selected_regions: app.coverage,
    lifecycleStatus: app.status,
    status: app.status,
    currentStep: app.currentStep,
    current_step: app.currentStep,
    documentVault: app.documents || [],
    created_at: app.createdAt,
    updated_at: app.updatedAt,
    submitted_at: app.submittedAt,
    recordOrigin: app.recordOrigin,
    ...(app.rawDraft || {}),
  };

  return (
    <div className="space-y-6">
      <AdminApplicationReviewClient draft={draft} rfis={rfis} decision={decision} />
    </div>
  );
}
