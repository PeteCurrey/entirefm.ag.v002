import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import Link from 'next/link';
import { ArrowRight, Layers, Building2, MapPin, Wrench } from 'lucide-react';

interface HubItem {
  title: string;
  path: string;
  category?: string;
  description: string;
  tag?: string;
}

interface TemplateHubProps {
  hubType: 'services' | 'sectors' | 'locations';
  title: string;
  subtitle: string;
  items: HubItem[];
}

export function TemplateHub({ hubType, title, subtitle, items }: TemplateHubProps) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: title, url: `/${hubType}` },
  ];

  const getIcon = () => {
    switch (hubType) {
      case 'services': return Wrench;
      case 'sectors': return Building2;
      case 'locations': return MapPin;
      default: return Layers;
    }
  };

  const Icon = getIcon();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="bg-brand-navy border-b border-brand-border-dark/60">
          <div className="container-custom">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        {/* Hub Hero */}
        <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark py-14 sm:py-20">
          <div className="container-custom relative z-10">
            <div className="max-w-4xl space-y-4">
              <span className="badge-gold flex items-center gap-1.5 w-fit">
                <Icon className="w-3.5 h-3.5" />
                EntireFM Directory Hub
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Hub Items Grid */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-brand-surface border border-brand-border rounded-sm hover:border-brand-gold/60 transition-all flex flex-col justify-between group shadow-subtle"
                >
                  <div>
                    {item.category && (
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 bg-white px-2 py-0.5 border border-brand-border rounded-sm block w-fit mb-3">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-gold-dark transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    href={item.path}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy group-hover:text-brand-gold transition-colors pt-3 border-t border-brand-border"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AccreditationRail />

        <ProposalSection
          headline="Request an Estate Review or Consultation"
          subheadline="Our senior engineering surveyors provide comprehensive site assessments and custom SLA scopes across all UK regions."
        />
      </main>
      <Footer />
    </div>
  );
}
