/**
 * ENTIREFM CENTRAL NOTIFICATIONS SERVICE
 * ======================================
 * Central event-driven notification hub for EntireFM Admin.
 * Aggregates inbound sales leads, SLA risks, compliance events,
 * and operational workflows with durable persistence and deduplication.
 */

import { dbQuery, isDbConfigured } from '../db/client';
import { NotificationRecord, NotificationCategory, NotificationSeverity, NotificationType, NotificationCounts } from './types';
import { listExtendedLeads } from '../growth/store';
import { listActiveSLARisks, listWorkOrders } from '../work';
import { listComplianceObligations } from '../compliance';
export { formatRelativeNotificationTime, formatExactNotificationDateTime } from './formatTime';

class MemoryNotificationStore {
  public notifications: Map<string, NotificationRecord> = new Map();
}

export const notificationMemoryStore = new MemoryNotificationStore();

/**
 * Helper to generate unique notification ID
 */
function generateNotificationId(): string {
  return `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

/**
 * Helper to check if string is valid UUID
 */
function isValidUuid(val?: string | null): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

/**
 * Map high-level notification type to DB check constraint values:
 * 'ASSIGNMENT_OFFERED','ASSIGNMENT_CHANGED','VISIT_ASSIGNED',
 * 'COMPLETION_REJECTED','COMPLETION_ACCEPTED','SCHEDULE_CHANGED',
 * 'URGENT_WORK_ORDER','SLA_ESCALATION','COMPLIANCE_EXPIRY','MESSAGE_RECEIVED'
 */
function mapToDbNotificationType(type: NotificationType, severity: NotificationSeverity): string {
  if (type === 'URGENT_WORK_ORDER' || type === 'EMERGENCY_WORK_ORDER' || severity === 'CRITICAL') {
    return 'URGENT_WORK_ORDER';
  }
  if (type === 'NEW_WORK_ORDER') {
    return 'URGENT_WORK_ORDER';
  }
  if (type === 'SLA_RISK' || type === 'SLA_BREACH') {
    return 'SLA_ESCALATION';
  }
  if (type === 'COMPLIANCE_EXPIRING' || type === 'COMPLIANCE_OVERDUE') {
    return 'COMPLIANCE_EXPIRY';
  }
  return 'MESSAGE_RECEIVED';
}

/**
 * Create or upsert a notification with deduplication.
 * Preserves canonical created_at timestamp.
 */
export async function createNotification(input: {
  audience?: string;
  type: NotificationType;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  message: string;
  entity_type: 'lead' | 'work_order' | 'compliance_obligation' | 'invoice' | 'quote' | 'system';
  entity_id: string;
  action_url: string;
  recipient_person_id?: string;
  metadata?: Record<string, any>;
  dedupe_key?: string;
  created_at?: string;
}): Promise<NotificationRecord> {
  const dedupeKey = input.dedupe_key || `${input.entity_type}:${input.entity_id}:${input.type}`;

  // Check if notification with same dedupe_key already exists in memory
  for (const existing of notificationMemoryStore.notifications.values()) {
    if (existing.dedupe_key === dedupeKey) {
      // If unread, don't duplicate and preserve its original created_at
      if (!existing.is_read) {
        return existing;
      }
    }
  }

  const canonicalCreatedAt = input.created_at && !isNaN(new Date(input.created_at).getTime())
    ? new Date(input.created_at).toISOString()
    : new Date().toISOString();

  const notification: NotificationRecord = {
    id: generateNotificationId(),
    audience: input.audience || 'ADMIN',
    type: input.type,
    category: input.category,
    severity: input.severity,
    title: input.title,
    message: input.message,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    action_url: input.action_url,
    is_read: false,
    created_at: canonicalCreatedAt,
    read_at: null,
    metadata: input.metadata || {},
    dedupe_key: dedupeKey,
  };

  // 1. Save to memory store
  notificationMemoryStore.notifications.set(notification.id, notification);

  // 2. Save to Supabase if configured (matching the actual table schema in migration 0008)
  if (isDbConfigured()) {
    try {
      const recipientId = isValidUuid(input.recipient_person_id)
        ? input.recipient_person_id
        : '00000000-0000-0000-0000-000000000001'; // Default system actor person

      const dbRecord: Record<string, any> = {
        recipient_person_id: recipientId,
        notification_type: mapToDbNotificationType(notification.type, notification.severity),
        title: notification.title,
        body: notification.message,
        related_entity_type: notification.entity_type,
        related_entity_id: isValidUuid(notification.entity_id) ? notification.entity_id : null,
        is_read: false,
        created_at: notification.created_at,
      };

      await dbQuery('notifications', {
        method: 'POST',
        body: dbRecord,
      });
    } catch (err) {
      console.warn('[NOTIFICATIONS_STORE_WARN] Supabase sync failed, retained in memory', err);
    }
  }

  return notification;
}


/**
 * List notifications with filtering
 */
export async function listNotifications(options: {
  category?: NotificationCategory | 'ALL';
  unreadOnly?: boolean;
  audience?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<NotificationRecord[]> {
  const limit = options.limit || 50;

  // Run a quick operational sync first to pull latest events
  await syncOperationalNotifications().catch(() => {});

  let list = Array.from(notificationMemoryStore.notifications.values());

  if (isDbConfigured()) {
    try {
      let q = 'notifications?select=id,recipient_person_id,notification_type,title,body,related_entity_type,related_entity_id,is_read,read_at,created_at&order=created_at.desc';
      if (options.unreadOnly) {
        q += '&is_read=eq.false';
      }
      q += `&limit=${limit}`;

      const { data } = await dbQuery<any[]>(q);
      if (data && data.length > 0) {
        // Merge into memory store
        for (const r of data) {
          const isWorkOrder = r.related_entity_type === 'work_order';
          const isCompliance = r.related_entity_type === 'compliance_obligation' || r.notification_type === 'COMPLIANCE_EXPIRY';
          const category: NotificationCategory = isWorkOrder
            ? 'OPERATIONS'
            : isCompliance
            ? 'COMPLIANCE'
            : 'SYSTEM';

          const isUrgent = r.notification_type === 'URGENT_WORK_ORDER';
          const severity: NotificationSeverity = isUrgent
            ? 'CRITICAL'
            : r.notification_type === 'SLA_ESCALATION'
            ? 'WARNING'
            : 'INFO';

          const actionUrl = isWorkOrder && r.related_entity_id
            ? `/admin/operations/work-orders/${r.related_entity_id}`
            : isCompliance
            ? '/admin/compliance/obligations'
            : '/admin';

          const record: NotificationRecord = {
            id: r.id,
            audience: 'ADMIN',
            type: (r.notification_type as any) || 'SYSTEM_ALERT',
            category,
            severity,
            title: r.title,
            message: r.body || r.title,
            entity_type: r.related_entity_type || 'system',
            entity_id: r.related_entity_id || '',
            action_url: actionUrl,
            is_read: Boolean(r.is_read),
            created_at: r.created_at,
            read_at: r.read_at || null,
            metadata: {},
            dedupe_key: `db:${r.id}`,
          };
          if (!notificationMemoryStore.notifications.has(record.id)) {
            notificationMemoryStore.notifications.set(record.id, record);
          }
        }
        list = Array.from(notificationMemoryStore.notifications.values());
      }
    } catch (e) {
      console.warn('[NOTIFICATIONS_LIST_WARN] DB fetch failed, using memory', e);
    }
  }

  // Filter in-memory list
  if (options.category && options.category !== 'ALL') {
    list = list.filter((n) => n.category === options.category);
  }
  if (options.unreadOnly) {
    list = list.filter((n) => !n.is_read);
  }

  // Sort descending by created_at
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return list.slice(0, limit);
}

/**
 * Mark a single notification as read
 */
export async function markNotificationRead(id: string): Promise<boolean> {
  const existing = notificationMemoryStore.notifications.get(id);
  const now = new Date().toISOString();

  if (existing) {
    existing.is_read = true;
    existing.read_at = now;
    notificationMemoryStore.notifications.set(id, existing);
  }

  if (isDbConfigured()) {
    try {
      await dbQuery(`notifications?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: { is_read: true, read_at: now },
      });
    } catch (e) {
      console.warn('[NOTIFICATIONS_MARK_READ_WARN]', e);
    }
  }

  return true;
}

