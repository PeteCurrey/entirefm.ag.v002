import React from 'react';
import Link from 'next/link';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function TalkToQuoteDeskPage() {
  // Fetch pending field quote scopes
  const { data: scopes } = await dbQuery<any[]>(
    'field_quote_scopes?order=created_at.desc&limit=20'
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title="Talk-to-Quote Intake Desk"
        description="Transform engineer field observations and voice recordings into verified, deterministic commercial quotes."
        action={
          <div className="flex items-center gap-3">
            <span className="rounded bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-400 border border-emerald-500/20">
              ● TALK_TO_QUOTE_AGENT: ASSIST
            </span>
            <Link
              href="/admin/commercial/quotes"
              className="rounded bg-brand-carbon px-3 py-1.5 text-[12px] font-medium text-brand-mist/80 border border-brand-edge-dark hover:text-white"
            >
              All Quotes →
            </Link>
          </div>
        }
      />

      {/* Overview Banner */}
      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/30 p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-md bg-brand-electric/15 p-2.5 text-brand-electric-bright">
            🎤
          </div>
          <div>
            <h3 className="font-mono text-[13px] font-semibold text-white">
              AI Field Scope Structuring & Rate Matching
            </h3>
            <p className="mt-1 text-[12.5px] text-brand-mist/80 leading-relaxed">
              Field scopes captured via mobile voice notes are transcribed and structured here. The commercial engine automatically checks rate card hierarchies, cross-references material catalogues, and flags missing or stale prices without hallucinating costs.
            </p>
          </div>
        </div>
      </div>

      {/* Scopes Intake Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-[12px] uppercase tracking-wider text-brand-mist/60">
            Incoming Field Quote Scopes ({scopes?.length || 0})
          </h3>
        </div>

        {scopes && scopes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {scopes.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-4 hover:border-brand-electric/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded bg-brand-electric/15 px-2 py-0.5 font-mono text-[10.5px] text-brand-electric-bright">
                      Scope Ref: {s.id.slice(0, 8)}
                    </span>
                    <h4 className="mt-2 text-[13px] font-medium text-white">
                      {s.scope_description || 'Field remedial recommendation'}
                    </h4>
                  </div>
                  <span className="font-mono text-[11px] text-brand-mist/40">
                    {new Date(s.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded border border-brand-edge-dark/60 bg-brand-void/30 p-3 text-[11.5px] font-mono">
                  <div>
                    <span className="text-brand-mist/40 block text-[10px]">Labour Est</span>
                    <span className="text-white font-medium">{s.labour_estimated_hours || 2}h ({s.labour_engineers_count || 1} eng)</span>
                  </div>
                  <div>
                    <span className="text-brand-mist/40 block text-[10px]">Materials</span>
                    <span className="text-white font-medium">{s.materials_items_json?.length || 0} item(s)</span>
                  </div>
                  <div>
                    <span className="text-brand-mist/40 block text-[10px]">AI Confidence</span>
                    <span className="text-emerald-400 font-medium">{(Number(s.ai_confidence_score || 0.85) * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-brand-edge-dark/50">
                  <span className="font-mono text-[10.5px] text-brand-mist/50">
                    Status: {s.status || 'DRAFT'}
                  </span>
                  <Link
                    href={`/admin/commercial/quotes?status=DRAFT`}
                    className="rounded bg-brand-electric px-3 py-1 text-[11.5px] font-medium text-white hover:bg-brand-indigo shadow-sm"
                  >
                    Build Quote Draft →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Pending Field Scopes"
            description="Field engineers will submit voice-guided remedial scopes from the mobile engineer app."
            actionText="View Active Quotes"
            actionHref="/admin/commercial/quotes"
          />
        )}
      </div>
    </div>
  );
}
