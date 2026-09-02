/**
 * ENTIREFM MONTHLY ESTATE REPORT SERVICE
 * ========================================
 * Automates the proactive distribution of monthly estate performance reports
 * to authorized client administrators and finance leads across all active client organisations.
 */

import { dbQuery } from '@/server/db/client';
import { UserSession, RoleCode } from '@/server/identity';
import { getEstatePerformanceAnalytics } from './estate-performance-service';
import { emitMonthlyEstateReportEvent } from '@/server/communications';
import { sendAdminOperationalAlert } from '@/server/notifications/admin-alert';

/**
 * Roles authorised to receive estate-wide executive and financial analytics.
 * Scoped to macro estate leaders; excludes site-specific and tenant-level roles.
 */
export const EXECUTIVE_REPORT_ROLES: RoleCode[] = [
  'CLIENT_ADMIN',      // Client Estate Administrator: strategic governance & macro approvals
  'CLIENT_FM_MANAGER', // Client Facilities Manager: operational SLA, PPM & compliance oversight
  'CLIENT_FINANCE',    // Client Finance: estate expenditure & commercial tracking
];

export interface MonthlyEstateReportSummary {
  processed: number;
  skippedDormant: number;
  sent: number;
  duplicates: number;
  errors: Array<{ orgId: string; orgName: string; error: string }>;
  elapsedMs: number;
  timestamp: string;
}

/**
 * Executes the scheduled monthly estate performance email batch.
 */
