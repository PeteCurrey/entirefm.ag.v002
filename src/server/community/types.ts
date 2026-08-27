/**
 * ENTIREFM LOBBY COMMUNITY & KNOWLEDGE ENGINE DATA MODELS
 * ========================================================
 * Strictly segregated from CAFM database models.
 */

export type DiscussionStatus = 'active' | 'locked' | 'archived' | 'hidden' | 'removed';
export type ModerationState = 'published' | 'under_review' | 'flagged' | 'hidden' | 'removed';
export type CaseStatus = 'open' | 'under_review' | 'actioned' | 'dismissed' | 'closed';
export type CaseOutcome = 'no_action' | 'warned' | 'hidden' | 'removed' | 'restricted' | 'suspended' | 'banned' | 'escalated';

export interface CommunityCategory {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: string; // Lucide icon name
  displayOrder: number;
  status: 'active' | 'archived';
  visibility: 'public' | 'members-only' | 'restricted-group' | 'staff-only';
  postingPermissions: 'members' | 'verified_members' | 'staff_only';
  discussionCount: number;
  lastActivityAt: string;
}

export interface EditRecord {
  editedAt: string;
  editedByMemberId: string;
  previousBody: string;
  reason?: string;
}

export interface Discussion {
  id: string;
  slug: string;
  title: string;
  authorMemberId: string;
  authorName: string;
  authorHeadline?: string;
  authorCompany?: string;
  authorAvatarUrl?: string;
  authorBadge?: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  body: string;
  tags: string[];
  status: DiscussionStatus;
  moderationState: ModerationState;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  replyCount: number;
  helpfulCount: number;
  viewCount: number;
  featured: boolean;
  pinned: boolean;
  solved: boolean;
  acceptedReplyId?: string;
  isEntireFMOfficial?: boolean;
  editHistory?: EditRecord[];
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  discussionSlug: string;
  authorMemberId: string;
  authorName: string;
  authorHeadline?: string;
  authorCompany?: string;
  authorAvatarUrl?: string;
  authorBadge?: string;
  isEntireFMOfficial?: boolean;
  body: string;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  parentReplyId?: string;
  replyToMemberName?: string;
  moderationState: ModerationState;
  isAcceptedAnswer: boolean;
  helpfulCount: number;
  helpfulMemberIds: string[];
  editHistory?: EditRecord[];
}

export interface HelpfulReaction {
  id: string;
  replyId: string;
  memberId: string;
  createdAt: string;
}

export interface ModerationCase {
  id: string;
  reporterMemberId: string;
  reportedContentType: 'discussion' | 'reply' | 'room_message' | 'direct_message';
  reportedContentId: string;
  contentSnapshot: string;
  authorMemberId: string;
  reason:
    | 'spam_promotion'
    | 'harassment_abuse'
    | 'hate_discrimination'
    | 'confidential_info'
    | 'unsafe_misleading'
    | 'illegal_content'
    | 'copyright_ip'
    | 'impersonation'
    | 'other';
  reporterNotes?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: CaseStatus;
  assignedModeratorId?: string;
  outcome?: CaseOutcome;
  internalNotes?: string;
  createdAt: string;
  reviewedAt?: string;
  closedAt?: string;
}

export interface ReputationEvent {
  id: string;
  memberId: string;
  eventType: 'discussion_accepted_answer' | 'reply_marked_helpful' | 'challenge_solved' | 'editorial_contributor_bonus';
  sourceId: string;
  points: number;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  context: string;
  topic: string;
  status: 'active' | 'closed';
  opensAt: string;
  closesAt: string;
  totalVotes: number;
  options: PollOption[];
  editorialAnalysis?: string;
  relatedDiscussionSlug?: string;
  seriesId?: string;
}

export interface PollVote {
  pollId: string;
  memberId: string;
  optionId: string;
  votedAt: string;
}

export interface ChallengeOption {
  id: string;
  text: string;
}

export interface Challenge {
  id: string;
  weekNumber: number;
  year: number;
  title: string;
  question: string;
  scenario: string;
  topic: string;
  difficulty: 'Practitioner' | 'Senior' | 'Director';
  points: number;
  options: ChallengeOption[];
  correctOptionId: string; // server-side only
  explanation: string;
  technicalWhy: string;
  sourceReferences: string[];
  status: 'active' | 'closed';
}

export interface ChallengeResponse {
  challengeId: string;
  memberId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  answeredAt: string;
}

export interface AskEntireFMSubmission {
  id: string;
  memberId: string;
  memberName: string;
  memberHeadline?: string;
  question: string;
  context?: string;
  topic: string;
  attributionPreference: 'full_name' | 'job_title_only' | 'anonymous';
  status: 'submitted' | 'under_editorial_review' | 'published' | 'declined';
  editorialNotes?: string;
  publishedArticleSlug?: string;
  submittedAt: string;
}
