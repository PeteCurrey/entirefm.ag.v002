import { Conversation, DirectMessage, DirectMessageSSEEvent, ParticipantStatus } from './types';

const CONVERSATIONS_STORE: Map<string, Conversation> = new Map();
const DIRECT_MESSAGES_STORE: Map<string, DirectMessage[]> = new Map(); // conversationId -> messages[]
const BLOCKED_MEMBERS_STORE: Map<string, Set<string>> = new Map(); // blockerMemberId -> Set<blockedMemberId>

type DMListener = (event: DirectMessageSSEEvent) => void;
const DM_LISTENERS: Map<string, Set<DMListener>> = new Map(); // conversationId -> Set<DMListener>

export function isMemberBlocked(requesterMemberId: string, targetMemberId: string): boolean {
  const blockedByTarget = BLOCKED_MEMBERS_STORE.get(targetMemberId)?.has(requesterMemberId) || false;
  const blockedByRequester = BLOCKED_MEMBERS_STORE.get(requesterMemberId)?.has(targetMemberId) || false;
  return blockedByTarget || blockedByRequester;
}

export function blockMember(blockerMemberId: string, targetMemberId: string) {
  if (!BLOCKED_MEMBERS_STORE.has(blockerMemberId)) {
    BLOCKED_MEMBERS_STORE.set(blockerMemberId, new Set());
  }
  BLOCKED_MEMBERS_STORE.get(blockerMemberId)!.add(targetMemberId);
}

export function getMemberConversations(memberId: string): Conversation[] {
  return Array.from(CONVERSATIONS_STORE.values())
    .filter((c) => c.participants.some((p) => p.memberId === memberId && p.status !== 'declined'))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function getConversationById(conversationId: string, memberId: string): Conversation | undefined {
  const conv = CONVERSATIONS_STORE.get(conversationId);
  if (!conv) return undefined;
  // Security check: member must be a participant
  const isParticipant = conv.participants.some((p) => p.memberId === memberId);
  if (!isParticipant) {
    throw new Error('Unauthorized: You are not a participant in this conversation');
  }
  return conv;
}

export function getConversationMessages(conversationId: string, memberId: string): DirectMessage[] {
  // Validate participant
  const conv = CONVERSATIONS_STORE.get(conversationId);
  if (!conv || !conv.participants.some((p) => p.memberId === memberId)) {
    throw new Error('Unauthorized: Access denied');
  }

  const msgs = DIRECT_MESSAGES_STORE.get(conversationId) || [];
  return msgs.filter((m) => m.moderationState === 'published');
}

export function startOrGetDirectConversation(
  sender: { id: string; name: string; headline?: string; company?: string },
  recipient: { id: string; name: string; headline?: string; company?: string },
  initialMessageText: string
): { conversation: Conversation; message: DirectMessage } {
  if (isMemberBlocked(sender.id, recipient.id)) {
    throw new Error('Unable to message this member due to privacy or block restrictions');
  }

  // Check if conversation already exists between these 2 members
  let existing = Array.from(CONVERSATIONS_STORE.values()).find(
    (c) =>
      c.type === 'direct' &&
      c.participants.some((p) => p.memberId === sender.id) &&
      c.participants.some((p) => p.memberId === recipient.id)
  );

  const now = new Date().toISOString();

  if (!existing) {
    const convId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    existing = {
      id: convId,
      type: 'direct',
      participants: [
        {
          memberId: sender.id,
          memberName: sender.name,
          memberHeadline: sender.headline,
          memberCompany: sender.company,
          status: 'accepted',
          joinedAt: now,
          lastReadAt: now,
          muted: false,
          archived: false,
        },
        {
          memberId: recipient.id,
          memberName: recipient.name,
          memberHeadline: recipient.headline,
          memberCompany: recipient.company,
          status: 'pending_request', // Recipient must accept first contact
          joinedAt: now,
          lastReadAt: now,
          muted: false,
          archived: false,
        },
      ],
      lastMessageAt: now,
      lastMessagePreview: initialMessageText.slice(0, 80),
      lastMessageAuthorName: sender.name,
      createdAt: now,
      updatedAt: now,
    };
    CONVERSATIONS_STORE.set(convId, existing);
    DIRECT_MESSAGES_STORE.set(convId, []);
  }

  // Send message
  const msgId = `dm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const message: DirectMessage = {
    id: msgId,
    conversationId: existing.id,
    authorMemberId: sender.id,
    authorName: sender.name,
    body: initialMessageText.trim(),
    createdAt: now,
    moderationState: 'published',
  };

  const msgs = DIRECT_MESSAGES_STORE.get(existing.id) || [];
  msgs.push(message);
  DIRECT_MESSAGES_STORE.set(existing.id, msgs);

  existing.lastMessageAt = now;
  existing.lastMessagePreview = initialMessageText.slice(0, 80);
  existing.lastMessageAuthorName = sender.name;
  existing.updatedAt = now;

  broadcastDMEvent(existing.id, {
    type: 'new_message',
    data: message,
  });

  return { conversation: existing, message };
}

export function sendDirectMessage(
  conversationId: string,
  authorMemberId: string,
  authorName: string,
  body: string
): DirectMessage {
  const conv = CONVERSATIONS_STORE.get(conversationId);
  if (!conv) throw new Error('Conversation not found');

  // Verify participant
  const me = conv.participants.find((p) => p.memberId === authorMemberId);
  if (!me) throw new Error('Unauthorized');

  // Check if other participant blocked
  const other = conv.participants.find((p) => p.memberId !== authorMemberId);
  if (other && isMemberBlocked(authorMemberId, other.memberId)) {
    throw new Error('Cannot send message: conversation blocked');
  }

  const now = new Date().toISOString();
  const id = `dm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const message: DirectMessage = {
    id,
    conversationId,
    authorMemberId,
    authorName,
    body: body.trim(),
    createdAt: now,
    moderationState: 'published',
  };

  const msgs = DIRECT_MESSAGES_STORE.get(conversationId) || [];
  msgs.push(message);
  DIRECT_MESSAGES_STORE.set(conversationId, msgs);

  conv.lastMessageAt = now;
  conv.lastMessagePreview = body.slice(0, 80);
  conv.lastMessageAuthorName = authorName;
  conv.updatedAt = now;

  broadcastDMEvent(conversationId, {
    type: 'new_message',
    data: message,
  });

  return message;
}

export function updateParticipantStatus(
  conversationId: string,
  memberId: string,
  status: ParticipantStatus
): Conversation {
  const conv = CONVERSATIONS_STORE.get(conversationId);
  if (!conv) throw new Error('Conversation not found');

  const p = conv.participants.find((x) => x.memberId === memberId);
  if (!p) throw new Error('Participant not found');

  p.status = status;
  conv.updatedAt = new Date().toISOString();

  broadcastDMEvent(conversationId, {
    type: 'request_status_changed',
    data: { memberId, status },
  });

  return conv;
}

export function subscribeToDMEvents(conversationId: string, listener: DMListener): () => void {
  if (!DM_LISTENERS.has(conversationId)) {
    DM_LISTENERS.set(conversationId, new Set());
  }
  const set = DM_LISTENERS.get(conversationId)!;
  set.add(listener);

  return () => {
    set.delete(listener);
  };
}

export function broadcastDMEvent(conversationId: string, event: DirectMessageSSEEvent) {
  const set = DM_LISTENERS.get(conversationId);
  if (set) {
    set.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error broadcasting DM event:', err);
      }
    });
  }
}
