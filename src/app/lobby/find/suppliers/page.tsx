import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Suppliers & Technology Partners | FIND — EntireFM',
  description:
    'Directory of commercial equipment distributors, CAFM software vendors, wireless telemetry systems, and sustainable consumables suppliers.',
  keywords: [
    'FM suppliers',
    'facilities management software',
    'commercial pump supplier',
    'BMS telemetry',
    'sustainable cleaning materials',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/suppliers`,
  },
  openGraph: {
    title: 'FM Suppliers & Technology Partners | FIND — EntireFM',
    description:
      'Directory of commercial equipment distributors, CAFM software vendors, and sustainable consumables suppliers.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/suppliers`,
    type: 'website',
  },
};

export default function FindSuppliersPage() {
  return <TemplateLobbyFind initialCategory="SUPPLIERS" />;
}
