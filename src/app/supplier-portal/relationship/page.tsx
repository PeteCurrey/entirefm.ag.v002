import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Users, Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';
import { getSupplierRelationshipOverview } from '@/server/suppliers/store';

export const metadata = {
  title: 'Supplier Relationship Overview | EntireFM Partner Network',
  description: 'View your commercial partnership status, assigned EntireFM contacts, and annual review milestones.',
};

export default async function SupplierRelationshipPage() {
  const rel = await getSupplierRelationshipOverview('sup-test-01');

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          COMMERCIAL &amp; GOVERNANCE RELATIONSHIP
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Partner Relationship Overview
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Your commercial relationship parameters, assurance milestones, and assigned EntireFM management contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tier Explanation Card */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  RELATIONSHIP STATUS
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {rel.relationship_tier.replace('_', ' ')}
                </h2>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2.5 py-1 rounded font-bold">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {rel.tier_explanation}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Assurance Since</span>
                <span className="text-slate-900 font-bold">{rel.assurance_effective_date}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Partner Network Since</span>
                <span className="text-slate-900 font-bold">{rel.relationship_since}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Next Annual Review</span>
                <span className="text-slate-900 font-bold">{rel.next_formal_review_date}</span>
              </div>
            </div>
          </div>

          {/* Governance Principles */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-3 text-xs">
            <span className="font-bold text-slate-900 block font-sans">Non-Negotiable Procurement Principles:</span>
            <ul className="space-y-1.5 text-slate-600 text-[11.5px]">
              <li>&bull; Supplier Network Membership fees pay for document administration and network services, not work allocation.</li>
              <li>&bull; Work orders are dispatched based strictly on scoped service approval, regional capability, compliance standing, and objective past performance.</li>
              <li>&bull; Preferred and Strategic partner statuses cannot be purchased and are earned through sustained delivery excellence.</li>
            </ul>
          </div>
        </div>

        {/* Assigned Team */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 font-sans text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" /> Assigned EntireFM Team
            </h2>

            <div className="space-y-4 text-xs">
              {rel.assigned_entirefm_team.map((c, i) => (
                <div key={i} className="space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    {c.role}
                  </span>
                  <span className="font-bold text-slate-900 block font-sans">{c.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono block">{c.department}</span>
                  <div className="text-[11px] text-slate-600 space-y-0.5 font-mono pt-1">
                    <div>{c.email}</div>
                    <div>{c.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
