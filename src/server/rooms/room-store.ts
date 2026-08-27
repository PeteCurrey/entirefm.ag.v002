import { Room, RoomMessage, RoomSSEEvent } from './types';

// In-memory Room store & message histories
const ROOMS_STORE: Map<string, Room> = new Map();
const ROOM_MESSAGES: Map<string, RoomMessage[]> = new Map(); // roomSlug -> messages[]

// SSE listener connections: roomSlug -> Set<ReadableStreamController>
type Listener = (event: RoomSSEEvent) => void;
const ROOM_LISTENERS: Map<string, Set<Listener>> = new Map();

function seedInitialRooms() {
  if (ROOMS_STORE.size > 0) return;

  const now = new Date().toISOString();

  const rooms: Room[] = [
    {
      id: 'room-01',
      slug: 'fm-general',
      name: 'FM General Roundtable',
      description: 'Open professional discussion on estate management, leadership, FM strategy, and daily operations.',
      topic: 'General FM',
      type: 'topic',
      visibility: 'public_readable',
      status: 'active',
      activePresenceCount: 14,
      totalMessagesCount: 42,
      lastActivityAt: now,
      guidelinesPrompt: 'Keep commercial and site-specific client identities confidential.',
    },
    {
      id: 'room-02',
      slug: 'building-safety',
      name: 'Building Safety & Golden Thread',
      description: 'Accountable Person responsibilities, mandatory occurrence reporting, fire doors, and BSA compliance.',
      topic: 'Building Safety',
      type: 'topic',
      visibility: 'public_readable',
      status: 'active',
      activePresenceCount: 22,
      totalMessagesCount: 88,
      lastActivityAt: now,
      guidelinesPrompt: 'Strictly cite statutory sources (BSR, Gov.uk, BSA 2022) where applicable.',
    },
    {
      id: 'room-03',
      slug: 'engineering-me',
      name: 'Engineering & M&E Plant',
      description: 'Chillers, AHUs, boilers, BMS optimisation, electrical distribution, and hard FM troubleshooting.',
      topic: 'Engineering & M&E',
      type: 'topic',
      visibility: 'public_readable',
      status: 'active',
      activePresenceCount: 18,
      totalMessagesCount: 65,
      lastActivityAt: now,
      guidelinesPrompt: 'Share practical field engineering insight; avoid speculative guidance.',
    },
    {
      id: 'room-04',
      slug: 'fm-technology-ai',
      name: 'FM Technology & Applied AI',
      description: 'CAFM integrations, telemetry, IoT sensors, automation, data hygiene, and AI field tools.',
      topic: 'CAFM & Technology',
      type: 'topic',
      visibility: 'public_readable',
      status: 'active',
      activePresenceCount: 9,
      totalMessagesCount: 34,
      lastActivityAt: now,
      guidelinesPrompt: 'Discuss real operational implementations and ROI rather than marketing hype.',
    },
    {
      id: 'room-05',
      slug: 'contractor-desk',
      name: 'The Contractor Desk Live',
      description: 'Specialist MEP and soft services contractor roundtable: RAMS, job proof, mobilization, and supplier challenges.',
      topic: 'Contractor Management',
      type: 'topic',
      visibility: 'public_readable',
      status: 'active',
      activePresenceCount: 11,
      totalMessagesCount: 52,
      lastActivityAt: now,
      guidelinesPrompt: 'No commercial job-order or operational client data. Focus on industry standards.',
    },
    {
      id: 'room-06',
      slug: 'careers-mentoring',
      name: 'Careers & Mentoring',
      description: 'IWFM/CIBSE pathways, engineering-to-management transitions, apprenticeships, and talent development.',
      topic: 'Professional Development',
      type: 'topic',
      visibility: 'public_readable',
      status: 'active',
      activePresenceCount: 7,
      totalMessagesCount: 28,
      lastActivityAt: now,
      guidelinesPrompt: 'Support peers with constructive guidance and mentoring insight.',
    },
  ];

  rooms.forEach((r) => ROOMS_STORE.set(r.slug, r));

  // Seed sample messages for Building Safety room
  const bsMessages: RoomMessage[] = [
    {
      id: 'msg-bs-01',
      roomId: 'room-02',
      roomSlug: 'building-safety',
      authorMemberId: 'mem-seed-saf-01',
      authorName: 'Sarah Jenkins',
      authorHeadline: 'Head of Building Safety & Compliance',
      authorCompany: 'Prime Estate Governance',
      authorBadge: 'Compliance Lead',
      body: 'Quick question for those managing mixed-use commercial/residential towers: how are you recording tenant alterations that breach fire compartmentation within the 48-hour mandatory occurrence window?',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      moderationState: 'published',
    },
    {
      id: 'msg-bs-02',
      roomId: 'room-02',
      roomSlug: 'building-safety',
      authorMemberId: 'mem-00000000-0000-4000-8000-000000000001',
      authorName: 'Pete Currey',
      authorHeadline: 'Managing Director & Hard FM Specialist',
      authorCompany: 'EntireFM',
      authorBadge: 'Founding Member',
      isEntireFMOfficial: true,
      body: 'We route any compartmentation compromise straight into our statutory incident log. If it directly impairs escape routes or active suppression, it gets flagged for immediate BSR notification before remedial works commence.',
      createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
      replyToMessageId: 'msg-bs-01',
      replyToSnippet: 'Sarah Jenkins: Quick question for those managing mixed-use commercial...',
      moderationState: 'published',
    },
    {
      id: 'msg-bs-03',
      roomId: 'room-02',
      roomSlug: 'building-safety',
      authorMemberId: 'mem-seed-eng-01',
      authorName: 'Marcus Vance',
      authorHeadline: 'Senior Mechanical Engineer | CEng MCIBSE',
      authorCompany: 'Vance Engineering Associates',
      authorBadge: 'Verified Practitioner',
      body: 'Agreed. Make sure your fire damper testing drop-test certificates are linked to the specific riser penetration reference in your Golden Thread register, not just a generic pass/fail sheet.',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      moderationState: 'published',
    },
  ];

  ROOM_MESSAGES.set('building-safety', bsMessages);
}

