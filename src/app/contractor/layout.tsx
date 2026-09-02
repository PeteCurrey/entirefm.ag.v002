/**
 * CONTRACTOR PORTAL LAYOUT — /contractor
 * =======================================
 * Dedicated contractor operating environment.
 * Data boundary: ONLY work assigned to this contractor's ProviderOrganisation.
 * A job at Site A does NOT grant general access to the Site A estate.
 */
import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { dbQuery } from '@/server/db/client';
import { ContractorHeader } from '@/components/contractor/ContractorHeader';

export const metadata: Metadata = {
  title: { absolute: 'Contractor Portal — EntireFM' },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ContractorLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/login?redirect=/contractor');
  }

  const isViewAs = !!session.viewAsContext?.isViewAs;

  // APPROVED suppliers (graduated from application stage) or CONTRACTOR sessions may access /contractor.
  // Unapproved suppliers are still in the application lifecycle → /supplier-portal.
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    if ((session.orgType as string) === 'SUPPLIER') {
      const { getSupplierUserByAuthId, getSupplierOrganisationById, getSupplierOrganisationByOwnerId } = await import(
        '@/server/suppliers/supplier-auth-store'
      );
      const authUserId = session.personId || session.authUserId || '';
      let supplierUser = await getSupplierUserByAuthId(authUserId);
      let supplierOrg = supplierUser?.organisation_id
        ? await getSupplierOrganisationById(supplierUser.organisation_id)
        : null;

      if (!supplierOrg) {
        supplierOrg = await getSupplierOrganisationByOwnerId(authUserId);
      }

      const isApprovedSupplier = supplierOrg?.lifecycleStatus === 'APPROVED';

      if (!isApprovedSupplier) {
        redirect('/supplier-portal?notice=under_review');
      }
    } else {
      redirect('/login?error=forbidden_contractor');
    }
  }

  // ── Authoritative Contractor Organisation Identity Resolution ──────────────
  const authUserId = session.personId || session.authUserId || '';
  let legalName = session.orgName || 'Contractor Organisation';
  let tradingName = '';
  let companyNumber = '';
  let orgStatus = 'APPROVED';

  try {
    // 1. Check supplier_organisations by orgId or owner_id
    const { getSupplierOrganisationById, getSupplierOrganisationByOwnerId } = await import(
      '@/server/suppliers/supplier-auth-store'
    );
    let sOrg = session.orgId ? await getSupplierOrganisationById(session.orgId) : null;
    if (!sOrg && authUserId) {
      sOrg = await getSupplierOrganisationByOwnerId(authUserId);
    }

    if (sOrg) {
      legalName = sOrg.legalName || legalName;
      tradingName = sOrg.tradingName || '';
      companyNumber = sOrg.companyNumber || '';
      orgStatus = sOrg.lifecycleStatus || 'APPROVED';
    } else if (session.orgId) {
      // 2. Check enterprise organisations table
      const { data: dbOrgs } = await dbQuery<any[]>(
        `organisations?id=eq.${encodeURIComponent(session.orgId)}&select=name,legal_name,company_number,status&limit=1`
      );
      if (dbOrgs && dbOrgs.length > 0) {
        const row = dbOrgs[0];
        legalName = row.legal_name || row.name || legalName;
        tradingName = row.name && row.name !== row.legal_name ? row.name : '';
        companyNumber = row.company_number || '';
        orgStatus = row.status || 'APPROVED';
      }
    }
  } catch (err) {
    console.warn('[CONTRACTOR_LAYOUT] Organisation resolution fallback to session metadata', err);
  }

  const shortDisplayName = tradingName || legalName || 'Contractor';
  const fullDisplayName =
    tradingName && tradingName !== legalName
      ? `${legalName} t/a ${tradingName}`
      : legalName;

  const contractorOrg = {
    id: session.orgId,
    legalName,
    tradingName: tradingName || shortDisplayName,
    companyNumber,
    status: orgStatus,
    fullDisplayName,
    shortDisplayName,
  };

  const user = {
    name: session.name || session.email || 'Contractor User',
    email: session.email || '',
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] font-sans selection:bg-[#EA580C] selection:text-white flex flex-col">
      <ContractorHeader
        user={user}
        contractorOrg={contractorOrg}
        isViewAs={isViewAs}
        operatorEmail={session.viewAsContext?.operatorEmail}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

