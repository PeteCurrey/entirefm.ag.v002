/**
 * COMPLETE PPM PACK (PDF) GENERATOR
 * =================================
 * Assembles a comprehensive, multi-section engineering pack:
 * 1. Cover Page (branding, site details, date, doc ref, index)
 * 2. Executive Summary (exact dynamic template, profile metadata, compliance scorecard)
 * 3. PPM Maintenance Matrix (complete task regime, frequencies, statutory references)
 * 4. Blank Service Visit Record Log Sheets (one per unique discipline with ~15 blank rows)
 * 5. Statutory & Standards Reference Guide (matched to active regimes in the schedule)
 * 6. About EntireFM & Commercial Proposal CTA (two-page technical appendix)
 *
 * Uses client-side vector-accurate HTML-to-print execution consistent with EntireFM's
 * existing PDF architecture.
 */

import { CommercialAssetDefinition, MaintenanceTaskDefinition } from '@/lib/tools/asset-taxonomy';
import { COMPLIANCE_REGIMES, ComplianceRegime } from '@/lib/tools/compliance-taxonomy';
import { PPM_PACK_ABOUT_CONTENT } from '@/lib/tools/ppm-pack-content';

export interface PpmSchedulePackData {
  buildingName: string;
  buildingType: string;
  floorArea?: string;
  numberOfFloors?: string;
  occupancyProfile: string;
  siteCriticality: string;
  selectedCategoryIds?: Set<string> | string[];
  selectedAssetList: Array<{ definition: CommercialAssetDefinition; quantity: number }>;
  programmeTasks: Array<{
    asset: CommercialAssetDefinition;
    quantity: number;
    task: MaintenanceTaskDefinition;
  }>;
  stats: {
    totalActivities: number;
    legalCount: number;
    standardCount: number;
    sfg20Count: number;
  };
}

// ── COMPOSABLE SECTION 1: COVER PAGE ──────────────────────────────────────────
export function buildCoverPage(data: PpmSchedulePackData, docRef: string, dateStr: string): string {
  const siteName = data.buildingName?.trim() || 'Commercial Estate';
  const totalAssets = data.selectedAssetList.reduce((sum, a) => sum + (a.quantity || 1), 0);

  return `
    <div class="cover-page" style="page-break-after: always; padding: 20mm 10mm 15mm 10mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Top Bar -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0B1220; padding-bottom: 18px; margin-bottom: 40px;">
          <div>
            <div style="font-size: 26px; font-weight: 900; letter-spacing: 0.05em; color: #0B1220; line-height: 1;">
              Entire<span style="color: #FF3E9D;">FM</span>
            </div>
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #64748B; font-weight: 600; margin-top: 5px;">
              Facilities Management. Evolved.
            </div>
          </div>
          <div style="text-align: right; font-size: 10px; color: #64748B; line-height: 1.5;">
            <div><strong>Document Ref:</strong> ${docRef}</div>
            <div><strong>Issue Date:</strong> ${dateStr}</div>
            <div><strong>Status:</strong> Indicative Planning Specification</div>
          </div>
        </div>

        <!-- Main Title Block -->
        <div style="margin-bottom: 36px;">
          <div style="display: inline-block; background: #0B1220; color: #FFFFFF; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 3px 9px; border-radius: 3px; margin-bottom: 12px;">
            Technical Estate Specification &amp; Operational Log Pack
          </div>
          <h1 style="font-size: 32px; font-weight: 800; color: #0B1220; margin: 0 0 10px 0; letter-spacing: -0.02em; line-height: 1.15;">
            Complete Planned Preventative Maintenance Pack
          </h1>
          <p style="font-size: 14px; color: #475569; margin: 0; line-height: 1.5; max-width: 680px;">
            Bespoke statutory and planned maintenance regimes, 12-month engineering schedules, and physical service visit log sheets tailored to property infrastructure.
          </p>
        </div>

        <!-- Property Profile Card Grid -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 36px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid #0B1220; border-radius: 4px; padding: 12px 16px;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 600;">Site / Property</div>
            <div style="font-size: 16px; font-weight: 700; color: #0B1220; margin-top: 3px;">${siteName}</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 2px;">${data.buildingType}</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid #FF3E9D; border-radius: 4px; padding: 12px 16px;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 600;">Estate Scale</div>
            <div style="font-size: 16px; font-weight: 700; color: #0B1220; margin-top: 3px;">${data.floorArea || 'Unspecified area'}</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 2px;">${data.numberOfFloors || 'Standard storeys'} · ${totalAssets} Physical Assets</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid #2563EB; border-radius: 4px; padding: 12px 16px;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 600;">Operating Profile</div>
            <div style="font-size: 13px; font-weight: 700; color: #0B1220; margin-top: 3px;">${data.occupancyProfile}</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid #059669; border-radius: 4px; padding: 12px 16px;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 600;">Site Criticality</div>
            <div style="font-size: 13px; font-weight: 700; color: #0B1220; margin-top: 3px;">${data.siteCriticality}</div>
          </div>
        </div>

        <!-- Document Table of Contents / Index -->
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px 20px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            Pack Contents &amp; Engineering Sections
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 11.5px; color: #334155;">
            <div><strong>Section 01:</strong> Executive Estate Summary</div>
            <div><strong>Section 04:</strong> Statutory Governance &amp; Standards Guide</div>
            <div><strong>Section 02:</strong> PPM Maintenance Matrix</div>
            <div><strong>Section 05:</strong> About EntireFM (Operating Model)</div>
            <div><strong>Section 03:</strong> Service Visit Record Log Sheets</div>
            <div><strong>Appendix:</strong> Commercial Proposal &amp; Survey Request</div>
          </div>
        </div>
      </div>

      <!-- Cover Page Footer -->
      <div style="border-top: 1px solid #CBD5E1; padding-top: 14px; font-size: 10px; color: #64748B; display: flex; justify-content: space-between; align-items: center;">
        <div>Prepared via EntireFM Interactive Planning Suite · Operations &amp; Engineering Division</div>
        <div>020 4617 0228 · www.entirefm.com</div>
      </div>
    </div>
  `;
}

