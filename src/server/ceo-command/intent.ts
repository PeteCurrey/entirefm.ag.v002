/**
 * ENTIREFM CEO COMMAND — INTENT RESOLVER (Phase 0I)
 * ==================================================
 * Deterministic natural language intent classification and
 * date range resolution. No LLM improvisation of period boundaries.
 *
 * PROMPT INJECTION DEFENCE:
 * All operational text (imported CSV, client notes, site descriptions,
 * supplier names, compliance documents, service reports) is treated as
 * UNTRUSTED DATA. Imported text cannot override permissions, tool
 * configurations, or system instructions.
 */

import type { DateRange, QueryIntentCategory } from './types';

// ============================================================
// DATE RANGE RESOLUTION
// ============================================================

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function offsetDays(baseISO: string, days: number): string {
  const d = new Date(baseISO);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

function startOfWeek(dateISO: string): string {
  const d = new Date(dateISO);
  const dow = d.getUTCDay(); // 0 = Sunday
  const diff = dow === 0 ? -6 : 1 - dow; // Monday start
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().split('T')[0];
}

function startOfMonth(dateISO: string): string {
  return dateISO.slice(0, 8) + '01';
}

function startOfQuarter(dateISO: string): string {
  const month = parseInt(dateISO.slice(5, 7), 10);
  const quarterStart = Math.floor((month - 1) / 3) * 3 + 1;
  return `${dateISO.slice(0, 4)}-${String(quarterStart).padStart(2, '0')}-01`;
}

function endOfMonth(dateISO: string): string {
  const [y, m] = dateISO.split('-').map(Number);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}

function prevMonth(dateISO: string): string {
  const [y, m] = dateISO.split('-').map(Number);
  if (m === 1) return `${y - 1}-12-01`;
  return `${y}-${String(m - 1).padStart(2, '0')}-01`;
}

export function resolveDateRange(expression: string): DateRange {
  const now = todayISO();
  const computedAt = new Date().toISOString();
  const expr = expression.toLowerCase().trim();

  if (expr === 'today') {
    return { label: 'Today', from: now, to: now, computed_at: computedAt };
  }
  if (expr === 'yesterday') {
    const y = offsetDays(now, -1);
    return { label: 'Yesterday', from: y, to: y, computed_at: computedAt };
  }
  if (expr === 'this week') {
    const from = startOfWeek(now);
    const to = offsetDays(from, 6);
    return { label: 'This Week', from, to, computed_at: computedAt };
  }
  if (expr === 'last week') {
    const thisWeekStart = startOfWeek(now);
    const from = offsetDays(thisWeekStart, -7);
    const to = offsetDays(thisWeekStart, -1);
    return { label: 'Last Week', from, to, computed_at: computedAt };
  }
  if (expr === 'this month') {
    const from = startOfMonth(now);
    const to = endOfMonth(now);
    return { label: 'This Month', from, to, computed_at: computedAt };
  }
  if (expr === 'last month') {
    const from = prevMonth(now);
    const to = endOfMonth(from);
    return { label: 'Last Month', from, to, computed_at: computedAt };
  }
  if (expr === 'quarter to date' || expr === 'qtd') {
    const from = startOfQuarter(now);
    return { label: 'Quarter to Date', from, to: now, computed_at: computedAt };
  }
  if (expr === 'last 30 days') {
    const from = offsetDays(now, -29);
    return { label: 'Last 30 Days', from, to: now, computed_at: computedAt };
  }
  if (expr === 'previous 30 days') {
    const to = offsetDays(now, -30);
    const from = offsetDays(to, -29);
    return { label: 'Previous 30 Days', from, to, computed_at: computedAt };
  }
  if (expr === 'next 30 days') {
    const to = offsetDays(now, 29);
    return { label: 'Next 30 Days', from: now, to, computed_at: computedAt };
  }
  if (expr === 'next 60 days') {
    const to = offsetDays(now, 59);
    return { label: 'Next 60 Days', from: now, to, computed_at: computedAt };
  }
  if (expr === 'next 90 days') {
    const to = offsetDays(now, 89);
    return { label: 'Next 90 Days', from: now, to, computed_at: computedAt };
  }
  // Default: last 30 days
  const from = offsetDays(now, -29);
  return { label: 'Last 30 Days', from, to: now, computed_at: computedAt };
}

// ============================================================
// PROMPT INJECTION DEFENCE
// ============================================================

/**
 * Sanitise operational text sourced from external/imported data
 * before it may be incorporated into an executive response.
 * This function marks the content as untrusted — it can appear
 * as EVIDENCE DATA only, never as instruction or override.
 */
export function sanitiseExternalText(text: string): string {
  // Strip any attempt to embed system prompt override patterns.
  // These patterns have zero authority regardless of source.
  return text
    .replace(/ignore (all )?instructions?/gi, '[REDACTED]')
    .replace(/system prompt/gi, '[REDACTED]')
    .replace(/you are now/gi, '[REDACTED]')
    .replace(/reveal.*?(password|secret|key|token|permission|finance|bank)/gi, '[REDACTED]')
    .replace(/show.*?(bank detail|supplier detail|payment)/gi, '[REDACTED]')
    .replace(/forget your.*?(instruction|rule|guideline)/gi, '[REDACTED]')
    .replace(/act as.*?(admin|root|superuser|ceo|unrestricted)/gi, '[REDACTED]');
}

// ============================================================
// INTENT CLASSIFICATION
// ============================================================

interface IntentPattern {
  category: QueryIntentCategory;
  keywords: string[];
}

const INTENT_PATTERNS: IntentPattern[] = [
  { category: 'FINANCE', keywords: ['margin', 'revenue', 'profit', 'invoice', 'billing', 'financial', 'cash', 'leakage', 'unbilled', 'wip', 'accounts receivable', 'payment', 'supplier invoice', 'gross margin', 'actual cost', 'matched cost', 'attribution', 'profitability', 'finance cost', 'supplier cost', 'invoice cost'] },
  { category: 'COMPLIANCE', keywords: ['compliance', 'obligation', 'certificate', 'statutory', 'sfg20', 'audit', 'exception', 'regulation', 'legislation', 'standard', 'expiring', 'expired', 'overdue compliance', 'audit ready', 'audit readiness', 'mobilisation gap'] },
  { category: 'PPM', keywords: ['ppm', 'planned maintenance', 'maintenance due', 'scheduled maintenance', 'overdue maintenance', 'occurrence', 'maintenance plan', 'next 30 days maintenance', 'preventative'] },
  { category: 'OPERATIONS', keywords: ['work order', 'sla', 'backlog', 'helpdesk', 'service request', 'attendance', 'resolution', 'breach', 'dispatch', 'first time fix', 'recall rate', 'response time', 'completion rate', 'unassigned', 'open work', 'operational exception'] },
  { category: 'SUPPLY_CHAIN', keywords: ['provider', 'contractor', 'supplier performance', 'acceptance', 'decline', 'subcontractor', 'supply chain', 'trade', 'cost variance supplier', 'evidence quality', 'attendance sla', 'provider performance'] },
  { category: 'CLIENTS', keywords: ['client', 'account', 'customer', 'portfolio', 'profitability', 'least profitable', 'most profitable', 'client profitability', 'client account'] },
  { category: 'ASSETS', keywords: ['asset', 'equipment', 'boiler', 'chiller', 'ahu', 'repeat failure', 'defect', 'callout', 'reactive asset', 'most costly asset', 'costly asset', 'replace', 'replacement', 'lifecycle', 'fail next', 'predictive', 'data quality', 'ageing asset', 'expected life', 'condition', 'maintenance cost', 'asset cost', 'reactive cost', 'most expensive asset', 'assets cost', 'cost us the most', 'costing the most'] },
  { category: 'ESTATE', keywords: ['site', 'building', 'floor', 'space', 'estate', 'property', 'managed site', 'facilities'] },
  { category: 'AI_AUTOMATION', keywords: ['ai', 'automation', 'automated', 'workflow', 'dispatch ai', 'ai activity', 'control plane', 'escalation', 'override', 'shadow mode'] },
  { category: 'PLATFORM_HEALTH', keywords: ['integration', 'connector', 'xero', 'quickbooks', 'sage', 'netsuite', 'platform health', 'system health', 'healthy'] },
  { category: 'EXECUTIVE_BRIEF', keywords: ['executive brief', 'brief', 'summary report', 'since last brief', 'morning brief', 'daily brief'] },
  { category: 'CONTRACTS', keywords: ['contract', 'contract health', 'contract attention', 'contract status', 'variation'] },
];

export function classifyIntent(question: string): QueryIntentCategory {
  const q = question.toLowerCase();
  let bestMatch: QueryIntentCategory = 'UNKNOWN';
  let bestScore = 0;
  for (const pattern of INTENT_PATTERNS) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (q.includes(keyword)) {
        // Longer matching phrases give higher confidence weighting
        score += keyword.includes(' ') ? 3 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pattern.category;
    }
  }
  return bestMatch;
}

