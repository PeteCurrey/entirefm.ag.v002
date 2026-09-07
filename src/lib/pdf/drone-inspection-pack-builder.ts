/**
 * COMMERCIAL DRONE INSPECTION REPORT & SPECIFICATION PACK BUILDER
 * ===============================================================
 * Generates an authoritative, multi-page commercial drone survey brief & specification PDF:
 * 1. Cover Page: Document Reference, Date, Scope Category, Building/Site Profile, Executive Reference.
 * 2. Executive Technical Recommendation: Primary service, Inspection Pack, Full Engineering Rationale.
 * 3. Scope Specification & Deliverables Matrix: Icon-classified data outputs, format deliverables, EntireFM self-delivered remedials.
 * 4. Complementary & Cross-Discipline Scopes: Recommended cross-sell surveys with operational reasoning.
 * 5. Aviation Compliance & Operational Governance: UK CAA frameworks, RAMS, weather thresholds, and formal commercial disclaimer.
 * 6. About EntireFM: Reuses canonical `PPM_PACK_ABOUT_CONTENT` plus Commercial Drone Operations Desk CTA.
 *
 * Uses vector-accurate HTML-to-print execution matching `ppm-estimator-pack-builder.ts` and `fm-roi-pack-builder.ts`.
 */

import { PPM_PACK_ABOUT_CONTENT } from '@/lib/tools/ppm-pack-content';
import { 
  PlannerSiteInput, 
  PlannerInspectionInput, 
  PlannerContactInput, 
  DroneRecommendationResult 
} from '@/config/dronePlanner';

export interface DroneInspectionReportData {
  referenceNumber: string;
  site: PlannerSiteInput;
  inspection: PlannerInspectionInput;
  contact?: PlannerContactInput;
  recommendation: DroneRecommendationResult;
  dateStr?: string;
}

