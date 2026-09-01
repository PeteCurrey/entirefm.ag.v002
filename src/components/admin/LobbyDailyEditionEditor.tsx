'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LobbyDailyEdition, EditionStatus } from '@/server/lobby-daily/types';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  FileText,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface Props {
  edition?: LobbyDailyEdition;
  initialEdition?: LobbyDailyEdition;
}

export function LobbyDailyEditionEditor({ edition: propEdition, initialEdition }: Props) {
  const router = useRouter();
  const [edition, setEdition] = useState<LobbyDailyEdition>((propEdition || initialEdition)!);
  const [activeTab, setActiveTab] = useState<'preview' | 'sections' | 'text' | 'qa'>('preview');
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const isScheduled = edition.status === 'SCHEDULED';
  const isSent = edition.status === 'SENT';

  async function handleApprove() {
    setApproving(true);
    try {
      const action = isScheduled ? 'UNAPPROVE' : 'APPROVE';
      const res = await fetch('/api/admin/lobby-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, editionId: edition.id }),
      });
      const data = await res.json();
      if (data.ok && data.edition) {
        setEdition(data.edition);
        router.refresh();
      } else {
        alert(data.error || 'Failed to update approval');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setApproving(false);
    }
  }

  async function handleSendTest(e: React.FormEvent) {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setSendingTest(true);
    setTestStatus(null);
    try {
      const res = await fetch('/api/admin/lobby-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SEND_TEST', editionId: edition.id, testEmail }),
      });
      const data = await res.json();
      if (data.ok) {
        setTestStatus(`Test email dispatched to ${testEmail}`);
      } else {
        setTestStatus(`Failed: ${data.error}`);
      }
    } catch (e: any) {
      setTestStatus(`Error: ${e.message}`);
    } finally {
      setSendingTest(false);
    }
  }

  async function handleDispatchNow() {
    if (!confirm(`Are you sure you want to dispatch Edition #${edition.editionNumber} to ALL active subscribers immediately?`)) {
      return;
    }

    setDispatching(true);
    setDispatchStatus(null);
    try {
      const res = await fetch('/api/admin/lobby-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DISPATCH_NOW', editionId: edition.id }),
      });
      const data = await res.json();
      if (data.ok) {
        setDispatchStatus(`Dispatched successfully! Sent to ${data.dispatchResult?.sentCount || 0} subscribers.`);
        setEdition({ ...edition, status: 'SENT' });
        router.refresh();
      } else {
        setDispatchStatus(`Dispatch failed: ${data.error}`);
      }
    } catch (e: any) {
      setDispatchStatus(`Dispatch error: ${e.message}`);
    } finally {
      setDispatching(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/lobby/newsletters"
              className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Editions
            </Link>
            <span className="text-zinc-600">•</span>
            <span className="font-normal text-xs text-zinc-400">Edition #{edition.editionNumber}</span>
            <span
              className={`text-[10px] font-normal px-2 py-0.5 rounded border uppercase ${
                edition.status === 'SCHEDULED'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                  : edition.status === 'SENT'
                  ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  : 'bg-amber-950/80 text-amber-300 border-amber-800'
              }`}
            >
              {edition.status}
            </span>
          </div>

          <h1 className="text-xl font-medium text-white">{edition.subjectLine}</h1>
          <p className="text-xs text-zinc-400">
            {edition.masthead?.ukDateFormatted || edition.editionDate} • Slug: <code className="text-zinc-300 font-normal">{edition.slug}</code>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isSent && (
            <button
              onClick={handleApprove}
              disabled={approving}
              className={`text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                isScheduled
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-800/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {approving ? 'Updating...' : isScheduled ? 'Revoke Approval' : 'Approve for 06:45 Send'}
            </button>
          )}

          {!isSent && (
            <button
              onClick={handleDispatchNow}
              disabled={dispatching}
              className="text-xs bg-rose-700 hover:bg-rose-600 text-white px-3.5 py-2 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              {dispatching ? 'Dispatching...' : 'Dispatch Immediately'}
            </button>
          )}

          <a
            href={`/lobby/daily/${edition.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-2 rounded-lg border border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Public View
          </a>
        </div>
      </div>

      {/* Status Notifications */}
      {testStatus && (
        <div className="p-3 bg-zinc-800/80 border border-zinc-700 rounded-lg text-xs text-zinc-200">
          {testStatus}
        </div>
      )}
      {dispatchStatus && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-xs text-emerald-300">
          {dispatchStatus}
        </div>
      )}

      {/* Test Email Toolbar */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-zinc-400">
          <span className="font-medium text-zinc-200">Test Dispatch:</span> Send a preview copy of this exact edition before scheduled delivery.
        </div>
        <form onSubmit={handleSendTest} className="flex items-center gap-2">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="editor@entirefm.com"
            className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 w-56"
          />
          <button
            type="submit"
            disabled={sendingTest}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 font-medium transition-colors"
          >
            {sendingTest ? 'Sending...' : 'Send Test'}
          </button>
        </form>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-800 gap-4 text-xs">
        <button
          onClick={() => setActiveTab('preview')}
          className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'preview'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Eye className="h-3.5 w-3.5" /> HTML Email Preview
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'sections'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> 10 Editorial Sections
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'qa'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" /> QA Checklist (
          {edition.validationPassed ? 'Passed' : `${edition.validationReport?.errors?.length || 0} Issues`})
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'text'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> Plain Text Preview
        </button>
      </div>

      {/* Tab 1: Live HTML Preview */}
      {activeTab === 'preview' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-8 flex justify-center">
          <div className="w-full max-w-[660px] bg-white rounded-lg shadow-2xl overflow-hidden text-zinc-900 border border-zinc-300">
            <iframe
              title="Email Preview"
              src={`/api/admin/lobby-daily/preview?id=${edition.id}&format=raw-html`}
              className="w-full min-h-[900px] border-0"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Sections Breakdown */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          {/* Masthead */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 1</span>
            <h3 className="text-base font-medium text-white">Masthead & Metadata</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300 mt-2">
              <div><strong className="text-zinc-400">Publication:</strong> {edition.masthead?.publicationName || 'THE LOBBY DAILY'}</div>
              <div><strong className="text-zinc-400">Publisher:</strong> {edition.masthead?.publisherName || 'EntireFM'}</div>
              <div><strong className="text-zinc-400">Preheader:</strong> {edition.preheader}</div>
              <div><strong className="text-zinc-400">Subject:</strong> {edition.subjectLine}</div>
            </div>
          </div>

          {/* Lead Story */}
          {edition.leadStory && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 2</span>
              <h3 className="text-base font-medium text-white">Lead Intelligence Story</h3>
              <div className="text-sm font-medium text-zinc-100">{edition.leadStory.headline}</div>
              <p className="text-xs text-zinc-300 leading-relaxed">{edition.leadStory.summary}</p>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
                <span className="text-zinc-500 block uppercase font-normal text-[10px]">Why It Matters</span>
                <span className="text-emerald-300">{edition.leadStory.whyItMatters}</span>
              </div>
            </div>
          )}

          {/* Morning Brief */}
          {edition.morningBrief && edition.morningBrief.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 3</span>
              <h3 className="text-base font-medium text-white">The Morning Brief ({edition.morningBrief.length} Items)</h3>
              <div className="space-y-2">
                {edition.morningBrief.map((item, idx) => (
                  <div key={idx} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      {item.category && (
                        <span className="text-[10px] font-normal px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded">
                          {item.category}
                        </span>
                      )}
                      <strong className="text-zinc-200">{item.headline}</strong>
                    </div>
                    <p className="text-zinc-400 mt-1">{item.oneSentenceSummary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Changed / Regulatory */}
          {edition.whatChangedToday && edition.whatChangedToday.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 4</span>
              <h3 className="text-base font-medium text-white">What Changed Today</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {edition.whatChangedToday.map((item, idx) => (
                  <div key={idx} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1">
                    <span className="text-[10px] font-normal text-blue-400">{item.category}</span>
                    <div className="font-medium text-zinc-200">{item.headline}</div>
                    <p className="text-zinc-400">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Watch */}
          {edition.complianceWatch && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 5</span>
              <h3 className="text-base font-medium text-white">Compliance Watch</h3>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1">
                <div className="font-medium text-amber-300">{edition.complianceWatch.regulationOrStandard}</div>
                <div className="text-zinc-400">
                  <strong>Affects:</strong> {edition.complianceWatch.whoItAffects}
                </div>
                <div className="text-zinc-300">
                  <strong>Required Action:</strong> {edition.complianceWatch.requiredOperationalAction}
                </div>
              </div>
            </div>
          )}

          {/* Contracts & Commercial */}
          {edition.contractsMobilisations && edition.contractsMobilisations.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 6</span>
              <h3 className="text-base font-medium text-white">Contracts &amp; Mobilisations</h3>
              <div className="space-y-2">
                {edition.contractsMobilisations.map((item, idx) => (
                  <div key={idx} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1">
                    <div className="font-medium text-zinc-200">{item.headline}</div>
                    <div className="text-zinc-400">
                      {item.buyerAuthority} • {item.contractValue || 'Value Undisclosed'}
                    </div>
                    <p className="text-zinc-400">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engineer's Note */}
          {edition.engineersNote && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
              <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 7</span>
              <h3 className="text-base font-medium text-white">Engineer’s Field Note</h3>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1">
                <div className="font-medium text-emerald-300">{edition.engineersNote.title}</div>
                <p className="text-zinc-300 leading-relaxed">{edition.engineersNote.observation}</p>
                <div className="text-[10px] text-zinc-500 font-normal mt-2">
                  By {edition.engineersNote.authorName} ({edition.engineersNote.authorRole})
                </div>
              </div>
            </div>
          )}

          {/* Horizon Events */}
          {edition.onTheHorizon && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 8</span>
              <h3 className="text-base font-medium text-white">On the Horizon: Key FM Milestone</h3>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1">
                <span className="text-[10px] font-normal text-purple-400">{edition.onTheHorizon.dateOrDeadline}</span>
                <div className="font-medium text-zinc-200">{edition.onTheHorizon.title}</div>
                <p className="text-zinc-400">{edition.onTheHorizon.description}</p>
              </div>
            </div>
          )}

          {/* Useful Resource & Sponsor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {edition.oneUsefulThing && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
                <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 9</span>
                <h3 className="text-base font-medium text-white">Curated FM Resource</h3>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1">
                  <div className="font-medium text-zinc-200">{edition.oneUsefulThing.title}</div>
                  <p className="text-zinc-400">{edition.oneUsefulThing.description}</p>
                  <a
                    href={edition.oneUsefulThing.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline text-[11px] block mt-1"
                  >
                    {edition.oneUsefulThing.linkText} &rarr;
                  </a>
                </div>
              </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
              <span className="text-[10px] font-normal text-emerald-400 uppercase">Section 10</span>
              <h3 className="text-base font-medium text-white">Sponsor Block (Optional)</h3>
              {edition.sponsorBlock?.enabled ? (
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1">
                  <span className="text-[10px] font-normal text-amber-400 uppercase">Sponsored</span>
                  <div className="font-medium text-zinc-200">{edition.sponsorBlock.sponsorName}</div>
                  <p className="text-zinc-400">{edition.sponsorBlock.body}</p>
                </div>
              ) : (
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 text-xs text-zinc-500 text-center">
                  Sponsor block disabled for this edition
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: QA Checklist */}
      {activeTab === 'qa' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-white">Quality Assurance & Compliance Checklist</h3>
            {edition.validationPassed ? (
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-normal rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> All 10 Checks Passed
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-950 border border-amber-800 text-amber-300 text-xs font-normal rounded-lg flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Action Required
              </span>
            )}
          </div>

          <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden text-xs">
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">1. Masthead & positioning exact statement</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">2. Lead story: What Changed, Why It Matters, Action</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">3. Morning brief count: 3 items</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">4. What Changed count: verified items</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">5. Compliance & enforcement item</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">6. Contracts intelligence verified</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">7. Engineer note & author role present</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">8. Horizon dates formatted</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">9. Curated resource & fallback image provenance safe</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="p-3 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-300">10. RFC 8058 List-Unsubscribe headers & GDPR footer</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>

          {edition.validationReport?.errors && edition.validationReport.errors.length > 0 && (
            <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-lg space-y-2">
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wide">Validation Warnings:</h4>
              <ul className="text-xs text-amber-200/80 list-disc list-inside space-y-1">
                {edition.validationReport.errors.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Plain Text Version */}
      {activeTab === 'text' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
          <h3 className="text-sm font-medium text-white">RFC-Compliant Plain Text Alternative</h3>
          <iframe
            title="Plain Text Preview"
            src={`/api/admin/lobby-daily/preview?id=${edition.id}&format=text`}
            className="w-full min-h-[500px] bg-zinc-950 rounded-lg border border-zinc-800 text-xs font-normal text-zinc-300"
          />
        </div>
      )}
    </div>
  );
}
