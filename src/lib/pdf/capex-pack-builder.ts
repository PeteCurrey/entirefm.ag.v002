/**
 * ASSET LIFECYCLE & CAPEX PLANNER MULTI-PAGE REPORT BUILDER
 * ==========================================================
 * Generates an authoritative, multi-page financial & engineering appraisal PDF:
 * 1. Cover Page: Site profile, generated date, document ref, executive summary KPIs.
 * 2. 10-Year Capital Forecast: Inline vector SVG bar chart + annual capital cash flow table.
 * 3. At-Risk Equipment Schedule: Prioritised inventory of plant at/past expected service life.
 * 4. Why Lifecycle Planning Matters: Operational engineering commentary (zero fabricated numbers).
 * 5. Methodology & Statutory Governance: Benchmark methodology & mandatory planning disclaimer.
 * 6. About EntireFM & Capital Advisory CTA: Direct conversion trigger for site condition appraisals.
 */

import { PPM_PACK_ABOUT_CONTENT } from '@/lib/tools/ppm-pack-content';
import { CapexForecastSummary, CalculatedCapexAsset } from '@/lib/tools/capex-calculator';

export interface CapexReportData {
  siteName?: string;
  organisationName?: string;
  buildingType?: string;
  summary: CapexForecastSummary;
  allAssets: CalculatedCapexAsset[];
  whyThisWorksText?: string;
  whyThisWorksSource?: string;
}

