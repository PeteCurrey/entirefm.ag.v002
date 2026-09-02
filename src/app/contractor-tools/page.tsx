import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { ToolHubCard } from '@/components/contractor-tools/ToolHubCard';
import { ArrowRight, Wrench, Shield, FileCheck2, FlaskConical, Users, ClipboardCheck } from 'lucide-react';

export const metadata: Metadata = generateRouteMetadata('/contractor-tools', {
  title: 'Contractor Tools — RAMS, Compliance & Job Readiness | EntireFM',
  description:
    'Free practical tools for UK contractors covering RAMS readiness, compliance documentation, COSHH preparation, job readiness and onboarding. Built around professional FM standards.',
});

const TOOLS = [
  {
    number: '01',
    title: 'RAMS Readiness Check',
    description:
      'Check whether your RAMS preparation covers the key areas a professional FM client is likely to expect before work starts.',
    href: '/contractor-tools/rams-readiness-check',
    timeEstimate: '5–8 min',
    badge: 'H&S',
    Icon: Shield,
  },
  {
    number: '02',
    title: 'Contractor Compliance Check',
    description:
      'Review the core documentation, insurance, competency and business information commonly required when working as a professional contractor.',
    href: '/contractor-tools/contractor-compliance-check',
    timeEstimate: '6–10 min',
    badge: 'COMPLIANCE',
    Icon: FileCheck2,
  },
  {
    number: '03',
    title: 'Contractor Document Checklist',
    description:
      'A practical mobile-friendly checklist of the documents contractors should keep current and ready for client or FM review.',
    href: '/contractor-tools/contractor-document-checklist',
    timeEstimate: '4–6 min',
    badge: 'DOCUMENTS',
    Icon: ClipboardCheck,
  },
  {
    number: '04',
    title: 'COSHH Readiness Check',
    description:
      'Check whether your preparation covers the key information needed when hazardous substances are involved in your work.',
    href: '/contractor-tools/coshh-readiness-check',
    timeEstimate: '4–6 min',
    badge: 'COSHH',
    Icon: FlaskConical,
  },
  {
    number: '05',
    title: 'Contractor Onboarding Checklist',
    description:
      'Work through the information and documentation commonly needed when joining a professional contractor network.',
    href: '/contractor-tools/contractor-onboarding-checklist',
    timeEstimate: '5–8 min',
    badge: 'ONBOARDING',
    Icon: Users,
  },
  {
    number: '06',
    title: 'Job Readiness Check',
    description:
      'A pre-attendance checklist covering people, documentation, equipment, site information and evidence requirements.',
    href: '/contractor-tools/job-readiness-check',
    timeEstimate: '3–5 min',
    badge: 'JOB PREP',
    Icon: Wrench,
  },
];

export default function ContractorToolsHubPage() {
  return (
    <>
      <Header solid />
      <main>
        {/* Hero */}
        <section className="relative bg-[#0B1220] overflow-hidden">
          {/* Ambient gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 80% 60% at 50% -20%, rgba(37, 99, 235, 0.35), transparent 70%),
                radial-gradient(ellipse 50% 50% at 85% 30%, rgba(124, 58, 237, 0.2), transparent 60%)
              `,
            }}
          />
          {/* Blueprint grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-electric animate-pulse" />
              <span className="text-[11px] tracking-widest text-slate-400 uppercase font-light">
                Contractor Tools
              </span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extralight tracking-tight text-white leading-[1.15]">
                Tools to help you run contracting work properly.
              </h1>
              <p className="mt-4 text-base text-slate-300 leading-relaxed font-light max-w-2xl">
                Practical tools and checklists for UK contractors covering RAMS, compliance, documentation and job readiness.
                Built around the same standards professional FM clients expect from their supply chain.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/supplier-portal/register"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-brand-electric hover:bg-blue-700 text-white text-xs font-normal tracking-wider uppercase shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
              >
                Join the Contractor Portal
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/contractor-resources"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-normal tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
              >
                Explore Contractor Resources
              </Link>
            </div>
          </div>

          {/* Gradient rule */}
          <div className="h-[2px] w-full bg-gradient-to-r from-brand-electric via-brand-violet to-brand-pink opacity-80" />
        </section>

        {/* Tool Cards */}
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
          aria-labelledby="tools-heading"
        >
          <div className="mb-8">
            <p className="text-[11px] font-medium tracking-widest text-slate-500 uppercase mb-1">
              Available Tools
            </p>
            <h2 id="tools-heading" className="text-2xl font-extralight text-slate-900 tracking-tight">
              Six practical tools. No registration required.
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-light max-w-2xl">
              Use any tool immediately. Results are generated on your device — nothing is submitted or stored until you choose to take the next step.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool) => (
              <ToolHubCard
                key={tool.href}
                number={tool.number}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                timeEstimate={tool.timeEstimate}
                badge={tool.badge}
              />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-slate-50 border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[11px] font-medium tracking-widest text-slate-500 uppercase mb-8 text-center">
              The EntireFM Contractor Journey
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Contractor journey stages">
              {[
                { step: '01', title: 'Free tools help contractors prepare.', icon: ClipboardCheck },
                { step: '02', title: 'Contractor Resources help contractors understand.', icon: FileCheck2 },
                { step: '03', title: 'The Contractor Portal helps contractors operate.', icon: Shield },
                { step: '04', title: 'Membership connects approved contractors to the EntireFM network.', icon: Users },
              ].map(({ step, title, icon: Icon }) => (
                <li key={step} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-light tracking-widest text-slate-400 uppercase">{step}</span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                  <Icon className="h-5 w-5 text-brand-electric" aria-hidden="true" />
                  <p className="text-sm font-light text-slate-700 leading-snug">{title}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Conversion section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="rounded-sm border border-slate-200 bg-[#0B1220] p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-[11px] font-light tracking-widest text-slate-400 uppercase mb-2">
                  From getting ready to getting the work done
                </p>
                <h2 className="text-2xl sm:text-3xl font-extralight text-white leading-snug">
                  Your documents shouldn&rsquo;t live in isolation.
                </h2>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed font-light">
                  EntireFM gives professional contractors more than a place to upload documents. The Contractor Portal brings together the information, documentation and job processes needed to deliver work for professional FM clients.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 shrink-0">
                <Link
                  href="/supplier-portal/register"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-brand-electric hover:bg-blue-700 text-white text-xs font-normal tracking-wider uppercase shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
                >
                  Explore the Contractor Portal
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/suppliers/membership"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-normal tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  View Contractor Membership
                </Link>
                <Link
                  href="/suppliers/apply"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-normal tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Apply to become an EntireFM supplier
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
