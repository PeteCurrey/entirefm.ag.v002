import type { LobbyHomepageCuration } from './types';

/**
 * THE LOBBY — HOMEPAGE CURATION CONFIGURATION
 * ============================================
 * Explicit editorial assignment for The Lobby homepage slots.
 *
 * MONDAY MORNING EDITING:
 * Change the slug string for any slot to rotate the homepage feature immediately,
 * without modifying React components or layout templates.
 */
export const LOBBY_HOMEPAGE_CURATION: LobbyHomepageCuration = {
  updatedAt: '2026-08-27',
  editionLabel: 'Edition 2026.35 · Daily Intelligence',

  // 1. Dominant "The Week That Matters" lead briefing
  leadStorySlug: 'building-safety-act-what-fm-teams-need-to-know-now',

  // 2. Secondary Compliance Watch module
  complianceWatchSlug: 'mandatory-digital-occurrence-reporting-duty-holder-rules',

  // 3. The Engineer's Note technical insight
  engineersNoteSlug: 'condenser-airflow-starvation-on-enclosed-rooftops',

  // 4. One Useful Thing practical asset CTA
  usefulThingSlug: 'fm-mobilisation-handover-audit-matrix',

  // 5. From The Field photography-led observation
  fromTheFieldSlug: 'rooftop-condenser-vibration-resonance-defect',

  // 6. Ask EntireFM Q&A feature
  askEntireFMSlug: 'mobilisation-handover-what-compliance-data-to-demand',

  // 7. Worth Attending curated event
  worthAttendingSlug: 'building-decarbonisation-hard-fm-summit-2026',

  // 8. Curated Toolkit highlighting existing tools
  featuredToolkitUrls: [
    '/tools/ppm-schedule-builder',
    '/tools/compliance-checker',
    '/tools/tender-brief',
  ],

  // 9. Active weekly knowledge question ID
  activeQuestionId: 'lq-2026-w35',

  // 10. Active industry pulse poll ID
  activePulseId: 'pulse-2026-08',
};
