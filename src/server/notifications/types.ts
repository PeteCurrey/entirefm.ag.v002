export type NotificationCategory = 'ALL' | 'LEADS' | 'OPERATIONS' | 'COMPLIANCE' | 'FINANCE' | 'SYSTEM';

export type NotificationSeverity = 'INFO' | 'ATTENTION' | 'WARNING' | 'CRITICAL';

export type NotificationType =
  | 'NEW_ENQUIRY'
  | 'LEAD_STATUS_CHANGED'
  | 'LEAD_RESPONSE_OVERDUE'
  | 'SLA_RISK'
  | 'SLA_BREACH'
  | 'PPM_OVERDUE'
  | 'WORK_ORDER_OVERDUE'
  | 'COMPLIANCE_EXPIRING'
  | 'COMPLIANCE_OVERDUE'
  | 'INVOICE_OVERDUE'
  | 'QUOTE_APPROVAL_REQUIRED'
  | 'CONTRACTOR_OVERDUE'
  | 'SYSTEM_ALERT';

export interface NotificationRecord {
  id: string;
  audience: string; // 'ADMIN' | 'OPERATIONS' | 'SALES' | 'COMPLIANCE' | 'FINANCE'
  type: NotificationType;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  message: string;
  entity_type: 'lead' | 'work_order' | 'compliance_obligation' | 'invoice' | 'quote' | 'system';
  entity_id: string;
  action_url: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
  metadata?: Record<string, any>;
  dedupe_key: string;
}

export interface NotificationCounts {
  unreadTotal: number;
  newLeadsCount: number;
  unreadByCat: Record<string, number>;
}
