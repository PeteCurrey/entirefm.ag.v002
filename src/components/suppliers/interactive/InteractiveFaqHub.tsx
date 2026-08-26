'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Receipt, 
  Wrench, 
  Smartphone, 
  Award,
  ArrowRight,
  Headphones
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'general' | 'vetting' | 'cafm' | 'invoicing' | 'membership';
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'f-1',
    category: 'general',
    question: 'How does EntireFM select and allocate work to suppliers?',
    answer: 'EntireFM operates a governed, criteria-matched supply chain. Once approved for specific trade disciplines and geographical regions, work orders are automatically matched to your business based on asset sensitivity, geographical proximity, historical SLA performance, and availability. We do not run reverse auctions or race-to-the-bottom bidding.',
  },
  {
    id: 'f-2',
    category: 'vetting',
    question: 'What are the minimum insurance requirements to become an approved supplier?',
    answer: 'All suppliers must maintain a minimum of £5,000,000 Public Liability (£10,000,000 for high-risk statutory engineering, roofing, and access trades) and £10,000,000 Employers Liability. Professional Indemnity insurance (£1M–£5M) is required for trades providing design advice, testing, or statutory certification. Policies must be placed with reputable insurers with no unapproved hot work or height exclusions.',
  },
  {
    id: 'f-3',
    category: 'vetting',
    question: 'How long does the supplier vetting process typically take?',
    answer: 'If all required documentation (valid insurance schedules, statutory licences like Gas Safe or F-Gas, and RAMS) is uploaded promptly to the document vault, standard desk review is completed within 1 to 2 business days. Following digital agreement signing and dual-control bank verification, portal activation is completed same-day.',
  },
  {
    id: 'f-4',
    category: 'cafm',
    question: 'Do our engineers need to install any software or pay CAFM subscription fees?',
    answer: 'No. EntireFM provides free mobile access to EntireCAFM for all attending engineers. Engineers receive work order instructions, site access codes, asset history, and upload before/after photos and client signatures directly via browser on their smartphones. There are zero software licence fees or per-job deduction charges.',
  },
  {
    id: 'f-5',
    category: 'invoicing',
    question: 'What are EntireFM’s payment terms and how are invoices processed?',
    answer: 'Invoices are matched electronically against authorized Purchase Order (PO) numbers in EntireCAFM. As soon as the engineer submits photographic proof of completion and the signed worksheet, the milestone is validated for payment. We offer prompt payment terms directly via BACS with no hidden administrative deductions or dispute delays.',
  },
  {
    id: 'f-6',
    category: 'invoicing',
    question: 'What happens if on-site remedial works exceed the pre-authorised spend limit?',
    answer: 'If your engineer arrives on site and discovers that additional parts or labour are required exceeding the initial spend limit, they submit a variation quote directly through EntireCAFM before proceeding. Our 24/7 technical desk can authorize variations in real time while your engineer is still on site.',
  },
  {
    id: 'f-7',
    category: 'membership',
    question: 'What is the difference between an Approved Supplier and a Preferred Partner?',
    answer: 'Approved Supplier is our baseline accredited status, granting access to reactive and scheduled work orders in your registered regions. Preferred Partner is an elevated commercial status reserved for suppliers with consistently high SLA attendance, zero compliance defects, and multi-region capacity, granting primary dispatch priority, recurring term maintenance contracts, and invitations to Partner Network forums.',
  },
  {
    id: 'f-8',
    category: 'vetting',
    question: 'What happens when our insurance or Gas Safe registration is due to expire?',
    answer: 'EntireFM’s Dynamic Compliance Radar automatically sends proactive alerts at 60 and 30 days prior to certificate expiry. You can upload the renewed broker schedule directly through the Supplier Portal vault. If a document expires without renewal, dispatch for that specific trade is temporarily paused until verified, protecting both your business and client compliance.',
  },
  {
    id: 'f-9',
    category: 'general',
    question: 'Can regional SME contractors partner with EntireFM without nationwide coverage?',
    answer: 'Yes, absolutely. We actively champion regional craft specialists and independent engineering SMEs. You specify your operating radius (e.g. 25–40 miles from your workshop/depot), and we will only route work orders located within your confirmed territory.',
  },
  {
    id: 'f-10',
    category: 'membership',
    question: 'Are there any hidden fees or commission charges deducted from our invoices?',
    answer: 'None whatsoever. You receive 100% of your agreed labour rate and quoted materials as authorised on the purchase order. EntireFM maintains complete commercial transparency with zero invoice discounting or hidden rebate deductions.',
  },
];

export function InteractiveFaqHub() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({
    'f-1': true, // First one open by default
  });

  const toggleFaq = (id: string) => {
    setExpandedFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-12">
          <span className="eyebrow eyebrow-light">SUPPLIER HELP &amp; COMMERCIAL ADVISORY</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            Frequently Asked Supplier Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Everything you need to know about partnering with EntireFM: vetting criteria, CAFM dispatch workflows, insurance minimums, and transparent payment terms.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-[#FAF9FB] p-6 rounded-sm border border-slate-200 mb-10 space-y-4">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supplier questions (e.g. insurance, payment terms, CAFM, Gas Safe)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-sm text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/80">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'general', label: 'General & Allocation' },
              { id: 'vetting', label: 'Vetting & Insurances' },
              { id: 'cafm', label: 'EntireCAFM & Work Orders' },
              { id: 'invoicing', label: 'Invoicing & Payments' },
              { id: 'membership', label: 'Tiers & Growth' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-light tracking-wide transition-all ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white font-normal shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center bg-[#FAF9FB] rounded-sm border border-slate-200 text-slate-500 font-light text-sm">
              No questions found matching &ldquo;{searchQuery}&rdquo;. Try another search term or contact our helpdesk.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!expandedFaqs[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`rounded-sm border transition-all ${
                    isOpen ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-[#FAF9FB] hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4"
                  >
                    <span className="text-sm sm:text-base font-light text-slate-900 pr-4">
                      {faq.question}
                    </span>
                    <div className="p-1 rounded bg-slate-100 text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 font-light leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Desk Strip */}
        <div className="mt-12 p-8 bg-[#FAF9FB] border border-slate-200 rounded-sm flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Headphones className="h-6 w-6 text-brand-pink" />
            </div>
            <div>
              <h3 className="text-base font-light text-slate-900">Have a specific supply chain question?</h3>
              <p className="text-xs text-slate-600 font-light mt-0.5">
                Our supplier management desk is available Monday–Friday, 08:00–17:30 to assist with technical queries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:supplier-support@entirefm.com"
              className="btn-ghost-dark text-xs py-2.5 px-4"
            >
              Email Supplier Desk
            </a>
            <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 px-4">
              Apply Now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
