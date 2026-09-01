'use client';

import React from 'react';
import { Asset } from '@/server/estate';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Layers, Wrench, ShieldCheck, Activity, Calendar, History, FileText } from 'lucide-react';
import Link from 'next/link';

interface Asset360InspectorProps {
  asset: Asset | null;
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
      subtitle={asset.asset_reference}
      badge={
        <Badge
          variant={asset.criticality === 'CRITICAL' ? 'red' : 'blue'}
          size="xs"
        >
          {asset.criticality || 'STANDARD'} CRITICALITY
        </Badge>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] px-3 py-1.5 text-[12px] font-normal text-[#101010]"
          >
            Close Inspector
          </button>
          <Link
            href={`/admin/operations/work-orders?assetId=${asset.id}`}
            className="rounded-[6px] bg-[#FF6B24] px-3.5 py-1.5 text-[12px] font-normal text-white shadow-sm hover:bg-[#E9540F] transition-colors"
          >
            Create Work Order
          </Link>
        </div>
      }
    >
      <div className="space-y-6 text-[12.5px]">
        {/* Technical Specs Card */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-[#F9F9F8] p-4 space-y-3">
          <h4 className="text-[10.5px] uppercase tracking-wider text-[#686866] font-light">
            NAMEPLATE & SPECIFICATION
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Manufacturer</span>
              <span className="font-medium text-[#101010]">
                {asset.manufacturer || '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Model Number</span>
              <span className="font-normal text-[#101010]">
                {asset.model_number || '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Serial Number</span>
              <span className="font-normal text-[#101010]">
                {asset.serial_number || '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Operating State</span>
              <Badge variant={asset.status === 'IN_SERVICE' ? 'green' : 'neutral'} size="xs">
                {asset.status ? asset.status.replace(/_/g, ' ') : 'REGISTERED'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Condition & Lifecycle */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 space-y-3">
          <h4 className="text-[10.5px] uppercase tracking-wider text-[#686866] font-light">
            CONDITION & LIFECYCLE
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Condition Grade</span>
              <span className="font-normal text-[#101010]">{asset.condition || 'UNASSESSED'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#9B9B97] block">Install Date</span>
              <span className="font-normal text-[#101010]">{asset.install_date || '—'}</span>
            </div>
          </div>
        </div>

        {/* Chronological Maintenance History */}
        <div className="space-y-3">
          <h4 className="text-[10.5px] uppercase tracking-wider text-[#686866] font-light">
            SERVICE RECORD & AUDIT
          </h4>
          <div className="rounded-[8px] bg-[#F9F9F8] border border-[#E4E4E1] p-3 text-[#686866] text-center text-[12px]">
            No historical work orders on file for this unit.
          </div>
        </div>
      </div>
    </Drawer>
  );
}
