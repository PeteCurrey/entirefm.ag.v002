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

export const metadata: Metadata = generateRouteMetadata("/contractors/fire-security", {
  title: "Fire & Security Contractors UK | Commercial Life Safety FM Network | EntireFM",
  description:
    "Join the EntireFM Fire & Security Contractor Network. Manage BAFE / NSI compliance, BS5839 servicing, access control, CCTV, and commercial life-safety work orders.",
});

const FIRE_COMPLIANCE = [
  {
    category: "Statutory Insurance",
    mandatoryType: "Statutory & Insurance" as const,
    items: [
      "Public Liability Insurance (£5m minimum, £10m for high-risk life safety sites)",
      "Employers Liability Insurance (£10m statutory for all employers)",
      "Efficacy & Inefficacy / Failure to Perform Insurance endorsement (mandatory for fire systems)",
    ],
  },
  {
    category: "Trade Accreditations & Scheme Memberships",
    mandatoryType: "Trade Competency" as const,
    items: [
      "BAFE SP203-1 Fire Detection and Alarm Systems accreditation / FIA membership",
      "NSI (National Security Inspectorate) Gold/Silver or SSAIB for security systems",
      "Valid SSIP Member Scheme accreditation (CHAS / SafeContractor / Constructionline)",
    ],
  },
  {
    category: "Operative Competency & Standards",
    mandatoryType: "Operational Standard" as const,
    items: [
      "BS 5839-1 (Fire Detection and Alarm Systems for Buildings) qualified engineers",
      "BS 5266-1 Emergency Lighting maintenance & commissioning certification",
      "BS 7858 Security Screening for all attending operatives",
      "18th Edition BS7671 electrical qualification for mains connection",
    ],
  },
];

const FIRE_DOCS = [
  {
    title: "Fire & Security RAMS Guide",
    href: "/contractor-resources/rams",
    desc: "Complete guide to risk assessments covering live panel testing, sounder testing, and working at height.",
    type: "GUIDE" as const,
  },
  {
    title: "RAMS Template (11-Section)",
    href: "/contractor-resources/rams-template",
    desc: "Standard commercial RAMS framework covering panel isolations, false alarm prevention, and testing.",
    type: "TEMPLATE" as const,
  },
  {
    title: "Life Safety Risk Assessment",
    href: "/contractor-resources/risk-assessment",
    desc: "5x5 risk evaluation covering acoustic shock, ladder access to detectors, and arc flash.",
    type: "GUIDE" as const,
  },
  {
    title: "Contractor Compliance Standard",
    href: "/contractor-resources/contractor-compliance",
    desc: "6 statutory pillars, BAFE/NSI tracking, and automated 90/60/30-day credential alerts.",
    type: "COMPLIANCE" as const,
  },
];

const FIRE_FAQS = [
  {
    question: "What fire and security work does EntireFM contract out?",
    answer:
      "Work includes quarterly/six-monthly fire alarm maintenance (BS 5839), emergency lighting annual discharge tests (BS 5266), access control and automatic door servicing (BS EN 16005), CCTV planned maintenance, intruder alarm response, and fire damper testing.",
  },
  {
    question: "Why is inefficacy insurance required for fire contractors?",
    answer:
      "Life safety systems require inefficacy insurance (failure of a product or service to perform its intended safety function) to protect building owners and managing agents in the event of an undetected fire or security breach.",
  },
  {
    question: "How does the Contractor Portal support fire alarm engineers?",
    answer:
      "The portal provides digital certificate capture for BS5839 inspection certificates, stores technician FIA/18th Edition qualifications, and automates sounder-testing notification records for building occupants.",
  },
];

export default function FireSecurityContractorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractors", url: "/contractors" },
    { name: "Fire & Security Contractors", url: "/contractors/fire-security" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        <TradeHero
          tradeName="Fire &amp; Security"
          title="Fire &amp; Security Contractors"
          subtitle="Life safety, BS5839 fire alarms &amp; commercial security network."
          intro="A professional operating platform for UK fire and security contractors — combining BAFE / NSI compliance, inefficacy insurance tracking, life-safety RAMS, and commercial FM work orders."
          imageSrc="/images/editorial/entirefm-access-control-install-2000w.webp"
          imageAlt="Engineer commissioning commercial access control and security system"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Join Fire & Security Network", href: "/suppliers/apply" }}
          secondaryCta={{ label: "Explore Contractor Portal", href: "/suppliers/membership#platform-overview" }}
          facts={[
            { figure: "BAFE & BS5839", label: "Life Safety Assurance" },
            { figure: "£295 / yr", label: "All-Inclusive Platform" },
            { figure: "Commercial FM", label: "Alarm & Security PPM" },
          ]}
        />

        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="eyebrow eyebrow-light">THE DISCIPLINE</span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
              Statutory Life Safety Systems &amp; Building Security Assurance
            </h2>
            <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Fire detection and life-safety systems carry strict statutory liability under the <strong>Regulatory Reform (Fire Safety) Order 2005</strong> and the <strong>Building Safety Act 2022</strong>. Fire alarm systems, aspirated smoke detection (VESDA), and emergency escape lighting require uncompromising audit integrity.
              </p>
              <p>
                The EntireFM Contractor Platform empowers fire and security contractors to manage BAFE accreditations, track engineer BS 7858 security screening, attach digital BS5839 test certificates directly to work orders, and receive commercial maintenance instructions.
              </p>
            </div>
          </div>
        </section>

        <TradeFmWorkflow tradeName="Fire &amp; Security" />
        <TradeComplianceGrid tradeName="Fire &amp; Security" requirements={FIRE_COMPLIANCE} />

        <TradePortalShowcase
          tradeName="Fire &amp; Security"
          sampleJob={{
            title: "Six-Monthly Fire Alarm Maintenance & Cause-and-Effect Matrix Test",
            ref: "WO-84954-FIRE",
            location: "Multi-Tenant Commercial Office, Leeds LS1",
            poValue: "£1,250.00 PO",
            scope: "Execute 50% device testing under BS 5839-1 across 4 floors. Test interface shut-downs for HVAC AHUs, verify access control fail-safe release on fire alarm activation, issue certificate.",
          }}
          sampleCompliance={[
            { name: "Public & Employers Liability (£10m) + Inefficacy", expiry: "18 Nov 2026", status: "VERIFIED" },
            { name: "BAFE SP203-1 Fire Detection Accreditation", expiry: "14 May 2027", status: "VERIFIED" },
            { name: "BS 7858 Security Screening Register", expiry: "09 Jan 2027", status: "VERIFIED" },
          ]}
        />

        <TradeDocsGrid tradeName="Fire &amp; Security" docs={FIRE_DOCS} />
        <TradeConversionBridge tradeName="Fire &amp; Security Contractors" />
        <TradeFaqAccordion tradeName="Fire &amp; Security" faqs={FIRE_FAQS} />
      </main>

      <Footer />
    </div>
  );
}
