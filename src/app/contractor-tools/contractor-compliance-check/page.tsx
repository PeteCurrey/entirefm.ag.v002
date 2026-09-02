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

export const metadata: Metadata = generateRouteMetadata('/contractor-tools/contractor-compliance-check', {
  title: 'Contractor Compliance Check — Documentation & Insurance Review | EntireFM',
  description:
    'Work through the core documentation, insurance, competency and business information commonly required when working as a professional UK contractor. A practical preparation checklist.',
});

const SECTIONS: ChecklistSection[] = [
  {
    id: 'business',
    title: 'Business Information',
    subtitle: 'Core business details that clients and FM organisations commonly request.',
    items: [
      {
        id: 'biz-company-info',
        label: 'Company name, trading address and contact details are current',
        detail: 'Ensure registered business name, trading address, primary contact number and business email are up to date. These should match the information on your Companies House record if applicable.',
      },
      {
        id: 'biz-ch-number',
        label: 'Company registration number is available (if applicable)',
        detail: 'Limited companies and LLPs registered at Companies House should be able to provide their company registration number. Sole traders and partnerships are not required to register.',
        allowNotApplicable: true,
        authorityLink: { label: 'Companies House', href: 'https://www.gov.uk/get-information-about-a-company' },
      },
      {
        id: 'biz-vat',
        label: 'VAT registration information is current (if VAT registered)',
        detail: 'VAT-registered businesses should have their VAT registration number available. VAT registration is not mandatory for all businesses — threshold applies.',
        allowNotApplicable: true,
      },
      {
        id: 'biz-service-areas',
        label: 'Geographic service areas are defined',
        detail: 'Being clear about which geographic areas you operate in helps clients and FM platforms match your availability to work opportunities.',
      },
      {
        id: 'biz-trade-disciplines',
        label: 'Trade disciplines and services are clearly described',
        detail: 'Clear description of what you do — not just a job title. For example: "three-phase commercial electrical installation and inspection" rather than just "electrician".',
      },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance',
    subtitle: 'Insurance documentation commonly required by professional FM clients.',
    items: [
      {
        id: 'ins-pl',
        label: 'Public liability insurance is current',
        detail: 'Public liability insurance covers claims from third parties for injury or property damage. Most FM clients require a minimum of £5 million cover. Some require £10 million. Check client-specific requirements.',
        authorityLink: { label: 'GOV.UK: business insurance', href: 'https://www.gov.uk/business-legal-structures/limited-company' },
      },
      {
        id: 'ins-el',
        label: 'Employers\' liability insurance is current (if you employ staff)',
        detail: 'Employers\' liability insurance is a legal requirement if you employ staff — including part-time, temporary or casual workers. Minimum cover is £5 million. A certificate must be displayed at the workplace or accessible electronically.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: Employers\' liability insurance', href: 'https://www.hse.gov.uk/pubns/hse40.htm' },
      },
      {
        id: 'ins-pi',
        label: 'Professional indemnity insurance is current (if applicable)',
        detail: 'Professional indemnity insurance covers claims arising from professional advice or design. It is not required for all trades, but may be required by some FM clients for certain disciplines.',
        allowNotApplicable: true,
      },
      {
        id: 'ins-certificates',
        label: 'Insurance certificates are available and show correct expiry dates',
        detail: 'Insurance certificates should show the policy holder name, type of cover, limit of indemnity and expiry date. Ensure certificates are not expired.',
      },
    ],
  },
  {
    id: 'competence',
    title: 'Competence & Qualifications',
    subtitle: 'Trade qualifications, scheme registrations and relevant training.',
    items: [
      {
        id: 'comp-trade-quals',
        label: 'Trade qualifications are current and relevant to the work being carried out',
        detail: 'For example: NVQ Level 3 in Electrotechnical Technology (electrical), Level 3 Diploma in Plumbing and Heating, City & Guilds HVAC qualifications. Requirements vary significantly by trade.',
      },
      {
        id: 'comp-scheme-reg',
        label: 'Relevant scheme registrations are current (if applicable)',
        detail: 'Trade-specific registration schemes include: NICEIC or NAPIT (electrical), Gas Safe Register (gas), REFCOM (F-Gas), HETAS (solid fuel), BESCA (HVAC). Check whether registration is legally required or commercially expected for your trade.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: Competent contractors', href: 'https://www.hse.gov.uk/construction/cdm/2015/competence.htm' },
      },
      {
        id: 'comp-ssip',
        label: 'SSIP or equivalent accreditation is current (if applicable)',
        detail: 'SSIP (Safety Schemes in Procurement) accreditation includes schemes such as CHAS, Constructionline, Acclaim Accreditation, and Safecontractor. Many FM clients require SSIP accreditation or equivalent.',
        allowNotApplicable: true,
        authorityLink: { label: 'SSIP Forum', href: 'https://www.ssip.org.uk' },
      },
      {
        id: 'comp-manufacturer',
        label: 'Manufacturer or OEM training is available where required',
        detail: 'Some FM clients require contractors to hold manufacturer authorisation for equipment they service — for example, chiller manufacturers, BMS systems, or specialist plant.',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'health-safety',
    title: 'Health & Safety',
    subtitle: 'Health and safety documentation commonly expected by professional FM clients.',
    items: [
      {
        id: 'hs-policy',
        label: 'A written Health & Safety policy is in place',
        detail: 'Businesses employing 5 or more people are legally required to have a written H&S policy. Smaller businesses are encouraged to have one. FM clients frequently request H&S policies as part of contractor vetting.',
        authorityLink: { label: 'HSE: Writing a health and safety policy', href: 'https://www.hse.gov.uk/simple-health-safety/write-a-health-and-safety-policy.htm' },
      },
      {
        id: 'hs-risk-assessments',
        label: 'Generic risk assessments are available for common work activities',
        detail: 'Generic risk assessments covering common work activities provide a starting point. Site-specific risk assessments may be required for specific contracts.',
      },
      {
        id: 'hs-method-statements',
        label: 'Method statements can be prepared for the specific work',
        detail: 'Method statements describe how work will be carried out safely. They are typically prepared for specific jobs rather than held as generic documents.',
      },
      {
        id: 'hs-coshh',
        label: 'COSHH assessments are available for hazardous substances used',
        detail: 'COSHH (Control of Substances Hazardous to Health) assessments are a legal requirement where hazardous substances are used or may be encountered. They must be substance-specific.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: COSHH essentials', href: 'https://www.hse.gov.uk/coshh/' },
      },
      {
        id: 'hs-training-records',
        label: 'H&S training records are maintained',
        detail: 'Training records should cover mandatory training (e.g. manual handling, working at height) and trade-specific training. Records demonstrate that staff are appropriately trained for their work.',
      },
    ],
  },
  {
    id: 'documentation',
    title: 'Business Documentation',
    subtitle: 'Certifications, policies, accreditations and references.',
    items: [
      {
        id: 'doc-certifications',
        label: 'Trade-specific certifications are current and available',
        detail: 'For example: EICR certificates, Gas Safe certificates, REFCOM F-Gas certificates, F-Gas licence. Keep copies of all relevant current certifications.',
      },
      {
        id: 'doc-accreditations',
        label: 'Business accreditations are current',
        detail: 'Trade body memberships, scheme registrations, and quality accreditations. Check renewal dates and ensure certificates are current.',
      },
      {
        id: 'doc-policies',
        label: 'Business policies are in place and current',
        detail: 'As a minimum: Health & Safety policy, Equal Opportunities policy, Environmental policy (if applicable). FM clients may also request Anti-Bribery, Anti-Slavery, or Data Protection policies.',
      },
      {
        id: 'doc-references',
        label: 'Client references or project history can be provided',
        detail: 'Professional FM clients may request evidence of relevant previous work. Project descriptions, client references or case studies demonstrating relevant experience.',
        allowNotApplicable: true,
      },
    ],
  },
];

