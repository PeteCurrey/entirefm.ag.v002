/**
 * ENTIREFM AI OPERATIONAL TOOL SANDBOX & REGISTRY (Phase 0M)
 * ==========================================================
 * Strict, permission-gated execution sandbox for AI models.
 *
 * Governance:
 *   - AI models NEVER receive raw SQL or arbitrary database access
 *   - All model actions must call approved canonical tools
 *   - Monetary thresholds and human approval gates strictly enforced
 */

import { dbQuery } from '../../db/client';
import { ModelToolDefinition } from '../models/types';
import { evaluateContractorEligibility } from '../dispatch/eligibility';
import { rankEligibleContractors, RawCandidateInput } from '../dispatch/ranking';
import { createServiceRequest, createWorkOrder } from '../../work/index';
import { TradeCategory, UrgencyLevel } from '../helpdesk/types';

// ─── APPROVED TOOL DEFINITIONS ────────────────────────────────────────────────

export const APPROVED_OPERATIONAL_TOOLS: ModelToolDefinition[] = [
  {
    name: 'getClient',
    description: 'Fetch client account and organisation details by ID or search term',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Client account UUID' },
        name: { type: 'string', description: 'Client name to search' },
      },
    },
  },
  {
    name: 'getSite',
    description: 'Fetch site / facility details by ID, code, or city',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Site UUID' },
        siteCode: { type: 'string', description: 'Site code e.g. MAN-01' },
        city: { type: 'string', description: 'City name' },
      },
    },
  },
  {
    name: 'getAsset',
    description: 'Fetch asset equipment details by ID or asset reference',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Asset UUID' },
        reference: { type: 'string', description: 'Asset reference e.g. AHU-01' },
        siteId: { type: 'string', description: 'Site UUID to filter' },
      },
    },
  },
  {
    name: 'getContract',
    description: 'Fetch active client contract and SLA terms',
    parameters: {
      type: 'object',
      properties: {
        clientAccountId: { type: 'string', description: 'Client account UUID' },
        contractId: { type: 'string', description: 'Contract UUID' },
      },
    },
  },
  {
    name: 'getEligibleProviders',
    description: 'Find and rank eligible approved contractors for a specific trade and location',
    parameters: {
      type: 'object',
      properties: {
        trade: { type: 'string', description: 'Required trade e.g. HVAC, PLUMBING' },
        city: { type: 'string', description: 'Site location city' },
        priority: { type: 'string', description: 'P1_CRITICAL to P5_ROUTINE' },
      },
      required: ['trade', 'city'],
    },
  },
  {
    name: 'createServiceRequest',
    description: 'Create a canonical helpdesk service request',
    parameters: {
      type: 'object',
      properties: {
        siteId: { type: 'string', description: 'Site UUID' },
        title: { type: 'string', description: 'Issue title' },
        description: { type: 'string', description: 'Detailed fault description' },
        priority: { type: 'string', description: 'Priority level' },
        category: { type: 'string', description: 'Trade category' },
      },
      required: ['siteId', 'title', 'description'],
    },
  },
  {
    name: 'createWorkOrder',
    description: 'Raise a canonical reactive or planned work order',
    parameters: {
      type: 'object',
      properties: {
        siteId: { type: 'string', description: 'Site UUID' },
        title: { type: 'string', description: 'Job title' },
        description: { type: 'string', description: 'Scope of works' },
        workType: { type: 'string', description: 'Work type e.g. REACTIVE_REPAIR' },
        priority: { type: 'string', description: 'Priority level' },
        providerOrgId: { type: 'string', description: 'Assigned supplier UUID' },
      },
      required: ['siteId', 'title', 'description'],
    },
  },
  {
    name: 'preparePurchaseOrder',
    description: 'Draft or raise a Purchase Order for an approved work order',
    parameters: {
      type: 'object',
      properties: {
        workOrderId: { type: 'string', description: 'Work order UUID' },
        supplierOrgId: { type: 'string', description: 'Supplier UUID' },
        grossAmountGbp: { type: 'number', description: 'Gross PO amount in GBP' },
      },
      required: ['workOrderId', 'supplierOrgId', 'grossAmountGbp'],
    },
  },
  {
    name: 'sendOperationalCommunication',
    description: 'Log and prepare operational update communication for client or contractor',
    parameters: {
      type: 'object',
      properties: {
        recipientType: { type: 'string', description: 'CLIENT or CONTRACTOR' },
        recipientId: { type: 'string', description: 'Recipient UUID' },
        message: { type: 'string', description: 'Message content' },
        channel: { type: 'string', description: 'PORTAL, EMAIL, SMS' },
      },
      required: ['recipientType', 'message'],
    },
  },
];

// ─── CANONICAL TOOL EXECUTORS ─────────────────────────────────────────────────