// ── COMPOSABLE SECTION 2: EXECUTIVE SUMMARY ──────────────────────────────────
export function buildExecutiveSummaryPage(data: PpmSchedulePackData, dateStr: string): string {
  const siteName = data.buildingName?.trim() || 'Not specified';
  const floorArea = data.floorArea?.trim() || 'Not specified';
  const storeys = data.numberOfFloors?.trim() || 'Not specified';

  // Distinct disciplines list
  const disciplineNames = Array.from(
    new Set(data.selectedAssetList.map((a) => a.definition.categoryName))
  );
  const disciplineCount = disciplineNames.length;
  const disciplineList = disciplineNames.join(', ');

  const totalAssetsCount = data.selectedAssetList.reduce((sum, a) => sum + (a.quantity || 1), 0);

  // Extract referenced standards
  const standardsSet = new Set<string>();
  data.programmeTasks.forEach((t) => {
    if (t.task.governingBasis) {
      t.task.governingBasis.split(/[\/,;]/).forEach((part) => {
        const trimmed = part.trim();
        if (trimmed && trimmed.length > 2 && !trimmed.toLowerCase().includes('task')) {
          standardsSet.add(trimmed);
        }
      });
    }
  });
  // Fallback defaults if none parsed
  if (standardsSet.size === 0) {
    standardsSet.add('SFG20');
    standardsSet.add('BS 7671');
    standardsSet.add('ACOP L8');
    standardsSet.add('RRO 2005');
  }
  const standardsList = Array.from(standardsSet).slice(0, 8).join(', ');

  return `
    <div class="page-break" style="page-break-before: always; padding: 10mm 10mm 15mm 10mm;">
      <!-- Section Header -->
      <div style="border-bottom: 2px solid #0B1220; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #FF3E9D;">
            Section 01 / Operational Overview
          </div>
          <h2 style="font-size: 22px; font-weight: 800; color: #0B1220; margin: 4px 0 0 0; letter-spacing: -0.01em;">
            PLANNED PREVENTATIVE MAINTENANCE PROGRAMME
          </h2>
          <div style="font-size: 14px; font-weight: 600; color: #475569; margin-top: 2px;">
            Executive Summary
          </div>
        </div>
        <div style="text-align: right; font-size: 10px; color: #64748B;">
          EntireFM Technical Toolkit
        </div>
      </div>

      <!-- Exact Metadata Block -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 16px 20px; margin-bottom: 24px;">
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <tbody>
            <tr style="border-bottom: 1px solid #EEF2F6;">
              <td style="padding: 6px 0; font-weight: 700; color: #475569; width: 200px;">Site:</td>
              <td style="padding: 6px 0; color: #0B1220; font-weight: 600;">${siteName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EEF2F6;">
              <td style="padding: 6px 0; font-weight: 700; color: #475569;">Building type:</td>
              <td style="padding: 6px 0; color: #0B1220;">${data.buildingType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EEF2F6;">
              <td style="padding: 6px 0; font-weight: 700; color: #475569;">Approximate floor area:</td>
              <td style="padding: 6px 0; color: #0B1220;">${floorArea}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EEF2F6;">
              <td style="padding: 6px 0; font-weight: 700; color: #475569;">Number of storeys:</td>
              <td style="padding: 6px 0; color: #0B1220;">${storeys}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EEF2F6;">
              <td style="padding: 6px 0; font-weight: 700; color: #475569;">Operating profile:</td>
              <td style="padding: 6px 0; color: #0B1220;">${data.occupancyProfile}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EEF2F6;">
              <td style="padding: 6px 0; font-weight: 700; color: #475569;">Site criticality:</td>
              <td style="padding: 6px 0; color: #0B1220;">${data.siteCriticality}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 700; color: #475569;">Programme generated:</td>
              <td style="padding: 6px 0; color: #0B1220;">${dateStr}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Narrative Text Block (User's Exact Template) -->
      <div style="font-size: 13px; line-height: 1.7; color: #1E293B; margin-bottom: 28px;">
        <p style="margin: 0 0 16px 0;">
          This programme sets out an indicative planned maintenance schedule across <strong>${disciplineCount} disciplines</strong> (${disciplineList}), covering <strong>${totalAssetsCount} assets</strong> identified during the estate profiling stage. Task frequencies have been set with reference to ${standardsList}, adjusted for the operating profile and criticality declared above.
        </p>

        <p style="margin: 0 0 16px 0; color: #334155;">
          This schedule is indicative. It has been generated from user-supplied building information rather than a physical asset survey, and should be treated as a planning baseline rather than a certified compliance document. Statutory inspection intervals should be confirmed against current legislation and manufacturer requirements before the programme is put into operation.
        </p>
      </div>

      <!-- Key Scorecard Metrics Strip -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px;">
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 14px; border-radius: 4px;">
          <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748B;">Planned Regimes</div>
          <div style="font-size: 24px; font-weight: 800; color: #0B1220; margin-top: 4px;">${data.stats.totalActivities}</div>
          <div style="font-size: 10px; color: #94A3B8;">12-Month Schedule</div>
        </div>
        <div style="background: #FFF1F2; border: 1px solid #FECDD3; padding: 12px 14px; border-radius: 4px;">
          <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #BE123C;">Legal Duties</div>
          <div style="font-size: 24px; font-weight: 800; color: #E11D48; margin-top: 4px;">${data.stats.legalCount}</div>
          <div style="font-size: 10px; color: #FB7185;">Statutory Regulations</div>
        </div>
        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 12px 14px; border-radius: 4px;">
          <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #1D4ED8;">British Standards</div>
          <div style="font-size: 24px; font-weight: 800; color: #2563EB; margin-top: 4px;">${data.stats.standardCount}</div>
          <div style="font-size: 10px; color: #60A5FA;">Codes of Practice</div>
        </div>
        <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 12px 14px; border-radius: 4px;">
          <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #047857;">SFG20 Tasks</div>
          <div style="font-size: 24px; font-weight: 800; color: #059669; margin-top: 4px;">${data.stats.sfg20Count}</div>
          <div style="font-size: 10px; color: #34D399;">Preventative Care</div>
        </div>
      </div>

      <!-- Scope of Systems Table -->
      <div style="margin-top: 24px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 8px;">
          Asset Systems Registered in Scope
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: #F1F5F9; border-bottom: 2px solid #CBD5E1;">
              <th style="padding: 6px 10px; text-align: left; font-weight: 700; color: #0B1220; width: 28%;">Discipline</th>
              <th style="padding: 6px 10px; text-align: left; font-weight: 700; color: #0B1220; width: 52%;">Asset System Description</th>
              <th style="padding: 6px 10px; text-align: center; font-weight: 700; color: #0B1220; width: 20%;">Installed Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${data.selectedAssetList
              .map(
                ({ definition, quantity }, idx) => `
              <tr style="border-bottom: 1px solid #EEF2F6; background: ${idx % 2 === 0 ? '#FFFFFF' : '#FAFBFD'};">
                <td style="padding: 6px 10px; font-weight: 600; color: #475569;">${definition.categoryName}</td>
                <td style="padding: 6px 10px; color: #0B1220;">${definition.name}</td>
                <td style="padding: 6px 10px; text-align: center; color: #0B1220;">${definition.supportsQuantity === false ? 'Whole Site' : `${quantity} Units`}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── COMPOSABLE SECTION 3: PPM SCHEDULE MATRIX ─────────────────────────────────
export function buildScheduleMatrixSection(data: PpmSchedulePackData): string {
  return `
    <div class="page-break" style="page-break-before: always; padding: 10mm 10mm 15mm 10mm;">
      <!-- Section Header -->
      <div style="border-bottom: 2px solid #0B1220; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #FF3E9D;">
            Section 02 / Technical Maintenance Specification
          </div>
          <h2 style="font-size: 20px; font-weight: 800; color: #0B1220; margin: 4px 0 0 0; letter-spacing: -0.01em;">
            PPM Maintenance Schedule Matrix
          </h2>
        </div>
        <div style="text-align: right; font-size: 10px; color: #64748B;">
          ${data.programmeTasks.length} Regimes Scheduled
        </div>
      </div>

      <!-- Schedule Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: left; page-break-inside: auto;">
        <thead>
          <tr style="background: #0B1220; color: #FFFFFF; border-bottom: 2px solid #0B1220;">
            <th style="padding: 8px 8px; font-weight: 700; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; width: 22%;">
              Asset / Discipline
            </th>
            <th style="padding: 8px 8px; font-weight: 700; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; width: 44%;">
              Maintenance Activity &amp; Expected Evidence
            </th>
            <th style="padding: 8px 8px; font-weight: 700; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; text-align: center; width: 12%;">
              Frequency
            </th>
            <th style="padding: 8px 8px; font-weight: 700; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; width: 22%;">
              Classification &amp; Governing Standard
            </th>
          </tr>
        </thead>
        <tbody>
          ${data.programmeTasks
            .map(
              ({ asset, task, quantity }, idx) => `
            <tr style="border-bottom: 1px solid #E2E8F0; background: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; page-break-inside: avoid;">
              <td style="padding: 7px 8px; vertical-align: top;">
                <div style="font-weight: 700; color: #0B1220; font-size: 10.5px;">${asset.name}</div>
                <div style="font-size: 9px; color: #64748B; margin-top: 1px;">${quantity > 1 ? `${quantity}x ` : ''}${asset.categoryName}</div>
              </td>
              <td style="padding: 7px 8px; vertical-align: top; color: #1E293B;">
                <div style="line-height: 1.4;">${task.activity}</div>
                <div style="font-size: 8.5px; color: #64748B; margin-top: 3px;">
                  <strong>Evidence:</strong> ${task.evidenceExpected}
                </div>
              </td>
              <td style="padding: 7px 8px; vertical-align: top; text-align: center; font-weight: 700; color: #0B1220; font-size: 10px;">
                ${task.frequency}
              </td>
              <td style="padding: 7px 8px; vertical-align: top;">
                <div style="font-size: 9px; font-weight: 700; color: ${
                  task.classification === 'LEGAL_STATUTORY_DUTY'
                    ? '#BE123C'
                    : task.classification === 'BRITISH_INDUSTRY_STANDARD'
                    ? '#1D4ED8'
                    : '#047857'
                };">
                  ${task.classification.replace(/_/g, ' ')}
                </div>
                <div style="font-size: 8.5px; color: #2563EB; font-family: monospace; margin-top: 2px;">
                  ${task.governingBasis}
                </div>
                <div style="font-size: 8px; color: #64748B; margin-top: 1px;">
                  ${task.statutoryReference}
                </div>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── COMPOSABLE SECTION 4: BLANK SERVICE VISIT RECORD LOG SHEETS ──────────────
export function buildLogSheetsSection(data: PpmSchedulePackData, scheduleId: string): string {
  // Group assets & tasks by category/discipline
  const categoryMap = new Map<
    string,
    {
      categoryId: string;
      categoryName: string;
      assets: CommercialAssetDefinition[];
    }
  >();

  data.selectedAssetList.forEach(({ definition }) => {
    const catId = definition.categoryId;
    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, {
        categoryId: catId,
        categoryName: definition.categoryName,
        assets: [],
      });
    }
    categoryMap.get(catId)!.assets.push(definition);
  });

  const categories = Array.from(categoryMap.values());
  const siteName = data.buildingName?.trim() || 'Not specified';

  return categories
    .map((cat) => {
      // 15 blank rows for hand-written log entries
      const blankRows = Array.from({ length: 15 }, (_, rIdx) => `
        <tr style="height: 29px; border-bottom: 1px solid #CBD5E1; background: ${rIdx % 2 === 0 ? '#FFFFFF' : '#FAFAFA'};">
          <td style="border-right: 1px solid #CBD5E1; padding: 4px;">&nbsp;</td>
          <td style="border-right: 1px solid #CBD5E1; padding: 4px;">&nbsp;</td>
          <td style="border-right: 1px solid #CBD5E1; padding: 4px;">&nbsp;</td>
          <td style="border-right: 1px solid #CBD5E1; padding: 4px;">&nbsp;</td>
          <td style="border-right: 1px solid #CBD5E1; padding: 4px;">&nbsp;</td>
          <td style="border-right: 1px solid #CBD5E1; padding: 4px;">&nbsp;</td>
          <td style="padding: 4px;">&nbsp;</td>
        </tr>
      `).join('');

      return `
        <div class="page-break" style="page-break-before: always; padding: 12mm 10mm 15mm 10mm;">
          <!-- Exact Header -->
          <div style="border-bottom: 2px solid #0B1220; padding-bottom: 10px; margin-bottom: 16px;">
            <h2 style="font-size: 19px; font-weight: 800; color: #0B1220; margin: 0 0 8px 0; letter-spacing: -0.01em;">
              SERVICE VISIT RECORD — ${cat.categoryName.toUpperCase()}
            </h2>
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: #334155;">
              <div><strong>Site:</strong> ${siteName}</div>
              <div><strong>Schedule ref:</strong> <span style="font-family: monospace; font-weight: 700;">${scheduleId}</span></div>
            </div>
          </div>

          <!-- Printable Blank Table matching exact columns -->
          <table style="width: 100%; border-collapse: collapse; font-size: 10px; border: 1.5px solid #0B1220;">
            <thead>
              <tr style="background: #0B1220; color: #FFFFFF; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em;">
                <th style="padding: 7px 6px; width: 11%; text-align: left; border-right: 1px solid #334155;">Date</th>
                <th style="padding: 7px 6px; width: 16%; text-align: left; border-right: 1px solid #334155;">Engineer</th>
                <th style="padding: 7px 6px; width: 22%; text-align: left; border-right: 1px solid #334155;">Task Completed</th>
                <th style="padding: 7px 6px; width: 24%; text-align: left; border-right: 1px solid #334155;">Findings / Defects Noted</th>
                <th style="padding: 7px 6px; width: 13%; text-align: left; border-right: 1px solid #334155;">Parts Used</th>
                <th style="padding: 7px 6px; width: 9%; text-align: center; border-right: 1px solid #334155;">Next Due</th>
                <th style="padding: 7px 6px; width: 11%; text-align: center;">Signature</th>
              </tr>
            </thead>
            <tbody>
              ${blankRows}
            </tbody>
          </table>

          <!-- Sub-footer instructions -->
          <div style="margin-top: 12px; font-size: 8.5px; color: #64748B; display: flex; justify-content: space-between; border-top: 1px dashed #CBD5E1; padding-top: 6px;">
            <span>Record all attendances, statutory inspections, defect observations, and component replacements.</span>
            <span>EntireFM Technical Compliance Pack · File in on-site logbook</span>
          </div>
        </div>
      `;
    })
    .join('');
}

