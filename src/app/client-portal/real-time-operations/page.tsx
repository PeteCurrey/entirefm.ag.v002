import type { Metadata } from 'next';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { TemplateRealTimeOperations } from '@/templates/client-portal/TemplateRealTimeOperations';

export const metadata: Metadata = generateRouteMetadata('/client-portal/real-time-operations', {
  title: 'Real-Time FM Operations & Dispatch Control | EntireCAFM Client Portal',
  description:
    'Continuous operational telemetry: track reactive maintenance, engineer check-ins, SLA resolution windows, and live facility dispatch in real time.',
});

export default function RealTimeOperationsPage() {
  return <TemplateRealTimeOperations />;
}
