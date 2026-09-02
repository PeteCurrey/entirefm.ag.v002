/**
 * ENTIREFM LOBBY LIVE ROOMS STORE — DATABASE-BACKED
 * ===================================================
 * Rooms and RoomMessages persisted via PostgREST dbQuery.
 * ROOM_LISTENERS (SSE pub/sub) remains in-process only — same pattern as DMs.
 * Every exported function signature is identical to the prior in-memory implementation.
 */

import { Room, RoomMessage, RoomSSEEvent } from './types';
import { dbQuery } from '@/server/db/client';

// ─── SSE pub/sub stays in-process (no DB needed for real-time push) ──────────
type Listener = (event: RoomSSEEvent) => void;
const ROOM_LISTENERS: Map<string, Set<Listener>> = new Map();

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapRoom(row: any): Room {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    topic: row.topic,
    type: row.type,
    visibility: row.visibility,
    status: row.status,
    activePresenceCount: row.active_presence_count ?? 0,
    totalMessagesCount: row.total_messages_count ?? 0,
    lastActivityAt: row.last_activity_at,
    scheduledStart: row.scheduled_start,
    scheduledEnd: row.scheduled_end,
    guidelinesPrompt: row.guidelines_prompt,
  };
}

function mapMessage(row: any): RoomMessage {
  return {
    id: row.id,
    roomId: row.room_id,
    roomSlug: row.room_slug,
    authorMemberId: row.author_member_id,
    authorName: row.author_name,
    authorHeadline: row.author_headline,
    authorCompany: row.author_company,
    authorAvatarUrl: row.author_avatar_url,
    authorBadge: row.author_badge,
    isEntireFMOfficial: row.is_entirefm_official,
    body: row.body,
    createdAt: row.created_at,
    editedAt: row.edited_at,
    replyToMessageId: row.reply_to_message_id,
    replyToSnippet: row.reply_to_snippet,
    moderationState: row.moderation_state,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getAllRooms(): Promise<Room[]> {
  const { data } = await dbQuery<any[]>('lobby_rooms?status=eq.active&order=id.asc');
  if (!data) return [];
  return data.map(mapRoom);
}

export async function getRoomBySlug(slug: string): Promise<Room | undefined> {
  const { data } = await dbQuery<any[]>(
    `lobby_rooms?slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  if (!data || data.length === 0) return undefined;
  return mapRoom(data[0]);
}

export async function getRoomMessages(roomSlug: string, limit = 50): Promise<RoomMessage[]> {
  const { data } = await dbQuery<any[]>(
    `lobby_room_messages?room_slug=eq.${encodeURIComponent(roomSlug)}&moderation_state=eq.published&order=created_at.asc&limit=${limit}`
  );
  if (!data) return [];
  return data.map(mapMessage);
}

export async function postRoomMessage(data: {
  roomSlug: string;
  authorMemberId: string;
  authorName: string;
  authorHeadline?: string;
  authorCompany?: string;
  authorAvatarUrl?: string;
  authorBadge?: string;
  isEntireFMOfficial?: boolean;
  body: string;
  replyToMessageId?: string;
  replyToSnippet?: string;
}): Promise<RoomMessage> {
  const room = await getRoomBySlug(data.roomSlug);
  if (!room) throw new Error('Room not found');
  if (room.status === 'locked' || room.status === 'archived') {
    throw new Error('Room is not accepting new messages');
  }

  const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const row = {
    id,
    room_id: room.id,
    room_slug: room.slug,
    author_member_id: data.authorMemberId,
    author_name: data.authorName,
    author_headline: data.authorHeadline,
    author_company: data.authorCompany,
    author_avatar_url: data.authorAvatarUrl,
    author_badge: data.authorBadge,
    is_entirefm_official: data.isEntireFMOfficial,
    body: data.body.trim(),
    created_at: now,
    reply_to_message_id: data.replyToMessageId,
    reply_to_snippet: data.replyToSnippet,
    moderation_state: 'published',
  };

  await dbQuery('lobby_room_messages', {
    method: 'POST',
    body: row,
  });

  // Update room's last_activity_at and total_messages_count
  await dbQuery(`lobby_rooms?slug=eq.${encodeURIComponent(data.roomSlug)}`, {
    method: 'PATCH',
    body: { last_activity_at: now, total_messages_count: (room.totalMessagesCount || 0) + 1 },
  });

  const message = mapMessage(row);

  // Broadcast to all active SSE subscribers for this room
  broadcastRoomEvent(data.roomSlug, {
    type: 'message',
    data: message,
  });

  return message;
}

// ─── SSE pub/sub ──────────────────────────────────────────────────────────────

export function subscribeToRoomEvents(roomSlug: string, listener: Listener): () => void {
  if (!ROOM_LISTENERS.has(roomSlug)) {
    ROOM_LISTENERS.set(roomSlug, new Set());
  }

  const set = ROOM_LISTENERS.get(roomSlug)!;
  set.add(listener);

  // Update active presence count (best-effort, in-process only)
  dbQuery(`lobby_rooms?slug=eq.${encodeURIComponent(roomSlug)}`, {
    method: 'PATCH',
    body: { active_presence_count: set.size },
  }).catch(() => {});

  broadcastRoomEvent(roomSlug, {
    type: 'presence',
    data: { count: set.size },
  });

  return () => {
    set.delete(listener);
    dbQuery(`lobby_rooms?slug=eq.${encodeURIComponent(roomSlug)}`, {
      method: 'PATCH',
      body: { active_presence_count: set.size },
    }).catch(() => {});
    broadcastRoomEvent(roomSlug, {
      type: 'presence',
      data: { count: set.size },
    });
  };
}

export function broadcastRoomEvent(roomSlug: string, event: RoomSSEEvent) {
  const set = ROOM_LISTENERS.get(roomSlug);
  if (set) {
    set.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error broadcasting SSE room event:', err);
      }
    });
  }
}
