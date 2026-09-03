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

export const metadata: Metadata = generateRouteMetadata("/contractors/fabric-maintenance", {
  title: "Building Fabric Maintenance Contractors UK | Commercial Property Repairs | EntireFM",
  description:
    "Join the EntireFM Fabric Maintenance Contractor Network. Manage carpentry, joinery, fire door compliance, glazing, locksmithing, and reactive building fabric work orders.",
});

const FABRIC_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m for corporate facilities)",
      "Employers Liability Insurance (£10m mandatory for all employers)",
      "Hot works insurance endorsement (where heat guns or cutting tools apply)",
    ],
  },
  {
    category: "Trade Accreditations",
    mandatoryType: "Trade Competency" as const,
    items: [
      "FMB (Federation of Master Builders) or Guild of Master Craftsmen membership",
      "FIRAS / BM TRADA Fire Door Installation and Maintenance certification (where applicable)",
      "Valid SSIP Member Scheme accreditation (CHAS / SafeContractor / Constructionline)",
    ],
  },
  {
    category: "Operative Competency & Safety",
    mandatoryType: "Operational Standard" as const,
    items: [
      "CSCS Skilled Worker Card (Carpentry, Joinery, Plastering, Painting)",
      "Asbestos Awareness (UKATA / IATP) mandatory for all intrusive fabric work",
      "PASMA / Ladder Safety training for high-level decorating and ceiling void repairs",
      "Manual Handling & Dust Extraction (HSE Wood Dust WEL compliance) certification",
    ],
  },
];

const FABRIC_DOCS = [
  {
    title: "Fabric Maintenance RAMS Guide",
    href: "/contractor-resources/rams",
    desc: "Complete guide to risk assessments covering power tools, dust control, asbestos checks, and access.",
    type: "GUIDE" as const,
  },
  {
    title: "RAMS Template (11-Section)",
    href: "/contractor-resources/rams-template",
    desc: "Standard commercial RAMS framework covering occupied building repairs and noise controls.",
    type: "TEMPLATE" as const,
  },
  {
    title: "Building Fabric Risk Assessment",
    href: "/contractor-resources/risk-assessment",
    desc: "5x5 risk evaluation covering sharp tools, wood dust, manual handling, and ceiling voids.",
    type: "GUIDE" as const,
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/contractor-compliance",
    desc: "6 statutory pillars, trade card tracking, and automated 90/60/30-day credential alerts.",
    type: "COMPLIANCE" as const,
  },
];

const FABRIC_FAQS = [
  {
    question: "What building fabric work is dispatched by EntireFM?",
    answer:
      "Work includes commercial fire door repairs and gap re-adjustments (Building Safety Act compliance), suspended ceiling grid repairs, drywall patch and plastering, commercial door closer replacements, high-security lock changes, partition wall installations, and internal decorating.",
  },
  {
    question: "What asbestos checks are required for fabric maintenance?",
    answer:
      "Contractors must verify the building Asbestos Register with the FM team before drilling or disturbing walls, ceiling tiles, or floor finishes in properties built before 2000. All operatives must hold valid annual Asbestos Awareness certification.",
  },
  {
    question: "How does the Contractor Portal support fabric contractors?",
    answer:
      "The portal allows contractors to attach fire door inspection records, store operative CSCS trade cards, capture before/after repair photos, and receive reactive call-outs with instant purchase orders.",
  },
];

export default function FabricMaintenanceContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Fabric Maintenance Contractors", url: "/contractors/fabric-maintenance" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Fabric Maintenance"
          title="Fabric Maintenance Contractors"
          subtitle="Commercial carpentry, fire doors, joinery &amp; building repairs network."
          intro="A professional operating platform for UK building fabric contractors — combining CSCS compliance, fire door certification, dust-control RAMS, and commercial FM work orders."
          imageSrc="/images/editorial/entirefm-site-arrival-2000w.webp"
          imageAlt="Commercial building fabric maintenance engineer on site"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join the Fabric Network", href: "/suppliers/apply" }}
          secondaryCta={{ label: "Explore Contractor Portal", href: "/suppliers/membership#platform-overview" }}
          facts={[
            { figure: "Fire Doors & Joinery", label: "Building Safety Act" },
            { figure: "£95 / yr", label: "Supplier Membership" },
            { figure: "Reactive & PPM", label: "Direct FM Work Orders" },
          ]}
        />

        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Maintaining Commercial Building Assets, Fire Compartmentation &amp; Finishes
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Commercial building fabric maintenance encompasses essential life-safety elements — such as fire door integrity under the <strong>Fire Safety (England) Regulations 2022</strong> — as well as tenant aesthetic standards, glazing, and security hardware.
              </p>
              <p>
                The EntireFM Contractor Platform gives fabric maintenance specialists the system to record fire door gap measurements, track asbestos awareness training, generate dust and noise-mitigated RAMS for occupied offices, and manage commercial repair work orders.
              </p>
            </div>
          </div>
        </section>

        <TradeFmWorkflow tradeName="Fabric Maintenance" />
        <TradeComplianceGrid tradeName="Fabric Maintenance" requirements={FABRIC_COMPLIANCE} />

        <TradePortalShowcase
          tradeName="Fabric Maintenance"
          sampleJob={{
            title: "Commercial Fire Door Remedials & Intumescent Seal Replacement",
            ref: "WO-84966-FABRIC",
            location: "Corporate Office Building, Sheffield S1",
            poValue: "£890.00 PO",
            scope: "Inspect 12 FD30S corridor fire doors. Re-hang 2 dropped doors, replace damaged 15mm intumescent smoke seals, adjust overhead concealed closers to ensure positive latching.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m)", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "BM TRADA Q-Mark Fire Door Maintenance Cert", expiry: "18 Jan 2027", status: "VERIFIED" },
            { name: "UKATA Asbestos Awareness Certification", expiry: "11 Oct 2026", status: "VERIFIED" },
          ]}
        />

        <TradeDocsGrid tradeName="Fabric Maintenance" docs={FABRIC_DOCS} />
        <TradeConversionBridge tradeName="Fabric Maintenance Contractors" />
        <TradeFaqAccordion tradeName="Fabric Maintenance" faqs={FABRIC_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
