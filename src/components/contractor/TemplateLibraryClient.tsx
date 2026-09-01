'use client';

/**
 * CLIENT COMPONENT: TemplateLibraryClient
 * =======================================
 * Business Documents & Template Library interface with:
 *   - Fast "Create Document" quick launch bar (RAMS, Risk Assessment, Service Report, Quote, Inspection, Toolbox Talk)
 *   - Categorized 50+ template picker
 *   - Document Drafts & Completed ledger with duplicate and PDF print actions
 */

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Wrench,
  Coins,
  Zap,
  Flame,
  Droplet,
  ArrowUpRight,
  Search,
  Plus,
  Printer,
  Edit,
  ExternalLink,
  Layers,
  Sparkles,
  Copy,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  BusinessTemplateDefinition,
  ALL_BUSINESS_TEMPLATES,
  getTemplateById,
} from '@/server/contractor/template-library';
import { ContractorDocumentRecord } from '@/server/contractor/document-engine';
import { DocumentEditorClient } from '@/components/contractor/DocumentEditorClient';

interface TemplateLibraryClientProps {
  initialDocuments: ContractorDocumentRecord[];
  contractorOrgId: string;
}

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All Templates (56)', icon: Layers },
  { id: 'HEALTH_SAFETY', label: 'Health & Safety (19)', icon: ShieldCheck },
  { id: 'JOB_SERVICE', label: 'Job & Service (16)', icon: Wrench },
  { id: 'COMMERCIAL', label: 'Commercial (10)', icon: Coins },
  { id: 'SPECIALIST_ELECTRICAL', label: 'Electrical Suite', icon: Zap },
  { id: 'SPECIALIST_HVAC', label: 'HVAC & F-Gas', icon: Flame },
  { id: 'SPECIALIST_FIRE', label: 'Fire & Life Safety', icon: ShieldCheck },
  { id: 'SPECIALIST_PLUMBING', label: 'Plumbing & Gas', icon: Droplet },
  { id: 'SPECIALIST_BUILDING', label: 'Building Fabric', icon: Wrench },
];

const QUICK_LAUNCH_ITEMS = [
  { id: 'hs-rams', label: 'RAMS', cat: 'HEALTH_SAFETY', desc: 'Risk Assessment & Method Statement' },
  { id: 'hs-risk-assessment', label: 'Risk Assessment', cat: 'HEALTH_SAFETY', desc: 'General 5x5 Matrix' },
  { id: 'job-service-report', label: 'Service Report', cat: 'JOB_SERVICE', desc: 'Engineer Attendance & Works' },
  { id: 'comm-quotation', label: 'Quotation', cat: 'COMMERCIAL', desc: 'Itemised Scope & Pricing' },
  { id: 'trade-elec-eicr', label: 'EICR Cert', cat: 'SPECIALIST_ELECTRICAL', desc: 'Electrical Condition Report' },
  { id: 'hs-toolbox-talk', label: 'Toolbox Talk', cat: 'HEALTH_SAFETY', desc: 'Briefing & Attendance' },
];

