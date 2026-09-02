import React from "react";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export interface ComplianceRequirement {
  category: string;
  items: string[];
  mandatoryType: "Statutory & Insurance" | "Trade Competency" | "Operational Standard";
}

interface TradeComplianceGridProps {
  tradeName: string;
  requirements: ComplianceRequirement[];
}

export function TradeComplianceGrid({ tradeName, requirements }: TradeComplianceGridProps) {
  return (
    <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="eyebrow eyebrow-light">COMPLIANCE &amp; VETTING</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            Compliance Requirements for Commercial {tradeName} Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Commercial facilities management operators expect verified documentation before issuing work orders. EntireFM centralises this in your digital Document Vault.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requirements.map((req, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-sm p-6 space-y-4 shadow-xs">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                  {req.mandatoryType}
                </span>
                <h3 className="text-base font-semibold text-slate-900">{req.category}</h3>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 font-light">
                {req.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-sm text-xs text-slate-500 font-light flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Governance Notice:</strong> Requirements vary depending on the scope of work, building type (e.g. Higher-Risk Buildings under BSA 2022), and client constraints. Holding accreditation does not guarantee work dispatch; all allocations are merit-based.
          </span>
        </div>
      </div>
    </section>
  );
}
