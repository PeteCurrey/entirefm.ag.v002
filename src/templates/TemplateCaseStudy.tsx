import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection, InlineCTA } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Building2, CheckCircle2, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';

export function TemplateCaseStudy() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
    { name: 'Commercial Property M&E Overhaul', url: '/case-studies' },
  ];

  const relatedLinks = [
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services' },
    { path: '/ppm', label: 'Planned Preventative Maintenance (PPM)' },
    { path: '/fm-london', label: 'FM London (24/7 Operations Desk)' },
    { path: '/commercial-facilities-management', label: 'Commercial Property FM' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="bg-brand-navy border-b border-brand-border-dark/60">
          <div className="container-custom">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        {/* Case Study Hero */}
        <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark py-14 sm:py-20">
          <div className="container-custom relative z-10">
            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="badge-gold">Commercial Real Estate</span>
                <span className="badge-dark text-slate-300">London & South East</span>
                <span className="badge-dark text-slate-300">14 Multi-Let Buildings</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Multi-Site Commercial Office Portfolio: M&E Modernization & Total FM Consolidation
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
                How EntireFM transitioned 14 commercial office assets from three fragmented contractors to a unified SFG20 PPM schedule with zero tenant disruption.
              </p>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Case Study Body */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-brand-navy">The Client & Estate Challenge</h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    A prominent commercial managing agent overseeing a 14-building office portfolio across Central London and the M25 corridor faced escalating tenant complaints, recurring HVAC breakdowns, and incomplete statutory compliance certification from multiple disjointed contractors.
                  </p>
                </div>

                <div className="p-6 bg-brand-surface border border-brand-border rounded-sm">
                  <h3 className="text-base font-bold text-brand-navy mb-2">Scope of Services Delivered</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>HVAC, VRV & Boiler Plant Room Servicing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>NICEIC Electrical EICR & Emergency Lighting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>L8 Legionella Water Testing & Risk Audits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>24/7 Dedicated Emergency Engineering Helpdesk</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-brand-navy">EntireFM Engineering Approach</h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    EntireFM conducted a 30-day comprehensive asset validation survey, tagging all critical plant in our CAFM system and establishing standardized SFG20 maintenance routines. We embedded dedicated mobile engineers to execute planned visits and established a priority 2-hour Central London emergency response window.
                  </p>
                </div>

                <InlineCTA
                  title="Facing similar estate maintenance challenges?"
                  description="Our senior surveyors review existing property asset registers, audit compliance gaps, and structure optimized contract transitions."
                  buttonText="Request Portfolio Review"
                  buttonLink="#enquiry"
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4 shadow-command">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold block">Verified Results</span>
                  <h3 className="text-base font-bold text-white">Measurable Operational Impact</h3>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">100% Audit Compliance</strong>
                        <span>All 14 buildings fully certified within 90 days.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">32% Breakdown Reduction</strong>
                        <span>Proactive servicing prevented recurring plant failures.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Single Invoicing Stream</strong>
                        <span>Saved property manager over 20 admin hours monthly.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <RelatedLinks links={relatedLinks} title="Related Capabilities & Sector Solutions" />

        <ProposalSection
          headline="Request a Case Study Consultation"
          subheadline="Discuss how EntireFM can structure an efficient multi-site facilities management contract for your portfolio."
        />
      </main>
      <Footer />
    </div>
  );
}
