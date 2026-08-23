import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { CheckCircle2, Briefcase, Mail, Phone, ArrowRight } from 'lucide-react';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplateCareers({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Careers', url: route.path },
  ];

  const roles = [
    {
      title: 'Commercial M&E Mobile Engineer',
      location: 'London & Home Counties / Midlands',
      type: 'Full-time / Permanent',
      description: 'Experienced commercial mechanical and electrical engineers delivering planned maintenance and reactive callouts.',
    },
    {
      title: 'HVAC & Refrigeration Technician',
      location: 'Midlands & Yorkshire Hubs',
      type: 'Full-time / Permanent',
      description: 'F-Gas qualified AC and chiller specialists for commercial estate maintenance and installations.',
    },
    {
      title: '24/7 Operations Helpdesk Coordinator',
      location: 'Lincoln Operational Centre',
      type: 'Full-time / Shift-based',
      description: 'Triage incoming client maintenance tickets, coordinate engineer dispatch, and manage CAFM logs.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Careers Hero */}
        <section className="bg-brand-graphite border-b border-brand-edge-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom">
            <div className="max-w-3xl space-y-4">
              <span className="badge-gold">{content.eyebrow || 'Join Our Engineering Team'}</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {content.h1}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {content.heroIntro || content.metaDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a href={`mailto:${CONTACT_CONFIG.careersEmail}`} className="btn-primary py-3 px-6 text-xs font-bold shadow-elevated">
                  Submit CV <ArrowRight className="w-4 h-4" />
                </a>
                <a href={CONTACT_CONFIG.mainPhone.href} className="btn-phone py-3 px-4 text-xs font-semibold">
                  <Phone className="w-3.5 h-3.5 text-brand-electric" />
                  <span>Contact Recruitment</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Open Positions */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <span className="badge-technical">Current Vacancies</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-graphite mt-2">
                Available Positions & Engineering Opportunities
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Join our national team of multi-skilled engineers, facilities specialists, and operations coordinators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roles.map((r, idx) => (
                <div key={idx} className="p-6 bg-brand-surface border border-brand-edge rounded-sm space-y-4 hover:border-brand-electric transition-colors">
                  <div className="flex items-center gap-2 text-xs font-mono text-brand-electric">
                    <Briefcase className="w-4 h-4" />
                    <span>{r.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-graphite">{r.title}</h3>
                  <p className="text-xs text-slate-500">{r.location}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{r.description}</p>
                  <a
                    href={`mailto:${CONTACT_CONFIG.careersEmail}?subject=Application for ${encodeURIComponent(r.title)}`}
                    className="btn-technical text-xs inline-flex items-center gap-2 mt-2"
                  >
                    Apply for Position <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits & Culture */}
        <section className="section-padding bg-brand-surface border-t border-brand-edge">
          <div className="container-custom max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-brand-graphite">Why Work With EntireFM?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 bg-white border border-brand-edge rounded-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-electric shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-graphite">Modern Fleet & Tooling</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Top-tier equipped vans, calibration testing gear, and uniform.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white border border-brand-edge rounded-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-electric shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-graphite">Continuous CPD & Training</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Funded certifications: Gas Safe, NICEIC, F-Gas, IOSH, IPAF.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
