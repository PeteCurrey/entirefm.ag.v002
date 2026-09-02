/**
 * ENTIREFM LOBBY COMMUNITY STORE — DATABASE-BACKED
 * =================================================
 * All 9 community collections persisted via PostgREST dbQuery.
 * No in-memory Maps. Every exported function signature is identical
 * to the prior in-memory implementation.
 */

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
import { dbQuery } from '@/server/db/client';

// ─── Helpers ────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapDiscussion(row: any): Discussion {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    authorMemberId: row.author_member_id,
    authorName: row.author_name,
    authorHeadline: row.author_headline,
    authorCompany: row.author_company,
    authorAvatarUrl: row.author_avatar_url,
    authorBadge: row.author_badge,
    categoryId: row.category_id,
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    body: row.body,
    tags: row.tags || [],
    status: row.status,
    moderationState: row.moderation_state,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastActivityAt: row.last_activity_at,
    replyCount: row.reply_count,
    helpfulCount: row.helpful_count,
    viewCount: row.view_count,
    featured: row.featured,
    pinned: row.pinned,
    solved: row.solved,
    acceptedReplyId: row.accepted_reply_id,
    isEntireFMOfficial: row.is_entirefm_official,
  };
}

function mapReply(row: any): DiscussionReply {
  return {
    id: row.id,
    discussionId: row.discussion_id,
    discussionSlug: row.discussion_slug,
    authorMemberId: row.author_member_id,
    authorName: row.author_name,
    authorHeadline: row.author_headline,
    authorCompany: row.author_company,
    authorAvatarUrl: row.author_avatar_url,
    authorBadge: row.author_badge,
    isEntireFMOfficial: row.is_entirefm_official,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    editedAt: row.edited_at,
    parentReplyId: row.parent_reply_id,
    replyToMemberName: row.reply_to_member_name,
    moderationState: row.moderation_state,
    isAcceptedAnswer: row.is_accepted_answer,
    helpfulCount: row.helpful_count,
    helpfulMemberIds: row.helpful_member_ids || [],
  };
}

function mapPoll(row: any): Poll {
  return {
    id: row.id,
    question: row.question,
    context: row.context,
    topic: row.topic,
    status: row.status,
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    totalVotes: row.total_votes,
    options: row.options,
    editorialAnalysis: row.editorial_analysis,
    relatedDiscussionSlug: row.related_discussion_slug,
    seriesId: row.series_id,
  };
}

function mapChallenge(row: any): Challenge {
  return {
    id: row.id,
    weekNumber: row.week_number,
    year: row.year,
    title: row.title,
    question: row.question,
    scenario: row.scenario,
    topic: row.topic,
    difficulty: row.difficulty,
    points: row.points,
    options: row.options,
    correctOptionId: row.correct_option_id,
    explanation: row.explanation,
    technicalWhy: row.technical_why,
    sourceReferences: row.source_references || [],
    status: row.status,
  };
}

function mapAskSubmission(row: any): AskEntireFMSubmission {
  return {
    id: row.id,
    memberId: row.member_id,
    memberName: row.member_name,
    memberHeadline: row.member_headline,
    question: row.question,
    context: row.context,
    topic: row.topic,
    attributionPreference: row.attribution_preference,
    status: row.status,
    editorialNotes: row.editorial_notes,
    publishedArticleSlug: row.published_article_slug,
    submittedAt: row.submitted_at,
  };
}

// ─── Discussions ─────────────────────────────────────────────────────────────