// ---------------------------------------------------------------------------
// 1. COVER PAGE
// ---------------------------------------------------------------------------
function buildCoverPage(data: CapexReportData, docRef: string, dateStr: string): string {
  const { summary } = data;
  const siteLabel = data.siteName?.trim() || 'Commercial Property Portfolio';
  const orgLabel = data.organisationName?.trim() || 'Estate Duty Holder';

  return `
    <div class="page cover-page" style="page-break-after: always; padding: 22mm 16mm 18mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between; box-sizing: border-box;">
      <div>
        <!-- Top Bar -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0B1220; padding-bottom: 18px; margin-bottom: 32px;">
          <div>
            <div style="font-size: 28px; font-weight: 900; letter-spacing: 0.04em; color: #0B1220; line-height: 1;">
              Entire<span style="color: #2563EB;">FM</span>
            </div>
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #64748B; font-weight: 600; margin-top: 6px;">
              Facilities Management · Asset Lifecycle Intelligence
            </div>
          </div>
          <div style="text-align: right; font-size: 10px; color: #64748B; line-height: 1.6;">
            <div><strong>Document Ref:</strong> ${docRef}</div>
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Commercial in Confidence</div>
          </div>
        </div>

        <!-- Eyebrow Badge -->
        <div style="display: inline-block; background-color: #EFF6FF; border: 1px solid #BFDBFE; color: #1D4ED8; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 10px; border-radius: 2px; margin-bottom: 14px;">
          Strategic Asset Lifecycle &amp; Capital Replacement Model
        </div>

        <h1 style="font-size: 30px; font-weight: 300; color: #0B1220; line-height: 1.15; margin: 0 0 12px 0; letter-spacing: -0.02em;">
          10-Year Rolling Plant Replacement &amp; CAPEX Forecast
        </h1>
        <p style="font-size: 13px; color: #475569; line-height: 1.6; max-width: 95%; margin: 0 0 26px 0;">
          Commercial forward capital appraisal for <strong>${siteLabel}</strong> (${orgLabel}):
          evaluating mechanical, electrical, and fabric plant service life against industry-standard UK commercial maintenance guidance.
        </p>

        <!-- Estate Parameter Inputs Grid -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 16px 18px; margin-bottom: 24px;">
          <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 10px; border-bottom: 1px solid #CBD5E1; padding-bottom: 5px;">
            Estate Assessment Parameters
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <tr>
              <td style="padding: 4px 0; color: #64748B; width: 40%;">Assessed Facility / Estate:</td>
              <td style="padding: 4px 0; color: #0B1220; font-weight: 600;">${siteLabel}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Client Organisation:</td>
              <td style="padding: 4px 0; color: #0B1220; font-weight: 600;">${orgLabel}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Cost Index Region:</td>
              <td style="padding: 4px 0; color: #0B1220; font-weight: 600;">${summary.regionName} (${summary.regionalMultiplier}x Index)</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Assessed Plant Assets:</td>
              <td style="padding: 4px 0; color: #0B1220; font-weight: 600;">${summary.totalAssetsCount} Equipment Groups (${summary.totalAssetUnits} total units)</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Average Plant Age:</td>
              <td style="padding: 4px 0; color: #0B1220; font-weight: 600;">${summary.averageAssetAge} years (Oldest asset: ${summary.oldestAssetAge} years)</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Forecast Planning Horizon:</td>
              <td style="padding: 4px 0; color: #0B1220; font-weight: 600;">10 Years (${summary.horizonStartYear} – ${summary.horizonEndYear})</td>
            </tr>
          </table>
        </div>

        <!-- 4 Key Executive Metrics Scorecard -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px;">
          <div style="background-color: #0B1220; color: #ffffff; border-radius: 4px; padding: 14px 12px;">
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; font-weight: 600;">Total 10-Yr CAPEX</div>
            <div style="font-size: 20px; font-weight: 700; color: #38BDF8; margin-top: 4px;">£${summary.totalTenYearCapex.toLocaleString()}</div>
            <div style="font-size: 9px; color: #94A3B8; margin-top: 2px;">Forecasted renewal spend</div>
          </div>

          <div style="background-color: ${summary.immediateAtRiskCapital > 0 ? '#FEF2F2' : '#F8FAFC'}; border: 1px solid ${summary.immediateAtRiskCapital > 0 ? '#FCA5A5' : '#E2E8F0'}; border-radius: 4px; padding: 14px 12px;">
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: ${summary.immediateAtRiskCapital > 0 ? '#991B1B' : '#64748B'}; font-weight: 600;">At-Risk Capital Now</div>
            <div style="font-size: 20px; font-weight: 700; color: ${summary.immediateAtRiskCapital > 0 ? '#DC2626' : '#0B1220'}; margin-top: 4px;">£${summary.immediateAtRiskCapital.toLocaleString()}</div>
            <div style="font-size: 9px; color: ${summary.immediateAtRiskCapital > 0 ? '#B91C1C' : '#64748B'}; margin-top: 2px;">${summary.immediateAtRiskCount} items overdue/past life</div>
          </div>

          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px 12px;">
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 600;">Average Asset Age</div>
            <div style="font-size: 20px; font-weight: 700; color: #0B1220; margin-top: 4px;">${summary.averageAssetAge} yrs</div>
            <div style="font-size: 9px; color: #64748B; margin-top: 2px;">Across all registered items</div>
          </div>

          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px 12px;">
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 600;">Peak Spend Year</div>
            <div style="font-size: 20px; font-weight: 700; color: #0B1220; margin-top: 4px;">
              ${
                summary.forecastYears.reduce((max, y) => (y.totalSpend > max.totalSpend ? y : max), summary.forecastYears[0])?.year || summary.horizonStartYear
              }
            </div>
            <div style="font-size: 9px; color: #64748B; margin-top: 2px;">Highest replacement year</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>EntireFM Commercial Asset Lifecycle Planning Tool</span>
        <span>Page 1 of 4 · Commercial in Confidence</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 2. 10-YEAR FORECAST PAGE (Vector SVG Bar Chart + Tabular Breakdown)
// ---------------------------------------------------------------------------
function buildForecastPage(data: CapexReportData, docRef: string): string {
  const { summary } = data;
  const maxYearSpend = Math.max(1, ...summary.forecastYears.map((y) => y.totalSpend));

  // Build SVG Vector Bar Chart
  const chartWidth = 580;
  const chartHeight = 160;
  const barWidth = 38;
  const gap = (chartWidth - barWidth * 10) / 9;

  const svgBars = summary.forecastYears
    .map((y, idx) => {
      const height = maxYearSpend > 0 ? Math.round((y.totalSpend / maxYearSpend) * (chartHeight - 40)) : 0;
      const x = idx * (barWidth + gap);
      const yPos = chartHeight - 25 - height;
      const isPeak = y.totalSpend === maxYearSpend && y.totalSpend > 0;
      const fillColor = idx === 0 && summary.immediateAtRiskCapital > 0 ? '#DC2626' : isPeak ? '#2563EB' : '#3B82F6';

      return `
        <g>
          <!-- Bar -->
          <rect x="${x}" y="${yPos}" width="${barWidth}" height="${Math.max(2, height)}" fill="${fillColor}" rx="2" />
          <!-- Spend Label -->
          <text x="${x + barWidth / 2}" y="${yPos - 6}" font-size="8.5" font-weight="700" text-anchor="middle" fill="#0B1220">
            ${y.totalSpend > 0 ? `£${Math.round(y.totalSpend / 1000)}k` : '£0'}
          </text>
          <!-- Year Label -->
          <text x="${x + barWidth / 2}" y="${chartHeight - 10}" font-size="9" font-weight="600" text-anchor="middle" fill="#64748B">
            ${y.year}
          </text>
          <text x="${x + barWidth / 2}" y="${chartHeight}" font-size="7.5" text-anchor="middle" fill="#94A3B8">
            Yr ${y.relativeYear}
          </text>
        </g>
      `;
    })
    .join('');

  const chartSvg = `
    <svg width="100%" height="${chartHeight + 10}" viewBox="0 0 ${chartWidth} ${chartHeight + 10}" style="display: block; margin: 10px 0;">
      <!-- Grid line -->
      <line x1="0" y1="${chartHeight - 25}" x2="${chartWidth}" y2="${chartHeight - 25}" stroke="#E2E8F0" stroke-width="1" />
      ${svgBars}
    </svg>
  `;

  // Build Cash Flow Table
  const tableRows = summary.forecastYears
    .map((y) => {
      const assetDescriptions = y.assets.map((a) => `${a.displayName} (${a.quantity})`).join(', ') || 'No scheduled renewals';
      return `
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 6px 8px; font-weight: 700; color: #0B1220;">${y.year} (Yr ${y.relativeYear})</td>
          <td style="padding: 6px 8px; text-align: center; color: #475569;">${y.assetCount}</td>
          <td style="padding: 6px 8px; font-size: 10px; color: #475569;">${assetDescriptions}</td>
          <td style="padding: 6px 8px; text-align: right; font-weight: 700; color: #0B1220;">£${y.totalSpend.toLocaleString()}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="page" style="page-break-after: always; padding: 20mm 16mm 18mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between; box-sizing: border-box;">
      <div>
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220;">
            10-Year Rolling Capital Forecast
          </div>
          <div style="font-size: 9px; color: #64748B;">Ref: ${docRef}</div>
        </div>

        <h2 style="font-size: 18px; font-weight: 400; color: #0B1220; margin: 0 0 6px 0;">
          Annual Replacement Spend Trajectory (${summary.horizonStartYear} – ${summary.horizonEndYear})
        </h2>
        <p style="font-size: 11px; color: #64748B; margin: 0 0 16px 0; line-height: 1.5;">
          Projected capital expenditure profile by calendar year based on equipment age, user condition rating, and EntireFM indicative lifecycle benchmarks.
        </p>

        <!-- Chart Container -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px 16px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0B1220;">
              Projected Capital Outlay (£)
            </span>
            <div style="display: flex; gap: 14px; font-size: 9px; color: #64748B;">
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; background: #DC2626; display: inline-block; border-radius: 1px;"></span> Immediate / Overdue
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; background: #2563EB; display: inline-block; border-radius: 1px;"></span> Peak Horizon
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; background: #3B82F6; display: inline-block; border-radius: 1px;"></span> Scheduled Renewal
              </span>
            </div>
          </div>
          ${chartSvg}
        </div>

        <!-- Tabular Cash Flow Schedule -->
        <div style="border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
            <thead>
              <tr style="background-color: #0B1220; color: #ffffff;">
                <th style="padding: 7px 8px; text-align: left; font-weight: 600; width: 18%;">Year</th>
                <th style="padding: 7px 8px; text-align: center; font-weight: 600; width: 12%;">Units</th>
                <th style="padding: 7px 8px; text-align: left; font-weight: 600; width: 50%;">Renewed Plant Items</th>
                <th style="padding: 7px 8px; text-align: right; font-weight: 600; width: 20%;">Capital Spend</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr style="background-color: #F8FAFC; border-top: 2px solid #0B1220; font-weight: 700;">
                <td style="padding: 8px; color: #0B1220;">Total 10-Year Horizon</td>
                <td style="padding: 8px; text-align: center; color: #0B1220;">${summary.totalAssetUnits}</td>
                <td style="padding: 8px; color: #64748B; font-size: 10px;">Full estate forward capital schedule</td>
                <td style="padding: 8px; text-align: right; color: #2563EB; font-size: 12px;">£${summary.totalTenYearCapex.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>EntireFM Commercial Asset Lifecycle Planning Tool</span>
        <span>Page 2 of 4 · Commercial in Confidence</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 3. AT-RISK ASSET INVENTORY & PRIORITY REGISTER
// ---------------------------------------------------------------------------
function buildAtRiskPage(data: CapexReportData, docRef: string): string {
  const { summary } = data;
  const hasAtRisk = summary.atRiskAssets.length > 0;

  const atRiskRows = hasAtRisk
    ? summary.atRiskAssets
        .map((a) => {
          const overdueYears = Math.abs(a.remainingUsefulLife);
          return `
            <tr style="border-bottom: 1px solid #FEE2E2;">
              <td style="padding: 7px 8px; font-weight: 700; color: #991B1B;">${a.displayName}</td>
              <td style="padding: 7px 8px; color: #475569;">${a.categoryName}</td>
              <td style="padding: 7px 8px; text-align: center; color: #475569;">${a.installYear} (${a.ageYears} yrs)</td>
              <td style="padding: 7px 8px; text-align: center; color: #475569;">${a.condition}</td>
              <td style="padding: 7px 8px; text-align: center; font-weight: 700; color: #DC2626;">
                ${overdueYears === 0 ? 'Due Now' : `${overdueYears} yr${overdueYears > 1 ? 's' : ''} overdue`}
              </td>
              <td style="padding: 7px 8px; text-align: right; font-weight: 700; color: #0B1220;">
                £${a.totalCost.toLocaleString()}
              </td>
            </tr>
          `;
        })
        .join('')
    : `
      <tr>
        <td colspan="6" style="padding: 24px; text-align: center; color: #16A34A; font-weight: 600;">
          No assets currently operating past indicative economic service life.
        </td>
      </tr>
    `;

  // General Asset Register Table (First 8 items)
  const remainingAssets = data.allAssets
    .filter((a) => !a.isAtRiskNow)
    .sort((a, b) => a.remainingUsefulLife - b.remainingUsefulLife)
    .slice(0, 8);

  const remainingRows = remainingAssets
    .map((a) => `
      <tr style="border-bottom: 1px solid #F1F5F9;">
        <td style="padding: 6px 8px; font-weight: 600; color: #0B1220;">${a.displayName}</td>
        <td style="padding: 6px 8px; color: #64748B;">${a.categoryName}</td>
        <td style="padding: 6px 8px; text-align: center; color: #64748B;">${a.installYear}</td>
        <td style="padding: 6px 8px; text-align: center; color: #64748B;">${a.condition}</td>
        <td style="padding: 6px 8px; text-align: center; font-weight: 600; color: #2563EB;">${a.replacementDueYear} (+${a.remainingUsefulLife} yrs)</td>
        <td style="padding: 6px 8px; text-align: right; font-weight: 600; color: #0B1220;">£${a.totalCost.toLocaleString()}</td>
      </tr>
    `)
    .join('');

  return `
    <div class="page" style="page-break-after: always; padding: 20mm 16mm 18mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between; box-sizing: border-box;">
      <div>
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220;">
            Plant Risk Prioritisation &amp; Asset Register
          </div>
          <div style="font-size: 9px; color: #64748B;">Ref: ${docRef}</div>
        </div>

        <h2 style="font-size: 18px; font-weight: 400; color: #0B1220; margin: 0 0 6px 0;">
          Urgent Action: Equipment Past Expected Economic Life
        </h2>
        <p style="font-size: 11px; color: #64748B; margin: 0 0 16px 0; line-height: 1.5;">
          Plant items operating beyond their indicative service life present compounded risk of sudden failure, high reactive callout rates, and unbudgeted emergency capital demands.
        </p>

        <!-- Red At-Risk Alert Table -->
        <div style="border: 1px solid #FCA5A5; border-radius: 4px; overflow: hidden; margin-bottom: 24px; background-color: #FEF2F2;">
          <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
            <thead>
              <tr style="background-color: #991B1B; color: #ffffff;">
                <th style="padding: 7px 8px; text-align: left; font-weight: 600; width: 28%;">Asset Item</th>
                <th style="padding: 7px 8px; text-align: left; font-weight: 600; width: 20%;">Discipline</th>
                <th style="padding: 7px 8px; text-align: center; font-weight: 600; width: 16%;">Installed</th>
                <th style="padding: 7px 8px; text-align: center; font-weight: 600; width: 10%;">Condition</th>
                <th style="padding: 7px 8px; text-align: center; font-weight: 600; width: 12%;">Risk Status</th>
                <th style="padding: 7px 8px; text-align: right; font-weight: 600; width: 14%;">Est. CAPEX</th>
              </tr>
            </thead>
            <tbody>
              ${atRiskRows}
            </tbody>
          </table>
        </div>

        <!-- Medium-to-Long Horizon Asset Register -->
        <h3 style="font-size: 13px; font-weight: 600; color: #0B1220; margin: 0 0 8px 0;">
          Forward Renewal Pipeline (Next Upcoming Assets)
        </h3>
        <div style="border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0; color: #0B1220;">
                <th style="padding: 6px 8px; text-align: left; font-weight: 600;">Asset Item</th>
                <th style="padding: 6px 8px; text-align: left; font-weight: 600;">Discipline</th>
                <th style="padding: 6px 8px; text-align: center; font-weight: 600;">Install Year</th>
                <th style="padding: 6px 8px; text-align: center; font-weight: 600;">Condition</th>
                <th style="padding: 6px 8px; text-align: center; font-weight: 600;">Due Year (RUL)</th>
                <th style="padding: 6px 8px; text-align: right; font-weight: 600;">Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              ${remainingRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>EntireFM Commercial Asset Lifecycle Planning Tool</span>
        <span>Page 3 of 4 · Commercial in Confidence</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 4. AI COMMENTARY, METHODOLOGY, DISCLAIMER & CTA
// ---------------------------------------------------------------------------
function buildMethodologyAndCtaPage(data: CapexReportData, docRef: string): string {
  const whyItWorks = data.whyThisWorksText ||
    'Operating critical commercial building assets beyond their recognized economic service life drastically compounds operational vulnerability, energy inefficiency, and sudden emergency disruption. When aging boilers, chillers, or lifting plant operate past expected thresholds, component obsolescence forces facilities managers into unbudgeted emergency replacements, protracted lead times for specialist plant, and severe operational interruption. Implementing a structured capital expenditure replacement plan replaces reactionary crisis management with orderly forward budgeting. Forward procurement enables competitive engineering tendering, prevents catastrophic mid-season breakdown, and ensures replacement equipment delivers modern seasonal efficiency standards. Proactive lifecycle forecasting transforms unpredictable capital emergencies into controlled, board-approved estate modernization programs.';

  const about = PPM_PACK_ABOUT_CONTENT;

  return `
    <div class="page" style="page-break-after: avoid; padding: 20mm 16mm 18mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between; box-sizing: border-box;">
      <div>
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 18px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220;">
            Strategic Advisory &amp; Next Steps
          </div>
          <div style="font-size: 9px; color: #64748B;">Ref: ${docRef}</div>
        </div>

        <!-- AI Commentary Section -->
        <div style="background-color: #F8FAFC; border-left: 3px solid #2563EB; border-radius: 0 4px 4px 0; padding: 14px 16px; margin-bottom: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0B1220;">
              Why Strategic Lifecycle Planning Matters
            </div>
            <span style="font-size: 8.5px; background-color: #EFF6FF; color: #1D4ED8; padding: 2px 6px; border-radius: 2px; font-weight: 600;">
              Lead Asset Surveyor Advisory
            </span>
          </div>
          <p style="font-size: 11px; line-height: 1.6; color: #334155; margin: 0;">
            ${whyItWorks}
          </p>
        </div>

        <!-- Mandatory Planning Disclaimer Box -->
        <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 4px; padding: 12px 14px; margin-bottom: 18px;">
          <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #92400E; margin-bottom: 4px;">
            Methodology &amp; Strategic Planning Disclaimer
          </div>
          <p style="font-size: 9.5px; line-height: 1.5; color: #78350F; margin: 0;">
            This capital expenditure planner provides an indicative lifecycle model based on generalised UK commercial plant service lives and user-declared asset condition. It is designed for forward budgeting and strategic prioritisation only. It does not constitute a physical structural survey, invasive M&amp;E inspection, or fixed-price quotation. A formal capital expenditure schedule requires an on-site technical condition assessment by a qualified engineer.
          </p>
        </div>

        <!-- About EntireFM -->
        <div style="margin-bottom: 18px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0B1220; margin-bottom: 6px;">
            About EntireFM
          </div>
          <p style="font-size: 10.5px; line-height: 1.5; color: #475569; margin: 0 0 6px 0;">
            ${about.sections[0]?.paragraphs[0] || 'Entire Facilities Management provides planned preventative maintenance, statutory compliance, and building engineering across UK commercial portfolios.'}
          </p>
          <div style="font-size: 9.5px; color: #64748B;">
            SafeContractor, BESA, Gas Safe, Refcom, and ISO 9001 / 14001 / 45001 Accredited.
          </div>
        </div>

        <!-- Conversion CTA Block -->
        <div style="background-color: #0B1220; color: #ffffff; border-radius: 4px; padding: 16px 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">
                Commission an On-Site M&amp;E Plant Condition Appraisal
              </div>
              <div style="font-size: 10px; color: #94A3B8; max-width: 420px; line-height: 1.4;">
                Transform this indicative desktop model into an engineer-validated, warranty-backed capital plan. EntireFM conducts non-invasive and intrusive asset surveys across commercial portfolios nationwide.
              </div>
            </div>
            <div style="text-align: right; font-size: 10px; line-height: 1.6;">
              <div style="font-weight: 700; color: #38BDF8;">Call: 0800 689 0422</div>
              <div style="color: #94A3B8;">info@entirefm.com</div>
              <div style="color: #94A3B8;">www.entirefm.com</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>EntireFM Commercial Asset Lifecycle Planning Tool</span>
        <span>Page 4 of 4 · Commercial in Confidence</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// MAIN HTML COMPILER & PRINT CONTROLLER
// ---------------------------------------------------------------------------
export function buildCapexPackHtml(data: CapexReportData): string {
  const docRef = `EFM-CAPEX-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const cover = buildCoverPage(data, docRef, dateStr);
  const forecast = buildForecastPage(data, docRef);
  const atRisk = buildAtRiskPage(data, docRef);
  const methodologyAndCta = buildMethodologyAndCtaPage(data, docRef);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EntireFM Asset Lifecycle &amp; CAPEX Appraisal - ${data.siteName || 'Commercial Portfolio'}</title>
  <style>
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
  ${forecast}
  ${atRisk}
  ${methodologyAndCta}
</body>
</html>
  `;
}

export function downloadCapexPack(data: CapexReportData, filename?: string): void {
  const html = buildCapexPackHtml(data);
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
