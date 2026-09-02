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

export const metadata: Metadata = generateRouteMetadata('/contractor-tools/coshh-readiness-check', {
  title: 'COSHH Readiness Check — Preparation Checklist for UK Contractors | EntireFM',
  description:
    'Check whether your preparation covers the key information needed when hazardous substances are involved in your work. A practical COSHH preparation aid for UK contractors.',
});

const SECTIONS: ChecklistSection[] = [
  {
    id: 'substance-identification',
    title: 'Substance Identification',
    subtitle: 'Identifying the substances involved in the work and obtaining the relevant information.',
    items: [
      {
        id: 'si-substance-known',
        label: 'The substance or product has been identified',
        detail: 'The specific substances that will be used, generated, or disturbed during the work should be identified. This includes cleaning products, solvents, adhesives, refrigerants, lubricants, and other chemicals.',
      },
      {
        id: 'si-sds-available',
        label: 'A Safety Data Sheet (SDS) is available for each substance',
        detail: 'Safety Data Sheets (formerly MSDS) must be provided by the supplier for hazardous substances. They contain essential information on hazards, safe handling, storage, and emergency procedures. Check they are current (within 3 years for re-issued sheets).',
        authorityLink: { label: 'HSE: Safety Data Sheets', href: 'https://www.hse.gov.uk/coshh/basics/damagehealth.htm' },
      },
      {
        id: 'si-intended-use',
        label: 'The intended use of each substance is understood',
        detail: 'How the substance will be used (e.g. applied by brush, sprayed, wiped), in what quantities, and in what environmental conditions. This affects the level of risk.',
      },
      {
        id: 'si-existing-substances',
        label: 'Existing substances that may be disturbed have been considered',
        detail: 'Some work disturbs existing substances — for example, cutting or drilling near asbestos-containing materials, disturbing lead paint, or working on plant containing refrigerants.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: Asbestos guidance', href: 'https://www.hse.gov.uk/asbestos/' },
      },
    ],
  },
  {
    id: 'risk-assessment',
    title: 'Risk & Exposure',
    subtitle: 'Understanding how people may be exposed and whether that exposure is adequately controlled.',
    items: [
      {
        id: 'ra-exposure-routes',
        label: 'Exposure routes have been considered',
        detail: 'Exposure can occur through inhalation, skin contact, ingestion, or eye contact. Different substances present different exposure risks depending on their form (liquid, vapour, dust, fume) and the work activity.',
      },
      {
        id: 'ra-people-exposed',
        label: 'The people who may be exposed have been identified',
        detail: 'This includes operatives carrying out the work, other workers in the vicinity, and building occupants or visitors. Higher-risk groups (e.g. pregnant workers, people with respiratory conditions) should be specifically considered.',
      },
      {
        id: 'ra-duration',
        label: 'The likely duration and frequency of exposure have been considered',
        detail: 'Short-duration, occasional exposure carries different risk from extended or repeated exposure. The pattern of use affects whether adequate control has been achieved.',
      },
      {
        id: 'ra-wels',
        label: 'Workplace Exposure Limits (WELs) have been considered where relevant',
        detail: 'WELs are set by the HSE for specific substances. If a substance has a WEL, exposure must not exceed it. Obtaining competent advice may be necessary if there is uncertainty about exposure levels.',
        allowNotApplicable: true,
        authorityLink: { label: 'HSE: EH40 Workplace exposure limits', href: 'https://www.hse.gov.uk/pubns/priced/eh40.pdf' },
      },
    ],
  },
  {
    id: 'controls',
    title: 'Control Measures',
    subtitle: 'The controls intended to prevent or adequately control exposure.',
    items: [
      {
        id: 'ctrl-hierarchy',
        label: 'Control measures follow the hierarchy of control',
        detail: 'Controls should be considered in order: eliminate the substance, substitute with a less hazardous alternative, enclose or extract, implement administrative controls, then PPE. PPE alone is generally the least effective control.',
        authorityLink: { label: 'HSE: COSHH hierarchy of controls', href: 'https://www.hse.gov.uk/coshh/basics/assessment.htm' },
      },
      {
        id: 'ctrl-ventilation',
        label: 'Ventilation requirements have been considered',
        detail: 'Adequate ventilation reduces inhalation risk. Natural ventilation may be sufficient for some activities; others require local exhaust ventilation (LEV) or respiratory protective equipment.',
        allowNotApplicable: true,
      },
      {
        id: 'ctrl-ppe',
        label: 'Required PPE has been identified and is available',
        detail: 'PPE requirements should be derived from the SDS and the specific work conditions — not assumed. The SDS Section 8 identifies appropriate PPE. Ensure PPE is compatible with the substance and the task.',
      },
      {
        id: 'ctrl-storage',
        label: 'Storage requirements have been considered',
        detail: 'Substances should be stored according to SDS requirements — correct temperature, segregation from incompatible materials, ventilation, and security. Do not store substances in food or drink containers.',
      },
    ],
  },
  {
    id: 'emergency-disposal',
    title: 'Emergency Arrangements & Disposal',
    subtitle: 'Spill response, emergency procedures, and waste disposal.',
    items: [
      {
        id: 'em-spill',
        label: 'Spill and emergency arrangements are understood',
        detail: 'SDS Section 6 describes spill response procedures. Operatives should know what to do in the event of a spill, including containment, notification and clean-up requirements.',
      },
      {
        id: 'em-first-aid',
        label: 'First aid requirements for relevant substances are known',
        detail: 'SDS Section 4 describes first aid measures. Operatives should be aware of first aid actions relevant to the substances being used and know the nearest first aid provision.',
        authorityLink: { label: 'HSE: First aid at work', href: 'https://www.hse.gov.uk/firstaid/' },
      },
      {
        id: 'em-disposal',
        label: 'Disposal requirements have been considered',
        detail: 'Hazardous waste must be disposed of in accordance with the Environmental Protection Act 1990, Hazardous Waste Regulations, and any substance-specific requirements. SDS Section 13 covers disposal.',
        authorityLink: { label: 'GOV.UK: Dispose of hazardous waste', href: 'https://www.gov.uk/dispose-hazardous-waste' },
      },
      {
        id: 'em-site-requirements',
        label: 'Site-specific COSHH requirements have been checked with the client or site manager',
        detail: 'Some sites have specific restrictions on substances — for example, restrictions on solvent use in occupied buildings, F-Gas handling requirements, or restrictions on certain products near sensitive equipment.',
        allowNotApplicable: true,
      },
    ],
  },
];

