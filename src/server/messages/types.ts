export type ConversationType = 'direct' | 'group';
export type ParticipantStatus = 'accepted' | 'pending_request' | 'declined' | 'blocked';

export interface ConversationParticipant {
  memberId: string;
  memberName: string;
  memberHeadline?: string;
  memberCompany?: string;
  memberAvatarUrl?: string;
  status: ParticipantStatus;
  joinedAt: string;
  lastReadAt: string;
  muted: boolean;
  archived: boolean;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: ConversationParticipant[];
  lastMessageAt: string;
  lastMessagePreview?: string;
  lastMessageAuthorName?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  authorMemberId: string;
  authorName: string;
  authorAvatarUrl?: string;
  body: string;
  createdAt: string;
  editedAt?: string;
  moderationState: 'published' | 'hidden' | 'removed';
}

export interface DirectMessageSSEEvent {
  type: 'new_message' | 'request_status_changed' | 'read_receipt';
  data: any;
}
