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
 * Create or upsert a notification with deduplication
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
  metadata?: Record<string, any>;
  dedupe_key?: string;
}): Promise<NotificationRecord> {
  const dedupeKey = input.dedupe_key || `${input.entity_type}:${input.entity_id}:${input.type}`;

  // Check if notification with same dedupe_key already exists in memory
  for (const existing of notificationMemoryStore.notifications.values()) {
    if (existing.dedupe_key === dedupeKey) {
      // If unread, don't duplicate
      if (!existing.is_read) {
        return existing;
      }
    }
  }

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
    created_at: new Date().toISOString(),
    read_at: null,
    metadata: input.metadata || {},
    dedupe_key: dedupeKey,
  };

  // 1. Save to memory store
  notificationMemoryStore.notifications.set(notification.id, notification);

  // 2. Save to Supabase if configured
  if (isDbConfigured()) {
    try {
      await dbQuery('notifications', {
        method: 'POST',
        body: {
          id: notification.id,
          audience: notification.audience,
          notification_type: notification.type,
          category: notification.category,
          severity: notification.severity,
          title: notification.title,
          message: notification.message,
          entity_type: notification.entity_type,
          entity_id: notification.entity_id,
          action_url: notification.action_url,
          is_read: false,
          created_at: notification.created_at,
          metadata: notification.metadata,
          dedupe_key: notification.dedupe_key,
        },
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
      let q = 'notifications?select=*&order=created_at.desc';
      if (options.category && options.category !== 'ALL') {
        q += `&category=eq.${options.category}`;
      }
      if (options.unreadOnly) {
        q += '&is_read=eq.false';
      }
      q += `&limit=${limit}`;

      const { data } = await dbQuery<any[]>(q);
      if (data && data.length > 0) {
        // Merge into memory store
        for (const r of data) {
          const record: NotificationRecord = {
            id: r.id,
            audience: r.audience || 'ADMIN',
            type: r.notification_type || r.type || 'SYSTEM_ALERT',
            category: r.category || 'SYSTEM',
            severity: r.severity || 'INFO',
            title: r.title,
            message: r.message,
            entity_type: r.entity_type || 'system',
            entity_id: r.entity_id || '',
            action_url: r.action_url || '/admin',
            is_read: Boolean(r.is_read),
            created_at: r.created_at,
            read_at: r.read_at || null,
            metadata: r.metadata || {},
            dedupe_key: r.dedupe_key || r.id,
          };
          notificationMemoryStore.notifications.set(record.id, record);
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
            metadata: { minsRemaining: diffMins, priority: wo.priority },
          });
        }
      }
    }

    // 3. Sync Compliance Obligations
    const obligations = await listComplianceObligations().catch(() => []);
    for (const ob of obligations) {
      const obTitle = ob.asset?.name || `Obligation #${ob.id.slice(0, 8)}`;
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
        });
      }
    }
  } catch (err) {
    console.warn('[NOTIFICATIONS_SYNC_WARN]', err);
  }
}
