/**
 * PPM COST ESTIMATOR MULTI-SECTION REPORT BUILDER
 * ================================================
 * Generates an authoritative, multi-page engineering specification PDF:
 * 1. Cover Page: Branding, property sector, regional footprint, operating profile, document ref, date.
 * 2. Executive Estimate Summary: Budget range, target rate per sq ft, stated model assumptions.
 * 3. Trade Cost Allocation: Inline vector SVG donut chart + detailed discipline breakdown table.
 * 4. Reactive vs. Planned Risk Comparison: Comparative visual, cost avoidance / savings, and penalty model.
 * 5. Commercial Landscape & Market Context: AI-generated regional commentary with formal disclaimer.
 * 6. "What Determines the Final Number": Advisory on why physical asset surveys are essential for fixed contracts.
 * 7. About EntireFM: Reuses canonical `PPM_PACK_ABOUT_CONTENT`.
 * 8. Formal Tender Proposal CTA: Direct contact details and tender submission channels.
 *
 * Uses client-side vector-accurate HTML-to-print execution matching `ppm-pack-builder.ts`.
 */

import { PPM_PACK_ABOUT_CONTENT } from '@/lib/tools/ppm-pack-content';

export interface PpmEstimatorReportData {
  sectorName: string;
  regionName: string;
  operatingProfileName: string;
  floorArea: number;
  siteCount: number;
  serviceScopeLabel: string;
  plantAgeLabel: string;
  lowerBound: number;
  upperBound: number;
  midPoint: number;
  ratePerSqFt: string;
  reactiveMultiplier: number;
  reactiveCost: number;
  potentialSavings: number;
  breakdown: {
    hvac: number;
    electrical: number;
    fireSafety: number;
    waterHygiene: number;
    otherFabric: number;
  };
  marketContextText?: string;
  marketContextSource?: string;
}

