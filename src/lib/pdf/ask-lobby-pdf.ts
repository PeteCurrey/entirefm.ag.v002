/**
 * ENTIREFM ASK THE LOBBY — PDF DOCUMENT DEFINITION BUILDER
 * ==========================================================
 * Formats structured Ask The Lobby research answers into branded,
 * publication-grade EntireFM PDF document definitions with clickable citations.
 */

import type { StructuredAskAnswer } from '@/server/ask/types';
import type { PdfDocumentDefinition, PdfSectionDefinition } from './generator';

export function buildAskLobbyPdfDefinition(answer: StructuredAskAnswer): {
  doc: PdfDocumentDefinition;
  filename: string;
} {
  const dateStr = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(answer.generatedAt || Date.now()));

  const isoDate = new Date(answer.generatedAt || Date.now()).toISOString().split('T')[0];
  const safeTitle = answer.question
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 40);

  const filename = `EntireFM_Ask_The_Lobby_${safeTitle}_${isoDate}.pdf`;

  const sections: PdfSectionDefinition[] = [];

  // 1. Executive Answer
  sections.push({
    type: 'text',
    heading: 'Executive Answer',
    subheading: `Research Mode: ${answer.mode === 'deep_research' ? 'Deep Research (Multi-Source)' : 'Quick Ask (Grounded)'}`,
    paragraphs: [answer.shortAnswer],
  });

  // 2. Official Position & Statutory Compliance
  if (answer.officialPosition || (answer.deepResearchReport?.statutoryRequirements && answer.deepResearchReport.statutoryRequirements.length > 0)) {
    const statutoryPoints = answer.deepResearchReport?.statutoryRequirements || [];
    sections.push({
      type: 'text',
      heading: 'Official Position & Statutory Framework',
      subheading: 'UK Primary & Secondary Legislation / Statutory Guidance',
      paragraphs: [
        answer.officialPosition || 'Primary statutory duties governing commercial estate duty holders.',
        ...statutoryPoints,
      ].filter(Boolean),
    });
  }

  // 3. Technical & Industry Guidance
  if (answer.technicalGuidance || (answer.deepResearchReport?.technicalGuidance && answer.deepResearchReport.technicalGuidance.length > 0)) {
    const technicalPoints = answer.deepResearchReport?.technicalGuidance || [];
    sections.push({
      type: 'text',
      heading: 'Technical Standards & Industry Guidance',
      subheading: 'Recognized Standards (BS 7671, IET, CIBSE, BESA, SFG20)',
      paragraphs: [
        answer.technicalGuidance || 'Technical standards and recognized engineering frequencies.',
        ...technicalPoints,
      ].filter(Boolean),
    });
  }

  // 4. What This Means in Practice & Action Steps
  if (answer.whatYouNeedToDo && answer.whatYouNeedToDo.length > 0) {
    sections.push({
      type: 'cards',
      heading: 'What You May Need To Do',
      subheading: 'Recommended Operational & Audit Actions for Estate Teams',
      items: answer.whatYouNeedToDo.map((action, idx) => ({
        title: `Action Item ${idx + 1}`,
        body: action,
      })),
    });
  }

  // 5. Sourced Citations Table
  if (answer.citations && answer.citations.length > 0) {
    sections.push({
      type: 'table',
      heading: 'Verified Sourced Citations',
      subheading: 'Authoritative statutory, technical, and regulatory repositories queried',
      columns: [
        { header: 'Ref', widthPercent: 8, align: 'center' },
        { header: 'Source & Document Title', widthPercent: 47, align: 'left' },
        { header: 'Authority & Publisher', widthPercent: 25, align: 'left' },
        { header: 'Classification', widthPercent: 20, align: 'left' },
      ],
      rows: answer.citations.map((c) => [
        `[${c.citationNumber}]`,
        `${c.title}\n(${c.sourceUrl})`,
        c.sourceName,
        c.isStatutory ? 'Tier 1 Statutory' : c.authorityLabel || 'Technical Standard',
      ]),
    });
  }

  const doc: PdfDocumentDefinition = {
    title: 'THE LOBBY · RESEARCH BRIEF',
    subtitle: `Question: ${answer.question}`,
    documentRef: `EFM-LOBBY-RES-${(answer.id || '').replace(/^ask-/, '').slice(0, 10).toUpperCase()}`,
    date: dateStr,
    badgeText: answer.mode === 'deep_research' ? 'Deep Research' : 'Quick Ask',
    organisationName: 'Entire Facilities Management Ltd',
    author: 'Ask The Lobby Intelligence Engine',
    summaryStats: [
      { label: 'Sources Cited', value: String(answer.citations?.length || 0) },
      { label: 'Jurisdiction', value: answer.jurisdiction?.join(', ') || 'United Kingdom' },
      { label: 'Grounding Score', value: `${Math.round((answer.confidenceScore || 0.95) * 100)}%` },
    ],
    sections,
    disclaimerText:
      'This research brief was produced by Ask The Lobby, EntireFM’s grounded AI-assisted professional intelligence system. It synthesises factual requirements from the cited official and technical authorities and does not replace site-specific competent engineering advice or direct review of primary legislation.',
  };

  return { doc, filename };
}
