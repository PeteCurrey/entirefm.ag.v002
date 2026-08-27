import {
  Discussion,
  DiscussionReply,
  HelpfulReaction,
  ModerationCase,
  ReputationEvent,
  Poll,
  PollVote,
  Challenge,
  ChallengeResponse,
  AskEntireFMSubmission,
  CaseOutcome,
} from './types';
import { getCommunityCategoryBySlug } from './category-store';

// In-memory data structures for Community platform
const DISCUSSIONS_STORE: Map<string, Discussion> = new Map();
const REPLIES_STORE: Map<string, DiscussionReply[]> = new Map(); // discussionId -> replies[]
const REACTIONS_STORE: Map<string, HelpfulReaction> = new Map(); // `${replyId}_${memberId}` -> reaction
const MODERATION_CASES_STORE: Map<string, ModerationCase> = new Map();
const REPUTATION_EVENTS: ReputationEvent[] = [];
const POLLS_STORE: Map<string, Poll> = new Map();
const POLL_VOTES: Map<string, PollVote> = new Map(); // `${pollId}_${memberId}` -> vote
const CHALLENGES_STORE: Map<string, Challenge> = new Map();
const CHALLENGE_RESPONSES: Map<string, ChallengeResponse> = new Map(); // `${challengeId}_${memberId}`
const ASK_ENTIREFM_SUBMISSIONS: Map<string, AskEntireFMSubmission> = new Map();

