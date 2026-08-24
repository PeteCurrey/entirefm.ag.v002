'use client';

import React from 'react';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Layers, Wrench, ShieldCheck, Activity, Calendar, History, FileText, CheckCircle2 } from 'lucide-react';

export interface AssetDetail {
  id: string;
  assetReference: string;
  name: string;
  category: string;
  manufacturer: string;
  modelNumber: string;
  serialNumber: string;
  location: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  installDate: string;
  expectedLifeYears: number;
  status: 'IN_SERVICE' | 'STANDBY' | 'UNDER_REPAIR' | 'OUT_OF_SERVICE';
}

interface Asset360InspectorProps {
  asset: AssetDetail | null;
  open: boolean;
  onClose: () => void;
}

export function Asset360Inspector({ asset, open, onClose }: Asset360InspectorProps) {
  if (!asset) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="lg"
      title={asset.name}
      subtitle={`${asset.assetReference} · ${asset.location}`}
      badge={
        <Badge
          variant={asset.criticality === 'CRITICAL' ? 'red' : 'orange'}
          size="xs"
        >
          {asset.criticality} CRITICALITY
        </Badge>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] px-3 py-1.5 text-[12px] font-medium text-[#101010]"
          >
            Close Inspector
          </button>
          <button
            onClick={() => {
              window.location.href = `/admin/operations/work-orders?assetId=${asset.id}`;
            }}
            className="rounded-[6px] bg-[#FF6B24] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-sm"
          >
            Create Work Order
          </button>
        </div>
      }
    >
      <div className="space-y-6 text-[12.5px]">
        {/* Technical Specs Card */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-[#F9F9F8] p-4 space-y-3">
          <h4 className="font-mono text-[10.5px] uppercase tracking-wider text-[#686866] font-semibold">
            NAMEPLATE & SPECIFICATION
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Manufacturer</span>
              <span className="font-medium text-[#101010]">{asset.manufacturer}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Model Number</span>
              <span className="font-mono text-[#101010]">{asset.modelNumber}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Serial Number</span>
              <span className="font-mono text-[#101010]">{asset.serialNumber}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Operating State</span>
              <Badge variant="green" size="xs">{asset.status.replace(/_/g, ' ')}</Badge>
            </div>
          </div>
        </div>

        {/* Chronological Maintenance History */}
        <div className="space-y-3">
          <h4 className="font-mono text-[10.5px] uppercase tracking-wider text-[#686866] font-semibold">
            IMMUTABLE ASSET SERVICE HISTORY
          </h4>
          <div className="relative pl-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-[#E4E4E1] space-y-3">
            <div className="relative">
              <div className="absolute -left-5 top-1 h-2 w-2 rounded-full bg-[#15803D] border-2 border-white" />
              <div className="font-medium text-[#101010]">Quarterly SFG20 PPM Service Passed</div>
              <div className="font-mono text-[10.5px] text-[#9B9B97]">14 Aug 2026 · Marcus Vance</div>
            </div>
            <div className="relative">
              <div className="absolute -left-5 top-1 h-2 w-2 rounded-full bg-[#FF6B24] border-2 border-white" />
              <div className="font-medium text-[#101010]">Primary Contactor Relay Replacement</div>
              <div className="font-mono text-[10.5px] text-[#9B9B97]">02 May 2026 · Reactive Call-out</div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
