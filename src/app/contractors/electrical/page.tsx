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

export const metadata: Metadata = generateRouteMetadata("/contractors/electrical", {
  title: "Electrical Contractors UK | FM Electrical Contractor Network | EntireFM",
  description:
    "Join the EntireFM Electrical Contractor Network. Manage compliance, 18th Edition credentials, electrical RAMS, Lock-Out Tag-Out protocols, and commercial FM work orders.",
});

const ELEC_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m for corporate/high-hazard sites)",
      "Employers Liability Insurance (£10m statutory for all employers)",
      "Professional Indemnity Insurance (£2m+ where electrical design or certification applies)",
    ],
  },
  {
    category: "Trade Accreditations & Scheme Memberships",
    mandatoryType: "Trade Competency" as const,
    items: [
      "NICEIC Approved Contractor / NAPIT Registered Electrical Contractor",
      "ECA (Electrical Contractors' Association) or SELECT membership",
      "Valid SSIP Member Scheme accreditation (CHAS / SafeContractor / Constructionline)",
    ],
  },
  {
    category: "Operative Competency & Safety",
    mandatoryType: "Operational Standard" as const,
    items: [
      "18th Edition BS 7671 Requirements for Electrical Installations certification",
      "C&G 2391 (or 2394/2395) Periodic Inspection & Testing qualification",
      "JIB / ECS Gold Card for all qualified commercial electricians on site",
      "Verified Lock-Out Tag-Out (LOTO) and Safe Isolation competence",
    ],
  },
];

const ELEC_DOCS = [
  {
    title: "What Are RAMS?",
    href: "/contractor-resources/rams/what-are-rams",
    desc: "Full statutory explanation of Risk Assessments and Method Statements required for live and isolated electrical tasks.",
    type: "GUIDE" as const,
  },
  {
    title: "How to Write RAMS",
    href: "/contractor-resources/rams/how-to-write-rams",
    desc: "Practical 11-step guide covering safe isolation, LOTO controls, hazard scoring, and operative sign-off.",
    type: "GUIDE" as const,
  },
  {
    title: "What Is a Risk Assessment?",
    href: "/contractor-resources/risk-assessments/what-is-a-risk-assessment",
    desc: "5x5 risk evaluation covering arc flash, electric shock, fire inception, and live testing protocols.",
    type: "GUIDE" as const,
  },
  {
    title: "How to Get FM Work",
    href: "/contractor-resources/winning-work/how-to-get-facilities-management-work",
    desc: "Commercial procurement routes, NICEIC/SSIP requirements, and joining an approved contractor network.",
    type: "GUIDE" as const,
  },
];

const ELEC_FAQS = [
  {
    question: "What documentation do electrical contractors need to work with EntireFM?",
    answer:
      "Electrical contractors must maintain valid Public and Employers' Liability insurance, evidence of NICEIC/NAPIT or equivalent enrolment, 18th Edition BS7671 qualifications for operatives, ECS/JIB cards, calibrated test meter certificates, and task-specific RAMS incorporating safe isolation procedures.",
  },
  {
    question: "Do electrical contractors need RAMS for reactive maintenance?",
    answer:
      "Yes. Commercial FM clients require task-specific RAMS before permits to work are authorised. For reactive maintenance, standard task RAMS with on-site dynamic risk assessments are used to verify isolations and site-specific hazards.",
  },
  {
    question: "What work orders are dispatched to electrical contractors?",
    answer:
      "Work includes commercial EICR periodic inspections, emergency lighting 3-hour discharge tests, distribution board remedial repairs, thermal imaging surveys, LED lighting upgrades, and 24/7 reactive fault-finding.",
  },
  {
    question: "Can electrical contractors join the EntireFM supplier network?",
    answer:
      "Yes. Qualified electrical contractors can apply through the Contractor Platform. Membership (£95+VAT/year) gives you full access to the digital operating platform, document vault, and eligibility for commercial work orders in your coverage area.",
  },
];

export default function ElectricalContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Electrical Contractors", url: "/contractors/electrical" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Electrical"
          title="Electrical Contractors"
          subtitle="Powering commercial estates with verified compliance and calibrated testing."
          intro="Join the EntireFM Electrical Contractor Network. Upload 18th Edition and NICEIC/NAPIT credentials, track calibration expiry dates, generate digital EICR packs, and deliver commercial electrical works across UK facilities."
          imageSrc="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
          imageAlt="Electrical engineers conducting commercial inspection"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join Electrical Network", href: "/contractors/join" }}
          secondaryCta={{ label: "Explore Contractor Hub", href: "/contractors" }}
          facts={[
            { figure: "18th Edition & NICEIC", label: "Scheme Verified" },
            { figure: "£95 / yr", label: "Supplier Membership" },
            { figure: "Commercial FM", label: "Work Dispatch Eligibility" },
          ]}
        />

        {/* Trade Context Introduction */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Delivering Commercial Electrical Engineering with Full Assurance
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Commercial facilities management demands precision from electrical contractors. Whether performing five-year <strong>Electrical Installation Condition Reports (EICR)</strong> on complex three-phase switchboards, conducting emergency lighting compliance testing, or resolving reactive power failures in critical data environments, client building managers require verifiable proof of competence before operatives set foot on site.
              </p>
              <p>
                The EntireFM Contractor Platform gives electrical contractors a dedicated operating environment to maintain valid ECS cards, store calibrated multi-function tester certificates, generate site-specific RAMS with <strong>Lock-Out Tag-Out (LOTO)</strong> controls, and receive commercial work orders with clear scopes and digital sign-off.
              </p>
            </div>
          </div>
        </section>

        {/* Operational Workflow */}
        <TradeFmWorkflow tradeName="Electrical" />

        {/* Compliance Grid */}
        <TradeComplianceGrid tradeName="Electrical" requirements={ELEC_COMPLIANCE} />

        {/* Portal Showcase */}
        <TradePortalShowcase
          tradeName="Electrical"
          sampleJob={{
            title: "Commercial Switchgear Thermal Imaging & EICR Remedials",
            ref: "WO-84922-ELEC",
            location: "Corporate Office Building, Leeds LS1",
            poValue: "£1,450.00 PO",
            scope: "Perform thermographic inspection on Main LV Switchboard. Rectify loose terminations and issue minor works certificate with photographic evidence.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m)", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "NICEIC Approved Contractor Cert", expiry: "15 Oct 2026", status: "VERIFIED" },
            { name: "Fluke 1664FC Calibration Cert", expiry: "04 Aug 2026", status: "VERIFIED" },
          ]}
        />

        {/* Relevant Documentation Links */}
        <TradeDocsGrid tradeName="Electrical" docs={ELEC_DOCS} />

        {/* Conversion Bridge */}
        <TradeConversionBridge tradeName="Electrical Contractors" />

        {/* FAQs */}
        <TradeFaqAccordion tradeName="Electrical" faqs={ELEC_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
