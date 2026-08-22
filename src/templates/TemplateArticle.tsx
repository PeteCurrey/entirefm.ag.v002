import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Calendar, User, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import type { TemplateProps } from './types';
import Link from 'next/link';

export function TemplateArticle({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/blog' },
    { name: content.h1, url: route.path },
  ];

  const relatedLinks = (content.relatedRoutes || ['/services', '/ppm', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Related Guide',
    description: `Read more about EntireFM's capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Article Header */}
        <section className="bg-brand-navy border-b border-brand-border-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom max-w-4xl space-y-4">
            <span className="badge-gold">{content.eyebrow || 'FM Insights & Technical Guidance'}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {content.h1}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {content.heroIntro || content.metaDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-brand-border-dark/80">
              <span className="flex items-center gap-1.5 text-slate-300">
                <User className="w-3.5 h-3.5 text-brand-gold" />
                EntireFM Technical Editorial
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                Updated: 2026
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-brand-gold" />
                Technical Article
              </span>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Article Body */}
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl space-y-8">
            <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
              {content.sections && content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-navy">{sec.heading}</h2>
                  <p>{sec.body}</p>
                  {sec.bullets && (
                    <ul className="space-y-2 pt-2">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {!content.sections?.length && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-navy">Overview & Practical Guidance</h2>
                  <p>
                    Effective estate governance and planned facilities management balance operational safety, regulatory compliance, and lifecycle asset care. EntireFM’s technical teams work directly with building managers to maintain continuous building availability.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Articles & Services */}
        <section className="section-padding bg-brand-surface border-t border-brand-border">
          <div className="container-custom max-w-4xl">
            <div className="mb-8">
              <span className="badge-technical">Further Reading</span>
              <h2 className="text-2xl font-bold text-brand-navy mt-2">
                Related Services & FM Intelligence
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* Conversion Section */}
        <ProposalSection
          headline="Discuss Your Estate Requirements with Our Technical Team"
          subheadline="Our engineering directors provide comprehensive facilities reviews, planned maintenance audits, and single-source FM proposals."
        />
      </main>
      <Footer />
    </div>
  );
}
