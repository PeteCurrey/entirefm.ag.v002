'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  ArrowRight,
  ArrowUpRight,
  Wrench,
  ShieldCheck,
  Building2,
  MapPin,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ALL_ROUTES } from '@/lib/routes/route-registry';
import { PRIMARY_NAV, SECONDARY_NAV } from '@/config/navigation';

export interface SearchResultItem {
  id: string;
  title: string;
  href: string;
  category: 'Services' | 'Locations' | 'Sectors' | 'Tools' | 'Compliance' | 'Intelligence & Guides' | 'Suppliers & Contractors' | 'Company & Portals';
  breadcrumb: string;
  description?: string;
  aliases?: string[];
  priority?: number; // Higher number = higher priority
}

// Synonyms & Aliases dictionary for forgiving matching
const KEYWORD_ALIASES: Record<string, string[]> = {
  '/mechanical-electrical': ['m&e', 'me', 'mechanical', 'electrical', 'building engineering', 'hvac engineering', 'hard fm', 'm and e'],
  '/ppm': ['planned preventative maintenance', 'ppm', 'maintenance schedule', 'asset care', 'preventative maintenance', 'planned maintenance'],
  '/facilities-management-london': ['london fm', 'london facilities', 'london office maintenance', 'capital fm', 'greater london'],
  '/hvac-contractor': ['air conditioning', 'ac', 'chillers', 'f-gas', 'ventilation', 'heating', 'cooling', 'ahu', 'climate control'],
  '/fire-emergency-systems': ['fire safety', 'fire alarm', 'emergency lighting', 'smoke detection', 'fire risk assessment', 'life safety', 'fire'],
  '/cleaning-services': ['commercial cleaning', 'office cleaning', 'janitorial', 'daily cleaning', 'hygiene', 'deep cleaning'],
  '/working-at-height-rope-access-bmu': ['rope access', 'working at height', 'bmu', 'cradle maintenance', 'abseiling', 'facade access', 'height'],
  '/services/drone-services/drone-inspections': ['drone inspections', 'aerial survey', 'thermal drone', 'roof drone', 'high level survey', 'uav'],
  '/compliance/fixed-wire-testing-eicr': ['eicr', 'fixed wire testing', 'electrical testing', 'periodic inspection', 'electrical certificate'],
  '/compliance/legionella-water-hygiene': ['water hygiene', 'legionella testing', 'l8', 'water risk assessment', 'temperature monitoring', 'water'],
  '/compliance': ['compliance centre', 'statutory compliance', 'regulations', 'duty holder', 'building safety act', 'bsa'],
  '/tools/ppm-schedule-builder': ['ppm schedule builder', 'ppm calculator', 'maintenance builder', 'asset calculator', 'ppm tool'],
  '/tools/compliance-checker': ['compliance checker', 'statutory checker', 'compliance audit', 'legal obligations'],
  '/tools/fm-health-check': ['fm health check', 'audit tool', 'estate scorecard', 'facilities review'],
  '/tools/fm-roi-calculator': ['roi calculator', 'cost saving calculator', 'fm cost calculator'],
  '/tools/tender-brief': ['tender brief generator', 'rfp builder', 'fm tender template', 'procurement specification'],
  '/tools/compliance-calendar': ['compliance calendar', 'statutory dates', 'inspection calendar'],
  '/tools/ppm-estimator': ['ppm cost estimator', 'maintenance cost tool', 'quote estimate'],
  '/suppliers/partner-network': ['partner network', 'approved contractor', 'subcontractor network', 'supplier network', 'join supplier list'],
  '/suppliers': ['contractor centre', 'supplier centre', 'contractor portal', 'supply chain', 'trade partner'],
  '/client-portal': ['client portal', 'entirecafm', 'cafm login', 'work order tracker', 'helpdesk portal', 'live dashboard'],
  '/contact-us': ['contact entirefm', 'get in touch', 'request proposal', 'quote request', 'enquiry', 'speak to an engineer', 'phone number', 'email'],
  '/about-entire-facilities-management': ['about entirefm', 'company history', 'management team', 'who we are', 'entire fm'],
  '/careers': ['careers', 'jobs', 'join our team', 'engineering vacancies', 'recruitment', 'work with us'],
  '/lobby': ['the lobby', 'fm intelligence', 'daily briefing', 'the week that matters', 'compliance watch', 'engineers note', 'fm news'],
};

