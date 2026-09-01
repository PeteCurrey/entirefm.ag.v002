'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Upload,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { VaultDocument, VaultCategory } from '@/server/contractor/document-vault-service';
import { DocumentDetailDrawer } from './DocumentDetailDrawer';
import { DocumentUploadModal } from './DocumentUploadModal';

interface Props {
  initialDocuments: VaultDocument[];
  orgId: string;
}

const CATEGORIES: { id: VaultCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Documents' },
  { id: 'INSURANCE', label: 'Insurance' },
  { id: 'ACCREDITATIONS', label: 'Accreditations' },
  { id: 'HEALTH_AND_SAFETY', label: 'Health & Safety' },
  { id: 'RAMS', label: 'RAMS' },
  { id: 'COSHH', label: 'COSHH' },
  { id: 'POLICIES', label: 'Policies' },
  { id: 'ENVIRONMENTAL', label: 'Environmental' },
  { id: 'QUALITY', label: 'Quality' },
  { id: 'WORKFORCE', label: 'Workforce & Training' },
  { id: 'FLEET', label: 'Fleet' },
  { id: 'PLANT_AND_EQUIPMENT', label: 'Plant & Equipment' },
];

export function DocumentVaultClient({ initialDocuments, orgId }: Props) {
  const [documents, setDocuments] = useState<VaultDocument[]>(initialDocuments);
  const [selectedCategory, setSelectedCategory] = useState<VaultCategory | 'ALL'>('ALL');
  const [expiryFilter, setExpiryFilter] = useState<'ALL' | 'EXPIRED' | 'NEXT_30' | '31_60' | '61_90'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [replaceTargetDoc, setReplaceTargetDoc] = useState<VaultDocument | null>(null);

  const refreshDocuments = async () => {
    try {
      const res = await fetch(`/api/contractor/documents?orgId=${encodeURIComponent(orgId)}`);
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to refresh documents:', err);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    // Category filter
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) {
      return false;
    }

    // Expiry filter
    if (expiryFilter === 'EXPIRED') {
      if (doc.daysRemaining === null || doc.daysRemaining === undefined || doc.daysRemaining >= 0) return false;
    } else if (expiryFilter === 'NEXT_30') {
      if (doc.daysRemaining === null || doc.daysRemaining === undefined || doc.daysRemaining < 0 || doc.daysRemaining > 30) return false;
    } else if (expiryFilter === '31_60') {
      if (doc.daysRemaining === null || doc.daysRemaining === undefined || doc.daysRemaining <= 30 || doc.daysRemaining > 60) return false;
    } else if (expiryFilter === '61_90') {
      if (doc.daysRemaining === null || doc.daysRemaining === undefined || doc.daysRemaining <= 60 || doc.daysRemaining > 90) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        doc.documentTitle.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        (doc.insurerOrIssuer && doc.insurerOrIssuer.toLowerCase().includes(q)) ||
        (doc.policyNumber && doc.policyNumber.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const expiredCount = documents.filter((d) => d.daysRemaining !== null && d.daysRemaining !== undefined && d.daysRemaining < 0).length;
  const expiringCount = documents.filter((d) => d.daysRemaining !== null && d.daysRemaining !== undefined && d.daysRemaining >= 0 && d.daysRemaining <= 30).length;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-mist/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, policy numbers, insurers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-carbon border border-brand-edge-dark text-white text-xs placeholder:text-brand-mist/40 focus:border-brand-electric focus:outline-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setReplaceTargetDoc(null);
            setIsUploadModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all shadow-md shadow-brand-electric/25 flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          Upload New Document
        </button>
      </div>

      {/* Category Pills & Expiry Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-normal transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-brand-electric text-white font-medium'
                  : 'bg-brand-carbon border border-brand-edge-dark text-brand-mist/70 hover:text-white hover:bg-brand-edge-dark/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Expiry Horizon Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] font-normal uppercase text-brand-mist/40 mr-1">Horizon:</span>
          <button
            onClick={() => setExpiryFilter('ALL')}
            className={`px-2.5 py-1 rounded text-[11px] font-normal ${
              expiryFilter === 'ALL' ? 'bg-brand-void text-white border border-brand-edge-dark' : 'text-brand-mist/60 hover:text-white'
            }`}
          >
            All Dates ({documents.length})
          </button>
          {expiredCount > 0 && (
            <button
              onClick={() => setExpiryFilter('EXPIRED')}
              className={`px-2.5 py-1 rounded text-[11px] font-normal border ${
                expiryFilter === 'EXPIRED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-rose-950/20 text-rose-400 border-rose-500/20 hover:bg-rose-950/40'
              }`}
            >
              Expired ({expiredCount})
            </button>
          )}
          {expiringCount > 0 && (
            <button
              onClick={() => setExpiryFilter('NEXT_30')}
              className={`px-2.5 py-1 rounded text-[11px] font-normal border ${
                expiryFilter === 'NEXT_30'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-amber-950/20 text-amber-400 border-amber-500/20 hover:bg-amber-950/40'
              }`}
            >
              Next 30 Days ({expiringCount})
            </button>
          )}
          <button
            onClick={() => setExpiryFilter('31_60')}
            className={`px-2.5 py-1 rounded text-[11px] font-normal ${
              expiryFilter === '31_60' ? 'bg-brand-void text-white border border-brand-edge-dark' : 'text-brand-mist/60 hover:text-white'
            }`}
          >
            31–60 Days
          </button>
          <button
            onClick={() => setExpiryFilter('61_90')}
            className={`px-2.5 py-1 rounded text-[11px] font-normal ${
              expiryFilter === '61_90' ? 'bg-brand-void text-white border border-brand-edge-dark' : 'text-brand-mist/60 hover:text-white'
            }`}
          >
            61–90 Days
          </button>
        </div>
      </div>

      {/* Document Records Table / List */}
      {filteredDocuments.length === 0 ? (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-brand-mist/30 mx-auto" />
          <h3 className="text-base font-light text-white">No documents found</h3>
          <p className="text-xs text-brand-mist/50 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'ALL' || expiryFilter !== 'ALL'
              ? 'Try adjusting your search query or filters to find what you are looking for.'
              : 'Your organisation has not uploaded any documents in this category yet.'}
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-brand-electric/10 border border-brand-electric/30 text-brand-electric-bright text-xs font-normal hover:bg-brand-electric/20 transition-colors inline-block"
          >
            Upload Document
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-void/80 border-b border-brand-edge-dark text-brand-mist/60 uppercase font-normal text-[10.5px]">
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Insurer / Authority</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/40">
                {filteredDocuments.map((doc) => {
                  const isExp = doc.daysRemaining !== null && doc.daysRemaining !== undefined && doc.daysRemaining < 0;
                  const isExpSoon = doc.daysRemaining !== null && doc.daysRemaining !== undefined && doc.daysRemaining >= 0 && doc.daysRemaining <= 30;

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className="hover:bg-brand-edge-dark/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-normal text-white">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-brand-mist/40 group-hover:text-brand-electric transition-colors shrink-0" />
                          <div>
                            <span className="font-normal text-white group-hover:text-brand-electric-bright transition-colors">
                              {doc.documentTitle}
                            </span>
                            <span className="text-[10.5px] font-normal text-brand-mist/40 block">
                              {doc.fileName} &bull; {(doc.fileSizeBytes / 1024).toFixed(0)} KB
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-brand-mist/70">
                        <span className="font-normal text-[10.5px] uppercase">{doc.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-mist">
                        {doc.insurerOrIssuer || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {doc.expiryDate ? (
                          <div>
                            <span
                              className={`font-normal text-xs ${
                                isExp
                                  ? 'text-rose-400 font-bold'
                                  : isExpSoon
                                  ? 'text-amber-400 font-semibold'
                                  : 'text-brand-mist'
                              }`}
                            >
                              {doc.expiryDate}
                            </span>
                            {doc.daysRemaining !== null && doc.daysRemaining !== undefined && (
                              <span className="text-[10px] text-brand-mist/40 block font-normal">
                                {isExp ? `Expired ${Math.abs(doc.daysRemaining)}d ago` : `${doc.daysRemaining} days remaining`}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-brand-mist/40 font-normal">No Expiry</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            doc.verificationState === 'VERIFIED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : doc.verificationState === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : doc.verificationState === 'SUPERSEDED'
                              ? 'bg-brand-edge-dark text-brand-mist border-brand-edge-dark'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {doc.verificationState}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setReplaceTargetDoc(doc);
                              setIsUploadModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-brand-void border border-brand-edge-dark text-brand-mist hover:text-white hover:border-brand-electric text-[11px] transition-colors"
                          >
                            Replace
                          </button>
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="p-1 rounded text-brand-mist/50 hover:text-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out Document Detail Drawer */}
      <DocumentDetailDrawer
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onReplaceRequest={(doc) => {
          setSelectedDoc(null);
          setReplaceTargetDoc(doc);
          setIsUploadModalOpen(true);
        }}
      />

      {/* Upload / Replacement Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={refreshDocuments}
        orgId={orgId}
        defaultRequirementCode={replaceTargetDoc?.linkedRequirementCode}
        defaultCategory={replaceTargetDoc?.category || selectedCategory !== 'ALL' ? selectedCategory : 'INSURANCE'}
        defaultTitle={replaceTargetDoc ? `Renewal: ${replaceTargetDoc.documentTitle}` : ''}
      />
    </div>
  );
}
