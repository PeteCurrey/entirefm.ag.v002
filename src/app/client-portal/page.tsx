import type { Metadata } from 'next';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { TemplateClientPortal } from '@/templates/client-portal/TemplateClientPortal';

export const metadata: Metadata = generateRouteMetadata('/client-portal', {
  title: 'EntireCAFM Client Portal | Facilities Management Operating Platform',
  description:
    'EntireCAFM gives authorised clients live operational visibility across sites, assets, work orders, statutory compliance, engineers, PPM schedules, and commercial performance.',
});

export default function ClientPortalPage() {
  return <TemplateClientPortal />;
}
