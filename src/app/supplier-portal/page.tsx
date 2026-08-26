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
  Calendar,
  Building2,
  Phone,
  Mail,
  HelpCircle,
  Briefcase,
} from 'lucide-react';
import {
  getSupplierRelationshipOverview,
  getSupplierComplianceRadar,
} from '@/server/suppliers/store';

export const metadata = {
  title: 'Supplier Relationship Centre | EntireFM Partner Network',
  description: 'Manage your approved supplier relationship, scope of approval, compliance radar, and live operations.',
};

export default async function SupplierPortalDashboardPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? 'no-org';
  const relationship = await getSupplierRelationshipOverview(orgId);
  const radar = await getSupplierComplianceRadar(orgId);
  const expiringItems = radar.filter((r) => r.status.startsWith('EXPIRING'));

  return (
    <div className="space-y-8">
      {/* 1. Header & Relationship Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-bold">
                PARTNER RELATIONSHIP CENTRE
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                ● {relationship.relationship_tier.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {relationship.legal_name}
            </h1>
            <p className="text-xs text-slate-300 font-light">
              Trading as <strong className="text-white font-medium">{relationship.trading_name}</strong> &middot; EntireFM Partner Since {relationship.relationship_since}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/supplier-portal/services" className="btn-secondary text-xs py-2 px-4 bg-white/10 hover:bg-white/20 text-white border-white/20">
              View Approved Scope
            </Link>
            <Link href="/supplier-portal/documents" className="btn-primary text-xs py-2 px-4 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold">
              Document Vault &rarr;
            </Link>
          </div>
        </div>

        {/* Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Assurance State</span>
            <span className="text-emerald-400 font-bold">{relationship.assurance_status}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Approved Trades</span>
            <span className="text-white font-bold">HVAC &amp; Gas (2 Trades)</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Approved Region</span>
            <span className="text-white font-bold">Midlands (West &amp; East)</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Next Formal Review</span>
            <span className="text-white font-bold">{relationship.next_formal_review_date}</span>
          </div>
        </div>
      </div>

      {/* 2. Action Required / Compliance Expiry Radar */}
      {expiringItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-sm flex items-start gap-4 text-xs text-amber-950">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">
                Action Required: {expiringItems.length} Compliance Document Expiring Soon
              </span>
              <span className="text-[11px] font-mono text-amber-800 font-bold">
                {expiringItems[0].days_remaining} Days Remaining
              </span>
            </div>
            <p className="text-slate-700 text-[11.5px] leading-relaxed">
              {expiringItems[0].action_required}
            </p>
            <Link
              href="/supplier-portal/documents"
              className="text-amber-900 font-bold underline hover:no-underline inline-block pt-1"
            >
              Upload Renewal Certificate to Vault &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* 3. Daily Control Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Scope & Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scope Overview Card */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 font-sans text-sm flex items-center gap-2">
                <Wrench className="h-4 w-4 text-slate-400" /> Authorized EntireFM Scope
              </h2>
              <Link href="/supplier-portal/services" className="text-xs text-brand-pink font-bold hover:underline">
                Request Expansion &rarr;
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">HVAC, Chillers &amp; Air Handling</span>
                  <span className="text-[11px] text-slate-500">Approved for West &amp; East Midlands &middot; No Restrictions</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  APPROVED
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Commercial Gas &amp; Boilers</span>
                  <span className="text-[11px] text-slate-500">Approved for West Midlands &middot; Commercial plant up to 500kW</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  APPROVED
                </span>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">North West Regional Coverage</span>
                  <span className="text-[11px] text-amber-700">Requested regional expansion currently undergoing technical assessment</span>
                </div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  UNDER REVIEW
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hub Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Link href="/supplier-portal/membership" className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-sans">Partner Network Membership</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-slate-500 font-light text-[11.5px]">
                Supplier Network Membership (£495 + VAT/yr). Active through 14 Sep 2027.
              </p>
            </Link>

            <Link href="/supplier-portal/billing" className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-sans">Invoices &amp; Billing</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-slate-500 font-light text-[11.5px]">
                Account up to date (£0 outstanding). View VAT invoices and payment receipts.
              </p>
            </Link>

            <Link href="/supplier-portal/events" className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-sans">Events &amp; Forums</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-slate-500 font-light text-[11.5px]">
                Register team members for upcoming Technical Roundtables &amp; OEM Breakfasts.
              </p>
            </Link>

            <Link href="/supplier-portal/resources" className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-sans">Resources &amp; Standards</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-slate-500 font-light text-[11.5px]">
                Download official EntireFM Service Report guidelines and RAMS protocols.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Col: Assigned EntireFM Team */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 font-sans text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" /> Your EntireFM Team
            </h2>

            <div className="space-y-4 text-xs">
              {relationship.assigned_entirefm_team.map((contact, idx) => (
                <div key={idx} className="space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    {contact.role}
                  </span>
                  <span className="font-bold text-slate-900 block font-sans">
                    {contact.name}
                  </span>
                  <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <a href={`mailto:${contact.email}`} className="hover:underline text-slate-800">
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-5 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">Need Operational Support?</span>
            <p className="text-slate-600 font-light text-[11.5px]">
              Raise a support request directly with the EntireFM Supply Chain Desk for billing, onboarding or compliance queries.
            </p>
            <Link href="/supplier-portal/support" className="text-brand-pink font-bold hover:underline inline-block pt-1">
              Contact Support Desk &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
