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

export const metadata: Metadata = generateRouteMetadata("/contractors/roofing", {
  title: "Roofing Contractors UK | Commercial Roofing & Height Safety Network | EntireFM",
  description:
    "Join the EntireFM Roofing Contractor Network. Manage Working at Height compliance, flat roofing RAMS, gutter maintenance, and commercial FM work orders.",
});

const ROOF_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m for high-rise/commercial portfolios)",
      "Employers Liability Insurance (£10m mandatory for all employers)",
      "Specific working-at-height and hot-works insurance endorsements (torch-on membranes)",
    ],
  },
  {
    category: "Trade Accreditations",
    mandatoryType: "Trade Competency" as const,
    items: [
      "NFRC (National Federation of Roofing Contractors) or CompetentRoofer membership",
      "Liquid Roofing and Waterproofing Association (LRWA) accreditation where applicable",
      "Valid SSIP Member Scheme accreditation (CHAS / SafeContractor / Constructionline)",
    ],
  },
  {
    category: "Operative Competency & Height Safety",
    mandatoryType: "Operational Standard" as const,
    items: [
      "Work at Height Regulations 2005 compliant training & harness inspection certification",
      "IPAF (3a/3b MEWPs) & PASMA (mobile access towers) for high-level access",
      "Roofing CSCS Skilled Worker cards and SSSTS/SMSTS site supervision",
      "Emergency rescue from height plan and trained rescue personnel on site",
    ],
  },
];

const ROOF_DOCS = [
  {
    title: "Working at Height RAMS Guide",
    href: "/contractor-resources/rams",
    desc: "Comprehensive guide to edge protection, fragile roof lights, and harness safety.",
    type: "GUIDE" as const,
  },
  {
    title: "RAMS Template (11-Section)",
    href: "/contractor-resources/rams-template",
    desc: "Standard commercial RAMS framework covering roof access, lifting, and weather limits.",
    type: "TEMPLATE" as const,
  },
  {
    title: "Roofing Risk Assessment",
    href: "/contractor-resources/risk-assessment",
    desc: "5x5 risk evaluation covering wind thresholds, fragile surfaces, and dropped objects.",
    type: "GUIDE" as const,
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/contractor-compliance",
    desc: "6 statutory pillars, insurance verification, and automated 90/60/30-day credential alerts.",
    type: "COMPLIANCE" as const,
  },
];

const ROOF_FAQS = [
  {
    question: "What roofing work does EntireFM allocate to contractors?",
    answer:
      "Work includes bi-annual planned gutter clearing, flat roof single-ply/felt leak repairs, valley gutter relining, flashing and coping repairs, cladding remediation, roof survey inspections (including drone thermography), and emergency storm damage response.",
  },
  {
    question: "What height safety precautions are enforced on EntireFM client sites?",
    answer:
      "All roofing contractors must supply detailed working-at-height RAMS. Fragile roof lights must be demarcated or covered with safety grilles, perimeter edge protection or fall-arrest systems must be deployed, and wind speed thresholds (maximum permissible gusts) must be defined.",
  },
  {
    question: "Can specialist liquid waterproofing contractors join the network?",
    answer:
      "Yes. EntireFM frequently mobilises cold-applied liquid overlay specialists for commercial roof refurbishments where hot works are prohibited.",
  },
];

export default function RoofingContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Roofing Contractors", url: "/contractors/roofing" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Roofing"
          title="Roofing Contractors"
          subtitle="Commercial flat roofing, gutter maintenance &amp; height safety network."
          intro="A professional operating platform for UK roofing contractors — combining Working at Height compliance, fall-arrest protocols, weather-sensitive RAMS, and commercial FM work orders."
          imageSrc="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
          imageAlt="Commercial roofing survey and inspection on high-level facility"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join the Roofing Network", href: "/suppliers/apply" }}
          secondaryCta={{ label: "Explore Contractor Portal", href: "/suppliers/membership#platform-overview" }}
          facts={[
            { figure: "Height Safety", label: "Work at Height 2005" },
            { figure: "£95 / yr", label: "Supplier Membership" },
            { figure: "Commercial FM", label: "Flat Roof & Gutter PPM" },
          ]}
        />

        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Safeguarding Commercial Roof Envelopes with Rigorous Height Safety
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Commercial roofing presents severe operational hazards under the <strong>Work at Height Regulations 2005</strong>. Falls from roofs, through fragile skylights, or during gutter maintenance remain the leading cause of fatal workplace incidents in the UK.
              </p>
              <p>
                The EntireFM Contractor Platform gives roofing contractors a dedicated digital system to manage harness inspection logs, IPAF/PASMA operator cards, generate edge-protection RAMS, and execute commercial roof repairs with complete photographic evidence.
              </p>
            </div>
          </div>
        </section>

        <TradeFmWorkflow tradeName="Roofing" />
        <TradeComplianceGrid tradeName="Roofing" requirements={ROOF_COMPLIANCE} />

        <TradePortalShowcase
          tradeName="Roofing"
          sampleJob={{
            title: "Commercial Valley Gutter Relining & Outfall Clear",
            ref: "WO-84942-ROOF",
            location: "Logistics Distribution Hub, Sheffield S9",
            poValue: "£3,200.00 PO",
            scope: "Erect edge protection and safety netting. Clean 120m industrial valley gutter, seal joint failures with cold-applied reinforced liquid membrane, test drainage flow.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m)", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "NFRC Commercial Member Scheme", expiry: "30 Apr 2027", status: "VERIFIED" },
            { name: "Harness & Lanyard 6-Month Inspection", expiry: "15 Aug 2026", status: "VERIFIED" },
          ]}
        />

        <TradeDocsGrid tradeName="Roofing" docs={ROOF_DOCS} />
        <TradeConversionBridge tradeName="Roofing Contractors" />
        <TradeFaqAccordion tradeName="Roofing" faqs={ROOF_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
