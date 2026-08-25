import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { SupplierApplicationForm } from '@/components/suppliers/SupplierApplicationForm';
import { TrustBar } from '@/components/trust/TrustBar';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/apply', {
  title: 'Apply to Become an EntireFM Supplier | Contractor Qualification',
  description:
    'Submit your company profile to join the EntireFM Supplier & Partner Network. Open to regional trade SMEs, specialist engineering contractors, OEMs, and technology providers.',
});

export default function ApplyPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Supplier Application', url: '/suppliers/apply' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        <SupplierHero
          eyebrow="SUPPLIER QUALIFICATION // PHASE 1 INTAKE"
          title="Apply to become an EntireFM supplier."
          subtitle="Join our UK contractor &amp; partner ecosystem."
          intro="Complete this initial qualification application. Our supply chain governance desk will review your trade scope, coverage, and insurance levels against our Assurance Framework."
          imageSrc="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
          imageAlt="EntireFM engineering team on commercial survey"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Jump to Application Form', href: '#application-form' }}
          secondaryCta={{ label: 'Review Vetting Standards', href: '/suppliers/vetting' }}
          facts={[
            { figure: 'Stage 1 Form', label: 'Initial Review', detail: 'Rapid commercial appraisal' },
            { figure: 'SMEs Welcomed', label: 'Regional Focus', detail: 'No mandatory national footprint' },
            { figure: 'Direct Inflow', label: 'Admin Integrated', detail: 'Immediate review queue logging' },
          ]}
        />

        <TrustBar />

        {/* APPLICATION FORM SECTION */}
        <section id="application-form" className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <SupplierApplicationForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
