import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContractorResourceHero } from "@/components/contractor-resources/ContractorResourceHero";
import { ContractorPortalCtaCard } from "@/components/contractor-resources/ContractorPortalCtaCard";
import { ContractorFaqAccordion } from "@/components/contractor-resources/ContractorFaqAccordion";
import { ContractorRelatedGrid } from "@/components/contractor-resources/ContractorRelatedGrid";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building2,
  FileCheck,
  Award,
  Lock,
  Sliders,
  Scale
} from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/contractor-resources/contractor-compliance", {
  title: "Contractor Compliance UK: FM Standards, Insurance & Vetting | EntireFM",
  description:
    "Comprehensive UK contractor compliance guide for facilities management. Insurance thresholds (£5m/£10m), SSIP accreditations, trade certifications, and digital vetting checklist.",
});

const COMPLIANCE_FAQS = [
  {
    question: "What levels of insurance are required for commercial FM contracting?",
    answer:
      "Most UK commercial facilities management operators and corporate clients require a minimum of £5,000,000 Public Liability insurance (often £10,000,000 for high-risk, aviation, or public-sector sites) and £10,000,000 Employers' Liability insurance (a statutory requirement for any business employing staff). Professional Indemnity insurance (£2m–£5m) is also commonly required for design, consultancy, or inspection services.",
  },
  {
    question: "What is SSIP accreditation?",
    answer:
      "SSIP stands for Safety Schemes in Procurement. It is an umbrella organisation covering major UK health & safety assessment schemes (such as CHAS, SafeContractor, Constructionline, and Alcumus). Holding a valid SSIP accreditation demonstrates that your business meets core stage-one health and safety vetting standards under the CDM Regulations 2015.",
  },
  {
    question: "What happens when a contractor's insurance or accreditation expires?",
    answer:
      "Under automated compliance systems like the EntireFM Contractor Platform, any expired statutory credential immediately restricts work dispatch eligibility. Automated reminders are sent at 90, 60, and 30 days prior to expiry so contractors can upload renewed certificates without operational disruption.",
  },
  {
    question: "How does EntireFM evaluate contractor compliance?",
    answer:
      "EntireFM evaluates contractors across six core compliance pillars: 1) Statutory Insurance; 2) Health & Safety Policies & RAMS; 3) Trade Competency & Certifications (Gas Safe, NICEIC, F-Gas, etc.); 4) Operative Qualifications (CSCS/ECS); 5) Financial Standing & Companies House verification; and 6) Environmental & Quality Standards (ISO 9001/14001 or equivalent).",
  },
];

