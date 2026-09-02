/**
 * ENTIREFM THE LOBBY — CANONICAL DIRECT MESSAGES STORE
 * ====================================================
 * Fully persistent messaging layer backed by Supabase PostgreSQL tables:
 * - public.lobby_conversations
 * - public.lobby_conversation_participants
 * - public.lobby_direct_messages
 * - public.lobby_member_blocks
 *
 * Enforces participant privacy, immediate member block semantics,
 * and in-process real-time event broadcasting.
 */

import { Conversation, DirectMessage, DirectMessageSSEEvent, ParticipantStatus, ConversationParticipant } from './types';
import { dbQuery, isDbConfigured } from '../db/client';

// Test harness in-memory fallback (used ONLY when database is not configured)
const TEST_CONVERSATIONS: Map<string, Conversation> = new Map();
const TEST_DIRECT_MESSAGES: Map<string, DirectMessage[]> = new Map();
const TEST_BLOCKED_MEMBERS: Map<string, Set<string>> = new Map();

// In-process SSE listener registry for real-time dispatch
type DMListener = (event: DirectMessageSSEEvent) => void;
const DM_LISTENERS: Map<string, Set<DMListener>> = new Map();

// ----------------------------------------------------------------------------
// Row Mapping Helpers
// ----------------------------------------------------------------------------

function mapParticipantRow(row: any): ConversationParticipant {
  return {
    memberId: row.member_id,
    memberName: row.member_name,
    memberHeadline: row.member_headline || undefined,
    memberCompany: row.member_company || undefined,
    memberAvatarUrl: row.member_avatar_url || undefined,
    status: row.status as ParticipantStatus,
    joinedAt: row.joined_at,
    lastReadAt: row.last_read_at,
    muted: Boolean(row.muted),
    archived: Boolean(row.archived),
  };
}

function mapConversationRow(convRow: any, participantRows: any[]): Conversation {
  return {
    id: convRow.id,
    type: convRow.type as 'direct' | 'group',
    participants: participantRows.map(mapParticipantRow),
    lastMessageAt: convRow.last_message_at,
    lastMessagePreview: convRow.last_message_preview || undefined,
    lastMessageAuthorName: convRow.last_message_author_name || undefined,
    createdAt: convRow.created_at,
    updatedAt: convRow.updated_at,
  };
}

function mapMessageRow(row: any): DirectMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    authorMemberId: row.author_member_id,
    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url || undefined,
    body: row.body,
    createdAt: row.created_at,
    editedAt: row.edited_at || undefined,
    moderationState: row.moderation_state as 'published' | 'hidden' | 'removed',
  };
}

// ----------------------------------------------------------------------------
// Block-List Safety Engine
// ----------------------------------------------------------------------------

export async function isMemberBlocked(requesterMemberId: string, targetMemberId: string): Promise<boolean> {
  if (!isDbConfigured()) {
    const blockedByTarget = TEST_BLOCKED_MEMBERS.get(targetMemberId)?.has(requesterMemberId) || false;
    const blockedByRequester = TEST_BLOCKED_MEMBERS.get(requesterMemberId)?.has(targetMemberId) || false;
    return blockedByTarget || blockedByRequester;
  }

  // Check if either member has blocked the other
  const { data: blocks } = await dbQuery<any[]>(
    `lobby_member_blocks?or=(and(blocker_member_id.eq.${encodeURIComponent(requesterMemberId)},blocked_member_id.eq.${encodeURIComponent(targetMemberId)}),and(blocker_member_id.eq.${encodeURIComponent(targetMemberId)},blocked_member_id.eq.${encodeURIComponent(requesterMemberId)}))&select=id&limit=1`
  );

  return Boolean(blocks && blocks.length > 0);
}

export async function blockMember(blockerMemberId: string, targetMemberId: string): Promise<void> {
  if (!isDbConfigured()) {
    if (!TEST_BLOCKED_MEMBERS.has(blockerMemberId)) {
      TEST_BLOCKED_MEMBERS.set(blockerMemberId, new Set());
    }
    TEST_BLOCKED_MEMBERS.get(blockerMemberId)!.add(targetMemberId);
    return;
  }

  await dbQuery('lobby_member_blocks', {
    method: 'POST',
    body: {
      blocker_member_id: blockerMemberId,
      blocked_member_id: targetMemberId,
    },
  });
}