export async function processMonthlyEstateReports(options: {
  period?: 'LAST_MONTH' | 'PREVIOUS_MONTH';
  simulateFailure?: boolean;
} = {}): Promise<MonthlyEstateReportSummary> {
  const started = Date.now();
  const period = options.period || 'LAST_MONTH';
  console.log(`[MonthlyEstateReport] Starting monthly performance report dispatch for period ${period}...`);

  // 1. Query all active client organisations
  const { data: clientOrgs, error: orgError } = await dbQuery<any[]>(
    'organisations?org_type=eq.CLIENT&status=eq.ACTIVE&select=id,name,code,portal_status'
  );

  if (orgError || !clientOrgs) {
    const msg = orgError || 'Failed to fetch client organisations';
    console.error('[MonthlyEstateReport:FetchError]', msg);
    throw new Error(msg);
  }

  let skippedDormant = 0;
  let sentCount = 0;
  let duplicateCount = 0;
  const errors: Array<{ orgId: string; orgName: string; error: string }> = [];

  // 2. Process each client organisation independently
  for (const org of clientOrgs) {
    try {
      // Synthesize an elevated client session for analytics computation
      const syntheticSession: UserSession = {
        personId: '00000000-0000-0000-0000-000000000000',
        email: 'system-cron@entirefm.com',
        name: 'EntireFM Performance Autopilot',
        role: 'CLIENT_ADMIN',
        orgId: org.id,
        orgName: org.name,
        orgType: 'CLIENT',
        activeApplication: 'CLIENT',
        permissions: [],
        scopes: [],
        expiresAt: Date.now() + 1000 * 60 * 60,
      };

      // Compute performance metrics for LAST_MONTH
      const report = await getEstatePerformanceAnalytics(syntheticSession, period);

      // Step 2 Gate: Skip organisations with zero real work orders in the reporting period
      if (report.totalWorkOrders === 0) {
        console.log(`[MonthlyEstateReport:SkipDormant] Org ${org.name} (${org.id}) had 0 work orders in ${report.periodLabel}. Skipping report.`);
        skippedDormant++;
        continue;
      }

      // Query active memberships with joined roles and persons
      const { data: memberships, error: memError } = await dbQuery<any[]>(
        `organisation_memberships?organisation_id=eq.${encodeURIComponent(org.id)}&status=eq.ACTIVE&select=id,role:roles(code,name),person:persons(id,email,first_name,last_name,status)`
      );

      if (memError) {
        throw new Error(`Failed to query memberships for ${org.name}: ${memError}`);
      }

      // Filter to executive / finance roles with active person status
      const eligibleRecipients = (memberships || []).filter((m) => {
        const roleCode = m.role?.code as RoleCode;
        const isEligibleRole = EXECUTIVE_REPORT_ROLES.includes(roleCode);
        const isActivePerson = !m.person?.status || m.person.status === 'ACTIVE';
        const hasEmail = Boolean(m.person?.email && m.person.email.includes('@'));
        return isEligibleRole && isActivePerson && hasEmail;
      });

      if (eligibleRecipients.length === 0) {
        console.warn(`[MonthlyEstateReport:NoRecipients] Org ${org.name} (${org.id}) has activity (${report.totalWorkOrders} WOs) but no active admin/finance users.`);
        continue;
      }

      // Deduplicate emails within the same organisation
      const recipientMap = new Map<string, { email: string; name: string }>();
      for (const m of eligibleRecipients) {
        const email = m.person.email.trim().toLowerCase();
        if (!recipientMap.has(email)) {
          const name = [m.person.first_name, m.person.last_name].filter(Boolean).join(' ') || org.name;
          recipientMap.set(email, { email, name });
        }
      }

      // Dispatch idempotent reports to all resolved recipients
      for (const recipient of recipientMap.values()) {
        const dispatchResult = await emitMonthlyEstateReportEvent({
          organisation_id: org.id,
          organisation_name: org.name,
          period_label: report.periodLabel,
          recipient_email: recipient.email,
          recipient_name: recipient.name,
          metrics: {
            total_work_orders: report.totalWorkOrders,
            sla_achievement_pct: report.slaAchievementPct,
            first_time_fix_pct: report.firstTimeFixPct,
            statutory_compliance_pct: report.statutoryCompliancePct,
            ppm_completion_pct: report.ppmCompletionPct,
            total_spend_gbp: report.totalEstateSpendGbp,
          },
          simulateFailure: options.simulateFailure,
        });

        if (dispatchResult.is_duplicate) {
          duplicateCount++;
          console.log(`[MonthlyEstateReport:Duplicate] Already sent to ${recipient.email} for ${org.name} (${report.periodLabel})`);
        } else if (dispatchResult.email_delivery_state === 'SENT' || dispatchResult.email_delivery_state === 'INTERFACE_ONLY') {
          sentCount++;
          console.log(`[MonthlyEstateReport:Sent] Dispatched report to ${recipient.email} for ${org.name} (${report.periodLabel})`);
        } else {
          throw new Error(`Delivery failed for ${recipient.email} (state: ${dispatchResult.email_delivery_state})`);
        }
      }
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      console.error(`[MonthlyEstateReport:OrgError] Failed processing org ${org.name} (${org.id}):`, errorMsg);
      errors.push({ orgId: org.id, orgName: org.name, error: errorMsg });
    }
  }

  // 3. Operational Escalation Alert if any failures occurred
  if (errors.length > 0) {
    await sendAdminOperationalAlert({
      title: `Monthly Estate Performance Dispatch Warning (${errors.length} errors)`,
      category: 'OPERATIONS',
      severity: 'WARNING',
      reason: `Monthly Estate Report Autopilot encountered errors for ${errors.length} organisation(s): ${errors.map((e) => e.orgName).join(', ')}`,
      actionUrl: '/admin/platform/clients',
      details: {
        totalClientOrgs: clientOrgs.length,
        skippedDormant,
        sent: sentCount,
        duplicates: duplicateCount,
        errors: errors.map((e) => `${e.orgName}: ${e.error}`).join('; '),
      },
    }).catch((alertErr) => console.error('[MonthlyEstateReport:AlertFailure]', alertErr));
  }

  const elapsed = Date.now() - started;
  console.log(
    `[MonthlyEstateReport] Completed batch in ${elapsed}ms: ${sentCount} sent, ${duplicateCount} duplicates, ${skippedDormant} dormant skipped, ${errors.length} errors.`
  );

  return {
    processed: clientOrgs.length,
    skippedDormant,
    sent: sentCount,
    duplicates: duplicateCount,
    errors,
    elapsedMs: elapsed,
    timestamp: new Date().toISOString(),
  };
}