const CROSS_LINKS = [
  { title: 'Contractor Compliance Guide', href: '/contractor-resources/contractor-compliance', badge: 'GUIDE' },
  { title: 'RAMS Guide', href: '/contractor-resources/rams', badge: 'GUIDE' },
  { title: 'COSHH Assessment Guide', href: '/contractor-resources/coshh-assessment', badge: 'GUIDE' },
  { title: 'Contractor Document Checklist', href: '/contractor-tools/contractor-document-checklist', badge: 'TOOL' },
  { title: 'Contractor Onboarding Checklist', href: '/contractor-tools/contractor-onboarding-checklist', badge: 'TOOL' },
  { title: 'RAMS Readiness Check', href: '/contractor-tools/rams-readiness-check', badge: 'TOOL' },
  { title: 'Contractor Tools Hub', href: '/contractor-tools', badge: 'HUB' },
];

export default function ContractorComplianceCheckPage() {
  return (
    <>
      <Header />
      <ToolShell
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contractor Tools', url: '/contractor-tools' },
          { name: 'Contractor Compliance Check', url: '/contractor-tools/contractor-compliance-check' },
        ]}
        eyebrow="CONTRACTOR TOOLS / COMPLIANCE"
        title="Contractor Compliance Check"
        purpose="Review the core documentation, insurance, competency and business information commonly required when working as a professional contractor. Mark items as Complete, Needs Updating, Missing or Not Applicable."
        timeEstimate="6–10 minutes"
        outputs={['Compliance Summary', 'Action List']}
      >
        <ToolDisclaimer context="compliance" className="mb-8" />

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-sm text-slate-400">Loading checklist…</div>}>
          <ChecklistEngine
            toolName="contractor-compliance-check"
            sections={SECTIONS}
            mode="quad"
            disclaimerContext="compliance"
          />
        </Suspense>

        <ToolCrossLinks heading="Related Resources" links={CROSS_LINKS} />
      </ToolShell>
      <Footer />
    </>
  );
}
