import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ShieldCheck, Award, Users, Wrench, Building2, CheckCircle2 } from 'lucide-react';
import type { TemplateProps } from './types';

export function TemplateAbout({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: content.h1, url: route.path },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* About Hero */}
        <section className="bg-brand-graphite border-b border-brand-edge-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom max-w-4xl space-y-4">
            <span className="badge-gold">{content.eyebrow || 'Engineering & Estate Governance'}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {content.h1}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {content.heroIntro || content.metaDescription}
            </p>
          </div>
        </section>

        <TrustBar />

        {/* Core Narrative */}
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl space-y-8">
            <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
              <div>
                <span className="badge-technical">Direct Accountability</span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-graphite mt-2">
                  National Scale with Direct Regional Delivery
                </h2>
                <p className="mt-3">
                  EntireFM provides single-source Hard FM, M&E engineering, statutory compliance testing, and specialist facilities services across the UK.
                </p>
                <p className="mt-2 text-slate-600">
                  We bridge the gap between impersonal outsourcing conglomerates and under-resourced local contractors — delivering robust CAFM technology, rigorous compliance standards, and directly employed mobile engineering teams.
                </p>
              </div>

              {content.sections && content.sections.map((sec, idx) => (
                <div key={idx} className="pt-4 space-y-3">
                  <h2 className="text-2xl font-bold text-brand-graphite">{sec.heading}</h2>
                  <p>{sec.body}</p>
                </div>
              ))}
            </div>

            {/* Accreditations Rail */}
            <div className="pt-8 border-t border-brand-edge">
              <AccreditationRail />
            </div>
          </div>
        </section>

        {/* Conversion Section */}
        <ProposalSection
          headline="Discuss Your Facilities Management Requirements"
          subheadline="Consult directly with our leadership team for estate dilapidation surveys, maintenance contract reviews, and tailored SLA proposals."
        />
      </main>
      <Footer />
    </div>
  );
}
