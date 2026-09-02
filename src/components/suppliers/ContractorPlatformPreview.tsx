'use client';

import React, { useState, useEffect, useRef } from 'react';
function useCounter(target: number, duration: number = 800, startAnimation: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, startAnimation]);

  return count;
}

import Link from 'next/link';
import { CafmBrandMark } from '@/components/brand/CafmBrandMark';
import {
  ShieldCheck,
  Briefcase,
  Users,
  Calculator,
  Compass,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Building2,
  Check,
  TrendingUp,
  FileCheck,
  ChevronRight,
  ExternalLink,
  Sliders,
  Sparkles,
  Search,
  Bell
} from 'lucide-react';

type TabKey = 'dashboard' | 'compliance' | 'rams' | 'workforce' | 'tools' | 'intelligence';

export function ContractorPlatformPreview() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const pendingCount = useCounter(2, 600, isVisible);
  const activeOrdersCount = useCounter(4, 700, isVisible);
  const complianceScore = useCounter(98, 900, isVisible);
  const operativesCount = useCounter(8, 800, isVisible);

  return (
    <div ref={containerRef} className="w-full rounded-md border border-slate-200 bg-white shadow-xl overflow-hidden text-slate-900">
      {/* 1. Browser / App Chrome Bar */}
      <div className="bg-[#1E293B] px-4 py-3 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-slate-400">platform.entirefm.com</span>
            <span className="text-slate-600">/</span>
            <span className="text-[#EA580C] font-semibold">contractor</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Verified Supply Chain Partner
          </span>
          <span className="hidden md:inline-block text-slate-400 text-[11px]">
            Apex Mechanical &amp; Electrical Ltd
          </span>
        </div>
      </div>

      {/* 2. Platform Navigation Bar */}
      <div className="bg-[#FAFAF8] border-b border-[#E8E8E5] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <CafmBrandMark size="sm" />
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Entire<span className="text-[#EA580C]">FM</span>
            </span>
            <span className="rounded border border-[#E8E8E5] bg-white px-1.5 py-0.5 text-[9.5px] uppercase font-bold tracking-wider text-slate-600">
              Contractor
            </span>
          </div>

          <div className="h-4 w-px bg-[#E8E8E5] hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
            <Building2 className="w-3.5 h-3.5 text-[#EA580C]" />
            <span className="font-medium text-slate-900">Apex M&amp;E Ltd</span>
            <span className="text-slate-400 text-[10px] font-mono">(CH: 08492014)</span>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none max-w-full">
          {[
            { key: 'dashboard', label: 'Control Centre', icon: Sliders },
            { key: 'compliance', label: 'Compliance & Vault', icon: ShieldCheck },
            { key: 'rams', label: 'RAMS & Job Packs', icon: FileText },
            { key: 'workforce', label: 'Workforce Matrix', icon: Users },
            { key: 'tools', label: 'Business Tools', icon: Calculator },
            { key: 'intelligence', label: 'Intelligence Watch', icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#EA580C] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Main View Content */}
      <div className="p-4 sm:p-6 lg:p-8 bg-[#FAFAF8] min-h-[440px]">
        {/* VIEW 1: CONTROL CENTRE */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header banner */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
                    CONTRACTOR OPERATIONS CONTROL
                  </span>
                  <span className="text-[10.5px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    COMPLIANCE SCORE: {complianceScore}%
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Apex Mechanical &amp; Electrical Ltd
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  Live operational command: work order dispatch, operative assignments, statutory compliance monitoring, and commercial purchase orders.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-slate-600 px-3 py-2 bg-[#FAFAF8] rounded border border-slate-200">
                  Tier: Contractor Member
                </span>
                <span className="text-xs font-medium text-emerald-700 px-3 py-2 bg-emerald-50 rounded border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Work Eligible
                </span>
              </div>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  New Job Offers
                </span>
                <div className="text-2xl font-bold text-[#EA580C] mt-1 tabular-nums">{pendingCount} Pending</div>
                <span className="text-[11px] text-slate-500">Requires accept / decline</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Active in Field
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{activeOrdersCount} Orders</div>
                <span className="text-[11px] text-slate-500">Engineers on-site</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Compliance Status
                </span>
                <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">{complianceScore}% Valid</div>
                <span className="text-[11px] text-slate-500">All statutory controls active</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Field Engineers
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{operativesCount} Operatives</div>
                <span className="text-[11px] text-slate-500">Authorised &amp; inducted</span>
              </div>
            </div>

            {/* Split row: Work Queue & Compliance Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Work offers */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#EA580C]" />
                    <h4 className="text-sm font-semibold text-slate-900">Work Dispatch Pipeline</h4>
                  </div>
                  <span className="text-[11px] text-slate-500">2 matching capability</span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded border border-slate-200 bg-[#FAFAF8] flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        AHU-02 Inverter Drive Fault Investigation
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        WO-84920 &bull; St Peter&apos;s Square, Manchester &bull; HVAC / Controls
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded shrink-0">
                      £420.00 PO
                    </span>
                  </div>

                  <div className="p-3 rounded border border-slate-200 bg-[#FAFAF8] flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        Quarterly Chiller Glycol &amp; Pressure Inspection
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        WO-84918 &bull; Leeds Innovation Campus &bull; Refrigeration / PPM
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded shrink-0">
                      £780.00 PO
                    </span>
                  </div>
                </div>
              </div>

              {/* Compliance & Watch Radar */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-semibold text-slate-900">Compliance &amp; Document Health</h4>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">Vault Synchronised</span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded border border-slate-200 bg-[#FAFAF8] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-slate-900">Public &amp; Employers Liability (£10m)</div>
                        <div className="text-[10.5px] text-slate-500">Aviva Policy #AV-948210 &bull; Valid to Nov 2026</div>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-mono text-emerald-700 font-medium">VERIFIED</span>
                  </div>

                  <div className="p-3 rounded border border-slate-200 bg-[#FAFAF8] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-slate-900">Gas Safe Registration &amp; F-Gas Cert</div>
                        <div className="text-[10.5px] text-slate-500">Refcom #REF100984 &bull; Gas Safe #592014</div>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-mono text-emerald-700 font-medium">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: COMPLIANCE & VAULT */}
        {activeTab === 'compliance' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
                  DOCUMENT VAULT &amp; VERIFICATION ENGINE
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Statutory Credential &amp; Insurance Monitoring
                </h3>
                <p className="text-xs text-slate-500">
                  Automated tracking of mandatory policies, accreditation bodies, and expiry alerts across your company.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                All 6 Pillars Current
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Public Liability (£10m)', issuer: 'Aviva Insurance', expiry: '18 Nov 2026', status: 'VERIFIED', code: 'INS-PL-01' },
                { title: 'Employers Liability (£10m)', issuer: 'Aviva Insurance', expiry: '18 Nov 2026', status: 'VERIFIED', code: 'INS-EL-01' },
                { title: 'Professional Indemnity (£5m)', issuer: 'AXA XL', expiry: '04 Mar 2027', status: 'VERIFIED', code: 'INS-PI-01' },
                { title: 'Gas Safe Register', issuer: 'Capita Gas Registration', expiry: '31 Aug 2027', status: 'VERIFIED', code: 'CERT-GS-04' },
                { title: 'F-Gas Company Certificate', issuer: 'Refcom Elite', expiry: '12 Jan 2027', status: 'VERIFIED', code: 'CERT-FG-02' },
                { title: 'NICEIC Approved Contractor', issuer: 'NICEIC Certsure', expiry: '15 Oct 2026', status: 'VERIFIED', code: 'CERT-NIC-09' },
              ].map((doc, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">{doc.code}</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{doc.title}</h4>
                      <p className="text-[11px] text-slate-500">{doc.issuer}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      {doc.status}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Renewal: {doc.expiry}</span>
                    <span className="text-[#EA580C] hover:underline cursor-pointer">View PDF</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: RAMS & JOB PACKS */}
        {activeTab === 'rams' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
                  SAFETY &amp; OPERATIONAL PACKS
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  FM-Specific RAMS &amp; Digital Job Packs
                </h3>
                <p className="text-xs text-slate-500">
                  Generate site-compliant risk assessments, method statements, and operative briefing packs in minutes.
                </p>
              </div>
              <button className="text-xs font-bold px-3.5 py-2 rounded bg-[#EA580C] text-white self-start sm:self-auto hover:bg-[#EA580C]/90 transition-all">
                + Create New RAMS
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">RAMS-2026-HVAC-042</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      Rooftop Chiller Lift &amp; Compressor Overhaul
                    </h4>
                    <p className="text-xs text-slate-500">
                      Work at Height &bull; Heavy Lifting &bull; Refrigerant Handling R410A
                    </p>
                  </div>
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    APPROVED
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#FAFAF8] border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div>✓ 4 Operatives Signed &amp; Acknowledged</div>
                  <div>✓ Lifting Plan &amp; Slinger Competency Attached</div>
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">RAMS-2026-ELEC-019</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      Commercial Switchgear Thermal Imaging &amp; EICR
                    </h4>
                    <p className="text-xs text-slate-500">
                      Live Electrical &bull; Arc Flash Protocol &bull; Isolation Procedures
                    </p>
                  </div>
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    APPROVED
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#FAFAF8] border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div>✓ 2 Senior Electricians Inducted</div>
                  <div>✓ Lock-Out Tag-Out (LOTO) Matrix Validated</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: WORKFORCE & MATRIX */}
        {activeTab === 'workforce' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
                  FIELD PERSONNEL &amp; QUALIFICATIONS
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Operative Skills &amp; Competency Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Manage individual engineer qualifications, CSCS cards, trade certifications, and site induction readiness.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-600 px-3 py-1.5 rounded bg-white border border-slate-200 self-start sm:self-auto">
                8 Active Engineers
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-xs">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#FAFAF8] text-slate-600 uppercase font-semibold text-[10.5px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Operative Name</th>
                    <th className="p-3">Primary Trade</th>
                    <th className="p-3">Key Qualifications</th>
                    <th className="p-3">Card / Registration</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: 'Mark Harrison', trade: 'Lead HVAC Engineer', certs: 'City & Guilds 2079, F-Gas Cat 1, CSCS Gold', reg: 'Refcom 84920', status: 'AUTHORISED' },
                    { name: 'David Thompson', trade: 'Commercial Electrician', certs: '18th Edition BS7671, 2391 Inspection & Test', reg: 'JIB / ECS Gold', status: 'AUTHORISED' },
                    { name: 'Craig Roberts', trade: 'Combustion Engineer', certs: 'COCN1, CIGA1, CDGA1, Gas Safe Accredited', reg: 'Gas Safe 592014', status: 'AUTHORISED' },
                    { name: 'Liam Walker', trade: 'Building Controls Specialist', certs: 'Niagara N4 Certified, Trend Controls Level 3', reg: 'CSCS Academically Q.', status: 'AUTHORISED' },
                  ].map((eng, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{eng.name}</td>
                      <td className="p-3 text-slate-600">{eng.trade}</td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">{eng.certs}</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{eng.reg}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {eng.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: BUSINESS TOOLS */}
        {activeTab === 'tools' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
                  COMMERCIAL TOOLING &amp; PRODUCTIVITY
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Contractor Business Calculators &amp; Margin Tools
                </h3>
                <p className="text-xs text-slate-500">
                  Instant calculations for true hourly labour cost recovery, job gross margin, call-out rates, and travel overheads.
                </p>
              </div>
              <span className="text-xs font-bold text-[#EA580C] px-3 py-1.5 rounded bg-orange-50 border border-orange-200 self-start sm:self-auto">
                Included in Membership
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900">
                  <Calculator className="w-4 h-4 text-[#EA580C]" />
                  <h4 className="text-xs font-bold">Labour Recovery Rate Model</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Calculate the real overhead recovery requirement per engineer hour including downtime, holiday, van costs, and tooling.
                </p>
                <div className="p-2 rounded bg-[#FAFAF8] border border-slate-100 text-[11px] font-mono text-slate-700">
                  Calculated Target: £48.50 / hr
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold">Job Gross Margin Modeler</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Simulate material markup, specialist sub-contractors, and blended engineer rates to safeguard project profitability.
                </p>
                <div className="p-2 rounded bg-[#FAFAF8] border border-slate-100 text-[11px] font-mono text-emerald-700 font-bold">
                  Target Gross Margin: 32.4%
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <h4 className="text-xs font-bold">Call-Out &amp; Out-of-Hours Matrix</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Standardise first-hour standby, attendance premiums, and mileage thresholds for 24/7 reactive call-out contracts.
                </p>
                <div className="p-2 rounded bg-[#FAFAF8] border border-slate-100 text-[11px] font-mono text-slate-700">
                  OOH Blended Rate: £95.00 / hr
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: INTELLIGENCE WATCH */}
        {activeTab === 'intelligence' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
                  REGULATORY &amp; TRADE SURVEILLANCE
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Compliance Watch &amp; Industry Intelligence
                </h3>
                <p className="text-xs text-slate-500">
                  Live statutory surveillance, Companies House filing tracking, and technical trade briefings tailored to your disciplines.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-600 px-3 py-1.5 rounded bg-white border border-slate-200 self-start sm:self-auto">
                0 Critical Alerts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#EA580C]">COMPANY WATCH</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    GOOD STANDING
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Companies House &amp; Financial Governance</h4>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Confirmation statement and annual statutory accounts verified with Companies House registrar. No gazette notices or CCJ filings detected.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-cyan-700">REGULATORY BRIEFING</span>
                  <span className="text-[10px] font-mono text-slate-500">STATUTORY 2026</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Building Safety Act Golden Thread Mandatory Handover</h4>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Key guidance on digital record keeping for higher-risk commercial buildings (HRBs), fire door asset registries, and secondary evidence capture.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Footer of Platform Preview */}
      <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>Real-time digital contractor platform included with all EntireFM network memberships.</span>
        </div>
        <Link
          href="/suppliers/apply"
          className="text-[#EA580C] hover:underline font-bold flex items-center gap-1 shrink-0"
        >
          Apply to Join the Network &rarr;
        </Link>
      </div>
    </div>
  );
}