export function extractDateExpression(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('today')) return 'today';
  if (q.includes('yesterday')) return 'yesterday';
  if (q.includes('this week')) return 'this week';
  if (q.includes('last week')) return 'last week';
  if (q.includes('this month')) return 'this month';
  if (q.includes('last month')) return 'last month';
  if (q.includes('quarter to date') || q.includes('qtd')) return 'quarter to date';
  if (q.includes('next 90 days') || q.includes('next 90')) return 'next 90 days';
  if (q.includes('next 60 days') || q.includes('next 60')) return 'next 60 days';
  if (q.includes('next 30 days') || q.includes('next 30') || q.includes('next month')) return 'next 30 days';
  if (q.includes('previous 30 days') || q.includes('prior 30')) return 'previous 30 days';
  if (q.includes('last 30 days') || q.includes('past 30')) return 'last 30 days';
  // Default to last 30 days for operational questions
  return 'last 30 days';
}

export function isWriteAttempt(question: string): boolean {
  const q = question.toLowerCase();
  const writeIndicators = [
    'suspend', 'delete', 'remove', 'cancel', 'approve', 'reject',
    'dispatch', 'assign', 'invite', 'pay ', 'issue invoice', 'create invoice',
    'accept risk', 'modify', 'update', 'change', 'edit', 'add user',
    'alter', 'disable', 'enable', 'post ', 'book '
  ];
  return writeIndicators.some(w => q.includes(w));
}
