/**
 * ENTIRECAFM BRANDED QUOTATION PDF GENERATOR
 * ==========================================
 * Generates vector-ready, printable, executive commercial quotation documents
 * compliant with EntireFM brand guidelines.
 */

import { Quote } from '../commercial';

export interface QuotePdfData {
  quote: Quote;
  clientName: string;
  siteName: string;
  siteAddress?: string;
  assetReference?: string;
  assetName?: string;
  engineerName?: string;
  scopeOfWorks?: Array<{ title: string; source: 'ENGINEER_STATED' | 'AI_INFERRED' }>;
  exclusions?: string[];
  assumptions?: string[];
  termsAndConditions?: string[];
}

export function buildQuoteHtml(data: QuotePdfData): string {
  const { quote, clientName, siteName, siteAddress, assetReference, assetName, engineerName, scopeOfWorks } = data;
  const quoteNumber = quote.quote_number || 'QT-DRAFT';
  const issueDate = quote.issued_at ? new Date(quote.issued_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
  const validUntil = new Date(Date.now() + (quote.validity_days || 30) * 86400000).toLocaleDateString('en-GB');

  const lines = quote.lines || [];
  const subtotal = (quote.subtotal_gbp || 0).toFixed(2);
  const vat = (quote.tax_amount_gbp || 0).toFixed(2);
  const total = (quote.total_amount_gbp || 0).toFixed(2);

  const exclusions = data.exclusions || [
    'Works outside standard operating hours unless explicitly detailed in line items.',
    'Making good of decorative finishes, plasterwork, or builder works unless specified.',
    'Asbestos abatement or hazardous substance removal.',
    'Unforeseen structural, electrical, or pipework defects discovered during strip-down.',
  ];

  const assumptions = data.assumptions || [
    'Unrestricted site and plant room access provided at agreed commencement time.',
    'Isolation valves and electrical isolators are functional and passing zero pressure/voltage.',
    'Valid parking or permits provided on site for engineer vehicles and plant.',
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EntireCAFM Quotation — ${quoteNumber}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 20mm 15mm;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      margin: 0;
      padding: 24px;
      font-size: 11px;
      line-height: 1.4;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #0B1220;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: #0B1220;
    }
    .logo-accent {
      color: #0284C7;
    }
    .tagline {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #64748B;
      font-weight: 600;
      margin-top: 2px;
    }
    .meta-box {
      text-align: right;
      font-size: 10px;
      color: #475569;
      line-height: 1.5;
    }
    .quote-badge {
      display: inline-block;
      background: #0B1220;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 3px;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 12px 14px;
    }
    .card-title {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748B;
      margin-bottom: 6px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
    }
    .section-heading {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0B1220;
      margin: 18px 0 8px 0;
      border-bottom: 1.5px solid #CBD5E1;
      padding-bottom: 4px;
    }
    .scope-list {
      margin: 0;
      padding-left: 18px;
      color: #334155;
    }
    .scope-list li {
      margin-bottom: 4px;
    }
    .badge-inferred {
      font-size: 8.5px;
      color: #0284C7;
      background: #E0F2FE;
      padding: 1px 5px;
      border-radius: 3px;
      margin-left: 6px;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 10.5px;
    }
    th {
      background: #0B1220;
      color: #FFFFFF;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.05em;
      padding: 8px 10px;
      text-align: left;
    }
    th.num, td.num {
      text-align: right;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #E2E8F0;
      color: #1E293B;
    }
    tr:nth-child(even) td {
      background: #F8FAFC;
    }
    .financials-box {
      margin-left: auto;
      width: 280px;
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 12px 14px;
      margin-top: 10px;
    }
    .fin-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 11px;
      color: #475569;
    }
    .fin-total {
      display: flex;
      justify-content: space-between;
      padding: 8px 0 0 0;
      margin-top: 6px;
      border-top: 2px solid #0B1220;
      font-size: 14px;
      font-weight: 800;
      color: #0B1220;
    }
    .footer {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px solid #CBD5E1;
      font-size: 9px;
      color: #64748B;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo-text">Entire<span class="logo-accent">FM</span></div>
      <div class="tagline">Facilities Management Intelligence &amp; Technical Services</div>
    </div>
    <div class="meta-box">
      <div class="quote-badge">FORMAL COMMERCIAL QUOTATION</div>
      <div><strong>Quote Ref:</strong> ${quoteNumber}</div>
      <div><strong>Date Issued:</strong> ${issueDate}</div>
      <div><strong>Validity:</strong> 30 Days (Expires ${validUntil})</div>
      ${engineerName ? `<div><strong>Surveyed By:</strong> ${engineerName}</div>` : ''}
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Client Details</div>
      <div style="font-size: 12px; font-weight: 700; color: #0B1220;">${clientName || 'Valued Client'}</div>
      <div style="color: #64748B; margin-top: 2px;">EntireCAFM Managed Account</div>
    </div>
    <div class="card">
      <div class="card-title">Site &amp; Asset Location</div>
      <div style="font-size: 12px; font-weight: 700; color: #0B1220;">${siteName || 'Commercial Estate'}</div>
      ${siteAddress ? `<div style="color: #64748B; margin-top: 2px;">${siteAddress}</div>` : ''}
      ${assetReference || assetName ? `<div style="color: #0284C7; font-weight: 600; margin-top: 4px;">Asset: ${assetReference ? assetReference + ' — ' : ''}${assetName || ''}</div>` : ''}
    </div>
  </div>

  <div class="section-heading">Scope of Works</div>
  <p style="margin: 0 0 8px 0; color: #334155;">
    ${quote.scope_description || 'Supply of labour, verified components, and technical execution for remedial works.'}
  </p>

  ${scopeOfWorks && scopeOfWorks.length > 0 ? `
    <ol class="scope-list">
      ${scopeOfWorks.map(s => `
        <li>
          ${s.title}
          ${s.source === 'AI_INFERRED' ? '<span class="badge-inferred">Standard Good Practice</span>' : ''}
        </li>
      `).join('')}
    </ol>
  ` : ''}

  <div class="section-heading">Commercial Schedule &amp; Line Items</div>
  <table>
    <thead>
      <tr>
        <th style="width: 14%;">Category</th>
        <th>Description</th>
        <th class="num" style="width: 10%;">Qty</th>
        <th class="num" style="width: 12%;">Unit Price</th>
        <th class="num" style="width: 14%;">Total (ex VAT)</th>
      </tr>
    </thead>
    <tbody>
      ${lines.length > 0 ? lines.map(line => `
        <tr>
          <td><span style="font-weight: 600; font-size: 9.5px; color: #475569;">${line.line_type}</span></td>
          <td>
            ${line.description}
            ${line.pricing_notes ? `<div style="font-size: 9px; color: #64748B; margin-top: 2px;">${line.pricing_notes}</div>` : ''}
          </td>
          <td class="num">${line.quantity}</td>
          <td class="num">£${(line.unit_price_gbp || 0).toFixed(2)}</td>
          <td class="num" style="font-weight: 600;">£${(line.total_gbp || 0).toFixed(2)}</td>
        </tr>
      `).join('') : `
        <tr>
          <td colspan="5" style="text-align: center; color: #64748B; padding: 16px;">Labour and materials schedule under review.</td>
        </tr>
      `}
    </tbody>
  </table>

  <div class="financials-box">
    <div class="fin-row">
      <span>Subtotal (Net):</span>
      <span>£${subtotal}</span>
    </div>
    <div class="fin-row">
      <span>VAT (20.0%):</span>
      <span>£${vat}</span>
    </div>
    <div class="fin-total">
      <span>Total (Gross):</span>
      <span>£${total}</span>
    </div>
  </div>

  <div class="grid-2" style="margin-top: 20px;">
    <div class="card">
      <div class="card-title">Commercial Assumptions</div>
      <ul style="margin: 0; padding-left: 14px; font-size: 9.5px; color: #475569;">
        ${assumptions.map(a => `<li style="margin-bottom: 2px;">${a}</li>`).join('')}
      </ul>
    </div>
    <div class="card">
      <div class="card-title">Standard Exclusions</div>
      <ul style="margin: 0; padding-left: 14px; font-size: 9.5px; color: #475569;">
        ${exclusions.map(e => `<li style="margin-bottom: 2px;">${e}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="footer">
    <div style="font-weight: 700; color: #0B1220; margin-bottom: 2px;">Entire Facilities Management Ltd</div>
    <div>Registered in England &amp; Wales · Head Office: 020 4617 0228 · commercial@entirefm.com · www.entirefm.com</div>
    <div style="margin-top: 4px;">Standard payment terms: 30 days from date of invoice upon client sign-off. Work guaranteed under EntireFM Quality Assurance.</div>
  </div>
</body>
</html>`;
}
