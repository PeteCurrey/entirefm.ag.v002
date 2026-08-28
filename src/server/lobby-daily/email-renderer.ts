/**
 * ENTIREFM THE LOBBY DAILY — EMAIL HTML & PLAIN TEXT RENDERER
 * ============================================================
 * Bulletproof, responsive table-based email rendering engine.
 *
 * Specifications:
 * - Max container width: 640px
 * - Typography: Work Sans with Helvetica, Arial, sans-serif fallback
 * - Palette: Dark Masthead (#0A0D14), Clean Editorial Body (#FFFFFF, #F8F8F7), Hairline (#E5E5E2), Text (#18181B)
 * - Mobile responsive: 100% width on small screens, 16px base body font, >=44px tap targets
 * - Email client compatibility: Outlook desktop (mso conditional tables), Outlook mobile, Gmail, Apple Mail
 * - Security: No scripts, no base64 payloads, no CSS grid
 * - Compliance: RFC 8058 List-Unsubscribe headers, UK GDPR / PECR footer
 */

import { LobbyDailyEdition, LeadStory, WhatChangedStory, ComplianceWatchItem, ContractStory } from './types';

/**
 * Attaches UTM attribution tags to links
 */
export function tagUtmUrl(url: string, campaign: string, contentId: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('utm_source', 'the_lobby_daily');
    parsed.searchParams.set('utm_medium', 'email');
    parsed.searchParams.set('utm_campaign', campaign);
    parsed.searchParams.set('utm_content', contentId);
    return parsed.toString();
  } catch {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}utm_source=the_lobby_daily&utm_medium=email&utm_campaign=${campaign}&utm_content=${contentId}`;
  }
}

/**
 * Generates email headers including RFC 8058 one-click unsubscribe
 */
export function generateEmailHeaders(edition: LobbyDailyEdition, subscriberUnsubscribeToken: string): Record<string, string> {
  const unsubUrl = `https://www.entirefm.com/lobby/unsubscribe?token=${subscriberUnsubscribeToken}`;
  const mailtoUnsub = `mailto:unsubscribe@entirefm.com?subject=unsubscribe-${subscriberUnsubscribeToken}`;

  return {
    'List-Unsubscribe': `<${unsubUrl}>, <${mailtoUnsub}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    'X-Entity-Ref-ID': edition.id,
    'X-Auto-Response-Suppress': 'OOF, AutoReply',
  };
}

/**
 * Renders the full responsive HTML for a Lobby Daily edition
 */
export function renderDailyEmailHtml(
  edition: LobbyDailyEdition,
  options: {
    subscriberToken?: string;
    subscriberEmail?: string;
    previewMode?: boolean;
  } = {}
): string {
  const token = options.subscriberToken || 'preview-token';
  const subEmail = options.subscriberEmail || 'reader@company.co.uk';
  const campaign = edition.utmCampaign;

  const browserUrl = tagUtmUrl(edition.masthead.browserViewUrl, campaign, 'masthead_view_browser');
  const unsubUrl = `https://www.entirefm.com/lobby/unsubscribe?token=${token}`;
  const prefsUrl = `https://www.entirefm.com/lobby/preferences?token=${token}`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${edition.subjectLine}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap');
    
    /* Resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F4F4F2; font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    
    /* Links */
    a { color: #0F172A; text-decoration: underline; }
    a:hover { color: #000000; }
    
    /* Responsive rules */
    @media only screen and (max-width: 640px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-hide { display: none !important; }
      .lead-headline { font-size: 22px !important; line-height: 28px !important; }
      .body-copy { font-size: 16px !important; line-height: 24px !important; }
      .tap-target { min-height: 44px !important; line-height: 44px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F4F2; color: #18181B;">

  <!-- Preheader text (Hidden in email body) -->
  <div style="display: none; font-size: 1px; color: #F4F4F2; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${edition.preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <!-- Outer wrapper table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F4F2; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 16px 8px 40px 8px;">
        
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="640">
        <tr>
        <td align="center" valign="top" width="640">
        <![endif]-->
        
        <!-- Main Content Container (640px max) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width: 640px; background-color: #FFFFFF; border: 1px solid #E2E2DE;">
          
          <!-- ── 1. MASTHEAD ── -->
          <tr>
            <td style="background-color: #0A0D14; padding: 28px 24px 24px 24px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 12px;">
                          <!-- EntireFM Logo Symbol -->
                          <div style="width: 28px; height: 28px; background-color: #00E599; border-radius: 2px; text-align: center; line-height: 28px; color: #0A0D14; font-weight: 800; font-size: 14px; font-family: 'Work Sans', Arial, sans-serif;">E</div>
                        </td>
                        <td>
                          <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #00E599; display: block; font-family: 'Work Sans', Arial, sans-serif;">ENTIREFM</span>
                          <span style="font-size: 20px; font-weight: 300; letter-spacing: 0.05em; text-transform: uppercase; color: #FFFFFF; display: block; font-family: 'Work Sans', Arial, sans-serif; line-height: 22px;">THE LOBBY DAILY</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle" class="mobile-hide">
                    <span style="font-size: 11px; color: #94A3B8; font-family: 'Work Sans', Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.08em;">
                      ${edition.masthead.ukDateFormatted}
                    </span>
                    <br />
                    <span style="font-size: 11px; color: #64748B; font-family: 'Work Sans', Arial, sans-serif;">
                      Edition #${edition.editionNumber} · ${edition.readingTimeMinutes} min read
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 16px; border-top: 1px solid #222734; margin-top: 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left">
                          <span style="font-size: 12px; font-style: italic; color: #94A3B8; font-family: 'Work Sans', Arial, sans-serif;">
                            What changed. Why it matters. What to do next.
                          </span>
                        </td>
                        <td align="right">
                          <a href="${browserUrl}" target="_blank" style="font-size: 11px; color: #00E599; text-decoration: none; font-weight: 500; font-family: 'Work Sans', Arial, sans-serif;">View in browser &rarr;</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── 2. LEAD STORY ── -->
          <tr>
            <td style="padding: 28px 24px 20px 24px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <!-- 16:9 Image -->
                    ${
                      edition.leadStory.image?.imageUrl
                        ? `<div style="width: 100%; max-height: 320px; overflow: hidden; background-color: #0A0D14; margin-bottom: 16px; border-radius: 2px;">
                            <img src="${edition.leadStory.image.imageUrl.startsWith('/') ? 'https://www.entirefm.com' + edition.leadStory.image.imageUrl : edition.leadStory.image.imageUrl}" alt="${edition.leadStory.image.imageAlt || 'Lead story image'}" width="592" style="width: 100%; max-width: 592px; height: auto; display: block;" />
                          </div>`
                        : ''
                    }
                    
                    <!-- Category Badge -->
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #0284C7; display: inline-block; margin-bottom: 6px;">
                      ${edition.leadStory.categoryLabel}
                    </span>
                    
                    <!-- Headline -->
                    <h1 class="lead-headline" style="font-size: 24px; line-height: 30px; font-weight: 600; color: #0F172A; margin: 0 0 12px 0; font-family: 'Work Sans', Arial, sans-serif;">
                      <a href="${tagUtmUrl(edition.leadStory.ctaUrl || edition.leadStory.sourceUrl, campaign, 'lead_headline')}" target="_blank" style="color: #0F172A; text-decoration: none;">
                        ${edition.leadStory.headline}
                      </a>
                    </h1>
                    
                    <!-- Summary (60-90 words) -->
                    <p class="body-copy" style="font-size: 16px; line-height: 24px; color: #334155; margin: 0 0 14px 0; font-weight: 400;">
                      ${edition.leadStory.summary}
                    </p>
                    
                    <!-- Why It Matters Block -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border-left: 3px solid #00E599; margin: 12px 0 16px 0;">
                      <tr>
                        <td style="padding: 12px 14px;">
                          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0F172A; display: block; margin-bottom: 4px;">
                            WHY IT MATTERS:
                          </span>
                          <span style="font-size: 14px; line-height: 20px; color: #334155; font-weight: 400;">
                            ${edition.leadStory.whyItMatters}
                          </span>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Source & CTA -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left">
                          <span style="font-size: 11px; color: #64748B;">Source: <strong>${edition.leadStory.sourceName}</strong></span>
                        </td>
                        <td align="right">
                          <a href="${tagUtmUrl(edition.leadStory.ctaUrl || edition.leadStory.sourceUrl, campaign, 'lead_cta')}" target="_blank" style="font-size: 13px; font-weight: 600; color: #0F172A; text-decoration: underline;">
                            ${edition.leadStory.ctaText || 'Read Briefing &rarr;'}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section Divider -->
          <tr><td style="padding: 0 24px;"><hr style="border: 0; border-top: 1px solid #E2E2DE; margin: 0;" /></td></tr>

          <!-- ── 3. THE MORNING BRIEF (3 concise items) ── -->
          ${
            edition.morningBrief.length > 0
              ? `<tr>
                  <td style="padding: 24px 24px 16px 24px;" class="mobile-padding">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #0F172A; display: block; margin-bottom: 12px;">
                      THE MORNING BRIEF
                    </span>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      ${edition.morningBrief
                        .map(
                          (item, idx) => `
                        <tr>
                          <td style="padding: 10px 0; ${idx < edition.morningBrief.length - 1 ? 'border-bottom: 1px solid #F1F1EF;' : ''}">
                            <h3 style="font-size: 15px; font-weight: 600; line-height: 20px; margin: 0 0 4px 0; color: #0F172A;">
                              <a href="${tagUtmUrl(item.sourceUrl, campaign, `morning_brief_${idx + 1}`)}" target="_blank" style="color: #0F172A; text-decoration: none;">
                                ${item.headline}
                              </a>
                            </h3>
                            <p style="font-size: 14px; line-height: 20px; color: #475569; margin: 0 0 4px 0;">
                              ${item.oneSentenceSummary}
                            </p>
                            <span style="font-size: 11px; color: #94A3B8;">Attribution: <em>${item.sourceName}</em></span>
                          </td>
                        </tr>
                      `
                        )
                        .join('')}
                    </table>
                  </td>
                </tr>
                <tr><td style="padding: 0 24px;"><hr style="border: 0; border-top: 1px solid #E2E2DE; margin: 0;" /></td></tr>`
              : ''
          }

          <!-- ── 4. WHAT CHANGED TODAY (3-5 items) ── -->
          ${
            edition.whatChangedToday.length > 0
              ? `<tr>
                  <td style="padding: 24px 24px 16px 24px;" class="mobile-padding">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #0F172A; display: block; margin-bottom: 14px;">
                      WHAT CHANGED TODAY
                    </span>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      ${edition.whatChangedToday
                        .map(
                          (story, idx) => `
                        <tr>
                          <td style="padding: 14px 0; ${idx < edition.whatChangedToday.length - 1 ? 'border-bottom: 1px solid #F1F1EF;' : ''}">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td valign="top">
                                  <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0284C7; display: block; margin-bottom: 3px;">
                                    ${story.category}
                                  </span>
                                  <h3 style="font-size: 16px; font-weight: 600; line-height: 22px; color: #0F172A; margin: 0 0 6px 0;">
                                    <a href="${tagUtmUrl(story.ctaUrl || story.sourceUrl, campaign, `what_changed_${idx + 1}`)}" target="_blank" style="color: #0F172A; text-decoration: none;">
                                      ${story.headline}
                                    </a>
                                  </h3>
                                  <p style="font-size: 14px; line-height: 21px; color: #475569; margin: 0 0 6px 0;">
                                    ${story.summary}
                                  </p>
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                      <td align="left">
                                        <span style="font-size: 11px; color: #94A3B8;">Source: ${story.sourceName}</span>
                                      </td>
                                      <td align="right">
                                        <a href="${tagUtmUrl(story.ctaUrl || story.sourceUrl, campaign, `what_changed_link_${idx + 1}`)}" target="_blank" style="font-size: 12px; font-weight: 600; color: #0F172A;">
                                          ${story.ctaText || 'Source details &rarr;'}
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      `
                        )
                        .join('')}
                    </table>
                  </td>
                </tr>
                <tr><td style="padding: 0 24px;"><hr style="border: 0; border-top: 1px solid #E2E2DE; margin: 0;" /></td></tr>`
              : ''
          }

          <!-- ── 5. COMPLIANCE WATCH (Rendered only if verified) ── -->
          ${
            edition.complianceWatch
              ? `<tr>
                  <td style="padding: 24px 24px 16px 24px; background-color: #FFFBEB;" class="mobile-padding">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #B45309; display: block; margin-bottom: 8px;">
                      COMPLIANCE WATCH · STATUTORY DIRECTIVE
                    </span>
                    <h3 style="font-size: 17px; font-weight: 600; line-height: 22px; color: #78350F; margin: 0 0 8px 0;">
                      ${edition.complianceWatch.regulationOrStandard}
                    </h3>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; line-height: 19px; color: #92400E; margin-bottom: 12px;">
                      <tr>
                        <td style="padding: 3px 0;"><strong>Effective Date:</strong> ${edition.complianceWatch.effectiveOrPublishedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0;"><strong>Who It Affects:</strong> ${edition.complianceWatch.whoItAffects}</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0;"><strong>Required Action:</strong> ${edition.complianceWatch.requiredOperationalAction}</td>
                      </tr>
                    </table>
                    <div style="font-size: 12px; color: #B45309;">
                      Authoritative Source: <a href="${tagUtmUrl(edition.complianceWatch.authoritativeUrl, campaign, 'compliance_source')}" target="_blank" style="color: #78350F; font-weight: 600;">${edition.complianceWatch.authoritativeSource} &rarr;</a>
                    </div>
                  </td>
                </tr>
                <tr><td style="padding: 0 24px;"><hr style="border: 0; border-top: 1px solid #E2E2DE; margin: 0;" /></td></tr>`
              : ''
          }

          <!-- ── 6. CONTRACTS, AWARDS & MOBILISATIONS (Up to 2) ── -->
          ${
            edition.contractsMobilisations.length > 0
              ? `<tr>
                  <td style="padding: 24px 24px 16px 24px;" class="mobile-padding">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #0F172A; display: block; margin-bottom: 12px;">
                      CONTRACTS, AWARDS &amp; MOBILISATIONS
                    </span>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      ${edition.contractsMobilisations
                        .map(
                          (c, idx) => `
                        <tr>
                          <td style="padding: 8px 0; ${idx < edition.contractsMobilisations.length - 1 ? 'border-bottom: 1px solid #F1F1EF;' : ''}">
                            <h4 style="font-size: 15px; font-weight: 600; line-height: 20px; color: #0F172A; margin: 0 0 4px 0;">
                              <a href="${tagUtmUrl(c.sourceUrl, campaign, `contract_${idx + 1}`)}" target="_blank" style="color: #0F172A; text-decoration: none;">
                                ${c.headline}
                              </a>
                            </h4>
                            <p style="font-size: 13px; line-height: 19px; color: #475569; margin: 0 0 4px 0;">
                              ${c.summary}
                            </p>
                            <span style="font-size: 11px; color: #94A3B8;">
                              ${c.contractValue ? `<strong>Value:</strong> ${c.contractValue} · ` : ''}Source: <em>${c.sourceName}</em>
                            </span>
                          </td>
                        </tr>
                      `
                        )
                        .join('')}
                    </table>
                  </td>
                </tr>
                <tr><td style="padding: 0 24px;"><hr style="border: 0; border-top: 1px solid #E2E2DE; margin: 0;" /></td></tr>`
              : ''
          }

          <!-- ── 7. THE ENGINEER'S NOTE ── -->
          ${
            edition.engineersNote
              ? `<tr>
                  <td style="padding: 24px 24px 16px 24px; background-color: #F8FAFC;" class="mobile-padding">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #00E599; display: block; margin-bottom: 6px;">
                      THE ENGINEER’S NOTE · OPERATIONAL INSIGHT
                    </span>
                    <h3 style="font-size: 16px; font-weight: 600; line-height: 22px; color: #0F172A; margin: 0 0 8px 0;">
                      ${edition.engineersNote.title}
                    </h3>
                    <p style="font-size: 14px; line-height: 22px; color: #334155; margin: 0 0 10px 0;">
                      ${edition.engineersNote.observation}
                    </p>
                    <span style="font-size: 11px; color: #64748B; font-weight: 500;">
                      — ${edition.engineersNote.authorName}, ${edition.engineersNote.authorRole}
                    </span>
                  </td>
                </tr>
                <tr><td style="padding: 0 24px;"><hr style="border: 0; border-top: 1px solid #E2E2DE; margin: 0;" /></td></tr>`
              : ''
          }

          <!-- ── 8. ON THE HORIZON ── -->
          ${
            edition.onTheHorizon
              ? `<tr>
                  <td style="padding: 20px 24px 16px 24px;" class="mobile-padding">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #64748B; display: block; margin-bottom: 6px;">
                      ON THE HORIZON
                    </span>
                    <h4 style="font-size: 15px; font-weight: 600; line-height: 20px; color: #0F172A; margin: 0 0 4px 0;">
                      ${edition.onTheHorizon.title} · <span style="color: #0284C7;">${edition.onTheHorizon.dateOrDeadline}</span>
                    </h4>
                    <p style="font-size: 13px; line-height: 19px; color: #475569; margin: 0 0 4px 0;">
                      ${edition.onTheHorizon.description}
                    </p>
                    <span style="font-size: 11px; color: #94A3B8;">Milestone Source: <em>${edition.onTheHorizon.sourceName}</em></span>
                  </td>
                </tr>
                <tr><td style="padding: 0 24px;"><hr style="border: 0; border-top: 1px solid #E2E2DE; margin: 0;" /></td></tr>`
              : ''
          }

          <!-- ── 9. ONE USEFUL THING (Rotating tool/resource) ── -->
          <tr>
            <td style="padding: 24px 24px 20px 24px;" class="mobile-padding">
              <div style="border: 1px solid #E2E2DE; background-color: #FAFAFA; border-radius: 4px; padding: 18px 20px;">
                <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #00E599; display: block; margin-bottom: 4px;">
                  ONE USEFUL THING · ENTIREFM RESOURCES
                </span>
                <h3 style="font-size: 16px; font-weight: 600; line-height: 22px; color: #0F172A; margin: 0 0 6px 0;">
                  ${edition.oneUsefulThing.title}
                </h3>
                <p style="font-size: 13px; line-height: 20px; color: #475569; margin: 0 0 12px 0;">
                  ${edition.oneUsefulThing.description}
                </p>
                <a href="${tagUtmUrl(edition.oneUsefulThing.linkUrl, campaign, 'one_useful_thing')}" target="_blank" style="display: inline-block; font-size: 13px; font-weight: 600; color: #0F172A; text-decoration: underline;">
                  ${edition.oneUsefulThing.linkText}
                </a>
              </div>
            </td>
          </tr>

          <!-- ── OPTIONAL SPONSOR BLOCK (Strictly after editorial) ── -->
          ${
            edition.sponsorBlock && edition.sponsorBlock.enabled
              ? `<tr>
                  <td style="padding: 16px 24px; background-color: #F8FAFC;" class="mobile-padding">
                    <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #94A3B8; display: block; margin-bottom: 6px;">
                      SPONSORED
                    </span>
                    <h4 style="font-size: 14px; font-weight: 600; color: #0F172A; margin: 0 0 4px 0;">
                      <a href="${tagUtmUrl(edition.sponsorBlock.destinationUrl, campaign, 'sponsor_link')}" target="_blank" style="color: #0F172A; text-decoration: none;">
                        ${edition.sponsorBlock.headline}
                      </a>
                    </h4>
                    <p style="font-size: 12px; line-height: 18px; color: #64748B; margin: 0 0 6px 0;">
                      ${edition.sponsorBlock.body}
                    </p>
                    <span style="font-size: 11px; color: #94A3B8;">Partner: ${edition.sponsorBlock.sponsorName}</span>
                  </td>
                </tr>`
              : ''
          }

          <!-- ── 10. FOOTER ── -->
          <tr>
            <td style="background-color: #0A0D14; color: #94A3B8; padding: 32px 24px 28px 24px; font-size: 12px; line-height: 18px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <span style="font-size: 12px; font-weight: 600; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px;">
                      THE LOBBY DAILY
                    </span>
                    <span style="font-size: 11px; color: #64748B; display: block;">
                      ${edition.footer.receiveReason}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 16px; border-top: 1px solid #1E293B; padding-top: 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left">
                          <a href="${prefsUrl}" target="_blank" style="color: #00E599; text-decoration: none; font-size: 12px; margin-right: 16px; font-weight: 500;">
                            Manage Preferences
                          </a>
                          <a href="${unsubUrl}" target="_blank" style="color: #94A3B8; text-decoration: underline; font-size: 12px; margin-right: 16px;">
                            One-Click Unsubscribe
                          </a>
                          <a href="${edition.footer.privacyNoticeUrl}" target="_blank" style="color: #94A3B8; text-decoration: underline; font-size: 12px;">
                            Privacy Policy
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 11px; color: #475569; line-height: 16px;">
                    ${edition.footer.legalEntity}<br />
                    ${edition.footer.registeredAddress}<br />
                    Direct editorial inquiries: <a href="mailto:${edition.footer.contactEmail}" style="color: #64748B; text-decoration: underline;">${edition.footer.contactEmail}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
        
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates the plain-text alternative version for the edition
 */
export function renderDailyEmailText(
  edition: LobbyDailyEdition,
  options: { subscriberToken?: string; previewMode?: boolean } = {}
): string {
  const token = options.subscriberToken || 'preview-token';
  const unsubUrl = `https://www.entirefm.com/lobby/unsubscribe?token=${token}`;
  const prefsUrl = `https://www.entirefm.com/lobby/preferences?token=${token}`;

  const lines: string[] = [];

  lines.push('===============================================================');
  lines.push(`THE LOBBY DAILY by EntireFM — ${edition.masthead.ukDateFormatted}`);
  lines.push(`Edition #${edition.editionNumber} · ${edition.readingTimeMinutes} min read`);
  lines.push('What changed. Why it matters. What to do next.');
  lines.push('===============================================================\n');

  lines.push(`[LEAD STORY] ${edition.leadStory.categoryLabel}`);
  lines.push(edition.leadStory.headline);
  lines.push(edition.leadStory.summary);
  lines.push(`WHY IT MATTERS: ${edition.leadStory.whyItMatters}`);
  lines.push(`Source: ${edition.leadStory.sourceName} (${edition.leadStory.sourceUrl})\n`);

  if (edition.morningBrief.length > 0) {
    lines.push('---------------------------------------------------------------');
    lines.push('THE MORNING BRIEF');
    lines.push('---------------------------------------------------------------');
    edition.morningBrief.forEach((mb, i) => {
      lines.push(`${i + 1}. ${mb.headline}`);
      lines.push(`   ${mb.oneSentenceSummary}`);
      lines.push(`   Source: ${mb.sourceName} (${mb.sourceUrl})\n`);
    });
  }

  if (edition.whatChangedToday.length > 0) {
    lines.push('---------------------------------------------------------------');
    lines.push('WHAT CHANGED TODAY');
    lines.push('---------------------------------------------------------------');
    edition.whatChangedToday.forEach((wc) => {
      lines.push(`• [${wc.category}] ${wc.headline}`);
      lines.push(`  ${wc.summary}`);
      lines.push(`  Source: ${wc.sourceName} (${wc.sourceUrl})\n`);
    });
  }

  if (edition.complianceWatch) {
    lines.push('---------------------------------------------------------------');
    lines.push('COMPLIANCE WATCH · STATUTORY DIRECTIVE');
    lines.push('---------------------------------------------------------------');
    lines.push(`Regulation: ${edition.complianceWatch.regulationOrStandard}`);
    lines.push(`Effective Date: ${edition.complianceWatch.effectiveOrPublishedDate}`);
    lines.push(`Who It Affects: ${edition.complianceWatch.whoItAffects}`);
    lines.push(`Required Action: ${edition.complianceWatch.requiredOperationalAction}`);
    lines.push(`Source: ${edition.complianceWatch.authoritativeSource} (${edition.complianceWatch.authoritativeUrl})\n`);
  }

  if (edition.contractsMobilisations.length > 0) {
    lines.push('---------------------------------------------------------------');
    lines.push('CONTRACTS, AWARDS & MOBILISATIONS');
    lines.push('---------------------------------------------------------------');
    edition.contractsMobilisations.forEach((c) => {
      lines.push(`• ${c.headline}`);
      if (c.contractValue) lines.push(`  Value: ${c.contractValue}`);
      lines.push(`  Summary: ${c.summary}`);
      lines.push(`  Source: ${c.sourceName} (${c.sourceUrl})\n`);
    });
  }

  if (edition.engineersNote) {
    lines.push('---------------------------------------------------------------');
    lines.push(`THE ENGINEER’S NOTE: ${edition.engineersNote.title}`);
    lines.push('---------------------------------------------------------------');
    lines.push(edition.engineersNote.observation);
    lines.push(`— ${edition.engineersNote.authorName}, ${edition.engineersNote.authorRole}\n`);
  }

  if (edition.onTheHorizon) {
    lines.push('---------------------------------------------------------------');
    lines.push(`ON THE HORIZON: ${edition.onTheHorizon.title} (${edition.onTheHorizon.dateOrDeadline})`);
    lines.push('---------------------------------------------------------------');
    lines.push(edition.onTheHorizon.description);
    lines.push(`Source: ${edition.onTheHorizon.sourceName}\n`);
  }

  lines.push('---------------------------------------------------------------');
  lines.push(`ONE USEFUL THING: ${edition.oneUsefulThing.title}`);
  lines.push('---------------------------------------------------------------');
  lines.push(edition.oneUsefulThing.description);
  lines.push(`Link: ${edition.oneUsefulThing.linkUrl}\n`);

  lines.push('===============================================================');
  lines.push(`You received this email because you subscribed to The Lobby Daily.`);
  lines.push(`Manage Preferences: ${prefsUrl}`);
  lines.push(`Unsubscribe: ${unsubUrl}`);
  lines.push(`${edition.footer.legalEntity}`);
  lines.push(`${edition.footer.registeredAddress}`);
  lines.push('===============================================================');

  return lines.join('\n');
}