// Helper to generate slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Initialize seed data
function seedCommunityData() {
  if (DISCUSSIONS_STORE.size > 0) return;

  const now = new Date().toISOString();

  // 1. Discussions
  const seedDiscussions: Discussion[] = [
    {
      id: 'disc-001',
      slug: 'how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off',
      title: 'How much asset data do you insist on before accepting mobilisation sign-off?',
      authorMemberId: 'mem-00000000-0000-4000-8000-000000000001',
      authorName: 'Peter Currey',
      authorHeadline: 'CEO | EntireFM',
      authorCompany: 'EntireFM',
      authorBadge: 'Founding Member',
      categoryId: 'cat-mobilisation',
      categorySlug: 'mobilisation',
      categoryName: 'Mobilisation',
      body: `We are currently transitioning a 14-site commercial portfolio where the outgoing provider has supplied an Excel asset register with zero serial numbers, no installation dates, and generic descriptions like "AHU 1-4 Roof".\n\nAt what threshold do you push back and refuse contract sign-off until a physical verification asset survey is funded by the client or outgoing provider? What specific data fields do you consider non-negotiable on day 1 vs day 60?`,
      tags: ['Mobilisation', 'Asset Register', 'SFG20', 'CAFM'],
      status: 'active',
      moderationState: 'published',
      createdAt: '2026-08-26T10:00:00Z',
      updatedAt: '2026-08-27T14:30:00Z',
      lastActivityAt: '2026-08-27T14:30:00Z',
      replyCount: 3,
      helpfulCount: 8,
      viewCount: 142,
      featured: true,
      pinned: true,
      solved: true,
      acceptedReplyId: 'reply-001-02',
    },
    {
      id: 'disc-002',
      slug: 'ahu-belts-failing-early-alignment-tension-or-sheave-wear',
      title: 'AHU drive belts failing within 90 days — alignment, tensioning method or sheave wear?',
      authorMemberId: 'mem-seed-eng-01',
      authorName: 'Marcus Vance',
      authorHeadline: 'Senior Mechanical Engineer | CEng MCIBSE',
      authorCompany: 'Vance Engineering Associates',
      authorBadge: 'Verified Practitioner',
      categoryId: 'cat-engineering-me',
      categorySlug: 'engineering-me',
      categoryName: 'Engineering & M&E',
      body: `Across a large retail distribution depot, we have three twin-fan supply AHUs (75kW motors) where cogged V-belts (SPB profile) are showing severe sidewall glazing and cord separation in under 3 months. Pulley alignment was laser-checked, but tension was set using the standard 1.5% deflection thumb rule.\n\nAre others using acoustic tension meters for higher-power drives, or is it more likely we have worn pulley grooves that weren't caught during the last major overhaul?`,
      tags: ['HVAC', 'AHU', 'Mechanical Engineering', 'PPM'],
      status: 'active',
      moderationState: 'published',
      createdAt: '2026-08-25T14:00:00Z',
      updatedAt: '2026-08-27T11:15:00Z',
      lastActivityAt: '2026-08-27T11:15:00Z',
      replyCount: 4,
      helpfulCount: 12,
      viewCount: 218,
      featured: true,
      pinned: false,
      solved: true,
      acceptedReplyId: 'reply-002-01',
    },
    {
      id: 'disc-003',
      slug: 'mandatory-digital-occurrence-reporting-duty-holder-records',
      title: 'Mandatory Occurrence Reporting under BSA 2022: How are teams logging near-misses without inbox chaos?',
      authorMemberId: 'mem-seed-saf-01',
      authorName: 'Sarah Jenkins',
      authorHeadline: 'Head of Building Safety & Compliance',
      authorCompany: 'Prime Estate Governance',
      authorBadge: 'Compliance Lead',
      categoryId: 'cat-fire-building-safety',
      categorySlug: 'fire-building-safety',
      categoryName: 'Fire & Building Safety',
      body: `With the Building Safety Regulator scrutinising Golden Thread records for higher-risk residential buildings (HRBs), we need a clear audit trail for structural or fire safety occurrences within 48 hours.\n\nAre you routing these through your core CAFM helpdesk or a standalone occurrence logging tool? How do you prevent minor fabric issues from contaminating the statutory occurrence register?`,
      tags: ['Building Safety', 'BSA 2022', 'Fire Doors', 'Golden Thread'],
      status: 'active',
      moderationState: 'published',
      createdAt: '2026-08-24T09:30:00Z',
      updatedAt: '2026-08-26T16:00:00Z',
      lastActivityAt: '2026-08-26T16:00:00Z',
      replyCount: 2,
      helpfulCount: 6,
      viewCount: 185,
      featured: true,
      pinned: false,
      solved: false,
    },
    {
      id: 'disc-004',
      slug: 'water-hygiene-sensible-kpi-sets-for-water-treatment-contractors',
      title: 'What is a realistic KPI and deduction structure for water hygiene and sampling contractors?',
      authorMemberId: 'mem-seed-ops-01',
      authorName: 'David Sterling',
      authorHeadline: 'Estates Director | Healthcare & Education',
      authorCompany: 'Sterling Estates Group',
      authorBadge: 'Member',
      categoryId: 'cat-water-hygiene',
      categorySlug: 'water-hygiene',
      categoryName: 'Water Hygiene',
      body: `We are renegotiating our national water hygiene contract covering 45 sites. Previously we had a simple "100% monthly tasks completed" KPI, but it meant contractors were uploading temperature sheets 3 weeks late while still hitting the metric on paper.\n\nWhat specific SLA windows do you enforce for: (1) Temperature logging upload (e.g. 48h), (2) Positive Legionella notification (immediate phone + 2h written), and (3) Remedial quote turnarounds?`,
      tags: ['Water Hygiene', 'Legionella', 'ACOP L8', 'Contract Management'],
      status: 'active',
      moderationState: 'published',
      createdAt: '2026-08-23T11:00:00Z',
      updatedAt: '2026-08-26T15:20:00Z',
      lastActivityAt: '2026-08-26T15:20:00Z',
      replyCount: 3,
      helpfulCount: 5,
      viewCount: 130,
      featured: false,
      pinned: false,
      solved: true,
      acceptedReplyId: 'reply-004-01',
    },
    {
      id: 'disc-005',
      slug: 'are-people-moving-away-from-blanket-12-month-ppm-frequencies',
      title: 'Are FM teams actually moving away from rigid 12-month calendar PPM frequencies to runtime-based maintenance?',
      authorMemberId: 'mem-seed-tech-01',
      authorName: 'Rachel Thorne',
      authorHeadline: 'Asset Management Strategy Lead',
      authorCompany: 'Thorne Infrastructure',
      authorBadge: 'Contributor',
      categoryId: 'cat-ppm-asset-management',
      categorySlug: 'ppm-asset-management',
      categoryName: 'PPM & Asset Management',
      body: `With SFG20 now supporting dynamic maintenance regimes, we are evaluating moving standby pump sets and secondary AHUs from monthly calendar inspections to runtime-hour triggers via BMS feedback.\n\nFor those who have implemented this: How did you satisfy your insurer and statutory compliance auditors that runtime-driven intervals still meet manufacturer recommendations?`,
      tags: ['PPM', 'SFG20', 'BMS', 'Asset Management'],
      status: 'active',
      moderationState: 'published',
      createdAt: '2026-08-22T16:00:00Z',
      updatedAt: '2026-08-25T10:00:00Z',
      lastActivityAt: '2026-08-25T10:00:00Z',
      replyCount: 2,
      helpfulCount: 9,
      viewCount: 195,
      featured: false,
      pinned: false,
      solved: false,
    },
    {
      id: 'disc-006',
      slug: 'contractor-evidence-after-reactive-callouts-photo-quality-and-job-sheets',
      title: 'Contractor Desk: Best practice for non-negotiable photographic evidence before sign-off',
      authorMemberId: 'mem-seed-con-01',
      authorName: 'Liam O’Connor',
      authorHeadline: 'Director of Operations | Specialist MEP Contractors',
      authorCompany: 'Apex MEP Services',
      authorBadge: 'Contractor Partner',
      categoryId: 'cat-contractor-desk',
      categorySlug: 'contractor-desk',
      categoryName: 'The Contractor Desk',
      body: `As a contractor delivering out-of-hours reactive callouts for major FM providers, our engineers often struggle with portal uploads when client portals require 8 different photos with zero mobile offline capability.\n\nFrom an FM client perspective, what is the absolute minimum photographic evidence set you actually look at before approving an invoice? Wide shot + nameplate + defect + completed repair?`,
      tags: ['The Contractor Desk', 'Work Orders', 'Invoicing', 'Field Service'],
      status: 'active',
      moderationState: 'published',
      createdAt: '2026-08-21T13:45:00Z',
      updatedAt: '2026-08-24T17:30:00Z',
      lastActivityAt: '2026-08-24T17:30:00Z',
      replyCount: 3,
      helpfulCount: 7,
      viewCount: 160,
      featured: false,
      pinned: false,
      solved: true,
      acceptedReplyId: 'reply-006-01',
    },
    {
      id: 'disc-007',
      slug: 'how-are-fm-teams-actually-using-ai-today-beyond-summarising-emails',
      title: 'How are FM teams genuinely using AI in daily operations rather than just talking about it?',
      authorMemberId: 'mem-seed-tech-02',
      authorName: 'Kieran Patel',
      authorHeadline: 'Digital FM & PropTech Consultant',
      authorCompany: 'NextGen Estates',
      authorBadge: 'Member',
      categoryId: 'cat-cafm-data-technology',
      categorySlug: 'cafm-data-technology',
      categoryName: 'CAFM, Data & Technology',
      body: `There is massive hype around generative AI in facilities management. But cut through the sales pitches: who has deployed an AI capability that produces measurable ROI right now?\n\nIs it automatic invoice line-item extraction? Predictive dispatch based on weather data? Subcontractor quote variance checks? Let's share practical implementations with actual numbers.`,
      tags: ['AI in FM', 'CAFM', 'Automation', 'PropTech'],
      status: 'active',
      moderationState: 'published',
      createdAt: '2026-08-20T10:00:00Z',
      updatedAt: '2026-08-23T14:10:00Z',
      lastActivityAt: '2026-08-23T14:10:00Z',
      replyCount: 4,
      helpfulCount: 14,
      viewCount: 310,
      featured: true,
      pinned: false,
      solved: false,
    },
  ];

  seedDiscussions.forEach((d) => DISCUSSIONS_STORE.set(d.id, d));

  // 2. Replies
  const repliesDisc1: DiscussionReply[] = [
    {
      id: 'reply-001-01',
      discussionId: 'disc-001',
      discussionSlug: 'how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off',
      authorMemberId: 'mem-seed-ops-01',
      authorName: 'David Sterling',
      authorHeadline: 'Estates Director | Healthcare & Education',
      authorCompany: 'Sterling Estates Group',
      body: `In our contracts, Day 1 non-negotiables are strictly statutory plant:\n1. Gas boilers/burners (CP12 serials, burner ratings)\n2. Fire alarm panel & loop registers\n3. Water calorifiers and cold water storage tanks\n4. Passenger lift insurance inspection IDs\n\nIf the outgoing provider doesn't have these, we log a Day 1 Formal Statutory Liability Discrepancy. Non-statutory assets (fan coils, small extract fans) can wait for the 60-day baseline condition survey.`,
      createdAt: '2026-08-26T11:30:00Z',
      updatedAt: '2026-08-26T11:30:00Z',
      moderationState: 'published',
      isAcceptedAnswer: false,
      helpfulCount: 3,
      helpfulMemberIds: ['mem-00000000-0000-4000-8000-000000000001', 'mem-seed-eng-01', 'mem-seed-saf-01'],
    },
    {
      id: 'reply-001-02',
      discussionId: 'disc-001',
      discussionSlug: 'how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off',
      authorMemberId: 'mem-seed-con-01',
      authorName: 'Liam O’Connor',
      authorHeadline: 'Director of Operations | Specialist MEP Contractors',
      authorCompany: 'Apex MEP Services',
      body: `Here is the commercial framework we use with EntireFM and our Tier 1 clients:\n\n1. **Data Maturity Scale**: Grade the inherited register A to D during the first 14 days.\n2. **Exclusion Clause**: Any asset lacking a verified serial number or physical location barcode is tagged as "Unverified Asset". If an unverified unit fails in Month 1, emergency reactive calls are charged at agreed schedule-of-rates rather than standard contractual SLA penalties.\n3. **Funded Discovery**: Agree a £/asset rate with the client for the incoming provider to bar-code and nameplate survey the estate over the first 45 days.\n\nThis completely stops the argument with the outgoing provider and protects the incoming team.`,
      createdAt: '2026-08-26T14:15:00Z',
      updatedAt: '2026-08-26T14:15:00Z',
      moderationState: 'published',
      isAcceptedAnswer: true,
      helpfulCount: 5,
      helpfulMemberIds: ['mem-00000000-0000-4000-8000-000000000001', 'mem-seed-ops-01', 'mem-seed-saf-01', 'mem-seed-tech-01', 'mem-seed-tech-02'],
    },
  ];

  REPLIES_STORE.set('disc-001', repliesDisc1);

  const repliesDisc2: DiscussionReply[] = [
    {
      id: 'reply-002-01',
      discussionId: 'disc-002',
      discussionSlug: 'ahu-belts-failing-early-alignment-tension-or-sheave-wear',
      authorMemberId: 'mem-00000000-0000-4000-8000-000000000001',
      authorName: 'Peter Currey',
      authorHeadline: 'CEO | EntireFM',
      authorCompany: 'EntireFM',
      authorBadge: 'Founding Member',
      body: `On 75kW twin-fan units, standard thumb deflection is notoriously inaccurate — engineers almost always overtension them initially to prevent slip at startup, which destroys the sidewalls within weeks.\n\nCheck two things immediately:\n1. **Sheave Groove Gauge**: Run a simple plastic profile gauge down the pulley. If the groove sidewalls are dished or stepped by more than 0.8mm, the belt rides on the bottom of the groove rather than the flanks, causing massive friction heat.\n2. **Acoustic Frequency Meter**: Set tension strictly by Hz frequency (typically around 65-72 Hz depending on span length and SPB section). A calibrated acoustic meter costs under £400 and pays for itself on the first avoided motor bearing failure.`,
      createdAt: '2026-08-25T16:00:00Z',
      updatedAt: '2026-08-25T16:00:00Z',
      moderationState: 'published',
      isAcceptedAnswer: true,
      helpfulCount: 7,
      helpfulMemberIds: ['mem-seed-eng-01', 'mem-seed-ops-01', 'mem-seed-con-01', 'mem-seed-saf-01', 'mem-seed-tech-01', 'mem-seed-tech-02', 'mem-seed-saf-02'],
    },
  ];

  REPLIES_STORE.set('disc-002', repliesDisc2);

  // 3. Polls (The Pulse)
  const seedPoll: Poll = {
    id: 'poll-2026-08-w4',
    question: 'What is the single biggest cause of failed FM contract mobilisation?',
    context:
      'Mobilisation sets the contractual tone for years. Based on your experience across commercial and public sector estates, where does the greatest friction originate?',
    topic: 'Mobilisation & Transition',
    status: 'active',
    opensAt: '2026-08-24T00:00:00Z',
    closesAt: '2026-08-31T23:59:59Z',
    totalVotes: 148,
    options: [
      { id: 'opt-1', text: 'Inaccurate / missing asset registers from outgoing contractor', votes: 64 }, // 43.2%
      { id: 'opt-2', text: 'Unrealistic 30-day timeline with no overlap period', votes: 41 }, // 27.7%
      { id: 'opt-3', text: 'TUPE data withheld or delivered at the final hour', votes: 29 }, // 19.6%
      { id: 'opt-4', text: 'CAFM system configuration and data import delays', votes: 14 }, // 9.5%
    ],
    editorialAnalysis:
      'Over 43% of FM professionals point to poor asset data handover as the fatal flaw in contract mobilisation. Without verified equipment nameplates on Day 1, planned maintenance schedules collapse into immediate reactive firefighting.',
    relatedDiscussionSlug: 'how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off',
    seriesId: 'pulse-mobilisation-confidence',
  };

  POLLS_STORE.set(seedPoll.id, seedPoll);

  // 4. Challenge (The Lobby Question)
  const seedChallenge: Challenge = {
    id: 'challenge-2026-w35',
    weekNumber: 35,
    year: 2026,
    title: 'The Saturated Insulation Water Leak',
    question:
      'A contractor attends an out-of-hours P1 water leak in a 6th-floor ceiling void. The leak is isolated and stopped, but 12 metres of mineral wool pipe insulation remains heavily saturated directly above a live main electrical riser distribution board. What must happen next?',
    scenario:
      'Friday 21:30. The pipe has been clamped and verified dry. The insulation is sagging with retained water directly above an IP2X rated electrical distribution board supplying emergency power to tenant trading floors.',
    topic: 'Building Services & Life Safety',
    difficulty: 'Senior',
    points: 50,
    options: [
      {
        id: 'opt-a',
        text: 'Leave dehumidifiers running in the void over the weekend and log a standard P3 remedial ticket for Monday morning.',
      },
      {
        id: 'opt-b',
        text: 'Strip all saturated insulation immediately, bag for controlled disposal, install temporary drip containment with discharge away from electrical plant, and issue an electrical safety inspection hold.',
      },
      {
        id: 'opt-c',
        text: 'Wrap the wet insulation with heavy polythene sheeting and duct tape to seal the moisture inside until planned renewal.',
      },
      {
        id: 'opt-d',
        text: 'Isolate the main electrical distribution board immediately, plunging the trading floor into darkness, before notifying the client.',
      },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'Mineral wool insulation retains substantial water weight and will wick moisture into electrical enclosures over hours. Wrapping in polythene traps water and promotes corrosion. Leaving it unstripped over a live board creates catastrophic short-circuit and arc flash risk. Stripping the wet lagging and installing directed catchment protects the asset while maintaining operational continuity.',
    technicalWhy:
      'BS 7671 (IET Wiring Regulations) Regulation 522.3 requires electrical equipment to be protected against ingress of water. Retained moisture in wet lagging is an active fluid source with progressive capillary migration towards terminal connections.',
    sourceReferences: ['BS 7671:2018+A2:2022', 'CIBSE Guide M: Maintenance Engineering', 'HSE Electricity at Work Regulations 1989'],
    status: 'active',
  };

  CHALLENGES_STORE.set(seedChallenge.id, seedChallenge);
}

// Run initial seed
seedCommunityData();

// Export query and mutation helpers
export function getDiscussions(filters?: {
  categorySlug?: string;
  query?: string;
  tag?: string;
  unansweredOnly?: boolean;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}): { discussions: Discussion[]; total: number } {
  let list = Array.from(DISCUSSIONS_STORE.values()).filter(
    (d) => d.status === 'active' && d.moderationState === 'published'
  );

  if (filters?.categorySlug) {
    list = list.filter((d) => d.categorySlug === filters.categorySlug);
  }

  if (filters?.tag) {
    list = list.filter((d) => d.tags.some((t) => t.toLowerCase() === filters.tag?.toLowerCase()));
  }

  if (filters?.unansweredOnly) {
    list = list.filter((d) => d.replyCount === 0 || !d.solved);
  }

  if (filters?.featuredOnly) {
    list = list.filter((d) => d.featured);
  }

  if (filters?.query) {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.body.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.categoryName.toLowerCase().includes(q)
    );
  }

  // Sort by pinned first, then last activity
  list.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
  });

  const total = list.length;
  const offset = filters?.offset || 0;
  const limit = filters?.limit || 20;

  return {
    discussions: list.slice(offset, offset + limit),
    total,
  };
}

