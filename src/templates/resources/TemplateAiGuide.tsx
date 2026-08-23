'use client';

import React from 'react';
import Link from 'next/link';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface TemplateAiGuideProps {
  route: RouteRecord;
  content: ContentRecord;
}

export function TemplateAiGuide({ route, content }: TemplateAiGuideProps) {
  const path = route.path;

  // Custom contextual highlights based on guide path
  const isPredictive = path.includes('predictive-maintenance');
  const isHelpdesk = path.includes('ai-helpdesk-work-orders');
  const isCafm = path.includes('ai-cafm');
  const isEnergy = path.includes('energy-optimisation');
  const isDigitalTwins = path.includes('digital-twins');
  const isAgents = path.includes('ai-agents');
  const isVision = path.includes('computer-vision');
  const isCompliance = path.includes('ai-compliance');
  const isData = path.includes('fm-data-readiness');
  const isGovernance = path.includes('ai-governance');

  return (
    <div className="bg-[#0b1320] text-slate-100 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-16 overflow-hidden bg-gradient-to-b from-[#060c16] via-[#0b1320] to-[#0f172a] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <Breadcrumbs items={content.breadcrumbs || []} />
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              {content.eyebrow || 'AI & Engineering Technical Guide'}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              {content.h1}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed mb-8">
              {content.heroIntro}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-800">
              <div>
                <span className="text-slate-500">Pillar Resource: </span>
                <Link href="/resources/ai-in-facilities-management" className="text-pink-400 hover:text-pink-300 font-medium">
                  AI in Facilities Management Hub
                </Link>
              </div>
              <div className="w-px h-4 bg-slate-800 hidden sm:block" />
              <div>
                <span className="text-slate-500">Standard: </span>
                <span className="text-white font-medium">2026 Technical Review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE EDITORIAL CONTENT SECTIONS */}
      <section className="py-16 bg-[#0f172a] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-12">
              {(content.sections || []).map((sec, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {sec.heading}
                  </h2>
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
                    {sec.body}
                  </p>
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-pink-400 mt-1">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* SPECIFIC TECHNICAL MODULES ACCORDING TO TOPIC */}
              {isPredictive && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Preventative (PPM) vs Predictive (PdM) Maintenance Matrix
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="border-b border-slate-700 bg-slate-950 text-slate-300">
                        <tr>
                          <th className="p-3">Dimension</th>
                          <th className="p-3">Preventative (PPM)</th>
                          <th className="p-3">Predictive (PdM)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        <tr>
                          <td className="p-3 font-bold text-white">Trigger</td>
                          <td className="p-3">Calendar / Fixed Run-Hours (e.g. Monthly)</td>
                          <td className="p-3">Condition Anomaly (Vibration / Temp Delta)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Statutory Status</td>
                          <td className="p-3">Mandatory under UK Law (LOLER, Gas, EICR)</td>
                          <td className="p-3">Operational Optimization (No Legal Status)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Best Applied To</td>
                          <td className="p-3">All Building Plant & Life-Safety Assets</td>
                          <td className="p-3">High-Capital Critical Plant (Chillers, Pumps)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Cost Structure</td>
                          <td className="p-3">Predictable Fixed Contract Annual Spend</td>
                          <td className="p-3">Initial IoT Sensor Capital + Analytics Fee</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {isDigitalTwins && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">
                    BIM vs Digital Twin vs CAFM vs BMS Architecture
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="border-b border-slate-700 bg-slate-950 text-slate-300">
                        <tr>
                          <th className="p-3">System</th>
                          <th className="p-3">Primary Function</th>
                          <th className="p-3">Update Frequency</th>
                          <th className="p-3">Core Value in FM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        <tr>
                          <td className="p-3 font-bold text-white">BIM Model</td>
                          <td className="p-3">3D Design & Construction Geometry</td>
                          <td className="p-3">Static (As-Built Handover)</td>
                          <td className="p-3">Spatial reference & asset locations</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">CAFM</td>
                          <td className="p-3">Asset Registers, Work Orders & Costs</td>
                          <td className="p-3">Transactional (Daily tasks)</td>
                          <td className="p-3">Operational workflow & compliance logs</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">BMS</td>
                          <td className="p-3">Real-time Physical Plant Control</td>
                          <td className="p-3">Continuous (Seconds/Minutes)</td>
                          <td className="p-3">Automated plant staging & setpoints</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Digital Twin</td>
                          <td className="p-3">Unified Dynamic Spatial & Data Replica</td>
                          <td className="p-3">Real-Time Telemetry Sync</td>
                          <td className="p-3">Complex simulation & remote orientation</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {isGovernance && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">
                    10 Questions to Ask an AI/FM Software Supplier
                  </h3>
                  <ol className="space-y-3 text-sm text-slate-300 list-decimal list-inside">
                    <li><strong className="text-white">Data Residency:</strong> Where is building telemetry, tenant data, and asset documentation physically stored? (UK / EEA requirement).</li>
                    <li><strong className="text-white">Model Training Isolation:</strong> Is our proprietary building data used to train shared foundation models?</li>
                    <li><strong className="text-white">Accreditations:</strong> Does the vendor hold ISO 27001, SOC 2 Type II, or Cyber Essentials Plus?</li>
                    <li><strong className="text-white">OT Isolation:</strong> Does the AI tool have direct write access to BMS controllers, or does it run read-only / advisory?</li>
                    <li><strong className="text-white">Human-in-the-Loop:</strong> Can high-consequence actions (contractor dispatch, SLA closures) be locked behind human approval gates?</li>
                    <li><strong className="text-white">Audit Logging:</strong> Is every algorithmic recommendation, ticket triage score, and user override permanently logged with cryptographic timestamps?</li>
                    <li><strong className="text-white">Hallucination Controls:</strong> What safeguards prevent language models from inventing equipment specifications or compliance dates?</li>
                    <li><strong className="text-white">API Integration:</strong> How easily can data be exported if we transition to a different CAFM or FM partner?</li>
                    <li><strong className="text-white">Contractor Access:</strong> How are role-based permissions managed for third-party specialist engineers?</li>
                    <li><strong className="text-white">Fail-Safe Behaviour:</strong> If cloud connectivity is lost, do building plant systems maintain safe autonomous default operation?</li>
                  </ol>
                </div>
              )}

              {isCompliance && (
                <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-6 sm:p-8">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest block mb-2">
                    Legal Governance Boundary
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Statutory Accountability Under UK Law
                  </h3>
                  <p className="text-sm text-amber-100/90 leading-relaxed mb-4">
                    Under the Health and Safety at Work Act 1974, the Regulatory Reform (Fire Safety) Order 2005, and Electricity at Work Regulations 1989, statutory compliance requires physical inspection and written sign-off by an accredited, competent person.
                  </p>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    AI document tools are valuable for organizing certificates, detecting expiring dates, and extracting remedial actions into work orders. However, an AI system has no legal authority to certify a building installation as compliant. Legal responsibility remains strictly with the building duty holder.
                  </p>
                </div>
              )}

              {/* Capabilities Grid */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  Key Operational Capabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(content.capabilities || []).map((cap, idx) => (
                    <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                      {cap.tag && (
                        <span className="text-[10px] font-semibold text-pink-400 uppercase tracking-wider block mb-1">
                          {cap.tag}
                        </span>
                      )}
                      <h4 className="text-sm font-bold text-white mb-2">
                        {cap.name}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              {(content.faqs || []).length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-6">
                    {(content.faqs || []).map((faq, idx) => (
                      <div key={idx} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                        <h4 className="text-sm font-bold text-white mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Sidebar Navigation & Related Links */}
            <div className="lg:col-span-4 space-y-6">
              {/* Back to Pillar Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <span className="text-xs font-mono font-bold text-pink-400 uppercase block mb-1">
                  AI Resource Pillar
                </span>
                <h3 className="text-lg font-bold text-white mb-3">
                  AI in Facilities Management
                </h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Return to the comprehensive whitepaper covering estate use-case maps, interactive work order walkthrough, and readiness pathways.
                </p>
                <Link
                  href="/resources/ai-in-facilities-management"
                  className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300"
                >
                  <span>← Back to Pillar Hub</span>
                </Link>
              </div>

              {/* Related AI Guides */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Related AI in FM Guides
                </h4>
                <ul className="space-y-2.5 text-xs">
                  {[
                    { title: 'Predictive Maintenance', href: '/resources/ai-in-facilities-management/predictive-maintenance' },
                    { title: 'Helpdesk & Work Orders', href: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders' },
                    { title: 'AI + CAFM Software', href: '/resources/ai-in-facilities-management/ai-cafm' },
                    { title: 'Energy Optimisation', href: '/resources/ai-in-facilities-management/energy-optimisation' },
                    { title: 'Digital Twins', href: '/resources/ai-in-facilities-management/digital-twins' },
                    { title: 'AI Agents in FM', href: '/resources/ai-in-facilities-management/ai-agents' },
                    { title: 'Computer Vision', href: '/resources/ai-in-facilities-management/computer-vision' },
                    { title: 'AI & Compliance', href: '/resources/ai-in-facilities-management/ai-compliance' },
                    { title: 'FM Data Readiness', href: '/resources/ai-in-facilities-management/fm-data-readiness' },
                    { title: 'AI Governance & Security', href: '/resources/ai-in-facilities-management/ai-governance' },
                  ]
                    .filter(g => g.href !== path)
                    .slice(0, 6)
                    .map((g) => (
                      <li key={g.href}>
                        <Link
                          href={g.href}
                          className="text-slate-300 hover:text-pink-400 transition-colors flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0"
                        >
                          <span>{g.title}</span>
                          <span className="text-slate-600">→</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Commercial Service Cross-Links */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  EntireFM Services & Tools
                </h4>
                <div className="space-y-2 text-xs">
                  <Link href="/ppm" className="block p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 hover:border-slate-700 transition-all">
                    <strong className="block text-white">Planned Maintenance (PPM)</strong>
                    <span className="text-[11px] text-slate-400">Scheduled statutory and mechanical asset care</span>
                  </Link>
                  <Link href="/compliance" className="block p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 hover:border-slate-700 transition-all">
                    <strong className="block text-white">Compliance Centre</strong>
                    <span className="text-[11px] text-slate-400">Statutory obligations, EICRs, FRA and gas safety</span>
                  </Link>
                  <Link href="/tools/ppm-schedule-builder" className="block p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 hover:border-slate-700 transition-all">
                    <strong className="block text-white">PPM Schedule Builder</strong>
                    <span className="text-[11px] text-slate-400">Free interactive asset matrix generator</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTEXTUAL COMMERCIAL CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-950/30 via-slate-900 to-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Transform Your Estate Operations with EntireFM
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8">
            Experience single-source facilities management combining nationwide trade engineering with transparent software and proactive statutory compliance management.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="px-6 py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500 transition-all shadow-md shadow-pink-600/30 text-sm"
            >
              Contact Our Operations Team
            </Link>
            <Link
              href="/resources/ai-in-facilities-management"
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 border border-slate-700 transition-all text-sm"
            >
              Explore AI Resource Centre
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
