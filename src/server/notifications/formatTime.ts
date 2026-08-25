/**
 * ENTIRECAFM CANONICAL NOTIFICATION TIME FORMATTER
 * ================================================
 * Deterministic, timezone-aware relative and exact timestamp formatting
 * for individual notification records.
 */

/**
 * Format individual notification creation timestamp into human-readable relative time.
 * 
 * Hierarchy:
 * - < 1 minute: 'Just now'
 * - 1–59 minutes: '1m ago', '8m ago', '42m ago'
 * - 1–23 hours: '1h ago', '7h ago'
 * - Yesterday (calendar day before today): 'Yesterday'
 * - 2–6 days: '2d ago', '5d ago'
 * - >= 7 days (same year): '18 Aug'
 * - Different year: '18 Aug 2025'
 */
export function formatRelativeNotificationTime(
  isoString: string | null | undefined,
  nowMs: number = Date.now()
): string {
  if (!isoString) return '';

  const date = new Date(isoString);
  const timestamp = date.getTime();
  if (isNaN(timestamp)) return '';

  const now = new Date(nowMs);
  const diffMs = nowMs - timestamp;

  // If in the future by > 30s due to minor clock skew or under 1 min, return Just now
  if (diffMs < 60000) {
    return 'Just now';
  }

  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) {
    return diffMins + 'm ago';
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return diffHours + 'h ago';
  }

  // Calculate calendar days difference in user's local timezone
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDiff = Math.round((startOfToday - startOfDateDay) / 86400000);

  if (dayDiff <= 1) {
    return 'Yesterday';
  }

  if (dayDiff >= 2 && dayDiff <= 6) {
    return dayDiff + 'd ago';
  }

  // Format as date: '18 Aug' or '18 Aug 2025'
  const isSameYear = date.getFullYear() === now.getFullYear();
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'short' });

  if (isSameYear) {
    return day + ' ' + month;
  }

  return day + ' ' + month + ' ' + date.getFullYear();
}

/**
 * Format exact timestamp for tooltips, audit logs, and detailed views.
 * Example: '25 Aug 2026, 22:47'
 */
export function formatExactNotificationDateTime(isoString: string | null | undefined): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
