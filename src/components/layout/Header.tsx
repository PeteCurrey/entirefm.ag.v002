'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, ChevronDown, Menu, X, ArrowRight, ShieldCheck, Building2, Wrench, MapPin, Layers } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-brand-navy/95 backdrop-blur-md shadow-elevated border-b border-brand-border-dark' : 'bg-brand-navy border-b border-brand-border-dark'}`}>
      {/* Top Utility Bar */}
      <div className="hidden lg:block bg-brand-charcoal border-b border-brand-border-dark/60 text-slate-300 text-xs py-1.5">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              National Facilities Management & Engineering
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">24/7 Operations Helpdesk Available</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Emergency & Operations:</span>
            <a href="tel:0800000000" className="text-brand-gold font-semibold hover:text-brand-gold-light transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3" />
              [0800 NUMBER TO VERIFY]
            </a>
            <span className="text-slate-500">|</span>
            <Link href="/client-login" className="hover:text-white transition-colors">Client Portal</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 bg-brand-gold flex items-center justify-center font-bold text-brand-navy text-xl tracking-tighter rounded-sm shadow-subtle group-hover:bg-brand-gold-light transition-colors">
              EFM
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-slate-100 transition-colors">
                Entire <span className="text-brand-gold">FM</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-mono">
                Total Facilities Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMegaMenu('services')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors ${activeMegaMenu === 'services' ? 'text-brand-gold' : 'text-slate-200 hover:text-white'}`}
                aria-expanded={activeMegaMenu === 'services'}
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMegaMenu === 'services' ? 'rotate-180 text-brand-gold' : 'text-slate-400'}`} />
              </button>

              {activeMegaMenu === 'services' && (
                <div className="absolute top-full left-0 w-[640px] bg-brand-charcoal border border-brand-border-dark shadow-command p-6 rounded-b-sm grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-brand-gold mb-3 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" /> Hard FM & Engineering
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>
                        <Link href="/mechanical-electrical" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Mechanical & Electrical</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/hvac-contractor" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>HVAC & Air Conditioning</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/ppm" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Planned Maintenance (PPM)</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/hard-services" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Hard FM Services</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/plumbing-gas" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Commercial Plumbing & Gas</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/fire-emergency-systems" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Fire & Emergency Systems</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-brand-gold mb-3 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Soft FM & Specialist Services
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>
                        <Link href="/industrial-cleaning" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Industrial Cleaning</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/cleaning-services" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Commercial Cleaning</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/soft-services" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Soft FM Solutions</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/security-services" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Security & Access Control</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/mobile-crane-hire" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center justify-between group">
                          <span>Specialist Crane Hire</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                        </Link>
                      </li>
                    </ul>
                    <div className="mt-4 pt-3 border-t border-brand-border-dark">
                      <Link href="/services" className="text-xs font-semibold text-brand-gold hover:text-brand-gold-light flex items-center gap-1">
                        View All Services Hub <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sectors Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMegaMenu('sectors')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors ${activeMegaMenu === 'sectors' ? 'text-brand-gold' : 'text-slate-200 hover:text-white'}`}
                aria-expanded={activeMegaMenu === 'sectors'}
              >
                Sectors
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMegaMenu === 'sectors' ? 'rotate-180 text-brand-gold' : 'text-slate-400'}`} />
              </button>

              {activeMegaMenu === 'sectors' && (
                <div className="absolute top-full left-0 w-[420px] bg-brand-charcoal border border-brand-border-dark shadow-command p-6 rounded-b-sm animate-in fade-in slide-in-from-top-2 duration-150">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-brand-gold mb-3 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Sector Expertise
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                    <Link href="/industrial-facilities-management" className="hover:text-white hover:text-brand-gold py-1">Industrial & Manufacturing</Link>
                    <Link href="/commercial-facilities-management" className="hover:text-white hover:text-brand-gold py-1">Commercial & Corporate</Link>
                    <Link href="/logistics-facilities-management" className="hover:text-white hover:text-brand-gold py-1">Logistics & Warehousing</Link>
                    <Link href="/retail-facilities-management" className="hover:text-white hover:text-brand-gold py-1">Retail & Shopping Centres</Link>
                    <Link href="/education-facilities-management" className="hover:text-white hover:text-brand-gold py-1">Education & Campuses</Link>
                    <Link href="/healthcare-facilities-management" className="hover:text-white hover:text-brand-gold py-1">Healthcare & Medical</Link>
                    <Link href="/public-sector-facilities-management" className="hover:text-white hover:text-brand-gold py-1">Public Sector & Civic</Link>
                    <Link href="/residential-facilities-management" className="hover:text-white hover:text-brand-gold py-1">Block & Residential FM</Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-brand-border-dark">
                    <Link href="/sectors" className="text-xs font-semibold text-brand-gold hover:text-brand-gold-light flex items-center gap-1">
                      View All Sectors Hub <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Locations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMegaMenu('locations')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors ${activeMegaMenu === 'locations' ? 'text-brand-gold' : 'text-slate-200 hover:text-white'}`}
                aria-expanded={activeMegaMenu === 'locations'}
              >
                Locations
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMegaMenu === 'locations' ? 'rotate-180 text-brand-gold' : 'text-slate-400'}`} />
              </button>

              {activeMegaMenu === 'locations' && (
                <div className="absolute top-full left-0 w-[540px] bg-brand-charcoal border border-brand-border-dark shadow-command p-6 rounded-b-sm animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-bold tracking-wider uppercase text-brand-gold mb-3 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> London FM Hubs
                      </h3>
                      <ul className="space-y-1.5 text-sm text-slate-300">
                        <li>
                          <Link href="/fm-london" className="hover:text-white block">
                            <span className="font-semibold text-white">FM London</span>
                            <span className="block text-xs text-slate-400">24/7 Operations & Rapid Response</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/facilities-management-london" className="hover:text-white block">
                            <span className="font-semibold text-white">Facilities Management London</span>
                            <span className="block text-xs text-slate-400">Total FM & Planned Maintenance</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/london-facilities-management" className="hover:text-white block">
                            <span className="font-semibold text-white">London Facilities Management</span>
                            <span className="block text-xs text-slate-400">Corporate & Managing Agents</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/industrial-cleaning-london" className="hover:text-white text-xs text-slate-400 hover:text-brand-gold">
                            → London Industrial Cleaning
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold tracking-wider uppercase text-brand-gold mb-3 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Regional Hubs
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                        <Link href="/facilities-management-manchester" className="hover:text-brand-gold">Manchester</Link>
                        <Link href="/facilities-management-birmingham" className="hover:text-brand-gold">Birmingham</Link>
                        <Link href="/facilities-management-sheffield" className="hover:text-brand-gold">Sheffield</Link>
                        <Link href="/facilities-management-leeds" className="hover:text-brand-gold">Leeds</Link>
                        <Link href="/facilities-management-lincoln" className="hover:text-brand-gold">Lincoln</Link>
                        <Link href="/facilities-management-liverpool" className="hover:text-brand-gold">Liverpool</Link>
                        <Link href="/facilities-management-nottingham" className="hover:text-brand-gold">Nottingham</Link>
                        <Link href="/facilities-management-chesterfield" className="hover:text-brand-gold">Chesterfield</Link>
                      </div>
                      <div className="mt-4 pt-3 border-t border-brand-border-dark">
                        <Link href="/locations" className="text-xs font-semibold text-brand-gold hover:text-brand-gold-light flex items-center gap-1">
                          View All 22+ Locations Hub <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/case-studies" className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors">
              Case Studies
            </Link>
            <Link href="/blog" className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors">
              Insights
            </Link>
            <Link href="/about-entire-facilities-management" className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact-us" className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          {/* Header Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:0800000000"
              className="btn-phone text-xs"
              title="Call Entire FM Operations"
            >
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              <span>[PHONE TO VERIFY]</span>
            </a>
            <Link href="/contact-us#proposal" className="btn-primary text-xs py-2.5 px-4">
              Request Proposal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="tel:0800000000"
              className="p-2 text-brand-gold bg-brand-charcoal border border-brand-border-dark rounded-sm"
              aria-label="Call EntireFM"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white bg-brand-charcoal border border-brand-border-dark rounded-sm focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-brand-gold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-charcoal border-b border-brand-border-dark px-4 pt-3 pb-8 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1 border-b border-brand-border-dark/60 pb-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-white hover:text-brand-gold"
            >
              Home
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-white hover:text-brand-gold"
            >
              Services & Capabilities
            </Link>
            <div className="pl-3 border-l border-brand-border-dark space-y-1 text-sm text-slate-300">
              <Link href="/mechanical-electrical" onClick={() => setMobileMenuOpen(false)} className="block py-1">Mechanical & Electrical</Link>
              <Link href="/hvac-contractor" onClick={() => setMobileMenuOpen(false)} className="block py-1">HVAC Contractor</Link>
              <Link href="/ppm" onClick={() => setMobileMenuOpen(false)} className="block py-1">Planned Maintenance (PPM)</Link>
              <Link href="/industrial-cleaning" onClick={() => setMobileMenuOpen(false)} className="block py-1">Industrial Cleaning</Link>
            </div>

            <Link
              href="/sectors"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-white hover:text-brand-gold pt-2"
            >
              Sectors
            </Link>
            <div className="pl-3 border-l border-brand-border-dark space-y-1 text-sm text-slate-300">
              <Link href="/industrial-facilities-management" onClick={() => setMobileMenuOpen(false)} className="block py-1">Industrial & Logistics</Link>
              <Link href="/commercial-facilities-management" onClick={() => setMobileMenuOpen(false)} className="block py-1">Commercial & Corporate</Link>
            </div>

            <Link
              href="/locations"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-white hover:text-brand-gold pt-2"
            >
              Locations (UK Coverage)
            </Link>
            <div className="pl-3 border-l border-brand-border-dark space-y-1 text-sm text-slate-300">
              <Link href="/fm-london" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-brand-gold">FM London (24/7 Operations)</Link>
              <Link href="/facilities-management-london" onClick={() => setMobileMenuOpen(false)} className="block py-1">Facilities Management London</Link>
              <Link href="/london-facilities-management" onClick={() => setMobileMenuOpen(false)} className="block py-1">London FM (Corporate)</Link>
              <Link href="/facilities-management-manchester" onClick={() => setMobileMenuOpen(false)} className="block py-1">Manchester</Link>
              <Link href="/facilities-management-birmingham" onClick={() => setMobileMenuOpen(false)} className="block py-1">Birmingham</Link>
            </div>

            <Link href="/case-studies" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-white hover:text-brand-gold">Case Studies</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-white hover:text-brand-gold">Insights</Link>
            <Link href="/about-entire-facilities-management" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-white hover:text-brand-gold">About</Link>
            <Link href="/contact-us" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-white hover:text-brand-gold">Contact</Link>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/contact-us#proposal"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full py-3 text-center"
            >
              Request Proposal
            </Link>
            <a
              href="tel:0800000000"
              className="btn-phone w-full py-2.5 text-center text-xs"
            >
              Call [PHONE TO VERIFY]
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
