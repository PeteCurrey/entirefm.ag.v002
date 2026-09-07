/**
 * FM ROI & TCO CALCULATOR MULTI-SECTION REPORT BUILDER
 * ======================================================
 * Generates an authoritative, multi-page financial appraisal PDF:
 * 1. Cover Page: Portfolio scale, date generated, document ref, classification, summary KPIs.
 * 2. Current State vs. Projected State: Inline vector SVG grouped bar chart + comparative cost table.
 * 3. 5-Year Cumulative Value: Vector SVG line/area chart + year-by-year milestone table.
 * 4. "Why This Works": Qualitative operational commentary with formal commercial disclaimer.
 * 5. Assumptions & Methodology: Plain-English breakdown of consolidation levers & survey prerequisites.
 * 6. About EntireFM: Reuses canonical `PPM_PACK_ABOUT_CONTENT`.
 * 7. Final Commercial CTA: "Request Contract Benchmark" with direct technical desk contact details.
 *
 * Reuses the canonical print/HTML-to-PDF architecture matching `ppm-estimator-pack-builder.ts`.
 */

import { PPM_PACK_ABOUT_CONTENT } from '@/lib/tools/ppm-pack-content';

export interface FmRoiReportData {
  portfolioSites: number;
  reactiveSpend: number;
  currentPpmSpend: number;
  supplierCount: number;
  adminHoursPerMonth: number;
  hourlyAdminRate: number;
  unplannedOutages: number;
  avgOutageCost: number;
  annualAdminCost: number;
  annualOutageCost: number;
  currentTotalTco: number;
  projectedReactiveSpend: number;
  projectedPpmSpend: number;
  projectedAdminCost: number;
  projectedOutageCost: number;
  projectedTotalTco: number;
  totalPotentialSavings: number;
  percentageSavings: number;
  fiveYearSavings: number;
  fiveYearCumulative: Array<{ year: string; annual: number; cumulative: number }>;
  whyThisWorksText?: string;
  whyThisWorksSource?: string;
}

