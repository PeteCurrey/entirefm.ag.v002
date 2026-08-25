import React from 'react';
import type { Metadata } from 'next';
import { getSupplierOnboardingDraft } from '@/server/suppliers/store';
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
  const draft = await getSupplierOnboardingDraft(id);
  const rfis = await listSupplierRfis(id);
  const decision = await getSupplierDecision(id);

  return (
    <div className="space-y-6">
      <AdminApplicationReviewClient draft={draft} rfis={rfis} decision={decision} />
    </div>
  );
}
