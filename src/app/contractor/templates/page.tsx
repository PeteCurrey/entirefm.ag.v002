import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import { listContractorDocuments } from '@/server/contractor/document-engine';
import { TemplateLibraryClient } from '@/components/contractor/TemplateLibraryClient';

export const metadata: Metadata = {
  title: 'Business Documents & Templates — Contractor Business Toolkit | EntireFM',
  description: 'Editable, reusable trade templates, RAMS, and service reports branded to your business.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ContractorTemplatesPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?redirect=/contractor/templates');
  }

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const documents = await listContractorDocuments(session.orgId, session);

  return (
    <TemplateLibraryClient
      initialDocuments={documents}
      contractorOrgId={session.orgId}
    />
  );
}
