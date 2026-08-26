import React from 'react';
import { getCurrentSession } from '@/server/identity';
import {
  getSupplierOrganisationById,
  getApplicationDraft,
  getPortalStatusDisplay,
} from '@/server/suppliers/supplier-auth-store';
import { Building2, ShieldCheck, MapPin, Wrench } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Company Profile & Partner Record | EntireFM Supplier Portal',
  description: 'View and maintain your commercial Partner Profile, trade capabilities, and declared operating bases.',
};

export default async function SupplierCompanyProfilePage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const org = orgId ? await getSupplierOrganisationById(orgId) : null;
  const draft = orgId ? await getApplicationDraft(orgId) : null;
  const statusDisplay = getPortalStatusDisplay(org);

  const companyName = org?.tradingName || org?.legalName || draft?.legalCompanyName || session?.orgName || 'Your Company';
  const companyNumber = org?.companyNumber || draft?.companyNumber || 'Not specified';
  const registeredAddress = draft?.tradingAddress || 'Will be recorded upon application completion';
  const summary = draft?.companySummary || 'Complete your supplier application to provide your operational capability profile.';
  const engineers = draft?.directEngineers || '0';

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
          ORGANISATION &amp; OPERATIONS
        </span>
        <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
          Company Profile &amp; Operational Capabilities
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          This data forms your active EntireFM Partner Profile used for technical matching and operational allocation.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-light text-slate-900">{companyName}</h2>
            <span className="text-xs text-slate-500 font-light">
              Companies House: <strong className="text-slate-800 font-medium">{companyNumber}</strong> &middot; Ref: <strong className="text-slate-800 font-medium">{org?.applicationReference || draft?.applicationReference || '—'}</strong>
            </span>
          </div>
          <span className={`text-[10.5px] font-light px-2.5 py-1 rounded font-bold self-start sm:self-auto ${
            statusDisplay.isApproved
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {statusDisplay.statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          <div className="space-y-1">
            <span className="font-bold text-slate-400 text-[10px] uppercase font-light tracking-wider block">Trading Address</span>
            <p className="text-slate-800">{registeredAddress}</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-400 text-[10px] uppercase font-light tracking-wider block">Direct Field Operatives</span>
            <p className="text-slate-800">{engineers} Operatives declared</p>
          </div>
          <div className="space-y-1 md:col-span-2">
            <span className="font-bold text-slate-400 text-[10px] uppercase font-light tracking-wider block">Capability Summary</span>
            <p className="text-slate-700 leading-relaxed">{summary}</p>
          </div>

          {draft?.gasSafeNumber || draft?.fGasNumber ? (
            <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100">
              <span className="font-bold text-slate-400 text-[10px] uppercase font-light tracking-wider block">Declared Accreditations</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {draft.gasSafeNumber && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-bold text-slate-900 block text-xs">Gas Safe Register</span>
                    <span className="text-[11.5px] font-light text-emerald-700 font-bold block mt-0.5">Reg: {draft.gasSafeNumber}</span>
                    <span className="text-[10px] text-slate-500 block">Expiry: {draft.gasSafeExpiry || 'Declared'}</span>
                  </div>
                )}
                {draft.fGasNumber && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-bold text-slate-900 block text-xs">REFCOM / F-Gas Certified</span>
                    <span className="text-[11.5px] font-light text-emerald-700 font-bold block mt-0.5">Cert: {draft.fGasNumber}</span>
                    <span className="text-[10px] text-slate-500 block">Expiry: {draft.fGasExpiry || 'Declared'}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="md:col-span-2 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Accreditations and statutory licences will be listed once declared in your application.</span>
              <Link href="/supplier-portal/onboarding" className="text-brand-pink font-bold hover:underline">
                Complete Application &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