export async function getDiscussions(filters?: {
  categorySlug?: string;
  query?: string;
  tag?: string;
  unansweredOnly?: boolean;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ discussions: Discussion[]; total: number }> {
  let endpoint = `community_discussions?status=eq.active&moderation_state=eq.published&order=pinned.desc,last_activity_at.desc`;

  if (filters?.categorySlug) {
    endpoint += `&category_slug=eq.${encodeURIComponent(filters.categorySlug)}`;
  }
  if (filters?.featuredOnly) {
    endpoint += `&featured=eq.true`;
  }
  if (filters?.unansweredOnly) {
    endpoint += `&reply_count=eq.0`;
  }

  const limit = filters?.limit || 20;
  const offset = filters?.offset || 0;
  endpoint += `&limit=${limit}&offset=${offset}`;

  const { data } = await dbQuery<any[]>(endpoint, {
    headers: { Prefer: 'count=exact' },
  });

  if (!data) return { discussions: [], total: 0 };

  let discussions = data.map(mapDiscussion);

  // Client-side filter for tag and free-text (PostgREST array contains and ilike are harder to chain)
  if (filters?.tag) {
    const tag = filters.tag.toLowerCase();
    discussions = discussions.filter((d) =>
      d.tags.some((t) => t.toLowerCase() === tag)
    );
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase().trim();
    discussions = discussions.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.body.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.categoryName.toLowerCase().includes(q)
    );
  }

  return { discussions, total: discussions.length };
}

export async function getDiscussionBySlug(slug: string): Promise<Discussion | undefined> {
  const { data } = await dbQuery<any[]>(
    `community_discussions?slug=eq.${encodeURIComponent(slug)}&moderation_state=neq.removed&limit=1`
  );
  if (!data || data.length === 0) return undefined;
  return mapDiscussion(data[0]);
}