// ── COMPOSABLE SECTION 5: STATUTORY & STANDARDS REFERENCE GUIDE ───────────────
export function buildStandardsReferenceSection(data: PpmSchedulePackData): string {
  // Master catalog of standards with concise authoritative descriptions
  const KNOWN_STANDARDS: Array<{
    id: string;
    title: string;
    description: string;
    relevantDisciplines: string[];
  }> = [
    {
      id: 'SFG20',
      title: 'SFG20',
      description:
        'Industry-standard maintenance specification for building services, defining task content and minimum frequencies by asset type.',
      relevantDisciplines: ['hvac', 'electrical', 'water', 'fire', 'fabric', 'grounds'],
    },
    {
      id: 'BS_7671',
      title: 'BS 7671 (IET Wiring Regulations)',
      description:
        'Governs periodic inspection and testing of fixed electrical installations (EICR).',
      relevantDisciplines: ['electrical'],
    },
    {
      id: 'BS_5266',
      title: 'BS 5266',
      description:
        'Covers emergency lighting: monthly function tests and annual full-duration discharge tests.',
      relevantDisciplines: ['fire', 'electrical'],
    },
    {
      id: 'ACOP_L8',
      title: 'ACOP L8 / HSG274',
      description:
        'The Approved Code of Practice for controlling Legionella risk in building water systems, including the written scheme of control.',
      relevantDisciplines: ['water'],
    },
    {
      id: 'RRO_2005',
      title: 'RRO 2005 (Regulatory Reform (Fire Safety) Order)',
      description:
        'Sets duties for fire risk assessment and review triggers in non-domestic premises.',
      relevantDisciplines: ['fire'],
    },
    {
      id: 'BS_5839',
      title: 'BS 5839-1',
      description:
        'Code of practice for the design, installation, commissioning, and maintenance of fire detection and fire alarm systems for buildings.',
      relevantDisciplines: ['fire'],
    },
    {
      id: 'LOLER_1998',
      title: 'LOLER 1998 (Lifting Operations and Lifting Equipment Regulations)',
      description:
        'Mandates periodic thorough examination of passenger and goods lifting equipment by an independent competent person.',
      relevantDisciplines: ['vertical'],
    },
    {
      id: 'PSSR_2000',
      title: 'PSSR 2000 (Pressure Systems Safety Regulations)',
      description:
        'Sets statutory examination and certification requirements under a certified Written Scheme of Examination for pressure plant and expansion vessels.',
      relevantDisciplines: ['hvac'],
    },
    {
      id: 'GSIUR_1998',
      title: 'Gas Safety (Installation and Use) Regulations 1998',
      description:
        'Requires annual inspection, combustion analysis, and certification of commercial non-domestic gas appliances and pipework.',
      relevantDisciplines: ['hvac'],
    },
    {
      id: 'F_GAS',
      title: 'Fluorinated Greenhouse Gases (F-Gas) Regulations',
      description:
        'Establishes mandatory leak checking intervals, technician certifications, and refrigerant logging for air conditioning and heat pump systems.',
      relevantDisciplines: ['hvac'],
    },
  ];

  // Determine active disciplines from user's selected asset list
  const activeCategoryIds = new Set<string>(
    data.selectedAssetList.map((a) => a.definition.categoryId.toLowerCase())
  );

  // Filter standards relevant to selected disciplines or referenced in task text
  const textCorpus = data.programmeTasks
    .map((t) => `${t.task.governingBasis} ${t.task.statutoryReference}`)
    .join(' ')
    .toUpperCase();

  const activeStandards = KNOWN_STANDARDS.filter((std) => {
    // 1. Matches active discipline
    const matchesDiscipline = std.relevantDisciplines.some((catId) =>
      activeCategoryIds.has(catId)
    );
    // 2. Or explicitly referenced in task text
    const matchesText =
      (std.id === 'SFG20' && textCorpus.includes('SFG20')) ||
      (std.id === 'BS_7671' && (textCorpus.includes('7671') || textCorpus.includes('EICR') || textCorpus.includes('EAWR'))) ||
      (std.id === 'BS_5266' && (textCorpus.includes('5266') || textCorpus.includes('EMERGENCY LIGHT'))) ||
      (std.id === 'ACOP_L8' && (textCorpus.includes('L8') || textCorpus.includes('HSG274') || textCorpus.includes('LEGIONELLA'))) ||
      (std.id === 'RRO_2005' && (textCorpus.includes('RRO') || textCorpus.includes('FIRE SAFETY'))) ||
      (std.id === 'BS_5839' && textCorpus.includes('5839')) ||
      (std.id === 'LOLER_1998' && textCorpus.includes('LOLER')) ||
      (std.id === 'PSSR_2000' && textCorpus.includes('PSSR')) ||
      (std.id === 'GSIUR_1998' && (textCorpus.includes('GAS') || textCorpus.includes('GSIUR'))) ||
      (std.id === 'F_GAS' && textCorpus.includes('F-GAS'));

    return matchesDiscipline || matchesText;
  });

  return `
    <div class="page-break" style="page-break-before: always; padding: 12mm 10mm 15mm 10mm;">
      <!-- Exact Header -->
      <div style="border-bottom: 2px solid #0B1220; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0B1220; margin: 0 0 6px 0; letter-spacing: -0.01em;">
          STANDARDS REFERENCED IN THIS PROGRAMME
        </h2>
        <div style="font-size: 12px; color: #475569; font-style: normal;">
          Only the standards relevant to your selected disciplines are shown below.
        </div>
      </div>

      <!-- Standards List -->
      <div style="margin-bottom: 28px;">
        ${activeStandards
          .map(
            (std) => `
          <div style="margin-bottom: 14px; line-height: 1.6; font-size: 12px; color: #1E293B; padding-left: 12px; border-left: 3px solid #2563EB;">
            <strong>${std.title}</strong> — ${std.description}
          </div>
        `
          )
          .join('')}
      </div>

      <!-- Exact Closing Disclaimer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 14px; font-size: 11px; color: #64748B; line-height: 1.6;">
        This list reflects the disciplines selected in this programme and is not exhaustive of all statutory obligations that may apply to your site.
      </div>
    </div>
  `;
}

