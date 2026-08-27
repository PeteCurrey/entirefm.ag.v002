import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listVaultDocuments } from '@/server/contractor/document-vault-service';
import { DocumentVaultClient } from '@/components/contractor/DocumentVaultClient';

export const metadata: Metadata = {
  title: 'Document Vault | EntireFM Contractor Platform',
  description: 'Secure, multi-version document repository for FM contractor insurances, accreditations, and policies.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorDocumentsPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?redirect=/contractor/documents');
  }

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const orgId = session.orgId;
  const initialDocuments = await listVaultDocuments(
    {
      contractorOrgId: orgId,
      category: 'ALL',
      verificationState: 'ALL',
      expiryWindow: 'ALL',
    },
    session
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
          DIGITAL SUPPLY CHAIN INFRASTRUCTURE
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Contractor Document Vault
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-xl">
          Continuous record of statutory insurance policies, trade accreditations, RAMS samples, and company governance.
        </p>
      </div>

      <DocumentVaultClient initialDocuments={initialDocuments} orgId={orgId} />
    </div>
  );
}
