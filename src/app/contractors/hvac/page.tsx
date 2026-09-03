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

export const metadata: Metadata = generateRouteMetadata("/contractors/hvac", {
  title: "HVAC Contractors UK | Commercial Air Conditioning & Ventilation Network | EntireFM",
  description:
    "Join the EntireFM HVAC Contractor Network. Manage Refcom/F-Gas compliance, rooftop chiller RAMS, AHU planned maintenance, and commercial FM work orders.",
});

const HVAC_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m preferred for rooftop plant decks)",
      "Employers Liability Insurance (£10m mandatory for all employers)",
      "Efficacy / Product Liability for refrigerant handling and HVAC systems",
    ],
  },
  {
    category: "F-Gas & Trade Accreditations",
    mandatoryType: "Trade Competency" as const,
    items: [
      "Refcom Elite / Bureau Veritas Company F-Gas Certification",
      "FGAS Category 1 certification (City & Guilds 2079 / BESA FG Cat 1) for all engineers",
      "Valid SSIP Member Scheme accreditation (CHAS / SafeContractor / Constructionline)",
    ],
  },
  {
    category: "Operative Competency & Safety",
    mandatoryType: "Operational Standard" as const,
    items: [
      "Working at Height certification for rooftop condenser and AHU access",
      "IPAF 3a/3b & PASMA cards for high-level cassette and ductwork maintenance",
      "Refrigerant recovery logbooks & hazardous waste transfer licence compliance",
      "Brazing / OFN (Oxygen-Free Nitrogen) pressure testing competency",
    ],
  },
];

const HVAC_DOCS = [
  {
    title: "HVAC RAMS Guide",
    href: "/contractor-resources/rams",
    desc: "Complete guide to risk assessments covering refrigerant handling, roof access, and heavy lifting.",
    type: "GUIDE" as const,
  },
  {
    title: "RAMS Template (11-Section)",
    href: "/contractor-resources/rams-template",
    desc: "Standard commercial RAMS framework covering rooftop plant decks, F-Gas, and isolations.",
    type: "TEMPLATE" as const,
  },
  {
    title: "COSHH & Refrigerant Assessment",
    href: "/contractor-resources/coshh-assessment",
    desc: "Chemical safety for R410A, R32, R134a, compressor oils, and acidic coil cleaners.",
    type: "SAFETY" as const,
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/contractor-compliance",
    desc: "6 statutory pillars, F-Gas registration tracking, and automated 90/60/30-day alerts.",
    type: "COMPLIANCE" as const,
  },
];

const HVAC_FAQS = [
  {
    question: "What F-Gas requirements are checked by EntireFM?",
    answer:
      "EntireFM verifies that the contracting company holds a valid Refcom/Bureau Veritas Company Certificate and that every engineer attending site carries City & Guilds 2079 or equivalent Category 1 F-Gas credentials. Refrigerant recovery weights and cylinder tracking must be recorded on digital completion sheets.",
  },
  {
    question: "What HVAC work orders does EntireFM dispatch?",
    answer:
      "Work includes quarterly planned maintenance on AHUs, quarterly chiller leak testing, VRF/VRV multi-split servicing, inverter drive fault diagnostics, condenser chemical cleans, belt/bearing replacements, and emergency cooling repairs.",
  },
  {
    question: "How does the Contractor Portal support HVAC contractors?",
    answer:
      "The portal centralises company and engineer F-Gas certificates, tracks tool calibration (manifold gauges, scales, vacuum pumps), provides pre-built HVAC RAMS, and connects directly to dispatched client work orders.",
  },
];

export default function HvacContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "HVAC Contractors", url: "/contractors/hvac" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="HVAC"
          title="HVAC Contractors"
          subtitle="Commercial air conditioning, chiller &amp; ventilation operating platform."
          intro="A dedicated operating platform for UK HVAC contractors — combining F-Gas compliance tracking, rooftop RAMS, engineer competency matrices, and commercial FM work dispatch."
          imageSrc="/images/editorial/entirefm-hvac-plant-deck-2000w.webp"
          imageAlt="Commercial HVAC rooftop condenser plant deck"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join the HVAC Network", href: "/suppliers/apply" }}
          secondaryCta={{ label: "Explore Contractor Portal", href: "/suppliers/membership#platform-overview" }}
          facts={[
            { figure: "Refcom / F-Gas", label: "Statutory Compliance" },
            { figure: "£95 / yr", label: "Supplier Membership" },
            { figure: "Commercial FM", label: "Rooftop & AHU Jobs" },
          ]}
        />

        {/* Trade Context Introduction */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Precision Climate Control &amp; Statutory F-Gas Compliance
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Commercial HVAC maintenance bridges complex mechanical systems, electrical control strategies, and stringent environmental law. Under UK <strong>F-Gas Regulations</strong> and the <strong>Ozone-Depleting Substances Regulations</strong>, commercial building operators must maintain strict digital leak-testing logs and refrigerant recovery records.
              </p>
              <p>
                The EntireFM Contractor Platform empowers HVAC contractors to manage company Refcom certificates, verify engineer Cat 1 qualifications, generate rooftop height-access RAMS in minutes, and manage commercial PPM and reactive work orders from instruction through to completion.
              </p>
            </div>
          </div>
        </section>

        {/* Operational Workflow */}
        <TradeFmWorkflow tradeName="HVAC" />

        {/* Compliance Grid */}
        <TradeComplianceGrid tradeName="HVAC" requirements={HVAC_COMPLIANCE} />

        {/* Portal Showcase */}
        <TradePortalShowcase
          tradeName="HVAC"
          sampleJob={{
            title: "AHU-02 Inverter Drive & Supply Fan Bearing Overhaul",
            ref: "WO-84931-HVAC",
            location: "City Centre Financial Plaza, Manchester M2",
            poValue: "£980.00 PO",
            scope: "Isolate AHU-02 electrical supply (LOTO). Replace worn SKF supply fan bearings, replace drive belts, align pulleys, test airflow and record vibration telemetry.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m)", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "Refcom Elite F-Gas Company Cert", expiry: "12 Jan 2027", status: "VERIFIED" },
            { name: "Fieldpiece Refrigerant Scale Calibration", expiry: "19 Oct 2026", status: "VERIFIED" },
          ]}
        />

        {/* Relevant Documentation Links */}
        <TradeDocsGrid tradeName="HVAC" docs={HVAC_DOCS} />

        {/* Conversion Bridge */}
        <TradeConversionBridge tradeName="HVAC Contractors" />

        {/* FAQs */}
        <TradeFaqAccordion tradeName="HVAC" faqs={HVAC_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
