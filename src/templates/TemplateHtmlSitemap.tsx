import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import Link from 'next/link';
import { ALL_ROUTES, getRoutesByGroup } from '@/lib/routes/route-registry';
import { Layers, Wrench, Building2, MapPin, Sparkles, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

export function TemplateHtmlSitemap() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Website Sitemap', url: '/html-sitemap' },
  ];

  const coreRoutes = getRoutesByGroup('core');
  const hardFmRoutes = getRoutesByGroup('hard-fm');
  const softFmRoutes = getRoutesByGroup('soft-fm');
  const cleaningRoutes = getRoutesByGroup('cleaning');
  const specialistRoutes = getRoutesByGroup('specialist-services');
  const sectorRoutes = getRoutesByGroup('sectors');
  const locationRoutes = getRoutesByGroup('locations');
  const localServiceRoutes = getRoutesByGroup('local-services');
  const insightRoutes = getRoutesByGroup('insights');
  const companyRoutes = getRoutesByGroup('company');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header solid />
      <main className="flex-1">
        <div className="bg-brand-graphite border-b border-brand-edge-dark/60">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* HTML Sitemap Hero */}
        <section className="bg-brand-graphite text-white py-14 sm:py-18 border-b border-brand-edge-dark">
          <div className="container-custom">
            <div className="max-w-3xl space-y-4">
              <span className="badge-gold">Website Navigation Directory</span>
              <h1 className="text-display-xl text-white">
                EntireFM Website Directory & HTML Sitemap
              </h1>
              <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-brand-mist/80">
                Explore our full organic architecture across facilities management services, sector frameworks, regional hubs, and specialist engineering pages.
              </p>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Structured Sitemap Categories */}
        <section className="section-padding bg-white">
          <div className="container-custom space-y-12">
            {/* Hard FM & Engineering */}
            <div>
              <h2 className="text-xl font-bold text-brand-graphite mb-4 flex items-center gap-2 pb-2 border-b border-brand-edge">
                <Wrench className="w-5 h-5 text-brand-electric" />
                Hard Facilities Management & M&E Engineering ({hardFmRoutes.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {hardFmRoutes.map(r => (
                  <Link
                    key={r.path}
                    href={r.path}
                    className="p-3 bg-brand-surface border border-brand-edge rounded-sm text-xs font-semibold text-brand-carbon hover:text-brand-electric hover:border-brand-electric/60 transition-all flex items-center justify-between"
                  >
                    <span>{r.path}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Soft FM & Specialist Cleaning */}
            <div>
              <h2 className="text-xl font-bold text-brand-graphite mb-4 flex items-center gap-2 pb-2 border-b border-brand-edge">
                <Sparkles className="w-5 h-5 text-brand-electric" />
                Soft FM & Commercial Cleaning ({softFmRoutes.length + cleaningRoutes.length + specialistRoutes.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...softFmRoutes, ...cleaningRoutes, ...specialistRoutes].map(r => (
                  <Link
                    key={r.path}
                    href={r.path}
                    className="p-3 bg-brand-surface border border-brand-edge rounded-sm text-xs font-semibold text-brand-carbon hover:text-brand-electric hover:border-brand-electric/60 transition-all flex items-center justify-between"
                  >
                    <span>{r.path}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Sector Solutions */}
            <div>
              <h2 className="text-xl font-bold text-brand-graphite mb-4 flex items-center gap-2 pb-2 border-b border-brand-edge">
                <Building2 className="w-5 h-5 text-brand-electric" />
                Industry Sectors & Specialist Environments ({sectorRoutes.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sectorRoutes.map(r => (
                  <Link
                    key={r.path}
                    href={r.path}
                    className="p-3 bg-brand-surface border border-brand-edge rounded-sm text-xs font-semibold text-brand-carbon hover:text-brand-electric hover:border-brand-electric/60 transition-all flex items-center justify-between"
                  >
                    <span>{r.path}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Regional Operating Centres & London */}
            <div>
              <h2 className="text-xl font-bold text-brand-graphite mb-4 flex items-center gap-2 pb-2 border-b border-brand-edge">
                <MapPin className="w-5 h-5 text-brand-electric" />
                Regional Hubs & City FM Pages ({locationRoutes.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {locationRoutes.map(r => (
                  <Link
                    key={r.path}
                    href={r.path}
                    className="p-3 bg-brand-surface border border-brand-edge rounded-sm text-xs font-semibold text-brand-carbon hover:text-brand-electric hover:border-brand-electric/60 transition-all flex items-center justify-between"
                  >
                    <span>{r.path}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Local Specialist Services */}
            <div>
              <h2 className="text-xl font-bold text-brand-graphite mb-4 flex items-center gap-2 pb-2 border-b border-brand-edge">
                <MapPin className="w-5 h-5 text-brand-electric" />
                Local Specialist Service Pages ({localServiceRoutes.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {localServiceRoutes.map(r => (
                  <Link
                    key={r.path}
                    href={r.path}
                    className="p-3 bg-brand-surface border border-brand-edge rounded-sm text-xs font-semibold text-brand-carbon hover:text-brand-electric hover:border-brand-electric/60 transition-all flex items-center justify-between"
                  >
                    <span>{r.path}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Insights & Company */}
            <div>
              <h2 className="text-xl font-bold text-brand-graphite mb-4 flex items-center gap-2 pb-2 border-b border-brand-edge">
                <BookOpen className="w-5 h-5 text-brand-electric" />
                Insights, Guides & Corporate ({insightRoutes.length + companyRoutes.length + coreRoutes.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...insightRoutes, ...companyRoutes, ...coreRoutes].map(r => (
                  <Link
                    key={r.path}
                    href={r.path}
                    className="p-3 bg-brand-surface border border-brand-edge rounded-sm text-xs font-semibold text-brand-carbon hover:text-brand-electric hover:border-brand-electric/60 transition-all flex items-center justify-between"
                  >
                    <span>{r.path}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