// ---------------------------------------------------------------------------
// 1. COVER PAGE
// ---------------------------------------------------------------------------
function buildCoverPage(data: PpmEstimatorReportData, docRef: string, dateStr: string): string {
  return `
    <div class="page cover-page" style="page-break-after: always; padding: 24mm 16mm 20mm 16mm; display: flex; flex-direction: column; min-height: 250mm; justify-content: space-between;">
      <div>
        <!-- Top Bar -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0B1220; padding-bottom: 20px; margin-bottom: 45px;">
          <div>
            <div style="font-size: 28px; font-weight: 900; letter-spacing: 0.04em; color: #0B1220; line-height: 1;">
              Entire<span style="color: #2563EB;">FM</span>
            </div>
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #64748B; font-weight: 600; margin-top: 6px;">
              Facilities Management · Engineering Intelligence
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
          PPM Budget &amp; Commercial Financial Model
        </div>

        <h1 style="font-size: 34px; font-weight: 300; color: #0B1220; line-height: 1.15; margin: 0 0 16px 0; letter-spacing: -0.02em;">
          Planned Preventative Maintenance Expenditure Specification
        </h1>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; max-width: 90%; margin: 0 0 40px 0;">
          Indicative budgetary allocation and statutory maintenance cost model based on estate footprint,
          regional engineering rates, operational duty cycle, and SFG20 standard service intensity.
        </p>

        <!-- Estate Parameter Highlights -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 20px; margin-bottom: 30px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 14px; border-bottom: 1px solid #CBD5E1; padding-bottom: 8px;">
            Target Estate &amp; Operational Profile
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="padding: 6px 0; color: #64748B; width: 35%;">Property Sector:</td>
              <td style="padding: 6px 0; color: #0B1220; font-weight: 600;">${data.sectorName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Regional Location:</td>
              <td style="padding: 6px 0; color: #0B1220; font-weight: 600;">${data.regionName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Gross Internal Area:</td>
              <td style="padding: 6px 0; color: #0B1220; font-weight: 600;">${data.floorArea.toLocaleString()} sq ft ${data.siteCount > 1 ? `(${data.siteCount} properties)` : '(Single property)'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Operating Profile:</td>
              <td style="padding: 6px 0; color: #0B1220; font-weight: 600;">${data.operatingProfileName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Service Intensity Scope:</td>
              <td style="padding: 6px 0; color: #0B1220; font-weight: 600;">${data.serviceScopeLabel}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Primary Asset Age Profile:</td>
              <td style="padding: 6px 0; color: #0B1220; font-weight: 600;">${data.plantAgeLabel}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · Commercial Technical Operations</span>
        <span>Confidential Budget Document · Page 1</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 2. EXECUTIVE SUMMARY & TRADE BREAKDOWN
// ---------------------------------------------------------------------------
function buildExecutiveSummary(data: PpmEstimatorReportData): string {
  const trades = [
    { label: 'HVAC & Mechanical Plant', pct: 38, cost: data.breakdown.hvac, color: '#2563EB' },
    { label: 'Electrical Distribution & Lighting', pct: 22, cost: data.breakdown.electrical, color: '#3B82F6' },
    { label: 'Fire Detection & Life Safety', pct: 18, cost: data.breakdown.fireSafety, color: '#E11D48' },
    { label: 'Water Hygiene & Legionella (LRA)', pct: 12, cost: data.breakdown.waterHygiene, color: '#059669' },
    { label: 'Building Fabric & External Works', pct: 10, cost: data.breakdown.otherFabric, color: '#64748B' },
  ];

  // Generate SVG Donut slices for PDF vector rendering
  // Center: (100, 100), Radius: 70, Stroke-width: 32 (Circumference = 2 * PI * 70 = 439.82)
  const C = 2 * Math.PI * 70;
  let accumulatedOffset = 0;

  const svgSlices = trades.map((t) => {
    const dashLength = (t.pct / 100) * C;
    const dashOffset = -accumulatedOffset;
    accumulatedOffset += dashLength;
    return `<circle cx="100" cy="100" r="70" fill="transparent" stroke="${t.color}" stroke-width="32" stroke-dasharray="${dashLength.toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${dashOffset.toFixed(2)}" transform="rotate(-90 100 100)" />`;
  }).join('\n');

  return `
    <div class="page" style="page-break-after: always; padding: 20mm 16mm; min-height: 250mm; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563EB; margin-bottom: 6px;">
          Section 01 / Financial Expenditure Model
        </div>
        <h2 style="font-size: 24px; font-weight: 300; color: #0B1220; margin: 0 0 16px 0;">
          Executive Expenditure Projection &amp; Trade Allocation
        </h2>

        <!-- Key Financial Metric Cards -->
        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 28px;">
          <!-- Primary Range Banner -->
          <div style="background-color: #0B1220; color: #ffffff; padding: 20px 24px; border-radius: 4px;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #94A3B8; margin-bottom: 6px;">
              Projected Annual PPM Budget Range
            </div>
            <div style="font-size: 26px; font-weight: 600; color: #ffffff; line-height: 1.1; margin-bottom: 12px;">
              £${data.lowerBound.toLocaleString()} – £${data.upperBound.toLocaleString()}
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #1E293B; padding-top: 10px; font-size: 11px; color: #CBD5E1;">
              <span>Indicative Mid-Point:</span>
              <strong style="color: #ffffff;">£${data.midPoint.toLocaleString()} / yr</strong>
            </div>
          </div>

          <!-- Unit Metrics Card -->
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 20px;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; margin-bottom: 6px;">
              Target Baseline Benchmark
            </div>
            <div style="font-size: 26px; font-weight: 600; color: #1D4ED8; line-height: 1.1; margin-bottom: 12px;">
              £${data.ratePerSqFt} <span style="font-size: 14px; font-weight: 400; color: #64748B;">/ sq ft</span>
            </div>
            <div style="font-size: 11px; color: #475569; line-height: 1.4;">
              Reflects full SFG20 asset statutory duties &amp; routine engineering cycles.
            </div>
          </div>
        </div>

        <!-- Section 2: Visual Trade Allocation (SVG Donut + Legend Table) -->
        <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 20px; margin-bottom: 28px; background: #ffffff;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B1220; margin-bottom: 16px;">
            Indicative Trade Expenditure Distribution
          </div>

          <div style="display: grid; grid-template-columns: 210px 1fr; gap: 24px; align-items: center;">
            <!-- SVG Donut Chart -->
            <div style="text-align: center;">
              <svg width="190" height="190" viewBox="0 0 200 200" style="margin: 0 auto; display: block;">
                ${svgSlices}
                <!-- Center Hole & Cutout Text -->
                <circle cx="100" cy="100" r="52" fill="#ffffff" />
                <text x="100" y="94" text-anchor="middle" font-size="10" fill="#64748B" font-family="sans-serif" font-weight="600" text-transform="uppercase">ANNUAL PPM</text>
                <text x="100" y="112" text-anchor="middle" font-size="14" fill="#0B1220" font-family="sans-serif" font-weight="bold">£${Math.round(data.midPoint / 1000)}k</text>
              </svg>
            </div>

            <!-- Trade Allocation Table -->
            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
              <thead>
                <tr style="border-bottom: 1px solid #CBD5E1; color: #64748B; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em;">
                  <th style="text-align: left; padding: 6px 0;">Discipline</th>
                  <th style="text-align: center; padding: 6px 8px; width: 60px;">Share</th>
                  <th style="text-align: right; padding: 6px 0;">Annual Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${trades.map((t) => `
                  <tr style="border-bottom: 1px solid #F1F5F9;">
                    <td style="padding: 8px 0; color: #1E293B;">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${t.color}; margin-right: 6px;"></span>
                      ${t.label}
                    </td>
                    <td style="padding: 8px; text-align: center; color: #475569; font-weight: 600;">${t.pct}%</td>
                    <td style="padding: 8px 0; text-align: right; color: #0B1220; font-weight: 600;">£${t.cost.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · PPM Budgeting Suite</span>
        <span>Page 2</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 3. REACTIVE VS PLANNED RISK COMPARISON & MARKET CONTEXT
// ---------------------------------------------------------------------------
function buildRiskAndMarketContext(data: PpmEstimatorReportData): string {
  const reactivePct = Math.round((data.reactiveMultiplier - 1) * 100);

  return `
    <div class="page" style="page-break-after: always; padding: 20mm 16mm; min-height: 250mm; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563EB; margin-bottom: 6px;">
          Section 02 / Commercial Exposure &amp; Market Intelligence
        </div>
        <h2 style="font-size: 24px; font-weight: 300; color: #0B1220; margin: 0 0 20px 0;">
          Reactive Run-to-Failure vs. Planned Maintenance Analysis
        </h2>

        <!-- Reactive vs Planned Comparison Container -->
        <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 22px; background: #ffffff; margin-bottom: 28px;">
          <div style="font-size: 12px; font-weight: 700; color: #0B1220; margin-bottom: 8px;">
            Uncontrolled Breakdown Expenditure Penalty (+${reactivePct}%)
          </div>
          <p style="font-size: 11px; color: #64748B; margin: 0 0 20px 0; line-height: 1.5;">
            Operating primary plant under reactive "run-to-failure" models generates high commercial penalties:
            emergency technician call-out tariffs, expedited freight on replacement compressors and fans,
            and secondary collateral damage to building fabric.
          </p>

          <!-- Side by Side Comparison Visual -->
          <div style="space-y: 12px; display: flex; flex-direction: column; gap: 12px;">
            <!-- Planned Bar -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #0B1220;">1. Planned Preventative Maintenance (SFG20 Regime)</span>
                <span style="font-weight: 700; color: #1D4ED8;">£${data.midPoint.toLocaleString()} / yr</span>
              </div>
              <div style="width: 100%; height: 18px; background-color: #E2E8F0; border-radius: 2px; overflow: hidden;">
                <div style="width: ${(100 / data.reactiveMultiplier).toFixed(1)}%; height: 100%; background-color: #2563EB;"></div>
              </div>
            </div>

            <!-- Reactive Bar -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #0B1220;">2. Modelled Reactive Breakdown Expenditure (${data.reactiveMultiplier.toFixed(1)}× Penalty)</span>
                <span style="font-weight: 700; color: #E11D48;">£${data.reactiveCost.toLocaleString()} / yr</span>
              </div>
              <div style="width: 100%; height: 18px; background-color: #E2E8F0; border-radius: 2px; overflow: hidden;">
                <div style="width: 100%; height: 100%; background-color: #E11D48;"></div>
              </div>
            </div>
          </div>

          <!-- Savings Callout -->
          <div style="margin-top: 20px; padding: 14px 18px; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 3px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 12px; font-weight: 700; color: #065F46;">
                Avoidable Emergency Expenditure (Net Savings)
              </div>
              <div style="font-size: 11px; color: #047857; margin-top: 2px;">
                Protecting business continuity while preserving manufacturer plant warranty.
              </div>
            </div>
            <div style="font-size: 18px; font-weight: 800; color: #065F46;">
              £${data.potentialSavings.toLocaleString()} / yr
            </div>
          </div>
        </div>

        <!-- Section 3: AI-Generated Market Context -->
        <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 22px; background: #F8FAFC;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px;">
            <div style="font-size: 12px; font-weight: 700; color: #0B1220; text-transform: uppercase; letter-spacing: 0.05em;">
              Regional Market Context &amp; Operating Environment
            </div>
            <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; background-color: #EFF6FF; border: 1px solid #BFDBFE; color: #1D4ED8; padding: 2px 8px; border-radius: 2px;">
              Industry Intelligence
            </span>
          </div>

          <p style="font-size: 11.5px; color: #334155; line-height: 1.65; margin: 0 0 14px 0;">
            ${data.marketContextText || 'UK commercial estates face continuous upward cost adjustments driven by specialized technical engineering rates and long component lead times. Forward asset planning and routine statutory testing remain essential across all regions to preserve operational compliance and safeguard tenant safety.'}
          </p>

          <div style="font-size: 9px; color: #64748B; font-style: italic; border-top: 1px dashed #CBD5E1; padding-top: 8px;">
            AI-generated commentary, refreshed periodically — not a substitute for a formal cost survey.
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · Risk &amp; Market Intelligence</span>
        <span>Page 3</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 4. "WHAT DETERMINES THE FINAL NUMBER" & ABOUT ENTIREFM APPENDIX
// ---------------------------------------------------------------------------
function buildSurveyAdvisoryAndAbout(): string {
  const about = PPM_PACK_ABOUT_CONTENT;

  return `
    <div class="page" style="page-break-after: always; padding: 20mm 16mm; min-height: 250mm; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563EB; margin-bottom: 6px;">
          Section 03 / Engineering Governance
        </div>
        <h2 style="font-size: 24px; font-weight: 300; color: #0B1220; margin: 0 0 16px 0;">
          What Determines the Final Contract Number?
        </h2>

        <!-- Advisory Box -->
        <div style="background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 4px; padding: 18px; margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 700; color: #92400E; margin-bottom: 6px;">
            Why Physical Asset Surveys are Essential
          </div>
          <p style="font-size: 11px; color: #78350F; line-height: 1.6; margin: 0;">
            This document provides an indicative model based on gross floor area and typical UK asset densities.
            However, reputable FM contracts should never be signed off desk estimates alone. Plant accessibility,
            operating condition, redundancy configuration, and past maintenance history directly dictate actual engineer attendance hours.
          </p>
        </div>

        <!-- The 4 Validation Factors -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 30px;">
          <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px; background: #ffffff;">
            <div style="font-size: 11px; font-weight: 700; color: #0B1220; margin-bottom: 4px;">1. Physical Asset Verification</div>
            <div style="font-size: 10.5px; color: #64748B; line-height: 1.5;">Exact count of installed fan coils, pumps, boilers, and distribution boards compared against drawings.</div>
          </div>
          <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px; background: #ffffff;">
            <div style="font-size: 11px; font-weight: 700; color: #0B1220; margin-bottom: 4px;">2. Access &amp; Working at Height</div>
            <div style="font-size: 10.5px; color: #64748B; line-height: 1.5;">Specialist access gear, MEWPs, or permit-to-work requirements for roof-mounted plant or confined risers.</div>
          </div>
          <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px; background: #ffffff;">
            <div style="font-size: 11px; font-weight: 700; color: #0B1220; margin-bottom: 4px;">3. Historical Asset Condition</div>
            <div style="font-size: 10.5px; color: #64748B; line-height: 1.5;">Deferred maintenance burdens, refrigerant phase-outs (R22/R410A), or end-of-life plant requiring remedial overhaul.</div>
          </div>
          <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px; background: #ffffff;">
            <div style="font-size: 11px; font-weight: 700; color: #0B1220; margin-bottom: 4px;">4. Statutory Certification Integrity</div>
            <div style="font-size: 10.5px; color: #64748B; line-height: 1.5;">Status of existing EICRs, Legionella Risk Assessments, Fire Risk Assessments, and F-gas logbooks.</div>
          </div>
        </div>

        <!-- About EntireFM (Reusing Canonical Copy) -->
        <div style="border-top: 1px solid #E2E8F0; padding-top: 20px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #2563EB; margin-bottom: 4px;">
            ${about.documentHeading}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #0B1220; margin-bottom: 8px;">
            ${about.sections[0].title}: ${about.sections[0].subtitle}
          </div>
          <p style="font-size: 11px; color: #475569; line-height: 1.6; margin-bottom: 12px;">
            ${about.sections[0].paragraphs[0]}
          </p>
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #0B1220; margin-bottom: 6px;">
            ${about.sections[0].bulletHeading}
          </div>
          <ul style="font-size: 10.5px; color: #475569; padding-left: 18px; margin: 0; line-height: 1.5;">
            ${about.sections[0].bullets?.map((b) => `<li>${b}</li>`).join('') || ''}
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8;">
        <span>Entire Facilities Management Ltd · Commercial Technical Operations</span>
        <span>Page 4</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 5. FINAL COMMERCIAL PROPOSAL CTA PAGE
// ---------------------------------------------------------------------------
function buildProposalCtaPage(): string {
  const about = PPM_PACK_ABOUT_CONTENT;

  return `
    <div class="page" style="padding: 24mm 16mm; min-height: 250mm; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563EB; margin-bottom: 6px;">
          Commercial Engagement / Tender Proposal
        </div>
        <h2 style="font-size: 28px; font-weight: 300; color: #0B1220; margin: 0 0 20px 0;">
          Request a Formal PPM Tender Proposal
        </h2>

        <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 30px;">
          Entire Facilities Management delivers transparent, fixed-price Planned Preventative Maintenance
          proposals tailored directly to your building's physical asset register.
        </p>

        <!-- What Happens Next Box -->
        <div style="background-color: #0B1220; color: #ffffff; border-radius: 4px; padding: 28px; margin-bottom: 36px;">
          <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
            The 3-Step EntireFM Proposal Process:
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px; font-size: 12px; color: #E2E8F0;">
            <div style="display: flex; gap: 12px;">
              <span style="display: inline-flex; width: 24px; height: 24px; background: #2563EB; color: #ffffff; border-radius: 50%; align-items: center; justify-content: center; font-weight: bold; shrink-0;">1</span>
              <div>
                <strong>Site Asset Verification Survey:</strong> A senior technical surveyor visits your premises to audit all M&amp;E plant, access conditions, and compliance logbooks.
              </div>
            </div>
            <div style="display: flex; gap: 12px;">
              <span style="display: inline-flex; width: 24px; height: 24px; background: #2563EB; color: #ffffff; border-radius: 50%; align-items: center; justify-content: center; font-weight: bold; shrink-0;">2</span>
              <div>
                <strong>SFG20 Maintenance Matrix Scoping:</strong> We map every verified asset against statutory standards to produce a fixed-price annual maintenance schedule.
              </div>
            </div>
            <div style="display: flex; gap: 12px;">
              <span style="display: inline-flex; width: 24px; height: 24px; background: #2563EB; color: #ffffff; border-radius: 50%; align-items: center; justify-content: center; font-weight: bold; shrink-0;">3</span>
              <div>
                <strong>Transparent Commercial Proposal:</strong> You receive a comprehensive proposal with clear SLA commitments, dedicated account management, and client portal access.
              </div>
            </div>
          </div>
        </div>

        <!-- Direct Contact Channels -->
        <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 24px; background: #F8FAFC;">
          <div style="font-size: 13px; font-weight: 700; color: #0B1220; margin-bottom: 12px;">
            Direct Technical Operations Contact:
          </div>
          <table style="width: 100%; font-size: 12px; color: #334155;">
            <tr>
              <td style="padding: 6px 0; font-weight: 600; width: 30%;">Telephone:</td>
              <td style="padding: 6px 0; color: #2563EB; font-weight: 700;">${about.cta.phoneDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600;">Commercial Inbox:</td>
              <td style="padding: 6px 0; color: #2563EB;">enquiries@entirefm.com</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600;">Online Tender Request:</td>
              <td style="padding: 6px 0;">www.entirefm.com/contact-us#enquiry</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Footer & Statutory Disclaimer -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 16px;">
        <div style="font-size: 8.5px; color: #94A3B8; line-height: 1.5; margin-bottom: 8px;">
          <strong>Governance Note:</strong> This document is generated for indicative budgeting purposes only and does not constitute a contractual offer.
          Final PPM fees require on-site engineering verification and agreed service level agreements. Entire Facilities Management Ltd is registered in England and Wales.
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
// MASTER DOCUMENT COMPILER
// ---------------------------------------------------------------------------
export function buildPpmEstimatorPackHtml(data: PpmEstimatorReportData): string {
  const docRef = `EFM-EST-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const cover = buildCoverPage(data, docRef, dateStr);
  const execSummary = buildExecutiveSummary(data);
  const riskAndMarket = buildRiskAndMarketContext(data);
  const surveyAdvisory = buildSurveyAdvisoryAndAbout();
  const proposalCta = buildProposalCtaPage();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PPM Budget Expenditure Specification — ${data.sectorName}</title>
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
  ${execSummary}
  ${riskAndMarket}
  ${surveyAdvisory}
  ${proposalCta}
</body>
</html>
  `;
}

export function downloadPpmEstimatorPack(data: PpmEstimatorReportData, filename?: string): void {
  const html = buildPpmEstimatorPackHtml(data);
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
