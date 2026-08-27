export type MemberNotificationType =
  | 'community_reply'
  | 'reply_helpful'
  | 'answer_accepted'
  | 'mention'
  | 'room_mention'
  | 'message_request'
  | 'direct_message'
  | 'poll_active'
  | 'challenge_new'
  | 'compliance_alert';

export interface MemberNotification {
  id: string;
  memberId: string;
  type: MemberNotificationType;
  title: string;
  message: string;
  actionUrl: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

const NOTIFICATIONS_STORE: Map<string, MemberNotification[]> = new Map(); // memberId -> notifications[]

function seedInitialNotifications() {
  if (NOTIFICATIONS_STORE.size > 0) return;

  const now = new Date().toISOString();
  const demoMemberId = 'mem-00000000-0000-4000-8000-000000000001';

  const list: MemberNotification[] = [
    {
      id: 'notif-01',
      memberId: demoMemberId,
      type: 'answer_accepted',
      title: 'Your answer was marked as Accepted Answer',
      message: 'Marcus Vance marked your engineering insight on AHU belt frequency tensioning as the accepted solution.',
      actionUrl: '/lobby/community/discussion/ahu-belts-failing-early-alignment-tension-or-sheave-wear',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      readAt: null,
    },
    {
      id: 'notif-02',
      memberId: demoMemberId,
      type: 'reply_helpful',
      title: '7 members marked your response Helpful',
      message: 'Your practical guidance on SPB drive pulleys received 7 helpful reactions.',
      actionUrl: '/lobby/community/discussion/ahu-belts-failing-early-alignment-tension-or-sheave-wear',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      readAt: null,
    },
    {
      id: 'notif-03',
      memberId: demoMemberId,
      type: 'challenge_new',
      title: 'The Lobby Question: Week 35 Challenge Live',
      message: 'Test your technical judgement on the Saturated Insulation Water Leak scenario.',
      actionUrl: '/lobby#lobby-question',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      readAt: now,
    },
  ];

  NOTIFICATIONS_STORE.set(demoMemberId, list);
}

seedInitialNotifications();

export function getMemberNotifications(memberId: string): { notifications: MemberNotification[]; unreadCount: number } {
  const list = NOTIFICATIONS_STORE.get(memberId) || [];
  const unreadCount = list.filter((n) => !n.isRead).length;
  return {
    notifications: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    unreadCount,
  };
}

export function markNotificationAsRead(id: string, memberId: string): boolean {
  const list = NOTIFICATIONS_STORE.get(memberId) || [];
  const notif = list.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
    notif.readAt = new Date().toISOString();
    return true;
  }
  return false;
}

export function markAllNotificationsAsRead(memberId: string): void {
  const list = NOTIFICATIONS_STORE.get(memberId) || [];
  const now = new Date().toISOString();
  list.forEach((n) => {
    n.isRead = true;
    n.readAt = now;
  });
}

export function createMemberNotification(data: {
  memberId: string;
  type: MemberNotificationType;
  title: string;
  message: string;
  actionUrl: string;
}): MemberNotification {
  const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const notif: MemberNotification = {
    id,
    memberId: data.memberId,
    type: data.type,
    title: data.title,
    message: data.message,
    actionUrl: data.actionUrl,
    isRead: false,
    createdAt: new Date().toISOString(),
    readAt: null,
  };

  const list = NOTIFICATIONS_STORE.get(data.memberId) || [];
  list.unshift(notif);
  NOTIFICATIONS_STORE.set(data.memberId, list);

  return notif;
}
