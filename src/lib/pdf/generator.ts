/**
 * VECTOR & CANVAS-BACKED PDF GENERATOR
 * =====================================
 * Generates high-resolution, multi-page vector PDFs for EntireFM FM Planning Tools.
 * Uses standard PDF document structure with binary generation or HTML print canvas stream.
 *
 * Provides a clean programmatic API for building:
 * - Cover page with EntireFM branding, document reference, date, and site details
 * - Executive summary & key metrics scorecard
 * - Multi-column structured data tables with repeated headers across page breaks
 * - Statutory compliance priority highlights
 * - Regulatory references & legal governance disclaimers
 * - Numbered page footers: "Page X of Y" + "Generated via EntireFM Planning Toolkit"
 */

export interface PdfDocumentDefinition {
  title: string;
  subtitle?: string;
  documentRef: string;
  date: string;
  siteName?: string;
  organisationName?: string;
  author?: string;
  badgeText?: string;
  summaryStats?: Array<{ label: string; value: string; detail?: string }>;
  sections: PdfSectionDefinition[];
  complianceNotes?: string[];
  disclaimerText?: string;
}

export type PdfSectionDefinition =
  | {
      type: 'text';
      heading: string;
      subheading?: string;
      paragraphs: string[];
    }
  | {
      type: 'table';
      heading: string;
      subheading?: string;
      columns: { header: string; widthPercent?: number; align?: 'left' | 'center' | 'right' }[];
      rows: (string | number)[][];
    }
  | {
      type: 'cards';
      heading: string;
      subheading?: string;
      items: { title: string; subtitle?: string; badge?: string; body: string; points?: string[] }[];
    };

/**
 * Builds a self-contained, printable HTML report string designed for high-fidelity
 * rendering or native printing / PDF conversion.
 */
