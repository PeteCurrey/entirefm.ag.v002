'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

const FM_INTERESTS = [
  'Building Safety',
  'Fire Safety',
  'Electrical & M&E',
  'HVAC & Refrigeration',
  'Water Hygiene & Legionella',
  'CAFM & Technology',
  'AI & Automation',
  'Asset Management',
  'Procurement & Tenders',
  'Workplace Experience',
  'Energy & Decarbonisation',
];

export function TemplateMemberOnboarding() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [headline, setHeadline] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.member) {
          if (data.member.headline) setHeadline(data.member.headline);
          if (data.member.company) setCompany(data.member.company);
          if (data.member.jobTitle) setJobTitle(data.member.jobTitle);
          if (data.member.location) setLocation(data.member.location);
          if (data.member.disciplines?.length) setSelectedInterests(data.member.disciplines);
        }
      })
      .catch(() => {});
  }, []);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await fetch('/api/member/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: headline.trim() || undefined,
          company: company.trim() || undefined,
          jobTitle: jobTitle.trim() || undefined,
          location: location.trim() || undefined,
          disciplines: selectedInterests,
        }),
      });
    } catch {
      // Graceful fallback
    } finally {
      setSaving(false);
      router.push('/member/profile');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F7] text-neutral-900 font-sans selection:bg-brand-electric selection:text-white">
      <Header solid={true} />

      <main className="flex-1 py-16 sm:py-24 px-4 sm:px-6">
        <div className="w-full max-w-2xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-light bg-brand-electric/10 px-2.5 py-1 rounded-[4px]">
                WELCOME TO THE LOBBY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-neutral-500 font-extralight">Account Activated</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-neutral-900 leading-tight">
              Tell The Lobby what matters to you.
            </h1>

            <p className="text-base font-extralight text-neutral-600 leading-relaxed">
              Personalise your intelligence feed, statutory compliance alerts, and peer community discussions.
            </p>
          </div>

          {/* Professional Interests Grid */}
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium">
              Select your FM focus areas
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {FM_INTERESTS.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center justify-between p-3 rounded-[6px] border text-left text-xs sm:text-sm font-extralight transition-all ${
                      active
                        ? 'border-brand-electric bg-brand-electric/10 text-brand-electric font-light'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <span>{interest}</span>
                    {active && <Check className="w-3.5 h-3.5 text-brand-electric shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Professional Context Form */}
          <div className="space-y-4 bg-white border border-neutral-200/90 rounded-[8px] p-6 sm:p-8">
            <h2 className="text-sm uppercase tracking-wider text-neutral-500 font-medium">
              Professional Details (Optional)
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extralight text-neutral-600">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Head of Facilities"
                  className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extralight text-neutral-600">Company / Organisation</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Alkota Group"
                  className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extralight text-neutral-600">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London & South East"
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extralight text-neutral-600">Professional Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Hard FM specialist overseeing 2.4m sq ft commercial portfolio"
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => router.push('/member/profile')}
              className="text-xs font-extralight text-neutral-500 hover:text-neutral-900 transition-colors order-2 sm:order-1"
            >
              Skip for now
            </button>

            <button
              type="button"
              onClick={handleComplete}
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center justify-center gap-2 shadow-sm order-1 sm:order-2"
            >
              <span>{saving ? 'Setting up...' : 'Enter The Lobby'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