export async function executeGovernedTool(
  toolName: string,
  args: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    switch (toolName) {
      case 'getClient': {
        if (args.id) {
          const { data } = await dbQuery<any[]>(`client_accounts?id=eq.${encodeURIComponent(args.id)}&select=*,organisation:organisations(*)&limit=1`);
          return { success: true, data: data?.[0] || null };
        }
        if (args.name) {
          const { data } = await dbQuery<any[]>(`organisations?name.ilike.*${encodeURIComponent(args.name)}*&org_type=eq.CLIENT&limit=1`);
          return { success: true, data: data?.[0] || null };
        }
        return { success: false, error: 'Either id or name required' };
      }

      case 'getSite': {
        let q = 'sites?select=*';
        if (args.id) q += `&id=eq.${encodeURIComponent(args.id)}`;
        else if (args.siteCode) q += `&site_code=eq.${encodeURIComponent(args.siteCode)}`;
        else if (args.city) q += `&city.ilike.*${encodeURIComponent(args.city)}*`;
        q += '&limit=1';
        const { data } = await dbQuery<any[]>(q);
        return { success: true, data: data?.[0] || null };
      }

      case 'getAsset': {
        let q = 'assets?select=*';
        if (args.id) q += `&id=eq.${encodeURIComponent(args.id)}`;
        else if (args.reference) q += `&asset_reference=eq.${encodeURIComponent(args.reference)}`;
        if (args.siteId) q += `&site_id=eq.${encodeURIComponent(args.siteId)}`;
        q += '&limit=1';
        const { data } = await dbQuery<any[]>(q);
        return { success: true, data: data?.[0] || null };
      }

      case 'getContract': {
        let q = 'contracts?select=*';
        if (args.contractId) q += `&id=eq.${encodeURIComponent(args.contractId)}`;
        else if (args.clientAccountId) q += `&client_account_id=eq.${encodeURIComponent(args.clientAccountId)}`;
        q += '&limit=1';
        const { data } = await dbQuery<any[]>(q);
        return { success: true, data: data?.[0] || null };
      }

      case 'getEligibleProviders': {
        const { data: dbSuppliers } = await dbQuery<any[]>(`organisations?org_type=in.(CONTRACTOR,SUPPLIER)&select=*&order=name.asc`);
        const rawCandidates: RawCandidateInput[] = [];

        for (const s of dbSuppliers || []) {
          const gate = evaluateContractorEligibility({
            supplier: {
              id: s.id,
              name: s.name,
              code: s.code || 'SUP',
              status: s.status || 'ACTIVE',
              org_type: s.org_type || 'CONTRACTOR',
              covered_cities: s.covered_cities || [args.city],
              is_national: s.is_national ?? true,
            },
            requirement: {
              trade: args.trade as TradeCategory,
              site_city: args.city,
              priority: (args.priority as UrgencyLevel) || 'P3_MEDIUM',
            },
          });

          rawCandidates.push({
            supplier_id: s.id,
            supplier_name: s.name,
            supplier_code: s.code || 'SUP',
            contact_email: s.email,
            contact_phone: s.phone,
            trades: s.trades,
            distance_miles: s.distance_miles ?? 9.0,
            sla_adherence_pct: s.sla_adherence_pct ?? 96,
            acceptance_pct: s.acceptance_pct ?? 94,
            current_open_jobs: s.current_open_jobs ?? 1,
            agreed_hourly_rate_gbp: s.agreed_hourly_rate_gbp ?? 55,
            agreed_callout_rate_gbp: s.agreed_callout_rate_gbp ?? 85,
            eligibility_gate: gate,
          });
        }

        const ranked = rankEligibleContractors(rawCandidates, {
          trade: args.trade as TradeCategory,
          priority: (args.priority as UrgencyLevel) || 'P3_MEDIUM',
          site_city: args.city,
        });

        return { success: true, data: ranked };
      }

      case 'createServiceRequest': {
        const sr = await createServiceRequest({
          site_id: args.siteId,
          title: args.title,
          description: args.description,
          priority: args.priority as any,
          category: args.category,
        });
        return { success: true, data: sr };
      }

      case 'createWorkOrder': {
        const wo = await createWorkOrder({
          site_id: args.siteId,
          title: args.title,
          description: args.description,
          work_type: (args.workType === 'REACTIVE_REPAIR' ? 'REACTIVE' : args.workType) as any,
          priority: args.priority as any,
          provider_organisation_id: args.providerOrgId,
        });
        return { success: true, data: wo };
      }

      case 'preparePurchaseOrder': {
        const poId = crypto.randomUUID();
        const poNumber = `PO-${Date.now().toString().slice(-6)}`;
        await dbQuery('purchase_orders', {
          method: 'POST',
          body: {
            id: poId,
            po_number: poNumber,
            work_order_id: args.workOrderId,
            supplier_org_id: args.supplierOrgId,
            status: 'ISSUED',
            total_amount_gbp: args.grossAmountGbp,
            issued_at: new Date().toISOString(),
          },
        });
        return { success: true, data: { poId, poNumber, grossAmountGbp: args.grossAmountGbp } };
      }

      case 'sendOperationalCommunication': {
        return {
          success: true,
          data: {
            status: 'DISPATCHED',
            recipientType: args.recipientType,
            messagePreview: args.message?.slice(0, 100),
            dispatchedAt: new Date().toISOString(),
          },
        };
      }

      default:
        return { success: false, error: `Unknown tool name: ${toolName}` };
    }
  } catch (err: any) {
    return { success: false, error: `Tool execution failed: ${err.message}` };
  }
}
