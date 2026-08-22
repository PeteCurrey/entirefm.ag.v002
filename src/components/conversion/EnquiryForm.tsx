'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

interface EnquiryFormProps {
  defaultService?: string;
  defaultLocation?: string;
  pageType?: string;
  sector?: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  badgeText?: string;
}

export function EnquiryForm({
  defaultService = 'Total Facilities Management',
  defaultLocation = 'United Kingdom',
  pageType = 'commercial-service',
  sector = 'Commercial Property',
  headline = 'Request a Facilities Management Proposal',
  subheadline = 'Speak with our technical engineering and estates team. We provide bespoke FM contract scopes, planned maintenance reviews, and site surveys.',
  ctaText = 'Submit Proposal Request',
  badgeText = 'Commercial Enquiry',
}: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enquiryId, setEnquiryId] = useState<string>('');

  const [formTracking, setFormTracking] = useState({
    landing_page: '',
    conversion_page: '',
    page_type: pageType,
    location: defaultLocation,
    service: defaultService,
    sector: sector,
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  });

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    siteLocation: defaultLocation,
    serviceRequired: defaultService,
    estimatedSize: 'Single Site',
    message: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      const storedLanding = sessionStorage.getItem('efm_landing_page') || currentUrl;
      sessionStorage.setItem('efm_landing_page', storedLanding);

      setFormTracking({
        landing_page: storedLanding,
        conversion_page: currentUrl,
        page_type: pageType,
        location: defaultLocation,
        service: defaultService,
        sector: sector,
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
        utm_term: searchParams.get('utm_term') || '',
        utm_content: searchParams.get('utm_content') || '',
      });
    }
  }, [defaultLocation, defaultService, pageType, sector]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      message: formData.message || `Requirement for ${formData.serviceRequired} at ${formData.siteLocation}`,
      ...formTracking,
      service: formData.serviceRequired,
      location: formData.siteLocation,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Submission failed. Please try again.');
      }

      setEnquiryId(data.enquiryId || '');
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error. Please check your connection.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-brand-charcoal border border-brand-border-dark p-8 sm:p-10 rounded-sm text-center text-white shadow-command">
        <div className="w-12 h-12 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-gold/40">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Proposal Request Received</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto mb-4">
          Thank you. An EntireFM technical surveyor or regional account manager will review your estate requirements and contact you promptly.
        </p>
        {enquiryId && (
          <p className="text-xs text-brand-gold font-mono mb-6">
            Reference: {enquiryId}
          </p>
        )}
        <div className="p-4 bg-brand-navy border border-brand-border-dark rounded-sm text-xs text-slate-400 max-w-sm mx-auto">
          For urgent facilities engineering assistance, contact our central helpdesk: <br />
          <strong className="text-brand-gold font-mono text-sm">{CONTACT_CONFIG.mainPhone.display}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-charcoal border border-brand-border-dark rounded-sm p-6 sm:p-10 text-white shadow-command relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold"></div>

      <div className="mb-6">
        <span className="badge-gold mb-2">{badgeText}</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          {headline}
        </h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          {subheadline}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-sm flex items-center gap-3 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden Form Attribution Fields */}
        <input type="hidden" name="landing_page" value={formTracking.landing_page} />
        <input type="hidden" name="conversion_page" value={formTracking.conversion_page} />
        <input type="hidden" name="page_type" value={formTracking.page_type} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 mb-1">
              Contact Name <span className="text-brand-gold">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              required
              placeholder="e.g. John Smith"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-brand-navy border border-brand-border-dark rounded-sm text-sm text-white placeholder:text-slate-500 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-xs font-semibold text-slate-300 mb-1">
              Company / Organisation <span className="text-brand-gold">*</span>
            </label>
            <input
              type="text"
              id="company"
              required
              placeholder="e.g. Acme Properties Ltd"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-brand-navy border border-brand-border-dark rounded-sm text-sm text-white placeholder:text-slate-500 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1">
              Business Email <span className="text-brand-gold">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="e.g. jsmith@company.co.uk"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-brand-navy border border-brand-border-dark rounded-sm text-sm text-white placeholder:text-slate-500 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-1">
              Contact Telephone <span className="text-brand-gold">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              required
              placeholder="e.g. 020 7946 0000"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-brand-navy border border-brand-border-dark rounded-sm text-sm text-white placeholder:text-slate-500 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="serviceRequired" className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Service Requirement
            </label>
            <select
              id="serviceRequired"
              value={formData.serviceRequired}
              onChange={e => setFormData({ ...formData, serviceRequired: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-brand-navy border border-brand-border-dark rounded-sm text-sm text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
            >
              <option value="Total Facilities Management">Total Facilities Management</option>
              <option value="Mechanical & Electrical (M&E)">Mechanical & Electrical (M&E)</option>
              <option value="HVAC & Air Conditioning">HVAC & Air Conditioning</option>
              <option value="Planned Maintenance (PPM)">Planned Maintenance (PPM)</option>
              <option value="Hard FM Services">Hard FM Services</option>
              <option value="Industrial Cleaning">Industrial Cleaning</option>
              <option value="Commercial Cleaning">Commercial Cleaning</option>
              <option value="Specialist / Crane Hire">Specialist / Crane Hire</option>
              <option value="Other / Multiple Services">Other / Multiple Services</option>
            </select>
          </div>

          <div>
            <label htmlFor="siteLocation" className="block text-xs font-semibold text-slate-300 mb-1">
              Site / Portfolio Location
            </label>
            <input
              type="text"
              id="siteLocation"
              placeholder="e.g. Central London, Nationwide, Manchester..."
              value={formData.siteLocation}
              onChange={e => setFormData({ ...formData, siteLocation: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-brand-navy border border-brand-border-dark rounded-sm text-sm text-white placeholder:text-slate-500 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-semibold text-slate-300 mb-1">
            Requirement Details / Scope of Work
          </label>
          <textarea
            id="message"
            rows={3}
            placeholder="Please detail your building type, current maintenance challenges, PPM scope, or urgent service needs..."
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-brand-navy border border-brand-border-dark rounded-sm text-sm text-white placeholder:text-slate-500 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
          ></textarea>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-brand-gold shrink-0" />
            <span>Strict confidentiality. No third-party data sharing.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-bold shadow-command disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{ctaText}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
