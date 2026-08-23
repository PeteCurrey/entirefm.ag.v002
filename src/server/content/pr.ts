/**
 * ENTIREFM DIGITAL PR & INDUSTRY AUTHORITY DOMAIN MODULE
 * =======================================================
 * Manages PR campaigns, media targets, expert commentary, and earned coverage.
 */

import { dbQuery } from '../db/client';

export interface PrCampaign {
  id: string;
  title: string;
  slug: string;
  primary_asset_url: string;
  story_angle: string;
  target_audience: string;
  status: 'DRAFT' | 'RESEARCH' | 'BUILDING' | 'READY' | 'ACTIVE' | 'COMPLETE' | 'ARCHIVED';
  launch_date?: string;
  owner: string;
  key_findings: string[];
  created_at: string;
}

export interface MediaTarget {
  id: string;
  publication_name: string;
  website: string;
  category: 'FM_PRESS' | 'PROPERTY' | 'BUILDING_ENGINEERING' | 'ENERGY' | 'TECH_AI' | 'REGIONAL_BUSINESS';
  contact_name?: string;
  role?: string;
  editorial_focus?: string;
  relationship_status: 'UNCONTACTED' | 'PITCHED' | 'RESPONDED' | 'COVERAGE_EARNED' | 'DO_NOT_CONTACT';
  notes?: string;
  last_interaction_at?: string;
  created_at: string;
}

export interface ExpertCommentary {
  id: string;
  topic_title: string;
  news_source_url?: string;
  why_it_matters_to_fm: string;
  draft_comment: string;
  approved_by?: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PITCHED' | 'PUBLISHED' | 'ARCHIVED';
  created_at: string;
}

export interface EarnedCoverage {
  id: string;
  campaign_id?: string;
  publication_name: string;
  article_title: string;
  article_url: string;
  published_date: string;
  has_backlink: boolean;
  backlink_url?: string;
  link_type: 'FOLLOW' | 'NOFOLLOW' | 'UNLINKED_MENTION';
  anchor_text?: string;
  created_at: string;
}

export interface PrDashboardMetrics {
  activeCampaignsCount: number;
  mediaTargetsCount: number;
  pendingCommentariesCount: number;
  earnedCoverageCount: number;
  backlinksCount: number;
  unlinkedMentionsCount: number;
}

// In-Memory Fallback Store
class PrMemoryStore {
  public campaigns: Map<string, PrCampaign> = new Map([
    [
      'campaign-ai-in-fm',
      {
        id: 'campaign-ai-in-fm',
        title: 'What AI Can Actually Do in FM in 2026 — And What It Cannot',
        slug: 'ai-in-facilities-management-2026',
        primary_asset_url: '/resources/ai-in-facilities-management',
        story_angle: 'Pragmatic reality check on commercial FM AI adoption, separating practical natural-language ticket triage from autonomous BMS risk.',
        target_audience: 'FM Directors, Property Journalists, Enterprise Tech Editors',
        status: 'READY',
        launch_date: '2026-09-01',
        owner: 'PR Lead',
        key_findings: [
          'High utility in NLP work order dispatch and asset spatial mapping',
          'Autonomous BMS setpoint control remains high-risk and unverified for life safety',
          'Asset register data quality is the single largest barrier to FM automation'
        ],
        created_at: '2026-08-23T22:00:00Z',
      },
    ],
    [
      'campaign-asset-data-ppm',
      {
        id: 'campaign-asset-data-ppm',
        title: 'Why Poor Asset Data Is the Hidden Problem Behind FM Automation',
        slug: 'asset-data-fm-automation',
        primary_asset_url: '/resources/guides/asset-register-guide',
        story_angle: 'Exposing how inaccurate building asset hierarchies cause post-contract tender disputes and failed CAFM implementations.',
        target_audience: 'Building Engineering & Facilities Management Press',
        status: 'READY',
        launch_date: '2026-09-15',
        owner: 'PR Lead',
        key_findings: [
          'Over 40% of commercial tenders carry incomplete or unverified plant counts',
          'Uniclass 2015 alignment drastically reduces onboarding lifecycle costs'
        ],
        created_at: '2026-08-23T22:00:00Z',
      },
    ],
    [
      'campaign-fm-procurement',
      {
        id: 'campaign-fm-procurement',
        title: 'What Commercial FM Buyers Should Actually Put Into a Tender',
        slug: 'fm-tender-procurement-reality',
        primary_asset_url: '/resources/guides/fm-tender-guide',
        story_angle: 'A procurement blueprint moving clients from restrictive input headcount to measurable output performance SLAs.',
        target_audience: 'Corporate Real Estate & Procurement Media',
        status: 'BUILDING',
        launch_date: '2026-10-01',
        owner: 'PR Lead',
        key_findings: [
          'Output specifications incentivize energy and contractor efficiency',
          'Transparent SLA pause governance eliminates false performance disputes'
        ],
        created_at: '2026-08-23T22:00:00Z',
      },
    ],
  ]);

