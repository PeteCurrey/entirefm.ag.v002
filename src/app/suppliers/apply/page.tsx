import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SupplierHero } from "@/components/suppliers/SupplierHero";
import { TrustBar } from "@/components/trust/TrustBar";
import { SupplierRelatedLinks } from "@/components/suppliers/SupplierRelatedLinks";
import { ContractorApplicationWizard } from "@/components/suppliers/ContractorApplicationWizard";
import { generateRouteMetadata } from "@/lib/metadata/generate-metadata";
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, FileText, Building2, Layers, Lock, Award } from "lucide-react";

export const metadata: Metadata = generateRouteMetadata("/suppliers/apply", {
  title: "Apply to Become an EntireFM Supplier | Contractor Qualification",
  description:
    "Complete one supplier application to tell us who you are, what you do, and provide the information required for EntireFM supplier assurance.",
});

export default function ApplyPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Suppliers", url: "/suppliers" },
    { name: "Supplier Application", url: "/suppliers/apply" },
  ];

  const whatHappensNext = [
    { step: "01", title: "Create Supplier Profile", desc: "Company registration, trading name, and business structure." },
    { step: "02", title: "Scope & Territories", desc: "Select technical trades and declared operational territories." },
    { step: "03", title: "Assurance Information", desc: "Insurance policy limits, expiry dates, and scheme details." },
    { step: "04", title: "Document Vault Upload", desc: "Schedules, certificates, and health & safety documentation." },
    { step: "05", title: "Supplier Membership", desc: "EntireFM Supplier Membership (£95 + VAT/year). Authorised invitation codes accepted." },
    { step: "06", title: "Review & Submit", desc: "Verify all details and complete applicant statements." },
    { step: "07", title: "Technical Desk Review", desc: "Technical due diligence against our Assurance Framework." },
    { step: "08", title: "Scoped Portal Activation", desc: "Activated on EntireCAFM and eligible for live job dispatch upon approval." },
  ];

  const beforeYouStartItems = [
    "Companies House registration number and registered office address",
    "Primary commercial and 24/7 emergency operations contact details",
    "Service disciplines and geographical operating areas (e.g. 30-mile radius)",
    "Public (£5M–£10M) and Employers (£10M) liability insurance schedules",
    "Relevant statutory trade accreditations (Gas Safe, NICEIC, REFCOM, BAFE, etc.)",
    "Electronic PDF copies of certificates and H&S policy documentation",
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="ENTIREFM PARTNER NETWORK // COMMERCIAL INTAKE"
          title="Apply to become"
          subtitle="an EntireFM supplier."
          intro="Complete one streamlined supplier application to tell us who you are, what services you provide, and where you operate. Join our nationwide network of regional SMEs, specialist engineering contractors, OEMs, and technology partners."
          imageSrc="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
          imageAlt="EntireFM engineering team on commercial survey"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: "Start Supplier Application", href: "#application-start" }}
          secondaryCta={{ label: "Review Vetting Standards", href: "/suppliers/vetting" }}
          facts={[
            { figure: "One Process", label: "Single Journey", detail: "No competing quick forms" },
            { figure: "SMEs Welcomed", label: "Regional Focus", detail: "No mandatory national footprint" },
            { figure: "Save & Resume", label: "Self-Paced", detail: "Progress saved as you go" },
          ]}
        />

        <TrustBar />

        {/* 2. INTERACTIVE APPLICATION WIZARD SECTION */}
        <section id="application-start" className="py-20 sm:py-24 bg-white border-b border-slate-200 scroll-mt-12">
          <div id="application-form" className="container-custom max-w-4xl space-y-12">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">QUALIFICATION INTAKE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                Start Your Supplier Application
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed max-w-2xl">
                Declare your technical trade disciplines, operating base, insurance limits, and accreditations. Step through the 4-stage intake below to activate your Document Vault and operating workspace.
              </p>
            </div>

            {/* Suspense-Wrapped Interactive Wizard */}
            <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-slate-400">Loading Application Wizard...</div>}>
              <ContractorApplicationWizard />
            </Suspense>

            {/* Before You Start Checklist */}
            <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-sm shadow-xs space-y-5">
              <div className="space-y-1">
                <span className="eyebrow eyebrow-light">PREPARATION CHECKLIST</span>
                <h3 className="text-xl font-light text-slate-900">Before You Begin</h3>
                <p className="text-xs text-slate-600 font-light">
                  Having these details to hand will allow you to complete your application in under 15 minutes:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                {beforeYouStartItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-sm bg-[#FAF9FB] border border-slate-200/80">
                    <CheckCircle2 className="h-4 w-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span className="font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What Happens Next — 8-Stage Overview */}
            <div className="space-y-6 pt-4">
              <div className="space-y-1">
                <span className="eyebrow eyebrow-light">APPLICATION ROADMAP</span>
                <h3 className="text-2xl font-light text-slate-900">What Happens Next</h3>
                <p className="text-xs text-slate-600 font-light">
                  A transparent, step-by-step qualification process from profile creation through to approved service scope.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {whatHappensNext.map((item) => (
                  <div key={item.step} className="p-5 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#EA580C] block mb-1">
                        STEP {item.step}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 text-xs font-light leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ASSURANCE GUARANTEE */}
        <section className="py-20 bg-brand-graphite text-white border-t border-b border-brand-edge-dark text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#EA580C]">
              COMMERCIAL GUARANTEE
            </span>
            <h2 className="text-3xl font-extralight text-white">
              Fair, Transparent &amp; Prompt Relationships
            </h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
              EntireFM is built on mutual respect. We provide clear digital job scopes, pre-authorised budgets, zero hidden deductions, and verified payment terms.
            </p>
            <div className="pt-2">
              <Link href="/suppliers/partner-with-entirefm" className="btn-ghost-light">
                Why High-Performing Suppliers Choose EntireFM &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="SUPPLIER INFORMATION"
          heading="Related supplier information"
          links={[
            {
              title: "How We Work",
              href: "/suppliers/how-we-work",
              description: "The 12-stage operational journey from registration to work delivery.",
              tag: "PROCESS",
            },
            {
              title: "Supplier Vetting",
              href: "/suppliers/vetting",
              description: "The 6-pillar risk-proportional assessment framework before site dispatch.",
              tag: "VETTING",
            },
            {
              title: "Supplier Standards",
              href: "/suppliers/standards",
              description: "Operational principles, ethical benchmarks, and Code of Conduct expectations.",
              tag: "STANDARDS",
            },
            {
              title: "Compliance Matrix",
              href: "/suppliers/compliance",
              description: "Insurance minimums, dynamic RAMS, CSCS/SKILLcard, and certificate management.",
              tag: "COMPLIANCE",
            },
            {
              title: "Supplier FAQ",
              href: "/suppliers/faq",
              description: "Frequently asked questions on vetting intervals, rate cards, and payment terms.",
              tag: "FAQ",
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
