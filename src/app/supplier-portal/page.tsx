import React from 'react';
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
} from 'lucide-react';

export const metadata = {
  title: 'Supplier Control Centre | EntireFM Partner Network',
  description: 'Manage your supplier assurance, live jobs, compliance documents, and partner network profile.',
};

export default function SupplierPortalDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header & Status Ribbon */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-bold">
              SUPPLIER CONTROL CENTRE // REF: SUP-260825-9921
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Midlands Mechanical &amp; HVAC Services Ltd
            </h1>
            <p className="text-xs text-slate-300 font-light">
              Primary Contact: David Patterson (Managing Director) &middot; Trading: Midlands HVAC Pro
            </p>
          </div>

          <Link href="/supplier-portal/onboarding" className="btn-primary text-xs py-2.5 px-5 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold self-start sm:self-auto">
            Continue Onboarding Wizard &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Assurance Status</span>
            <span className="text-amber-400 font-bold">UNDER REVIEW</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Onboarding Progress</span>
            <span className="text-white font-bold">92% Complete</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Membership Tier</span>
            <span className="text-white font-bold">Supplier Network Membership</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Active Work Orders</span>
            <span className="text-white font-bold">2 Live Jobs</span>
          </div>
        </div>
      </div>

      {/* Action Required Banner */}
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-sm flex items-start gap-4 text-xs text-amber-950">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 block">Actions Required (1 Item)</span>
          <p className="text-slate-700 text-[11.5px]">
            Please upload the renewed <strong>Gas Safe Registration Certificate</strong> (expiring in 45 days) to ensure uninterrupted reactive dispatch eligibility.
          </p>
          <Link href="/supplier-portal/documents" className="text-amber-900 font-bold underline hover:no-underline inline-block pt-1">
            Upload Replacement Certificate in Vault &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        <Link href="/supplier-portal/company" className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans text-sm">Partner Profile</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-slate-500 font-light">
            View and propose material changes to trading addresses, key contacts, and company capability summaries.
          </p>
        </Link>

        <Link href="/supplier-portal/documents" className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans text-sm">Document Vault</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-slate-500 font-light">
            3 verified documents active. Manage insurance schedules, F-Gas credentials, and H&amp;S policies.
          </p>
        </Link>

        <Link href="/supplier-portal/jobs" className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans text-sm">Work Orders &amp; Jobs</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-slate-500 font-light">
            2 dispatched jobs awaiting attendance confirmation or service sheet evidence submission.
          </p>
        </Link>

        <Link href="/supplier-portal/membership" className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans text-sm">Membership &amp; Invoices</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-slate-500 font-light">
            Active Supplier Network Membership (£495 + VAT/yr). Manage payment methods and VAT receipts.
          </p>
        </Link>

        <Link href="/supplier-portal/users" className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans text-sm">Team &amp; Users</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-slate-500 font-light">
            2 active team members. Invite operations coordinators, compliance officers, and field technicians.
          </p>
        </Link>

        <Link href="/supplier-portal/support" className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-400 transition-colors space-y-2 block">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-sans text-sm">Help &amp; Support Desk</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-slate-500 font-light">
            Direct communication channel with EntireFM supply chain assurance officers.
          </p>
        </Link>
      </div>
    </div>
  );
}