  public mediaTargets: Map<string, MediaTarget> = new Map([
    [
      'target-1',
      {
        id: 'target-1',
        publication_name: 'Facilitate Magazine (IWFM)',
        website: 'https://www.facilitatemagazine.com',
        category: 'FM_PRESS',
        editorial_focus: 'Workplace innovation, FM technology, professional standards',
        relationship_status: 'UNCONTACTED',
        notes: 'Target for AI in FM thought leadership pitch',
        created_at: '2026-08-23T22:00:00Z',
      },
    ],
    [
      'target-2',
      {
        id: 'target-2',
        publication_name: 'FMJ (Facilities Management Journal)',
        website: 'https://www.fmj.co.uk',
        category: 'FM_PRESS',
        editorial_focus: 'Commercial maintenance, sustainability, compliance',
        relationship_status: 'UNCONTACTED',
        notes: 'Target for PPM asset register and compliance calendar stories',
        created_at: '2026-08-23T22:00:00Z',
      },
    ],
    [
      'target-3',
      {
        id: 'target-3',
        publication_name: 'CIBSE Journal',
        website: 'https://www.cibsejournal.com',
        category: 'BUILDING_ENGINEERING',
        editorial_focus: 'Building services engineering, HVAC efficiency, statutory standards',
        relationship_status: 'UNCONTACTED',
        notes: 'Target for commercial HVAC maintenance and controls conflict commentary',
        created_at: '2026-08-23T22:00:00Z',
      },
    ],
  ]);

  public commentaries: Map<string, ExpertCommentary> = new Map([
    [
      'comment-1',
      {
        id: 'comment-1',
        topic_title: 'Addressing the UK Commercial Estate Asset Data Deficit',
        why_it_matters_to_fm: 'Poor asset hierarchies cause post-tender budget blowouts and prevent predictive maintenance models from functioning.',
        draft_comment: 'This matters because facilities teams often treat asset registers as a one-off administrative task. Once predictive maintenance is introduced, poor asset hierarchies become an active operational failure point because automated models are only as reliable as the underlying field data.',
        approved_by: 'EntireFM Technical Director',
        status: 'APPROVED',
        created_at: '2026-08-23T22:00:00Z',
      },
    ],
  ]);

  public coverage: Map<string, EarnedCoverage> = new Map();
}

export const prMemoryStore = new PrMemoryStore();

function isDbConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function listPrCampaigns(): Promise<PrCampaign[]> {
  let list = Array.from(prMemoryStore.campaigns.values());
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>('pr_campaigns?select=*&order=created_at.desc');
    if (data && data.length > 0) {
      list = data.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        primary_asset_url: r.primary_asset_url,
        story_angle: r.story_angle,
        target_audience: r.target_audience,
        status: r.status,
        launch_date: r.launch_date,
        owner: r.owner,
        key_findings: r.key_findings || [],
        created_at: r.created_at,
      }));
    }
  }
  return list;
}

export async function listMediaTargets(): Promise<MediaTarget[]> {
  let list = Array.from(prMemoryStore.mediaTargets.values());
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>('media_targets?select=*&order=publication_name.asc');
    if (data && data.length > 0) {
      list = data.map((r) => ({
        id: r.id,
        publication_name: r.publication_name,
        website: r.website,
        category: r.category,
        contact_name: r.contact_name,
        role: r.role,
        editorial_focus: r.editorial_focus,
        relationship_status: r.relationship_status,
        notes: r.notes,
        last_interaction_at: r.last_interaction_at,
        created_at: r.created_at,
      }));
    }
  }
  return list;
}

export async function getPrDashboardMetrics(): Promise<PrDashboardMetrics> {
  const campaigns = await listPrCampaigns();
  const mediaTargets = await listMediaTargets();
  const commentaries = Array.from(prMemoryStore.commentaries.values());
  const coverage = Array.from(prMemoryStore.coverage.values());

  return {
    activeCampaignsCount: campaigns.filter((c) => c.status === 'ACTIVE' || c.status === 'READY').length,
    mediaTargetsCount: mediaTargets.length,
    pendingCommentariesCount: commentaries.filter((c) => c.status === 'REVIEW' || c.status === 'DRAFT').length,
    earnedCoverageCount: coverage.length,
    backlinksCount: coverage.filter((c) => c.has_backlink).length,
    unlinkedMentionsCount: coverage.filter((c) => c.link_type === 'UNLINKED_MENTION').length,
  };
}
