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

export const metadata: Metadata = generateRouteMetadata('/contractor-tools/rams-readiness-check', {
  title: 'RAMS Readiness Check — Preparation Checklist for UK Contractors | EntireFM',
  description:
    'Check whether your RAMS preparation covers the areas professional FM clients typically expect. A practical readiness aid for UK contractors, not a legal compliance certificate.',
});

const SECTIONS: ChecklistSection[] = [
  {
    id: 'project-information',
    title: 'Project Information',
    subtitle: 'Core project details that should be established before any RAMS are prepared.',
    items: [
      {
        id: 'pi-client-identified',
        label: 'Is the client / site identified?',
        detail: 'The client or site for whom the work is being carried out should be clearly identified in the RAMS. Generic RAMS that are not site-specific are commonly rejected by professional FM clients.',
      },
      {
        id: 'pi-scope-defined',
        label: 'Is the work scope clearly defined?',
        detail: 'The scope of work should describe what is being done, what is not being done, and any clear boundaries or exclusions. Vague scope descriptions increase the risk of misunderstanding on site.',
      },
      {
        id: 'pi-location-identified',
        label: 'Is the location identified?',
        detail: 'Site address, specific work area or areas, floor level, access route, and any relevant building or campus information.',
      },
      {
        id: 'pi-work-sequence',
        label: 'Is the planned work sequence documented?',
        detail: 'Professional RAMS typically describe the sequence of key work stages, not just a generic task description. This helps the client and site manager understand how work will proceed.',
      },
      {
        id: 'pi-dates',
        label: 'Are the planned dates or programme referenced?',
        detail: 'RAMS should reference when work is planned to take place, including any phasing or critical constraints.',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'people-competence',
    title: 'People & Competence',
    subtitle: 'Information about the people carrying out the work and their relevant qualifications.',
    items: [
      {
        id: 'pc-people-identified',
        label: 'Are the people carrying out the work identified?',
        detail: 'At a minimum, the responsible supervisor or lead engineer should be identified. Client-specific requirements may require named operatives.',
      },
      {
        id: 'pc-competencies',
        label: 'Are relevant competencies and qualifications confirmed?',
        detail: 'This may include trade qualifications (e.g. NVQ, City & Guilds), scheme registrations (e.g. NICEIC, Gas Safe, CHAS), manufacturer training, or specific authorisations relevant to the work.',
        authorityLink: { label: 'HSE guidance on competence', href: 'https://www.hse.gov.uk/construction/cdm/2015/competence.htm' },
      },
      {
        id: 'pc-supervision',
        label: 'Has supervision been considered?',
        detail: 'Supervision arrangements should be appropriate for the risk level and the competence of the people carrying out the work. Higher-risk activities typically require closer supervision.',
      },
      {
        id: 'pc-training-records',
        label: 'Are relevant training records available if required?',
        detail: 'Some clients will require sight of training records, certification or CSCS cards. It is good practice to have these available even if not always requested.',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'hazards-controls',
    title: 'Hazards & Controls',
    subtitle: 'Task-specific hazard identification and the controls intended to manage them.',
    items: [
      {
        id: 'hc-hazards-identified',
        label: 'Have task-specific hazards been identified?',
        detail: 'Hazards should be specific to the work being carried out — not a generic list copied from a template. Common hazards include working at height, live services, confined spaces, plant and equipment, and manual handling.',
        authorityLink: { label: 'HSE: Risk assessment', href: 'https://www.hse.gov.uk/simple-health-safety/risk/index.htm' },
      },
      {
        id: 'hc-controls',
        label: 'Have suitable control measures been considered?',
        detail: 'Control measures should follow the hierarchy of control: eliminate, substitute, engineering controls, administrative controls, PPE. Generic "wear PPE" is not a sufficient control measure on its own.',
      },
      {
        id: 'hc-site-hazards',
        label: 'Have relevant site hazards been considered?',
        detail: 'Site hazards may include existing services (electrical, gas, water), overhead obstructions, slipping/tripping hazards, proximity of other trades, building occupants, or restricted access.',
      },
      {
        id: 'hc-emergency',
        label: 'Has emergency planning been considered?',
        detail: 'This should include the nearest emergency exit, assembly point, first aid arrangements, and who to contact in an emergency. Site-specific emergency information should be sought before work starts.',
      },
      {
        id: 'hc-wah',
        label: 'If working at height is involved, has this been specifically addressed?',
        detail: 'Working at height is one of the most common causes of serious injuries in the UK. The Work at Height Regulations 2005 require that working at height is properly planned, appropriately supervised and carried out safely.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: Working at height', href: 'https://www.hse.gov.uk/work-at-height/index.htm' },
      },
    ],
  },
  {
    id: 'equipment-materials',
    title: 'Equipment & Materials',
    subtitle: 'Tools, plant, materials and any inspection or certification requirements.',
    items: [
      {
        id: 'em-equipment-identified',
        label: 'Is the required equipment identified?',
        detail: 'Tools, plant, and specialist equipment required for the work should be identified. This allows the site and client to understand what will be brought on site.',
      },
      {
        id: 'em-inspections',
        label: 'Are relevant equipment inspections or certifications available?',
        detail: 'Depending on the equipment type, relevant documentation may include LOLER thorough examination records, PAT test certificates, tool calibration records, or other certification.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: LOLER', href: 'https://www.hse.gov.uk/work-equipment-machinery/loler.htm' },
      },
      {
        id: 'em-coshh',
        label: 'Have hazardous substances or materials been considered?',
        detail: 'If hazardous substances will be used or disturbed (e.g. solvents, adhesives, refrigerants, asbestos-containing materials), COSHH considerations should be addressed. Asbestos requires specific pre-work checking.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: COSHH', href: 'https://www.hse.gov.uk/coshh/' },
      },
    ],
  },
  {
    id: 'site-controls',
    title: 'Site Controls',
    subtitle: 'Access, site rules, permits and restrictions that affect how work can be carried out.',
    items: [
      {
        id: 'sc-access',
        label: 'Is access and egress understood?',
        detail: 'How operatives enter and leave the site, which routes are available, and whether any areas are restricted or require escort.',
      },
      {
        id: 'sc-site-rules',
        label: 'Are site rules known?',
        detail: 'Most commercial and FM-managed sites have site rules covering PPE requirements, smoking, parking, behaviour standards, working hours, and site induction requirements.',
      },
      {
        id: 'sc-permits',
        label: 'Have permits or access restrictions been considered where applicable?',
        detail: 'Some work requires a formal Permit to Work (PTW) — for example, hot works, confined space entry, electrical isolation, or high-voltage work. Permits must be raised and authorised before work begins.',
        allowNotApplicable: true,
      },
      {
        id: 'sc-induction',
        label: 'Has site induction been arranged or accounted for?',
        detail: 'Many commercial FM clients require contractors to complete a site induction before work begins. This is particularly common for first-time site visits or higher-risk work.',
        allowNotApplicable: true,
      },
    ],
  },
  {
    id: 'evidence',
    title: 'Evidence & Sign-Off',
    subtitle: 'Photographic evidence, completion records and sign-off information.',
    items: [
      {
        id: 'ev-photos',
        label: 'Are photograph and evidence requirements understood?',
        detail: 'Professional FM clients commonly require before, during and after photographs for maintenance and reactive work. Understanding what evidence is required before work starts prevents missed opportunities.',
        allowNotApplicable: true,
      },
      {
        id: 'ev-completion',
        label: 'Is completion and sign-off information identified?',
        detail: 'Who accepts work on site, what completion documentation is required (e.g. job sheet, completion certificate, service report), and how these are submitted.',
      },
      {
        id: 'ev-rams-review',
        label: 'Have the RAMS been reviewed and understood by those carrying out the work?',
        detail: 'RAMS are only effective if the people carrying out the work have read and understood them. A briefing or toolbox talk record may be required by the client.',
      },
    ],
  },
];

const CROSS_LINKS = [
  { title: 'RAMS Guide', href: '/contractor-resources/rams', badge: 'GUIDE' },
  { title: 'RAMS Template', href: '/contractor-resources/rams-template', badge: 'TEMPLATE' },
  { title: 'Risk Assessment Guide', href: '/contractor-resources/risk-assessment', badge: 'GUIDE' },
  { title: 'Method Statement Guide', href: '/contractor-resources/method-statement', badge: 'GUIDE' },
  { title: 'Method Statement Template', href: '/contractor-resources/method-statement-template', badge: 'TEMPLATE' },
  { title: 'Contractor Compliance Guide', href: '/contractor-resources/contractor-compliance', badge: 'GUIDE' },
  { title: 'Contractor Compliance Check', href: '/contractor-tools/contractor-compliance-check', badge: 'TOOL' },
  { title: 'COSHH Assessment Guide', href: '/contractor-resources/coshh-assessment', badge: 'GUIDE' },
  { title: 'Contractor Tools Hub', href: '/contractor-tools', badge: 'HUB' },
];

export default function RamsReadinessCheckPage() {
  return (
    <>
      <Header solid />
      <ToolShell
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contractor Tools', url: '/contractor-tools' },
          { name: 'RAMS Readiness Check', url: '/contractor-tools/rams-readiness-check' },
        ]}
        eyebrow="CONTRACTOR TOOLS / RAMS"
        title="RAMS Readiness Check"
        purpose="Check whether your RAMS preparation covers the key areas a professional FM client is likely to expect before work starts. This is a practical preparation aid — not a legal compliance assessment."
        timeEstimate="5–8 minutes"
        outputs={['Readiness Score', 'Action List']}
      >
        <ToolDisclaimer context="rams" className="mb-8" />

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-sm text-slate-400">Loading checklist…</div>}>
          <ChecklistEngine
            toolName="rams-readiness-check"
            sections={SECTIONS}
            mode="quad"
            disclaimerContext="rams"
          />
        </Suspense>

        <ToolCrossLinks heading="Related Resources" links={CROSS_LINKS} />
      </ToolShell>
      <Footer />
    </>
  );
}
