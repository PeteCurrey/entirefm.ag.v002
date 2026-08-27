import React from 'react';
import Link from 'next/link';
import { listExtendedLeads } from '@/server/growth/store';
import { getSupplierOnboardingDraft } from '@/server/suppliers/store';
import { UserCheck, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InboundApplicationsPage() {
  const leadsRes = await listExtendedLeads({});
  const leadApplications = (leadsRes?.leads || []).filter(
    (l: any) => l.pageType === 'supplier-application' || l.source === 'SUPPLIER_APPLICATION'
  );

  // Load sample active onboarding draft if present
  const sampleDraft = await getSupplierOnboardingDraft('sup-active-demo');

  const structuredApplications = [
    ...(sampleDraft && sampleDraft.legal_company_name ? [{
      id: sampleDraft.supplier_id,
      ref: sampleDraft.application_reference,
      name: sampleDraft.legal_company_name,
      trades: sampleDraft.selected_service_slugs?.join(', ') || 'General Maintenance',
      regions: sampleDraft.selected_regions?.join(', ') || 'National',
      status: sampleDraft.status || 'UNDER_REVIEW',
      paymentStatus: sampleDraft.assurance_payment?.status || 'PAID',
      submittedAt: sampleDraft.submitted_at || '2026-08-25',
    }] : []),
    {
      id: 'sup-sme-journey-a',
      ref: 'SUP-260825-3050',
      name: 'Derby Climate Control Ltd',
      trades: 'HVAC',
      regions: 'Derby, Nottingham, Sheffield',
      status: 'UNDER_REVIEW',
      paymentStatus: 'PAID',
      submittedAt: '2026-08-25',
    },
    {
      id: 'sup-nat-journey-b',
      ref: 'SUP-260825-2220',
      name: 'National Facilities Engineering Group plc',
      trades: 'HVAC, Gas Heating, Electrical, Fire Safety, Water Hygiene',
      regions: 'National Footprint',
      status: 'UNDER_REVIEW',
      paymentStatus: 'PAID',
      submittedAt: '2026-08-25',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            SUPPLIER ASSURANCE REVIEW QUEUE
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Supplier Qualification Applications
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Inbound submissions from the public EntireFM supplier application portal, queued for technical assurance due diligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">
            {structuredApplications.length} In Review Queue
          </span>
        </div>
      </div>

      {/* Structured Applications Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
            Active Inbound Submissions (Technical Due Diligence Queue)
          </h3>
          <span className="text-xs font-mono text-slate-500">{structuredApplications.length} Total Records</span>
        </div>

        <div className="divide-y divide-slate-200">
          {structuredApplications.map((app) => (
            <div key={app.id} className="py-4 space-y-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-brand-pink font-bold">{app.ref}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      SUBMITTED FOR REVIEW
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{app.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-white font-bold">
                    {app.status}
                  </span>
                  <Link
                    href={`/admin/suppliers/applications/${app.id}`}
                    className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1 font-bold"
                  >
                    <span>Review Application</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-600">
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">Trades:</span>
                  <span>{app.trades}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">Coverage:</span>
                  <span>{app.regions}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
