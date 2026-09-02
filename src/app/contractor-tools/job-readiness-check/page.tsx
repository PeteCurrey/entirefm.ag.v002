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

export const metadata: Metadata = generateRouteMetadata('/contractor-tools/job-readiness-check', {
  title: 'Job Readiness Check — Pre-Attendance Checklist for FM Contractors | EntireFM',
  description:
    'A practical pre-attendance, on-site and completion checklist for UK contractors covering RAMS review, access, evidence capture and sign-off. Aligned with professional FM work standards.',
});

const SECTIONS: ChecklistSection[] = [
  {
    id: 'before-you-attend',
    title: 'Before You Attend',
    subtitle: 'Preparation before leaving for site. Complete these steps before travel.',
    items: [
      {
        id: 'bya-work-order',
        label: 'Work order or job instruction has been reviewed',
        detail: 'Read the full work order, job pack, or instruction. Note the job reference number, required task, and any specific instructions or restrictions.',
      },
      {
        id: 'bya-scope',
        label: 'Scope of work is understood',
        detail: 'You should be clear on what you are being asked to do and what you are not. If the scope is unclear, clarify before attending.',
      },
      {
        id: 'bya-location',
        label: 'Site address and specific work location are confirmed',
        detail: 'Confirm the full site address, the specific area or floor you need to access, and the site postcode for navigation.',
      },
      {
        id: 'bya-access',
        label: 'Access arrangements are understood',
        detail: 'How you gain access to the site — main entrance, trade entrance, reception sign-in, key safe, access code. Who to call if access is a problem.',
      },
      {
        id: 'bya-contact',
        label: 'Site contact information is available',
        detail: 'Name and mobile number of the site contact or FM helpdesk. Backup contact if primary is unavailable.',
      },
      {
        id: 'bya-rams',
        label: 'RAMS have been reviewed and are available for the job',
        detail: 'Relevant RAMS should be reviewed before attending, not on arrival. Operatives should be briefed on the key hazards and controls. Carry a copy on site.',
      },
      {
        id: 'bya-qualifications',
        label: 'Relevant qualifications and authorisations are confirmed for the work',
        detail: 'Check you have the right qualifications and authorisations for the specific task — not just your general trade.',
      },
      {
        id: 'bya-equipment',
        label: 'Required tools and equipment are prepared',
        detail: 'All tools, equipment, testing instruments, and specialist kit required for the job.',
      },
      {
        id: 'bya-materials',
        label: 'Parts and materials have been prepared or confirmed',
        allowNotApplicable: true,
        detail: 'Where specific parts or materials are needed, confirm they are sourced and available before travel.',
      },
      {
        id: 'bya-ppe',
        label: 'Required PPE has been identified and is available',
        detail: 'PPE appropriate to the task and site — not just generic PPE. Check site-specific requirements.',
      },
    ],
  },
  {
    id: 'on-site',
    title: 'On Site',
    subtitle: 'On arrival and during the work. Carry out these checks at the start of each site visit.',
    items: [
      {
        id: 'os-signin',
        label: 'Site sign-in and induction completed where required',
        detail: 'Sign in at reception or via the site\'s contractor management system. Complete site induction if required for first visits or high-risk work.',
        allowNotApplicable: true,
      },
      {
        id: 'os-point-of-work',
        label: 'Point-of-work assessment has been carried out',
        detail: 'Before starting work, take a moment to assess the immediate working environment. Look for hazards that weren\'t apparent from the job description — other trades, changed conditions, nearby services, obstacles.',
      },
      {
        id: 'os-scope-confirmed',
        label: 'Scope of work confirmed with site contact or client representative',
        detail: 'Confirm the scope before starting work, especially if circumstances may have changed since the job was raised.',
        allowNotApplicable: true,
      },
      {
        id: 'os-condition-before',
        label: 'Existing condition of the work area recorded where appropriate',
        detail: 'Pre-work photographs of the work area, existing damage, or relevant conditions. This protects both parties in the event of dispute.',
        allowNotApplicable: true,
      },
      {
        id: 'os-photos-during',
        label: 'Photographs of the work captured during progress where appropriate',
        detail: 'Progress photos demonstrating the work being carried out. Particularly important for concealed work that will not be visible after completion.',
        allowNotApplicable: true,
      },
      {
        id: 'os-additional-risks',
        label: 'Any additional risks, hazards or issues encountered are recorded',
        detail: 'If conditions differ from what was expected, or if new hazards are identified, record them. Report to site contact and consider whether work should proceed.',
      },
    ],
  },
  {
    id: 'before-leaving',
    title: 'Before Leaving Site',
    subtitle: 'Completion checks before leaving. Do not leave site without completing these steps.',
    items: [
      {
        id: 'bl-work-complete',
        label: 'Work has been completed to the required standard',
        detail: 'Check your own work before reporting completion. Test where applicable. Ensure the work meets the requirements of the job and any applicable standards.',
      },
      {
        id: 'bl-outstanding',
        label: 'Any outstanding or unresolved works have been recorded and reported',
        detail: 'If work cannot be completed — due to access, parts, conditions, or scope — record what was done, what is outstanding, and why. Report to the FM helpdesk or client.',
        allowNotApplicable: true,
      },
      {
        id: 'bl-materials-used',
        label: 'Parts and materials used have been recorded where required',
        detail: 'Record materials, components, or refrigerant used. Required for invoicing, warranty tracking, and F-Gas logbooks.',
        allowNotApplicable: true,
      },
      {
        id: 'bl-photos-after',
        label: 'Completion photographs have been captured',
        detail: 'After-work photographs demonstrating the completed state of the work area. Essential for FM evidence requirements.',
      },
      {
        id: 'bl-sign-off',
        label: 'Client or site representative sign-off obtained where required',
        detail: 'Many FM clients require a site representative signature on the job sheet or digital record before you leave. Check whether this is required.',
        allowNotApplicable: true,
      },
      {
        id: 'bl-notes-submitted',
        label: 'Completion notes and records submitted through the relevant system',
        detail: 'Whether paper job sheet, email, or digital platform — completion information should be submitted promptly. Delayed submissions cause payment delays and compliance issues.',
      },
      {
        id: 'bl-site-tidy',
        label: 'Work area has been left clean, tidy and safe',
        detail: 'Remove all waste, tools, and materials. Ensure access routes are clear. Leave the site in a condition that does not create risks for building occupants or other trades.',
      },
    ],
  },
];

