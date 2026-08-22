import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { CONTACT_CONFIG } from '@/config/contact';

export function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-brand-border-dark text-slate-300">
      {/* Top CTA Band */}
      <div className="border-b border-brand-border-dark/70 py-12 bg-brand-charcoal/50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="badge-gold mb-2">Operational Excellence & Compliance</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
                Need Total Facilities Management or Specialist Engineering?
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl mt-1">
                Consult with our engineering and estate management team for scheduled PPM, compliance reviews, or 24/7 reactive service.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a href={CONTACT_CONFIG.mainPhone.href} className="btn-phone text-xs py-3 px-4">
                <Phone className="w-3.5 h-3.5 text-brand-gold" />
                <span>Call {CONTACT_CONFIG.mainPhone.display}</span>
              </a>
              <Link href="/contact-us#proposal" className="btn-primary text-xs py-3 px-5">
                Request Estate Proposal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Link Grid */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: About & Operations */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src="/logos/06-crystalline-colour-mark.webp"
                  alt="EntireFM Mark"
                  fill
                  className="object-contain drop-shadow-sm"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center">
                ENTIRE<span className="text-brand-gold ml-1">FM</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Entire Facilities Management delivers single-source hard FM, mechanical & electrical, compliance testing, industrial cleaning, and specialist services across the UK.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2 border-t border-brand-border-dark/60">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                <span>National Coverage · Regional Engineering Depots</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <a href={CONTACT_CONFIG.mainPhone.href} className="hover:text-white transition-colors">
                  {CONTACT_CONFIG.mainPhone.display}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <a href={`mailto:${CONTACT_CONFIG.enquiryEmail}`} className="hover:text-white transition-colors">
                  {CONTACT_CONFIG.enquiryEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Hard FM & Engineering */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-white mb-4 pb-2 border-b border-brand-border-dark flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
              Hard FM & M&E
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/mechanical-electrical" className="hover:text-white transition-colors">Mechanical & Electrical Services</Link></li>
              <li><Link href="/hvac-contractor" className="hover:text-white transition-colors">HVAC Contractor & Ventilation</Link></li>
              <li><Link href="/ppm" className="hover:text-white transition-colors">Planned Preventative Maintenance</Link></li>
              <li><Link href="/hard-services" className="hover:text-white transition-colors">Hard Facilities Management</Link></li>
              <li><Link href="/plumbing-gas" className="hover:text-white transition-colors">Commercial Plumbing & Gas</Link></li>
              <li><Link href="/fire-emergency-systems" className="hover:text-white transition-colors">Fire & Emergency Systems</Link></li>
              <li><Link href="/safety-critical-emergency-systems" className="hover:text-white transition-colors">Safety-Critical Emergency Systems</Link></li>
              <li><Link href="/building-maintenance" className="hover:text-white transition-colors">Commercial Building Maintenance</Link></li>
              <li><Link href="/mechanical-electrical/emergency-light-testing" className="hover:text-white transition-colors">Emergency Light Testing</Link></li>
              <li><Link href="/mechanical-electrical/access-control" className="hover:text-white transition-colors">Access Control Systems</Link></li>
              <li><Link href="/aerial-drone-building-inspection" className="hover:text-white transition-colors">Drone Building Inspection</Link></li>
            </ul>
          </div>

          {/* Col 3: Soft FM & Cleaning */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-white mb-4 pb-2 border-b border-brand-border-dark flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
              Soft FM & Cleaning
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/industrial-cleaning" className="hover:text-white transition-colors">Industrial Cleaning Services</Link></li>
              <li><Link href="/cleaning-services" className="hover:text-white transition-colors">Commercial Cleaning Services</Link></li>
              <li><Link href="/contract-cleaning" className="hover:text-white transition-colors">Contract Cleaning</Link></li>
              <li><Link href="/office-cleaning" className="hover:text-white transition-colors">Commercial Office Cleaning</Link></li>
              <li><Link href="/pressure-washing" className="hover:text-white transition-colors">Commercial Pressure Washing</Link></li>
              <li><Link href="/window-cleaning" className="hover:text-white transition-colors">Commercial Window Cleaning</Link></li>
              <li><Link href="/soft-services" className="hover:text-white transition-colors">Soft Facilities Management</Link></li>
              <li><Link href="/security-services" className="hover:text-white transition-colors">Security Guarding & Patrols</Link></li>
              <li><Link href="/concierge-services" className="hover:text-white transition-colors">Front of House Concierge</Link></li>
              <li><Link href="/washroom-management" className="hover:text-white transition-colors">Washroom Hygiene Services</Link></li>
              <li><Link href="/grounds-maintenance" className="hover:text-white transition-colors">Grounds Maintenance</Link></li>
            </ul>
          </div>

          {/* Col 4: Sector Solutions */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-white mb-4 pb-2 border-b border-brand-border-dark flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
              Sectors Served
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/industrial-facilities-management" className="hover:text-white transition-colors">Industrial & Manufacturing</Link></li>
              <li><Link href="/commercial-facilities-management" className="hover:text-white transition-colors">Commercial & Corporate Offices</Link></li>
              <li><Link href="/logistics-facilities-management" className="hover:text-white transition-colors">Logistics & Distribution</Link></li>
              <li><Link href="/warehouse-facilities-management" className="hover:text-white transition-colors">Warehouse Facilities Management</Link></li>
              <li><Link href="/retail-facilities-management" className="hover:text-white transition-colors">Retail Parks & Stores</Link></li>
              <li><Link href="/healthcare-facilities-management" className="hover:text-white transition-colors">Healthcare & Clinical FM</Link></li>
              <li><Link href="/education-facilities-management" className="hover:text-white transition-colors">Education, Schools & Universities</Link></li>
              <li><Link href="/public-sector-facilities-management" className="hover:text-white transition-colors">Public Sector & Local Authority</Link></li>
              <li><Link href="/residential-facilities-management" className="hover:text-white transition-colors">Block & Residential Management</Link></li>
              <li><Link href="/hotel-facilities-management" className="hover:text-white transition-colors">Hospitality & Hotels</Link></li>
              <li><Link href="/sectors" className="text-brand-gold hover:text-brand-gold-light flex items-center gap-1 font-semibold pt-1">View All Sectors <ArrowRight className="w-3 h-3" /></Link></li>
            </ul>
          </div>

          {/* Col 5: Major Locations & London Architecture */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-white mb-4 pb-2 border-b border-brand-border-dark flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
              Key Regional Hubs
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/fm-london" className="text-brand-gold hover:text-brand-gold-light font-semibold">FM London (24/7 Response)</Link></li>
              <li><Link href="/facilities-management-london" className="hover:text-white transition-colors">Facilities Management London</Link></li>
              <li><Link href="/london-facilities-management" className="hover:text-white transition-colors">London FM (Corporate)</Link></li>
              <li><Link href="/facilities-management-manchester" className="hover:text-white transition-colors">Manchester FM Hub</Link></li>
              <li><Link href="/facilities-management-birmingham" className="hover:text-white transition-colors">Birmingham & Midlands</Link></li>
              <li><Link href="/facilities-management-sheffield" className="hover:text-white transition-colors">Sheffield & South Yorkshire</Link></li>
              <li><Link href="/facilities-management-leeds" className="hover:text-white transition-colors">Leeds & West Yorkshire</Link></li>
              <li><Link href="/facilities-management-lincoln" className="hover:text-white transition-colors">Lincoln Regional Centre</Link></li>
              <li><Link href="/facilities-management-liverpool" className="hover:text-white transition-colors">Liverpool & Merseyside</Link></li>
              <li><Link href="/facilities-management-nottingham" className="hover:text-white transition-colors">Nottingham Hub</Link></li>
              <li><Link href="/locations" className="text-brand-gold hover:text-brand-gold-light flex items-center gap-1 font-semibold pt-1">All 22+ Locations Hub <ArrowRight className="w-3 h-3" /></Link></li>
            </ul>
          </div>
        </div>

        {/* Compliance & Quality Statement */}
        <div className="mt-12 pt-8 border-t border-brand-border-dark/80">
          <p className="text-[10px] text-slate-500 text-center leading-relaxed max-w-2xl mx-auto">
            Entire FM operates under a managed quality framework covering statutory compliance,
            planned maintenance scheduling, and building services delivery across all active contracts.
            Accreditation and certification details are available upon request during procurement.
          </p>
        </div>

        {/* Legal, Copyright & Claims Verification Notice */}
        <div className="mt-10 pt-6 border-t border-brand-border-dark/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Entire Facilities Management Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/accessibility-statement" className="hover:text-white transition-colors">Accessibility</Link>
            <Link href="/helpdesk" className="hover:text-white transition-colors">Helpdesk Portal</Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-4">
          All technical specifications, accreditations, and emergency response SLAs are subject to contractual terms. Only verified claims in BUSINESS-CLAIMS-VERIFICATION.md represent binding operational standards.
        </p>
      </div>
    </footer>
  );
}