export default function ContractorCompliancePage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contractor Resources", url: "/contractor-resources" },
    { name: "Contractor Compliance Standard", url: "/contractor-resources/contractor-compliance" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <ContractorResourceHero
          eyebrow="COMMERCIAL FM VETTING &amp; ASSURANCE"
          title="Contractor Compliance Standard"
          subtitle="The complete guide to UK facilities management vetting."
          intro="Understand the insurance thresholds, statutory qualifications, health &amp; safety policies, and accreditation standards required to work professionally in commercial facilities management."
          breadcrumbs={breadcrumbs}
          readTime="8 min read"
          lastUpdated="2026"
          keyTakeaway="Commercial FM compliance is built on six pillars: statutory insurance, verified trade certifications, operative competency cards, structured RAMS, Companies House good standing, and automated expiry monitoring."
          primaryCta={{ label: "View Compliance Centre in Portal", href: "/suppliers/membership#platform-overview" }}
          secondaryCta={{ label: "Join EntireFM Contractor Network (£95/yr)", href: "/suppliers/membership" }}
        />

        {/* MAIN BODY ARTICLE */}
        <article className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-12">
            {/* 1. Stop Managing in Spreadsheets */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // THE COMPLIANCE CHALLENGE</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Stop Managing Contractor Compliance in Scattered Spreadsheets
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  For decades, contractor compliance in facilities management meant chasing email attachments, scanning paper certificates, and maintaining unwieldy Excel spreadsheets that were out-of-date within weeks.
                </p>
                <p>
                  Today, regulatory scrutiny under the <strong>Building Safety Act 2022</strong>, CDM Regulations 2015, and corporate ESG mandates requires a real-time, audit-ready digital golden thread of information. Both FM providers and trade contractors need a single source of truth for all business credentials.
                </p>
              </div>
            </section>

            {/* 2. The 6 Pillars of FM Compliance */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">02 // THE 6 PILLARS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                The 6 Pillars of Commercial Contractor Compliance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    title: "1. Statutory Insurance Coverage",
                    desc: "Public Liability (£5m minimum, £10m preferred), Employers' Liability (£10m mandatory for all employers), and Professional Indemnity where design/inspection applies.",
                  },
                  {
                    title: "2. Trade Bodies & Accreditations",
                    desc: "Mandatory regulatory scheme registrations: Gas Safe (combustion), NICEIC / NAPIT (electrical), Refcom / F-Gas (refrigeration), FIRAS / BAFE (fire protection).",
                  },
                  {
                    title: "3. Health, Safety & Environmental Policies",
                    desc: "Formal Health & Safety Policy (mandatory if 5+ employees), Environmental Policy, Equality Policy, and Modern Slavery compliance statement.",
                  },
                  {
                    title: "4. Operative Matrix & Competency Cards",
                    desc: "CSCS, JIB/ECS, Gas Safe operative licences, IPAF (MEWPs), PASMA (towers), Asbestos Awareness (UKATA/IATP), and First Aid certifications.",
                  },
                  {
                    title: "5. Risk Assessments & RAMS Library",
                    desc: "Task-specific RAMS, COSHH chemical safety assessments, manual handling evaluations, and emergency rescue procedures.",
                  },
                  {
                    title: "6. Corporate Governance & Financial Standing",
                    desc: "Companies House registration verification, verified bank remittance details (dual-control fraud prevention), and confirmation of non-insolvency.",
                  },
                ].map((pillar, idx) => (
                  <div key={idx} className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">{pillar.title}</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. The EntireFM Compliance Engine */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">03 // AUTOMATED MONITORING</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                How EntireFM Maintains Real-Time Supply Chain Compliance
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                The EntireFM Contractor Platform continuously audits your uploaded documents and alerts you well ahead of renewal deadlines:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-center">
                <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs space-y-1">
                  <span className="font-mono text-sm font-bold text-slate-700 block">90 DAYS OUT</span>
                  <div className="text-xs text-slate-600 font-light">Advance courtesy alert indicating upcoming policy renewal window.</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs space-y-1">
                  <span className="font-mono text-sm font-bold text-amber-600 block">60 &amp; 30 DAYS</span>
                  <div className="text-xs text-slate-600 font-light">Direct reminder to upload replacement policy or registration schedule.</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs space-y-1">
                  <span className="font-mono text-sm font-bold text-emerald-600 block">DAY OF RENEWAL</span>
                  <div className="text-xs text-slate-600 font-light">Continuous verification maintains uninterrupted work dispatch eligibility.</div>
                </div>
              </div>
            </section>
          </div>
        </article>

        {/* COMMERCIAL CONVERSION COMPONENT */}
        <div className="container-wide">
          <ContractorPortalCtaCard
            headline="Manage your entire compliance footprint from one dashboard."
            description="Join the EntireFM Contractor Platform (£95/yr) and gain access to the digital Compliance Centre, Document Vault, automated expiry alerts, and commercial FM work eligibility."
            bulletPoints={[
              "Single-view Compliance Health score tracking all 6 statutory pillars",
              "Document Vault holding verified insurance, trade cards & company policies",
              "Automated 90/60/30-day renewal alerts preventing lapsed credentials",
              "Direct access to commercial FM work dispatch across the UK",
            ]}
            primaryBtnText="Explore Compliance Centre in Portal"
            primaryBtnHref="/suppliers/membership#platform-overview"
            secondaryBtnText="Join EntireFM Network"
            secondaryBtnHref="/suppliers/membership"
          />
        </div>

        {/* FAQS */}
        <ContractorFaqAccordion
          title="Frequently Asked Questions about Contractor Compliance"
          subtitle="Answers regarding insurance levels, SSIP accreditations, and EntireFM vetting standards."
          faqs={COMPLIANCE_FAQS}
        />

        {/* RELATED RESOURCES */}
        <ContractorRelatedGrid
          heading="Related Compliance &amp; Documentation Guides"
          subheading="Explore companion tools for RAMS, risk assessments, and contractor membership."
          currentPath="/contractor-resources/contractor-compliance"
        />
      </main>

      <Footer />
    </div>
  );
}
