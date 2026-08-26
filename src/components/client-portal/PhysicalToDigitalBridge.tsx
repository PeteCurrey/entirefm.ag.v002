import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, 
  Headphones, 
  Wrench, 
  Cpu, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export function PhysicalToDigitalBridge() {
  const steps = [
    {
      num: '01',
      actor: 'Authorised Client',
      role: 'Property & FM Leaders',
      action: 'Logs reactive defect or schedules term PPM directly in EntireCAFM with pre-set spending limits.',
      icon: Building2,
    },
    {
      num: '02',
      actor: '24/7 Operations Desk',
      role: 'National Dispatch Centre',
      action: 'Triages SLA severity, verifies building access protocols, and assigns accredited engineers or tier-1 partners.',
      icon: Headphones,
    },
    {
      num: '03',
      actor: 'Mobile Engineer',
      role: 'Vetted Field Technicians',
      action: 'Checks in via mobile GPS, reviews dynamic site RAMS, and conducts physical plant inspection or repair.',
      icon: Wrench,
    },
    {
      num: '04',
      actor: 'Plantroom Asset',
      role: 'Physical Building Infrastructure',
      action: 'Chillers, boilers, switchgear, pumps and life-safety systems serviced to statutory SFG20 standards.',
      icon: Cpu,
    },
    {
      num: '05',
      actor: 'Photographic Proof',
      role: 'Time-Stamped Verification',
      action: 'Before/after photos, calibrated instrument readings, and signed digital worksheets uploaded on site.',
      icon: FileCheck,
    },
    {
      num: '06',
      actor: 'Statutory Compliance',
      role: 'Audit & Insurer Ready',
      action: 'Certificates deposited into the Digital Vault; asset history updated instantly with zero month-end delays.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <span className="eyebrow eyebrow-light">THE PHYSICAL-TO-DIGITAL CONTINUUM</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
            The screen is only half the operation.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            EntireCAFM does not exist in isolation. It is the proprietary digital central nervous system of an established national facilities management engineering company with hundreds of engineers, specialist fleet vehicles, and millions of square feet under management.
          </p>
        </div>

        {/* 6-Step Operational Continuum Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-16">
          {steps.map((s, idx) => {
            const StepIcon = s.icon;
            return (
              <div
                key={s.num}
                className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-sm flex flex-col justify-between space-y-4 hover:border-brand-pink transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extralight text-brand-pink">STEP {s.num}</span>
                    <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                      <StepIcon className="h-4 w-4 text-brand-pink" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-slate-900">{s.actor}</h3>
                    <span className="text-[10.5px] text-slate-500 font-light block">{s.role}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {s.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Photographic Evidence Split: Physical Reality + Digital Proof */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-slate-200">
          {/* Left Column: Real-World Engineering Photo */}
          <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden rounded-sm border border-slate-200 shadow-sm">
            <Image
              src="/images/editorial/entirefm-engineer-chiller-2000w.webp"
              alt="EntireFM senior engineering technician conducting chiller plant inspection with calibrated diagnostic tools"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-light">
              <span className="text-[10px] uppercase tracking-wider text-brand-pink block mb-0.5 font-normal">
                PHYSICAL ESTATE DELIVERY
              </span>
              Direct mechanical &amp; electrical engineering delivered on live commercial plant.
            </div>
          </div>

          {/* Right Column: Fleet & Operational Capabilities */}
          <div className="lg:col-span-6 space-y-6">
            <span className="eyebrow eyebrow-light">ESTATE-SCALE RESILIENCE</span>
            <h3 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Real engineers. Real plantrooms. Guaranteed compliance.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              When a chiller fails at 02:00 or a statutory fire damper inspection is due, software alone cannot fix the problem. EntireFM provides the certified technicians, Gas Safe engineers, NICEIC electricians, and emergency response vehicles required to keep buildings operational.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-1">
                <span className="text-xs font-normal text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> In-House Technical Desks
                </span>
                <p className="text-[11.5px] text-slate-500 font-light">
                  M&amp;E directors and NEBOSH safety officers reviewing every job sheet.
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-1">
                <span className="text-xs font-normal text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Nationwide Vehicle Fleet
                </span>
                <p className="text-[11.5px] text-slate-500 font-light">
                  Direct regional response units equipped with genuine manufacturer parts.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/mechanical-electrical" className="btn-ghost-dark text-xs py-2.5 px-4">
                Explore Engineering Capabilities <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
