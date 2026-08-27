export type RoomType = 'topic' | 'event' | 'temporary' | 'staff_hosted';
export type RoomVisibility = 'public_readable' | 'members_only' | 'restricted';
export type RoomStatus = 'active' | 'scheduled' | 'archived' | 'locked';

export interface Room {
  id: string;
  slug: string;
  name: string;
  description: string;
  topic: string;
  type: RoomType;
  visibility: RoomVisibility;
  status: RoomStatus;
  activePresenceCount: number;
  totalMessagesCount: number;
  lastActivityAt: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  guidelinesPrompt: string;
}

export interface RoomMessage {
  id: string;
  roomId: string;
  roomSlug: string;
  authorMemberId: string;
  authorName: string;
  authorHeadline?: string;
  authorCompany?: string;
  authorAvatarUrl?: string;
  authorBadge?: string;
  isEntireFMOfficial?: boolean;
  body: string;
  createdAt: string;
  editedAt?: string;
  replyToMessageId?: string;
  replyToSnippet?: string;
  moderationState: 'published' | 'hidden' | 'removed';
}

export interface RoomSSEEvent {
  type: 'message' | 'presence' | 'typing' | 'moderation_action';
  data: any;
}
