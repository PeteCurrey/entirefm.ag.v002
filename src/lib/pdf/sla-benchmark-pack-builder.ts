/**
 * SLA & RESPONSE BENCHMARK 2-PAGE PRINT / PDF APPRAISAL BUILDER
 * ==============================================================
 * Generates an authoritative, 2-page printable executive benchmark document:
 * - Page 1: Cover Bar, Estate Performance Scorecard Table (Discipline, User Input, UK Commercial Band, Status, Why It Matters).
 * - Page 2: Commercial Contract Pitfalls Guide, About EntireFM, Soft Commercial CTA.
 *
 * FACTUAL INTEGRITY:
 * Explicitly separates "Typical UK Commercial Response Bands" (industry practice) from
 * "Why It Matters" (genuine statutory contexts, e.g. BS 5839-1 fire watch triggers vs general duty).
 */

import {
  SLA_DISCIPLINES,
  CONTRACT_PITFALLS,
  evaluateSlaPerformance,
  SlaDisciplineBenchmark,
} from '@/lib/tools/sla-benchmark-taxonomy';
import { PPM_PACK_ABOUT_CONTENT } from '@/lib/tools/ppm-pack-content';

export interface SlaBenchmarkReportData {
  userInputs: Record<string, number>; // disciplineId -> hours
  organisationName?: string;
  estateName?: string;
  notes?: string;
}