// Build high-relevance curated search corpus
function getPublicSearchCorpus(): SearchResultItem[] {
  const items: SearchResultItem[] = [];
  const seenPaths = new Set<string>();

  const add = (item: SearchResultItem) => {
    if (seenPaths.has(item.href) || item.href.startsWith('/admin') || item.href.startsWith('/api')) {
      return;
    }
    seenPaths.add(item.href);
    // Enrich with defined aliases
    if (KEYWORD_ALIASES[item.href]) {
      item.aliases = [...(item.aliases || []), ...KEYWORD_ALIASES[item.href]];
    }
    items.push(item);
  };

  // 1. Interactive Tools (Priority Core)
  const TOOLS_LIST: Array<{ title: string; href: string; breadcrumb: string; description: string; aliases: string[] }> = [
    {
      title: 'PPM Schedule Builder',
      href: '/tools/ppm-schedule-builder',
      breadcrumb: 'Interactive Tools → Maintenance Planning',
      description: 'Generate customized SFG20-aligned planned preventative maintenance schedules.',
      aliases: ['ppm builder', 'maintenance plan', 'asset schedule', 'calculator'],
    },
    {
      title: 'Compliance Checker',
      href: '/tools/compliance-checker',
      breadcrumb: 'Interactive Tools → Statutory Audit',
      description: 'Audit commercial premises against mandatory UK building compliance obligations.',
      aliases: ['compliance tool', 'statutory audit', 'legal check'],
    },
    {
      title: 'FM Health Check',
      href: '/tools/fm-health-check',
      breadcrumb: 'Interactive Tools → Estate Diagnostics',
      description: 'Assess estate efficiency, contractor risk, and asset operational performance.',
      aliases: ['healthcheck', 'estate review', 'diagnostic tool'],
    },
    {
      title: 'Compliance Calendar',
      href: '/tools/compliance-calendar',
      breadcrumb: 'Interactive Tools → Statutory Dates',
      description: 'Track statutory re-inspection intervals and recurring compliance cycles.',
      aliases: ['calendar', 'statutory dates', 'deadlines'],
    },
    {
      title: 'PPM Cost Estimator',
      href: '/tools/ppm-estimator',
      breadcrumb: 'Interactive Tools → Budgeting',
      description: 'Estimate commercial maintenance costs based on building footprint and asset density.',
      aliases: ['cost calculator', 'budget tool', 'pricing estimator'],
    },
    {
      title: 'FM ROI Calculator',
      href: '/tools/fm-roi-calculator',
      breadcrumb: 'Interactive Tools → Financial Model',
      description: 'Model potential expenditure reduction and asset lifecycle extension from proactive FM.',
      aliases: ['roi model', 'savings calculator'],
    },
    {
      title: 'Tender Brief Generator',
      href: '/tools/tender-brief',
      breadcrumb: 'Interactive Tools → Procurement',
      description: 'Build structured RFPs, scopes of work, and specification documents for FM tenders.',
      aliases: ['rfp tool', 'tender builder', 'specification generator'],
    },
    {
      title: 'Drone Inspection Planner',
      href: '/tools/drone-inspection-planner',
      breadcrumb: 'Interactive Tools → Aerial Surveys',
      description: 'Plan flight parameters, envelope surveys, and thermal imaging requirements.',
      aliases: ['drone tool', 'roof flight planner'],
    },
  ];

  TOOLS_LIST.forEach((t) => {
    add({
      id: t.href,
      title: t.title,
      href: t.href,
      category: 'Tools',
      breadcrumb: t.breadcrumb,
      description: t.description,
      aliases: t.aliases,
      priority: 95,
    });
  });

  // 2. Primary Navigation items
  PRIMARY_NAV.forEach((section) => {
    section.columns.forEach((col) => {
      col.links.forEach((link) => {
        let cat: SearchResultItem['category'] = 'Services';
        if (section.label === 'Suppliers' || link.href.startsWith('/suppliers')) cat = 'Suppliers & Contractors';
        else if (link.href.startsWith('/compliance')) cat = 'Compliance';
        else if (link.href.startsWith('/tools')) cat = 'Tools';
        else if (link.href.startsWith('/lobby')) cat = 'Intelligence & Guides';
        else if (link.href.startsWith('/sectors') || link.href.startsWith('/facilities-management-for')) cat = 'Sectors';

        add({
          id: link.href,
          title: link.label,
          href: link.href,
          category: cat,
          breadcrumb: `${section.label} → ${col.heading}`,
          description: link.detail,
          priority: 90,
        });
      });
    });
  });

  // 3. Secondary Navigation items & Direct Portals
  SECONDARY_NAV.forEach((link) => {
    let cat: SearchResultItem['category'] = 'Company & Portals';
    if (link.href.startsWith('/client-portal') || link.href.startsWith('/supplier-portal')) {
      cat = 'Company & Portals';
    }
    add({
      id: link.href,
      title: link.label,
      href: link.href,
      category: cat,
      breadcrumb: 'Company',
      priority: 80,
    });
  });

  // 4. Strategic Hubs and Key Portals
  add({
    id: '/lobby',
    title: 'The Lobby — Facilities Management Intelligence',
    href: '/lobby',
    category: 'Intelligence & Guides',
    breadcrumb: 'The Lobby → Briefing Room',
    description: 'Daily briefing room for UK facilities managers: statutory updates and engineering insights.',
    aliases: ['lobby', 'intelligence', 'briefing', 'the week that matters', 'compliance watch'],
    priority: 90,
  });

  add({
    id: '/client-portal',
    title: 'Client Portal (EntireCAFM)',
    href: '/client-portal',
    category: 'Company & Portals',
    breadcrumb: 'Portals → CAFM Console',
    description: 'Real-time work order tracking, statutory certificate register, and asset telemetry.',
    aliases: ['cafm', 'client portal', 'login', 'portal', 'dashboard'],
    priority: 85,
  });

  add({
    id: '/supplier-portal',
    title: 'Supplier & Contractor Portal',
    href: '/supplier-portal',
    category: 'Suppliers & Contractors',
    breadcrumb: 'Portals → Supply Chain',
    description: 'Contractor job assignment, compliance verification, and job sheets submission.',
    aliases: ['supplier portal', 'contractor portal', 'engineer login'],
    priority: 85,
  });

  add({
    id: '/compliance',
    title: 'Statutory Compliance Centre',
    href: '/compliance',
    category: 'Compliance',
    breadcrumb: 'Governance → Statutory Compliance',
    description: 'Complete guidance on UK statutory duties: Fire, Water Hygiene, Electrical, LOLER & Gas.',
    aliases: ['compliance', 'statutory', 'regulations', 'safety', 'building safety act'],
    priority: 90,
  });

  // 5. Complete public route registry (Services, Locations, Sectors, Legal, Compliance, Glossary)
  ALL_ROUTES.forEach((r) => {
    if (seenPaths.has(r.path) || r.path.startsWith('/admin') || r.path.startsWith('/api') || !r.indexable) {
      return;
    }

    let cat: SearchResultItem['category'] = 'Services';
    let breadcrumb = 'Services';

    if (r.routeType === 'location') {
      cat = 'Locations';
      breadcrumb = 'Locations → Nationwide Network';
    } else if (r.routeType === 'geographic-service') {
      cat = 'Locations';
      breadcrumb = 'Regional Services';
    } else if (r.routeType === 'sector') {
      cat = 'Sectors';
      breadcrumb = 'Sectors → Industry Specialisms';
    } else if (r.routeType === 'legal') {
      cat = 'Compliance';
      breadcrumb = 'Governance & Legal';
    } else if (r.routeType === 'company') {
      cat = 'Company & Portals';
      breadcrumb = 'EntireFM Company';
    } else if (r.routeType === 'glossary') {
      cat = 'Intelligence & Guides';
      breadcrumb = 'FM Glossary & Definitions';
    } else if (r.routeType === 'post') {
      cat = 'Intelligence & Guides';
      breadcrumb = 'Articles & Insights';
    } else if (r.path.startsWith('/suppliers')) {
      cat = 'Suppliers & Contractors';
      breadcrumb = 'Supply Chain & Contractors';
    } else if (r.path.startsWith('/compliance')) {
      cat = 'Compliance';
      breadcrumb = 'Statutory Compliance';
    } else if (r.path.startsWith('/resources') || r.path.startsWith('/tools')) {
      cat = 'Intelligence & Guides';
      breadcrumb = 'Resources & Guides';
    }

    // Derive a clean, human-readable title from the path slug
    const slug = r.path.split('/').filter(Boolean).pop() ?? r.path;
    let title = slug
      .replace(/-(?:fm|facilities-management)$/i, ' Facilities Management')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    // Clean up common acronyms
    title = title
      .replace(/\bFm\b/g, 'FM')
      .replace(/\bPpm\b/g, 'PPM')
      .replace(/\bHvac\b/g, 'HVAC')
      .replace(/\bEicr\b/g, 'EICR')
      .replace(/\bBms\b/g, 'BMS')
      .replace(/\bCafm\b/g, 'CAFM')
      .replace(/\bBmu\b/g, 'BMU')
      .replace(/\bPat\b/g, 'PAT')
      .replace(/\bLoler\b/g, 'LOLER')
      .replace(/\bUk\b/g, 'UK')
      .replace(/\bMe\b/g, 'M&E');

    add({
      id: r.path,
      title,
      href: r.path,
      category: cat,
      breadcrumb,
      priority: 60,
    });
  });

  return items;
}

