'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertTriangle, ChevronRight, QrCode, Camera } from 'lucide-react';

export interface PPMWalkAsset {
  id: string;
  assetReference: string;
  name: string;
  category: string;
  location: string;
  tasks: Array<{
    id: string;
    title: string;
    isMandatory: boolean;
    isCompleted: boolean;
  }>;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_ACCESS' | 'BLOCKED';
  evidenceCount: number;
}

interface PPMWalkModeProps {
  visitId: string;
  workOrderRef: string;
  assets: PPMWalkAsset[];
  onAssetSelect?: (assetId: string) => void;
  onScanQR?: () => void;
}

export function PPMWalkMode({
  visitId: _visitId,
  workOrderRef,
  assets,
  onAssetSelect,
  onScanQR,
}: PPMWalkModeProps) {
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);

  const totalAssets = assets.length;
  const completedAssets = assets.filter((a) => a.status === 'COMPLETED').length;
  const progressPercent = totalAssets > 0 ? Math.round((completedAssets / totalAssets) * 100) : 0;

  const currentAsset = assets[activeAssetIndex];

  return (
    <div className="space-y-6 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5">
      {/* Header with Progress */}
      <div className="flex items-center justify-between border-b border-brand-edge-dark pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-brand-electric/20 px-2 py-0.5 font-mono text-[10px] font-normal text-brand-electric border border-brand-electric/30">
              PPM WALK MODE
            </span>
            <span className="font-mono text-xs text-brand-mist/60">{workOrderRef}</span>
          </div>
          <h2 className="mt-1 text-base font-light text-white">Multi-Asset Maintenance Walk</h2>
        </div>

        <div className="text-right">
          <div className="font-mono text-sm font-normal text-white">
            {completedAssets} / {totalAssets}
          </div>
          <div className="text-[11px] text-brand-mist/50">Assets Done</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-brand-mist/60">
          <span>Walk Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-brand-void border border-brand-edge-dark">
          <div
            className="h-full bg-gradient-to-r from-brand-electric to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Sequential Asset Stepper */}
      {currentAsset && (
        <div className="space-y-4 rounded-lg border border-brand-edge-dark bg-brand-void/50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[11px] text-brand-electric font-light">
                Asset {activeAssetIndex + 1} of {totalAssets}
              </span>
              <h3 className="text-base font-light text-white">{currentAsset.name}</h3>
              <div className="text-xs text-brand-mist/60">
                {currentAsset.assetReference} · {currentAsset.category}
              </div>
              <div className="mt-1 text-xs text-brand-mist/80">📍 {currentAsset.location}</div>
            </div>

            {onScanQR && (
              <button
                onClick={onScanQR}
                className="flex items-center gap-1.5 rounded-lg border border-brand-edge-dark bg-brand-carbon px-3 py-2 text-xs font-normal text-brand-electric hover:border-brand-electric/50"
              >
                <QrCode className="h-4 w-4" />
                Scan Asset
              </button>
            )}
          </div>

          {/* Asset Tasks */}
          <div className="space-y-2 border-t border-brand-edge-dark pt-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-brand-mist/50">
              Maintenance Tasks
            </div>
            {currentAsset.tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded bg-brand-carbon/40 p-2.5 text-xs text-white border border-brand-edge-dark/60"
              >
                <div className="flex items-center gap-2.5">
                  {t.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-brand-mist/40 shrink-0" />
                  )}
                  <span>{t.title}</span>
                </div>
                {t.isMandatory && (
                  <span className="rounded bg-red-950/40 px-1.5 py-0.5 text-[9.5px] font-mono text-red-300 border border-red-900/40">
                    Mandatory
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-brand-edge-dark pt-3">
            <button
              onClick={() => setActiveAssetIndex(Math.max(0, activeAssetIndex - 1))}
              disabled={activeAssetIndex === 0}
              className="rounded border border-brand-edge-dark bg-brand-carbon px-3 py-1.5 text-xs font-normal text-brand-mist hover:text-white disabled:opacity-30"
            >
              ← Previous Asset
            </button>

            <button
              onClick={() => setActiveAssetIndex(Math.min(totalAssets - 1, activeAssetIndex + 1))}
              disabled={activeAssetIndex === totalAssets - 1}
              className="flex items-center gap-1 rounded bg-brand-electric px-3.5 py-1.5 text-xs font-normal text-white hover:bg-brand-indigo disabled:opacity-30"
            >
              Next Asset →
            </button>
          </div>
        </div>
      )}

      {/* Asset Overview List */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-brand-mist/50">
          All Walk Assets
        </div>
        <div className="divide-y divide-brand-edge-dark/60 rounded-lg border border-brand-edge-dark bg-brand-void/30">
          {assets.map((asset, idx) => (
            <div
              key={asset.id}
              onClick={() => {
                setActiveAssetIndex(idx);
                onAssetSelect?.(asset.id);
              }}
              className={`flex items-center justify-between p-3 text-xs transition cursor-pointer hover:bg-brand-carbon/30 ${idx === activeAssetIndex ? 'bg-brand-carbon/50 border-l-2 border-l-brand-electric' : ''}`}
            >
              <div className="flex items-center gap-3">
                {asset.status === 'COMPLETED' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : asset.status === 'NO_ACCESS' ? (
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                ) : (
                  <Circle className="h-4 w-4 text-brand-mist/30" />
                )}
                <div>
                  <div className="font-light text-white">{asset.name}</div>
                  <div className="text-[11px] text-brand-mist/50">{asset.assetReference} · {asset.location}</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-brand-mist/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