seedInitialRooms();

export function getAllRooms(): Room[] {
  return Array.from(ROOMS_STORE.values());
}

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS_STORE.get(slug);
}

export function getRoomMessages(roomSlug: string, limit = 50): RoomMessage[] {
  const msgs = ROOM_MESSAGES.get(roomSlug) || [];
  return msgs
    .filter((m) => m.moderationState === 'published')
    .slice(-limit);
}

export function postRoomMessage(data: {
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
}): RoomMessage {
  const room = ROOMS_STORE.get(data.roomSlug);
  if (!room) throw new Error('Room not found');
  if (room.status === 'locked' || room.status === 'archived') {
    throw new Error('Room is not accepting new messages');
  }

  const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const message: RoomMessage = {
    id,
    roomId: room.id,
    roomSlug: room.slug,
    authorMemberId: data.authorMemberId,
    authorName: data.authorName,
    authorHeadline: data.authorHeadline,
    authorCompany: data.authorCompany,
    authorAvatarUrl: data.authorAvatarUrl,
    authorBadge: data.authorBadge,
    isEntireFMOfficial: data.isEntireFMOfficial,
    body: data.body.trim(),
    createdAt: now,
    replyToMessageId: data.replyToMessageId,
    replyToSnippet: data.replyToSnippet,
    moderationState: 'published',
  };

  const existing = ROOM_MESSAGES.get(data.roomSlug) || [];
  existing.push(message);
  ROOM_MESSAGES.set(data.roomSlug, existing);

  room.totalMessagesCount += 1;
  room.lastActivityAt = now;

  // Broadcast to all active SSE subscribers
  broadcastRoomEvent(data.roomSlug, {
    type: 'message',
    data: message,
  });

  return message;
}

export function subscribeToRoomEvents(roomSlug: string, listener: Listener): () => void {
  if (!ROOM_LISTENERS.has(roomSlug)) {
    ROOM_LISTENERS.set(roomSlug, new Set());
  }

  const set = ROOM_LISTENERS.get(roomSlug)!;
  set.add(listener);

  // Update room active presence count
  const room = ROOMS_STORE.get(roomSlug);
  if (room) {
    room.activePresenceCount = Math.max(room.activePresenceCount, set.size);
    broadcastRoomEvent(roomSlug, {
      type: 'presence',
      data: { count: room.activePresenceCount },
    });
  }

  return () => {
    set.delete(listener);
    if (room) {
      room.activePresenceCount = set.size;
      broadcastRoomEvent(roomSlug, {
        type: 'presence',
        data: { count: room.activePresenceCount },
      });
    }
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
