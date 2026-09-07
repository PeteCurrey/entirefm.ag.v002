'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Printer,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  Save,
  Plus,
  Trash2,
  Building,
  Wrench,
  Package,
} from 'lucide-react';
import { QuoteLine } from '@/server/commercial';

interface Props {
  quote: any;
  engineerName: string;
}

export function EngineerQuoteReviewClient({ quote: initialQuote, engineerName }: Props) {
  const router = useRouter();
  const [quote, setQuote] = useState<any>(initialQuote);
  const [lines, setLines] = useState<QuoteLine[]>(initialQuote.lines || []);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [changeReason, setChangeReason] = useState('Engineer on-site review & adjustment');

  // Handle updating line item quantity or unit price
  const handleLineChange = (index: number, field: keyof QuoteLine, value: any) => {
    const updated = [...lines];
    const current = { ...updated[index], [field]: value };
    const qty = Number(current.quantity) || 1;
    const price = Number(current.unit_price_gbp) || 0;
    current.total_gbp = Math.round((qty * price + Number.EPSILON) * 100) / 100;
    updated[index] = current;
    setLines(updated);
  };

  const handleRemoveLine = (index: number) => {
    setLines(lines.filter((_, idx) => idx !== index));
  };

  const handleSaveRevision = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/engineer/talk-to-quote/quote/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines,
          changeReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update quotation');
      }

      setQuote((prev: any) => ({
        ...prev,
        version: data.version,
        subtotal_gbp: data.subtotal,
        tax_amount_gbp: data.taxAmount,
        total_amount_gbp: data.totalGross,
      }));

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const isFreeIssue = (l: any) => {
    const notes = (l.pricing_notes || '').toLowerCase();
    const desc = (l.description || '').toLowerCase();
    return (
      notes.includes('van stock') ||
      notes.includes('free issue') ||
      notes.includes('client supply') ||
      notes.includes('foc') ||
      notes.includes('zero rate') ||
      desc.includes('van stock') ||
      desc.includes('free issue') ||
      desc.includes('client supply') ||
      desc.includes('foc')
    );
  };

  const unpricedLines = lines.filter(
    (l) => (l.is_missing_rate === true || Number(l.unit_price_gbp) === 0) && !isFreeIssue(l)
  );
  const hasUnpricedItems = unpricedLines.length > 0;

  const handleDeploy = async (deployToClient: boolean) => {
    setIsDeploying(true);
    setError(null);

    try {
      const res = await fetch(`/api/engineer/talk-to-quote/quote/${quote.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployToClient,
          notes: `Approved by on-site engineer ${engineerName}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 422 && data.unpricedLines) {
          const names = data.unpricedLines.map((u: any) => u.description).join(', ');
          throw new Error(`Commercial Guardrail: Missing rates on [${names}]. Submit for Ops Review or enter unit prices.`);
        }
        throw new Error(data.error || 'Failed to deploy quotation');
      }

      setDeploySuccess(data.message);
      setQuote((prev: any) => ({ ...prev, internal_status: data.status, status: data.status }));
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeploying(false);
    }
  };

  const subtotal = lines.reduce((sum, l) => sum + (Number(l.total_gbp) || 0), 0);
  const vat = Math.round((subtotal * 0.2 + Number.EPSILON) * 100) / 100;
  const total = Math.round((subtotal + vat + Number.EPSILON) * 100) / 100;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
                COMMERCIAL QUOTATION REVIEW
              </span>
              <span className="bg-brand-void px-2 py-0.5 rounded text-[10px] text-white border border-brand-edge-dark">
                {quote.internal_status || quote.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">{quote.quote_number}</h1>
            <p className="text-xs text-brand-mist/70 mt-0.5">
              Client: <strong className="text-white">{quote.client?.name || 'Client Account'}</strong> &bull; Site:{' '}
              <strong className="text-white">{quote.site?.name || 'Site'}</strong>
            </p>
          </div>

          <a
            href={`/api/engineer/talk-to-quote/quote/${quote.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-electric/15 hover:bg-brand-electric/25 border border-brand-electric/30 text-brand-electric-bright px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" /> Branded PDF
          </a>
        </div>
      </div>

      {hasUnpricedItems && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-300 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-amber-200">Commercial Safety Guardrail: Unpriced Line Items</span>
            <span>
              {unpricedLines.length} line item(s) require verified catalogue pricing. Direct client issuance is blocked until rates are set. You may still submit for Operations Review.
            </span>
          </div>
        </div>
      )}

      {deploySuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{deploySuccess}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Scope Narrative */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist">Scope of Works</h3>
        <p className="text-xs text-white/90 bg-brand-void p-3 rounded-xl border border-brand-edge-dark leading-relaxed">
          {quote.scope_description || 'Standard remedial works.'}
        </p>
      </div>

      {/* Line Items Schedule (Editable) */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist">
            Line Items &amp; Rate Card Application ({lines.length})
          </h3>
          <span className="text-[10.5px] text-brand-mist/60 italic">Adjust quantity or unit price as needed</span>
        </div>

        <div className="space-y-3">
          {lines.map((line, idx) => {
            const lineIsUnpriced = (line.is_missing_rate === true || Number(line.unit_price_gbp) === 0) && !isFreeIssue(line);
            return (
              <div
                key={idx}
                className={`border rounded-xl p-3.5 space-y-2.5 text-xs transition-colors ${
                  lineIsUnpriced
                    ? 'bg-amber-500/5 border-amber-500/40'
                    : 'bg-brand-void border-brand-edge-dark'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9.5px] uppercase font-bold text-brand-electric-bright block">
                        {line.line_type}
                      </span>
                      {lineIsUnpriced && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1.5 py-0.2 rounded font-bold">
                          RATE REQUIRED (£0.00)
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => handleLineChange(idx, 'description', e.target.value)}
                      className="w-full bg-transparent text-xs text-white font-medium focus:outline-none border-b border-transparent focus:border-brand-electric"
                    />
                    {line.pricing_notes && (
                      <div className="text-[10px] text-brand-mist/50 mt-0.5">{line.pricing_notes}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    className="text-brand-mist/40 hover:text-rose-400 p-1 transition-colors"
                    title="Remove Line"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-brand-edge-dark/60">
                  <div>
                    <span className="text-[9.5px] text-brand-mist/40 uppercase block">Qty</span>
                    <input
                      type="number"
                      step="0.5"
                      value={line.quantity}
                      onChange={(e) => handleLineChange(idx, 'quantity', Number(e.target.value))}
                      className="w-full bg-brand-carbon border border-brand-edge-dark rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[9.5px] text-brand-mist/40 uppercase block">Unit Price (£)</span>
                    <input
                      type="number"
                      step="0.01"
                      value={line.unit_price_gbp}
                      onChange={(e) => handleLineChange(idx, 'unit_price_gbp', Number(e.target.value))}
                      className={`w-full border rounded px-2 py-1 text-xs text-white ${
                        lineIsUnpriced
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-200'
                          : 'bg-brand-carbon border-brand-edge-dark'
                      }`}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-[9.5px] text-brand-mist/40 uppercase block">Total (£)</span>
                    <div className="text-xs font-bold text-white pt-1">
                      £{(Number(line.total_gbp) || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals Breakdown */}
        <div className="bg-brand-void/80 border border-brand-edge-dark rounded-xl p-3.5 space-y-1.5 text-xs">
          <div className="flex justify-between text-brand-mist">
            <span>Subtotal (Net ex VAT):</span>
            <span className="font-semibold text-white">£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-brand-mist">
            <span>VAT (20.0%):</span>
            <span className="font-semibold text-white">£{vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-brand-edge-dark">
            <span>Total (Gross):</span>
            <span className="text-brand-electric-bright">£{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Save Version Revision Button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            placeholder="Reason for revision..."
            className="flex-1 bg-brand-void border border-brand-edge-dark rounded-xl px-3 py-2 text-xs text-white placeholder-brand-mist/40"
          />
          <button
            type="button"
            onClick={handleSaveRevision}
            disabled={isSaving}
            className="bg-brand-carbon hover:bg-brand-void border border-brand-edge-dark text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Revision
          </button>
        </div>
      </div>

      {/* Deploy / Submission Action Card */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist">Commercial Deployment</h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleDeploy(false)}
            disabled={isDeploying}
            className="bg-brand-void hover:bg-brand-carbon border border-brand-edge-dark hover:border-brand-electric/50 text-white rounded-xl py-3 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            Submit for Ops Review
          </button>

          <button
            type="button"
            onClick={() => handleDeploy(true)}
            disabled={isDeploying || hasUnpricedItems}
            title={hasUnpricedItems ? 'Cannot deploy directly to client with unpriced lines (£0.00)' : 'Deploy and issue quote directly to client'}
            className={`rounded-xl py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-colors ${
              hasUnpricedItems
                ? 'bg-brand-mist/20 text-brand-mist/40 cursor-not-allowed border border-brand-edge-dark'
                : 'bg-brand-electric hover:bg-brand-indigo text-white shadow-brand-electric/25'
            } disabled:opacity-50`}
          >
            {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Deploy &amp; Issue Quote
          </button>
        </div>
        {hasUnpricedItems && (
          <p className="text-[11px] text-amber-300/80 text-center">
            * Direct client issuance is locked because rate card prices are required for {unpricedLines.length} item(s).
          </p>
        )}
      </div>
    </div>
  );
}
