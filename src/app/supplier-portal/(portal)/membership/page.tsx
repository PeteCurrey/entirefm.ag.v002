import React from 'react';
import Link from 'next/link';
import { CreditCard, CheckCircle2, FileText, Calendar, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { getCurrentSession } from '@/server/identity';
import {
  getSupplierOrganisationById,
  getApplicationDraft,
  getPortalStatusDisplay,
} from '@/server/suppliers/supplier-auth-store';

export const metadata = {
  title: 'Partner Network Status | EntireFM Supplier Portal',
  description: 'Manage your Partner Network status, authorized technical scopes, and assurance records.',
};

export default async function SupplierPortalMembershipPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const org = orgId ? await getSupplierOrganisationById(orgId) : null;
  const draft = orgId ? await getApplicationDraft(orgId) : null;
  const statusDisplay = getPortalStatusDisplay(org);
  const isApproved = statusDisplay.isApproved;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
          SUPPLIER ECOSYSTEM &amp; NETWORK TIER
        </span>
        <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
          Partner Network Status
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          View your organisation's Partner Network status, verified technical scopes, and compliance standing.
        </p>
      </div>

      {/* Membership Status Card */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">PARTNER RECORD</span>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-light text-slate-900">
                {isApproved ? 'Approved Supplier Partner Network' : 'Supplier Assurance Review (In Progress)'}
              </h2>
              <span className={`text-[10.5px] font-light px-2 py-0.5 rounded font-bold ${
                isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {isApproved ? 'ACTIVE' : 'DRAFT'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light">
              {isApproved
                ? 'Authorized supplier partner status with active digital portal access, document vault storage, and compliance administration.'
                : 'Technical qualification, document vetting, and compliance review in progress with EntireFM Supplier Management.'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold block">PARTICIPATION TIER</span>
            <div className="text-lg font-bold text-slate-900 font-sans">
              {isApproved ? 'Approved Partner' : 'Applicant Provider'}
            </div>
            <span className="text-[10.5px] text-emerald-700 font-medium">Technical Qualification</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-light">
          <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Assurance Status</span>
            <div className={`flex items-center gap-1.5 font-bold ${isApproved ? 'text-emerald-700' : 'text-slate-700'}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{statusDisplay.statusLabel}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Application Ref</span>
            <span className="font-bold text-slate-900 block">
              {org?.applicationReference || draft?.applicationReference || '—'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Declared Trade Disciplines</span>
            <span className="font-bold text-slate-900 block">
              {draft?.selectedServices?.length ? `${draft.selectedServices.length} Discipline(s)` : '0 Declared'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
