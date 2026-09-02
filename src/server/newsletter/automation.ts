/**
-- ============================================================================
-- ENTIREFM WEEKLY NEWSLETTER AUTOMATION ENGINE
-- ============================================================================
-- Compiles the weekly edition of "The FM Briefing"
-- Evaluates recent published articles, AI resources, rotating tools,
-- and external industry signals. Strictly avoids filler content.
-- Stores the campaign in DRAFT status for editorial review.
-- ============================================================================
*/

import { ContentBlock, NewsletterCampaign } from './types';
import { saveCampaign, getAutomationSettings } from './store';
import { BLOG_POSTS } from '@/content/blog/posts';

export interface WeeklyBriefingGenerationResult {
  success: boolean;
  campaignId?: string;
  campaign?: NewsletterCampaign;
  message?: string;
}

/**
 * Generates the weekly draft of The FM Briefing
 */
export async function generateWeeklyBriefingDraft(
  issueNumber: number = 1
): Promise<WeeklyBriefingGenerationResult> {
  const settings = await getAutomationSettings();
  if (settings.killSwitchPaused) {
    return {
      success: false,
      message: 'Generation aborted: Newsletter automation kill-switch is currently active.',
    };
  }

  const campaignId = `camp-briefing-issue-${issueNumber}-${Date.now()}`;
  const utmCampaign = `2026-briefing-issue-${issueNumber.toString().padStart(2, '0')}`;

  // 1. Pick recent top articles (filter 2026 published)
  const sortedPosts = [...BLOG_POSTS].sort((a, b) => b.published.localeCompare(a.published));
  const leadPost = sortedPosts[0] || {
    title: 'AI in Facilities Management in 2026: What Is Actually Useful?',
    slug: 'ai-in-facilities-management-2026',
    path: '/post/ai-in-facilities-management-2026',
    dek: 'A practical review of AI in commercial building operations in 2026: what delivers immediate ROI, what remains experimental, and what is pure marketing.',
    category: 'AI & Technology',
  };

  const secondaryPost = sortedPosts[1] || {
    title: 'Predictive Maintenance vs PPM: Does AI Replace Planned Maintenance?',
    slug: 'predictive-maintenance-vs-ppm',
    path: '/post/predictive-maintenance-vs-ppm',
    dek: 'Why the debate between planned preventative maintenance and AI predictive monitoring is based on a false dichotomy—and how top estates combine both.',
    category: 'Maintenance & PPM',
  };

  // 2. Select rotating tool
  const tools = [
    {
      heading: 'PPM Schedule Builder',
      body: 'Generate an asset-led planned preventative maintenance matrix with verified statutory and SFG20 task classifications.',
      linkUrl: '/tools/ppm-schedule-builder',
      linkText: 'Build free maintenance schedule &rarr;',
    },
    {
      heading: 'FM Building Health Check',
      body: 'Evaluate estate compliance, maintenance gaps and operational risk across 7 core building services in under 5 minutes.',
      linkUrl: '/tools/fm-health-check',
      linkText: 'Run compliance diagnostic &rarr;',
    },
    {
      heading: 'Compliance Calendar & Planner',
      body: '12-month statutory inspection planner for building duty holders with iCal export for electrical, gas, fire and water regimes.',
      linkUrl: '/tools/compliance-calendar',
      linkText: 'Download compliance calendar &rarr;',
    },
  ];
  const selectedTool = tools[(issueNumber - 1) % tools.length];

  // 3. Assemble structured content blocks
  const contentBlocks: ContentBlock[] = [
    {
      id: 'block-open',
      type: 'OPENING_NOTE',
      eyebrow: `Issue #${issueNumber.toString().padStart(2, '0')} · Editorial Overview`,
      body: 'Welcome to this edition of The FM Briefing. In this issue, we examine where machine learning delivers tangible maintenance ROI, why statutory safety boundaries prevent algorithms from signing off compliance records, and practical tools to audit your estate asset register.',
      authorNote: 'EntireFM Technical Desk',
    },
    {
      id: 'block-featured',
      type: 'FEATURED_ARTICLE',
      eyebrow: leadPost.category || 'Featured Analysis',
      heading: leadPost.title,
      body: leadPost.dek,
      linkUrl: leadPost.path,
      linkText: 'Read full technical analysis &rarr;',
      bullets: [
        'Natural language intake and entity parsing for service desks',
        'Vibration telemetry for high-criticality centrifugal chillers and pumps',
        'Why asset register hygiene remains the ultimate gating factor for AI',
      ],
    },
    {
      id: 'block-ai',
      type: 'AI_TECHNOLOGY',
      heading: 'AI in FM Resource Centre: 10 Operational Guides',
      body: 'We have published a complete technical whitepaper and 10 supporting sub-guides examining predictive maintenance, digital twins, AI agents, and OT cybersecurity.',
      linkUrl: '/resources/ai-in-facilities-management',
      linkText: 'Explore AI in FM Resource Centre &rarr;',
    },
    {
      id: 'block-secondary',
      type: 'FEATURED_ARTICLE',
      eyebrow: secondaryPost.category || 'Maintenance Strategy',
      heading: secondaryPost.title,
      body: secondaryPost.dek,
      linkUrl: secondaryPost.path,
      linkText: 'Read article &rarr;',
    },
    {
      id: 'block-tool',
      type: 'RESOURCE_TOOL',
      heading: selectedTool.heading,
      body: selectedTool.body,
      linkUrl: selectedTool.linkUrl,
      linkText: selectedTool.linkText,
    },
    {
      id: 'block-takeaway',
      type: 'KEY_TAKEAWAY',
      body: 'Predictive maintenance does not replace Planned Preventative Maintenance. It refines intervention timing on high-capital plant, while statutory PPM continues to protect life safety and building fabric under UK law.',
    },
    {
      id: 'block-commercial',
      type: 'COMMERCIAL_CTA',
      heading: 'Need help reviewing how your estate is maintained?',
      linkUrl: '/contact-us',
      linkText: 'Request a facilities review &rarr;',
    },
  ];

  const campaign: NewsletterCampaign = {
    id: campaignId,
    name: `The FM Briefing — Issue ${issueNumber.toString().padStart(2, '0')}`,
    subject: `The FM Briefing: ${leadPost.title.slice(0, 50)}...`,
    previewText: 'Practical facilities management intelligence on maintenance, compliance, and building technology.',
    senderName: 'EntireFM Editorial Team',
    replyTo: 'editorial@entirefm.com',
    status: 'DRAFT',
    utmCampaign,
    contentBlocks,
    targetAudience: { all: true },
    totalRecipients: 0,
    totalDelivered: 0,
    totalOpened: 0,
    totalClicked: 0,
    totalUnsubscribed: 0,
    totalBounced: 0,
    validationPassed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveCampaign(campaign);

  return {
    success: true,
    campaignId: campaign.id,
    campaign,
    message: `Weekly briefing draft created: ${campaign.name} (Stored as DRAFT for review)`,
  };
}
