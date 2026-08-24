import type { Metadata } from 'next';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { TemplateComplianceReporting } from '@/templates/client-portal/TemplateComplianceReporting';

export const metadata: Metadata = generateRouteMetadata('/client-portal/compliance-reporting', {
  title: 'Statutory Compliance & SFG20 Reporting | EntireCAFM Client Portal',
  description:
    'From statutory obligation to immutable proof: explore SFG20 maintenance schedules, digital Compliance Vault, gas & electrical certificates, and instant audit packs.',
});

export default function ComplianceReportingPage() {
  return <TemplateComplianceReporting />;
}
