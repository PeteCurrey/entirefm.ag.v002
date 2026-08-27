import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Wrench, Users, Calendar, Award, HelpCircle, Leaf, Cpu, Layers, FileText, CheckCircle2 } from 'lucide-react';

export function SupplierEcosystemDirectory() {
  const sections = [
    {
      heading: 'Work With EntireFM',
      description: 'Understand how we partner with UK contractors, trade specialists, and engineering businesses.',
      links: [
        {
          title: 'Partner With EntireFM',
          href: '/suppliers/partner-with-entirefm',
          description: 'Commercial benefits, recurring maintenance volumes, and regional partnership.',
        },
        {
          title: 'Start Supplier Application',
          href: '/suppliers/apply',
          description: 'Begin online pre-qualification, assurance vetting, and application onboarding.',
        },
        {
          title: 'How We Work',
          href: '/suppliers/how-we-work',
          description: 'End-to-end 12-stage operational journey, work allocation, and fair payment.',
        },
        {
          title: 'Supplier Standards',
          href: '/suppliers/standards',
          description: 'Health & safety, environmental, quality, and minimum insurance benchmarks.',
        },
      ],
    },
    {
      heading: 'Assurance & Compliance',
      description: 'Risk-proportional auditing, digital evidence verification, and statutory safety.',
      links: [
        {
          title: 'Supplier Vetting',
          href: '/suppliers/vetting',
          description: 'Rigorous 6-pillar compliance audit covering financial, safety, and trade checks.',
        },
        {
          title: 'Onboarding Process',
          href: '/suppliers/onboarding',
          description: 'Structured 4-phase mobilization, induction, and digital agreement workflow.',
        },
        {
          title: 'Compliance & Safety',
          href: '/suppliers/compliance',
          description: 'Insurance schedules, dynamic RAMS, CSCS cards, and statutory certificates.',
        },
        {
          title: 'Sustainability & ESG',
          href: '/suppliers/sustainability',
          description: 'Decarbonisation standards, environmental ethics, and sustainable practices.',
        },
        {
          title: 'Partner Network Framework',
          href: '/suppliers/membership',
          description: 'Partner Network capability tiers, technical standards, and independent procurement firewall.',
        },
      ],
    },
    {
      heading: 'Partner Network & Events',
      description: 'Collaborative ecosystem of contractors, OEMs, and PropTech innovators.',
      links: [
        {
          title: 'Partner Network Overview',
          href: '/suppliers/partner-network',
          description: 'Collaborative network bringing together specialists, OEMs, and technology partners.',
        },
        {
          title: 'Events & Technical Forums',
          href: '/suppliers/events',
          description: 'Supplier breakfasts, manufacturer open days, technical training, and regional roundtables.',
        },
        {
          title: 'Industry & OEM Partners',
          href: '/suppliers/industry-partners',
          description: 'Factory-backed equipment partnerships and direct manufacturer technical support.',
        },
        {
          title: 'Innovation & PropTech',
          href: '/suppliers/innovation',
          description: 'IoT sensor telemetry, AI predictive maintenance, and next-generation smart FM.',
        },
      ],
    },
    {
      heading: 'Existing Suppliers & Support',
      description: 'Direct portal access, frequently asked questions, and supplier helpdesk.',
      links: [
        {
          title: 'Supplier Portal Sign-In',
          href: '/supplier-portal/sign-in',
          description: 'Secure operational portal for active jobs, digital worksheets, and invoice tracking.',
        },
        {
          title: 'Supplier FAQ',
          href: '/suppliers/faq',
          description: 'Answers to common questions regarding vetting, rates, prompt payment, and dispatch.',
        },
      ],
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="container-custom max-w-6xl">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              SUPPLIER DIRECTORY &amp; NAVIGATION HUB
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Complete supplier and partner ecosystem
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Explore all aspects of the EntireFM supply chain, from pre-qualification and assurance standards to regional breakfast events, OEM collaborations, and our secure supplier portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((sec) => (
            <div
              key={sec.heading}
              className="bg-[#FAF9FB] border border-slate-200 rounded-sm p-6 sm:p-8 space-y-6 flex flex-col justify-between"
            >
              <div>
                <div className="border-b border-slate-200 pb-4 mb-5">
                  <h3 className="text-lg font-light text-slate-900">
                    {sec.heading}
                  </h3>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    {sec.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {sec.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group block p-3.5 bg-white border border-slate-200/80 rounded-xs hover:border-brand-pink hover:shadow-2xs transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-slate-900 group-hover:text-brand-pink transition-colors">
                          {link.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-pink opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                      <p className="text-[11.5px] text-slate-600 font-light mt-1 leading-snug">
                        {link.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
