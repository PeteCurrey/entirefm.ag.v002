import React from "react";
import { ArrowRight, FileCheck, CheckCircle2, Sliders, Camera, ShieldCheck } from "lucide-react";

export function TradeFmWorkflow({ tradeName }: { tradeName: string }) {
  const steps = [
    { number: "01", name: "INSTRUCTION", desc: "Digital work order dispatched with asset info, building access details & scope." },
    { number: "02", name: "REVIEW", desc: "Scope, site constraints & required permits reviewed in your Contractor Portal." },
    { number: "03", name: "PREPARATION", desc: "Task-specific RAMS, risk controls, and operative competencies assigned." },
    { number: "04", name: "ATTENDANCE", desc: "Qualified engineers attend site, complete induction & carry out work safely." },
    { number: "05", name: "DELIVERY", desc: "Maintenance or repair executed strictly per technical & statutory standards." },
    { number: "06", name: "EVIDENCE", desc: "Before & after photographs, engineer notes & test certs captured in-app." },
    { number: "07", name: "COMPLETION", desc: "Job closed digitally, client sign-off secured, and purchase order reconciled." },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="container-wide space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="eyebrow eyebrow-light">OPERATIONAL EXCELLENCE</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            What Professional FM Delivery Looks Like for {tradeName} Contractors
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Delivering commercial FM work requires seamless coordination between client expectations, site safety, and digital proof of delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-slate-200 rounded-sm overflow-hidden shadow-card">
          {steps.map((s) => (
            <div key={s.number} className="bg-white p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-xl font-bold font-mono text-[#EA580C]">{s.number}</span>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{s.name}</h4>
              </div>
              <p className="text-[11.5px] text-slate-600 font-light leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