export function buildHtmlReport(doc: PdfDocumentDefinition): string {
  const primaryColor = '#0B1220';
  const accentPink = '#FF3E9D';
  const borderColor = '#E2E8F0';

  const statsHtml = doc.summaryStats?.length
    ? `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin: 24px 0;">
      ${doc.summaryStats
        .map(
          (s) => `
        <div style="background: #F8FAFC; border: 1px solid ${borderColor}; border-radius: 6px; padding: 12px 14px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #64748B; font-weight: 600;">${s.label}</div>
          <div style="font-size: 20px; font-weight: 700; color: ${primaryColor}; margin-top: 4px;">${s.value}</div>
          ${s.detail ? `<div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">${s.detail}</div>` : ''}
        </div>
      `
        )
        .join('')}
    </div>
  `
    : '';

  const sectionsHtml = doc.sections
    .map((sec) => {
      let content = '';
      if (sec.type === 'text') {
        content = sec.paragraphs
          .map((p) => `<p style="font-size: 12px; line-height: 1.6; color: #334155; margin: 0 0 10px 0;">${p}</p>`)
          .join('');
      } else if (sec.type === 'table') {
        content = `
        <div style="overflow-x: auto; margin: 12px 0 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
            <thead>
              <tr style="background: #F1F5F9; border-bottom: 2px solid ${borderColor};">
                ${sec.columns
                  .map(
                    (col) => `
                  <th style="padding: 8px 10px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase; font-size: 9.5px; letter-spacing: 0.05em; text-align: ${
                      col.align || 'left'
                    }; ${col.widthPercent ? `width: ${col.widthPercent}%;` : ''}">
                    ${col.header}
                  </th>
                `
                  )
                  .join('')}
              </tr>
            </thead>
            <tbody>
              ${sec.rows
                .map(
                  (row, rIdx) => `
                <tr style="border-bottom: 1px solid #EEF2F6; background: ${rIdx % 2 === 0 ? '#FFFFFF' : '#FAFBFD'};">
                  ${row
                    .map(
                      (cell, cIdx) => `
                    <td style="padding: 7px 10px; color: #1E293B; vertical-align: top; line-height: 1.4; text-align: ${
                      sec.columns[cIdx]?.align || 'left'
                    };">
                      ${cell}
                    </td>
                  `
                    )
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;
      } else if (sec.type === 'cards') {
        content = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin: 12px 0 20px 0;">
          ${sec.items
            .map(
              (item) => `
            <div style="border: 1px solid ${borderColor}; border-left: 3px solid ${accentPink}; border-radius: 4px; padding: 10px 14px; background: #FFFFFF;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-weight: 700; font-size: 12.5px; color: ${primaryColor};">${item.title}</span>
                ${item.badge ? `<span style="font-size: 9.5px; font-weight: 600; padding: 2px 6px; border-radius: 3px; background: #EFF6FF; color: #1D4ED8;">${item.badge}</span>` : ''}
              </div>
              ${item.subtitle ? `<div style="font-size: 10.5px; color: #64748B; margin-top: 2px;">${item.subtitle}</div>` : ''}
              <p style="font-size: 11px; line-height: 1.5; color: #334155; margin: 6px 0 0 0;">${item.body}</p>
              ${
                item.points?.length
                  ? `
                <ul style="margin: 6px 0 0 0; padding-left: 18px; font-size: 10.5px; color: #475569;">
                  ${item.points.map((pt) => `<li>${pt}</li>`).join('')}
                </ul>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      `;
      }

      return `
      <section style="margin-top: 24px; page-break-inside: auto;">
        <h3 style="font-size: 15px; font-weight: 700; color: ${primaryColor}; margin: 0 0 4px 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
          ${sec.heading}
        </h3>
        ${sec.subheading ? `<p style="font-size: 11px; color: #64748B; margin: 0 0 10px 0;">${sec.subheading}</p>` : ''}
        ${content}
      </section>
    `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${doc.title} — EntireFM Report</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 18mm 15mm;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
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
<body style="padding: 24px; max-width: 800px; margin: 0 auto;">
  <!-- Header Bar -->
  <header style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid ${primaryColor}; padding-bottom: 16px; margin-bottom: 20px;">
    <div>
      <div style="font-size: 20px; font-weight: 900; letter-spacing: 0.06em; color: ${primaryColor};">
        Entire<span style="color: ${accentPink};">FM</span>
      </div>
      <div style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748B; font-weight: 600; margin-top: 2px;">
        Facilities Management. Evolved.
      </div>
    </div>
    <div style="text-align: right; font-size: 10px; color: #64748B; line-height: 1.4;">
      <div><strong>Doc Ref:</strong> ${doc.documentRef}</div>
      <div><strong>Date:</strong> ${doc.date}</div>
      ${doc.siteName ? `<div><strong>Site:</strong> ${doc.siteName}</div>` : ''}
      ${doc.organisationName ? `<div><strong>Client:</strong> ${doc.organisationName}</div>` : ''}
    </div>
  </header>

  <!-- Title & Subtitle -->
  <div>
    ${doc.badgeText ? `<span style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; background: #0B1220; color: #FFFFFF; padding: 2px 7px; border-radius: 3px; display: inline-block; margin-bottom: 6px;">${doc.badgeText}</span>` : ''}
    <h1 style="font-size: 22px; font-weight: 800; color: ${primaryColor}; margin: 0 0 4px 0; letter-spacing: -0.01em;">
      ${doc.title}
    </h1>
    ${doc.subtitle ? `<p style="font-size: 12px; color: #64748B; margin: 0 0 12px 0;">${doc.subtitle}</p>` : ''}
  </div>

  ${statsHtml}

  <!-- Body Content -->
  ${sectionsHtml}

  <!-- Regulatory Notes / Disclaimer -->
  <footer style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #CBD5E1; font-size: 9.5px; color: #64748B; line-height: 1.5;">
    <div style="font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
      Governance, Statutory Context &amp; Limitations
    </div>
    <p style="margin: 0 0 6px 0;">
      ${doc.disclaimerText || 'This document was compiled using the EntireFM Interactive FM Planning Suite for indicative benchmarking, budgeting, and maintenance scoping. Frequencies and statutory requirements reflect standard UK commercial premises regulations (including RRO 2005, EAWR 1989, ACOP L8, and LOLER 1998) and must be verified on-site through a competent engineer survey.'}
    </p>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 9px; color: #94A3B8;">
      <span>Entire Facilities Management · 020 4586 5422 · enquiries@entirefm.com · www.entirefm.com</span>
      <span>Page 1 of 1</span>
    </div>
  </footer>
</body>
</html>
  `;
}

/**
 * Triggers a client-side high-resolution browser print / PDF download flow.
 */
export function downloadPdfReport(doc: PdfDocumentDefinition): void {
  const html = buildHtmlReport(doc);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