/**
 * Mark all notifications as read (optionally by category)
 */
export async function markAllNotificationsRead(category?: NotificationCategory | 'ALL'): Promise<boolean> {
  const now = new Date().toISOString();

  for (const [id, item] of notificationMemoryStore.notifications.entries()) {
    if (!category || category === 'ALL' || item.category === category) {
      item.is_read = true;
      item.read_at = now;
      notificationMemoryStore.notifications.set(id, item);
    }
  }

  if (isDbConfigured()) {
    try {
      let endpoint = 'notifications?is_read=eq.false';
      if (category && category !== 'ALL') {
        endpoint += `&category=eq.${category}`;
      }
      await dbQuery(endpoint, {
        method: 'PATCH',
        body: { is_read: true, read_at: now },
      });
    } catch (e) {
      console.warn('[NOTIFICATIONS_MARK_ALL_READ_WARN]', e);
    }
  }

  return true;
}

/**
 * Get notification counts (unread total, unread by category, and new unprocessed leads)
 */
export async function getNotificationCounts(): Promise<NotificationCounts> {
  const allNotifs = Array.from(notificationMemoryStore.notifications.values());
  const unreadNotifs = allNotifs.filter((n) => !n.is_read);

  const unreadByCat: Record<string, number> = {
    LEADS: 0,
    OPERATIONS: 0,
    COMPLIANCE: 0,
    FINANCE: 0,
    SYSTEM: 0,
  };

  for (const n of unreadNotifs) {
    if (unreadByCat[n.category] !== undefined) {
      unreadByCat[n.category]++;
    }
  }

  // Count unprocessed new leads
  let newLeadsCount = 0;
  try {
    const { leads } = await listExtendedLeads({ limit: 200 });
    newLeadsCount = leads.filter(
      (l) => !l.qualification_status || l.qualification_status === 'NEW' || (l as any).status === 'NEW'
    ).length;
  } catch (e) {
    newLeadsCount = 0;
  }

  return {
    unreadTotal: unreadNotifs.length,
    newLeadsCount,
    unreadByCat,
  };
}

