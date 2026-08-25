'use client';

import React from 'react';
import { 
  PlannerSiteInput, 
  PlannerInspectionInput, 
  PlannerContactInput, 
  DroneRecommendationResult 
} from '@/config/dronePlanner';
import { CONTACT_CONFIG } from '@/config/contact';

interface PlannerPrintableBriefProps {
  site: PlannerSiteInput;
  inspection: PlannerInspectionInput;
  contact: PlannerContactInput;
  recommendation: DroneRecommendationResult;
  referenceNumber: string;
}

export function PlannerPrintableBrief({
  site,
  inspection,
  contact,
  recommendation,
  referenceNumber,
}: PlannerPrintableBriefProps) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div id="printable-drone-brief" className="hidden print:block bg-white text-slate-900 p-8 max-w-4xl mx-auto space-y-6 font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-light uppercase tracking-tight text-slate-900">
            ENTIRE FACILITIES MANAGEMENT
          </h1>
          <span className="font-mono text-xs text-pink-600 font-light uppercase tracking-wider block mt-0.5">
            DRONE SERVICES DIVISION &bull; COMMERCIAL INSPECTION BRIEF
          </span>
        </div>

        <div className="text-right font-mono text-[11px]">
          <div><strong>REF:</strong> {referenceNumber}</div>
          <div><strong>DATE:</strong> {currentDate}</div>
        </div>
      </div>

      {/* Property & Client Summary */}
      <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded border border-slate-200">
        <div className="space-y-1">
          <strong className="text-[10px] font-mono uppercase text-slate-500 block">Site / Property Details:</strong>
          <div><strong>Property Type:</strong> {site.siteType === 'Other' ? site.siteTypeOther : site.siteType}</div>
          <div><strong>Location:</strong> {site.siteName ? `${site.siteName}, ` : ''}{site.city || 'United Kingdom'} {site.postcode || ''}</div>
          <div><strong>Scale &amp; Height:</strong> {site.siteScale} ({inspection.heightBand || 'Standard'})</div>
          <div><strong>Environment:</strong> {site.environment || 'Commercial'}</div>
        </div>

        <div className="space-y-1">
          <strong className="text-[10px] font-mono uppercase text-slate-500 block">Client / Contact:</strong>
          <div><strong>Contact Name:</strong> {contact.firstName ? `${contact.firstName} ${contact.lastName}` : 'Provisional Assessment'}</div>
          <div><strong>Company:</strong> {contact.company || 'Not specified'}</div>
          <div><strong>Email:</strong> {contact.email || 'Not specified'}</div>
          <div><strong>Phone:</strong> {contact.phone || 'Not specified'}</div>
        </div>
      </div>

      {/* Primary Recommended Service & Package */}
      <div className="p-4 border-2 border-pink-600 rounded space-y-2 bg-pink-50/20">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase font-light text-pink-700">
          <span>RECOMMENDED SERVICE</span>
          <span>SCOPE: {recommendation.scopeCategory.toUpperCase()}</span>
        </div>
        <h2 className="text-base font-light text-slate-900">
          {recommendation.primaryService.title}
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          {recommendation.primaryService.description}
        </p>

        {recommendation.inspectionPack && (
          <div className="mt-2 pt-2 border-t border-pink-200">
            <strong className="text-[10px] font-mono uppercase text-pink-800 block">Recommended Pack:</strong>
            <span className="font-light text-slate-900">{recommendation.inspectionPack.title}</span> — {recommendation.inspectionPack.description}
          </div>
        )}
      </div>

      {/* Deliverables & Remediation Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="font-mono text-[10px] uppercase font-light text-slate-700 border-b pb-1">
            Suggested Deliverables
          </h3>
          <ul className="space-y-1 text-slate-700 list-disc list-inside">
            {recommendation.suggestedOutputs.map((out, idx) => (
              <li key={idx}>{out}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-mono text-[10px] uppercase font-light text-slate-700 border-b pb-1">
            EntireFM Remedial Works Alignment
          </h3>
          <div className="space-y-1.5 text-slate-700">
            {recommendation.remedialServices.map((rem, idx) => (
              <div key={idx}>
                <strong>{rem.name}:</strong> {rem.desc}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Caveats & Disclaimer */}
      <div className="p-3 bg-slate-100 rounded border border-slate-200 text-[10.5px] text-slate-600 space-y-1">
        <strong className="font-light text-slate-800 block">Operational Governance &amp; Compliance Notice:</strong>
        <p>
          This document represents an initial technical recommendation based upon information supplied by the client. Commercial flight deployment is subject to site risk assessment (RAMS), airspace permissions, weather thresholds (wind gusts &lt;22–25 knots), and UK Civil Aviation Authority (CAA) regulations. This is not a formal binding quotation.
        </p>
      </div>

      {/* Footer Contact */}
      <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-[10.5px] font-mono text-slate-600">
        <div>Entire Facilities Management Ltd &bull; Nationwide UK Delivery</div>
        <div>Tel: {CONTACT_CONFIG.mainPhone.display} &bull; Web: entirefm.com</div>
      </div>
    </div>
  );
}
