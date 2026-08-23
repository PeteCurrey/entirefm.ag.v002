/**
-- ============================================================================
-- ENTIREFM LINKEDIN & SOCIAL DRAFT GENERATION ENGINE
-- ============================================================================
-- Generates substantive, professional B2B LinkedIn posts for published FM articles.
-- Strictly avoids emoji spam and generic marketing slogans.
-- Formats key takeaways, technical constraints, and direct article links.
-- ============================================================================
*/

import { SocialDistributionDraft } from './types';
import { dbQuery, isDbConfigured } from '@/server/db/client';
import { memoryStore } from './store';

export interface LinkedInDraftInput {
  title: string;
  slug: string;
  category: string;
  dek?: string;
  sections?: Array<{ heading?: string; body?: string; bullets?: string[] }>;
}

/**
 * Generates an authoritative, professional B2B LinkedIn draft for a published article
 */
export function generateLinkedInDraft(input: LinkedInDraftInput): SocialDistributionDraft {
  const url = `https://www.entirefm.com/post/${input.slug}`;
  let openingHook = '';
  const points: string[] = [];

  // Tailor angle based on topic
  if (input.slug.includes('predictive-maintenance')) {
    openingHook = `Predictive maintenance does not make planned preventative maintenance obsolete.\n\nThe real operational question is which building assets justify condition-based monitoring, and which remain strictly governed by UK statutory inspection law.`;
    points.push(`Statutory barriers: LOLER 1998, ACOP L8, and BS 7671 require physical competent-person sign-off that an IoT sensor cannot legally provide.`);
    points.push(`Criticality triage: Vibration and thermal telemetry deliver high ROI on primary chillers and pumps, while standard fabric runs on scheduled PPM.`);
    points.push(`Hybrid strategy: Combining SFG20 baseline schedules with targeted telemetry eliminates both catastrophic failure and over-servicing waste.`);
  } else if (input.slug.includes('can-ai-run-an-fm-helpdesk')) {
    openingHook = `Can AI run an FM helpdesk?\n\nNatural language triage can extract floor numbers and deduplicate identical fault calls within seconds. But human duty managers remain essential when building safety is on the line.`;
    points.push(`Intelligent deduplication: Grouping 20 simultaneous occupant temperature complaints into a single parent work order.`);
    points.push(`Emergency risk recognition: An occupant reporting a "slight hissing noise in the basement" requires an experienced coordinator to recognize potential steam/gas hazards.`);
    points.push(`Trade matching: Filtering dispatch options by Gas Safe endorsements and electrical certifications before issuing job sheets.`);
  } else if (input.slug.includes('asset-data-quality')) {
    openingHook = `Why bad asset data breaks facilities management AI strategies.\n\nEvery major estate technology initiative begins with high ambitions, but most stall because legacy CAFM asset registers are dirty, incomplete, or broken.`;
    points.push(`Spatial hierarchy: Assets logged without floor, room, or zone mapping prevent automated contractor routing.`);
    points.push(`Vague descriptions: Equipment logged as "Pump 1" without duty ratings or serial codes produces high algorithmic error rates.`);
    points.push(`Data hygiene first: Barcode tagging, parent-child plant relationships, and Uniclass/SFG20 naming standards are prerequisites for AI.`);
  } else if (input.slug.includes('ppm-schedule')) {
    openingHook = `What should be included in a commercial Planned Preventative Maintenance (PPM) schedule?\n\nA complete maintenance matrix balances statutory life-safety tasks with manufacturer engineering guidelines and commercial asset criticality.`;
    points.push(`Statutory life-safety: Weekly fire alarms, monthly emergency lighting tests, and 6-monthly LOLER lift examinations.`);
    points.push(`M&E plant care: Quarterly HVAC filter changes, annual boiler efficiency tuning, and 5-yearly fixed wire EICR inspections.`);
    points.push(`Fabric protection: Semi-annual gutter clearances and roof membrane audits preventing hidden water ingress.`);
  } else {
    // General high-quality template
    openingHook = `${input.title}.\n\n${input.dek || 'A practical analysis of facilities management operations, compliance standards, and engineering delivery across UK commercial property.'}`;
    if (input.sections && input.sections.length > 0) {
      for (const sec of input.sections.slice(0, 3)) {
        if (sec.heading) points.push(`${sec.heading}: ${sec.body ? sec.body.slice(0, 120) + '...' : ''}`);
      }
    }
    if (points.length === 0) {
      points.push('Asset reliability requires verified condition surveys rather than generic national templates.');
      points.push('Statutory compliance documentation must remain 100% auditable with transparent digital certification.');
      points.push('Consolidated hard & soft FM under single accountability prevents service delivery gaps.');
    }
  }

  const postCopy = `${openingHook}

Key considerations for estates teams:
${points.map((p) => `• ${p}`).join('\n')}

Read the full technical analysis:
${url}?utm_source=linkedin&utm_medium=social&utm_campaign=editorial-distribution

#FacilitiesManagement #BuildingMaintenance #PPM #PropertyManagement #CommercialProperty`;

  const draft: SocialDistributionDraft = {
    id: `soc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sourcePath: `/post/${input.slug}`,
    sourceTitle: input.title,
    channel: 'LINKEDIN',
    postCopy,
    keyPoints: points,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.socialDrafts.set(draft.id, draft);

  if (isDbConfigured()) {
    dbQuery('social_distribution_drafts', {
      method: 'POST',
      body: {
        id: draft.id,
        source_path: draft.sourcePath,
        source_title: draft.sourceTitle,
        channel: draft.channel,
        post_copy: draft.postCopy,
        key_points: draft.keyPoints,
        status: draft.status,
      },
    }).catch(() => {});
  }

  return draft;
}
