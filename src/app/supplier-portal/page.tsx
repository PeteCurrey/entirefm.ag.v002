import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierPortalComingSoon } from '@/components/suppliers/SupplierPortalComingSoon';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = {
  ...generateRouteMetadata('/supplier-portal', {
    title: 'EntireCAFM Supplier Operations Portal | Authorized Contractor Access',
    description:
      'Authorized contractor operations environment for EntireCAFM. Digital work orders, dynamic risk assessments, photographic evidence capture, and invoice matching.',
  }),
  robots: { index: false, follow: true },
};

export default function SupplierPortalPage() {
  return (
    <div className="min-h-screen bg-brand-carbon text-white flex flex-col">
      <Header solid />
      <main id="main" className="flex-grow">
        <SupplierPortalComingSoon />
      </main>
      <Footer />
    </div>
  );
}
