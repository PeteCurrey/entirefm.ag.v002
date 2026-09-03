import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TradeHero } from "@/components/contractors/TradeHero";
import { TradeFmWorkflow } from "@/components/contractors/TradeFmWorkflow";
import { TradeComplianceGrid } from "@/components/contractors/TradeComplianceGrid";
import { TradePortalShowcase } from "@/components/contractors/TradePortalShowcase";
import { TradeDocsGrid } from "@/components/contractors/TradeDocsGrid";
import { TradeFaqAccordion } from "@/components/contractors/TradeFaqAccordion";
import { TradeConversionBridge } from "@/components/contractors/TradeConversionBridge";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";

export const metadata: Metadata = generateRouteMetadata("/contractors/plumbing", {
  title: "Plumbing Contractors UK | Commercial Plumbing & Water Services Network | EntireFM",
  description:
    "Join the EntireFM Plumbing Contractor Network. Manage WRAS compliance, water hygiene, commercial plumbing RAMS, and reactive FM work orders.",
});

const PLUMB_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m for corporate facilities)",
      "Employers Liability Insurance (£10m statutory for all employers)",
      "Water damage / escape of water indemnity endorsement",
    ],
  },
  {
    category: "Trade Accreditations",
    mandatoryType: "Trade Competency" as const,
    items: [
      "CIPHE (Chartered Institute of Plumbing and Heating Engineering) or APHC membership",
      "WaterSafe / WRAS Approved Plumber Scheme registration",
      "Gas Safe Register (where commercial hot water boilers / gas water heaters apply)",
    ],
  },
  {
    category: "Operative Competency & Safety",
    mandatoryType: "Operational Standard" as const,
    items: [
      "NVQ Level 2/3 Plumbing and Heating / JIB-PMES Card",
      "Unvented Hot Water Storage Systems (G3 Building Regulations)",
      "Legionella Awareness & Water Hygiene (ACOP L8 / HSG274)",
      "Hot Works Passport for open flame soldering and pipe jointing",
    ],
  },
];

const PLUMB_DOCS = [
  {
    title: "Plumbing RAMS Guide",
    href: "/contractor-resources/rams/what-are-rams",
    desc: "Complete guide to risk assessments for hot water, drainage, pipe freezing, and isolation.",
    type: "GUIDE" as const,
  },
  {
    title: "RAMS Template (11-Section)",
    href: "/contractor-resources/rams/how-to-write-rams",
    desc: "Standard commercial RAMS framework covering water isolations, hot works, and testing.",
    type: "TEMPLATE" as const,
  },
  {
    title: "Plumbing Risk Assessment",
    href: "/contractor-resources/risk-assessments/what-is-a-risk-assessment",
    desc: "5x5 risk evaluation covering scalding, flood risk, confined voids, and chemical jointing.",
    type: "GUIDE" as const,
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/winning-work/how-to-get-facilities-management-work",
    desc: "6 statutory pillars, WRAS tracking, and automated 90/60/30-day credential alerts.",
    type: "COMPLIANCE" as const,
  },
];

const PLUMB_FAQS = [
  {
    question: "What plumbing jobs does EntireFM allocate to contractors?",
    answer:
      "Work includes commercial booster set repairs, unvented cylinder servicing, TMV (Thermostatic Mixing Valve) testing, major leak tracing, sanitaryware replacements, pipe freeze isolation repairs, and emergency reactive call-outs.",
  },
  {
    question: "What water safety standards are required?",
    answer:
      "Contractors must demonstrate competence in WRAS Water Supply (Water Fittings) Regulations 1999 and Legionella awareness (ACOP L8). All replacement fittings and backflow prevention devices must be WRAS approved.",
  },
  {
    question: "How does the Contractor Portal support commercial plumbers?",
    answer:
      "The portal allows plumbing contractors to maintain verified insurance and G3/Gas Safe qualifications, generate site isolation RAMS, and receive clear work orders with photographic evidence capture on mobile.",
  },
];

export default function PlumbingContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Plumbing Contractors", url: "/contractors/plumbing" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Plumbing"
          title="Plumbing Contractors"
          subtitle="Commercial water systems, booster pumps &amp; FM contractor network."
          intro="A professional operating platform for UK commercial plumbing contractors — combining WRAS compliance, water hygiene tracking, site isolation RAMS, and commercial FM work orders."
          imageSrc="/images/editorial/entirefm-plumbing-booster-set-2000w.webp"
          imageAlt="Commercial plumbing water booster pump set"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join the Plumbing Network", href: "/contractors/join" }}
          secondaryCta={{ label: "Explore Contractor Hub", href: "/contractors" }}
          facts={[
            { figure: "WRAS & Water Regs", label: "Commercial Assurance" },
            { figure: "£95 / yr", label: "Supplier Membership" },
            { figure: "24/7 Dispatch", label: "Reactive & PPM Jobs" },
          ]}
        />

        {/* Trade Context Introduction */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Safeguarding Commercial Water Systems &amp; Critical Infrastructure
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Commercial plumbing encompasses high-capacity potable booster sets, calorifiers, commercial drainage stacks, and temperature-controlled domestic water distribution. In commercial premises, water leaks can cause catastrophic structural and electrical damage, while poor water management risks Legionella contamination under <strong>HSE ACOP L8</strong>.
              </p>
              <p>
                The EntireFM Contractor Platform equips plumbing contractors with the systems to manage WRAS and G3 unvented credentials, generate site isolation RAMS, capture before-and-after photographic evidence, and receive commercial FM work instructions.
              </p>
            </div>
          </div>
        </section>

        {/* Operational Workflow */}
        <TradeFmWorkflow tradeName="Plumbing" />

        {/* Compliance Grid */}
        <TradeComplianceGrid tradeName="Plumbing" requirements={PLUMB_COMPLIANCE} />

        {/* Portal Showcase */}
        <TradePortalShowcase
          tradeName="Plumbing"
          sampleJob={{
            title: "Potable Water Booster Pump Variable Speed Drive Investigation",
            ref: "WO-84936-PLUMB",
            location: "Multi-Storey Commercial Complex, Leeds LS2",
            poValue: "£650.00 PO",
            scope: "Investigate pressure loss on 3-pump booster set. Diagnose faulty transducer on Pump 2, replace and recalibrate VSD controller. Verify continuous 4.5 bar supply.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m)", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "WaterSafe / WRAS Approved Plumber", expiry: "30 Sep 2026", status: "VERIFIED" },
            { name: "JIB-PMES Gold Card (Advanced Plumber)", expiry: "11 Dec 2026", status: "VERIFIED" },
          ]}
        />

        {/* Relevant Documentation Links */}
        <TradeDocsGrid tradeName="Plumbing" docs={PLUMB_DOCS} />

        {/* Conversion Bridge */}
        <TradeConversionBridge tradeName="Plumbing Contractors" />

        {/* FAQs */}
        <TradeFaqAccordion tradeName="Plumbing" faqs={PLUMB_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