export function TemplateLibraryClient({
  initialDocuments,
  contractorOrgId,
}: TemplateLibraryClientProps) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [docFilter, setDocFilter] = useState<'ALL' | 'DRAFT' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');
  const [documents, setDocuments] = useState<ContractorDocumentRecord[]>(initialDocuments);
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessTemplateDefinition | null>(null);
  const [editingDoc, setEditingDoc] = useState<ContractorDocumentRecord | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const clientNameParam = params.get('client_name');
    const siteNameParam = params.get('site_name');
    const templateIdParam = params.get('template_id');

    if (templateIdParam) {
      const tpl = getTemplateById(templateIdParam);
      if (tpl) {
        setSelectedTemplate(tpl);
        if (clientNameParam || siteNameParam) {
          setEditingDoc({
            id: '',
            contractor_org_id: contractorOrgId,
            template_id: tpl.id,
            category: tpl.category,
            document_number: '',
            title: tpl.title,
            version: '1.0',
            is_entirefm_job: false,
            client_name: clientNameParam || '',
            site_name: siteNameParam || '',
            status: 'DRAFT',
            form_data: {},
            signatures: [],
            photos: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }
  }, [contractorOrgId]);

  const filteredTemplates = ALL_BUSINESS_TEMPLATES.filter((t) => {
    const matchCat = activeTab === 'ALL' || t.category === activeTab;
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.trade?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredDocs = documents.filter((d) => {
    if (docFilter === 'DRAFT' && d.status !== 'DRAFT') return false;
    if (docFilter === 'COMPLETED' && d.status !== 'COMPLETED' && d.status !== 'SIGNED') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.document_number.toLowerCase().includes(q) ||
        (d.client_name && d.client_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateDocument = (template: BusinessTemplateDefinition) => {
    setSelectedTemplate(template);
    setEditingDoc(null);
  };

  const handleQuickLaunch = (templateId: string) => {
    const tpl = getTemplateById(templateId);
    if (tpl) {
      handleCreateDocument(tpl);
    }
  };

  const handleEditDocument = (doc: ContractorDocumentRecord) => {
    const template = getTemplateById(doc.template_id);
    if (template) {
      setSelectedTemplate(template);
      setEditingDoc(doc);
    }
  };

  const handleDuplicateDocument = (doc: ContractorDocumentRecord) => {
    const template = getTemplateById(doc.template_id);
    if (template) {
      setSelectedTemplate(template);
      setEditingDoc({
        ...doc,
        id: '', // reset ID so it creates new
        title: `${doc.title} (Copy)`,
        document_number: '',
        status: 'DRAFT',
      });
    }
  };

  const handleDocumentSaved = (savedDoc: ContractorDocumentRecord) => {
    setDocuments((prev) => {
      const idx = prev.findIndex((d) => d.id === savedDoc.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedDoc;
        return next;
      }
      return [savedDoc, ...prev];
    });
    setSelectedTemplate(null);
    setEditingDoc(null);
  };

  return (
    <div className="space-y-8">
      {/* ─── ACTION HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              CONTRACTOR BUSINESS TOOLKIT &bull; DOCUMENT ENGINE
            </span>
          </div>
          <h1 className="text-2xl font-light text-white tracking-tight">Business Documents &amp; Templates</h1>
          <p className="text-xs text-brand-mist/70">
            Author, draft, sign, and export white-labelled trade documentation, RAMS, service reports, and compliance certificates.
          </p>
        </div>
      </div>

      {/* ─── QUICK LAUNCH BAR ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-electric" /> Quick Create Document
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {QUICK_LAUNCH_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleQuickLaunch(item.id)}
              className="p-3 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 hover:bg-brand-carbon hover:border-brand-electric text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-medium text-white group-hover:text-brand-electric-bright transition-colors block">
                  {item.label}
                </span>
                <span className="text-[10px] text-brand-mist/50 line-clamp-1 block mt-0.5">{item.desc}</span>
              </div>
              <div className="pt-2 flex items-center justify-end text-brand-electric text-[10.5px] font-medium">
                <Plus className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── RECENT & SAVED DOCUMENTS LEDGER ─────────────────────────────── */}
      <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              My Business Documents ({documents.length})
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setDocFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                docFilter === 'ALL'
                  ? 'bg-brand-electric text-white font-medium'
                  : 'text-brand-mist/60 hover:text-white bg-brand-void/50 border border-brand-edge-dark'
              }`}
            >
              All ({documents.length})
            </button>
            <button
              onClick={() => setDocFilter('DRAFT')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                docFilter === 'DRAFT'
                  ? 'bg-amber-500 text-brand-void font-medium'
                  : 'text-brand-mist/60 hover:text-white bg-brand-void/50 border border-brand-edge-dark'
              }`}
            >
              Drafts ({documents.filter((d) => d.status === 'DRAFT').length})
            </button>
            <button
              onClick={() => setDocFilter('COMPLETED')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                docFilter === 'COMPLETED'
                  ? 'bg-emerald-500 text-brand-void font-medium'
                  : 'text-brand-mist/60 hover:text-white bg-brand-void/50 border border-brand-edge-dark'
              }`}
            >
              Completed ({documents.filter((d) => d.status === 'COMPLETED' || d.status === 'SIGNED').length})
            </button>
          </div>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="p-8 text-center text-brand-mist/40 space-y-2 border border-brand-edge-dark/50 rounded-xl bg-brand-void/20">
            <p className="text-xs">
              {docFilter === 'DRAFT'
                ? 'No saved drafts. Start a new template below.'
                : docFilter === 'COMPLETED'
                ? 'No completed documents yet. Complete and sign off a document to export.'
                : 'No documents created yet. Select a template below to create your first branded document.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDocs.slice(0, 9).map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-brand-edge-dark bg-brand-void/80 hover:border-brand-electric transition-all space-y-2.5 group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10.5px] text-brand-electric-bright font-medium">
                      {doc.document_number}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {doc.version && (
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-brand-carbon text-brand-mist/60 font-mono">
                          v{doc.version}
                        </span>
                      )}
                      <span
                        className={`text-[9.5px] px-2 py-0.5 rounded font-medium ${
                          doc.status === 'COMPLETED' || doc.status === 'SIGNED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xs font-medium text-white truncate">{doc.title}</h4>
                  <p className="text-[10.5px] text-brand-mist/60 truncate">
                    {doc.client_name || 'Direct Customer'} {doc.site_name ? `· ${doc.site_name}` : ''}
                  </p>
                </div>

                <div className="pt-2 border-t border-brand-edge-dark/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditDocument(doc)}
                      className="text-brand-mist/60 hover:text-white inline-flex items-center gap-1 text-[11px]"
                      title="Edit Document"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDuplicateDocument(doc)}
                      className="text-brand-mist/60 hover:text-white inline-flex items-center gap-1 text-[11px]"
                      title="Duplicate Document"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>

                  <a
                    href={`/api/contractor/documents/${doc.id}/print`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-brand-electric/10 border border-brand-electric/30 text-brand-electric-bright text-[10.5px] hover:bg-brand-electric hover:text-white transition-all inline-flex items-center gap-1 font-medium"
                  >
                    <Printer className="w-3 h-3" /> Branded PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── TEMPLATE LIBRARY CATALOGUE (56 Templates) ──────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Template Library Catalogue
          </h3>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-brand-mist/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 50+ templates..."
              className="w-full rounded-xl bg-brand-carbon/60 border border-brand-edge-dark pl-8 pr-3 py-1.5 text-xs text-white placeholder-brand-mist/30 focus:border-brand-electric focus:outline-none"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {CATEGORY_TABS.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-electric text-white font-medium shadow-md shadow-brand-electric/20'
                    : 'bg-brand-carbon/60 border border-brand-edge-dark text-brand-mist/70 hover:bg-brand-void hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-3 flex flex-col justify-between hover:border-brand-electric/60 hover:bg-brand-carbon/70 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-brand-electric-bright tracking-wider">
                    {tpl.categoryLabel}
                  </span>
                  <span className="text-[10px] text-brand-mist/40 font-mono">v{tpl.version}</span>
                </div>
                <h3 className="text-sm font-medium text-white group-hover:text-brand-electric-bright transition-colors">
                  {tpl.title}
                </h3>
                <p className="text-xs text-brand-mist/70 leading-relaxed">{tpl.description}</p>
              </div>

              <div className="pt-3 border-t border-brand-edge-dark/40 flex items-center justify-between">
                <span className="text-[11px] text-brand-mist/40">
                  {tpl.sections.reduce((acc, s) => acc + s.fields.length, 0)} Form Fields
                </span>
                <button
                  onClick={() => handleCreateDocument(tpl)}
                  className="px-3 py-1.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── DOCUMENT EDITOR MODAL ───────────────────────────────────────── */}
      {selectedTemplate && (
        <DocumentEditorClient
          template={selectedTemplate}
          existingDocument={editingDoc}
          contractorOrgId={contractorOrgId}
          onClose={() => {
            setSelectedTemplate(null);
            setEditingDoc(null);
          }}
          onSaved={handleDocumentSaved}
        />
      )}
    </div>
  );
}
