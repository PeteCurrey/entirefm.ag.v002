import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { ToolShell } from '@/components/tools/ToolShell';
import { ChecklistEngine } from '@/components/contractor-tools/ChecklistEngine';
import { ToolDisclaimer } from '@/components/contractor-tools/ToolDisclaimer';
import { ToolCrossLinks } from '@/components/contractor-tools/ToolCrossLinks';
import type { ChecklistSection } from '@/components/contractor-tools/ChecklistEngine';

export const metadata: Metadata = generateRouteMetadata('/contractor-tools/contractor-onboarding-checklist', {
  title: 'Contractor Onboarding Checklist — Joining a Professional FM Network | EntireFM',
  description:
    'Work through the information and documentation commonly needed when joining a professional FM contractor network. Aligned with the EntireFM supplier journey.',
});

const SECTIONS: ChecklistSection[] = [
  {
    id: 'business-details',
    title: 'Business Details',
    subtitle: 'The core business information required to begin any contractor registration process.',
    items: [
      {
        id: 'bd-legal-name',
        label: 'Legal business name and trading name (if different) are documented',
      },
      {
        id: 'bd-company-number',
        label: 'Company registration number is available (if applicable)',
        allowNotApplicable: true,
      },
      {
        id: 'bd-address',
        label: 'Registered address and principal trading address are confirmed',
      },
      {
        id: 'bd-contact',
        label: 'Primary contact name, phone number and business email address are confirmed',
      },
      {
        id: 'bd-vat',
        label: 'VAT registration number is available (if VAT registered)',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'trade-capability',
    title: 'Trade & Capability',
    subtitle: 'Your trade disciplines and the types of work you are able to carry out.',
    items: [
      {
        id: 'tc-primary-trade',
        label: 'Primary trade discipline is clearly described',
        detail: 'Be specific — for example: "commercial HVAC maintenance and installation" rather than "heating engineer".',
      },
      {
        id: 'tc-additional-trades',
        label: 'Additional trade capabilities are listed',
        allowNotApplicable: true,
      },
      {
        id: 'tc-commercial-experience',
        label: 'Commercial or FM sector experience is documented',
        detail: 'Experience working in commercial premises, managed buildings, or for FM organisations is valued by professional clients. Relevant project types, building types, or sector experience.',
        allowNotApplicable: true,
      },
      {
        id: 'tc-specialist-capabilities',
        label: 'Any specialist capabilities or authorisations are identified',
        detail: 'For example: high-voltage authorisation, confined space entry, F-Gas licence, asbestos awareness, working at height certification.',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'coverage',
    title: 'Coverage Area',
    subtitle: 'The geographic areas you are able to work in.',
    items: [
      {
        id: 'cov-geographic-area',
        label: 'Primary geographic coverage area is defined',
        detail: 'Define your operational area by county, postcode radius, or region. Being specific helps match you to relevant work opportunities.',
      },
      {
        id: 'cov-extended-area',
        label: 'Extended or occasional coverage areas are noted',
        allowNotApplicable: true,
      },
      {
        id: 'cov-emergency',
        label: 'Emergency response capability and response times are confirmed',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'insurance-docs',
    title: 'Insurance',
    subtitle: 'Insurance documentation required to join a professional contractor network.',
    items: [
      {
        id: 'ins-pl-cert',
        label: 'Public liability insurance certificate is current and available',
        detail: 'Check the minimum limit required. EntireFM and most FM clients require a minimum of £5 million public liability cover.',
      },
      {
        id: 'ins-el-cert',
        label: 'Employers\' liability insurance certificate is current and available (if applicable)',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: Employers\' liability', href: 'https://www.hse.gov.uk/pubns/hse40.htm' },
      },
      {
        id: 'ins-pi-cert',
        label: 'Professional indemnity insurance is current and available (if applicable)',
        allowNotApplicable: true,
      },
      {
        id: 'ins-expiry',
        label: 'All insurance certificates show correct expiry dates and are not expired',
      },
    ],
  },
  {
    id: 'qualifications',
    title: 'Qualifications & Registrations',
    subtitle: 'Trade qualifications and scheme registrations relevant to your work.',
    items: [
      {
        id: 'qual-trade',
        label: 'Trade qualifications are available and current',
      },
      {
        id: 'qual-scheme',
        label: 'Relevant scheme registrations are current (e.g. Gas Safe, NICEIC, REFCOM)',
        allowNotApplicable: true,
      },
      {
        id: 'qual-ssip',
        label: 'SSIP or equivalent accreditation is current (e.g. CHAS, Constructionline)',
        allowNotApplicable: true,
        authorityLink: { label: 'SSIP Forum', href: 'https://www.ssip.org.uk' },
      },
      {
        id: 'qual-certifications',
        label: 'Relevant trade certifications are available (e.g. F-Gas licence)',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'health-safety-onboarding',
    title: 'Health & Safety',
    subtitle: 'Health and safety documentation required for professional contractor networks.',
    items: [
      {
        id: 'hso-policy',
        label: 'Written Health & Safety policy is available',
        authorityLink: { label: 'HSE: Health and safety policy', href: 'https://www.hse.gov.uk/simple-health-safety/write-a-health-and-safety-policy.htm' },
      },
      {
        id: 'hso-risk-assessments',
        label: 'Generic risk assessments for common work activities are available',
      },
      {
        id: 'hso-method-statements',
        label: 'Method statement capability is confirmed',
        detail: 'Can you prepare a method statement for a specific job? Generic RAMS templates alone are insufficient for professional FM work.',
      },
      {
        id: 'hso-training-records',
        label: 'H&S training records are available',
      },
    ],
  },
  {
    id: 'rams-section',
    title: 'RAMS',
    subtitle: 'Risk Assessment and Method Statement capability.',
    items: [
      {
        id: 'rams-experience',
        label: 'You are able to produce job-specific RAMS',
        detail: 'Professional FM clients require RAMS that are specific to the job, site and risks involved — not generic templates.',
      },
      {
        id: 'rams-generic',
        label: 'Generic RAMS templates are available as a starting point',
        allowNotApplicable: true,
      },
      {
        id: 'rams-review',
        label: 'You understand that RAMS must be reviewed and briefed to operatives',
        detail: 'RAMS are a working document, not a filing exercise. Operatives must read, understand and sign to confirm they have received the briefing.',
      },
    ],
  },
  {
    id: 'coshh-section',
    title: 'COSHH',
    subtitle: 'Control of Substances Hazardous to Health — documentation capability.',
    items: [
      {
        id: 'coshh-aware',
        label: 'You are aware of COSHH requirements for substances used in your work',
        authorityLink: { label: 'HSE: COSHH', href: 'https://www.hse.gov.uk/coshh/' },
      },
      {
        id: 'coshh-sds',
        label: 'Safety Data Sheets are available for substances you use',
        allowNotApplicable: true,
      },
      {
        id: 'coshh-assessments',
        label: 'COSHH assessments are in place for substances used',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'policies',
    title: 'Policies',
    subtitle: 'Business policies commonly requested by FM clients during onboarding.',
    items: [
      {
        id: 'pol-hs',
        label: 'Health & Safety policy',
      },
      {
        id: 'pol-equal',
        label: 'Equal Opportunities policy',
        allowNotApplicable: true,
      },
      {
        id: 'pol-env',
        label: 'Environmental policy',
        allowNotApplicable: true,
      },
      {
        id: 'pol-anti-bribery',
        label: 'Anti-Bribery and Corruption policy',
        allowNotApplicable: true,
      },
      {
        id: 'pol-modern-slavery',
        label: 'Modern Slavery and Human Trafficking statement (required for businesses with turnover >£36m)',
        allowNotApplicable: true,
        authorityLink: { label: 'GOV.UK: Modern Slavery', href: 'https://www.gov.uk/guidance/publish-an-annual-modern-slavery-and-human-trafficking-statement' },
      },
    ],
  },
  {
    id: 'supporting-documents',
    title: 'Supporting Documents',
    subtitle: 'Additional documentation that may be requested during onboarding.',
    items: [
      {
        id: 'sd-bank',
        label: 'Bank details are available for payment setup',
      },
      {
        id: 'sd-references',
        label: 'Client references or project examples are available',
        allowNotApplicable: true,
      },
      {
        id: 'sd-logo',
        label: 'Company logo and business description are available',
        allowNotApplicable: true,
      },
      {
        id: 'sd-id',
        label: 'Director or owner identification documents are available if required',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'portal-setup',
    title: 'Portal & Profile Setup',
    subtitle: 'Practical readiness for setting up your contractor profile on a digital platform.',
    items: [
      {
        id: 'ps-email',
        label: 'A dedicated business email address is available for platform registration',
      },
      {
        id: 'ps-documents-digital',
        label: 'Key documents are available in digital format (PDF)',
        detail: 'Insurance certificates, qualifications, and certifications should be available as PDFs for upload.',
      },
      {
        id: 'ps-profile',
        label: 'You have information ready to complete a contractor profile',
        detail: 'Company description, trade disciplines, coverage area, contact information.',
      },
    ],
  },
];

const CROSS_LINKS = [
  { title: 'Contractor Compliance Check', href: '/contractor-tools/contractor-compliance-check', badge: 'TOOL' },
  { title: 'Contractor Document Checklist', href: '/contractor-tools/contractor-document-checklist', badge: 'TOOL' },
  { title: 'RAMS Readiness Check', href: '/contractor-tools/rams-readiness-check', badge: 'TOOL' },
  { title: 'Contractor Compliance Guide', href: '/contractor-resources/contractor-compliance', badge: 'GUIDE' },
  { title: 'RAMS Guide', href: '/contractor-resources/rams', badge: 'GUIDE' },
  { title: 'Contractor Membership', href: '/suppliers/membership', badge: 'MEMBERSHIP' },
  { title: 'Apply as an EntireFM Supplier', href: '/suppliers/apply', badge: 'APPLY' },
  { title: 'Contractor Tools Hub', href: '/contractor-tools', badge: 'HUB' },
];

export default function ContractorOnboardingChecklistPage() {
  return (
    <>
      <Header />
      <ToolShell
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contractor Tools', url: '/contractor-tools' },
          { name: 'Contractor Onboarding Checklist', url: '/contractor-tools/contractor-onboarding-checklist' },
        ]}
        eyebrow="CONTRACTOR TOOLS / ONBOARDING"
        title="Contractor Onboarding Checklist"
        purpose="Work through the information and documentation commonly needed when joining a professional FM contractor network. Aligned with the EntireFM supplier journey."
        timeEstimate="5–8 minutes"
        outputs={['Readiness Score', 'Action List']}
      >
        <ToolDisclaimer context="onboarding" className="mb-8" />

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-sm text-slate-400">Loading checklist…</div>}>
          <ChecklistEngine
            toolName="contractor-onboarding-checklist"
            sections={SECTIONS}
            mode="quad"
            disclaimerContext="onboarding"
          />
        </Suspense>

        <ToolCrossLinks heading="Related Resources" links={CROSS_LINKS} />
      </ToolShell>
      <Footer />
    </>
  );
}
