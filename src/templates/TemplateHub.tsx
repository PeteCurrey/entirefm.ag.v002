import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import Link from 'next/link';
import { ArrowRight, Layers, Building2, MapPin, Wrench } from 'lucide-react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import { ALL_ROUTES } from '@/lib/routes/route-registry';

interface HubItem {
  title: string;
  path: string;
  category?: string;
  description: string;
  tag?: string;
}

interface TemplateHubProps {
  route: RouteRecord;
  content: ContentRecord;
  hubType?: 'services' | 'sectors' | 'locations' | 'case-studies' | 'general';
  items?: HubItem[];
}

export function TemplateHub({ route, content, hubType, items }: TemplateHubProps) {
  const p = route.path;
  const determinedType = hubType || (p.includes('sector') ? 'sectors' : p.includes('location') ? 'locations' : p.includes('case-study') || p.includes('portfolio') ? 'case-studies' : 'services');
  
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: content.h1, url: p },
  ];

  // Auto-generate items if not supplied
  const hubItems: HubItem[] = items && items.length > 0
    ? items
    : ALL_ROUTES.filter(r => {
        if (determinedType === 'services') return r.routeType === 'service';
        if (determinedType === 'sectors') return r.routeType === 'sector';
        if (determinedType === 'locations') return r.routeType === 'location';
        return r.path !== '/' && r.protected;
      }).slice(0, 18).map(r => ({
        title: r.path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        path: r.path,
        category: r.sitemapGroup,
        description: `Explore EntireFM's capabilities and services for ${r.path.replace(/^\//, '').replace(/-/g, ' ')}.`,
      }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hub Hero */}
        <section className="bg-brand-graphite border-b border-brand-edge-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom max-w-4xl space-y-4">
            <span className="badge-gold flex items-center gap-1.5 w-fit">
              <Layers className="w-3.5 h-3.5" />
              {content.eyebrow || 'EntireFM Directory Hub'}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {content.h1}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {content.heroIntro || content.metaDescription}
            </p>
          </div>
        </section>

        <TrustBar />

        {/* Hub Items Grid */}
        <section className="section-padding bg-brand-surface">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hubItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.path}
                  className="p-6 bg-white border border-brand-edge rounded-sm hover:border-brand-electric hover:shadow-elevated transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {item.category && (
                      <span className="text-xs font-mono uppercase text-brand-electric block font-semibold">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-brand-graphite group-hover:text-brand-electric transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-brand-edge flex items-center gap-1 text-xs font-bold text-brand-graphite group-hover:text-brand-electric">
                    <span>View Capability Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Conversion Section */}
        <ProposalSection
          headline="Looking for a Custom Estate Solution?"
          subheadline="Our engineering and facilities directors can design an integrated multi-service contract tailored to your property portfolio."
        />
      </main>
      <Footer />
    </div>
  );
}
