import {
  formatRelativeNotificationTime,
  formatExactNotificationDateTime,
} from '../src/server/notifications/formatTime';
import {
  createNotification,
  listNotifications,
  markNotificationRead,
  notificationMemoryStore,
} from '../src/server/notifications';

async function runTests() {
  console.log('--- RUNNING NOTIFICATION TIMESTAMP AUDIT TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log('  PASS:', msg);
      passed++;
    } else {
      console.error('  FAIL:', msg);
      failed++;
    }
  }

  const baseNow = new Date('2026-08-25T23:15:00.000Z').getTime();

  // Test 1: Just now (< 1 min)
  const t20sAgo = new Date(baseNow - 20 * 1000).toISOString();
  assert(formatRelativeNotificationTime(t20sAgo, baseNow) === 'Just now', '20s ago returns Just now');

  // Test 2: Minutes ago (1-59m)
  const t2mAgo = new Date(baseNow - 2 * 60 * 1000).toISOString();
  assert(formatRelativeNotificationTime(t2mAgo, baseNow) === '2m ago', '2m ago returns 2m ago');

  const t18mAgo = new Date(baseNow - 18 * 60 * 1000).toISOString();
  assert(formatRelativeNotificationTime(t18mAgo, baseNow) === '18m ago', '18m ago returns 18m ago');

  const t42mAgo = new Date(baseNow - 42 * 60 * 1000).toISOString();
  assert(formatRelativeNotificationTime(t42mAgo, baseNow) === '42m ago', '42m ago returns 42m ago');

  // Test 3: Hours ago (1-23h)
  const t70mAgo = new Date(baseNow - 70 * 60 * 1000).toISOString();
  assert(formatRelativeNotificationTime(t70mAgo, baseNow) === '1h ago', '70m ago returns 1h ago');

  const t3hAgo = new Date(baseNow - 3 * 3600 * 1000).toISOString();
  assert(formatRelativeNotificationTime(t3hAgo, baseNow) === '3h ago', '3h ago returns 3h ago');

  // Test 4: Yesterday
  const tYesterday = new Date(baseNow - 24 * 3600 * 1000).toISOString();
  assert(formatRelativeNotificationTime(tYesterday, baseNow) === 'Yesterday', '24h ago on prior calendar day returns Yesterday');

  // Test 5: 2-6 days ago
  const t3dAgo = new Date(baseNow - 3 * 86400 * 1000).toISOString();
  assert(formatRelativeNotificationTime(t3dAgo, baseNow) === '3d ago', '3 days ago returns 3d ago');

  // Test 6: Older date (same year)
  const t18Aug = new Date('2026-08-18T10:00:00.000Z').toISOString();
  assert(formatRelativeNotificationTime(t18Aug, baseNow) === '18 Aug', '18 Aug same year returns 18 Aug');

  // Test 7: Older date (different year)
  const tLastYear = new Date('2025-08-18T10:00:00.000Z').toISOString();
  assert(formatRelativeNotificationTime(tLastYear, baseNow) === '18 Aug 2025', 'Previous year returns 18 Aug 2025');

  // Test 8: Multiple notifications with different creation timestamps
  notificationMemoryStore.notifications.clear();

  const notif1 = await createNotification({
    type: 'NEW_ENQUIRY',
    category: 'LEADS',
    severity: 'ATTENTION',
    title: 'Lead 1',
    message: 'Vic Hemmings',
    entity_type: 'lead',
    entity_id: 'enq-001',
    action_url: '/admin/growth/leads/enq-001',
    created_at: new Date(baseNow - 8 * 60 * 1000).toISOString(), // 8m ago
    dedupe_key: 'test:lead:enq-001',
  });

  const notif2 = await createNotification({
    type: 'NEW_ENQUIRY',
    category: 'LEADS',
    severity: 'ATTENTION',
    title: 'Lead 2',
    message: 'Sarah Jenkins',
    entity_type: 'lead',
    entity_id: 'enq-002',
    action_url: '/admin/growth/leads/enq-002',
    created_at: new Date(baseNow - 52 * 60 * 1000).toISOString(), // 52m ago
    dedupe_key: 'test:lead:enq-002',
  });

  const notif3 = await createNotification({
    type: 'NEW_ENQUIRY',
    category: 'LEADS',
    severity: 'ATTENTION',
    title: 'Lead 3',
    message: 'David Brown',
    entity_type: 'lead',
    entity_id: 'enq-003',
    action_url: '/admin/growth/leads/enq-003',
    created_at: new Date(baseNow - 130 * 60 * 1000).toISOString(), // 2h ago
    dedupe_key: 'test:lead:enq-003',
  });

  const notif4 = await createNotification({
    type: 'SLA_RISK',
    category: 'OPERATIONS',
    severity: 'WARNING',
    title: 'SLA Risk',
    message: 'Work order near breach',
    entity_type: 'work_order',
    entity_id: 'wo-001',
    action_url: '/admin/operations/work-orders/wo-001',
    created_at: new Date(baseNow - 20 * 3600 * 1000).toISOString(), // Yesterday
    dedupe_key: 'test:wo:wo-001',
  });

  const list = await listNotifications();
  assert(list.length >= 4, 'List returns all created notifications');

  const relTimes = [
    formatRelativeNotificationTime(notif1.created_at, baseNow),
    formatRelativeNotificationTime(notif2.created_at, baseNow),
    formatRelativeNotificationTime(notif3.created_at, baseNow),
    formatRelativeNotificationTime(notif4.created_at, baseNow),
  ];

  console.log('  Rendered relative ages for test notifications:', relTimes);
  assert(relTimes[0] === '8m ago', 'Notification 1 displays 8m ago');
  assert(relTimes[1] === '52m ago', 'Notification 2 displays 52m ago');
  assert(relTimes[2] === '2h ago', 'Notification 3 displays 2h ago');
  assert(relTimes[3] === '20h ago', 'Notification 4 displays 20h ago');

  // Verify all 4 are distinct
  const uniqueAges = new Set(relTimes);
  assert(uniqueAges.size === 4, 'All 4 notifications display distinct individual relative timestamps');

  // Test 9: Marking as read does NOT change created_at
  const originalCreatedAt = notif1.created_at;
  await markNotificationRead(notif1.id);
  const updatedNotif1 = notificationMemoryStore.notifications.get(notif1.id);
  assert(updatedNotif1?.is_read === true, 'Notification is marked read');
  assert(updatedNotif1?.created_at === originalCreatedAt, 'created_at remains strictly immutable after mark-as-read');

  // Test 10: Sorting is strictly newest first
  for (let i = 0; i < list.length - 1; i++) {
    const current = new Date(list[i].created_at).getTime();
    const next = new Date(list[i + 1].created_at).getTime();
    assert(current >= next, `Notification #${i} (${list[i].created_at}) is >= Notification #${i+1} (${list[i+1].created_at})`);
  }

  console.log();
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Test execution exception:', e);
  process.exit(1);
});