export function buildSlaBenchmarkHtml(data: SlaBenchmarkReportData): string {
  const docRef = `EFM-SLA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate alignment metrics
  let fasterCount = 0;
  let withinCount = 0;
  let slowerCount = 0;

  const rows = SLA_DISCIPLINES.map((disc) => {
    const userHours = data.userInputs[disc.id] ?? disc.defaultResponseHours;
    const perf = evaluateSlaPerformance(disc, userHours);
    if (perf.status === 'FASTER') fasterCount++;
    else if (perf.status === 'WITHIN_BAND') withinCount++;
    else slowerCount++;

    return {
      disc,
      userHours,
      perf,
    };
  });

  const totalDisciplines = rows.length;
  const compliantOrBetter = fasterCount + withinCount;
  const alignmentPercent = Math.round((compliantOrBetter / totalDisciplines) * 100);

  // Status colors for HTML print
  const getStatusBadgeHtml = (status: string, label: string) => {
    if (status === 'FASTER') {
      return `<span style="display: inline-block; background-color: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 7px; border-radius: 2px;">${label}</span>`;
    }
    if (status === 'WITHIN_BAND') {
      return `<span style="display: inline-block; background-color: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 7px; border-radius: 2px;">${label}</span>`;
    }
    return `<span style="display: inline-block; background-color: #FFF1F2; border: 1px solid #FECDD3; color: #9F1239; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 7px; border-radius: 2px;">${label}</span>`;
  };

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} mins`;
    if (hours === 1) return '1 hour';
    if (hours === 8) return '8 hrs (Same Day)';
    if (hours === 24) return '24 hrs (Next Day)';
    if (hours >= 48) return `${hours} hrs (2+ Days)`;
    return `${hours} hours`;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EntireFM SLA & Response Benchmark Appraisal — ${docRef}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 14mm 14mm;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0B1220;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
    }
    .page {
      box-sizing: border-box;
      min-height: 265mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    th {
      background-color: #0B1220;
      color: #FFFFFF;
      text-transform: uppercase;
      font-size: 8.5px;
      letter-spacing: 0.06em;
      padding: 7px 8px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 6px 8px;
      border-bottom: 1px solid #E2E8F0;
      vertical-align: top;
    }
    .alt-row {
      background-color: #F8FAFC;
    }
  </style>
</head>
<body>

  <!-- ======================================================== -->
  <!-- PAGE 1: EXECUTIVE BENCHMARK SCORECARD                   -->
  <!-- ======================================================== -->
  <div class="page">
    <div>
      <!-- Top Header Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0B1220; padding-bottom: 12px; margin-bottom: 18px;">
        <div>
          <div style="font-size: 24px; font-weight: 900; letter-spacing: 0.02em; color: #0B1220; line-height: 1;">
            Entire<span style="color: #2563EB;">FM</span>
          </div>
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; color: #64748B; font-weight: 600; margin-top: 4px;">
            Facilities Management · Commercial Helpdesk Intelligence
          </div>
        </div>
        <div style="text-align: right; font-size: 9.5px; color: #64748B; line-height: 1.5;">
          <div><strong>Document Ref:</strong> ${docRef}</div>
          <div><strong>Date:</strong> ${dateStr}</div>
          <div><strong>Status:</strong> Commercial Benchmark Appraisal</div>
        </div>
      </div>

      <!-- Title & Eyebrow -->
      <div style="margin-bottom: 14px;">
        <span style="display: inline-block; background-color: #EFF6FF; border: 1px solid #BFDBFE; color: #1D4ED8; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px 8px; border-radius: 2px; margin-bottom: 6px;">
          Commercial Service Level Appraisal
        </span>
        <h1 style="font-size: 20px; font-weight: 300; color: #0B1220; margin: 0 0 6px 0; letter-spacing: -0.01em;">
          UK Commercial FM SLA &amp; Response Benchmark
        </h1>
        <p style="font-size: 11px; color: #475569; margin: 0; line-height: 1.5;">
          Independent comparison of estate response times across 7 critical hard FM disciplines against standard UK commercial Helpdesk practice.
        </p>
      </div>

      <!-- Estate Alignment KPI Strip -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px;">
        <div style="background: #0B1220; color: #FFFFFF; border-radius: 4px; padding: 10px 12px;">
          <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; font-weight: 600;">SLA Market Alignment</div>
          <div style="font-size: 20px; font-weight: 300; color: #60A5FA; margin-top: 2px;">${alignmentPercent}%</div>
          <div style="font-size: 8.5px; color: #CBD5E1; margin-top: 1px;">Market standard or upper quartile</div>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 10px 12px;">
          <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 600;">Upper Quartile (Faster)</div>
          <div style="font-size: 20px; font-weight: 700; color: #059669; margin-top: 2px;">${fasterCount} <span style="font-size: 11px; font-weight: 400; color: #64748B;">/ ${totalDisciplines}</span></div>
          <div style="font-size: 8.5px; color: #64748B; margin-top: 1px;">Premium contractor response</div>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 10px 12px;">
          <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 600;">Commercial Band (Typical)</div>
          <div style="font-size: 20px; font-weight: 700; color: #2563EB; margin-top: 2px;">${withinCount} <span style="font-size: 11px; font-weight: 400; color: #64748B;">/ ${totalDisciplines}</span></div>
          <div style="font-size: 8.5px; color: #64748B; margin-top: 1px;">Standard commercial SLA</div>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 10px 12px;">
          <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 600;">Lagging Standard (Slower)</div>
          <div style="font-size: 20px; font-weight: 700; color: #DC2626; margin-top: 2px;">${slowerCount} <span style="font-size: 11px; font-weight: 400; color: #64748B;">/ ${totalDisciplines}</span></div>
          <div style="font-size: 8.5px; color: #64748B; margin-top: 1px;">Operational or statutory risk</div>
        </div>
      </div>

      <!-- Comparative Scorecard Table -->
      <table style="margin-bottom: 12px;">
        <thead>
          <tr>
            <th style="width: 25%;">Discipline &amp; Failure Mode</th>
            <th style="width: 14%;">Your Typical Response</th>
            <th style="width: 17%;">UK Commercial Band (Industry Practice)</th>
            <th style="width: 16%;">Performance Status</th>
            <th style="width: 28%;">Why It Matters (Regulatory / Operational Context)</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (r, idx) => `
            <tr class="${idx % 2 === 1 ? 'alt-row' : ''}">
              <td>
                <strong style="color: #0B1220;">${r.disc.name}</strong>
                <div style="font-size: 8.5px; color: #64748B; margin-top: 1px;">${r.disc.metricLabel}</div>
              </td>
              <td style="font-weight: 600; color: #0B1220;">
                ${formatHours(r.userHours)}
              </td>
              <td style="color: #475569;">
                <strong>${r.disc.benchmark.bandDisplay}</strong>
              </td>
              <td>
                ${getStatusBadgeHtml(r.perf.status, r.perf.statusLabel)}
              </td>
              <td style="font-size: 9px; color: #334155; line-height: 1.35;">
                ${r.disc.whyItMatters}
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Factual Integrity Callout -->
      <div style="background-color: #F8FAFC; border-left: 3px solid #2563EB; padding: 8px 12px; margin-top: 8px; font-size: 9px; color: #475569; line-height: 1.4;">
        <strong>Methodology &amp; Regulatory Note:</strong>
        Typical commercial bands (e.g. 2–4 hours) represent established UK facilities management Helpdesk practice, not statutory arrival mandates. Specific regulatory time triggers are explicitly cited where they genuinely exist (such as BS 5839-1 recommendations requiring physical fire watches after 4 hours of alarm fault, and BS EN 81-28 entrapment rescue protocols).
      </div>
    </div>

    <!-- Page 1 Footer -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 8px; font-size: 8.5px; color: #94A3B8;">
      <span>Entire Facilities Management · www.entirefm.com · 020 4617 0228</span>
      <span>Page 1 of 2</span>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- PAGE 2: CONTRACT PITFALLS, ABOUT ENTIREFM & SOFT CTA     -->
  <!-- ======================================================== -->
  <div class="page page-break" style="padding-top: 4mm;">
    <div>
      <!-- Top Header Bar (Subtle) -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 900; color: #0B1220;">
          Entire<span style="color: #2563EB;">FM</span>
          <span style="font-size: 9px; font-weight: 400; color: #64748B; margin-left: 8px;">Commercial Contract Guidance</span>
        </div>
        <div style="font-size: 8.5px; color: #64748B;">Doc Ref: ${docRef} · Page 2 of 2</div>
      </div>

      <!-- Commercial Contract Pitfalls Guide -->
      <div style="margin-bottom: 18px;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #2563EB; font-weight: 700; margin-bottom: 4px;">
          Procurement Advisory
        </div>
        <h2 style="font-size: 15px; font-weight: 600; color: #0B1220; margin: 0 0 10px 0;">
          Commercial FM Contract Pitfalls: Behind the SLA Numbers
        </h2>

        <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
          ${CONTRACT_PITFALLS.map(
            (p) => `
            <div style="border: 1px solid #E2E8F0; border-radius: 4px; padding: 8px 12px; background-color: #FFFFFF;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-weight: 700; font-size: 11px; color: #0B1220;">${p.title}</span>
                <span style="font-size: 8.5px; color: #64748B; font-style: italic;">${p.subtitle}</span>
              </div>
              <p style="font-size: 9.5px; color: #334155; margin: 4px 0 6px 0; line-height: 1.4;">${p.body}</p>
              <div style="background-color: #EFF6FF; border-radius: 2px; padding: 4px 8px; font-size: 8.5px; color: #1E40AF; font-weight: 600;">
                EntireFM Recommendation: ${p.takeaway}
              </div>
            </div>
          `
          ).join('')}
        </div>
      </div>

      <!-- About EntireFM Section -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 12px 14px; margin-bottom: 16px;">
        <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; font-weight: 700; margin-bottom: 4px;">
          About Entire Facilities Management
        </div>
        <h3 style="font-size: 13px; font-weight: 700; color: #0B1220; margin: 0 0 6px 0;">
          Direct-Accountability Facilities Management &amp; Building Maintenance
        </h3>
        <p style="font-size: 9.5px; color: #475569; margin: 0 0 8px 0; line-height: 1.45;">
          ${PPM_PACK_ABOUT_CONTENT.sections[0].paragraphs[0]}
        </p>
        <p style="font-size: 9.5px; color: #475569; margin: 0 0 10px 0; line-height: 1.45;">
          ${PPM_PACK_ABOUT_CONTENT.sections[0].paragraphs[1]}
        </p>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; font-size: 9px; color: #334155;">
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #2563EB;">✓</span> 24/7/365 UK Commercial Helpdesk
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #2563EB;">✓</span> Direct self-delivery mobile engineers
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #2563EB;">✓</span> EntireCAFM real-time live GPS &amp; job tracking
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #2563EB;">✓</span> Transparent first-time fix &amp; downtime metrics
          </div>
        </div>
      </div>

      <!-- Soft CTA Box -->
      <div style="background-color: #0B1220; color: #FFFFFF; border-radius: 4px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #60A5FA; font-weight: 700;">
            Next Step / Confidential Review
          </div>
          <div style="font-size: 13px; font-weight: 600; color: #FFFFFF; margin-top: 2px;">
            Benchmarking a commercial FM tender or reviewing existing contractor KPIs?
          </div>
          <div style="font-size: 9.5px; color: #94A3B8; margin-top: 2px;">
            Speak with an EntireFM technical director for a confidential, asset-verified SLA gap analysis.
          </div>
        </div>
        <div style="text-align: right; shrink-0; margin-left: 20px;">
          <div style="font-size: 14px; font-weight: 700; color: #FFFFFF;">020 4617 0228</div>
          <div style="font-size: 9px; color: #60A5FA; margin-top: 2px;">enquiries@entirefm.com</div>
          <div style="font-size: 8.5px; color: #94A3B8; margin-top: 2px;">www.entirefm.com</div>
        </div>
      </div>
    </div>

    <!-- Page 2 Footer -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 8px; font-size: 8.5px; color: #94A3B8;">
      <span>Entire Facilities Management · Commercial Confidential</span>
      <span>Page 2 of 2</span>
    </div>
  </div>

</body>
</html>
  `;
}

/**
 * Triggers an instant, client-side browser print / PDF download flow.
 */
export function downloadSlaBenchmarkReport(data: SlaBenchmarkReportData, filename?: string): void {
  const html = buildSlaBenchmarkHtml(data);
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
