import { NextResponse } from 'next/server';
import { listCampaigns, saveCampaign, getCampaignById } from '@/server/newsletter/store';
import { validateCampaignPreSend, renderCampaignHtml, renderCampaignPlainText } from '@/server/newsletter/composer';
import { sendEmail } from '@/server/newsletter/provider';
import { NewsletterCampaign } from '@/server/newsletter/types';

export async function GET(req: Request) {
  const campaigns = await listCampaigns();
  return NextResponse.json(campaigns);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, campaign, testRecipient } = body;

    if (action === 'VALIDATE') {
      const result = await validateCampaignPreSend(campaign);
      return NextResponse.json(result);
    }

    if (action === 'SEND_TEST') {
      if (!testRecipient) {
        return NextResponse.json({ error: 'Please specify a test recipient email' }, { status: 400 });
      }
      const html = renderCampaignHtml(campaign, 'https://www.entirefm.com/fm-briefing/unsubscribe?test=1');
      const text = renderCampaignPlainText(campaign, 'https://www.entirefm.com/fm-briefing/unsubscribe?test=1');

      const result = await sendEmail({
        to: testRecipient,
        subject: `[TEST] ${campaign.subject}`,
        html,
        text,
        fromName: campaign.senderName,
        replyTo: campaign.replyTo,
        isTest: true,
      });

      return NextResponse.json(result);
    }

    if (action === 'SAVE') {
      const validation = await validateCampaignPreSend(campaign);
      const toSave: NewsletterCampaign = {
        ...campaign,
        id: campaign.id || `camp-${Date.now()}`,
        validationPassed: validation.valid,
        validationDetails: {
          errors: validation.errors,
          warnings: validation.warnings,
          linkChecks: validation.linkChecks,
        },
        createdAt: campaign.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const saved = await saveCampaign(toSave);
      return NextResponse.json({ success: true, campaign: saved, validation });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