// ── COMPOSABLE SECTION 6: ABOUT ENTIREFM & COMMERCIAL CTA ─────────────────────
export function buildAboutSection(): string {
  const content = PPM_PACK_ABOUT_CONTENT;
  const page1Sections = content.sections.slice(0, 2);
  const page2Section = content.sections[2];

  return `
    <!-- ABOUT ENTIREFM — PART 1 (PAGE 1) -->
    <div class="page-break" style="page-break-before: always; padding: 10mm 10mm 15mm 10mm;">
      <!-- Section Header -->
      <div style="border-bottom: 2px solid #0B1220; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #FF3E9D;">
            Section 05 / Service Delivery Model
          </div>
          <h2 style="font-size: 20px; font-weight: 800; color: #0B1220; margin: 4px 0 0 0; letter-spacing: -0.01em;">
            ${content.documentHeading}
          </h2>
          <div style="font-size: 12px; color: #475569; margin-top: 2px;">
            ${content.documentSubheading}
          </div>
        </div>
        <div style="text-align: right; font-size: 10px; color: #64748B;">
          Part 1 of 2
        </div>
      </div>

      <!-- Sections 1 & 2 -->
      ${page1Sections
        .map(
          (sec) => `
        <div style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 4px; padding: 16px 20px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #0B1220; margin: 0 0 2px 0;">
            ${sec.title}
          </h3>
          ${sec.subtitle ? `<div style="font-size: 11px; color: #64748B; margin-bottom: 10px; font-weight: 600;">${sec.subtitle}</div>` : ''}

          ${sec.paragraphs
            .map((p) => `<p style="font-size: 11.5px; line-height: 1.6; color: #334155; margin: 0 0 10px 0;">${p}</p>`)
            .join('')}

          ${
            sec.bullets?.length
              ? `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #F1F5F9;">
              ${sec.bulletHeading ? `<div style="font-size: 10.5px; font-weight: 700; color: #0B1220; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">${sec.bulletHeading}</div>` : ''}
              <ul style="margin: 0; padding-left: 18px; font-size: 11px; color: #475569; line-height: 1.6;">
                ${sec.bullets.map((b) => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          `
              : ''
          }
        </div>
      `
        )
        .join('')}
    </div>

    <!-- ABOUT ENTIREFM — PART 2 (PAGE 2) + COMMERCIAL CTA -->
    <div class="page-break" style="page-break-before: always; padding: 10mm 10mm 15mm 10mm; display: flex; flex-direction: column; justify-content: space-between; min-height: 250mm;">
      <div>
        <!-- Section Header -->
        <div style="border-bottom: 2px solid #0B1220; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #FF3E9D;">
              Section 05 / Service Delivery Model (Continued)
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #0B1220; margin: 4px 0 0 0; letter-spacing: -0.01em;">
              National Infrastructure &amp; Technical Helpdesk
            </h2>
          </div>
          <div style="text-align: right; font-size: 10px; color: #64748B;">
            Part 2 of 2
          </div>
        </div>

        <!-- Section 3 -->
        <div style="margin-bottom: 28px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 4px; padding: 16px 20px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #0B1220; margin: 0 0 2px 0;">
            ${page2Section.title}
          </h3>
          ${page2Section.subtitle ? `<div style="font-size: 11px; color: #64748B; margin-bottom: 10px; font-weight: 600;">${page2Section.subtitle}</div>` : ''}

          ${page2Section.paragraphs
            .map((p) => `<p style="font-size: 11.5px; line-height: 1.6; color: #334155; margin: 0 0 10px 0;">${p}</p>`)
            .join('')}

          ${
            page2Section.bullets?.length
              ? `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #F1F5F9;">
              ${page2Section.bulletHeading ? `<div style="font-size: 10.5px; font-weight: 700; color: #0B1220; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">${page2Section.bulletHeading}</div>` : ''}
              <ul style="margin: 0; padding-left: 18px; font-size: 11px; color: #475569; line-height: 1.6;">
                ${page2Section.bullets.map((b) => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          `
              : ''
          }
        </div>

        <!-- Single Clean Commercial CTA Frame -->
        <div style="background: #0B1220; color: #FFFFFF; border-radius: 6px; padding: 24px; margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <div style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.14em; color: #FF3E9D; font-weight: 700;">
                Next Steps · Planned Maintenance Procurement
              </div>
              <h3 style="font-size: 20px; font-weight: 800; margin: 4px 0 0 0; color: #FFFFFF;">
                ${content.cta.heading}
              </h3>
            </div>
            <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 8px 14px; text-align: right;">
              <div style="font-size: 9px; text-transform: uppercase; color: #94A3B8;">Direct Desk Phone</div>
              <div style="font-size: 16px; font-weight: 800; color: #FFFFFF;">${content.cta.phoneDisplay}</div>
            </div>
          </div>

          <p style="font-size: 12px; line-height: 1.6; color: #CBD5E1; margin: 0 0 16px 0; max-width: 620px;">
            ${content.cta.description}
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 16px 32px; font-size: 11.5px; color: #FFFFFF; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 14px;">
            <div><strong>Telephone:</strong> <span style="color: #93C5FD;">${content.cta.phoneDisplay}</span></div>
            <div><strong>Email:</strong> <span style="color: #93C5FD;">${content.cta.email}</span></div>
            <div><strong>Web:</strong> <span style="color: #93C5FD;">${content.cta.website}</span></div>
          </div>
        </div>
      </div>

      <!-- Bottom Document Footer -->
      <div style="border-top: 1px solid #CBD5E1; padding-top: 14px; font-size: 10px; color: #64748B; display: flex; justify-content: space-between; align-items: center; margin-top: 30px;">
        <span>Entire Facilities Management · Commercial Building Services · Nationwide Engineering</span>
        <span>End of PPM Pack</span>
      </div>
    </div>
  `;
}

// ── FULL HTML DOCUMENT PACK ASSEMBLER ─────────────────────────────────────────
export function buildHtmlPpmPack(data: PpmSchedulePackData): string {
  const docRef = `EFM-PACK-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const coverHtml = buildCoverPage(data, docRef, dateStr);
  const summaryHtml = buildExecutiveSummaryPage(data, dateStr);
  const matrixHtml = buildScheduleMatrixSection(data);
  const logSheetsHtml = buildLogSheetsSection(data, docRef);
  const standardsHtml = buildStandardsReferenceSection(data);
  const aboutHtml = buildAboutSection();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.buildingName || 'Estate'} — Complete PPM Pack — EntireFM</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 12mm 15mm 12mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print { display: none !important; }
      .page-break {
        page-break-before: always !important;
        break-before: page !important;
      }
      table {
        page-break-inside: auto !important;
      }
      tr {
        page-break-inside: avoid !important;
        page-break-after: auto !important;
      }
      thead {
        display: table-header-group !important;
      }
      tfoot {
        display: table-footer-group !important;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0B1220;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body style="padding: 0; max-width: 820px; margin: 0 auto;">
  ${coverHtml}
  ${summaryHtml}
  ${matrixHtml}
  ${logSheetsHtml}
  ${standardsHtml}
  ${aboutHtml}
</body>
</html>
  `;
}

// ── TRIGGER BROWSER PRINT / PDF DOWNLOAD ──────────────────────────────────────
export function generatePPMPack(data: PpmSchedulePackData, filename?: string): void {
  const html = buildHtmlPpmPack(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    const defaultFilename = `EntireFM_Complete_PPM_Pack_${(data.buildingName || 'Estate').replace(/[^a-zA-Z0-9]/g, '_')}`;
    printWindow.document.title = (filename || defaultFilename).replace(/\.pdf$/i, '');
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 450);
  }
}
