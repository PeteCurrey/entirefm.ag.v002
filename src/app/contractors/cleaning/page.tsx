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

export const metadata: Metadata = generateRouteMetadata("/contractors/cleaning", {
  title: "Cleaning Contractors UK | Commercial Cleaning & Facilities Network | EntireFM",
  description:
    "Join the EntireFM Commercial Cleaning Contractor Network. Manage BICSc standards, COSHH assessments, colour-coded hygiene protocols, and commercial FM cleaning contracts.",
});

const CLEAN_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m for corporate/public-sector sites)",
      "Employers Liability Insurance (£10m mandatory for all employers)",
      "Treatment risk / damage to property being worked upon insurance endorsement",
    ],
  },
  {
    category: "Trade Standards & Memberships",
    mandatoryType: "Trade Competency" as const,
    items: [
      "BICSc (British Institute of Cleaning Science) Corporate / Individual Membership",
      "CSSA (Cleaning & Support Services Association) membership",
      "Valid SSIP Member Scheme accreditation (CHAS / SafeContractor / Constructionline)",
    ],
  },
  {
    category: "Chemical Safety & Operative Vetting",
    mandatoryType: "Operational Standard" as const,
    items: [
      "COSHH Assessment & Safety Data Sheets (SDS) for all chemical products used",
      "Colour-Coded Cleaning Protocol (Red: Washrooms, Blue: General, Green: Kitchens, Yellow: Clinical)",
      "Enhanced DBS clearance for schools, healthcare, and vulnerable commercial environments",
      "PAT testing on all vacuum cleaners, rotary floor scrubbers, and pressure washers",
    ],
  },
];

const CLEAN_DOCS = [
  {
    title: "COSHH Assessment Guide",
    href: "/contractor-resources/coshh-assessment",
    desc: "Complete guide to managing cleaning chemicals, dilutions, Safety Data Sheets, and PPE.",
    type: "SAFETY" as const,
  },
  {
    title: "Cleaning RAMS Guide",
    href: "/contractor-resources/rams",
    desc: "Standard risk assessment covering wet floors, chemical handling, and trailing electrical leads.",
    type: "GUIDE" as const,
  },
  {
    title: "RAMS Template (11-Section)",
    href: "/contractor-resources/rams-template",
    desc: "Commercial RAMS template structured for office, industrial, and clinical cleaning tasks.",
    type: "TEMPLATE" as const,
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/contractor-compliance",
    desc: "6 statutory pillars, DBS vetting management, and automated 90/60/30-day alerts.",
    type: "COMPLIANCE" as const,
  },
];

const CLEAN_FAQS = [
  {
    question: "What types of commercial cleaning contracts does EntireFM manage?",
    answer:
      "Contracts include daily office and corporate facility cleaning, industrial warehouse floor scrubbing, post-construction builders cleans, deep kitchen extraction sanitisation, commercial carpet and upholstery cleaning, and washroom hygiene services.",
  },
  {
    question: "What COSHH information must cleaning contractors provide?",
    answer:
      "Contractors must upload current manufacturer Safety Data Sheets (SDS) and site-specific COSHH assessments detailing dilution rates, PPE (gloves, eye protection), ventilation requirements, and chemical spill procedures into their Contractor Portal.",
  },
  {
    question: "How does EntireFM verify operative DBS checks?",
    answer:
      "The Contractor Portal workforce matrix allows cleaning contractors to register operatives with verified Basic or Enhanced DBS certificate numbers and issue dates for assignment to sensitive client sites.",
  },
];

export default function CleaningContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Cleaning Contractors", url: "/contractors/cleaning" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Cleaning"
          title="Cleaning Contractors"
          subtitle="Commercial cleaning, industrial deep cleans &amp; FM contractor network."
          intro="A professional operating platform for UK commercial cleaning contractors — combining BICSc standards, COSHH compliance, operative DBS verification, and commercial FM work orders."
          imageSrc="/images/editorial/entirefm-reception-2000w.webp"
          imageAlt="Commercial corporate office reception and cleaning standard"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join the Cleaning Network", href: "/suppliers/apply" }}
          secondaryCta={{ label: "Explore Contractor Portal", href: "/suppliers/membership#platform-overview" }}
          facts={[
            { figure: "BICSc Standards", label: "Colour-Coded Hygiene" },
            { figure: "£295 / yr", label: "All-Inclusive Platform" },
            { figure: "Commercial FM", label: "Daily & Specialist Cleans" },
          ]}
        />

        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Delivering Pristine Commercial Environments with Full Chemical Governance
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Commercial cleaning is a frontline facilities discipline. Beyond surface cleanliness, commercial clients demand strict adherence to <strong>COSHH Regulations 2002</strong>, BICSc colour-coding standards to eliminate cross-contamination, and verified operative screening.
              </p>
              <p>
                The EntireFM Contractor Platform gives commercial cleaning companies the tools to manage SDS files, track operative training and DBS records, generate slip/trip risk assessments, and manage scheduled cleaning rounds with timestamped mobile sign-offs.
              </p>
            </div>
          </div>
        </section>

        <TradeFmWorkflow tradeName="Cleaning" />
        <TradeComplianceGrid tradeName="Cleaning" requirements={CLEAN_COMPLIANCE} />

        <TradePortalShowcase
          tradeName="Cleaning"
          sampleJob={{
            title: "Post-Refurbishment Commercial Builders Clean & Floor Sealing",
            ref: "WO-84948-CLEAN",
            location: "Corporate Office Headquarters, Manchester M1",
            poValue: "£1,850.00 PO",
            scope: "Perform 3-stage builders clean across 1,200m² office floor. Remove plaster/paint debris, machine-scrub vinyl flooring, apply two coats of anti-slip polymer seal, sanitise all washrooms.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m)", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "BICSc Corporate Membership", expiry: "28 Feb 2027", status: "VERIFIED" },
            { name: "Diversey Floor Seal SDS & COSHH Assessment", expiry: "01 Nov 2026", status: "VERIFIED" },
          ]}
        />

        <TradeDocsGrid tradeName="Cleaning" docs={CLEAN_DOCS} />
        <TradeConversionBridge tradeName="Cleaning Contractors" />
        <TradeFaqAccordion tradeName="Cleaning" faqs={CLEAN_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
