import React from 'react';
import { listSupplierOems } from '@/server/suppliers/store';
import { CheckCircle2, ShieldAlert, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OemDirectoryPage() {
  const oems = await listSupplierOems();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          MANUFACTURER &amp; OEM ECOSYSTEM
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Equipment Manufacturers &amp; OEM Frameworks
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Direct factory support, technical escalation routes, approved installer networks, and parts access for critical plant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {oems.map((o) => (
          <div key={o.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-bold">
                  {o.product_category}
                </span>
                <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                  {o.relationship_level.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{o.brand_name}</h3>
              <p className="text-xs text-slate-600 font-light leading-relaxed">{o.ecosystem_description}</p>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  CAPABILITIES &amp; CHANNELS
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${o.direct_support_available ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>Direct Support</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${o.parts_access ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>Parts Access</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${o.technical_escalation_route ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>Tech Escalation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${o.training_availability ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>Training Portal</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11.5px] text-slate-500 font-mono">
              {o.strategic_notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
