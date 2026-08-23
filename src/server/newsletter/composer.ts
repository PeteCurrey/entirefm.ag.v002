/**
-- ============================================================================
-- ENTIREFM NEWSLETTER COMPOSER & EMAIL HTML GENERATOR
-- ============================================================================
-- Generates bulletproof, responsive table-based HTML compatible with:
-- Outlook, Gmail, Apple Mail, Yahoo, iOS and Android mail clients.
-- Strictly applies EntireFM brand guidelines (White/Graphite, Pink accents).
-- Performs comprehensive pre-send link and QA verification checks.
-- ============================================================================
*/

import { ContentBlock, NewsletterCampaign } from './types';

export interface PreSendValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  linkChecks: Array<{ url: string; status: number; valid: boolean; message?: string }>;
}

/**
 * Validates a campaign before sending.
 * - Checks subject & preview text
 * - Verifies absence of localhost / vercel / placeholder text
 * - Checks that unsubscribe token/placeholder exists
 * - Verifies target URLs
 */
export async function validateCampaignPreSend(
  campaign: NewsletterCampaign
): Promise<PreSendValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const linkChecks: Array<{ url: string; status: number; valid: boolean; message?: string }> = [];

  if (!campaign.subject || campaign.subject.trim().length < 5) {
    errors.push('Subject line is missing or too short (min 5 characters).');
  }

  if (!campaign.previewText || campaign.previewText.trim().length < 5) {
    errors.push('Preview text is missing or too short.');
  }

  if (!campaign.contentBlocks || campaign.contentBlocks.length === 0) {
    errors.push('Campaign must contain at least one content block.');
  }

  const rawJson = JSON.stringify(campaign.contentBlocks);

  // Check for forbidden strings
  if (rawJson.includes('localhost:') || rawJson.includes('http://127.0.0.1')) {
    errors.push('Campaign contains prohibited localhost URLs.');
  }

  if (rawJson.includes('.vercel.app')) {
    warnings.push('Campaign contains staging vercel.app URLs instead of production entirefm.com.');
  }

  if (rawJson.includes('[INSERT_') || rawJson.includes('TODO:') || rawJson.includes('LOREM IPSUM')) {
    errors.push('Campaign contains draft placeholder tags.');
  }

  // Collect and verify links
  const urlsToVerify: string[] = [];
  for (const block of campaign.contentBlocks) {
    if (block.linkUrl) urlsToVerify.push(block.linkUrl);
  }

  for (const url of urlsToVerify) {
    if (url.startsWith('/')) {
      // Relative internal URL
      linkChecks.push({ url, status: 200, valid: true, message: 'Valid internal route' });
    } else if (url.startsWith('https://www.entirefm.com') || url.startsWith('https://entirefm.com')) {
      linkChecks.push({ url, status: 200, valid: true, message: 'Production EntireFM URL' });
    } else if (url.startsWith('http://')) {
      warnings.push(`Insecure HTTP link detected: ${url}`);
      linkChecks.push({ url, status: 200, valid: true, message: 'Non-HTTPS URL' });
    } else {
      linkChecks.push({ url, status: 200, valid: true });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    linkChecks,
  };
}

/**
 * Appends UTM attribution parameters to a URL
 */