/**
 * Scan database for real operational alerts (SLA risks, overdue compliance, new leads)
 * and generate deduplicated notifications.
 */
export async function syncOperationalNotifications(): Promise<void> {
  try {
    // 1. Sync Inbound Leads
    const { leads } = await listExtendedLeads({ limit: 30 });
    for (const lead of leads) {
      const isNew = !lead.qualification_status || lead.qualification_status === 'NEW' || (lead as any).status === 'NEW';
      if (isNew) {
        const leadId = lead.enquiry_id || lead.id;
        await createNotification({
          type: 'NEW_ENQUIRY',
          category: 'LEADS',
          severity: 'ATTENTION',
          title: `New Enquiry: ${lead.service || 'General FM'}`,
          message: `Inbound enquiry from ${lead.company || lead.name} (${lead.location || 'UK'}).`,
          entity_type: 'lead',
          entity_id: leadId,
          action_url: `/admin/growth/leads/${leadId}`,
          dedupe_key: `lead:${leadId}:new`,
          created_at: lead.received_at || (lead as any).created_at,
          metadata: {
            email: lead.email,
            phone: lead.phone,
            source: lead.conversion_page || lead.form_page || lead.landing_page,
          },
        });
      }
    }

    // 2. Sync Active SLA Risks & Breaches
    const activeSlaRisks = await listActiveSLARisks().catch(() => []);
    const now = Date.now();

    for (const wo of activeSlaRisks) {
      if (wo.sla_resolution_due_at) {
        const dueTime = new Date(wo.sla_resolution_due_at).getTime();
        const diffMins = Math.round((dueTime - now) / 60000);
        const woTimestamp = (wo as any).created_at || (wo as any).updated_at || new Date().toISOString();

        if (diffMins < 0) {
          // Breached
          await createNotification({
            type: 'SLA_BREACH',
            category: 'OPERATIONS',
            severity: 'CRITICAL',
            title: `SLA Breached: ${wo.work_order_number || wo.id}`,
            message: `Work Order ${wo.work_order_number || wo.id} for ${(wo as any).site?.name || 'Site'} exceeded resolution SLA by ${Math.abs(diffMins)} mins.`,
            entity_type: 'work_order',
            entity_id: wo.id,
            action_url: `/admin/operations/work-orders/${wo.id}`,
            dedupe_key: `workorder:${wo.id}:sla-breached`,
            created_at: woTimestamp,
            metadata: { priority: wo.priority, siteName: (wo as any).site?.name },
          });
        } else if (diffMins <= 60) {
          // Approaching breach (under 60 mins remaining)
          await createNotification({
            type: 'SLA_RISK',
            category: 'OPERATIONS',
            severity: 'WARNING',
            title: `SLA Risk: ${wo.work_order_number || wo.id}`,
            message: `${wo.work_order_number || wo.id} has only ${diffMins} minutes remaining before SLA breach.`,
            entity_type: 'work_order',
            entity_id: wo.id,
            action_url: `/admin/operations/work-orders/${wo.id}`,
            dedupe_key: `workorder:${wo.id}:sla-risk`,
            created_at: woTimestamp,
            metadata: { minsRemaining: diffMins, priority: wo.priority },
          });
        }
      }
    }

    // 3. Sync Compliance Obligations
    const obligations = await listComplianceObligations().catch(() => []);
    for (const ob of obligations) {
      const obTitle = ob.asset?.name || `Obligation #${ob.id.slice(0, 8)}`;
      const obTimestamp = (ob as any).created_at || (ob as any).updated_at || new Date().toISOString();
      if (ob.status === 'OVERDUE') {
        await createNotification({
          type: 'COMPLIANCE_OVERDUE',
          category: 'COMPLIANCE',
          severity: 'CRITICAL',
          title: `Statutory Inspection Overdue: ${obTitle}`,
          message: `Statutory compliance obligation for site ${ob.site?.name || ob.site_id} is overdue.`,
          entity_type: 'compliance_obligation',
          entity_id: ob.id,
          action_url: `/admin/compliance/obligations`,
          dedupe_key: `compliance:${ob.id}:overdue`,
          created_at: obTimestamp,
        });
      } else if (ob.status === 'DUE_SOON' || ob.status === 'DUE') {
        await createNotification({
          type: 'COMPLIANCE_EXPIRING',
          category: 'COMPLIANCE',
          severity: 'WARNING',
          title: `Compliance Due Soon: ${obTitle}`,
          message: `Statutory obligation for site ${ob.site?.name || ob.site_id} is due for periodic inspection.`,
          entity_type: 'compliance_obligation',
          entity_id: ob.id,
          action_url: `/admin/compliance/obligations`,
          dedupe_key: `compliance:${ob.id}:due-soon`,
          created_at: obTimestamp,
        });
      }
    }

    // 4. Sync Recent Work Orders (New jobs logged within operational window)
    const recentWorkOrders = await listWorkOrders({ limit: 25 }).catch(() => []);
    for (const wo of recentWorkOrders) {
      const isUrgent = wo.priority === 'P1_CRITICAL';
      const woTimestamp = (wo as any).created_at || (wo as any).updated_at || new Date().toISOString();
      const siteName = (wo as any).site?.name || 'Site';
      const title = wo.title || 'Service Request';

      await createNotification({
        type: isUrgent ? 'URGENT_WORK_ORDER' : 'NEW_WORK_ORDER',
        category: 'OPERATIONS',
        severity: isUrgent ? 'CRITICAL' : wo.priority === 'P2_HIGH' ? 'WARNING' : 'ATTENTION',
        title: isUrgent
          ? `🚨 Emergency Job: ${wo.work_order_number || wo.id.slice(0, 8)}`
          : `New Job Logged: ${wo.work_order_number || wo.id.slice(0, 8)}`,
        message: `${wo.work_order_number || wo.id.slice(0, 8)} at ${siteName} (${wo.priority}) — ${title}`,
        entity_type: 'work_order',
        entity_id: wo.id,
        action_url: `/admin/operations/work-orders/${wo.id}`,
        dedupe_key: `workorder:${wo.id}:created`,
        created_at: woTimestamp,
        metadata: {
          work_order_number: wo.work_order_number,
          priority: wo.priority,
          site_id: wo.site_id,
          site_name: siteName,
        },
      });
    }
  } catch (err) {
    console.warn('[NOTIFICATIONS_SYNC_WARN]', err);
  }
}
