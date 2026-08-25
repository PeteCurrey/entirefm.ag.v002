'use client';

import React from 'react';
import {
  Building,
  Layers,
  Wrench,
  Calendar,
  ShieldCheck,
  FileText,
  Users,
  Zap,
  DollarSign,
  History,
  LayoutDashboard,
} from 'lucide-react';

export type BuildingNavTab =
  | 'overview'
  | 'spaces'
  | 'assets'
  | 'work'
  | 'ppm'
  | 'compliance'
  | 'documents'
  | 'people'
  | 'energy'
  | 'costs'
  | 'history';

interface BuildingNavPaletteProps {
  activeTab: BuildingNavTab;
  onChangeTab: (tab: BuildingNavTab) => void;
  counts?: {
    spaces?: number;
    assets?: number;
    work?: number;
    compliance?: number;
    documents?: number;
  };
}

export function BuildingNavPalette({
  activeTab,
  onChangeTab,
  counts,
}: BuildingNavPaletteProps) {
  const tabs: Array<{
    id: BuildingNavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'spaces', label: 'Spaces & Zones', icon: Building, count: counts?.spaces },
    { id: 'assets', label: 'Assets', icon: Layers, count: counts?.assets },
    { id: 'work', label: 'Work Orders', icon: Wrench, count: counts?.work },
    { id: 'ppm', label: 'PPM Schedule', icon: Calendar },
    { id: 'compliance', label: 'Compliance Vault', icon: ShieldCheck, count: counts?.compliance },
    { id: 'documents', label: 'Documents & O&M', icon: FileText, count: counts?.documents },
    { id: 'people', label: 'Key Contacts', icon: Users },
    { id: 'energy', label: 'Energy & Meters', icon: Zap },
    { id: 'costs', label: 'Commercial Ledger', icon: DollarSign },
    { id: 'history', label: 'Audit Trail', icon: History },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)] cafm-scroll">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[7px] px-3 py-1.5 text-[12px] font-normal transition-all ${
              isActive
                ? 'bg-[#FF6B24] text-white shadow-sm font-light'
                : 'text-[#686866] hover:bg-[#F5F5F3] hover:text-[#101010]'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1 rounded-[4px] px-1 py-0.2 font-mono text-[9.5px] ${
                  isActive ? 'bg-white/25 text-white' : 'bg-[#F0F0EE] text-[#686866]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