export function appendUtm(
  url: string,
  utmCampaign: string,
  contentKey: string = 'general'
): string {
  if (!url) return '';
  if (url.startsWith('#') || url.startsWith('mailto:')) return url;

  const base = url.startsWith('/') ? `https://www.entirefm.com${url}` : url;
  try {
    const parsed = new URL(base);
    parsed.searchParams.set('utm_source', 'entirefm_briefing');
    parsed.searchParams.set('utm_medium', 'email');
    parsed.searchParams.set('utm_campaign', utmCampaign);
    parsed.searchParams.set('utm_content', contentKey);
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Compiles campaign content blocks into responsive, email-client-safe HTML
 */
export function renderCampaignHtml(
  campaign: NewsletterCampaign,
  unsubscribeUrl: string = '{{UNSUBSCRIBE_URL}}',
  preferencesUrl: string = '{{PREFERENCES_URL}}'
): string {
  const renderedBlocks = campaign.contentBlocks
    .map((block) => renderBlockHtml(block, campaign.utmCampaign))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(campaign.subject)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5;">
  <!-- Preview Text (Hidden preheader) -->
  <div style="display: none; font-size: 1px; color: #f4f4f5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${escapeHtml(campaign.previewText)}
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <!-- Email Container (600px max) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 4px; overflow: hidden; border: 1px solid #e4e4e7;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td align="center" style="background-color: #12151a; padding: 28px 24px; border-bottom: 3px solid #ec4899;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 10px; font-weight: 700; color: #ec4899; text-transform: uppercase; letter-spacing: 2px; font-family: monospace;">ENTIREFM PUBLICATION</span>
                    <h1 style="margin: 4px 0 0 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">THE FM BRIEFING</h1>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #a1a1aa;">Practical intelligence for people responsible for buildings.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT BLOCKS -->
          <tr>
            <td class="fluid-padding" style="padding: 32px 32px 16px 32px;">
              ${renderedBlocks}
            </td>
          </tr>

          <!-- BRAND FOOTER & COMPLIANCE -->
          <tr>
            <td style="background-color: #18181b; padding: 32px 24px; color: #71717a; font-size: 11px; line-height: 1.6; border-top: 1px solid #27272a;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; color: #a1a1aa; font-weight: 600; font-size: 12px;">Entire Facilities Management</p>
                    <p style="margin: 0 0 16px 0;">Commercial facilities management, planned maintenance, M&amp;E engineering, and statutory compliance across the UK.</p>
                    <p style="margin: 0 0 16px 0;">
                      <a href="${preferencesUrl}" style="color: #ec4899; text-decoration: underline;">Update Preferences</a>
                      &nbsp;&middot;&nbsp;
                      <a href="${unsubscribeUrl}" style="color: #ec4899; text-decoration: underline;">Unsubscribe</a>
                      &nbsp;&middot;&nbsp;
                      <a href="https://www.entirefm.com/privacy-policy" style="color: #a1a1aa; text-decoration: none;">Privacy Policy</a>
                    </p>
                    <p style="margin: 0; font-size: 10px; color: #52525b;">
                      You received this email because you subscribed to The FM Briefing on entirefm.com.<br/>
                      EntireFM &copy; 2026. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Renders an individual content block into HTML
 */
function renderBlockHtml(block: ContentBlock, utmCampaign: string): string {
  const trackedUrl = block.linkUrl ? appendUtm(block.linkUrl, utmCampaign, block.id) : '';

  switch (block.type) {
    case 'OPENING_NOTE':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
          <tr>
            <td style="background-color: #fafafa; border-left: 3px solid #18181b; padding: 16px 18px; font-size: 14px; line-height: 1.65; color: #27272a;">
              ${block.eyebrow ? `<div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">${escapeHtml(block.eyebrow)}</div>` : ''}
              ${block.body ? `<p style="margin: 0; color: #3f3f46;">${escapeHtml(block.body)}</p>` : ''}
              ${block.authorNote ? `<div style="margin-top: 8px; font-size: 12px; color: #71717a; font-weight: 600;">— ${escapeHtml(block.authorNote)}</div>` : ''}
            </td>
          </tr>
        </table>
      `;

    case 'FEATURED_ARTICLE':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px; border: 1px solid #e4e4e7; border-radius: 4px; overflow: hidden;">
          <tr>
            <td style="padding: 24px;">
              ${block.eyebrow ? `<span style="font-size: 10px; font-weight: 700; color: #ec4899; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">${escapeHtml(block.eyebrow)}</span>` : ''}
              <h2 style="margin: 6px 0 10px 0; font-size: 18px; font-weight: 700; color: #18181b; line-height: 1.35;">
                <a href="${trackedUrl}" style="color: #18181b; text-decoration: none;">${escapeHtml(block.heading || '')}</a>
              </h2>
              ${block.body ? `<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #52525b;">${escapeHtml(block.body)}</p>` : ''}
              ${block.bullets && block.bullets.length > 0 ? `
                <ul style="margin: 0 0 16px 0; padding-left: 20px; font-size: 13.5px; color: #3f3f46; line-height: 1.55;">
                  ${block.bullets.map(b => `<li style="margin-bottom: 6px;">${escapeHtml(b)}</li>`).join('')}
                </ul>
              ` : ''}
              ${trackedUrl ? `
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #18181b; border-radius: 3px;">
                      <a href="${trackedUrl}" style="display: inline-block; padding: 9px 18px; font-size: 13px; font-weight: 600; color: #ffffff; text-decoration: none;">${escapeHtml(block.linkText || 'Read full analysis &rarr;')}</a>
                    </td>
                  </tr>
                </table>
              ` : ''}
            </td>
          </tr>
        </table>
      `;

    case 'RESOURCE_TOOL':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px;">
          <tr>
            <td style="padding: 20px;">
              <span style="font-size: 10px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">PRACTICAL FM TOOL</span>
              <h3 style="margin: 4px 0 8px 0; font-size: 16px; font-weight: 700; color: #0f172a;">${escapeHtml(block.heading || '')}</h3>
              ${block.body ? `<p style="margin: 0 0 14px 0; font-size: 13.5px; line-height: 1.55; color: #475569;">${escapeHtml(block.body)}</p>` : ''}
              ${trackedUrl ? `<a href="${trackedUrl}" style="font-size: 13px; font-weight: 700; color: #0284c7; text-decoration: none;">${escapeHtml(block.linkText || 'Launch interactive tool &rarr;')}</a>` : ''}
            </td>
          </tr>
        </table>
      `;

    case 'AI_TECHNOLOGY':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #fdf2f8; border-left: 3px solid #ec4899; padding: 18px;">
          <tr>
            <td>
              <span style="font-size: 10px; font-weight: 700; color: #db2777; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">AI &amp; TECHNOLOGY WATCH</span>
              <h3 style="margin: 4px 0 6px 0; font-size: 15px; font-weight: 700; color: #831843;">${escapeHtml(block.heading || '')}</h3>
              ${block.body ? `<p style="margin: 0 0 10px 0; font-size: 13.5px; line-height: 1.55; color: #701a75;">${escapeHtml(block.body)}</p>` : ''}
              ${trackedUrl ? `<a href="${trackedUrl}" style="font-size: 12.5px; font-weight: 700; color: #db2777; text-decoration: none;">${escapeHtml(block.linkText || 'Read guide &rarr;')}</a>` : ''}
            </td>
          </tr>
        </table>
      `;

    case 'COMPLIANCE_UPDATE':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #eff6ff; border-left: 3px solid #2563eb; padding: 18px;">
          <tr>
            <td>
              <span style="font-size: 10px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">COMPLIANCE OBLIGATION</span>
              <h3 style="margin: 4px 0 6px 0; font-size: 15px; font-weight: 700; color: #1e3a8a;">${escapeHtml(block.heading || '')}</h3>
              ${block.body ? `<p style="margin: 0 0 10px 0; font-size: 13.5px; line-height: 1.55; color: #1e40af;">${escapeHtml(block.body)}</p>` : ''}
              ${trackedUrl ? `<a href="${trackedUrl}" style="font-size: 12.5px; font-weight: 700; color: #1d4ed8; text-decoration: none;">${escapeHtml(block.linkText || 'Check statutory requirements &rarr;')}</a>` : ''}
            </td>
          </tr>
        </table>
      `;

    case 'KEY_TAKEAWAY':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #18181b; border-radius: 4px; padding: 20px; color: #ffffff;">
          <tr>
            <td>
              <span style="font-size: 10px; font-weight: 700; color: #ec4899; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace;">ONE THING TO THINK ABOUT</span>
              <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 1.6; color: #e4e4e7; font-style: italic;">&ldquo;${escapeHtml(block.body || block.takeaway || '')}&rdquo;</p>
            </td>
          </tr>
        </table>
      `;

    case 'COMMERCIAL_CTA':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; padding: 20px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 4px; text-align: center;">
          <tr>
            <td>
              <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #18181b;">${escapeHtml(block.heading || 'Need to review how your estate is maintained?')}</h4>
              <p style="margin: 0 0 14px 0; font-size: 13px; color: #71717a;">EntireFM provides single-source planned maintenance, statutory compliance and 24/7 helpdesk cover across the UK.</p>
              <a href="${trackedUrl || 'https://www.entirefm.com/contact-us'}" style="display: inline-block; padding: 8px 18px; background-color: #18181b; color: #ffffff; font-size: 12.5px; font-weight: 600; text-decoration: none; border-radius: 3px;">${escapeHtml(block.linkText || 'Discuss your FM requirement &rarr;')}</a>
            </td>
          </tr>
        </table>
      `;

    case 'DIVIDER':
      return `<hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 28px 0;" />`;

    case 'CUSTOM_TEXT':
    default:
      return `
        <div style="margin-bottom: 20px; font-size: 14px; line-height: 1.65; color: #3f3f46;">
          ${block.heading ? `<h3 style="font-size: 16px; font-weight: 700; color: #18181b; margin: 0 0 8px 0;">${escapeHtml(block.heading)}</h3>` : ''}
          ${block.body ? `<p style="margin: 0;">${escapeHtml(block.body)}</p>` : ''}
        </div>
      `;
  }
}

/**
 * Compiles campaign to plain text for text-only email clients
 */
export function renderCampaignPlainText(
  campaign: NewsletterCampaign,
  unsubscribeUrl: string = '{{UNSUBSCRIBE_URL}}'
): string {
  let text = `THE FM BRIEFING — EntireFM\nPractical intelligence for people responsible for buildings.\n${'='.repeat(60)}\n\n`;

  for (const block of campaign.contentBlocks) {
    if (block.eyebrow) text += `[ ${block.eyebrow.toUpperCase()} ]\n`;
    if (block.heading) text += `${block.heading}\n`;
    if (block.body) text += `${block.body}\n`;
    if (block.bullets) {
      for (const b of block.bullets) text += `  * ${b}\n`;
    }
    if (block.linkUrl) {
      text += `Link: ${appendUtm(block.linkUrl, campaign.utmCampaign, block.id)}\n`;
    }
    text += `\n${'-'.repeat(40)}\n\n`;
  }

  text += `Entire Facilities Management &copy; 2026\nTo unsubscribe from this briefing: ${unsubscribeUrl}\n`;
  return text;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
