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

export const metadata: Metadata = generateRouteMetadata("/contractors/mechanical", {
  title: "Mechanical Contractors UK | Commercial Mechanical FM Network | EntireFM",
  description:
    "Join the EntireFM Mechanical Contractor Network. Manage plantroom compliance, pump sets, pressurisation units, mechanical RAMS, and commercial FM work orders.",
});

const MECH_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m for large commercial sites)",
      "Employers Liability Insurance (£10m statutory for all employers)",
      "Professional Indemnity Insurance where mechanical design or hydraulic modeling applies",
    ],
  },
  {
    category: "Trade Accreditations",
    mandatoryType: "Trade Competency" as const,
    items: [
      "BESA (Building Engineering Services Association) membership",
      "Gas Safe Register (Commercial / Industrial Combustion certification where applicable)",
      "Valid SSIP Member Scheme accreditation (CHAS / SafeContractor / Constructionline)",
    ],
  },
  {
    category: "Operative Competency & Safety",
    mandatoryType: "Operational Standard" as const,
    items: [
      "City & Guilds Mechanical Engineering / Building Services NVQ Level 3",
      "CSCS Skilled Worker / Mechanical Engineer Card",
      "Hot Works Passport & safe brazing/welding certification",
      "Confined Space Entry & Asbestos Awareness certification",
    ],
  },
];

const MECH_DOCS = [
  {
    title: "Mechanical RAMS Guide",
    href: "/contractor-resources/rams",
    desc: "Complete guide to risk assessments and method statements for plantroom maintenance and pump overhauls.",
    type: "GUIDE" as const,
  },
  {
    title: "RAMS Template (11-Section)",
    href: "/contractor-resources/rams-template",
    desc: "Standard commercial RAMS framework covering mechanical isolation, lifting, and pressure testing.",
    type: "TEMPLATE" as const,
  },
  {
    title: "Plantroom Risk Assessment",
    href: "/contractor-resources/risk-assessment",
    desc: "5x5 risk evaluation covering rotating machinery, hot surfaces, pressure vessels, and heavy lifting.",
    type: "GUIDE" as const,
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/contractor-compliance",
    desc: "6 statutory pillars, insurance verification, and automated 90/60/30-day credential alerts.",
    type: "COMPLIANCE" as const,
  },
];

const MECH_FAQS = [
  {
    question: "What types of mechanical work orders are issued by EntireFM?",
    answer:
      "Work includes booster pump replacements, heating circulating pump servicing, pressurisation unit maintenance, plate heat exchanger descaling, expansion vessel statutory testing, valve overhauls, and commercial plantroom refurbishment.",
  },
  {
    question: "What safety protocols are required for commercial plantroom access?",
    answer:
      "Mechanical contractors must supply site-specific RAMS detailing mechanical/hydraulic isolations, hot works permits (for welding/brazing), heavy lifting plans (LOLER) for pump motor removals, and emergency egress plans.",
  },
  {
    question: "Can independent mechanical contractors join EntireFM?",
    answer:
      "Yes. Approved regional mechanical specialists and building services engineers can join the Contractor Platform (£95+VAT/yr) to manage compliance, access digital job packs, and receive applicable commercial work orders.",
  },
];

export default function MechanicalContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Mechanical Contractors", url: "/contractors/mechanical" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Mechanical"
          title="Mechanical &amp; Plantroom Contractors"
          subtitle="Commercial FM operating platform &amp; contractor network."
          intro="A professional operating platform for UK mechanical, HVAC and plantroom contractors — combining compliance tracking, asset maintenance records, boiler RAMS, and commercial FM work order delivery."
          imageSrc="/images/editorial/entirefm-plantroom-valves-survey-2560w.webp"
          imageAlt="Commercial heating engineer inspecting plantroom valves"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join the Mechanical Network", href: "/suppliers/apply" }}
          secondaryCta={{ label: "Explore Contractor Portal", href: "/suppliers/membership#platform-overview" }}
          facts={[
            { figure: "Gas Safe / Refcom", label: "Scheme Verified" },
            { figure: "£95 / yr", label: "Supplier Membership" },
            { figure: "Work Orders", label: "Direct FM Dispatch" },
          ]}
        />

        {/* Trade Context Introduction */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Maintaining the Mechanical Heart of Commercial Properties
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Commercial mechanical infrastructure — including primary circulating pumps, booster sets, heating calorifiers, pressurisation units, and chilled water distribution loops — requires skilled engineering and rigorous safety control. A pump failure in a high-rise office building or hospital causes immediate building disruption.
              </p>
              <p>
                The EntireFM Contractor Platform gives mechanical businesses the digital tooling to manage lifting plans, store operative trade cards, build pressure-testing RAMS, and receive clear commercial work instructions with purchase orders.
              </p>
            </div>
          </div>
        </section>

        {/* Operational Workflow */}
        <TradeFmWorkflow tradeName="Mechanical" />

        {/* Compliance Grid */}
        <TradeComplianceGrid tradeName="Mechanical" requirements={MECH_COMPLIANCE} />

        {/* Portal Showcase */}
        <TradePortalShowcase
          tradeName="Mechanical"
          sampleJob={{
            title: "Dual Heating Booster Set Replacement & Commissioning",
            ref: "WO-84928-MECH",
            location: "Commercial Technology Park, Sheffield S1",
            poValue: "£2,180.00 PO",
            scope: "Isolate primary LTHW circuit. Remove defective Grundfos pump set, install replacement twin-head inverter pump, pressure test and re-commission.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m)", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "BESA Building Services Membership", expiry: "22 Mar 2027", status: "VERIFIED" },
            { name: "Lifting Equipment (LOLER) Inspection", expiry: "14 Sep 2026", status: "VERIFIED" },
          ]}
        />

        {/* Relevant Documentation Links */}
        <TradeDocsGrid tradeName="Mechanical" docs={MECH_DOCS} />

        {/* Conversion Bridge */}
        <TradeConversionBridge tradeName="Mechanical Contractors" />

        {/* FAQs */}
        <TradeFaqAccordion tradeName="Mechanical" faqs={MECH_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