// ---------------------------------------------------------------------------
// 1. COVER PAGE
// ---------------------------------------------------------------------------
function buildCoverPage(data: DroneInspectionReportData, dateStr: string): string {
  const { site, inspection, recommendation, referenceNumber } = data;
  const siteLocation = [site.siteName, site.city || 'United Kingdom', site.postcode].filter(Boolean).join(', ');

  return `
    <div class="page cover-page" style="page-break-after: always; padding: 24mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Top Bar -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0B1220; padding-bottom: 20px; margin-bottom: 40px;">
          <div>
            <div style="font-size: 28px; font-weight: 900; letter-spacing: 0.04em; color: #0B1220; line-height: 1;">
              Entire<span style="color: #EC4899;">FM</span>
            </div>
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #64748B; font-weight: 600; margin-top: 6px;">
              Drone Services Division · Commercial Aviation Intelligence
            </div>
          </div>
          <div style="text-align: right; font-size: 10px; color: #64748B; line-height: 1.6;">
            <div><strong>Document Ref:</strong> ${referenceNumber}</div>
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Commercial Survey Brief</div>
          </div>
        </div>

        <!-- Scope Badge -->
        <div style="display: inline-block; background-color: #FDF2F8; border: 1px solid #FBCFE8; color: #DB2777; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 10px; border-radius: 2px; margin-bottom: 16px;">
          Scope: ${recommendation.scopeCategory.toUpperCase()} · Priority: ${recommendation.leadPriority}
        </div>

        <h1 style="font-size: 32px; font-weight: 300; color: #0B1220; line-height: 1.15; margin: 0 0 14px 0; letter-spacing: -0.02em;">
          Commercial Aerial Drone Inspection Brief &amp; Technical Scope
        </h1>
        <p style="font-size: 13.5px; color: #475569; line-height: 1.6; max-width: 92%; margin: 0 0 32px 0;">
          Tailored engineering specification and flight feasibility scoping for <strong>${site.siteName || site.siteType}</strong>, 
          structured to evaluate structural integrity, fabric condition, and high-level asset performance safely without hazardous access equipment.
        </p>

        <!-- Site & Survey Parameters Table -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 18px 20px; margin-bottom: 28px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 12px; border-bottom: 1px solid #CBD5E1; padding-bottom: 6px;">
            Target Site &amp; Operational Parameters
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
            <tr>
              <td style="padding: 5px 0; color: #64748B; width: 38%;">Site Classification:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${site.siteType === 'Other' ? (site.siteTypeOther || 'Custom Commercial') : site.siteType}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Location / Geography:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${siteLocation}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Portfolio Scale &amp; Height Band:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${site.siteScale} · ${inspection.heightBand}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Target Assets for Survey:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${inspection.assetsToInspect?.join(', ') || 'General Building Envelope'}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Primary Investigation Driver:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${inspection.inspectionReasons?.join(', ') || 'Routine Baseline Inspection'}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Urgency / Operational Target:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${inspection.urgency}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Access Limits &amp; Constraints:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${inspection.accessConstraints?.join(', ') || 'Standard Open Access'}</td>
            </tr>
          </table>
        </div>

        <!-- Executive Summary KPI Block -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          <div style="background-color: #0B1220; color: #ffffff; padding: 14px; border-radius: 4px;">
            <div style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #EC4899; font-weight: 600;">Recommended Service</div>
            <div style="font-size: 13px; font-weight: 600; margin-top: 4px; line-height: 1.3;">${recommendation.primaryService.title}</div>
          </div>
          <div style="background-color: #0B1220; color: #ffffff; padding: 14px; border-radius: 4px;">
            <div style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #38BDF8; font-weight: 600;">Inspection Package</div>
            <div style="font-size: 13px; font-weight: 600; margin-top: 4px; line-height: 1.3;">${recommendation.inspectionPack?.title || 'Custom Scope'}</div>
          </div>
          <div style="background-color: #0B1220; color: #ffffff; padding: 14px; border-radius: 4px;">
            <div style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #34D399; font-weight: 600;">Remedial Works Bridge</div>
            <div style="font-size: 13px; font-weight: 600; margin-top: 4px; line-height: 1.3;">${recommendation.remedialServices?.length || 0} In-House Trade Services</div>
          </div>
        </div>
      </div>

      <!-- Footer Note -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · Commercial Drone Operations Desk</span>
        <span>Page 1 of 4 · Confidential</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 2. TECHNICAL RECOMMENDATION & SCOPE SPECIFICATION
// ---------------------------------------------------------------------------
function buildRecommendationPage(data: DroneInspectionReportData): string {
  const { recommendation, inspection } = data;

  const crossSellHtml = recommendation.additionalServices && recommendation.additionalServices.length > 0 
    ? `
      <div style="margin-top: 24px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 10px; border-bottom: 1px solid #CBD5E1; padding-bottom: 4px;">
          Associated Cross-Discipline Surveys to Consider
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          ${recommendation.additionalServices.map(srv => `
            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 12px;">
              <div style="font-size: 11px; font-weight: 700; color: #0B1220; margin-bottom: 4px;">${srv.title}</div>
              <div style="font-size: 10.5px; color: #64748B; line-height: 1.5;">${srv.reason}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `
    : '';

  return `
    <div class="page" style="page-break-after: always; padding: 20mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Section Header -->
        <div style="border-bottom: 1.5px solid #0B1220; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #EC4899;">
              Section 02 · Engineering Specification
            </div>
            <h2 style="font-size: 20px; font-weight: 600; color: #0B1220; margin: 4px 0 0 0; letter-spacing: -0.01em;">
              Primary Recommended Drone Survey Methodology
            </h2>
          </div>
          <div style="font-size: 10px; font-weight: 600; color: #64748B;">Ref: ${data.referenceNumber}</div>
        </div>

        <!-- Primary Service Card -->
        <div style="background-color: #FDF2F8; border: 1.5px solid #F472B6; border-radius: 4px; padding: 18px 20px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #DB2777;">
              PRIMARY SERVICE · ${recommendation.primaryService.badge}
            </div>
            <div style="font-size: 9px; font-weight: 700; background-color: #DB2777; color: #ffffff; padding: 2px 8px; border-radius: 2px; text-transform: uppercase;">
              ${recommendation.scopeCategory}
            </div>
          </div>
          <div style="font-size: 18px; font-weight: 600; color: #0B1220; margin-bottom: 8px;">
            ${recommendation.primaryService.title}
          </div>
          <p style="font-size: 11.5px; color: #475569; line-height: 1.6; margin: 0;">
            ${recommendation.primaryService.description}
          </p>
        </div>

        <!-- Recommended Pack Card (if applicable) -->
        ${recommendation.inspectionPack ? `
          <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 4px; padding: 14px 18px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220;">
                RECOMMENDED INSPECTION PACKAGE
              </span>
              <span style="font-size: 9px; background-color: #E2E8F0; color: #475569; padding: 2px 6px; border-radius: 2px; font-weight: 600;">
                ${recommendation.inspectionPack.badge}
              </span>
            </div>
            <div style="font-size: 14px; font-weight: 600; color: #0B1220; margin-bottom: 4px;">
              ${recommendation.inspectionPack.title}
            </div>
            <div style="font-size: 11px; color: #64748B; line-height: 1.5;">
              ${recommendation.inspectionPack.description}
            </div>
          </div>
        ` : ''}

        <!-- Technical Rationale Callout -->
        <div style="background-color: #0B1220; color: #ffffff; border-radius: 4px; padding: 16px 20px; margin-bottom: 20px;">
          <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #38BDF8; margin-bottom: 6px;">
            Technical Justification &amp; Flight Rationale
          </div>
          <p style="font-size: 11.5px; color: #CBD5E1; line-height: 1.6; margin: 0;">
            ${recommendation.summaryRationale}
          </p>
        </div>

        <!-- Cross-Sell / Associated Surveys -->
        ${crossSellHtml}

        ${inspection.notes ? `
          <div style="margin-top: 20px; background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 4px; padding: 12px 16px;">
            <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #92400E; margin-bottom: 4px;">
              Client Site Access Notes &amp; Prerequisites
            </div>
            <div style="font-size: 11px; color: #78350F; line-height: 1.5;">
              "${inspection.notes}"
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Footer Note -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · Commercial Drone Operations Desk</span>
        <span>Page 2 of 4 · Scope Specification</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 3. DELIVERABLES & IN-HOUSE REMEDIAL TRADE BRIDGE
// ---------------------------------------------------------------------------
function buildDeliverablesAndRemedialsPage(data: DroneInspectionReportData): string {
  const { recommendation } = data;

  return `
    <div class="page" style="page-break-after: always; padding: 20mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Section Header -->
        <div style="border-bottom: 1.5px solid #0B1220; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #EC4899;">
              Section 03 · Deliverables &amp; Self-Delivered Remedials
            </div>
            <h2 style="font-size: 20px; font-weight: 600; color: #0B1220; margin: 4px 0 0 0; letter-spacing: -0.01em;">
              Technical Outputs &amp; Remedial Works Alignment
            </h2>
          </div>
          <div style="font-size: 10px; font-weight: 600; color: #64748B;">Ref: ${data.referenceNumber}</div>
        </div>

        <!-- Deliverables Checklist Table -->
        <div style="margin-bottom: 26px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 10px; border-bottom: 1px solid #CBD5E1; padding-bottom: 4px;">
            Target Technical Deliverables &amp; Data Outputs
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="background-color: #F8FAFC; border-bottom: 1px solid #CBD5E1;">
                <th style="text-align: left; padding: 8px 10px; font-weight: 700; color: #0B1220; width: 40px;">No.</th>
                <th style="text-align: left; padding: 8px 10px; font-weight: 700; color: #0B1220;">Output Description</th>
                <th style="text-align: left; padding: 8px 10px; font-weight: 700; color: #0B1220; width: 140px;">Standard Format</th>
              </tr>
            </thead>
            <tbody>
              ${recommendation.suggestedOutputs.map((item, idx) => `
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 8px 10px; color: #EC4899; font-weight: 700;">${String(idx + 1).padStart(2, '0')}</td>
                  <td style="padding: 8px 10px; color: #0B1220; font-weight: 600;">${item}</td>
                  <td style="padding: 8px 10px; color: #64748B;">Direct CAD / PDF / Cloud</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Remedials Alignment Section -->
        <div style="margin-bottom: 24px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 10px; border-bottom: 1px solid #CBD5E1; padding-bottom: 4px;">
            EntireFM Self-Delivered Remedial Maintenance Capability
          </div>
          <p style="font-size: 11.5px; color: #475569; line-height: 1.5; margin: 0 0 14px 0;">
            Unlike independent drone pilot agencies, EntireFM directly executes physical make-safe and remedial engineering works. 
            Defects identified in this flight are directly actionable by our nationwide engineering divisions:
          </p>

          <div style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 10px;">
            ${recommendation.remedialServices.map(rem => `
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 12px 16px;">
                <div style="font-size: 12px; font-weight: 700; color: #0B1220; margin-bottom: 3px;">${rem.name}</div>
                <div style="font-size: 11px; color: #64748B; line-height: 1.5;">${rem.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Operational Governance Strip -->
        <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 4px; padding: 14px 18px;">
          <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 6px;">
            Operational Safety &amp; Flight Prerequisites
          </div>
          <ul style="margin: 0; padding-left: 16px; font-size: 10.5px; color: #475569; line-height: 1.6;">
            ${recommendation.operationalCaveats.map(cav => `<li>${cav}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Footer Note -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · Commercial Drone Operations Desk</span>
        <span>Page 3 of 4 · Deliverables &amp; Remedials</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 4. ABOUT ENTIREFM, AVIATION GOVERNANCE & CALL TO ACTION
// ---------------------------------------------------------------------------
function buildAboutAndCtaPage(): string {
  const about = PPM_PACK_ABOUT_CONTENT;

  return `
    <div class="page" style="padding: 20mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Section Header -->
        <div style="border-bottom: 1.5px solid #0B1220; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #EC4899;">
              Section 04 · Operational Delivery &amp; Contact
            </div>
            <h2 style="font-size: 20px; font-weight: 600; color: #0B1220; margin: 4px 0 0 0; letter-spacing: -0.01em;">
              About Entire Facilities Management
            </h2>
          </div>
          <div style="font-size: 10px; font-weight: 600; color: #64748B;">Aviation Operations</div>
        </div>

        <!-- Capability Columns -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: #0B1220; margin-bottom: 6px;">UK Civil Aviation Authority Compliance</div>
            <p style="font-size: 10.5px; color: #475569; line-height: 1.5; margin: 0;">
              All commercial flight operations are delivered in strict accordance with UK CAA operational authorisation standards. 
              Comprehensive site-specific RAMS, ground cordoning, and airspace notifications (including NOTAMs and FRZ coordination) are executed prior to every launch.
            </p>
          </div>
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: #0B1220; margin-bottom: 6px;">Multi-Disciplinary Self-Delivery</div>
            <p style="font-size: 10.5px; color: #475569; line-height: 1.5; margin: 0;">
              EntireFM is an integrated Hard FM provider delivering planned preventative maintenance, commercial roofing, industrial rope access (IRATA), 
              building fabric servicing, and 24/7 emergency Helpdesk dispatch across commercial portfolios nationwide.
            </p>
          </div>
        </div>

        <!-- Next Commercial Steps CTA Box -->
        <div style="background-color: #0B1220; color: #ffffff; border-radius: 4px; padding: 22px; margin-bottom: 20px; position: relative;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #EC4899; margin-bottom: 8px;">
            Next Operational Steps
          </div>
          <h3 style="font-size: 18px; font-weight: 500; margin: 0 0 8px 0; color: #ffffff;">
            Authorise Airspace Review &amp; Flight Quotation
          </h3>
          <p style="font-size: 11.5px; color: #94A3B8; line-height: 1.6; margin: 0 0 18px 0; max-width: 90%;">
            Contact our Commercial Aviation Desk to confirm flight permissions, coordinate property access cordons, and receive a formal binding proposal.
          </p>

          <table style="width: 100%; font-size: 11.5px; color: #F8FAFC; border-top: 1px solid #1E293B; padding-top: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #94A3B8; width: 35%;">Commercial Aviation Desk:</td>
              <td style="padding: 4px 0; color: #EC4899; font-weight: 700; font-size: 13px;">${about.cta.phoneDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94A3B8;">Operations &amp; Survey Email:</td>
              <td style="padding: 4px 0; color: #ffffff;">${about.cta.email}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94A3B8;">Web &amp; Tender Portal:</td>
              <td style="padding: 4px 0; color: #94A3B8;">www.entirefm.com/services/drone-services</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Footer & Statutory Disclaimer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 14px;">
        <div style="font-size: 8.5px; color: #94A3B8; line-height: 1.5; margin-bottom: 6px;">
          <strong>Operational Notice &amp; Disclaimer:</strong> Entire Facilities Management Ltd is registered in England &amp; Wales.
          This document is generated for indicative scoping and planning purposes. This document does not constitute a formal binding commercial quotation. 
          Commercial flight deployment remains strictly subject to physical site risk assessment (RAMS), Civil Aviation Authority airspace authorisation, 
          third-party landowner permissions, and acceptable meteorological conditions on the designated flight date.
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
          <span>Entire Facilities Management · www.entirefm.com</span>
          <span>Page 4 of 4</span>
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// MASTER DOCUMENT COMPILER & DOWNLOAD HANDLER
// ---------------------------------------------------------------------------
export function buildDroneInspectionPackHtml(data: DroneInspectionReportData): string {
  const dateStr = data.dateStr || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const cover = buildCoverPage(data, dateStr);
  const recommendation = buildRecommendationPage(data);
  const deliverables = buildDeliverablesAndRemedialsPage(data);
  const aboutAndCta = buildAboutAndCtaPage();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Commercial Drone Inspection Brief — ${data.referenceNumber}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0B1220;
      background-color: #ffffff;
      font-size: 11px;
      line-height: 1.5;
    }
    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      background-color: #ffffff;
      overflow: hidden;
    }
    @media print {
      body {
        width: 210mm;
        height: 297mm;
      }
      .page {
        page-break-after: always;
        break-after: page;
      }
    }
  </style>
</head>
<body>
  ${cover}
  ${recommendation}
  ${deliverables}
  ${aboutAndCta}
</body>
</html>
  `;
}

export function downloadDroneInspectionPack(data: DroneInspectionReportData, filename?: string): void {
  const html = buildDroneInspectionPackHtml(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    if (filename) {
      printWindow.document.title = filename.replace(/\.pdf$/i, '');
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
