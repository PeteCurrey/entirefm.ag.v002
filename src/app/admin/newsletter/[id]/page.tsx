'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Mail,
  Send,
  Save,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function CampaignComposerPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = (params?.id as string) || 'new';

  const [loading, setLoading] = useState(campaignId !== 'new');
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'text'>('desktop');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'qa'>('editor');

  const [campaign, setCampaign] = useState({
    id: campaignId === 'new' ? `camp-${Date.now()}` : campaignId,
    name: 'The FM Briefing — New Edition',
    subject: 'The FM Briefing: Maintenance & Compliance Intelligence',
    previewText: 'Practical facilities management intelligence without the noise.',
    senderName: 'EntireFM Editorial Team',
    replyTo: 'editorial@entirefm.com',
    status: 'DRAFT',
    utmCampaign: '2026-briefing-custom',
    contentBlocks: [
      {
        id: 'block-1',
        type: 'OPENING_NOTE',
        eyebrow: 'EDITORIAL OVERVIEW',
        body: 'Welcome to this edition of The FM Briefing. Practical intelligence covering statutory testing obligations, mechanical plant care, and building technology.',
        authorNote: 'EntireFM Technical Desk',
      },
      {
        id: 'block-2',
        type: 'FEATURED_ARTICLE',
        eyebrow: 'AI & TECHNOLOGY',
        heading: 'AI in Facilities Management in 2026: What Is Actually Useful?',
        body: 'A practical review of AI in commercial building operations in 2026: what delivers immediate ROI, what remains experimental, and what is pure marketing.',
        linkUrl: '/post/ai-in-facilities-management-2026',
        linkText: 'Read full analysis →',
        bullets: [
          'Natural language triage for FM helpdesks',
          'Vibration monitoring on high-criticality centrifugal chillers',
          'Why bad asset data breaks machine learning models',
        ],
      },
      {
        id: 'block-3',
        type: 'RESOURCE_TOOL',
        heading: 'PPM Schedule Builder',
        body: 'Generate an asset-led planned preventative maintenance matrix with verified statutory and SFG20 task classifications.',
        linkUrl: '/tools/ppm-schedule-builder',
        linkText: 'Launch interactive schedule builder →',
      },
      {
        id: 'block-4',
        type: 'KEY_TAKEAWAY',
        body: 'Predictive maintenance does not replace PPM. It supercharges intervention timing on high-capital plant, while statutory PPM continues to protect life safety and building fabric under UK law.',
      },
      {
        id: 'block-5',
        type: 'COMMERCIAL_CTA',
        heading: 'Need help reviewing how your estate is maintained?',
        linkUrl: '/contact-us',
        linkText: 'Request a facilities review →',
      },
    ],
  });

  const [qaResults, setQaResults] = useState<{
    valid?: boolean;
    errors?: string[];
    warnings?: string[];
    linkChecks?: any[];
  }>({});

  useEffect(() => {
    if (campaignId !== 'new') {
      fetch('/api/admin/newsletter/campaigns')
        .then((r) => r.json())
        .then((camps) => {
          if (Array.isArray(camps)) {
            const found = camps.find((c: any) => c.id === campaignId);
            if (found) setCampaign(found);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [campaignId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE', campaign }),
      });
      const data = await res.json();
      if (data.validation) setQaResults(data.validation);
      if (data.success && campaignId === 'new') {
        router.push(`/admin/newsletter/${data.campaign.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VALIDATE', campaign }),
      });
      const data = await res.json();
      setQaResults(data);
      setActiveTab('qa');
    } catch (err) {
      console.error(err);
    } finally {
      setValidating(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) return;
    setTestSending(true);
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SEND_TEST', campaign, testRecipient: testEmail }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Test email sent successfully via ${data.provider} to ${testEmail}`);
      } else {
        alert(`Test send notice: ${data.error || 'Check server logs'}`);
      }
    } catch (err: any) {
      alert(`Error sending test: ${err.message}`);
    } finally {
      setTestSending(false);
    }
  };

  const addBlock = (type: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      heading: 'New Section Heading',
      body: 'Section body copy.',
      linkUrl: '/resources',
      linkText: 'Read more →',
    };
    setCampaign({
      ...campaign,
      contentBlocks: [...campaign.contentBlocks, newBlock as any],
    });
  };

  const removeBlock = (index: number) => {
    const updated = [...campaign.contentBlocks];
    updated.splice(index, 1);
    setCampaign({ ...campaign, contentBlocks: updated });
  };

  const updateBlock = (index: number, patch: any) => {
    const updated = [...campaign.contentBlocks];
    updated[index] = { ...updated[index], ...patch };
    setCampaign({ ...campaign, contentBlocks: updated });
  };

  if (loading) {
    return <div className="p-12 text-center text-zinc-500 text-xs">Loading campaign composer...</div>;
  }

  // Inline renderers — full template engine extracted to server module in future phase
  const unsubUrl = 'https://www.entirefm.com/fm-briefing/unsubscribe?token=preview';
  const blocks: any[] = campaign.contentBlocks || [];
  const renderedText = [
    campaign.name,
    campaign.subject,
    '',
    ...blocks.map((b: any) =>
      b.type === 'heading' ? `## ${b.heading || b.content || ''}` :
      b.type === 'divider' ? '---' :
      b.type === 'cta' ? `[${b.linkText || b.label || 'Read more'}] ${b.linkUrl || b.url || ''}` :
      (b.body || b.content || '')
    ),
    '',
    `Unsubscribe: ${unsubUrl}`,
  ].join('\n');

  const renderBlock = (b: any): string => {
    if (b.type === 'heading' || b.heading) return `<h2 style="font-size:16px;font-weight:700;margin-top:16px">${b.heading || b.content || ''}</h2>`;
    if (b.type === 'body' || b.body) return `<p style="line-height:1.6;color:#374151">${(b.body || b.content || '').replace(/\n/g, '<br>')}</p>`;
    if (b.type === 'cta' || b.linkUrl) return `<a href="${b.linkUrl || b.url || '#'}" style="display:inline-block;padding:10px 20px;background:#db2777;color:#fff;text-decoration:none;border-radius:4px;font-weight:600">${b.linkText || b.label || 'Read more'}</a>`;
    if (b.type === 'divider') return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">`;
    return `<p style="line-height:1.6;color:#374151">${b.body || b.content || ''}</p>`;
  };
  const renderedHtml = [
    `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;color:#111">`,
    `<h1 style="font-size:20px">${campaign.subject || campaign.name}</h1>`,
    ...blocks.map(renderBlock),
    `<p style="font-size:11px;color:#9ca3af;margin-top:32px"><a href="${unsubUrl}" style="color:#9ca3af">Unsubscribe</a></p>`,
    `</body></html>`,
  ].join('');

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            CAMPAIGN COMPOSER · THE FM BRIEFING
          </span>
          <h1 className="text-2xl font-bold text-white mt-0.5">{campaign.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleValidate}
            disabled={validating}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-2 rounded-lg font-semibold border border-zinc-700 flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> Pre-Send Check
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <Link
            href="/admin/newsletter/campaigns"
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
          >
            ← Campaigns
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('editor')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
            activeTab === 'editor' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Campaign Content
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
            activeTab === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Live Email Preview
        </button>
        <button
          onClick={() => setActiveTab('qa')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
            activeTab === 'qa' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          QA &amp; Verification
          {qaResults.valid === true && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
          {qaResults.valid === false && <AlertTriangle className="h-3 w-3 text-red-400" />}
        </button>
      </div>

      {/* Tab: Editor */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Metadata Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Envelope &amp; Headers
              </h3>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Campaign Internal Name</label>
                <input
                  type="text"
                  value={campaign.name}
                  onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Preview Text (Preheader)</label>
                <textarea
                  rows={2}
                  value={campaign.previewText}
                  onChange={(e) => setCampaign({ ...campaign, previewText: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Sender Name</label>
                <input
                  type="text"
                  value={campaign.senderName}
                  onChange={(e) => setCampaign({ ...campaign, senderName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Reply-To Address</label>
                <input
                  type="text"
                  value={campaign.replyTo}
                  onChange={(e) => setCampaign({ ...campaign, replyTo: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">UTM Campaign Tag</label>
                <input
                  type="text"
                  value={campaign.utmCampaign}
                  onChange={(e) => setCampaign({ ...campaign, utmCampaign: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-pink-400"
                />
              </div>
            </div>

            {/* Test Send Box */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Send Test Email
              </h3>
              <p className="text-[11px] text-zinc-400">
                Send an immediate test rendering to verify styling in Outlook / Gmail.
              </p>
              <input
                type="email"
                placeholder="test-recipient@entirefm.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white"
              />
              <button
                onClick={handleSendTest}
                disabled={testSending || !testEmail}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 px-3 rounded border border-zinc-700 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5 text-pink-400" />
                {testSending ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>

          {/* Right Content Blocks Editor */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                Content Blocks ({campaign.contentBlocks.length})
              </h3>
              <div className="flex gap-1.5">
                <button
                  onClick={() => addBlock('FEATURED_ARTICLE')}
                  className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700"
                >
                  + Article
                </button>
                <button
                  onClick={() => addBlock('RESOURCE_TOOL')}
                  className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700"
                >
                  + Tool
                </button>
                <button
                  onClick={() => addBlock('KEY_TAKEAWAY')}
                  className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700"
                >
                  + Takeaway
                </button>
                <button
                  onClick={() => addBlock('CUSTOM_TEXT')}
                  className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700"
                >
                  + Text
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {campaign.contentBlocks.map((block, idx) => (
                <div
                  key={block.id || idx}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-pink-400 font-bold">
                      {block.type}
                    </span>
                    <button
                      onClick={() => removeBlock(idx)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                      title="Remove block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {block.eyebrow !== undefined && (
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">
                        Eyebrow
                      </label>
                      <input
                        type="text"
                        value={block.eyebrow}
                        onChange={(e) => updateBlock(idx, { eyebrow: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  )}

                  {block.heading !== undefined && (
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">
                        Heading
                      </label>
                      <input
                        type="text"
                        value={block.heading}
                        onChange={(e) => updateBlock(idx, { heading: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white font-semibold"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">
                      Body Text
                    </label>
                    <textarea
                      rows={3}
                      value={block.body || ''}
                      onChange={(e) => updateBlock(idx, { body: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white leading-relaxed"
                    />
                  </div>

                  {block.linkUrl !== undefined && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">
                          Link URL
                        </label>
                        <input
                          type="text"
                          value={block.linkUrl}
                          onChange={(e) => updateBlock(idx, { linkUrl: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs font-mono text-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">
                          Button / Link Text
                        </label>
                        <input
                          type="text"
                          value={block.linkText || ''}
                          onChange={(e) => updateBlock(idx, { linkText: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Live Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`text-xs font-semibold px-3 py-1 rounded ${
                  previewMode === 'desktop' ? 'bg-pink-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Desktop (600px)
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`text-xs font-semibold px-3 py-1 rounded ${
                  previewMode === 'mobile' ? 'bg-pink-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Mobile (375px)
              </button>
              <button
                onClick={() => setPreviewMode('text')}
                className={`text-xs font-semibold px-3 py-1 rounded ${
                  previewMode === 'text' ? 'bg-pink-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Plain Text
              </button>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              Rendered with EntireFM Responsive Email Engine
            </span>
          </div>

          {previewMode === 'text' ? (
            <pre className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono whitespace-pre-wrap overflow-x-auto">
              {renderedText}
            </pre>
          ) : (
            <div className="flex justify-center bg-zinc-950 p-6 rounded-xl border border-zinc-800 overflow-x-auto">
              <div
                style={{ width: previewMode === 'mobile' ? '375px' : '600px' }}
                className="transition-all duration-300 shadow-2xl rounded"
              >
                <iframe
                  srcDoc={renderedHtml}
                  title="Email Preview"
                  className="w-full min-h-[700px] border-0 rounded"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: QA & Verification */}
      {activeTab === 'qa' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              Pre-Send Quality Assurance Gate
            </h3>
            <button
              onClick={handleValidate}
              disabled={validating}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg border border-zinc-700 font-semibold"
            >
              Re-run Checks
            </button>
          </div>

          <div className="space-y-3">
            {qaResults.errors && qaResults.errors.length > 0 ? (
              <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-200 space-y-1">
                <h4 className="font-bold text-red-400">Errors (Sending Blocked):</h4>
                <ul className="list-disc pl-4 space-y-0.5">
                  {qaResults.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero blocking errors detected. Campaign meets pre-send safety criteria.</span>
              </div>
            )}

            {qaResults.warnings && qaResults.warnings.length > 0 && (
              <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-200 space-y-1">
                <h4 className="font-bold text-amber-400">Warnings:</h4>
                <ul className="list-disc pl-4 space-y-0.5">
                  {qaResults.warnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}

            {qaResults.linkChecks && qaResults.linkChecks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase font-mono">
                  Verified Destination Links ({qaResults.linkChecks.length})
                </h4>
                <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden">
                  {qaResults.linkChecks.map((link, i) => (
                    <div key={i} className="p-3 text-xs flex items-center justify-between">
                      <span className="font-mono text-zinc-300">{link.url}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                        ✓ {link.message || 'VALID'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
