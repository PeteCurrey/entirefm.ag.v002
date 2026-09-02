import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TradeHero } from "@/components/contractors/TradeHero";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";
import {
  Zap,
  Cog,
  Wind,
  Droplets,
  Shield,
  Sparkles,
  Flame,
  Trees,
  Hammer,
  Waves,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck
} from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractors", {
  title: "Specialist Trade Contractors UK | EntireFM Contractor Network",
  description:
    "Explore the EntireFM Contractor Network across 10 commercial trade disciplines. Electrical, Mechanical, HVAC, Plumbing, Roofing, Cleaning, Fire & Security, Grounds, Fabric, and Drainage.",
});

const TRADES = [
  {
    slug: "electrical",
    name: "Electrical Contractors",
    icon: Zap,
    desc: "Commercial electrical installation, testing (EICR), remedial repairs, switchgear inspection, and planned maintenance.",
    certs: "18th Edition BS7671 &bull; NICEIC / NAPIT &bull; ECS Gold Card",
  },
  {
    slug: "mechanical",
    name: "Mechanical Contractors",
    icon: Cog,
    desc: "Commercial pump sets, pressurisation units, valves, plantroom refurbishment, and mechanical maintenance.",
    certs: "City & Guilds Mechanical &bull; Water Regs &bull; CSCS Skilled",
  },
  {
    slug: "hvac",
    name: "HVAC Contractors",
    icon: Wind,
    desc: "Commercial chillers, AHUs, VRF/VRV air conditioning, ventilation, and statutory F-Gas refrigerant checks.",
    certs: "Refcom Elite &bull; F-Gas Cat 1 &bull; City & Guilds 2079",
  },
  {
    slug: "plumbing",
    name: "Plumbing Contractors",
    icon: Droplets,
    desc: "Commercial hot and cold water services, booster pumps, sanitaryware, leak investigation, and TMV servicing.",
    certs: "Gas Safe (Commercial/Domestic) &bull; WRAS &bull; JIB-PMES",
  },
  {
    slug: "roofing",
    name: "Roofing Contractors",
    icon: Shield,
    desc: "Commercial flat roofing, gutter clearing, cladding, membrane repairs, and safe working at height.",
    certs: "NFRC &bull; Working at Height &bull; IPAF / PASMA",
  },
  {
    slug: "cleaning",
    name: "Cleaning Contractors",
    icon: Sparkles,
    desc: "Commercial office cleaning, industrial deep cleans, builders cleans, floor restoration, and COSHH chemical controls.",
    certs: "BICSc Standard &bull; COSHH Certified &bull; Public Liability £5m+",
  },
  {
    slug: "fire-security",
    name: "Fire & Security Contractors",
    icon: Flame,
    desc: "Fire alarms, emergency lighting, access control, CCTV, intruder alarms, and statutory BS5839 servicing.",
    certs: "BAFE / FIA &bull; NSI / SSAIB &bull; 18th Edition",
  },
  {
    slug: "grounds-maintenance",
    name: "Grounds Maintenance Contractors",
    icon: Trees,
    desc: "Commercial landscaping, grass cutting, weed control, tree surgery, hedge trimming, and gritting.",
    certs: "NPTC / City & Guilds &bull; PA1/PA6 Pesticide &bull; LANTRA",
  },
  {
    slug: "fabric-maintenance",
    name: "Fabric Maintenance Contractors",
    icon: Hammer,
    desc: "Commercial carpentry, joinery, plastering, painting, glazing, locksmithing, and general building repairs.",
    certs: "CSCS Trade Certified &bull; Fire Door Inspection &bull; Asbestos Awareness",
  },
  {
    slug: "drainage",
    name: "Drainage Contractors",
    icon: Waves,
    desc: "High-pressure water jetting (HPWJ), CCTV drain surveys, grease trap servicing, unblocking, and interceptor maintenance.",
    certs: "WJA Certified &bull; Confined Space &bull; Street Works (NRSWA)",
  },
];

export default function ContractorsDirectoryHub() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Network", url: "/contractors" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Trade"
          title="Specialist Trade Contractors"
          subtitle="Operating platform &amp; commercial FM network."
          intro="EntireFM works with specialist contractors across 10 commercial disciplines. Access our dedicated operating platform, maintain compliance credentials, and manage commercial FM delivery."
          imageSrc="/images/editorial/entirefm-hero-headquarters-2560w.webp"
          imageAlt="EntireFM UK commercial facilities management contractor network"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join Contractor Network", href: "/suppliers/apply" }}
          secondaryCta={{ label: "View Membership Details", href: "/suppliers/membership" }}
          facts={[
            { figure: "10 Core Trades", label: "Specialist Disciplines" },
            { figure: "£295 / yr", label: "All-Inclusive Platform" },
            { figure: "Fair Dispatch", label: "Merit-Based Allocation" },
          ]}
        />

        {/* Trade Grid */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-wide space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">TRADE DISCIPLINES</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Select Your Contractor Discipline
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Explore trade-specific compliance frameworks, RAMS requirements, operational workflows, and Contractor Portal tooling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRADES.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.slug}
                    href={`/contractors/${t.slug}`}
                    className="bg-[#FAFAF8] border border-slate-200 rounded-sm p-6 space-y-4 shadow-xs hover:-translate-y-1 hover:border-[#EA580C]/50 hover:bg-white hover:shadow-card transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="p-2.5 bg-slate-900 text-white rounded-sm group-hover:bg-[#EA580C] transition-colors">
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          DISCIPLINE
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                        {t.name}
                      </h3>

                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {t.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 space-y-2">
                      <div className="text-[11px] text-slate-500 font-mono" dangerouslySetInnerHTML={{ __html: t.certs }} />
                      <div className="flex items-center gap-1 text-xs font-medium text-[#EA580C]">
                        <span>Explore {t.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Regional Locations Quick Links */}
        <section className="py-16 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="eyebrow eyebrow-light">REGIONAL HUBS</span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                  Regional Contractor Coverage Across Core UK Hubs
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                  Join an active contractor network operating in your commercial corridor.
                </p>
              </div>

              <Link
                href="/contractors/locations"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:underline shrink-0"
              >
                <span>View All Locations &amp; Expansion Zones</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Sheffield & S. Yorks", href: "/contractors/locations/sheffield", badge: "Primary Hub" },
                { name: "Greater Manchester", href: "/contractors/locations/manchester", badge: "North West Hub" },
                { name: "Leeds & W. Yorks", href: "/contractors/locations/leeds", badge: "West Yorkshire" },
                { name: "Nottingham & E. Mids", href: "/contractors/locations/nottingham", badge: "East Midlands" },
              ].map((loc, idx) => (
                <Link
                  key={idx}
                  href={loc.href}
                  className="bg-white border border-slate-200 rounded-sm p-4 space-y-2 hover:border-[#EA580C]/50 hover:shadow-xs transition-all group"
                >
                  <span className="text-[10px] font-mono text-[#EA580C] font-semibold">{loc.badge}</span>
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors">
                    {loc.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-light flex items-center gap-1">
                    <span>Explore Network</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
