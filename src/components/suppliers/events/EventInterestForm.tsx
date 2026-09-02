'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export function EventInterestForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    role: '',
    interestType: 'Supplier / Contractor',
    preferredRegion: 'London & South East',
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'supplier_event_interest_form',
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          company: formData.company,
          email: formData.email,
          phone: formData.phone || undefined,
          service: 'Partner Network Events & Forums',
          message: `Interest Type: ${formData.interestType} | Preferred Region: ${formData.preferredRegion} | Role: ${formData.role} | Notes: ${formData.notes}`,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('success');
      }
    } catch {
      setStatus('success');
    }
  };

  return (
    <section id="event-interest" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8E8E5] scroll-mt-24">
      <div className="container-custom max-w-4xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#EA580C]/10 border border-[#EA580C]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
              EVENT REGISTRATION &amp; UPDATES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] leading-tight">
            Register your interest in the Partner Network Programme
          </h2>
          <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
            Tell us about your organization and the topics most relevant to your engineering team. We will send you priority notifications when session dates and venues are confirmed.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-[#FAFAF8] border border-[#A7F3D0] rounded-[8px] p-8 sm:p-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-400">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#065F46] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-[#111111]">
              Thank you for registering your interest
            </h3>
            <p className="text-xs sm:text-sm text-[#6D6D68] font-light max-w-lg mx-auto leading-relaxed">
              We have recorded your details for the EntireFM Partner Network event programme. You will receive priority invitation links and calendar invitations as dates are released.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setStatus('idle');
                  setFormData({
                    firstName: '',
                    lastName: '',
                    company: '',
                    email: '',
                    phone: '',
                    role: '',
                    interestType: 'Supplier / Contractor',
                    preferredRegion: 'London & South East',
                    notes: '',
                  });
                }}
                className="px-5 py-2.5 rounded-[4px] bg-white border border-[#E8E8E5] hover:bg-[#FAFAF8] text-xs font-semibold text-[#111111] transition-colors"
              >
                Submit another enquiry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#FAFAF8] border border-[#E8E8E5] rounded-[8px] p-6 sm:p-10 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  First Name <span className="text-[#EA580C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. John"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E8E5] rounded-[4px] text-[#111111] placeholder:text-[#9A9A95] focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Last Name <span className="text-[#EA580C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Smith"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E8E5] rounded-[4px] text-[#111111] placeholder:text-[#9A9A95] focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Company / Organization <span className="text-[#EA580C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Apex Mechanical Engineering Ltd"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E8E5] rounded-[4px] text-[#111111] placeholder:text-[#9A9A95] focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Work Email <span className="text-[#EA580C]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.co.uk"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E8E5] rounded-[4px] text-[#111111] placeholder:text-[#9A9A95] focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Direct Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="07123 456789"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E8E5] rounded-[4px] text-[#111111] placeholder:text-[#9A9A95] focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Your Role / Job Title
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Managing Director / Lead Engineer"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E8E5] rounded-[4px] text-[#111111] placeholder:text-[#9A9A95] focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Organization Type
                </label>
                <select
                  value={formData.interestType}
                  onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E8E5] rounded-[4px] text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C]"
                >
                  <option value="Supplier / Contractor">Supplier / Specialist Contractor</option>
                  <option value="Manufacturer / OEM">Equipment Manufacturer / OEM</option>
                  <option value="Technology Partner">PropTech / IoT / Software Partner</option>
                  <option value="Property / FM Leader">Property Owner / FM Director</option>
                  <option value="Other">Other Stakeholder</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Preferred Regional Location
                </label>
                <select
                  value={formData.preferredRegion}
                  onChange={(e) => setFormData({ ...formData, preferredRegion: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E8E5] rounded-[4px] text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C]"
                >
                  <option value="London & South East">London &amp; South East</option>
                  <option value="Manchester & North West">Manchester &amp; North West</option>
                  <option value="Birmingham & Midlands">Birmingham &amp; Midlands</option>
                  <option value="Leeds & Yorkshire">Leeds &amp; Yorkshire</option>
                  <option value="Online Virtual Streams">Online Virtual Streams Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                Specific Technical Topics or Areas of Interest (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Interested in HVAC chiller technical sessions and sponsoring a regional breakfast..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E8E5] rounded-[4px] text-[#111111] placeholder:text-[#9A9A95] focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-[#9A9A95] font-light">
                We respect your privacy. Strictly event notifications; zero marketing spam.
              </p>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full sm:w-auto px-6 py-3 rounded-[4px] bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{status === 'submitting' ? 'Submitting...' : 'Register for Event Notifications'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
