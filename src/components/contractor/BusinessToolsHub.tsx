'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Percent,
  Clock,
  Car,
  Users,
  CalendarDays,
  FileText,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { BusinessToolsCalculators } from './BusinessToolsCalculators';
import { QuoteBuilderClient } from './QuoteBuilderClient';
import { PpmPlannerClient } from './PpmPlannerClient';

type HubSection = 'CALCULATORS' | 'QUOTE' | 'PPM';

interface NavItem {
  id: HubSection;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'CALCULATORS',
    label: 'Pricing Calculators',
    sublabel: 'Labour Rate, Job Margin, Call-Out, Travel, Utilisation & VAT',
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    id: 'QUOTE',
    label: 'Quote Builder',
    sublabel: 'Professional structured quotations with internal cost view',
    icon: <FileText className="w-5 h-5" />,
    badge: 'NEW',
  },
  {
    id: 'PPM',
    label: 'PPM Planner',
    sublabel: '12-month planned maintenance schedule generator',
    icon: <CalendarDays className="w-5 h-5" />,
    badge: 'NEW',
  },
];

export function BusinessToolsHub() {
  const [activeSection, setActiveSection] = useState<HubSection>('CALCULATORS');

  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`rounded-xl border p-4 text-left flex items-start gap-3 transition-all ${
              activeSection === item.id
                ? 'border-brand-electric bg-brand-electric/5 shadow-lg shadow-brand-electric/10'
                : 'border-brand-edge-dark bg-brand-carbon hover:border-brand-mist/30'
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${activeSection === item.id ? 'text-brand-electric' : 'text-brand-mist/40'}`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${activeSection === item.id ? 'text-white' : 'text-brand-mist/80'}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-electric/20 text-brand-electric-bright font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[10.5px] text-brand-mist/50 mt-0.5 font-light leading-snug">{item.sublabel}</p>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${activeSection === item.id ? 'text-brand-electric' : 'text-brand-edge-dark'}`} />
          </button>
        ))}
      </div>

      {/* Active Content */}
      {activeSection === 'CALCULATORS' && <BusinessToolsCalculators />}
      {activeSection === 'QUOTE' && <QuoteBuilderClient />}
      {activeSection === 'PPM' && <PpmPlannerClient />}
    </div>
  );
}
