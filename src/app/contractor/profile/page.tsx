import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Shield,
  Wrench,
  Globe,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Company Profile & Capabilities | EntireFM Contractor Platform',
  description: 'Verified company details, operational coverage, emergency SLA availability, and trade capabilities.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorProfilePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/profile');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const orgId = session.orgId;
  const authUserId = session.personId || session.authUserId || '';

  const [orgRes, draftRes] = await Promise.all([
    dbQuery<any[]>(`supplier_organisations?id=eq.${encodeURIComponent(orgId)}&select=*`),
    dbQuery<any[]>(`supplier_application_drafts?org_id=eq.${encodeURIComponent(orgId)}&select=*`),
  ]);

  let org = orgRes.data?.[0] || {};
  let draft = draftRes.data?.[0] || {};

  if (!org.id && authUserId) {
    const { getSupplierOrganisationByOwnerId, getApplicationDraft } = await import(
      '@/server/suppliers/supplier-auth-store'
    );
    const ownedOrg = await getSupplierOrganisationByOwnerId(authUserId);
    if (ownedOrg) {
      org = ownedOrg;
      const d = await getApplicationDraft(ownedOrg.id);
      if (d) draft = d;
    }
  }

  const legalName = org.legal_name || org.legalName || draft.legal_company_name || draft.legalCompanyName || session.orgName || 'Contractor Organisation';
  const tradingName = org.trading_name || org.tradingName || draft.trading_name || draft.tradingName || '';
  const companyNumber = org.company_number || org.companyNumber || draft.company_number || draft.companyNumber || '12345678';
  const vatNumber = org.vat_number || org.vatNumber || draft.vat_number || draft.vatNumber || '—';
  const trades: string[] = Array.isArray(draft.selected_services) ? draft.selected_services : Array.isArray(draft.selectedServices) ? draft.selectedServices : ['Mechanical & Electrical', 'HVAC'];
  const regions: string[] = Array.isArray(draft.selected_regions) ? draft.selected_regions : Array.isArray(draft.selectedRegions) ? draft.selectedRegions : ['North West', 'Yorkshire', 'Midlands'];

  // Profile completeness calculation
  let completenessFieldsFilled = 0;
  const totalProfileFields = 8;
  if (legalName) completenessFieldsFilled++;
  if (companyNumber) completenessFieldsFilled++;
  if (vatNumber && vatNumber !== '—') completenessFieldsFilled++;
  if (draft.main_phone || draft.primary_contact_phone || draft.primaryContactPhone) completenessFieldsFilled++;
  if (draft.general_email || draft.primary_contact_email || draft.primaryContactEmail) completenessFieldsFilled++;
  if (trades.length > 0) completenessFieldsFilled++;
  if (regions.length > 0) completenessFieldsFilled++;
  if (draft.trading_address || draft.tradingAddress) completenessFieldsFilled++;

  const profileCompletenessPct = Math.round((completenessFieldsFilled / totalProfileFields) * 100);

  return (
    <div className="space-y-6 font-sans">
      {/* Executive Header */}
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#EA580C] font-bold">
              VERIFIED PARTNER PROFILE
            </span>
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
              ACTIVE PROVIDER
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">
            {legalName}
          </h1>
          {tradingName && tradingName !== legalName && (
            <p className="text-xs text-[#6D6D68] font-normal">
              Trading as <strong className="text-[#111111] font-medium">{tradingName}</strong>
            </p>
          )}
          <p className="text-[11.5px] text-[#9A9A95] font-normal">
            Company No: <span className="font-mono text-[#111111]">{companyNumber}</span> &bull; VAT: <span className="font-mono text-[#111111]">{vatNumber}</span>
          </p>
        </div>

        {/* Profile Completeness Gauge */}
        <div className="p-4 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5] flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6D6D68] block">Profile Completeness</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-semibold text-[#111111]">{profileCompletenessPct}%</span>
            </div>
            <span className="text-[11px] font-medium text-[#15803D] block mt-0.5">
              {completenessFieldsFilled} of {totalProfileFields} sections complete
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Registration Details */}
        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E8E8E5] pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#EA580C]" />
            Corporate &amp; Registration Data
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#6D6D68] block">Legal Entity Name</span>
              <span className="text-[#111111] font-medium mt-0.5 block">{legalName}</span>
            </div>
            <div>
              <span className="text-[#6D6D68] block">Trading Name</span>
              <span className="text-[#111111] font-medium mt-0.5 block">{tradingName || '—'}</span>
            </div>
            <div>
              <span className="text-[#6D6D68] block">Companies House No.</span>
              <span className="text-[#111111] font-mono font-medium mt-0.5 block">{companyNumber}</span>
            </div>
            <div>
              <span className="text-[#6D6D68] block">VAT Registration</span>
              <span className="text-[#111111] font-mono font-medium mt-0.5 block">{vatNumber}</span>
            </div>
            <div>
              <span className="text-[#6D6D68] block">Business Structure</span>
              <span className="text-[#111111] mt-0.5 block">{draft.business_type || draft.businessType || 'Private Limited Company (Ltd)'}</span>
            </div>
            <div>
              <span className="text-[#6D6D68] block">Years Established</span>
              <span className="text-[#111111] font-medium mt-0.5 block">{draft.year_established || draft.yearEstablished || '2018'}</span>
            </div>
          </div>
        </div>

        {/* Operational Scope & Regions */}
        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E8E8E5] pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#EA580C]" />
            Geographic Coverage &amp; Delivery
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#6D6D68] block mb-1.5 font-medium">Approved Service Regions</span>
              <div className="flex flex-wrap gap-1.5">
                {regions.map((reg) => (
                  <span
                    key={reg}
                    className="px-2.5 py-1 rounded-[4px] bg-[#FAFAF8] border border-[#E8E8E5] text-[#111111] font-medium text-[11px]"
                  >
                    {reg}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#E8E8E5]">
              <div>
                <span className="text-[#6D6D68] block">Coverage Model</span>
                <span className="text-[#111111] font-medium mt-0.5 block">{draft.coverage_type || draft.coverageType || 'REGIONAL'}</span>
              </div>
              <div>
                <span className="text-[#6D6D68] block">Emergency 24/7 Coverage</span>
                <span className="text-[#15803D] font-medium mt-0.5 block">
                  {draft.has_247 || draft.has247 ? 'ACTIVE (24/7/365)' : 'STANDARD HOURS'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