const CROSS_LINKS = [
  { title: 'RAMS Readiness Check', href: '/contractor-tools/rams-readiness-check', badge: 'TOOL' },
  { title: 'COSHH Readiness Check', href: '/contractor-tools/coshh-readiness-check', badge: 'TOOL' },
  { title: 'Contractor Document Checklist', href: '/contractor-tools/contractor-document-checklist', badge: 'TOOL' },
  { title: 'RAMS Guide', href: '/contractor-resources/rams', badge: 'GUIDE' },
  { title: 'Risk Assessment Guide', href: '/contractor-resources/risk-assessment', badge: 'GUIDE' },
  { title: 'Inspection Checklists', href: '/contractor-resources/inspection-checklists', badge: 'CHECKLISTS' },
  { title: 'Contractor Tools Hub', href: '/contractor-tools', badge: 'HUB' },
];

export default function JobReadinessCheckPage() {
  return (
    <>
      <Header solid />
      <ToolShell
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contractor Tools', url: '/contractor-tools' },
          { name: 'Job Readiness Check', url: '/contractor-tools/job-readiness-check' },
        ]}
        eyebrow="CONTRACTOR TOOLS / JOB PREP"
        title="Job Readiness Check"
        purpose="A practical three-stage checklist — before attending, on site, and before leaving — covering the people, documentation, equipment, evidence and sign-off requirements of professional FM work."
        timeEstimate="3–5 minutes"
        outputs={['Readiness Score', 'Action List']}
      >
        <ToolDisclaimer context="job" className="mb-8" />

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-sm text-slate-400">Loading checklist…</div>}>
          <ChecklistEngine
            toolName="job-readiness-check"
            sections={SECTIONS}
            mode="quad"
            disclaimerContext="job"
          />
        </Suspense>

        <ToolCrossLinks heading="Related Resources" links={CROSS_LINKS} />
      </ToolShell>
      <Footer />
    </>
  );
}
