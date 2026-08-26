import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getSupplierRelationshipOverview, getSupplierServicesScope } from '@/server/suppliers/store';
import { getSupplierOrganisationById, getPortalStatusDisplay } from '@/server/suppliers/supplier-auth-store';
import Link from 'next/link';

export const metadata = {
  title: 'Authorised Scope & Restrictions | EntireFM Supplier Portal',
  description: 'View specific trade approvals, regional boundaries, and active operational restrictions.',
};

export default async function SupplierApprovalsPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const org = orgId ? await getSupplierOrganisationById(orgId) : null;
  const statusDisplay = getPortalStatusDisplay(org);
  const rel = await getSupplierRelationshipOverview(orgId);
  const services = await getSupplierServicesScope(orgId);
  const approvedServices = services.filter((s) => s.approval_status === 'APPROVED');

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
          AUTHORISED WORK SCOPE &amp; BOUNDARIES
        </span>
        <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
          EntireFM Approvals &amp; Restrictions
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Detailed summary of your organisation&apos;s authorized scope for work allocation.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">ASSURANCE STATUS</span>
            <h2 className="text-xl font-light text-slate-900 mt-0.5">{statusDisplay.statusLabel}</h2>
          </div>
          <span className={`text-[10.5px] font-light px-2.5 py-1 rounded font-bold self-start sm:self-auto ${
            statusDisplay.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
          }`}>
            {statusDisplay.isApproved ? `EFFECTIVE ${rel.assurance_effective_date}` : 'IN REVIEW'}
          </span>
        </div>

        <div className="space-y-4 text-xs font-sans">
          <span className="font-bold text-slate-900 block text-sm">Approved Service Disciplines</span>
          {approvedServices.length > 0 ? (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded">
              {approvedServices.map((s) => (
                <div key={s.slug} className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{s.name}</span>
                    <span className="text-emerald-700 font-medium text-[10px]">APPROVED</span>
                  </div>
                  <span className="text-slate-500 text-[11px] block">
                    Geographies: {s.approved_geographies?.join(', ') || 'Declared Regions'}
                  </span>
                  {s.restrictions && s.restrictions.length > 0 && (
                    <span className="text-amber-800 text-[11px] font-medium block">
                      Restrictions: {s.restrictions.join('; ')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded space-y-2">
              <p>No service approvals granted yet. Technical approvals are issued upon completion of the EntireFM technical vetting process.</p>
              <Link href="/supplier-portal/onboarding" className="text-brand-pink font-bold hover:underline inline-block">
                View Application Progress &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