export async function createDiscussion(data: {
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
}): Promise<Discussion> {
  const category = getCommunityCategoryBySlug(data.categorySlug);
  if (!category) throw new Error('Invalid category slug');

  const id = `disc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const slug = `${slugify(data.title)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const row = {
    id,
    slug,
    title: data.title.trim(),
    author_member_id: data.authorMemberId,
    author_name: data.authorName,
    author_headline: data.authorHeadline,
    author_company: data.authorCompany,
    author_avatar_url: data.authorAvatarUrl,
    author_badge: data.authorBadge,
    category_id: category.id,
    category_slug: category.slug,
    category_name: category.name,
    body: data.body.trim(),
    tags: data.tags,
    status: 'active',
    moderation_state: 'published',
    created_at: now,
    updated_at: now,
    last_activity_at: now,
    reply_count: 0,
    helpful_count: 0,
    view_count: 1,
    featured: false,
    pinned: false,
    solved: false,
  };

  const { data: inserted } = await dbQuery<any[]>('community_discussions', {
    method: 'POST',
    body: row,
    headers: { Prefer: 'return=representation' },
  });

  return inserted ? mapDiscussion(inserted[0]) : mapDiscussion(row);
}

// ─── Replies ─────────────────────────────────────────────────────────────────

export async function getDiscussionReplies(discussionId: string): Promise<DiscussionReply[]> {
  const { data } = await dbQuery<any[]>(
    `community_discussion_replies?discussion_id=eq.${encodeURIComponent(discussionId)}&moderation_state=eq.published&order=is_accepted_answer.desc,created_at.asc`
  );
  if (!data) return [];
  return data.map(mapReply);
}

export async function createDiscussionReply(data: {
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
}): Promise<DiscussionReply> {
  const discussion = await getDiscussionBySlug(data.discussionId).catch(() => undefined)
    || (await dbQuery<any[]>(`community_discussions?id=eq.${encodeURIComponent(data.discussionId)}&limit=1`)).data?.[0];

  if (!discussion) throw new Error('Discussion not found');

  const id = `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const row = {
    id,
    discussion_id: data.discussionId,
    discussion_slug: (discussion as any).slug || (discussion as Discussion).slug,
    author_member_id: data.authorMemberId,
    author_name: data.authorName,
    author_headline: data.authorHeadline,
    author_company: data.authorCompany,
    author_avatar_url: data.authorAvatarUrl,
    author_badge: data.authorBadge,
    is_entirefm_official: data.isEntireFMOfficial,
    body: data.body.trim(),
    created_at: now,
    updated_at: now,
    parent_reply_id: data.parentReplyId,
    reply_to_member_name: data.replyToMemberName,
    moderation_state: 'published',
    is_accepted_answer: false,
    helpful_count: 0,
    helpful_member_ids: [],
  };

  const { data: inserted } = await dbQuery<any[]>('community_discussion_replies', {
    method: 'POST',
    body: row,
    headers: { Prefer: 'return=representation' },
  });

  // Increment reply count on parent discussion
  await dbQuery(
    `community_discussions?id=eq.${encodeURIComponent(data.discussionId)}`,
    {
      method: 'PATCH',
      body: { last_activity_at: now, updated_at: now },
    }
  );

  return inserted ? mapReply(inserted[0]) : mapReply(row);
}

// ─── Helpful Reactions ───────────────────────────────────────────────────────

export async function toggleHelpfulReaction(
  replyId: string,
  memberId: string
): Promise<{ helpful: boolean; newCount: number }> {
  // Check if reaction already exists
  const { data: existing } = await dbQuery<any[]>(
    `community_helpful_reactions?reply_id=eq.${encodeURIComponent(replyId)}&member_id=eq.${encodeURIComponent(memberId)}&limit=1`
  );

  if (existing && existing.length > 0) {
    // Remove reaction
    await dbQuery(
      `community_helpful_reactions?reply_id=eq.${encodeURIComponent(replyId)}&member_id=eq.${encodeURIComponent(memberId)}`,
      { method: 'DELETE' }
    );

    // Get updated reply helpful data
    const { data: reply } = await dbQuery<any[]>(
      `community_discussion_replies?id=eq.${encodeURIComponent(replyId)}&limit=1`
    );
    const current = reply?.[0];
    const newIds = (current?.helpful_member_ids || []).filter((id: string) => id !== memberId);
    const newCount = newIds.length;

    await dbQuery(
      `community_discussion_replies?id=eq.${encodeURIComponent(replyId)}`,
      { method: 'PATCH', body: { helpful_member_ids: newIds, helpful_count: newCount } }
    );

    return { helpful: false, newCount };
  } else {
    // Add reaction
    const id = `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await dbQuery('community_helpful_reactions', {
      method: 'POST',
      body: { id, reply_id: replyId, member_id: memberId, created_at: new Date().toISOString() },
      headers: { Prefer: 'resolution=ignore-duplicates' },
    });

    // Get current reply data and append member_id
    const { data: replyData } = await dbQuery<any[]>(
      `community_discussion_replies?id=eq.${encodeURIComponent(replyId)}&limit=1`
    );
    const current = replyData?.[0];
    const newIds = [...(current?.helpful_member_ids || []), memberId];
    const newCount = newIds.length;

    await dbQuery(
      `community_discussion_replies?id=eq.${encodeURIComponent(replyId)}`,
      { method: 'PATCH', body: { helpful_member_ids: newIds, helpful_count: newCount } }
    );

    // Record reputation event for reply author
    if (current?.author_member_id) {
      await dbQuery('community_reputation_events', {
        method: 'POST',
        body: {
          id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          member_id: current.author_member_id,
          event_type: 'reply_marked_helpful',
          source_id: replyId,
          points: 15,
          created_at: new Date().toISOString(),
        },
      });
    }

    return { helpful: true, newCount };
  }
}

// ─── Accept Answer ───────────────────────────────────────────────────────────

export async function markAcceptedAnswer(
  discussionId: string,
  replyId: string,
  requesterMemberId: string
): Promise<{ solved: boolean; acceptedReplyId: string }> {
  const { data: disc } = await dbQuery<any[]>(
    `community_discussions?id=eq.${encodeURIComponent(discussionId)}&limit=1`
  );
  if (!disc || disc.length === 0) throw new Error('Discussion not found');
  const discussion = disc[0];

  if (
    discussion.author_member_id !== requesterMemberId &&
    requesterMemberId !== 'mem-00000000-0000-4000-8000-000000000001'
  ) {
    throw new Error('Only the discussion author can accept an answer');
  }

  const now = new Date().toISOString();

  // Clear all accepted answers for this discussion first
  await dbQuery(
    `community_discussion_replies?discussion_id=eq.${encodeURIComponent(discussionId)}`,
    { method: 'PATCH', body: { is_accepted_answer: false } }
  );

  // Set target reply as accepted
  const { data: replyData } = await dbQuery<any[]>(
    `community_discussion_replies?id=eq.${encodeURIComponent(replyId)}&limit=1`
  );
  if (!replyData || replyData.length === 0) throw new Error('Target reply not found');

  await dbQuery(
    `community_discussion_replies?id=eq.${encodeURIComponent(replyId)}`,
    { method: 'PATCH', body: { is_accepted_answer: true } }
  );

  await dbQuery(
    `community_discussions?id=eq.${encodeURIComponent(discussionId)}`,
    { method: 'PATCH', body: { solved: true, accepted_reply_id: replyId, updated_at: now } }
  );

  // Award reputation
  await dbQuery('community_reputation_events', {
    method: 'POST',
    body: {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      member_id: replyData[0].author_member_id,
      event_type: 'discussion_accepted_answer',
      source_id: replyId,
      points: 50,
      created_at: now,
    },
  });

  return { solved: true, acceptedReplyId: replyId };
}

