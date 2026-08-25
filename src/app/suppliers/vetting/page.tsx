import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { AssuranceFrameworkGraphic } from '@/components/suppliers/AssuranceFrameworkGraphic';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, CheckCircle2, ShieldCheck, FileText, AlertTriangle, Building, Award } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/vetting', {
  title: 'Supplier Vetting & Assurance Framework | EntireFM',
  description:
    'Learn how EntireFM vets subcontractors and specialist suppliers using a proportionate, risk-based assurance framework covering corporate standing, insurance, health & safety, and trade certifications.',
});

export default function VettingPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Vetting & Assurance Framework', url: '/suppliers/vetting' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        <SupplierHero
          eyebrow="SUPPLY CHAIN GOVERNANCE // RISK-BASED VETTING"
          title="Proportionate vetting."
          subtitle="Uncompromising assurance."
          intro="EntireFM’s Supplier Assurance Framework establishes verified competence, valid insurances, and robust health and safety systems—proportionate to trade risk and site environment."
          imageSrc="/images/editorial/entirefm-site-arrival-2000w.webp"
          imageAlt="EntireFM compliance officers conducting on-site contractor induction"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Review Insurance Thresholds', href: '/suppliers/compliance' }}
          facts={[
            { figure: 'Risk-Based', label: 'Assurance Model', detail: 'Tailored to trade & scope' },
            { figure: '£5M–£20M', label: 'Public Liability', detail: 'Direct broker verification' },
            { figure: 'SSIP Aligned', label: 'Health & Safety', detail: 'CHAS, SafeContractor, SMAS' },
          ]}
        />

        <TrustBar />

        {/* CORE ASSURANCE GRAPHIC & 4 PILLARS */}
        <AssuranceFrameworkGraphic />

        {/* TRADE-SPECIFIC COMPETENCIES */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">TECHNICAL ACCREDITATION SCHEMES</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Trade-Specific Competence Benchmarks
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Requirements are determined strictly by the services being supplied. No certification is universally mandatory unless legally required for that discipline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  trade: 'Electrical Systems',
                  schemes: ['NICEIC Approved Contractor', 'NAPIT Registered', 'ECA Member', '18th Edition BS 7671 Qualified'],
                  notes: 'Mandatory for all fixed-wire inspection, testing, EV charger installation, and distribution maintenance.',
                },
                {
                  trade: 'Commercial Gas & Heating',
                  schemes: ['Gas Safe Register (Commercial)', 'OFTEC (Oil Fired)', 'CIBSE Associated', 'Combustion Analysis Certified'],
                  notes: 'Mandatory for non-domestic gas pipework, commercial boilers, warm air heaters, and catering gas.',
                },
                {
                  trade: 'HVAC & Refrigeration',
                  schemes: ['F-Gas Company Certified', 'REFCOM Elite', 'ACRIB Registered', 'BESA Member'],
                  notes: 'Mandatory for split AC, VRF/VRV systems, chillers, and refrigerant leak containment.',
                },
                {
                  trade: 'Specialist Access & Façade',
                  schemes: ['IRATA Member Company', 'IPAF Powered Access', 'PASMA Mobile Towers', 'LEEA Certified Riggers'],
                  notes: 'Mandatory for all working at height, rope access maintenance, BMU cradle testing, and abseil operations.',
                },
                {
                  trade: 'Fire & Life Safety',
                  schemes: ['BAFE SP203 / SP101', 'FIA Member', 'FIRAS Certified Fire Doors', 'BM TRADA Q-Mark'],
                  notes: 'Mandatory for addressable fire alarms, automated suppression, smoke venting, and certified fire door remedials.',
                },
                {
                  trade: 'Water Hygiene & Legionella',
                  schemes: ['Legionella Control Association (LCA)', 'Water Management Society', 'City & Guilds Water Treatment'],
                  notes: 'Mandatory for ACOP L8 risk assessments, calorifier inspections, CWST cleaning, and UKAS sampling.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">DISCIPLINE 0{idx + 1}</span>
                  <h3 className="text-base font-bold text-slate-900">{item.trade}</h3>
                  <div className="space-y-1.5 pt-2">
                    {item.schemes.map((s, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-pink shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11.5px] text-slate-500 pt-3 border-t border-slate-100 font-light leading-relaxed">
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <h2 className="text-3xl font-extralight text-white">
              Ready to verify your business credentials?
            </h2>
            <p className="text-sm text-brand-mist/80 max-w-xl mx-auto font-light leading-relaxed">
              Submit your company details, trade disciplines, and insurance levels for prompt Stage 1 qualification.
            </p>
            <div className="pt-2">
              <Link href="/suppliers/apply" className="btn-primary inline-flex">
                Begin Supplier Application <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
