import React from 'react';
import { listSupplierTechPartners } from '@/server/suppliers/store';
import { Cpu, Radio, Eye, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TechnologyPartnersPage() {
  const tech = await listSupplierTechPartners();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
          CONNECTED INTELLIGENCE &amp; HARDWARE
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Technology &amp; Innovation Partners
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          IoT condition monitoring, thermal drone thermography, building analytics, and predictive AI telemetry integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tech.map((t) => (
          <div key={t.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-light">
                {t.technology_category.replace(/_/g, ' ')}
              </span>
              <span className="text-[10.5px] font-mono font-light px-2 py-0.5 rounded bg-slate-900 text-white">
                {t.relationship_stage.replace(/_/g, ' ')}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-light text-slate-900">{t.company_name}</h3>
              <p className="text-xs text-slate-600 font-light mt-1 leading-relaxed">{t.technology_summary}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
              <div>
                <span className="font-mono font-light text-slate-700">CAFM Integration: </span>
                <span className="text-slate-600 font-light">{t.integration_opportunity}</span>
              </div>
              <div>
                <span className="font-mono font-light text-slate-700">Client Use Case: </span>
                <span className="text-slate-600 font-light">{t.client_use_case}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-100">
              <span>Model: {t.commercial_model}</span>
              <span>API Ready: {t.api_availability ? 'YES' : 'NO'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
