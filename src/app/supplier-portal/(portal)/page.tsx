import React from 'react';
import { getCurrentSession } from '@/server/identity';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  CreditCard,
  ArrowRight,
  Wrench,
  Users,
  Building2,
  Phone,
  Mail,
  HelpCircle,
  ClipboardList,
} from 'lucide-react';
import {
  getSupplierRelationshipOverview,
  getSupplierComplianceRadar,
  getSupplierServicesScope,
} from '@/server/suppliers/store';
import {
  getSupplierOrganisationById,
  getApplicationDraft,
  getPortalStatusDisplay,
} from '@/server/suppliers/supplier-auth-store';

export const metadata = {
  title: 'Supplier Portal | EntireFM Partner Network',
  description: 'Manage your EntireFM supplier application, compliance documentation, and partner relationship.',
};

export default async function SupplierPortalDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ notice?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const org = orgId ? await getSupplierOrganisationById(orgId) : null;
  const draft = orgId ? await getApplicationDraft(orgId) : null;
  const statusDisplay = getPortalStatusDisplay(org);
  const isApproved = statusDisplay.isApproved;

  const relationship = await getSupplierRelationshipOverview(orgId);
  const radar = await getSupplierComplianceRadar(orgId);
  const expiringItems = radar.filter((r) => r.status.startsWith('EXPIRING'));
  const services = await getSupplierServicesScope(orgId);

  const companyName = org?.tradingName || org?.legalName || draft?.legalCompanyName || 'Your Supplier Organisation';
  const appRef = org?.applicationReference || draft?.applicationReference || '—';

  return (
    <div className="space-y-6 lg:space-y-8 w-full min-w-0">
      {/* Informative Notice (e.g. if redirected from contractor platform while under review) */}
      {resolvedParams.notice === 'under_review' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-sm shadow-sm flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-950 block">Application Under Technical Review</span>
            <p className="text-amber-800 leading-relaxed font-light text-[11.5px]">
              Your supplier application is currently under review by the EntireFM Technical Assurance desk. The full <strong>EntireFM Contractor Platform</strong> becomes available once your organisation has been verified and approved.
            </p>
          </div>
        </div>
      )}

      {/* 1. Header & Status Banner — Fluid Workspace Width */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-sm shadow-sm space-y-6 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-light uppercase tracking-wider text-brand-pink font-bold">
                {isApproved ? 'PARTNER RELATIONSHIP CENTRE' : 'SUPPLIER ASSURANCE HUB'}
              </span>
              <span className={`text-[10.5px] font-light px-2.5 py-0.5 rounded font-bold border ${
                isApproved
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {statusDisplay.statusLabel}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight">
              {companyName}
            </h1>
            <p className="text-xs text-slate-300 font-light">
              Application Reference: <strong className="text-white font-normal">{appRef}</strong> &middot; EntireFM Partner Network
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {!isApproved ? (
              <>
                <Link href="/supplier-portal/onboarding" className="btn-primary text-xs py-2 px-4 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold inline-flex items-center gap-1.5">
                  Continue Application <ArrowRight className="h-3 w-3" />
                </Link>
                <Link href="/supplier-portal/documents" className="btn-secondary text-xs py-2 px-4 bg-white/10 hover:bg-white/20 text-white border-white/20 inline-flex items-center gap-1.5">
                  <FileText className="h-3 w-3" /> Document Vault
                </Link>
              </>
            ) : (
              <>
                <Link href="/contractor" className="btn-primary text-xs py-2 px-4 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold inline-flex items-center gap-1.5">
                  Launch Contractor Operations &rarr;
                </Link>
                <Link href="/supplier-portal/documents" className="btn-secondary text-xs py-2 px-4 bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Document Vault
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs font-light">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block font-medium">Assurance State</span>
            <span className={isApproved ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {org?.lifecycleStatus || 'DRAFT'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block font-medium">Declared Trades</span>
            <span className="text-white font-bold">
              {draft?.selectedServices?.length ? `${draft.selectedServices.length} Trade(s)` : '0 Declared'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block font-medium">Declared Regions</span>
            <span className="text-white font-bold">
              {draft?.selectedRegions?.length ? `${draft.selectedRegions.length} Region(s)` : '0 Declared'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block font-medium">Application Stage</span>
            <span className="text-white font-bold">
              {statusDisplay.statusLabel.replace('● ', '')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Action Required / Compliance Expiry Radar (if any items) */}
      {expiringItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-sm flex items-start gap-4 text-xs text-amber-950 w-full">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">
                Action Required: {expiringItems.length} Compliance Document Expiring Soon
              </span>
              <span className="text-[11.5px] font-light text-amber-800 font-bold">
                {expiringItems[0].days_remaining} Days Remaining
              </span>
            </div>
            <p className="text-slate-700 text-[11.5px] leading-relaxed font-light">
              {expiringItems[0].action_required}
            </p>
            <Link
              href="/supplier-portal/documents"
              className="text-amber-900 font-bold underline hover:no-underline inline-block pt-1 text-[11.5px]"
            >
              Upload Renewal Certificate to Vault &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* 3. Core Workspace Modules — Responsive 12-Column Grid (Main 8, Support 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full min-w-0">
        {/* Left Column (Main Content Area ~70–75%) */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {/* Trade Capabilities / Scope Card */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-light text-slate-900 font-sans text-sm flex items-center gap-2">
                <Wrench className="h-4 w-4 text-slate-400" />
                {isApproved ? 'Authorized EntireFM Scope' : 'Application Trade Declarations'}
              </h2>
              <Link href="/supplier-portal/onboarding" className="text-xs text-brand-pink font-bold hover:underline">
                {isApproved ? 'Request Expansion &rarr;' : 'Edit Declarations &rarr;'}
              </Link>
            </div>

            {services.length > 0 ? (
              <div className="space-y-3 text-xs">
                {services.map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block font-sans">{s.name}</span>
                      <span className="text-[11px] text-slate-500 font-light">
                        {s.capability_notes || 'Declared trade capability awaiting technical assurance'}
                      </span>
                    </div>
                    <span className={`text-[10px] font-light px-2.5 py-0.5 rounded font-bold shrink-0 ${
                      s.approval_status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.approval_status === 'APPROVED' ? 'APPROVED' : 'DECLARED'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 space-y-2 bg-slate-50 border border-dashed border-slate-200 rounded">
                <p>No service trades declared yet.</p>
                <Link href="/supplier-portal/onboarding" className="text-brand-pink font-bold hover:underline">
                  Complete your application profile &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Quick Hub Grid — 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Link href="/supplier-portal/documents" className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block group">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-sans group-hover:text-brand-pink transition-colors">Document Vault</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-pink transition-colors" />
              </div>
              <p className="text-slate-500 font-light text-[11.5px] leading-relaxed">
                Upload statutory compliance policies, public liability insurance, and RAMS evidence.
              </p>
            </Link>

            <Link href="/supplier-portal/actions" className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block group">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-sans group-hover:text-brand-pink transition-colors">Actions &amp; Requests</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-pink transition-colors" />
              </div>
              <p className="text-slate-500 font-light text-[11.5px] leading-relaxed">
                Respond to Requests for Information (RFI) from the EntireFM Assurance review team.
              </p>
            </Link>

            <Link href="/supplier-portal/company" className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block group">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-sans group-hover:text-brand-pink transition-colors">Company Profile</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-pink transition-colors" />
              </div>
              <p className="text-slate-500 font-light text-[11.5px] leading-relaxed">
                Maintain registered office, trading address, Companies House details, and contacts.
              </p>
            </Link>

            <Link href="/supplier-portal/resources" className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block group">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-sans group-hover:text-brand-pink transition-colors">Standards &amp; Guides</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-pink transition-colors" />
              </div>
              <p className="text-slate-500 font-light text-[11.5px] leading-relaxed">
                Download official EntireFM Service Report standards, codes of practice, and RAMS guidelines.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Column (Support Rail ~25–30%) */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-4">
            <h2 className="font-light text-slate-900 font-sans text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" /> {relationship.assigned_entirefm_team.length > 0 ? 'Assigned Relationship Manager' : 'Supplier Support Desk'}
            </h2>

            {relationship.assigned_entirefm_team.length > 0 ? (
              <div className="space-y-4 text-xs">
                {relationship.assigned_entirefm_team.map((contact, idx) => (
                  <div key={idx} className="space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold block">
                      {contact.role}
                    </span>
                    <span className="font-bold text-slate-900 block font-sans">
                      {contact.name}
                    </span>
                    <div className="text-[11px] text-slate-600 space-y-0.5 font-light">
                      {contact.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <a href={`mailto:${contact.email}`} className="hover:underline text-slate-800">
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-600 font-light">
                <p className="leading-relaxed">
                  A dedicated Relationship Manager is assigned upon successful completion of your technical assurance review.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold block">General Assurance Enquiries</span>
                  <a href="mailto:supplier-support@entirefm.com" className="text-xs font-light text-brand-pink font-medium hover:underline block">
                    supplier-support@entirefm.com
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-sm p-5 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block font-sans">Need Assistance?</span>
            <p className="text-slate-600 font-light text-[11.5px] leading-relaxed">
              Contact the EntireFM Supply Chain Support Desk for technical assistance with onboarding, document verification, or assurance review.
            </p>
            <Link href="/supplier-portal/support" className="text-brand-pink font-bold hover:underline inline-block pt-1 text-[11.5px]">
              Contact Support Desk &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