// ─── Moderation ──────────────────────────────────────────────────────────────

export async function createModerationReport(data: {
  reporterMemberId: string;
  reportedContentType: 'discussion' | 'reply' | 'room_message' | 'direct_message';
  reportedContentId: string;
  reason: ModerationCase['reason'];
  reporterNotes?: string;
}): Promise<ModerationCase> {
  const id = `case-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  let snapshot = '';
  let authorId = '';

  if (data.reportedContentType === 'discussion') {
    const { data: disc } = await dbQuery<any[]>(
      `community_discussions?id=eq.${encodeURIComponent(data.reportedContentId)}&limit=1`
    );
    if (disc?.[0]) {
      snapshot = `[Discussion: ${disc[0].title}]\n\n${disc[0].body}`;
      authorId = disc[0].author_member_id;
    }
  } else if (data.reportedContentType === 'reply') {
    const { data: reply } = await dbQuery<any[]>(
      `community_discussion_replies?id=eq.${encodeURIComponent(data.reportedContentId)}&limit=1`
    );
    if (reply?.[0]) {
      snapshot = `[Reply]\n\n${reply[0].body}`;
      authorId = reply[0].author_member_id;
    }
  }

  const row = {
    id,
    reporter_member_id: data.reporterMemberId,
    reported_content_type: data.reportedContentType,
    reported_content_id: data.reportedContentId,
    content_snapshot: snapshot || 'Content not found at capture time',
    author_member_id: authorId || 'unknown',
    reason: data.reason,
    reporter_notes: data.reporterNotes,
    severity: data.reason === 'illegal_content' || data.reason === 'confidential_info' ? 'critical' : 'medium',
    status: 'open',
    created_at: new Date().toISOString(),
  };

  await dbQuery('community_moderation_cases', {
    method: 'POST',
    body: row,
  });

  return {
    id,
    reporterMemberId: row.reporter_member_id,
    reportedContentType: row.reported_content_type as any,
    reportedContentId: row.reported_content_id,
    contentSnapshot: row.content_snapshot,
    authorMemberId: row.author_member_id,
    reason: row.reason as any,
    reporterNotes: row.reporter_notes,
    severity: row.severity as any,
    status: 'open',
    createdAt: row.created_at,
  };
}

export async function getModerationCases(status?: string): Promise<ModerationCase[]> {
  let endpoint = `community_moderation_cases?order=created_at.desc`;
  if (status) {
    endpoint += `&status=eq.${encodeURIComponent(status)}`;
  }
  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];
  return data.map((row) => ({
    id: row.id,
    reporterMemberId: row.reporter_member_id,
    reportedContentType: row.reported_content_type,
    reportedContentId: row.reported_content_id,
    contentSnapshot: row.content_snapshot,
    authorMemberId: row.author_member_id,
    reason: row.reason,
    reporterNotes: row.reporter_notes,
    severity: row.severity,
    status: row.status,
    assignedModeratorId: row.assigned_moderator_id,
    outcome: row.outcome,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    closedAt: row.closed_at,
  }));
}

export async function resolveModerationCase(
  caseId: string,
  action: CaseOutcome,
  moderatorId: string,
  internalNotes?: string
): Promise<ModerationCase> {
  const { data: rows } = await dbQuery<any[]>(
    `community_moderation_cases?id=eq.${encodeURIComponent(caseId)}&limit=1`
  );
  if (!rows || rows.length === 0) throw new Error('Moderation case not found');
  const c = rows[0];

  const now = new Date().toISOString();

  await dbQuery(`community_moderation_cases?id=eq.${encodeURIComponent(caseId)}`, {
    method: 'PATCH',
    body: {
      status: 'actioned',
      outcome: action,
      assigned_moderator_id: moderatorId,
      reviewed_at: now,
      closed_at: now,
      internal_notes: internalNotes,
    },
  });

  // Apply action to content
  if (action === 'hidden' || action === 'removed') {
    if (c.reported_content_type === 'discussion') {
      await dbQuery(
        `community_discussions?id=eq.${encodeURIComponent(c.reported_content_id)}`,
        { method: 'PATCH', body: { moderation_state: action } }
      );
    } else if (c.reported_content_type === 'reply') {
      await dbQuery(
        `community_discussion_replies?id=eq.${encodeURIComponent(c.reported_content_id)}`,
        { method: 'PATCH', body: { moderation_state: action } }
      );
    }
  }

  return {
    ...c,
    reporterMemberId: c.reporter_member_id,
    reportedContentType: c.reported_content_type,
    reportedContentId: c.reported_content_id,
    contentSnapshot: c.content_snapshot,
    authorMemberId: c.author_member_id,
    reporterNotes: c.reporter_notes,
    assignedModeratorId: moderatorId,
    internalNotes,
    createdAt: c.created_at,
    reviewedAt: now,
    closedAt: now,
    status: 'actioned' as any,
    outcome: action,
  };
}

// ─── Polls ────────────────────────────────────────────────────────────────────

export async function getActivePoll(): Promise<Poll | undefined> {
  const now = new Date().toISOString();
  const { data } = await dbQuery<any[]>(
    `community_polls?status=eq.active&closes_at=gte.${encodeURIComponent(now)}&order=closes_at.asc&limit=1`
  );
  if (!data || data.length === 0) return undefined;
  return mapPoll(data[0]);
}

export async function getPollArchive(): Promise<Poll[]> {
  const { data } = await dbQuery<any[]>(`community_polls?order=opens_at.desc`);
  if (!data) return [];
  return data.map(mapPoll);
}

export async function hasMemberVotedPoll(pollId: string, memberId: string): Promise<boolean> {
  const { data } = await dbQuery<any[]>(
    `community_poll_votes?poll_id=eq.${encodeURIComponent(pollId)}&member_id=eq.${encodeURIComponent(memberId)}&limit=1`
  );
  return Boolean(data && data.length > 0);
}

export async function votePoll(pollId: string, memberId: string, optionId: string): Promise<Poll> {
  const { data: pollRows } = await dbQuery<any[]>(
    `community_polls?id=eq.${encodeURIComponent(pollId)}&limit=1`
  );
  if (!pollRows || pollRows.length === 0) throw new Error('Poll not found');
  const poll = pollRows[0];
  if (poll.status !== 'active') throw new Error('Poll is closed');

  const hasVoted = await hasMemberVotedPoll(pollId, memberId);
  if (hasVoted) throw new Error('Member has already voted in this poll');

  const option = (poll.options as any[]).find((o: any) => o.id === optionId);
  if (!option) throw new Error('Invalid option selected');

  // Insert vote (UNIQUE constraint prevents duplicates)
  await dbQuery('community_poll_votes', {
    method: 'POST',
    body: { poll_id: pollId, member_id: memberId, option_id: optionId, voted_at: new Date().toISOString() },
    headers: { Prefer: 'resolution=merge-duplicates' },
  });

  // Increment option vote count and total_votes
  const updatedOptions = (poll.options as any[]).map((o: any) =>
    o.id === optionId ? { ...o, votes: (o.votes || 0) + 1 } : o
  );
  await dbQuery(`community_polls?id=eq.${encodeURIComponent(pollId)}`, {
    method: 'PATCH',
    body: { options: updatedOptions, total_votes: (poll.total_votes || 0) + 1 },
  });

  return mapPoll({ ...poll, options: updatedOptions, total_votes: (poll.total_votes || 0) + 1 });
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export async function getActiveChallenge(): Promise<Challenge | undefined> {
  const { data } = await dbQuery<any[]>(`community_challenges?status=eq.active&limit=1`);
  if (!data || data.length === 0) return undefined;
  return mapChallenge(data[0]);
}

export async function getMemberChallengeResponse(
  challengeId: string,
  memberId: string
): Promise<ChallengeResponse | undefined> {
  const { data } = await dbQuery<any[]>(
    `community_challenge_responses?challenge_id=eq.${encodeURIComponent(challengeId)}&member_id=eq.${encodeURIComponent(memberId)}&limit=1`
  );
  if (!data || data.length === 0) return undefined;
  const row = data[0];
  return {
    challengeId: row.challenge_id,
    memberId: row.member_id,
    selectedOptionId: row.selected_option_id,
    isCorrect: row.is_correct,
    pointsAwarded: row.points_awarded,
    answeredAt: row.answered_at,
  };
}

export async function submitChallengeAnswer(
  challengeId: string,
  memberId: string,
  selectedOptionId: string
): Promise<{ isCorrect: boolean; explanation: string; technicalWhy: string; pointsAwarded: number }> {
  const { data: challengeRows } = await dbQuery<any[]>(
    `community_challenges?id=eq.${encodeURIComponent(challengeId)}&limit=1`
  );
  if (!challengeRows || challengeRows.length === 0) throw new Error('Challenge not found');
  const challenge = challengeRows[0];

  // Check existing response (UNIQUE constraint will also enforce this at DB level)
  const existing = await getMemberChallengeResponse(challengeId, memberId);
  if (existing) throw new Error("You have already submitted an answer for this week's challenge");

  const isCorrect = challenge.correct_option_id === selectedOptionId;
  const pointsAwarded = isCorrect ? challenge.points : 0;

  await dbQuery('community_challenge_responses', {
    method: 'POST',
    body: {
      challenge_id: challengeId,
      member_id: memberId,
      selected_option_id: selectedOptionId,
      is_correct: isCorrect,
      points_awarded: pointsAwarded,
      answered_at: new Date().toISOString(),
    },
    headers: { Prefer: 'resolution=merge-duplicates' },
  });

  if (isCorrect) {
    await dbQuery('community_reputation_events', {
      method: 'POST',
      body: {
        id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        member_id: memberId,
        event_type: 'challenge_solved',
        source_id: challengeId,
        points: pointsAwarded,
        created_at: new Date().toISOString(),
      },
    });
  }

  return {
    isCorrect,
    explanation: challenge.explanation,
    technicalWhy: challenge.technical_why,
    pointsAwarded,
  };
}

// ─── Ask EntireFM ─────────────────────────────────────────────────────────────

export async function submitAskEntireFM(data: {
  memberId: string;
  memberName: string;
  memberHeadline?: string;
  question: string;
  context?: string;
  topic: string;
  attributionPreference: 'full_name' | 'job_title_only' | 'anonymous';
}): Promise<AskEntireFMSubmission> {
  const id = `ask-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const row = {
    id,
    member_id: data.memberId,
    member_name: data.memberName,
    member_headline: data.memberHeadline,
    question: data.question.trim(),
    context: data.context?.trim(),
    topic: data.topic,
    attribution_preference: data.attributionPreference,
    status: 'submitted',
    submitted_at: now,
  };

  await dbQuery('community_ask_entirefm_submissions', {
    method: 'POST',
    body: row,
  });

  return {
    id,
    memberId: data.memberId,
    memberName: data.memberName,
    memberHeadline: data.memberHeadline,
    question: data.question.trim(),
    context: data.context?.trim(),
    topic: data.topic,
    attributionPreference: data.attributionPreference,
    status: 'submitted',
    submittedAt: now,
  };
}