export function getDiscussionBySlug(slug: string): Discussion | undefined {
  return Array.from(DISCUSSIONS_STORE.values()).find((d) => d.slug === slug && d.moderationState !== 'removed');
}

export function createDiscussion(data: {
  title: string;
  body: string;
  categorySlug: string;
  tags: string[];
  authorMemberId: string;
  authorName: string;
  authorHeadline?: string;
  authorCompany?: string;
  authorAvatarUrl?: string;
  authorBadge?: string;
}): Discussion {
  const category = getCommunityCategoryBySlug(data.categorySlug);
  if (!category) throw new Error('Invalid category slug');

  const id = `disc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const slug = `${slugify(data.title)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const discussion: Discussion = {
    id,
    slug,
    title: data.title.trim(),
    authorMemberId: data.authorMemberId,
    authorName: data.authorName,
    authorHeadline: data.authorHeadline,
    authorCompany: data.authorCompany,
    authorAvatarUrl: data.authorAvatarUrl,
    authorBadge: data.authorBadge,
    categoryId: category.id,
    categorySlug: category.slug,
    categoryName: category.name,
    body: data.body.trim(),
    tags: data.tags,
    status: 'active',
    moderationState: 'published',
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
    replyCount: 0,
    helpfulCount: 0,
    viewCount: 1,
    featured: false,
    pinned: false,
    solved: false,
  };

  DISCUSSIONS_STORE.set(id, discussion);
  category.discussionCount += 1;
  category.lastActivityAt = now;

  return discussion;
}

export function getDiscussionReplies(discussionId: string): DiscussionReply[] {
  const replies = REPLIES_STORE.get(discussionId) || [];
  return replies
    .filter((r) => r.moderationState === 'published')
    .sort((a, b) => {
      // Accepted answer always floats to top
      if (a.isAcceptedAnswer && !b.isAcceptedAnswer) return -1;
      if (!a.isAcceptedAnswer && b.isAcceptedAnswer) return 1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
}

export function createDiscussionReply(data: {
  discussionId: string;
  body: string;
  authorMemberId: string;
  authorName: string;
  authorHeadline?: string;
  authorCompany?: string;
  authorAvatarUrl?: string;
  authorBadge?: string;
  parentReplyId?: string;
  replyToMemberName?: string;
  isEntireFMOfficial?: boolean;
}): DiscussionReply {
  const discussion = DISCUSSIONS_STORE.get(data.discussionId);
  if (!discussion) throw new Error('Discussion not found');
  if (discussion.status === 'locked' || discussion.status === 'removed') {
    throw new Error('Discussion is locked or removed');
  }

  const id = `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const reply: DiscussionReply = {
    id,
    discussionId: discussion.id,
    discussionSlug: discussion.slug,
    authorMemberId: data.authorMemberId,
    authorName: data.authorName,
    authorHeadline: data.authorHeadline,
    authorCompany: data.authorCompany,
    authorAvatarUrl: data.authorAvatarUrl,
    authorBadge: data.authorBadge,
    isEntireFMOfficial: data.isEntireFMOfficial,
    body: data.body.trim(),
    createdAt: now,
    updatedAt: now,
    parentReplyId: data.parentReplyId,
    replyToMemberName: data.replyToMemberName,
    moderationState: 'published',
    isAcceptedAnswer: false,
    helpfulCount: 0,
    helpfulMemberIds: [],
  };

  const existingReplies = REPLIES_STORE.get(discussion.id) || [];
  existingReplies.push(reply);
  REPLIES_STORE.set(discussion.id, existingReplies);

  discussion.replyCount = existingReplies.filter((r) => r.moderationState === 'published').length;
  discussion.lastActivityAt = now;
  discussion.updatedAt = now;

  return reply;
}

export function toggleHelpfulReaction(
  replyId: string,
  memberId: string
): { helpful: boolean; newCount: number } {
  // Find reply
  let targetReply: DiscussionReply | undefined;
  for (const replies of REPLIES_STORE.values()) {
    const found = replies.find((r) => r.id === replyId);
    if (found) {
      targetReply = found;
      break;
    }
  }

  if (!targetReply) throw new Error('Reply not found');

  const key = `${replyId}_${memberId}`;
  const existingReaction = REACTIONS_STORE.get(key);

  if (existingReaction) {
    // Remove reaction
    REACTIONS_STORE.delete(key);
    targetReply.helpfulMemberIds = targetReply.helpfulMemberIds.filter((id) => id !== memberId);
    targetReply.helpfulCount = targetReply.helpfulMemberIds.length;
    return { helpful: false, newCount: targetReply.helpfulCount };
  } else {
    // Add reaction
    REACTIONS_STORE.set(key, {
      id: `rx-${Date.now()}`,
      replyId,
      memberId,
      createdAt: new Date().toISOString(),
    });
    targetReply.helpfulMemberIds.push(memberId);
    targetReply.helpfulCount = targetReply.helpfulMemberIds.length;

    // Record reputation event for author
    REPUTATION_EVENTS.push({
      id: `rep-${Date.now()}`,
      memberId: targetReply.authorMemberId,
      eventType: 'reply_marked_helpful',
      sourceId: replyId,
      points: 15,
      createdAt: new Date().toISOString(),
    });

    return { helpful: true, newCount: targetReply.helpfulCount };
  }
}

export function markAcceptedAnswer(
  discussionId: string,
  replyId: string,
  requesterMemberId: string
): { solved: boolean; acceptedReplyId: string } {
  const discussion = DISCUSSIONS_STORE.get(discussionId);
  if (!discussion) throw new Error('Discussion not found');

  // Must be discussion author or staff to accept answer
  if (discussion.authorMemberId !== requesterMemberId && requesterMemberId !== 'mem-00000000-0000-4000-8000-000000000001') {
    throw new Error('Only the discussion author can accept an answer');
  }

  const replies = REPLIES_STORE.get(discussionId) || [];
  let acceptedReply: DiscussionReply | undefined;

  for (const r of replies) {
    if (r.id === replyId) {
      r.isAcceptedAnswer = true;
      acceptedReply = r;
    } else {
      r.isAcceptedAnswer = false;
    }
  }

  if (!acceptedReply) throw new Error('Target reply not found');

  discussion.solved = true;
  discussion.acceptedReplyId = replyId;
  discussion.updatedAt = new Date().toISOString();

  // Award reputation points
  REPUTATION_EVENTS.push({
    id: `rep-${Date.now()}`,
    memberId: acceptedReply.authorMemberId,
    eventType: 'discussion_accepted_answer',
    sourceId: replyId,
    points: 50,
    createdAt: new Date().toISOString(),
  });

  return { solved: true, acceptedReplyId: replyId };
}

export function createModerationReport(data: {
  reporterMemberId: string;
  reportedContentType: 'discussion' | 'reply' | 'room_message' | 'direct_message';
  reportedContentId: string;
  reason: ModerationCase['reason'];
  reporterNotes?: string;
}): ModerationCase {
  const id = `case-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  let snapshot = '';
  let authorId = '';

  if (data.reportedContentType === 'discussion') {
    const disc = DISCUSSIONS_STORE.get(data.reportedContentId);
    if (disc) {
      snapshot = `[Discussion: ${disc.title}]\n\n${disc.body}`;
      authorId = disc.authorMemberId;
    }
  } else if (data.reportedContentType === 'reply') {
    for (const replies of REPLIES_STORE.values()) {
      const found = replies.find((r) => r.id === data.reportedContentId);
      if (found) {
        snapshot = `[Reply]\n\n${found.body}`;
        authorId = found.authorMemberId;
        break;
      }
    }
  }

  const moderationCase: ModerationCase = {
    id,
    reporterMemberId: data.reporterMemberId,
    reportedContentType: data.reportedContentType,
    reportedContentId: data.reportedContentId,
    contentSnapshot: snapshot || 'Content not found at capture time',
    authorMemberId: authorId || 'unknown',
    reason: data.reason,
    reporterNotes: data.reporterNotes,
    severity: data.reason === 'illegal_content' || data.reason === 'confidential_info' ? 'critical' : 'medium',
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  MODERATION_CASES_STORE.set(id, moderationCase);
  return moderationCase;
}

export function getModerationCases(status?: string): ModerationCase[] {
  let cases = Array.from(MODERATION_CASES_STORE.values());
  if (status) {
    cases = cases.filter((c) => c.status === status);
  }
  return cases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function resolveModerationCase(
  caseId: string,
  action: CaseOutcome,
  moderatorId: string,
  internalNotes?: string
): ModerationCase {
  const c = MODERATION_CASES_STORE.get(caseId);
  if (!c) throw new Error('Moderation case not found');

  const now = new Date().toISOString();
  c.status = 'actioned';
  c.outcome = action;
  c.assignedModeratorId = moderatorId;
  c.reviewedAt = now;
  c.closedAt = now;
  c.internalNotes = internalNotes;

  // Apply action to content
  if (action === 'hidden' || action === 'removed') {
    if (c.reportedContentType === 'discussion') {
      const disc = DISCUSSIONS_STORE.get(c.reportedContentId);
      if (disc) disc.moderationState = action;
    } else if (c.reportedContentType === 'reply') {
      for (const replies of REPLIES_STORE.values()) {
        const found = replies.find((r) => r.id === c.reportedContentId);
        if (found) found.moderationState = action;
      }
    }
  }

  return c;
}

// ----------------- Polls (The Pulse) -----------------
export function getActivePoll(): Poll | undefined {
  const now = new Date().toISOString();
  return Array.from(POLLS_STORE.values()).find((p) => p.status === 'active' && p.closesAt >= now);
}

export function getPollArchive(): Poll[] {
  return Array.from(POLLS_STORE.values()).sort(
    (a, b) => new Date(b.opensAt).getTime() - new Date(a.opensAt).getTime()
  );
}

export function hasMemberVotedPoll(pollId: string, memberId: string): boolean {
  return POLL_VOTES.has(`${pollId}_${memberId}`);
}

export function votePoll(pollId: string, memberId: string, optionId: string): Poll {
  const poll = POLLS_STORE.get(pollId);
  if (!poll) throw new Error('Poll not found');
  if (poll.status !== 'active') throw new Error('Poll is closed');

  const voteKey = `${pollId}_${memberId}`;
  if (POLL_VOTES.has(voteKey)) {
    throw new Error('Member has already voted in this poll');
  }

  const option = poll.options.find((o) => o.id === optionId);
  if (!option) throw new Error('Invalid option selected');

  option.votes += 1;
  poll.totalVotes += 1;

  POLL_VOTES.set(voteKey, {
    pollId,
    memberId,
    optionId,
    votedAt: new Date().toISOString(),
  });

  return poll;
}

// ----------------- Challenge (The Lobby Question) -----------------
export function getActiveChallenge(): Challenge | undefined {
  return Array.from(CHALLENGES_STORE.values()).find((c) => c.status === 'active');
}

export function getMemberChallengeResponse(challengeId: string, memberId: string): ChallengeResponse | undefined {
  return CHALLENGE_RESPONSES.get(`${challengeId}_${memberId}`);
}

export function submitChallengeAnswer(
  challengeId: string,
  memberId: string,
  selectedOptionId: string
): { isCorrect: boolean; explanation: string; technicalWhy: string; pointsAwarded: number } {
  const challenge = CHALLENGES_STORE.get(challengeId);
  if (!challenge) throw new Error('Challenge not found');

  const responseKey = `${challengeId}_${memberId}`;
  if (CHALLENGE_RESPONSES.has(responseKey)) {
    throw new Error('You have already submitted an answer for this week’s challenge');
  }

  const isCorrect = challenge.correctOptionId === selectedOptionId;
  const pointsAwarded = isCorrect ? challenge.points : 0;

  CHALLENGE_RESPONSES.set(responseKey, {
    challengeId,
    memberId,
    selectedOptionId,
    isCorrect,
    pointsAwarded,
    answeredAt: new Date().toISOString(),
  });

  if (isCorrect) {
    REPUTATION_EVENTS.push({
      id: `rep-${Date.now()}`,
      memberId,
      eventType: 'challenge_solved',
      sourceId: challengeId,
      points: pointsAwarded,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    isCorrect,
    explanation: challenge.explanation,
    technicalWhy: challenge.technicalWhy,
    pointsAwarded,
  };
}

// ----------------- Ask EntireFM -----------------
export function submitAskEntireFM(data: {
  memberId: string;
  memberName: string;
  memberHeadline?: string;
  question: string;
  context?: string;
  topic: string;
  attributionPreference: 'full_name' | 'job_title_only' | 'anonymous';
}): AskEntireFMSubmission {
  const id = `ask-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const submission: AskEntireFMSubmission = {
    id,
    memberId: data.memberId,
    memberName: data.memberName,
    memberHeadline: data.memberHeadline,
    question: data.question.trim(),
    context: data.context?.trim(),
    topic: data.topic,
    attributionPreference: data.attributionPreference,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };

  ASK_ENTIREFM_SUBMISSIONS.set(id, submission);
  return submission;
}
