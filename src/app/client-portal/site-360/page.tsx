import type { Metadata } from 'next';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { TemplateSite360 } from '@/templates/client-portal/TemplateSite360';

export const metadata: Metadata = generateRouteMetadata('/client-portal/site-360', {
  title: 'Site 360 Physical Asset Canvas | EntireCAFM Client Portal',
  description:
    'Every building has a digital operating picture: unite site photography, CAD floor plans, asset hierarchies, live IoT sensors, and operational risk overlays.',
});

export default function Site360Page() {
  return <TemplateSite360 />;
}