const CROSS_LINKS = [
  { title: 'COSHH Assessment Guide', href: '/contractor-resources/coshh-assessment', badge: 'GUIDE' },
  { title: 'RAMS Guide', href: '/contractor-resources/rams', badge: 'GUIDE' },
  { title: 'Risk Assessment Guide', href: '/contractor-resources/risk-assessment', badge: 'GUIDE' },
  { title: 'RAMS Readiness Check', href: '/contractor-tools/rams-readiness-check', badge: 'TOOL' },
  { title: 'Contractor Compliance Check', href: '/contractor-tools/contractor-compliance-check', badge: 'TOOL' },
  { title: 'Contractor Tools Hub', href: '/contractor-tools', badge: 'HUB' },
];

export default function CoshhReadinessCheckPage() {
  return (
    <>
      <Header solid />
      <ToolShell
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contractor Tools', url: '/contractor-tools' },
          { name: 'COSHH Readiness Check', url: '/contractor-tools/coshh-readiness-check' },
        ]}
        eyebrow="CONTRACTOR TOOLS / COSHH"
        title="COSHH Readiness Check"
        purpose="Check whether your preparation covers the key information needed when hazardous substances are involved in your work. A practical preparation aid — not a replacement for a competent COSHH assessment."
        timeEstimate="4–6 minutes"
        outputs={['Readiness Score', 'Action List']}
      >
        <ToolDisclaimer context="coshh" className="mb-8" />

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-sm text-slate-400">Loading checklist…</div>}>
          <ChecklistEngine
            toolName="coshh-readiness-check"
            sections={SECTIONS}
            mode="quad"
            disclaimerContext="coshh"
          />
        </Suspense>

        <ToolCrossLinks heading="Related Resources" links={CROSS_LINKS} />
      </ToolShell>
      <Footer />
    </>
  );
}
