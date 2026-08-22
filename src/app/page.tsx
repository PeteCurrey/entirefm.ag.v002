import type { Metadata } from 'next';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { TemplateHome } from '@/templates/TemplateHome';

export const metadata: Metadata = generateRouteMetadata('/', {
  title: 'Entire FM | Total Facilities Management Services UK',
  description:
    'Entire FM provides integrated Hard FM, Soft FM, mechanical & electrical engineering, PPM, and specialist facilities management across London and the UK.',
});

export default function HomePage() {
  return <TemplateHome />;
}
