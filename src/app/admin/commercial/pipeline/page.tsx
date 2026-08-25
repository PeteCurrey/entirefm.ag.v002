import { Metadata } from 'next';
import Link from 'next/link';
import { listOpportunities, PipelineStage } from '@/server/commercial/pipeline';
import { Briefcase, Plus, Filter, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'Commercial Pipeline & Deals | EntireFM Admin' };

export default async function PipelinePage() {
  const opps = await listOpportunities();

  const stages: { stage: PipelineStage; label: string; color: string }[] = [
    { stage: 'QUALIFIED', label: '1. Qualified', color: 'border-zinc-700 text-zinc-300' },
    { stage: 'DISCOVERY', label: '2. Discovery & Scope', color: 'border-blue-700 text-blue-300' },
    { stage: 'SITE_SURVEY', label: '3. Site Survey', color: 'border-purple-700 text-purple-300' },
    { stage: 'PROPOSAL_PREPARATION', label: '4. Proposal Preparation', color: 'border-amber-700 text-amber-300' },
    { stage: 'PROPOSAL_SENT', label: '5. Proposal Sent', color: 'border-pink-700 text-pink-300' },
    { stage: 'NEGOTIATION', label: '6. Negotiation', color: 'border-indigo-700 text-indigo-300' },
    { stage: 'WON', label: '7. Won & Mobilisation', color: 'border-emerald-700 text-emerald-300' },
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-light">
            COMMERCIAL PIPELINE &amp; DEAL STAGES
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Commercial Pipeline Board</h1>
          <p className="text-sm text-zinc-400">
            Dense, multi-stage view of all active FM proposals, tenders, and mobilisation handoffs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/commercial"
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
          >
            ← Commercial Overview
          </Link>
        </div>
      </div>

      {/* Pipeline Stage Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map(({ stage, label, color }) => {
          const stageOpps = opps.filter((o) => o.stage === stage);
          const stageValue = stageOpps.reduce((acc, o) => acc + (o.estimated_value_gbp || 0), 0);

          return (
            <div key={stage} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                <span className={`text-xs font-normal uppercase font-mono ${color}`}>
                  {label} ({stageOpps.length})
                </span>
                {stageValue > 0 && (
                  <span className="text-[11px] font-mono text-zinc-400">
                    £{stageValue.toLocaleString()}
                  </span>
                )}
              </div>

              {stageOpps.length === 0 ? (
                <div className="py-8 text-center text-zinc-600 text-xs font-mono">
                  No deals
                </div>
              ) : (
                <div className="space-y-2">
                  {stageOpps.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1.5 hover:border-pink-500/40 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-light text-white leading-snug">{opp.company}</span>
                        {opp.estimated_value_gbp && (
                          <span className="text-[11px] font-mono text-pink-400 font-light whitespace-nowrap">
                            £{opp.estimated_value_gbp.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1">
                        {opp.service} · {opp.location}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900 font-mono">
                        <span>Owner: {opp.owner}</span>
                        {opp.mobilisation_status === 'HANDED_OFF' && (
                          <span className="text-emerald-400 font-light">✓ MOBILISED</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
