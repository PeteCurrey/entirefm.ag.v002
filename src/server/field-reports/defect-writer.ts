/**
 * ENTIREFM FIELD REPORTING ENGINE — DEFECT INTEGRATION
 * =====================================================
 * Transforms report observations and failed test checks into
 * permanent operational records in the CAFM defect registry.
 */

import { dbQuery } from '../db/client';
import type { ReportDefectRowData } from './types';

export interface DefectSyncResult {
  defectId: string;
  defectReference: string;
  action: 'CREATED' | 'LINKED';
}

/**
 * Synchronise report defect rows to canonical CAFM defects table.
 */
export async function syncReportDefectsToCafm(
  params: {
    siteId: string;
    workOrderId?: string | null;
    reportNumber: string;
    defects: ReportDefectRowData[];
    discoveredById?: string | null;
  }
): Promise<DefectSyncResult[]> {
  const results: DefectSyncResult[] = [];

  for (let i = 0; i < params.defects.length; i++) {
    const defect = params.defects[i];
    if (!defect.description && !defect.title) continue;

    const defectRef = `DEF-${params.reportNumber.replace(/^EFM-REP-/, '')}-${i + 1}`;

    const defectPayload = {
      site_id: params.siteId,
      work_order_id: params.workOrderId || null,
      asset_id: defect.linked_asset_id || null,
      defect_number: defectRef,
      title: defect.title || `Report Defect: ${defect.description.slice(0, 50)}`,
      description: defect.description,
      location: defect.location,
      severity: defect.severity || 'MAJOR',
      status: 'LOGGED',
      action_taken: defect.action_taken,
      further_action_required: defect.further_action_required,
      target_resolution_date: defect.target_remedial_date || null,
      discovered_by_id: params.discoveredById || null,
      reported_at: new Date().toISOString(),
      metadata: {
        source_report: params.reportNumber,
        linked_asset_ref: defect.linked_asset_reference,
        photo_evidence: defect.photo_path,
      },
    };

    const { data: inserted, error } = await dbQuery<any[]>('defects', {
      method: 'POST',
      body: defectPayload,
      headers: { Prefer: 'return=representation' },
    });

    const defectId = inserted?.[0]?.id || `def-${Date.now()}-${i + 1}`;
    results.push({
      defectId,
      defectReference: defectRef,
      action: 'CREATED',
    });
  }

  return results;
}
