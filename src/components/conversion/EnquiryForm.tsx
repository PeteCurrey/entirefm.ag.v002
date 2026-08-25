'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2, Shield, AlertCircle, Loader2, ArrowRight, Home, Layers } from 'lucide-react';
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
  variant?: 'dark' | 'light';
  selectedService?: string;
  onServiceChange?: (service: string) => void;
  className?: string;
}

export function EnquiryForm({
  defaultService = 'Total Facilities Management',
  defaultLocation = 'United Kingdom',
  pageType = 'commercial-service',
  sector = 'Commercial Property',
  headline = 'Tell Us What You Need',
  subheadline = 'Give us a little information about your estate or requirement and the right member of the EntireFM team will review it.',
  ctaText = 'Send Enquiry',
  badgeText = 'Commercial Enquiry',
  variant = 'light',
  selectedService,
  onServiceChange,
  className = '',
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
    serviceRequired: selectedService || defaultService,
    message: '',
  });

  // Sync external selectedService when changed (e.g. from contact pathway clicks)
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, serviceRequired: selectedService }));
    }
  }, [selectedService]);

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
        service: formData.serviceRequired || defaultService,
        sector: sector,
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
        utm_term: searchParams.get('utm_term') || '',
        utm_content: searchParams.get('utm_content') || '',
      });
    }
  }, [defaultLocation, defaultService, formData.serviceRequired, pageType, sector]);

  const handleServiceSelect = (val: string) => {
    setFormData(prev => ({ ...prev, serviceRequired: val }));
    if (onServiceChange) {
      onServiceChange(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Pull full multi-touch journey attribution safely from session memory
    let attribution = {
      first_touch_url: '',
      first_touch_referrer: '',
      last_touch_url: '',
      journey_trail: [] as any[],
      assisted_pages: [] as string[],
    };

    if (typeof window !== 'undefined') {
      try {
        const firstTouch = sessionStorage.getItem('efm_first_touch') || sessionStorage.getItem('efm_landing_page') || window.location.pathname;
        const firstRef = sessionStorage.getItem('efm_first_referrer') || document.referrer || '';
        const rawTrail = JSON.parse(sessionStorage.getItem('efm_journey_trail') || '[]');
        const currentPath = window.location.pathname;
        const assisted = rawTrail.map((t: any) => t.path).filter((p: string) => p !== currentPath && p !== firstTouch);

        attribution = {
          first_touch_url: firstTouch,
          first_touch_referrer: firstRef,
          last_touch_url: currentPath,
          journey_trail: rawTrail,
          assisted_pages: Array.from(new Set(assisted)),
        };
      } catch {
        // Fallback
      }
    }

    const payload = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      company: formData.company,
      message: formData.message || `Requirement for ${formData.serviceRequired} at ${formData.siteLocation}`,
      ...formTracking,
      ...attribution,
      service: formData.serviceRequired,
      location: formData.siteLocation || 'United Kingdom',
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

  const isLight = variant === 'light';

  if (submitted) {
    return (
      <div
        className={`p-8 sm:p-12 rounded-sm text-center shadow-elevated relative overflow-hidden transition-all ${
          isLight
            ? 'bg-white border border-slate-200 text-slate-900'
            : 'bg-brand-carbon border border-brand-edge-dark text-white'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-pink-light via-brand-pink to-brand-magenta" />

        <div className="w-14 h-14 bg-gradient-to-br from-brand-pink-light/20 to-brand-magenta/20 text-brand-pink rounded-full flex items-center justify-center mx-auto mb-5 border border-brand-pink/30 shadow-subtle">
          <CheckCircle2 className="w-7 h-7 text-brand-pink" />
        </div>

        <span className="eyebrow text-xs uppercase tracking-wider text-brand-pink mb-2 block">
          Submission Successful
        </span>
        <h3
          className={`text-2xl sm:text-3xl font-light tracking-tight mb-3 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          Enquiry Received
        </h3>
        <p
          className={`text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          Thank you. Your enquiry has been submitted to EntireFM. An operations director or regional technical manager will review your estate requirements promptly.
        </p>

        {enquiryId && (
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-xs font-normal mb-6 ${
              isLight
                ? 'bg-slate-100 border border-slate-200 text-slate-800'
                : 'bg-brand-graphite border border-brand-edge-dark text-brand-pink-light'
            }`}
          >
            <span>Reference ID:</span>
            <strong className="text-brand-pink">{enquiryId}</strong>
          </div>
        )}

        <div
          className={`p-5 rounded-sm text-xs max-w-md mx-auto mb-8 text-left border ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-600'
              : 'bg-brand-graphite border-brand-edge-dark text-slate-300'
          }`}
        >
          <div className="font-normal text-sm mb-1 text-slate-900 dark:text-white">
            Need immediate operational assistance?
          </div>
          <p className="mb-2">
            For urgent plant breakdowns, emergency engineering, or contractor callout, contact our central operations desk directly:
          </p>
          <a
            href={CONTACT_CONFIG.mainPhone.href}
            className="text-brand-pink font-mono font-normal text-sm hover:underline inline-flex items-center gap-1.5"
          >
            {CONTACT_CONFIG.mainPhone.display}
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="btn btn-outline text-xs px-5 py-2.5 flex items-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/services"
            className="btn btn-secondary text-xs px-5 py-2.5 flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Explore Services</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      id="enquiry"
      className={`relative rounded-sm border p-6 sm:p-10 shadow-elevated transition-all duration-300 ${
        isLight
          ? 'bg-white border-brand-edge'
          : 'bg-brand-carbon border-brand-edge-dark'
      } ${className}`}
    >
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-pink-light via-brand-pink to-brand-magenta" />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
          <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
            {badgeText}
          </span>
        </div>
        <h2
          className={`text-2xl sm:text-3xl font-light tracking-tight mt-1 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          {headline}
        </h2>
        <p
          className={`text-sm mt-2.5 leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          {subheadline}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-light">Submission Error</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hidden Form Attribution Fields */}
        <input type="hidden" name="landing_page" value={formTracking.landing_page} />
        <input type="hidden" name="conversion_page" value={formTracking.conversion_page} />
        <input type="hidden" name="page_type" value={formTracking.page_type} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="fullName"
              className={`block text-xs font-normal tracking-tight mb-1.5 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              Contact Name <span className="text-brand-pink">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              required
              placeholder="e.g. David Richardson"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full px-4 py-3 rounded-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink ${
                isLight
                  ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                  : 'bg-brand-graphite border border-brand-edge-dark text-white placeholder:text-slate-500'
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className={`block text-xs font-normal tracking-tight mb-1.5 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              Company / Organisation <span className="text-brand-pink">*</span>
            </label>
            <input
              type="text"
              id="company"
              required
              placeholder="e.g. Aviva Investors / Prologis UK"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className={`w-full px-4 py-3 rounded-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink ${
                isLight
                  ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                  : 'bg-brand-graphite border border-brand-edge-dark text-white placeholder:text-slate-500'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="email"
              className={`block text-xs font-normal tracking-tight mb-1.5 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              Work Email <span className="text-brand-pink">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="e.g. d.richardson@company.co.uk"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink ${
                isLight
                  ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                  : 'bg-brand-graphite border border-brand-edge-dark text-white placeholder:text-slate-500'
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className={`block text-xs font-normal tracking-tight mb-1.5 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              Contact Telephone
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="e.g. 020 7946 0000"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 rounded-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink ${
                isLight
                  ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                  : 'bg-brand-graphite border border-brand-edge-dark text-white placeholder:text-slate-500'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="serviceRequired"
              className={`block text-xs font-normal tracking-tight mb-1.5 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              What do you need help with? <span className="text-brand-pink">*</span>
            </label>
            <select
              id="serviceRequired"
              value={formData.serviceRequired}
              onChange={e => handleServiceSelect(e.target.value)}
              className={`w-full px-4 py-3 rounded-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink ${
                isLight
                  ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white'
                  : 'bg-brand-graphite border border-brand-edge-dark text-white'
              }`}
            >
              <option value="Total Facilities Management">Total Facilities Management</option>
              <option value="Drone Services (Aerial Survey & Inspection)">Drone Services (Aerial Survey & Inspection)</option>
              <option value="Drone Roof & Gutter Survey">Drone Roof & Gutter Survey</option>
              <option value="Façade & Building Envelope Drone Survey">Façade & Building Envelope Drone Survey</option>
              <option value="Thermal Drone Survey & Heat Loss Audit">Thermal Drone Survey & Heat Loss Audit</option>
              <option value="Solar PV Drone Inspection">Solar PV Drone Inspection</option>
              <option value="Construction Progress Drone Monitoring">Construction Progress Drone Monitoring</option>
              <option value="Drone Surveying & 3D Reality Capture">Drone Surveying & 3D Reality Capture</option>
              <option value="Mechanical & Electrical (M&E)">Mechanical & Electrical (M&E)</option>
              <option value="HVAC & Air Conditioning">HVAC & Air Conditioning</option>
              <option value="Planned Maintenance (PPM)">Planned Maintenance (PPM)</option>
              <option value="Hard FM Services">Hard FM Services</option>
              <option value="Working at Height & Rope Access">Working at Height & Rope Access</option>
              <option value="Commercial Cleaning">Commercial Cleaning</option>
              <option value="Industrial Cleaning">Industrial Cleaning</option>
              <option value="Building Fabric Maintenance">Building Fabric Maintenance</option>
              <option value="Site Survey / Technical Review">Site Survey / Technical Review</option>
              <option value="Existing Client Support">Existing Client Support</option>
              <option value="Tender / Framework Proposal">Tender / Framework Proposal</option>
              <option value="Other / Multiple Services">Other / Multiple Services</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="siteLocation"
              className={`block text-xs font-normal tracking-tight mb-1.5 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              Site / Portfolio Location
            </label>
            <input
              type="text"
              id="siteLocation"
              placeholder="e.g. Greater London, Midlands, Multi-site UK..."
              value={formData.siteLocation}
              onChange={e => setFormData({ ...formData, siteLocation: e.target.value })}
              className={`w-full px-4 py-3 rounded-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink ${
                isLight
                  ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                  : 'bg-brand-graphite border border-brand-edge-dark text-white placeholder:text-slate-500'
              }`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className={`block text-xs font-normal tracking-tight mb-1.5 ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}
          >
            Requirement Details / Scope of Work <span className="text-brand-pink">*</span>
          </label>
          <textarea
            id="message"
            rows={4}
            required
            placeholder="Please outline your estate type, square footage or number of sites, current FM arrangement, key challenges, or upcoming tender timelines..."
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            className={`w-full px-4 py-3 rounded-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink ${
              isLight
                ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                : 'bg-brand-graphite border border-brand-edge-dark text-white placeholder:text-slate-500'
            }`}
          />
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-brand-pink shrink-0" />
            <span>Strict commercial confidentiality. Data protected under UK GDPR.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-hero-pink w-full sm:w-auto px-9 py-3.5 text-sm font-normal shadow-elevated disabled:opacity-50 flex items-center justify-center gap-2 rounded-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Enquiry...</span>
              </>
            ) : (
              <>
                <span>{ctaText}</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

