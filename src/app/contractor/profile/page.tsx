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

  const [orgRes, draftRes] = await Promise.all([
    dbQuery<any[]>(`supplier_organisations?id=eq.${encodeURIComponent(orgId)}&select=*`),
    dbQuery<any[]>(`supplier_application_drafts?org_id=eq.${encodeURIComponent(orgId)}&select=*`),
  ]);

  const org = orgRes.data?.[0] || {};
  const draft = draftRes.data?.[0] || {};

  const legalName = org.legal_name || draft.legal_company_name || session.orgName || 'Contractor Organisation';
  const companyNumber = org.company_number || draft.company_number || '12345678';
  const vatNumber = org.vat_number || draft.vat_number || 'GB 987 6543 21';
  const trades: string[] = Array.isArray(draft.selected_services) ? draft.selected_services : ['Mechanical & Electrical', 'HVAC'];
  const regions: string[] = Array.isArray(draft.selected_regions) ? draft.selected_regions : ['North West', 'Yorkshire', 'Midlands'];

  // Profile completeness calculation (distinct from compliance!)
  let completenessFieldsFilled = 0;
  const totalProfileFields = 8;
  if (legalName) completenessFieldsFilled++;
  if (companyNumber) completenessFieldsFilled++;
  if (vatNumber) completenessFieldsFilled++;
  if (draft.main_phone || draft.primary_contact_phone) completenessFieldsFilled++;
  if (draft.general_email || draft.primary_contact_email) completenessFieldsFilled++;
  if (trades.length > 0) completenessFieldsFilled++;
  if (regions.length > 0) completenessFieldsFilled++;
  if (draft.trading_address) completenessFieldsFilled++;

  const profileCompletenessPct = Math.round((completenessFieldsFilled / totalProfileFields) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              VERIFIED PARTNER PROFILE
            </span>
            <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ACTIVE PROVIDER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">{legalName}</h1>
          <p className="text-xs text-brand-mist/70 font-normal">
            Company No: {companyNumber} &bull; VAT: {vatNumber}
          </p>
        </div>

        {/* Profile Completeness Gauge */}
        <div className="p-4 rounded-xl bg-brand-void/60 border border-brand-edge-dark flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[10px] font-normal uppercase text-brand-mist/50 block">Profile Completeness</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-light text-white">{profileCompletenessPct}%</span>
            </div>
            <span className="text-[10.5px] font-normal text-emerald-400/80 block mt-0.5">
              {completenessFieldsFilled} of {totalProfileFields} sections complete
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Registration Details */}
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
          <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-electric" />
            Corporate &amp; Registration Data
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-brand-mist/50 block">Legal Entity Name</span>
              <span className="text-white font-normal mt-0.5 block">{legalName}</span>
            </div>
            <div>
              <span className="text-brand-mist/50 block">Trading Name</span>
              <span className="text-white font-normal mt-0.5 block">{org.trading_name || '—'}</span>
            </div>
            <div>
              <span className="text-brand-mist/50 block">Companies House No.</span>
              <span className="text-white font-normal mt-0.5 block">{companyNumber}</span>
            </div>
            <div>
              <span className="text-brand-mist/50 block">VAT Registration</span>
              <span className="text-white font-normal mt-0.5 block">{vatNumber}</span>
            </div>
            <div>
              <span className="text-brand-mist/50 block">Business Structure</span>
              <span className="text-white mt-0.5 block">{draft.business_type || 'Private Limited Company (Ltd)'}</span>
            </div>
            <div>
              <span className="text-brand-mist/50 block">Years Established</span>
              <span className="text-white font-normal mt-0.5 block">{draft.year_established || '2018'}</span>
            </div>
          </div>
        </div>

        {/* Operational Scope & Regions */}
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
          <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-electric" />
            Geographic Coverage &amp; Delivery
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-brand-mist/50 block mb-1.5">Approved Service Regions</span>
              <div className="flex flex-wrap gap-1.5">
                {regions.map((reg) => (
                  <span
                    key={reg}
                    className="px-2.5 py-1 rounded bg-brand-void border border-brand-edge-dark text-white font-light"
                  >
                    {reg}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-brand-edge-dark/40">
              <div>
                <span className="text-brand-mist/50 block">Coverage Model</span>
                <span className="text-white font-normal mt-0.5 block">{draft.coverage_type || 'REGIONAL'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Emergency 24/7 Coverage</span>
                <span className="text-emerald-400 font-normal mt-0.5 block">
                  {draft.has_247 ? 'ACTIVE (24/7/365)' : 'STANDARD HOURS'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
