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

export const metadata: Metadata = generateRouteMetadata("/contractors/drainage", {
  title: "Commercial Drainage Contractors UK | CCTV Surveys & Jetting Network | EntireFM",
  description:
    "Join the EntireFM Drainage Contractor Network. Manage WJA compliance, high-pressure water jetting RAMS, CCTV drain surveys, grease traps, and commercial FM work orders.",
});

const DRAIN_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m for major commercial sites)",
      "Employers Liability Insurance (£10m statutory for all employers)",
      "Environmental impairment / pollution liability endorsement",
    ],
  },
  {
    category: "Trade Accreditations",
    mandatoryType: "Trade Competency" as const,
    items: [
      "WJA (Water Jetting Association) Certificate of Training & Membership",
      "NADC (National Association of Drainage Contractors) Certified Contractor status",
      "Valid SSIP Member Scheme accreditation (CHAS / SafeContractor / Constructionline)",
    ],
  },
  {
    category: "Operative Competency & Confined Spaces",
    mandatoryType: "Operational Standard" as const,
    items: [
      "WJA Safe Pressure Water Jetting Operator Cards",
      "City & Guilds 6150 Confined Space Entry (Medium/High Risk with Escape Breathing Apparatus)",
      "NRSWA Street Works Qualification (for highway/footway manhole access)",
      "Environment Agency Waste Carrier Licence for tanker grease trap waste disposal",
    ],
  },
];

const DRAIN_DOCS = [
  {
    title: "Drainage RAMS Guide",
    href: "/contractor-resources/rams",
    desc: "Complete guide to risk assessments covering high-pressure jetting, toxic sewer gases, and confined spaces.",
    type: "GUIDE" as const,
  },
  {
    title: "RAMS Template (11-Section)",
    href: "/contractor-resources/rams-template",
    desc: "Standard commercial RAMS framework covering jetting barriers, manhole covers, and gas detection.",
    type: "TEMPLATE" as const,
  },
  {
    title: "Drainage Risk Assessment",
    href: "/contractor-resources/risk-assessment",
    desc: "5x5 risk evaluation covering hydrogen sulphide (H2S), biohazards (Weil's disease), and high pressure.",
    type: "GUIDE" as const,
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/contractor-compliance",
    desc: "6 statutory pillars, WJA tracking, and automated 90/60/30-day credential alerts.",
    type: "COMPLIANCE" as const,
  },
];

const DRAIN_FAQS = [
  {
    question: "What commercial drainage work does EntireFM contract out?",
    answer:
      "Work includes 24/7 reactive blockage clearance, high-pressure water jetting (HPWJ), CCTV drain condition surveys with WinCan reporting, grease trap emptying and biological dosing, interceptor de-sludging, patch lining, and pump station maintenance.",
  },
  {
    question: "What safety equipment is mandatory for manhole and sewer access?",
    answer:
      "Operatives must carry calibrated multi-gas detectors (O2, H2S, CO, LEL), safety harnesses with tripod and recovery winches, emergency escape breathing apparatus (EEBA), and biohazard PPE with vaccination records (Hepatitis B & Tetanus).",
  },
  {
    question: "How does the Contractor Portal support commercial drainage contractors?",
    answer:
      "The portal enables contractors to upload CCTV survey video links and WinCan PDF reports, maintain WJA operator cards and waste transfer notes, and receive urgent blockage call-outs with instant digital sign-offs.",
  },
];

export default function DrainageContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Drainage Contractors", url: "/contractors/drainage" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Drainage"
          title="Drainage Contractors"
          subtitle="Commercial CCTV surveys, high-pressure jetting &amp; grease trap network."
          intro="A professional operating platform for UK commercial drainage contractors — combining WJA compliance, confined space safety, CCTV reporting, and 24/7 commercial FM work orders."
          imageSrc="/images/editorial/entirefm-external-distribution-dusk-2000w.webp"
          imageAlt="Commercial property external drainage and infrastructure services"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join the Drainage Network", href: "/suppliers/apply" }}
          secondaryCta={{ label: "Explore Contractor Portal", href: "/suppliers/membership#platform-overview" }}
          facts={[
            { figure: "WJA & Confined Space", label: "Certified Operations" },
            { figure: "£295 / yr", label: "All-Inclusive Platform" },
            { figure: "24/7 Reactive", label: "Commercial FM Dispatch" },
          ]}
        />

        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Protecting Below-Ground Infrastructure with Advanced Jetting &amp; CCTV Diagnostics
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Commercial drainage operations involve severe occupational hazards under the <strong>Confined Spaces Regulations 1997</strong> and Water Jetting Association safety codes. Toxic sewer gases (such as Hydrogen Sulphide), waterborne biohazards (Leptospirosis / Weil's disease), and high-pressure fluid injection require rigorous safety procedures.
              </p>
              <p>
                The EntireFM Contractor Platform empowers drainage contractors to manage WJA operator cards, store gas monitor calibration records, generate confined-space RAMS, and deliver commercial CCTV survey reports directly to client facilities teams.
              </p>
            </div>
          </div>
        </section>

        <TradeFmWorkflow tradeName="Drainage" />
        <TradeComplianceGrid tradeName="Drainage" requirements={DRAIN_COMPLIANCE} />

        <TradePortalShowcase
          tradeName="Drainage"
          sampleJob={{
            title: "Commercial Kitchen Grease Interceptor High-Pressure Jet & CCTV Survey",
            ref: "WO-84972-DRAIN",
            location: "Hospitality & Retail Plaza, Leeds LS1",
            poValue: "£1,150.00 PO",
            scope: "Isolate external car park gully zone. High-pressure jet 60m of 150mm commercial kitchen waste line, de-sludge 2,000L grease interceptor, perform CCTV survey and provide WinCan condition video.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m) + Pollution", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "WJA Water Jetting Association Membership", expiry: "28 Feb 2027", status: "VERIFIED" },
            { name: "Crowcon 4-Gas Monitor Calibration Certificate", expiry: "12 Dec 2026", status: "VERIFIED" },
          ]}
        />

        <TradeDocsGrid tradeName="Drainage" docs={DRAIN_DOCS} />
        <TradeConversionBridge tradeName="Drainage Contractors" />
        <TradeFaqAccordion tradeName="Drainage" faqs={DRAIN_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