// ---------------------------------------------------------------------------
// 1. COVER PAGE
// ---------------------------------------------------------------------------
function buildCoverPage(data: FmRoiReportData, docRef: string, dateStr: string): string {
  return `
    <div class="page cover-page" style="page-break-after: always; padding: 24mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Top Bar -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0B1220; padding-bottom: 20px; margin-bottom: 40px;">
          <div>
            <div style="font-size: 28px; font-weight: 900; letter-spacing: 0.04em; color: #0B1220; line-height: 1;">
              Entire<span style="color: #2563EB;">FM</span>
            </div>
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #64748B; font-weight: 600; margin-top: 6px;">
              Facilities Management · Commercial Intelligence
            </div>
          </div>
          <div style="text-align: right; font-size: 10px; color: #64748B; line-height: 1.6;">
            <div><strong>Document Ref:</strong> ${docRef}</div>
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Commercial in Confidence</div>
          </div>
        </div>

        <!-- Document Type Eyebrow -->
        <div style="display: inline-block; background-color: #EFF6FF; border: 1px solid #BFDBFE; color: #1D4ED8; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 10px; border-radius: 2px; margin-bottom: 16px;">
          Commercial Cost Appraisal &amp; Financial Model
        </div>

        <h1 style="font-size: 32px; font-weight: 300; color: #0B1220; line-height: 1.15; margin: 0 0 14px 0; letter-spacing: -0.02em;">
          Estate Facilities Management TCO &amp; Consolidation Appraisal
        </h1>
        <p style="font-size: 13.5px; color: #475569; line-height: 1.6; max-width: 92%; margin: 0 0 32px 0;">
          Comparative total cost of ownership appraisal for an estate of <strong>${data.portfolioSites} building${data.portfolioSites > 1 ? 's' : ''}</strong>:
          contrasting a fragmented, multi-contractor baseline with an integrated, single-provider planned delivery model.
        </p>

        <!-- Estate Parameter Inputs Grid -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 18px 20px; margin-bottom: 28px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 12px; border-bottom: 1px solid #CBD5E1; padding-bottom: 6px;">
            Modelled Estate Operating Parameters
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
            <tr>
              <td style="padding: 5px 0; color: #64748B; width: 40%;">Portfolio Scope:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${data.portfolioSites} Property Building${data.portfolioSites > 1 ? 's' : ''}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Active Specialist Contractors:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${data.supplierCount} Independent Trade Suppliers</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Current Annual Reactive Spend:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">£${data.reactiveSpend.toLocaleString()} / year</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Current Annual Planned PPM:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">£${data.currentPpmSpend.toLocaleString()} / year</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Contract Administration Overhead:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${data.adminHoursPerMonth} hrs/mo @ £${data.hourlyAdminRate}/hr (~£${data.annualAdminCost.toLocaleString()}/yr)</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748B;">Unplanned Plant Outage Baseline:</td>
              <td style="padding: 5px 0; color: #0B1220; font-weight: 600;">${data.unplannedOutages} Events/yr (~£${data.annualOutageCost.toLocaleString()}/yr disruption cost)</td>
            </tr>
          </table>
        </div>

        <!-- KPI Benefit Boxes -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
          <div style="background-color: #0B1220; color: #ffffff; padding: 14px; border-radius: 4px;">
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; margin-bottom: 4px;">Baseline TCO</div>
            <div style="font-size: 16px; font-weight: 600;">£${data.currentTotalTco.toLocaleString()}</div>
            <div style="font-size: 8.5px; color: #64748B;">per annum</div>
          </div>
          <div style="background-color: #0B1220; color: #ffffff; padding: 14px; border-radius: 4px;">
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; margin-bottom: 4px;">Target TCO</div>
            <div style="font-size: 16px; font-weight: 600; color: #60A5FA;">£${data.projectedTotalTco.toLocaleString()}</div>
            <div style="font-size: 8.5px; color: #64748B;">per annum</div>
          </div>
          <div style="background-color: #0B1220; color: #ffffff; padding: 14px; border-radius: 4px; border: 1px solid #059669;">
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #34D399; margin-bottom: 4px;">Annual Saving</div>
            <div style="font-size: 16px; font-weight: 700; color: #34D399;">£${data.totalPotentialSavings.toLocaleString()}</div>
            <div style="font-size: 8.5px; color: #A7F3D0;">${data.percentageSavings}% Indicative Reduction</div>
          </div>
          <div style="background-color: #0B1220; color: #ffffff; padding: 14px; border-radius: 4px;">
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; margin-bottom: 4px;">5-Year Value</div>
            <div style="font-size: 16px; font-weight: 600; color: #F8FAFC;">£${data.fiveYearSavings.toLocaleString()}</div>
            <div style="font-size: 8.5px; color: #64748B;">cumulative benefit</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 14px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · Commercial Cost Appraisal</span>
        <span>Page 1 of 5</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 2. CURRENT STATE VS PROJECTED STATE (Grouped Bar Chart + Table)
// ---------------------------------------------------------------------------
function buildCurrentVsProjectedPage(data: FmRoiReportData): string {
  const cats = [
    { name: 'Reactive Callouts', current: data.reactiveSpend, projected: data.projectedReactiveSpend, color: '#E11D48' },
    { name: 'Planned PPM', current: data.currentPpmSpend, projected: data.projectedPpmSpend, color: '#2563EB' },
    { name: 'Contract Admin', current: data.annualAdminCost, projected: data.projectedAdminCost, color: '#D97706' },
    { name: 'Outage Disruption', current: data.annualOutageCost, projected: data.projectedOutageCost, color: '#7C3AED' },
  ];

  const maxVal = Math.max(...cats.map((c) => Math.max(c.current, c.projected)), 1000);

  // Build SVG bars
  // SVG size: 480 x 140
  const svgBars = cats
    .map((c, i) => {
      const y = i * 32 + 10;
      const curW = Math.round((c.current / maxVal) * 260);
      const projW = Math.round((c.projected / maxVal) * 260);

      return `
        <!-- ${c.name} -->
        <text x="0" y="${y + 11}" font-size="10" fill="#334155" font-family="sans-serif">${c.name}</text>
        
        <!-- Baseline Bar -->
        <rect x="110" y="${y}" width="${curW}" height="9" fill="#94A3B8" rx="1.5" />
        <text x="${115 + curW}" y="${y + 8}" font-size="8.5" fill="#64748B" font-family="sans-serif">£${c.current.toLocaleString()}</text>
        
        <!-- Projected Bar -->
        <rect x="110" y="${y + 12}" width="${projW}" height="9" fill="${c.color}" rx="1.5" />
        <text x="${115 + projW}" y="${y + 20}" font-size="8.5" font-weight="bold" fill="#0F172A" font-family="sans-serif">£${c.projected.toLocaleString()}</text>
      `;
    })
    .join('');

  return `
    <div class="page" style="page-break-after: always; padding: 22mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Section Header -->
        <div style="border-bottom: 1px solid #0B1220; padding-bottom: 12px; margin-bottom: 24px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563EB;">
            Section 01 / Financial Allocation
          </div>
          <h2 style="font-size: 22px; font-weight: 400; color: #0B1220; margin: 4px 0 0 0;">
            Current Baseline vs. Indicative Consolidated Target
          </h2>
          <p style="font-size: 11.5px; color: #64748B; margin: 4px 0 0 0;">
            Direct category comparison contrasting fragmented supplier management with an integrated service framework.
          </p>
        </div>

        <!-- Vector SVG Chart Container -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 18px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0B1220;">
              Comparative Annual Expenditure Chart
            </div>
            <div style="display: flex; gap: 14px; font-size: 9.5px; color: #64748B;">
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #94A3B8; border-radius: 1px;"></span>
                Baseline Spend
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #2563EB; border-radius: 1px;"></span>
                Consolidated Target
              </span>
            </div>
          </div>

          <svg width="100%" height="145" viewBox="0 0 440 140" style="overflow: visible;">
            ${svgBars}
          </svg>
        </div>

        <!-- Comparative Table -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0B1220; margin-bottom: 10px;">
            Detailed Cost Allocation Variance
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="background-color: #0B1220; color: #ffffff;">
                <th style="padding: 9px 12px; text-align: left; font-weight: 600;">Cost Category</th>
                <th style="padding: 9px 12px; text-align: right; font-weight: 600;">Current Baseline</th>
                <th style="padding: 9px 12px; text-align: right; font-weight: 600;">Indicative Target</th>
                <th style="padding: 9px 12px; text-align: right; font-weight: 600;">Modelled Variance</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 8px 12px; color: #1E293B;">Reactive Repairs &amp; Emergency Callouts</td>
                <td style="padding: 8px 12px; text-align: right; color: #64748B;">£${data.reactiveSpend.toLocaleString()}</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #0B1220;">£${data.projectedReactiveSpend.toLocaleString()}</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #059669;">-£${(data.reactiveSpend - data.projectedReactiveSpend).toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #E2E8F0; background-color: #F8FAFC;">
                <td style="padding: 8px 12px; color: #1E293B;">Planned Preventative Maintenance (PPM)</td>
                <td style="padding: 8px 12px; text-align: right; color: #64748B;">£${data.currentPpmSpend.toLocaleString()}</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #0B1220;">£${data.projectedPpmSpend.toLocaleString()}</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #059669;">-£${(data.currentPpmSpend - data.projectedPpmSpend).toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 8px 12px; color: #1E293B;">Internal Contract Admin &amp; Invoicing Overhead</td>
                <td style="padding: 8px 12px; text-align: right; color: #64748B;">£${data.annualAdminCost.toLocaleString()}</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #0B1220;">£${data.projectedAdminCost.toLocaleString()}</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #059669;">-£${(data.annualAdminCost - data.projectedAdminCost).toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #CBD5E1; background-color: #F8FAFC;">
                <td style="padding: 8px 12px; color: #1E293B;">Unplanned Outages &amp; Disruption Cost</td>
                <td style="padding: 8px 12px; text-align: right; color: #64748B;">£${data.annualOutageCost.toLocaleString()}</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #0B1220;">£${data.projectedOutageCost.toLocaleString()}</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #059669;">-£${(data.annualOutageCost - data.projectedOutageCost).toLocaleString()}</td>
              </tr>
              <tr style="background-color: #EFF6FF; border-top: 2px solid #2563EB;">
                <td style="padding: 10px 12px; font-weight: 700; color: #0B1220;">TOTAL ANNUAL ESTATE TCO</td>
                <td style="padding: 10px 12px; text-align: right; color: #64748B; font-weight: 600;">£${data.currentTotalTco.toLocaleString()}</td>
                <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #2563EB; font-size: 12px;">£${data.projectedTotalTco.toLocaleString()}</td>
                <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #059669; font-size: 12px;">-£${data.totalPotentialSavings.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #F1F5F9; border-left: 3px solid #64748B; padding: 10px 12px; font-size: 10px; color: #475569; line-height: 1.5;">
          <strong>Model Interpretation:</strong> The largest single operational cost avoidance occurs through scheduled preventative intervention, which arrests premature mechanical degradation and eliminates duplicate supplier call-out surcharges.
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 14px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · Cost Allocation Breakdown</span>
        <span>Page 2 of 5</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 3. 5-YEAR CUMULATIVE VALUE TRAJECTORY
// ---------------------------------------------------------------------------
function buildFiveYearTrajectoryPage(data: FmRoiReportData): string {
  const years = data.fiveYearCumulative;

  // Build SVG Line & Area chart points
  // Width: 460, Height: 120
  // X values: 30, 130, 230, 330, 430
  // Y range: from 105 (baseline) up to 20 (max 5 year saving)
  const maxSav = data.fiveYearSavings > 0 ? data.fiveYearSavings : 1000;
  const coords = years.map((y, i) => {
    const cx = 30 + i * 100;
    const cy = Math.round(105 - (y.cumulative / maxSav) * 85);
    return { ...y, cx, cy };
  });

  const polyPoints = [`30,105`, ...coords.map((c) => `${c.cx},${c.cy}`), `430,105`].join(' ');
  const linePoints = coords.map((c) => `${c.cx},${c.cy}`).join(' ');

  return `
    <div class="page" style="page-break-after: always; padding: 22mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Section Header -->
        <div style="border-bottom: 1px solid #0B1220; padding-bottom: 12px; margin-bottom: 24px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563EB;">
            Section 02 / Multi-Year Value Realisation
          </div>
          <h2 style="font-size: 22px; font-weight: 400; color: #0B1220; margin: 4px 0 0 0;">
            5-Year Cumulative Value Trajectory
          </h2>
          <p style="font-size: 11.5px; color: #64748B; margin: 4px 0 0 0;">
            Compound financial impact of consolidated planned maintenance over a standard 5-year commercial estate horizon.
          </p>
        </div>

        <!-- Vector SVG Area Chart Container -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 18px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0B1220;">
              Cumulative Savings Growth (£ Sterling)
            </div>
            <div style="font-size: 10.5px; font-weight: 600; color: #059669;">
              5-Year Value: £${data.fiveYearSavings.toLocaleString()}
            </div>
          </div>

          <svg width="100%" height="135" viewBox="0 0 460 125" style="overflow: visible;">
            <defs>
              <linearGradient id="pdfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#2563EB" stop-opacity="0.02" />
              </linearGradient>
            </defs>

            <!-- Grid Lines -->
            <line x1="30" y1="20" x2="430" y2="20" stroke="#E2E8F0" stroke-dasharray="3 3" />
            <line x1="30" y1="62" x2="430" y2="62" stroke="#E2E8F0" stroke-dasharray="3 3" />
            <line x1="30" y1="105" x2="430" y2="105" stroke="#CBD5E1" stroke-width="1" />

            <!-- Shaded Area -->
            <polygon points="${polyPoints}" fill="url(#pdfGrad)" />

            <!-- Trend Polyline -->
            <polyline points="${linePoints}" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />

            <!-- Data Dots & Milestone Labels -->
            ${coords
              .map(
                (c) => `
                <g>
                  <circle cx="${c.cx}" cy="${c.cy}" r="4" fill="#ffffff" stroke="#2563EB" stroke-width="2" />
                  <text x="${c.cx}" y="${c.cy - 8}" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#0B1220" font-family="sans-serif">
                    £${Math.round(c.cumulative / 1000)}k
                  </text>
                  <text x="${c.cx}" y="118" text-anchor="middle" font-size="9" fill="#64748B" font-family="sans-serif">
                    ${c.year}
                  </text>
                </g>
              `
              )
              .join('')}
          </svg>
        </div>

        <!-- Milestone Table -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0B1220; margin-bottom: 10px;">
            Annual vs. Cumulative Financial Progression
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="background-color: #0B1220; color: #ffffff;">
                <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Operating Period</th>
                <th style="padding: 8px 12px; text-align: right; font-weight: 600;">Annualized Saving</th>
                <th style="padding: 8px 12px; text-align: right; font-weight: 600;">Cumulative Benefit</th>
                <th style="padding: 8px 12px; text-align: right; font-weight: 600;">Estate Status</th>
              </tr>
            </thead>
            <tbody>
              ${years
                .map(
                  (y, idx) => `
                <tr style="border-bottom: 1px solid #E2E8F0; ${idx % 2 === 1 ? 'background-color: #F8FAFC;' : ''}">
                  <td style="padding: 8px 12px; font-weight: 600; color: #1E293B;">Year ${idx + 1}</td>
                  <td style="padding: 8px 12px; text-align: right; color: #059669; font-weight: 600;">£${y.annual.toLocaleString()}</td>
                  <td style="padding: 8px 12px; text-align: right; font-weight: 700; color: #0B1220;">£${y.cumulative.toLocaleString()}</td>
                  <td style="padding: 8px 12px; text-align: right; color: #64748B; font-size: 10px;">
                    ${idx === 0 ? 'Contract consolidation & asset tagging' : idx === 2 ? 'Full PPM cycle & plant optimization' : 'Mature lifecycle efficiency'}
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 4px; padding: 12px 14px; font-size: 10.5px; color: #1E3A8A; line-height: 1.5;">
          <strong>Lifecycle Asset Protection:</strong> Over 5 years, preventative servicing preserves plant residual values, delays capital plant replacement (HVAC chillers, boilers, distribution switchgear), and protects warranty coverage across all maintained buildings.
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 14px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · 5-Year Financial Appraisal</span>
        <span>Page 3 of 5</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 4. "WHY THIS WORKS" & ASSUMPTIONS / METHODOLOGY
// ---------------------------------------------------------------------------
function buildWhyItWorksAndMethodologyPage(data: FmRoiReportData): string {
  const commentaryText =
    data.whyThisWorksText ||
    'Consolidating fragmented maintenance contractors under a single planned delivery model replaces disconnected callouts with structured, multidisciplinary engineering visits. Integrating mechanical, electrical, and statutory obligations within one planned schedule eliminates duplicate dispatch travel fees and reduces administrative processing time. Proactive servicing identifies mechanical degradation before plant failure occurs, significantly dampening emergency callouts and protecting continuous commercial uptime.';

  return `
    <div class="page" style="page-break-after: always; padding: 22mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Section Header -->
        <div style="border-bottom: 1px solid #0B1220; padding-bottom: 12px; margin-bottom: 24px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563EB;">
            Section 03 / Operational Rationale &amp; Governance
          </div>
          <h2 style="font-size: 22px; font-weight: 400; color: #0B1220; margin: 4px 0 0 0;">
            Operational Rationale &amp; Model Methodology
          </h2>
          <p style="font-size: 11.5px; color: #64748B; margin: 4px 0 0 0;">
            Qualitative engineering principles explaining why contractor consolidation delivers sustainable estate efficiencies.
          </p>
        </div>

        <!-- "Why This Works" Commentary Box -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 18px 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #CBD5E1; padding-bottom: 8px;">
            <div style="font-size: 11.5px; font-weight: 700; color: #0B1220; text-transform: uppercase; letter-spacing: 0.06em;">
              Why Consolidation Works
            </div>
            <div style="font-size: 9.5px; color: #2563EB; font-weight: 600; background: #EFF6FF; padding: 2px 8px; border-radius: 2px; border: 1px solid #BFDBFE;">
              ${data.whyThisWorksSource === 'GROUNDED_GEMINI_CLAUDE' ? 'Grounded UK FM Industry Evidence' : 'Commercial FM Benchmark'}
            </div>
          </div>
          <p style="font-size: 12px; color: #334155; line-height: 1.65; margin: 0 0 12px 0;">
            ${commentaryText}
          </p>
          <div style="font-size: 9.5px; color: #64748B; font-style: italic;">
            Note: This commentary explains general commercial facilities management restructuring principles and does not represent a defense of any single fixed quotation.
          </div>
        </div>

        <!-- Assumptions & Methodology Breakdown -->
        <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 18px 20px; background-color: #ffffff; margin-bottom: 20px;">
          <div style="font-size: 11.5px; font-weight: 700; color: #0B1220; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            Core Calculation Methodology &amp; Levers
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 11px; color: #475569; line-height: 1.5;">
            <div>
              <strong style="color: #0B1220; display: block; margin-bottom: 2px;">1. Reactive Callout Suppression:</strong>
              Routine planned maintenance inspects and services primary mechanical components before failure occurs, systematically reducing avoidable emergency attendances.
            </div>
            <div>
              <strong style="color: #0B1220; display: block; margin-bottom: 2px;">2. Multi-Site PPM Volume Scale:</strong>
              Clustered regional attendance and unified scheduling unlock tiered delivery discounts across multi-property portfolios.
            </div>
            <div>
              <strong style="color: #0B1220; display: block; margin-bottom: 2px;">3. Vendor Administration Removal:</strong>
              Consolidating multiple specialist trade accounts into a single monthly commercial account removes redundant invoice validation, permit coordination, and supplier chasing.
            </div>
            <div>
              <strong style="color: #0B1220; display: block; margin-bottom: 2px;">4. Outage Risk Mitigation:</strong>
              Disciplined statutory compliance checks and continuous plant condition logs significantly reduce catastrophic building downtime events.
            </div>
          </div>
        </div>

        <!-- Survey Prerequisite Callout -->
        <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 4px; padding: 14px 16px; font-size: 10.5px; color: #92400E; line-height: 1.5;">
          <strong>Survey Prerequisite Advisory:</strong> The figures in this appraisal represent an indicative financial model.
          A formal commercial proposal requires an on-site physical asset verification survey and a review of your current supplier agreements, existing asset registers, and site-specific operating hours.
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 14px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · Operational Governance</span>
        <span>Page 4 of 5</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 5. ABOUT ENTIREFM & FINAL COMMERCIAL CTA
// ---------------------------------------------------------------------------
function buildAboutAndCtaPage(): string {
  const about = PPM_PACK_ABOUT_CONTENT;

  return `
    <div class="page" style="page-break-after: avoid; padding: 22mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Section Header -->
        <div style="border-bottom: 1px solid #0B1220; padding-bottom: 12px; margin-bottom: 24px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563EB;">
            Section 04 / Commercial Partnership
          </div>
          <h2 style="font-size: 22px; font-weight: 400; color: #0B1220; margin: 4px 0 0 0;">
            About Entire Facilities Management
          </h2>
          <p style="font-size: 11.5px; color: #64748B; margin: 4px 0 0 0;">
            Contract delivery model, engineering methodology, and commercial governance.
          </p>
        </div>

        <!-- About Sections 1 & 2 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div>
            <div style="font-size: 12.5px; font-weight: 700; color: #0B1220; margin-bottom: 6px;">
              ${about.sections[0].title}
            </div>
            <p style="font-size: 11px; color: #475569; line-height: 1.55; margin: 0 0 10px 0;">
              ${about.sections[0].paragraphs[0]}
            </p>
            <p style="font-size: 11px; color: #475569; line-height: 1.55; margin: 0;">
              ${about.sections[0].paragraphs[1]}
            </p>
          </div>

          <div>
            <div style="font-size: 12.5px; font-weight: 700; color: #0B1220; margin-bottom: 6px;">
              ${about.sections[1].title}
            </div>
            <p style="font-size: 11px; color: #475569; line-height: 1.55; margin: 0 0 10px 0;">
              ${about.sections[1].paragraphs[0]}
            </p>
            <p style="font-size: 11px; color: #475569; line-height: 1.55; margin: 0;">
              ${about.sections[1].paragraphs[1]}
            </p>
          </div>
        </div>

        <!-- Commercial CTA Card (Matches On-Page CTA) -->
        <div style="background-color: #0B1220; color: #ffffff; border-radius: 4px; padding: 24px; margin-bottom: 20px; position: relative;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #38BDF8; margin-bottom: 8px;">
            Next Commercial Steps
          </div>
          <h3 style="font-size: 18px; font-weight: 500; margin: 0 0 8px 0; color: #ffffff;">
            Request a Contract Benchmark
          </h3>
          <p style="font-size: 11.5px; color: #94A3B8; line-height: 1.6; margin: 0 0 20px 0; max-width: 90%;">
            EntireFM delivers consolidated Hard FM, statutory compliance tracking, and 24/7 technical Helpdesk operations with guaranteed SLA performance across commercial estates.
            Arrange a confidential portfolio review and on-site asset verification survey.
          </p>

          <table style="width: 100%; font-size: 11.5px; color: #F8FAFC; border-top: 1px solid #1E293B; padding-top: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #94A3B8; width: 35%;">Technical Operations Desk:</td>
              <td style="padding: 4px 0; color: #60A5FA; font-weight: 700; font-size: 13px;">${about.cta.phoneDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94A3B8;">Commercial Tender Desk:</td>
              <td style="padding: 4px 0; color: #ffffff;">${about.cta.email}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94A3B8;">Online Proposal Portal:</td>
              <td style="padding: 4px 0; color: #94A3B8;">www.entirefm.com/contact-us#enquiry</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Footer & Disclaimer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 14px;">
        <div style="font-size: 8.5px; color: #94A3B8; line-height: 1.5; margin-bottom: 6px;">
          <strong>Statutory Governance:</strong> Entire Facilities Management Ltd is registered in England &amp; Wales.
          This document is generated for indicative operational appraisal purposes. Commercial terms, response times, and final contract pricing are formalized exclusively following a comprehensive physical site survey and agreed service level agreement.
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
          <span>Entire Facilities Management · www.entirefm.com</span>
          <span>Page 5 of 5</span>
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// MASTER DOCUMENT COMPILER & DOWNLOAD HANDLER
// ---------------------------------------------------------------------------
export function buildFmRoiPackHtml(data: FmRoiReportData): string {
  const docRef = `EFM-ROI-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const cover = buildCoverPage(data, docRef, dateStr);
  const currentVsProjected = buildCurrentVsProjectedPage(data);
  const fiveYearTrajectory = buildFiveYearTrajectoryPage(data);
  const whyItWorks = buildWhyItWorksAndMethodologyPage(data);
  const aboutAndCta = buildAboutAndCtaPage();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Commercial Facilities Management TCO &amp; ROI Appraisal — ${data.portfolioSites} Sites</title>
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
  ${currentVsProjected}
  ${fiveYearTrajectory}
  ${whyItWorks}
  ${aboutAndCta}
</body>
</html>
  `;
}

export function downloadFmRoiPack(data: FmRoiReportData, filename?: string): void {
  const html = buildFmRoiPackHtml(data);
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
