import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getModelRegistry, getModelVersionsByModel } from '@/server/predictive';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-brand-mist/10 text-brand-mist/50 border border-brand-edge-dark',
  VALIDATING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  SHADOW: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  ASSIST: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  APPROVED: 'bg-green-500/10 text-green-400 border border-green-500/20',
  RETIRED: 'bg-brand-mist/10 text-brand-mist/40 border border-brand-edge-dark',
  REJECTED: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  VALIDATING: 'Validating',
  SHADOW: 'Shadow — Not Operationally Approved',
  ASSIST: 'Assist — Requires Human Review',
  APPROVED: 'Approved',
  RETIRED: 'Retired',
  REJECTED: 'Rejected',
};

export default async function ModelsPage() {
  const session = await getCurrentSession();

  let models: Awaited<ReturnType<typeof getModelRegistry>> = [];
  let error: string | null = null;

  try {
    models = await getModelRegistry();
  } catch (e: any) {
    error = e.message;
  }

  // Fetch latest version for each model
  const modelVersions: Record<string, Awaited<ReturnType<typeof getModelVersionsByModel>>> = {};
  for (const model of models) {
    try {
      modelVersions[model.id] = await getModelVersionsByModel(model.id);
    } catch {
      modelVersions[model.id] = [];
    }
  }

  const shadowModels = models.filter(m => modelVersions[m.id]?.[0]?.status === 'SHADOW');
  const assistModels = models.filter(m => modelVersions[m.id]?.[0]?.status === 'ASSIST');

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate & Assets"
        title="Predictive Model Registry"
        description="Shadow and assist predictive models. Maximum autonomous authority is ASSIST — all predictions require human review before action. SHADOW → ASSIST requires documented human approval."
        action={
          <div className="flex items-center gap-3">
            <a
              href="/admin/estate/assets/reliability"
              className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-3.5 py-1.5 text-[12.5px] font-normal text-brand-mist/80 hover:bg-brand-carbon hover:text-white"
            >
              Reliability
            </a>
            <a
              href="/admin/estate/assets"
              className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo"
            >
              All Assets
            </a>
          </div>
        }
      />

      {error && (
        <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Error loading model registry: {error}
        </div>
      )}

      {/* Governance banner */}
      <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-4 py-4 space-y-1">
        <p className="text-sm font-semibold text-orange-300">Governance Constraints — Phase 0L</p>
        <ul className="text-xs text-orange-200/70 space-y-1 leading-relaxed">
          <li>• Maximum model authority: <strong>ASSIST</strong>. No autonomous work order creation.</li>
          <li>• SHADOW → ASSIST promotion requires a documented human approval record.</li>
          <li>• No automatic PPM frequency changes from model output.</li>
          <li>• Compliance obligations cannot be overridden by model predictions.</li>
          <li>• If no validated model exists, CEO Command responds with deterministic anomaly indicators only.</li>
          <li>• SHADOW model predictions are labelled <em>"SHADOW — NOT OPERATIONALLY APPROVED"</em> everywhere.</li>
        </ul>
      </div>

      {/* Status summary */}
      {models.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-brand-edge-dark bg-brand-surface p-4">
            <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Total Models</p>
            <p className="mt-1 text-2xl font-semibold text-white">{models.length}</p>
          </div>
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Shadow</p>
            <p className="mt-1 text-2xl font-semibold text-yellow-400">{shadowModels.length}</p>
          </div>
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Assist</p>
            <p className="mt-1 text-2xl font-semibold text-orange-400">{assistModels.length}</p>
          </div>
        </div>
      )}

      {models.length === 0 && !error && (
        <EmptyState
          title="No Predictive Models Registered"
          description="No predictive models have been registered yet. Models begin in DRAFT state and must progress through VALIDATING → SHADOW before any predictions are generated. SHADOW → ASSIST requires explicit human approval."
        />
      )}

      {/* Model list */}
      {models.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-brand-mist/70">Registered Models</h3>
          {models.map((model) => {
            const versions = modelVersions[model.id] ?? [];
            const latestVersion = versions[0];
            const status = latestVersion?.status ?? 'DRAFT';
            return (
              <div
                key={model.id}
                className="rounded-lg border border-brand-edge-dark bg-brand-surface px-4 py-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{model.name}</p>
                    {model.description && (
                      <p className="text-xs text-brand-mist/60">{model.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-[10px] text-brand-mist/40">
                      {model.asset_class && <span>Asset class: <span className="text-brand-mist/60">{model.asset_class}</span></span>}
                      <span>Target: <span className="text-brand-mist/60">{model.target}</span></span>
                      {model.algorithm && <span>Algorithm: <span className="text-brand-mist/60">{model.algorithm}</span></span>}
                      {model.owner && <span>Owner: <span className="text-brand-mist/60">{model.owner}</span></span>}
                    </div>
                  </div>
                  <div>
                    <span className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status] ?? ''}`}>
                      {STATUS_LABELS[status] ?? status}
                    </span>
                  </div>
                </div>

                {/* Version history */}
                {versions.length > 0 && (
                  <div className="border-t border-brand-edge-dark pt-3">
                    <p className="text-[10px] uppercase tracking-wider text-brand-mist/40 mb-2">Version History</p>
                    <div className="space-y-1">
                      {versions.slice(0, 5).map((v) => (
                        <div key={v.id} className="flex items-center gap-3 text-xs text-brand-mist/60">
                          <span className="font-normal text-[10px]">v{v.version}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${STATUS_STYLES[v.status] ?? ''}`}>
                            {v.status}
                          </span>
                          {v.validation_metrics && (
                            <>
                              <span>P={v.validation_metrics.precision.toFixed(3)}</span>
                              <span>R={v.validation_metrics.recall.toFixed(3)}</span>
                              <span>F1={v.validation_metrics.f1.toFixed(3)}</span>
                              <span>Imbalance={v.validation_metrics.class_imbalance_ratio.toFixed(1)}:1</span>
                            </>
                          )}
                          {v.shadow_started_at && (
                            <span className="text-brand-mist/30">Shadow since {new Date(v.shadow_started_at).toLocaleDateString('en-GB')}</span>
                          )}
                          {v.assist_started_at && (
                            <span className="text-brand-mist/30">Assist since {new Date(v.assist_started_at).toLocaleDateString('en-GB')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
