import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocationHero } from "@/components/contractors/geo/LocationHero";
import { CONTRACTOR_LOCATIONS } from "@/lib/data/contractor-locations";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";
import { MapPin, ArrowRight, ShieldCheck, Building2, Compass, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractors/locations", {
  title: "Contractor Network Locations UK | Regional FM Opportunities | EntireFM",
  description:
    "Explore the EntireFM Regional Contractor Network. Commercial facilities management contractor opportunities and platform coverage across Sheffield, Manchester, Leeds, Nottingham and surrounding areas.",
});

const REGIONS = [
  {
    tier: "Tier 1 — Core Operating Hubs",
    badge: "LIVE DISPATCH ACTIVE",
    locations: ["sheffield", "manchester", "leeds", "nottingham"],
  },
  {
    tier: "Tier 2 — Strategic Expansion Zones",
    badge: "EXPANSION ONBOARDING",
    locations: [],
    note: "EntireFM is pre-registering trade contractors across Birmingham & the West Midlands, Liverpool, and Newcastle in preparation for upcoming commercial client mobilisations.",
  },
];

export default function ContractorLocationsHub() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Locations", url: "/contractors/locations" },
  ];

  const locList = Object.values(CONTRACTOR_LOCATIONS);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <LocationHero
          locationName="UK Regional"
          region="Operating Hubs"
          eyebrow="ENTIREFM CONTRACTOR NETWORK"
          title="Find Your Regional EntireFM Contractor Network"
          subtitle="Operating platform, compliance management &amp; regional commercial FM delivery."
          intro="EntireFM works with specialist trade contractors across key commercial hubs. Explore regional requirements, active contractor disciplines, and commercial opportunities in your area."
          imageSrc="/images/editorial/entirefm-hero-headquarters-2560w.webp"
          imageAlt="EntireFM UK regional commercial contractor network"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Apply to Join the Network", href: "/suppliers/apply" }}
          secondaryCta={{ label: "View Membership (£295/yr)", href: "/suppliers/membership" }}
          statusBadge="UK Multi-Region"
        />

        {/* Regional Hubs Grid */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">REGIONAL DIRECTORY</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Select Your Operating Location
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Explore local commercial property contexts, high-demand trade disciplines, and compliance frameworks for your region.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {locList.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/contractors/locations/${loc.slug}`}
                  className="bg-[#FAFAF8] border border-slate-200 rounded-sm p-6 space-y-4 shadow-xs hover:-translate-y-1 hover:border-[#EA580C]/50 hover:bg-white hover:shadow-card transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 bg-slate-900 text-white rounded-sm group-hover:bg-[#EA580C] transition-colors">
                        <MapPin className="w-5 h-5" />
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm font-bold">
                        ACTIVE HUB
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                        {loc.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-500">{loc.county} &bull; {loc.region}</p>
                    </div>

                    <p className="text-xs text-slate-600 font-light leading-relaxed line-clamp-3">
                      {loc.commercialLandscape.overview}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 space-y-2">
                    <div className="text-[11px] text-slate-500 font-mono">
                      {loc.activeDisciplines.length} Active Trades Recruited
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-[#EA580C]">
                      <span>Explore {loc.name} Network</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Expansion Notice */}
            <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Compass className="w-4 h-4 text-[#EA580C]" />
                <span>Strategic Expansion Regions (Tier 2)</span>
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed max-w-3xl">
                EntireFM is currently pre-registering trade contractors across <strong>Birmingham &amp; West Midlands, Liverpool, and Newcastle</strong>. Contractors in these areas can join the platform now to establish verified compliance in advance of commercial contract mobilisations.
              </p>
              <Link
                href="/suppliers/apply"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:underline"
              >
                Pre-Register for Expansion Regions &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
