import React from 'react';
import { listAIAgents, listAIActions, listAIRuns } from '@/server/ai';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function AIControlPage() {
  const [agents, pendingActions, recentRuns] = await Promise.all([
    listAIAgents(),
    listAIActions('PENDING_APPROVAL'),
    listAIRuns(10),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="AI & Automation"
        title="AI Control Centre & Autonomy Policies"
        description="Autonomous and assist agent governance, tool permissions, confidence thresholds, and human override queues."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Agents Card */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
              Registered Agents ({agents.length})
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {agents.length > 0 ? (
              agents.map((ag) => (
                <div key={ag.id} className="rounded border border-brand-edge-dark bg-brand-void p-3 text-[12.5px]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{ag.name}</span>
                    <span className="rounded bg-purple-500/20 px-1.5 py-0.2 font-mono text-[9px] text-purple-300">
                      {ag.autonomy_level}
                    </span>
                  </div>
                  <div className="mt-1 text-[11.5px] text-brand-mist/60">{ag.role_description}</div>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-brand-mist/50">
                Core AI agents (Helpdesk Intake, SLA Predictor, Contractor Dispatch Ranker) are governed under ASSIST policy.
              </p>
            )}
          </div>
        </div>

        {/* Pending Human Approvals */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
              Human Override & Approval Queue
            </h2>
          </div>
          <div className="mt-4">
            {pendingActions.length > 0 ? (
              <div className="space-y-2">
                {pendingActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between rounded border border-brand-edge-dark bg-brand-void p-3 text-[12.5px]">
                    <div>
                      <div className="font-medium text-white">{action.action_type}</div>
                      <div className="text-[11.5px] text-brand-mist/50">Agent: {action.agent?.name}</div>
                    </div>
                    <button className="rounded bg-brand-electric px-3 py-1 text-[11px] font-medium text-white hover:bg-brand-indigo">
                      Review & Approve
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded border border-dashed border-brand-edge-dark/60 p-6 text-center text-[12.5px] text-brand-mist/50">
                <p className="font-medium text-brand-mist/70">Governance Queue Clear</p>
                <p className="mt-1 text-[11.5px]">
                  No AI actions are pending human authorization. Uncontrolled external actions are blocked by policy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
