import React from "react";
import { ArrowRight, FileCheck, CheckCircle2, UserCheck, Shield, Sparkles } from "lucide-react";

export function LocalContractorWorkflow({ locationName }: { locationName: string }) {
  const steps = [
    { number: "01", name: "REGISTER", desc: `Submit company details, ${locationName} postcode radius & trade capabilities.` },
    { number: "02", name: "VERIFY", desc: "Upload insurance (£5m/£10m), trade accreditations & operative cards." },
    { number: "03", name: "PROFILE", desc: "Access the Contractor Portal and build your verified company profile." },
    { number: "04", name: "READY", desc: "Keep RAMS, risk assessments, and tool calibration records current." },
    { number: "05", name: "OPPORTUNITIES", desc: `Receive applicable ${locationName} commercial FM work orders based on merit.` },
  ];

  return (
    <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="eyebrow eyebrow-light">ONBOARDING &amp; DISPATCH</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            How to Join the EntireFM Network in {locationName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            A transparent, professional onboarding process designed to establish verified compliance before site attendance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-slate-200 rounded-sm overflow-hidden shadow-card">
          {steps.map((s) => (
            <div key={s.number} className="bg-white p-5 flex flex-col justify-between space-y-3">
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
