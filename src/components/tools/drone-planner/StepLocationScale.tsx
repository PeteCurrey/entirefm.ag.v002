'use client';

import React from 'react';
import { SITE_SCALES, PlannerSiteInput } from '@/config/dronePlanner';
import { MapPin, Building, Check } from 'lucide-react';

interface StepLocationScaleProps {
  site: PlannerSiteInput;
  onChange: (updated: Partial<PlannerSiteInput>) => void;
}

export function StepLocationScale({ site, onChange }: StepLocationScaleProps) {
  return (
    <div className="space-y-8">
      {/* Location Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Where is the site located?
          </h2>
          <p className="text-sm text-slate-300">
            Provide the site name or town/postcode to help us evaluate local airspace and regional flight planning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1 space-y-1.5">
            <label htmlFor="siteName" className="block text-xs font-light uppercase text-slate-300">
              Site / Building Name (Optional)
            </label>
            <input
              id="siteName"
              type="text"
              value={site.siteName || ''}
              onChange={(e) => onChange({ siteName: e.target.value })}
              placeholder="e.g. Victoria Point Tower"
              className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div className="sm:col-span-1 space-y-1.5">
            <label htmlFor="siteCity" className="block text-xs font-light uppercase text-slate-300">
              Town / City <span className="text-brand-pink">*</span>
            </label>
            <input
              id="siteCity"
              type="text"
              value={site.city || ''}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="e.g. Birmingham, Manchester, London"
              className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div className="sm:col-span-1 space-y-1.5">
            <label htmlFor="sitePostcode" className="block text-xs font-light uppercase text-slate-300">
              Postcode (Optional)
            </label>
            <input
              id="sitePostcode"
              type="text"
              value={site.postcode || ''}
              onChange={(e) => onChange({ postcode: e.target.value.toUpperCase() })}
              placeholder="e.g. B1 1BB / M1 2WD"
              className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs sm:text-sm text-white uppercase focus:outline-none focus:border-brand-pink"
            />
          </div>
        </div>
      </div>

      {/* Scale Section */}
      <div className="space-y-4 pt-4 border-t border-brand-edge-dark">
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Is this a single building or wider estate?
          </h3>
          <p className="text-sm text-slate-300">
            This determines whether a localized single-flight or phased multi-asset survey is required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SITE_SCALES.map((scale) => {
            const isSelected = site.siteScale === scale.id;
            return (
              <button
                key={scale.id}
                type="button"
                onClick={() => onChange({ siteScale: scale.id })}
                className={`p-5 rounded-sm border text-left transition-all flex items-start justify-between group ${
                  isSelected
                    ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                    : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
                }`}
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-normal text-white group-hover:text-brand-pink transition-colors">
                    {scale.label}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {scale.desc}
                  </p>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                  isSelected ? 'border-brand-pink bg-brand-pink text-white' : 'border-slate-600 bg-brand-graphite'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