// ----------------------------------------------------------------------------
// Conversation Query & Fetch
// ----------------------------------------------------------------------------

export async function getMemberConversations(memberId: string): Promise<Conversation[]> {
  if (!isDbConfigured()) {
    return Array.from(TEST_CONVERSATIONS.values())
      .filter((c) => c.participants.some((p) => p.memberId === memberId && p.status !== 'declined'))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  // 1. Fetch conversations where member is a participant (and not declined)
  const { data: myParticipations } = await dbQuery<any[]>(
    `lobby_conversation_participants?member_id=eq.${encodeURIComponent(memberId)}&status=neq.declined&select=conversation_id`
  );

  if (!myParticipations || myParticipations.length === 0) {
    return [];
  }

  const convIds = myParticipations.map((p) => p.conversation_id);
  const convIdsParam = convIds.map((id) => `"${id}"`).join(',');

  // 2. Fetch conversations details
  const { data: convRows } = await dbQuery<any[]>(
    `lobby_conversations?id=in.(${convIdsParam})&order=last_message_at.desc`
  );

  if (!convRows || convRows.length === 0) {
    return [];
  }

  // 3. Fetch all participants for these conversations
  const { data: allParticipants } = await dbQuery<any[]>(
    `lobby_conversation_participants?conversation_id=in.(${convIdsParam})&select=*`
  );

  const participantsByConv = new Map<string, any[]>();
  (allParticipants || []).forEach((p) => {
    if (!participantsByConv.has(p.conversation_id)) {
      participantsByConv.set(p.conversation_id, []);
    }
    participantsByConv.get(p.conversation_id)!.push(p);
  });

  return convRows.map((conv) => mapConversationRow(conv, participantsByConv.get(conv.id) || []));
}

export async function getConversationById(conversationId: string, memberId: string): Promise<Conversation | undefined> {
  if (!isDbConfigured()) {
    const conv = TEST_CONVERSATIONS.get(conversationId);
    if (!conv) return undefined;
    const isParticipant = conv.participants.some((p) => p.memberId === memberId);
    if (!isParticipant) {
      throw new Error('Unauthorized: You are not a participant in this conversation');
    }
    return conv;
  }

  // 1. Fetch conversation
  const { data: convRows } = await dbQuery<any[]>(
    `lobby_conversations?id=eq.${encodeURIComponent(conversationId)}&select=*`
  );

  if (!convRows || convRows.length === 0) {
    return undefined;
  }

  // 2. Fetch participants
  const { data: participantRows } = await dbQuery<any[]>(
    `lobby_conversation_participants?conversation_id=eq.${encodeURIComponent(conversationId)}&select=*`
  );

  const participants = participantRows || [];
  const isParticipant = participants.some((p) => p.member_id === memberId);
  if (!isParticipant) {
    throw new Error('Unauthorized: You are not a participant in this conversation');
  }

  return mapConversationRow(convRows[0], participants);
}

export async function getConversationMessages(conversationId: string, memberId: string): Promise<DirectMessage[]> {
  // Validate participant access first
  const conv = await getConversationById(conversationId, memberId);
  if (!conv) {
    throw new Error('Unauthorized: Access denied');
  }

  if (!isDbConfigured()) {
    const msgs = TEST_DIRECT_MESSAGES.get(conversationId) || [];
    return msgs.filter((m) => m.moderationState === 'published');
  }

  const { data: messageRows } = await dbQuery<any[]>(
    `lobby_direct_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&moderation_state=eq.published&order=created_at.asc`
  );

  return (messageRows || []).map(mapMessageRow);
}

// ----------------------------------------------------------------------------
// Conversation Creation & Message Dispatch
// ----------------------------------------------------------------------------

export async function startOrGetDirectConversation(
  sender: { id: string; name: string; headline?: string; company?: string; avatarUrl?: string },
  recipient: { id: string; name: string; headline?: string; company?: string; avatarUrl?: string },
  initialMessageText: string
): Promise<{ conversation: Conversation; message: DirectMessage }> {
  // Enforce block check before creating or retrieving thread
  if (await isMemberBlocked(sender.id, recipient.id)) {
    throw new Error('Unable to message this member due to privacy or block restrictions');
  }

  const now = new Date().toISOString();

  if (!isDbConfigured()) {
    let existing = Array.from(TEST_CONVERSATIONS.values()).find(
      (c) =>
        c.type === 'direct' &&
        c.participants.some((p) => p.memberId === sender.id) &&
        c.participants.some((p) => p.memberId === recipient.id)
    );

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
            memberAvatarUrl: sender.avatarUrl,
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
            memberAvatarUrl: recipient.avatarUrl,
            status: 'pending_request',
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
      TEST_CONVERSATIONS.set(convId, existing);
      TEST_DIRECT_MESSAGES.set(convId, []);
    }

    const msgId = `dm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const message: DirectMessage = {
      id: msgId,
      conversationId: existing.id,
      authorMemberId: sender.id,
      authorName: sender.name,
      authorAvatarUrl: sender.avatarUrl,
      body: initialMessageText.trim(),
      createdAt: now,
      moderationState: 'published',
    };

    const msgs = TEST_DIRECT_MESSAGES.get(existing.id) || [];
    msgs.push(message);
    TEST_DIRECT_MESSAGES.set(existing.id, msgs);

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

  // 1. Check if direct conversation already exists between these 2 members in DB
  const { data: senderConvs } = await dbQuery<any[]>(
    `lobby_conversation_participants?member_id=eq.${encodeURIComponent(sender.id)}&select=conversation_id`
  );

  let existingConvId: string | null = null;
  if (senderConvs && senderConvs.length > 0) {
    const candidateIds = senderConvs.map((c) => `"${c.conversation_id}"`).join(',');
    const { data: sharedConvs } = await dbQuery<any[]>(
      `lobby_conversation_participants?member_id=eq.${encodeURIComponent(recipient.id)}&conversation_id=in.(${candidateIds})&select=conversation_id`
    );
    if (sharedConvs && sharedConvs.length > 0) {
      // Verify conversation type is direct
      const { data: directCheck } = await dbQuery<any[]>(
        `lobby_conversations?id=eq.${encodeURIComponent(sharedConvs[0].conversation_id)}&type=eq.direct&select=id`
      );
      if (directCheck && directCheck.length > 0) {
        existingConvId = directCheck[0].id;
      }
    }
  }

  let conversationId = existingConvId;

  if (!conversationId) {
    // Create new conversation
    conversationId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await dbQuery('lobby_conversations', {
      method: 'POST',
      body: {
        id: conversationId,
        type: 'direct',
        created_at: now,
        updated_at: now,
        last_message_at: now,
        last_message_preview: initialMessageText.slice(0, 80),
        last_message_author_name: sender.name,
      },
    });

    // Insert participants
    await dbQuery('lobby_conversation_participants', {
      method: 'POST',
      body: [
        {
          conversation_id: conversationId,
          member_id: sender.id,
          member_name: sender.name,
          member_headline: sender.headline || null,
          member_company: sender.company || null,
          member_avatar_url: sender.avatarUrl || null,
          status: 'accepted',
          joined_at: now,
          last_read_at: now,
          muted: false,
          archived: false,
        },
        {
          conversation_id: conversationId,
          member_id: recipient.id,
          member_name: recipient.name,
          member_headline: recipient.headline || null,
          member_company: recipient.company || null,
          member_avatar_url: recipient.avatarUrl || null,
          status: 'pending_request', // Recipient must accept request
          joined_at: now,
          last_read_at: now,
          muted: false,
          archived: false,
        },
      ],
    });
  }

  // Insert initial message
  const msgId = `dm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const messageData = {
    id: msgId,
    conversation_id: conversationId,
    author_member_id: sender.id,
    author_name: sender.name,
    author_avatar_url: sender.avatarUrl || null,
    body: initialMessageText.trim(),
    created_at: now,
    moderation_state: 'published',
  };

  await dbQuery('lobby_direct_messages', {
    method: 'POST',
    body: messageData,
  });

  // Update conversation last_message
  await dbQuery(`lobby_conversations?id=eq.${encodeURIComponent(conversationId)}`, {
    method: 'PATCH',
    body: {
      last_message_at: now,
      last_message_preview: initialMessageText.slice(0, 80),
      last_message_author_name: sender.name,
      updated_at: now,
    },
  });

  const message: DirectMessage = mapMessageRow(messageData);
  const conversation = (await getConversationById(conversationId, sender.id))!;

  // Broadcast in-process event
  broadcastDMEvent(conversationId, {
    type: 'new_message',
    data: message,
  });

  return { conversation, message };
}

export async function sendDirectMessage(
  conversationId: string,
  authorMemberId: string,
  authorName: string,
  body: string,
  authorAvatarUrl?: string
): Promise<DirectMessage> {
  const conv = await getConversationById(conversationId, authorMemberId);
  if (!conv) throw new Error('Conversation not found');

  const me = conv.participants.find((p) => p.memberId === authorMemberId);
  if (!me) throw new Error('Unauthorized');

  // Check if other participant blocked
  const other = conv.participants.find((p) => p.memberId !== authorMemberId);
  if (other && (await isMemberBlocked(authorMemberId, other.memberId))) {
    throw new Error('Cannot send message: conversation blocked');
  }

  const now = new Date().toISOString();
  const id = `dm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const message: DirectMessage = {
    id,
    conversationId,
    authorMemberId,
    authorName,
    authorAvatarUrl: authorAvatarUrl || me.memberAvatarUrl,
    body: body.trim(),
    createdAt: now,
    moderationState: 'published',
  };

  if (!isDbConfigured()) {
    const msgs = TEST_DIRECT_MESSAGES.get(conversationId) || [];
    msgs.push(message);
    TEST_DIRECT_MESSAGES.set(conversationId, msgs);

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

  // 1. Insert message into PostgreSQL
  await dbQuery('lobby_direct_messages', {
    method: 'POST',
    body: {
      id,
      conversation_id: conversationId,
      author_member_id: authorMemberId,
      author_name: authorName,
      author_avatar_url: authorAvatarUrl || me.memberAvatarUrl || null,
      body: body.trim(),
      created_at: now,
      moderation_state: 'published',
    },
  });

  // 2. Update conversation header
  await dbQuery(`lobby_conversations?id=eq.${encodeURIComponent(conversationId)}`, {
    method: 'PATCH',
    body: {
      last_message_at: now,
      last_message_preview: body.slice(0, 80),
      last_message_author_name: authorName,
      updated_at: now,
    },
  });

  broadcastDMEvent(conversationId, {
    type: 'new_message',
    data: message,
  });

  return message;
}

export async function updateParticipantStatus(
  conversationId: string,
  memberId: string,
  status: ParticipantStatus
): Promise<Conversation> {
  const conv = await getConversationById(conversationId, memberId);
  if (!conv) throw new Error('Conversation not found');

  const p = conv.participants.find((x) => x.memberId === memberId);
  if (!p) throw new Error('Participant not found');

  // If status is 'blocked', also record in lobby_member_blocks for both ways safety
  if (status === 'blocked') {
    const other = conv.participants.find((x) => x.memberId !== memberId);
    if (other) {
      await blockMember(memberId, other.memberId);
    }
  }

  const now = new Date().toISOString();

  if (!isDbConfigured()) {
    p.status = status;
    conv.updatedAt = now;

    broadcastDMEvent(conversationId, {
      type: 'request_status_changed',
      data: { memberId, status },
    });

    return conv;
  }

  // 1. Update participant status
  await dbQuery(
    `lobby_conversation_participants?conversation_id=eq.${encodeURIComponent(conversationId)}&member_id=eq.${encodeURIComponent(memberId)}`,
    {
      method: 'PATCH',
      body: {
        status,
      },
    }
  );

  // 2. Update conversation updated_at
  await dbQuery(`lobby_conversations?id=eq.${encodeURIComponent(conversationId)}`, {
    method: 'PATCH',
    body: {
      updated_at: now,
    },
  });

  broadcastDMEvent(conversationId, {
    type: 'request_status_changed',
    data: { memberId, status },
  });

  return (await getConversationById(conversationId, memberId))!;
}

// ----------------------------------------------------------------------------
// SSE Real-Time PubSub Engine
// ----------------------------------------------------------------------------

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
