/**
 * ENTIREFM FIELD REPORTING ENGINE — TEMPLATE REGISTRY
 * ====================================================
 * Master Registry for Rev 4.0 Standard Operating Templates.
 */

import { dbQuery } from '../db/client';
import type { ReportTemplate, ReportTemplateVersion } from './types';

// ─── CANONICAL REVISION 4.0 TEMPLATES ────────────────────────

export const SEED_TEMPLATES: Array<ReportTemplate & { version: ReportTemplateVersion }> = [
  {
    id: '11111111-1111-4000-8000-000000000001',
    template_code: 'ENT-RJR-01',
    name: 'Reactive Job Report',
    report_type: 'REACTIVE',
    discipline: 'General Hard FM',
    description: 'Formal engineer job sheet capturing fault diagnosis, arrival/departure, labour hours, materials, defect observations, and customer sign-off.',
    icon: 'Wrench',
    is_active: true,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    version: {
      id: '22222222-2222-4000-8000-000000000001',
      report_template_id: '11111111-1111-4000-8000-000000000001',
      revision: '4.0',
      effective_date: 'MAR 2026',
      schema_json: {
        sections: [
          { key: '01_issue_reported', title: '01 Issue Reported', required: true },
          { key: '02_attendance', title: '02 Attendance & Site Conditions', required: true },
          { key: '03_diagnosis_works', title: '03 Diagnosis / Works Carried Out', required: true },
          { key: '04_labour', title: '04 Labour Allocation', repeatable: true },
          { key: '05_materials', title: '05 Materials & Consumables', repeatable: true },
          { key: '06_outcome', title: '06 Job Outcome', required: true },
          { key: '07_defects', title: '07 Defects & Remedial Actions', repeatable: true },
          { key: '08_photographs', title: '08 Photographic Evidence', attachments: true },
          { key: '09_engineer_signature', title: '09 Engineer Declaration & Sign-Off', required: true },
          { key: '10_client_signature', title: '10 Client / Representative Sign-Off', optional: true },
          { key: '11_entirefm_closeout', title: '11 EntireFM Review & Close-Out', internal_only: true },
        ],
      },
      pdf_renderer_key: 'rev4/reactive-job',
      is_active: true,
      created_at: '2026-03-01T00:00:00Z',
    },
  },
  {
    id: '11111111-1111-4000-8000-000000000002',
    template_code: 'ENT-PPM-01',
    name: 'Weekly Fire Alarm Test Record',
    report_type: 'PPM_CHECKLIST',
    discipline: 'Fire Safety',
    description: 'Statutory BS 5839-1 weekly manual call point rotational test, panel status inspection, and defect logging.',
    icon: 'ShieldCheck',
    is_active: true,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    version: {
      id: '22222222-2222-4000-8000-000000000002',
      report_template_id: '11111111-1111-4000-8000-000000000002',
      revision: '4.0',
      effective_date: 'MAR 2026',
      schema_json: {
        sections: [
          { key: '01_system_details', title: '01 Fire Alarm System Details', required: true },
          { key: '02_panel_inspection', title: '02 Control Panel State Inspection', required: true },
          { key: '03_call_points', title: '03 Sample Manual Call Point(s) Tested', repeatable: true, required: true },
          { key: '04_ancillaries', title: '04 Sounders, Signalling & Ancillaries', required: true },
          { key: '05_defects', title: '05 Defect / Rectification Notice', repeatable: true },
          { key: '06_photographs', title: '06 Test Evidence Photos', attachments: true },
          { key: '07_engineer_signature', title: '07 Competent Tester Sign-Off', required: true },
        ],
      },
      pdf_renderer_key: 'rev4/weekly-fire-alarm',
      is_active: true,
      created_at: '2026-03-01T00:00:00Z',
    },
  },
  {
    id: '11111111-1111-4000-8000-000000000003',
    template_code: 'ENT-FLS-EL',
    name: 'Emergency Lighting Asset Schedule',
    report_type: 'ASSET_SCHEDULE',
    discipline: 'Life Safety / Electrical',
    description: 'Asset inventory and schedule survey for emergency luminaires, exit signage, central battery and self-contained units per BS 5266.',
    icon: 'Zap',
    is_active: true,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    version: {
      id: '22222222-2222-4000-8000-000000000003',
      report_template_id: '11111111-1111-4000-8000-000000000003',
      revision: '4.0',
      effective_date: 'MAR 2026',
      schema_json: {
        sections: [
          { key: '01_survey_header', title: '01 Survey & Building Details', required: true },
          { key: '02_assets_schedule', title: '02 Emergency Luminaire Schedule', repeatable: true, required: true, syncs_to_asset_registry: true },
          { key: '03_overall_assessment', title: '03 Estate Assessment & Limitations', required: true },
          { key: '04_defects', title: '04 Immediate Compliance Hazards', repeatable: true },
          { key: '05_photographs', title: '05 Survey Evidence', attachments: true },
          { key: '06_surveyor_signature', title: '06 Surveyor Sign-Off', required: true },
        ],
      },
      pdf_renderer_key: 'rev4/emergency-lighting',
      is_active: true,
      created_at: '2026-03-01T00:00:00Z',
    },
  },
];

/**
 * List all active templates with their latest active version.
 */
export async function listReportTemplates(): Promise<ReportTemplate[]> {
  const { data } = await dbQuery<ReportTemplate[]>('report_templates?is_active=eq.true&order=template_code.asc');
  if (data && data.length > 0) {
    return data;
  }
  return SEED_TEMPLATES.map(({ version, ...rest }) => rest);
}

/**
 * Get a specific template by template_code (e.g. 'ENT-RJR-01').
 */
export async function getTemplateByCode(
  code: string
): Promise<{ template: ReportTemplate; version: ReportTemplateVersion } | null> {
  const seedMatch = SEED_TEMPLATES.find(t => t.template_code === code);

  const { data: dbTemplates } = await dbQuery<ReportTemplate[]>(
    `report_templates?template_code=eq.${encodeURIComponent(code)}&limit=1`
  );
  if (dbTemplates && dbTemplates.length > 0) {
    const template = dbTemplates[0];
    const { data: dbVersions } = await dbQuery<ReportTemplateVersion[]>(
      `report_template_versions?report_template_id=eq.${template.id}&is_active=eq.true&order=created_at.desc&limit=1`
    );
    if (dbVersions && dbVersions.length > 0) {
      return { template, version: dbVersions[0] };
    }
  }

  if (seedMatch) {
    return { template: seedMatch, version: seedMatch.version };
  }

  return null;
}

/**
 * Get a template version by its UUID.
 */
export async function getTemplateVersionById(
  versionId: string
): Promise<{ template: ReportTemplate; version: ReportTemplateVersion } | null> {
  const seedMatch = SEED_TEMPLATES.find(t => t.version.id === versionId);
  if (seedMatch) {
    return { template: seedMatch, version: seedMatch.version };
  }

  const { data: dbVersions } = await dbQuery<ReportTemplateVersion[]>(
    `report_template_versions?id=eq.${versionId}&limit=1`
  );
  if (dbVersions && dbVersions.length > 0) {
    const version = dbVersions[0];
    const { data: dbTemplates } = await dbQuery<ReportTemplate[]>(
      `report_templates?id=eq.${version.report_template_id}&limit=1`
    );
    if (dbTemplates && dbTemplates.length > 0) {
      return { template: dbTemplates[0], version };
    }
  }

  return null;
}
