import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScopedApprovalGraphic } from '@/components/suppliers/ScopedApprovalGraphic';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { ArrowRight, CheckCircle2, ShieldCheck, Wrench, Clock, FileCheck } from 'lucide-react';

export const metadata = {
  title: 'How We Work With Suppliers | EntireFM Supply Chain',
  description: 'Understand EntireFM’s 12-step supplier lifecycle: from initial screening and risk-based assurance to scoped approval and performance monitoring.',
};

export default function HowWeWorkPage() {
  const steps = [
    { num: '01', title: 'Registration & Initial Profile', desc: 'Submit company profile, trade disciplines, and geographic service areas.' },
    { num: '02', title: 'Risk-Based Assurance Plan', desc: 'Our engine generates a tailored compliance checklist based on trade and risk.' },
    { num: '03', title: 'Evidence Submission', desc: 'Upload insurance schedules, trade accreditations, and H&S policies to the vault.' },
    { num: '04', title: 'Technical Competency Review', desc: 'Specialist desks review Gas Safe, F-Gas, NICEIC, and safe working RAMS.' },
    { num: '05', title: 'Scoped Approval Decision', desc: 'Approval is granted for specific disciplines and confirmed operating regions.' },
    { num: '06', title: 'Digital Agreement & Code of Conduct', desc: 'Sign framework terms and execute the Supplier Code of Conduct.' },
    { num: '07', title: 'Dual-Control Bank Verification', desc: 'Submit masked bank remittance details with independent phone verification.' },
    { num: '08', title: 'Portal Activation', desc: 'Access the Supplier Portal for jobs, document tracking, and action items.' },
    { num: '09', title: 'Work Opportunities & Allocation', desc: 'Receive relevant work opportunities matched to your approved scope.' },
    { num: '10', title: 'Mobilisation & Delivery', desc: 'Acknowledge dispatch, assign engineers, and execute safe site delivery.' },
    { num: '11', title: 'Evidence & Invoicing', desc: 'Upload digital service sheets with photos; submit invoices against authorized POs.' },
    { num: '12', title: 'Ongoing Compliance & Radar', desc: 'Automated 90/60/30-day reminders ensure continuous accreditation validity.' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1">
        <section className="bg-slate-900 text-white py-20 lg:py-28">
          <div className="container-custom max-w-5xl space-y-6">
            <span className="text-[11px] font-light uppercase tracking-wider text-brand-pink font-bold">
              OPERATIONAL LIFECYCLE
            </span>
            <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight tracking-tight text-white max-w-3xl leading-tight">
              How EntireFM Works with Suppliers
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
              A structured, transparent, and auditable operational journey from registration to scoped approval and performance-monitored service delivery.
            </p>
          </div>
        </section>

        <section className="py-16 container-custom max-w-5xl space-y-16">
          {/* 12 Steps */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold tracking-wider">END-TO-END JOURNEY</span>
              <h2 className="text-2xl font-light text-slate-900">The 12-Stage Supplier Lifecycle</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-light">
              {steps.map((s) => (
                <div key={s.num} className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-2">
                  <span className="text-brand-pink font-bold text-sm block">{s.num}</span>
                  <h3 className="font-bold text-slate-900 font-sans text-sm">{s.title}</h3>
                  <p className="text-slate-600 font-sans font-light leading-relaxed text-[11.5px]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scoped Approval */}
          <ScopedApprovalGraphic />

          {/* Transparency Banner */}
          <CommercialTransparencyBanner />
        </section>
      </main>

      <Footer />
    </div>
  );
}