// Map categories to visual icons
function getCategoryIcon(category: SearchResultItem['category']) {
  switch (category) {
    case 'Services':
      return <Wrench className="w-3.5 h-3.5" />;
    case 'Locations':
      return <MapPin className="w-3.5 h-3.5" />;
    case 'Sectors':
      return <Building2 className="w-3.5 h-3.5" />;
    case 'Tools':
      return <Sparkles className="w-3.5 h-3.5" />;
    case 'Compliance':
      return <ShieldCheck className="w-3.5 h-3.5" />;
    case 'Intelligence & Guides':
      return <FileText className="w-3.5 h-3.5" />;
    case 'Suppliers & Contractors':
      return <Briefcase className="w-3.5 h-3.5" />;
    case 'Company & Portals':
    default:
      return <Layers className="w-3.5 h-3.5" />;
  }
}

export function GlobalSearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const corpus = useMemo(() => getPublicSearchCorpus(), []);

  // Forgiving, weighted search matcher
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const searchTokens = q.split(/\s+/).filter(Boolean);

    // Score calculation per item
    const scored = corpus
      .map((item) => {
        const titleLower = item.title.toLowerCase();
        const pathLower = item.href.toLowerCase();
        const descLower = (item.description || '').toLowerCase();
        const catLower = item.category.toLowerCase();
        const breadcrumbLower = item.breadcrumb.toLowerCase();
        const aliases = item.aliases || [];

        let score = 0;

        // 1. Exact match on title or alias
        if (titleLower === q) {
          score += 150;
        } else if (aliases.some((a) => a === q)) {
          score += 140;
        }

        // 2. Starts with query
        if (titleLower.startsWith(q)) {
          score += 80;
        } else if (aliases.some((a) => a.startsWith(q))) {
          score += 70;
        }

        // 3. Multi-token evaluation
        let matchedTokens = 0;
        for (const token of searchTokens) {
          if (titleLower.includes(token)) {
            score += 40;
            matchedTokens++;
          } else if (aliases.some((a) => a.includes(token))) {
            score += 35;
            matchedTokens++;
          } else if (pathLower.includes(token)) {
            score += 20;
            matchedTokens++;
          } else if (descLower.includes(token)) {
            score += 15;
            matchedTokens++;
          } else if (breadcrumbLower.includes(token) || catLower.includes(token)) {
            score += 10;
            matchedTokens++;
          }
        }

        // Must match at least one token
        if (matchedTokens === 0) {
          return { item, score: 0 };
        }

        // Bonus for all tokens matching
        if (matchedTokens === searchTokens.length) {
          score += 30;
        }

        // Add base item priority
        score += (item.priority || 50) * 0.2;

        return { item, score };
      })
      .filter((res) => res.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((res) => res.item);

    return scored;
  }, [query, corpus]);

  // Focus input and lock scroll on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  // Reset selection index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current && results.length > 0) {
      const activeEl = resultsContainerRef.current.querySelector<HTMLElement>(`[data-result-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, results]);

  const handleNavigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        if (results.length > 0) {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowUp') {
        if (results.length > 0) {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
        }
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleNavigate(results[selectedIndex].href);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, selectedIndex, handleNavigate, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search EntireFM"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-4 sm:px-6 animate-in fade-in duration-200"
      style={{
        backgroundColor: 'rgba(4, 10, 20, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Search Panel Container ────────────────────────────────────────── */}
      <div
        ref={panelRef}
        className="w-full max-w-[940px] bg-[#09111F] border border-white/[0.08] rounded-lg sm:rounded-xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.04)] overflow-hidden flex flex-col animate-in slide-in-from-top-3 duration-200"
      >
        {/* ── Search Header & Context Bar ───────────────────────────────── */}
        <div className="px-5 sm:px-7 pt-5 pb-3 flex items-start justify-between border-b border-white/[0.04] bg-[#060C16]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-brand-pink-light">
                SEARCH ENTIREFM
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-light text-white tracking-tight">
              What are you looking for?
            </h2>
            <p className="text-xs font-light text-brand-mist/55 hidden sm:block">
              Search services, sectors, locations, resources and compliance guidance.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search dialog"
            className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-white/10 bg-white/[0.03] text-brand-mist/60 hover:text-white hover:border-white/25 hover:bg-white/[0.07] transition-all text-xs font-light"
          >
            <span className="text-[10px] tracking-wider uppercase hidden sm:inline-block text-brand-mist/50 group-hover:text-brand-mist/80">ESC</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Primary Search Input Bar ─────────────────────────────────── */}
        <div className="relative flex items-center px-4 sm:px-6 py-4 bg-[#09111F] border-b border-white/[0.06] transition-colors focus-within:border-brand-electric/50 focus-within:bg-white/[0.01]">
          <Search className="w-5 h-5 text-brand-mist/50 shrink-0 mr-3.5 transition-colors group-focus-within:text-brand-electric-bright" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, sectors, locations, tools and guides…"
            className="w-full bg-transparent text-base sm:text-lg text-white placeholder:text-brand-mist/35 font-light focus:outline-none tracking-wide"
            aria-autocomplete="list"
            aria-controls="search-results-list"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-sm text-brand-mist/40 hover:text-white hover:bg-white/10 transition-colors mr-2"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Content Area: Empty State vs Live Results ────────────────── */}
        <div
          ref={resultsContainerRef}
          className="max-h-[58vh] overflow-y-auto overscroll-contain"
          id="search-results-list"
        >
          {query.trim() === '' ? (
            /* ── EMPTY STATE / DISCOVERY COLUMNS ───────────────────────── */
            <div className="p-5 sm:p-7 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
                {/* 1. POPULAR */}
                <div className="space-y-3">
                  <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-brand-mist/45 block pb-1 border-b border-white/[0.04]">
                    Popular
                  </span>
                  <div className="space-y-1">
                    {[
                      {
                        title: 'Facilities Management London',
                        href: '/facilities-management-london',
                        sub: 'Greater London commercial operations',
                      },
                      {
                        title: 'Mechanical & Electrical',
                        href: '/mechanical-electrical',
                        sub: 'Hard FM, engineering & HVAC',
                      },
                      {
                        title: 'PPM Schedule Builder',
                        href: '/tools/ppm-schedule-builder',
                        sub: 'Interactive asset care calculator',
                      },
                      {
                        title: 'Compliance Centre',
                        href: '/compliance',
                        sub: 'Statutory mandates & testing',
                      },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center justify-between p-2.5 -mx-1 rounded-sm hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-light text-brand-mist/90 group-hover:text-white transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] font-light text-brand-mist/45 group-hover:text-brand-mist/70 transition-colors truncate">
                            {item.sub}
                          </p>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-brand-mist/30 group-hover:text-brand-electric-bright group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 2. EXPLORE */}
                <div className="space-y-3">
                  <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-brand-mist/45 block pb-1 border-b border-white/[0.04]">
                    Explore
                  </span>
                  <div className="space-y-1">
                    {[
                      {
                        title: 'All Services',
                        href: '/services',
                        sub: 'Hard FM, soft services & engineering',
                      },
                      {
                        title: 'Industry Sectors',
                        href: '/sectors',
                        sub: 'Commercial, industrial & retail',
                      },
                      {
                        title: 'Regional Locations',
                        href: '/locations',
                        sub: 'Nationwide network & hub coverage',
                      },
                      {
                        title: 'Resources & Guides',
                        href: '/resources',
                        sub: 'Technical toolkits, whitepapers & vault',
                      },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center justify-between p-2.5 -mx-1 rounded-sm hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-light text-brand-mist/90 group-hover:text-white transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] font-light text-brand-mist/45 group-hover:text-brand-mist/70 transition-colors truncate">
                            {item.sub}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-mist/30 group-hover:text-brand-electric-bright group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 3. FOR CONTRACTORS */}
                <div className="space-y-3">
                  <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-brand-mist/45 block pb-1 border-b border-white/[0.04]">
                    For Contractors
                  </span>
                  <div className="space-y-1">
                    {[
                      {
                        title: 'Contractor Centre',
                        href: '/suppliers',
                        sub: 'Supply chain standards & onboarding',
                      },
                      {
                        title: 'Supplier Partner Network',
                        href: '/suppliers/partner-network',
                        sub: 'Approved specialist contractors',
                      },
                      {
                        title: 'Compliance Updates',
                        href: '/compliance',
                        sub: 'Building Safety Act & regulations',
                      },
                      {
                        title: 'The Lobby Intelligence',
                        href: '/lobby',
                        sub: 'The daily UK briefing room',
                      },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center justify-between p-2.5 -mx-1 rounded-sm hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-light text-brand-mist/90 group-hover:text-white transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] font-light text-brand-mist/45 group-hover:text-brand-mist/70 transition-colors truncate">
                            {item.sub}
                          </p>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-brand-mist/30 group-hover:text-brand-electric-bright group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            /* ── NO-RESULTS POLISHED STATE ─────────────────────────────── */
            <div className="p-8 sm:p-10 text-center space-y-5">
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-normal text-white">No exact matches</h3>
                <p className="text-xs sm:text-sm font-light text-brand-mist/60 leading-relaxed">
                  Try searching for a service, location, sector, interactive tool or compliance topic.
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] max-w-lg mx-auto">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-mist/40 mb-3">
                  Suggested Pathways
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    { label: 'View All Services', href: '/services' },
                    { label: 'Browse Locations', href: '/locations' },
                    { label: 'Explore Resources & Tools', href: '/resources' },
                    { label: 'Contact EntireFM', href: '/contact-us' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="px-3.5 py-1.5 rounded-sm bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-light text-brand-mist hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ── LIVE SEARCH RESULTS ──────────────────────────────────── */
            <div className="p-3 sm:p-4 space-y-1">
              {results.map((item, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <div
                    key={item.href}
                    data-result-index={index}
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-md transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.07] border border-brand-electric/40 text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                        : 'text-brand-mist/80 hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span
                        className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-sm transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-brand-electric/25 text-brand-electric-bright border border-brand-electric/40'
                            : 'bg-white/[0.04] text-brand-mist/50 border border-white/[0.06]'
                        }`}
                      >
                        {getCategoryIcon(item.category)}
                      </span>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`text-sm sm:text-[15px] font-normal transition-colors truncate ${
                              isSelected ? 'text-white font-medium' : 'text-brand-mist/95'
                            }`}
                          >
                            {item.title}
                          </span>

                          <span className="text-[9.5px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-white/[0.06] text-brand-mist/60 border border-white/[0.06]">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-light text-brand-mist/50 truncate">
                          <span>{item.breadcrumb}</span>
                          {item.description && (
                            <>
                              <span className="text-white/20">·</span>
                              <span className="text-brand-mist/40 truncate hidden sm:inline">
                                {item.description}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center pl-2">
                      <ArrowRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          isSelected
                            ? 'text-brand-electric-bright translate-x-0.5 opacity-100'
                            : 'text-brand-mist/20 opacity-0 group-hover:opacity-100 group-hover:text-brand-mist/60'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer Interaction Helper ─────────────────────────────────── */}
        <div className="px-5 sm:px-7 py-3 bg-[#060C16] border-t border-white/[0.06] flex items-center justify-between text-[11px] font-light text-brand-mist/45">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-xs bg-white/[0.06] border border-white/10 text-[10px] text-brand-mist/70">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded-xs bg-white/[0.06] border border-white/10 text-[10px] text-brand-mist/70">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-xs bg-white/[0.06] border border-white/10 text-[10px] text-brand-mist/70">↵</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-xs bg-white/[0.06] border border-white/10 text-[10px] text-brand-mist/70">Esc</kbd>
              <span>to close</span>
            </span>
          </div>

          <span className="hidden sm:inline-block text-brand-mist/30">
            EntireFM Search
          </span>
        </div>
      </div>
    </div>
  );
}
