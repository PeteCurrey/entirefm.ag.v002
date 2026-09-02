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

export const metadata: Metadata = generateRouteMetadata('/contractor-tools/contractor-document-checklist', {
  title: 'Contractor Document Checklist — What to Keep Current | EntireFM',
  description:
    'A practical mobile-friendly document checklist for UK contractors covering insurance, qualifications, RAMS, COSHH, certifications and site evidence. Distinguishes legal duties from best practice.',
});

const SECTIONS: ChecklistSection[] = [
  {
    id: 'company-documents',
    title: 'Company & Business Documents',
    subtitle: 'Core trading and legal identity records required during onboarding and procurement.',
    items: [
      {
        id: 'cd-incorporation',
        label: 'Certificate of Incorporation / Companies House Record',
        detail: 'What: Verification of registered company status, company number, and registered address.\nWhy: Proves corporate identity and active trading status.\nWhen: Updated upon registered office or corporate structure change.\nStatus: Legally required for limited companies (sole traders exempt).',
        allowNotApplicable: true,
        authorityLink: { label: 'Companies House Registry', href: 'https://www.gov.uk/get-information-about-a-company' },
      },
      {
        id: 'cd-vat',
        label: 'VAT Registration Certificate',
        detail: 'What: Official HMRC VAT certificate with 9-digit VAT number.\nWhy: Required for commercial billing, invoice validity, and tax compliance.\nWhen: Re-issued if trading name or entity details change.\nStatus: Legally required if annual turnover exceeds the statutory VAT threshold (£90k).',
        allowNotApplicable: true,
        authorityLink: { label: 'GOV.UK: VAT Registration', href: 'https://www.gov.uk/vat-registration' },
      },
      {
        id: 'cd-bank-proof',
        label: 'Business Bank Account Verification Letter / Header',
        detail: 'What: Bank confirmation letter or redacted statement showing account name, sort code, and account number.\nWhy: Required to set up automated BACS/Faster Payments and satisfy anti-money laundering (AML) checks.\nWhen: Annually or when banking arrangements change.\nStatus: Commonly requested by FM clients.',
      },
    ],
  },
  {
    id: 'insurance-policies',
    title: 'Insurance Policies',
    subtitle: 'Statutory and commercial indemnities to cover workplace liabilities.',
    items: [
      {
        id: 'ins-pl-schedule',
        label: 'Public Liability Insurance Certificate (£5M / £10M)',
        detail: 'What: Certificate of indemnity covering third-party bodily injury and property damage.\nWhy: Protects building occupants, clients, and facilities from accidental damage.\nWhen: Renewed annually — mandatory upload before expiry.\nStatus: Commonly requested by clients (standard FM threshold: £5M or £10M).',
      },
      {
        id: 'ins-el-schedule',
        label: 'Employers\' Liability Insurance Certificate (£5M+)',
        detail: 'What: Statutory insurance certificate covering employees, apprentices, and labour-only subcontractors.\nWhy: Legal requirement under Employers\' Liability (Compulsory Insurance) Act 1969.\nWhen: Renewed annually — must be displayed or made digitally accessible to all staff.\nStatus: Legally required for all employers with staff.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: Employers\' Liability Act', href: 'https://www.hse.gov.uk/pubns/hse40.htm' },
      },
      {
        id: 'ins-pi-schedule',
        label: 'Professional Indemnity Insurance (where applicable)',
        detail: 'What: Insurance covering financial loss resulting from professional advice, design, or engineering certification.\nWhy: Required for design & build, engineering audits, and consulting scopes.\nWhen: Renewed annually with retroactive date maintained.\nStatus: Commonly requested for technical/design trades.',
        allowNotApplicable: true,
      },
      {
        id: 'ins-contractors-all-risk',
        label: 'Contractor\'s All Risks / Hired-in Plant Cover',
        detail: 'What: Cover for physical loss or damage to works in progress, own tools, and hired machinery.\nWhy: Required when operating specialist access equipment or high-value plant on site.\nWhen: Renewed annually or arranged per high-value contract.\nStatus: Good practice / contract-specific requirement.',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'competence-training',
    title: 'Competence & Training Records',
    subtitle: 'Proof of individual skill, regulatory licensing, and safety awareness.',
    items: [
      {
        id: 'comp-cscs-cards',
        label: 'CSCS / SKILLcard / ECS / JIB Industry Skill Cards',
        detail: 'What: Official industry competence smartcards verifying NVQ/SVQ qualifications and H&S testing.\nWhy: Proves identity, role competence, and basic site safety knowledge.\nWhen: Valid 5 years — must be renewed following CITB Health, Safety & Environment test.\nStatus: Commonly requested across UK commercial sites.',
        authorityLink: { label: 'CSCS Scheme', href: 'https://www.cscs.uk.com/' },
      },
      {
        id: 'comp-ssip-cert',
        label: 'SSIP Health & Safety Accreditation Certificate',
        detail: 'What: Certificate from a Safety Schemes in Procurement member (e.g. CHAS, SafeContractor, Constructionline, Acclaim).\nWhy: Pre-qualifies core H&S management systems against CDM 2015 Core Criteria.\nWhen: Renewed annually following third-party audit.\nStatus: Commonly requested by FM managing agents.',
        allowNotApplicable: true,
        authorityLink: { label: 'SSIP Forum', href: 'https://www.ssip.org.uk' },
      },
      {
        id: 'comp-training-matrix',
        label: 'Workforce Training & Refresher Matrix',
        detail: 'What: Central log tracking Asbestos Awareness (Cat A), Manual Handling, Working at Height, and First Aid expiry dates.\nWhy: Demonstrates systematic training management and prevents expired site certifications.\nWhen: Continuously maintained; audited quarterly.\nStatus: Good practice / mandatory for Tier 1 contractors.',
      },
    ],
  },
  {
    id: 'health-safety-policies',
    title: 'Health & Safety Governance',
    subtitle: 'Statutory policies, risk arrangements, and safe operating standards.',
    items: [
      {
        id: 'hs-policy-statement',
        label: 'Written Health & Safety Policy Statement & Arrangements',
        detail: 'What: Policy statement signed by Managing Director detailing safety responsibilities and procedures.\nWhy: Legal requirement under Section 2(3) Health and Safety at Work etc. Act 1974.\nWhen: Reviewed and re-signed annually or upon significant operational changes.\nStatus: Legally required for businesses with 5+ employees; good practice for all.',
        authorityLink: { label: 'HSE: Writing a Policy', href: 'https://www.hse.gov.uk/simple-health-safety/write-a-health-and-safety-policy.htm' },
      },
      {
        id: 'hs-accident-log',
        label: 'Accident Book & RIDDOR Reporting Procedure',
        detail: 'What: Log meeting Social Security (Claims and Payments) Regulations 1979 + clear RIDDOR reporting pathway.\nWhy: Records workplace injuries, diseases, and dangerous occurrences.\nWhen: Entries made immediately following incidents; statutory records retained for 3 years.\nStatus: Legally required.',
        authorityLink: { label: 'HSE: RIDDOR Reporting', href: 'https://www.hse.gov.uk/riddor/' },
      },
    ],
  },
  {
    id: 'rams-suite',
    title: 'RAMS Suite (Risk Assessments & Method Statements)',
    subtitle: 'Site-specific operational safety protocols and safe systems of work.',
    items: [
      {
        id: 'rams-job-specific',
        label: 'Site-Specific Risk Assessment & Method Statement (RAMS)',
        detail: 'What: Documented hazard evaluation and step-by-step safe sequence of work for the specific attendance.\nWhy: Required by Regulation 3 of Management of Health and Safety at Work Regs 1999 and CDM 2015.\nWhen: Created or tailored prior to every commercial site mobilisation.\nStatus: Legally required for all non-trivial work activities.',
        authorityLink: { label: 'HSE: Managing Risk', href: 'https://www.hse.gov.uk/simple-health-safety/risk/index.htm' },
      },
      {
        id: 'rams-briefing-sheet',
        label: 'Toolbox Talk / Operative Sign-off Sheet',
        detail: 'What: Signed register proving operatives read, understood, and agreed to work under the approved RAMS.\nWhy: Demonstrates effective communication of risks to the workforce.\nWhen: Signed at the point of work on day one before starting tasks.\nStatus: Good practice / mandatory audit requirement.',
      },
    ],
  },
  {
    id: 'coshh-records',
    title: 'COSHH & Hazardous Substance Records',
    subtitle: 'Documentation for chemical handling, exposure control, and disposal.',
    items: [
      {
        id: 'coshh-sds-files',
        label: 'Manufacturer Safety Data Sheets (16-point SDS)',
        detail: 'What: Current SDS files for all chemical compounds, lubricants, adhesives, and solvents brought to site.\nWhy: Contains essential first aid, PPE, storage, and spill containment protocols.\nWhen: Replaced whenever suppliers issue revised SDS (must not exceed 3-year age).\nStatus: Legally required under COSHH Regulations 2002.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: COSHH Basics', href: 'https://www.hse.gov.uk/coshh/basics/assessment.htm' },
      },
      {
        id: 'coshh-written-assessment',
        label: 'Task-Specific COSHH Assessments',
        detail: 'What: Written assessment documenting how the substance is applied, exposure duration, ventilation, and PPE.\nWhy: SDS alone is not an assessment; the assessment evaluates real-world site use.\nWhen: Prior to chemical deployment; reviewed if process or substance changes.\nStatus: Legally required when using hazardous substances.',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'trade-licensing',
    title: 'Trade Certifications & Statutory Licences',
    subtitle: 'Regulatory accreditation specific to high-risk mechanical, electrical, and gas disciplines.',
    items: [
      {
        id: 'lic-gas-safe',
        label: 'Gas Safe Register Business & Engineer ID Cards (Gas trades)',
        detail: 'What: Official registration certificate and individual operative licence cards with relevant commercial categories.\nWhy: Legal requirement under Gas Safety (Installation and Use) Regulations 1998.\nWhen: Renewed annually.\nStatus: Legally required for all gas work.',
        allowNotApplicable: true,
        authorityLink: { label: 'Gas Safe Register', href: 'https://www.gassaferegister.co.uk/' },
      },
      {
        id: 'lic-niceic-napit',
        label: 'NICEIC / NAPIT / ECA Electrical Certification (Electrical trades)',
        detail: 'What: Approved Contractor scheme certificate verifying compliance with BS 7671.\nWhy: Authorises self-certification and commercial periodic inspection (EICR).\nWhen: Annual technical assessment and renewal.\nStatus: Commonly requested / essential for commercial electrical works.',
        allowNotApplicable: true,
      },
      {
        id: 'lic-refcom-fgas',
        label: 'REFCOM Company F-Gas Certificate & City & Guilds 2079 (HVAC)',
        detail: 'What: Company F-Gas certificate and technician Category 1/2 refrigerant handling licences.\nWhy: Mandatory under Fluorinated Greenhouse Gases Regulations.\nWhen: 5-year qualification renewal; annual company registration.\nStatus: Legally required for working on stationary refrigeration/AC systems.',
        allowNotApplicable: true,
        authorityLink: { label: 'REFCOM Registry', href: 'https://www.refcom.org.uk/' },
      },
      {
        id: 'lic-waste-carrier',
        label: 'Environment Agency Waste Carrier Licence (Upper/Lower Tier)',
        detail: 'What: Registration certificate issued by the Environment Agency / SEPA / NRW.\nWhy: Legal requirement to transport trade waste, old plant, or packaging from customer sites.\nWhen: Valid 3 years (Upper Tier).\nStatus: Legally required for transporting commercial waste.',
        authorityLink: { label: 'GOV.UK: Waste Carrier Registration', href: 'https://www.gov.uk/register-as-a-waste-carrier-broker-dealer-scotland' },
      },
    ],
  },
  {
    id: 'site-job-evidence',
    title: 'Job Completion & Audit Evidence',
    subtitle: 'Field documentation required for sign-off, invoice clearance, and warranty compliance.',
    items: [
      {
        id: 'ev-timesheets',
        label: 'Signed Field Service Report / Digital Sign-off Record',
        detail: 'What: Work order summary detailing arrival/departure times, work completed, parts used, and client signature.\nWhy: Validates job delivery and triggers invoice processing without dispute.\nWhen: Completed at the conclusion of every site visit.\nStatus: Commonly requested by clients / commercial requirement.',
      },
      {
        id: 'ev-visual-proof',
        label: 'Pre & Post-Work Geo-Tagged Photographs',
        detail: 'What: Clear photographs documenting asset state before work, during maintenance, and clean completion.\nWhy: Indisputable proof of workmanship, asset tagging, and workspace reinstatement.\nWhen: Captured live during site attendance.\nStatus: Standard FM operating practice.',
      },
      {
        id: 'ev-statutory-certs',
        label: 'Completed Statutory Certificates (EICR, CP12, F-Gas Log)',
        detail: 'What: Formal statutory test certificates and logbook sheets delivered within SLA.\nWhy: Landlords and FM duty holders require immediate compliance records for statutory logbooks.\nWhen: Delivered within 24–48 hours of visit completion.\nStatus: Legally required / commercial contract requirement.',
        allowNotApplicable: true,
      },
    ],
  },
];

const CROSS_LINKS = [
  { title: 'Contractor Compliance Check', href: '/contractor-tools/contractor-compliance-check', badge: 'TOOL' },
  { title: 'Contractor Compliance Guide', href: '/contractor-resources/contractor-compliance', badge: 'GUIDE' },
  { title: 'RAMS Readiness Check', href: '/contractor-tools/rams-readiness-check', badge: 'TOOL' },
  { title: 'Job Readiness Check', href: '/contractor-tools/job-readiness-check', badge: 'TOOL' },
  { title: 'Contractor Onboarding Checklist', href: '/contractor-tools/contractor-onboarding-checklist', badge: 'TOOL' },
  { title: 'Contractor Portal Register', href: '/supplier-portal/register', badge: 'PORTAL' },
  { title: 'Contractor Tools Hub', href: '/contractor-tools', badge: 'HUB' },
];

export default function ContractorDocumentChecklistPage() {
  return (
    <>
      <Header />
      <ToolShell
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contractor Tools', url: '/contractor-tools' },
          { name: 'Contractor Document Checklist', url: '/contractor-tools/contractor-document-checklist' },
        ]}
        eyebrow="CONTRACTOR TOOLS / DOCUMENT AUDIT"
        title="Contractor Document Checklist"
        purpose="A comprehensive, mobile-ready audit checklist of company, insurance, competence, H&S, RAMS, COSHH, and trade licensing documents to keep current and verified for FM work."
        timeEstimate="4–6 minutes"
        outputs={['Document Readiness Score', 'Action List']}
      >
        <ToolDisclaimer context="document" className="mb-8" />

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-sm text-slate-400">Loading checklist…</div>}>
          <ChecklistEngine
            toolName="contractor-document-checklist"
            sections={SECTIONS}
            mode="quad"
            disclaimerContext="document"
          />
        </Suspense>

        <ToolCrossLinks heading="Related Resources" links={CROSS_LINKS} />
      </ToolShell>
      <Footer />
    </>
  );
}
