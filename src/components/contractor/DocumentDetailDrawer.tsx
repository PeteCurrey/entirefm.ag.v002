'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  History,
  Building2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { VaultDocument } from '@/server/contractor/document-vault-service';

interface Props {
  document: VaultDocument | null;
  onClose: () => void;
  onReplaceRequest: (doc: VaultDocument) => void;
}

export function DocumentDetailDrawer({ document, onClose, onReplaceRequest }: Props) {
  if (!document) return null;

  const isExpired = document.daysRemaining !== null && document.daysRemaining !== undefined && document.daysRemaining < 0;
  const isExpiring = document.daysRemaining !== null && document.daysRemaining !== undefined && document.daysRemaining >= 0 && document.daysRemaining <= 30;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-brand-void/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-brand-carbon border-l border-brand-edge-dark h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-start justify-between p-6 border-b border-brand-edge-dark bg-brand-void/50">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              {document.category} &bull; VAULT ASSET
            </span>
            <h2 className="text-xl font-light text-white leading-snug">{document.documentTitle}</h2>
            <p className="text-xs font-normal text-brand-mist/50">{document.fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-mist/60 hover:text-white p-1.5 rounded-lg hover:bg-brand-edge-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Banner */}
          <div className="p-4 rounded-xl border border-brand-edge-dark bg-brand-void/60 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-brand-mist/50 block">
                Verification State
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-medium border ${
                    document.verificationState === 'VERIFIED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : document.verificationState === 'REJECTED'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : document.verificationState === 'SUPERSEDED'
                      ? 'bg-brand-edge-dark text-brand-mist border-brand-edge-dark'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {document.verificationState}
                </span>
                <span className="text-xs text-brand-mist/60">
                  Version {document.version} {document.isCurrent ? '(Active)' : '(Archived)'}
                </span>
              </div>
            </div>

            {/* Expiry Pill */}
            {document.expiryDate && (
              <div className="text-right">
                <span className="text-[10px] font-medium uppercase tracking-wider text-brand-mist/50 block">Expiry</span>
                <span
                  className={`text-xs font-medium block mt-1 ${
                    isExpired
                      ? 'text-rose-400 font-bold'
                      : isExpiring
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {document.expiryDate} {document.daysRemaining !== null && `(${document.daysRemaining}d)`}
                </span>
              </div>
            )}
          </div>

          {/* Rejection / Review Feedback */}
          {document.contractorVisibleNote && (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold block">
                Verification Feedback
              </span>
              <p className="text-xs text-rose-200/90 leading-relaxed">{document.contractorVisibleNote}</p>
            </div>
          )}

          {/* Structured Document Attributes */}
          <div className="space-y-3">
            <h3 className="text-xs font-normal uppercase tracking-wider text-brand-mist/70 border-b border-brand-edge-dark pb-2">
              Document Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-brand-mist/50 block">Insurer / Authority</span>
                <span className="text-white font-normal mt-0.5 block">{document.insurerOrIssuer || '—'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Policy / Reg Number</span>
                <span className="text-white font-normal mt-0.5 block">{document.policyNumber || '—'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Cover Limit</span>
                <span className="text-brand-electric-bright font-normal mt-0.5 block">
                  {document.coverLimitGbp ? `£${document.coverLimitGbp.toLocaleString()}` : '—'}
                </span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Issue Date</span>
                <span className="text-white font-normal mt-0.5 block">{document.issueDate || '—'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">File Size</span>
                <span className="text-brand-mist font-normal mt-0.5 block">
                  {(document.fileSizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Uploaded By</span>
                <span className="text-white mt-0.5 block">{document.uploadedByName || 'Administrator'}</span>
              </div>
            </div>
          </div>

          {/* Version History & Replacement Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-normal uppercase tracking-wider text-brand-mist/70 border-b border-brand-edge-dark pb-2 flex items-center justify-between">
              <span>Lifecycle &amp; Audit Trail</span>
              <History className="w-3.5 h-3.5 text-brand-mist/50" />
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-brand-edge-dark/40">
                <span className="text-brand-mist/60">Uploaded to Vault</span>
                <span className="text-brand-mist font-normal">
                  {new Date(document.uploadedAt).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-brand-edge-dark/40">
                <span className="text-brand-mist/60">Lifecycle State</span>
                <span className="text-brand-mist font-normal">{document.lifecycleState}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-brand-mist/60">Linked Requirement</span>
                <span className="text-white font-normal text-[11px]">{document.linkedRequirementCode || 'GENERAL_VAULT'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-brand-edge-dark bg-brand-void/50 flex items-center gap-3">
          <button
            onClick={() => onReplaceRequest(document)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-brand-electric text-white text-xs font-medium hover:bg-brand-electric/85 transition-colors flex items-center justify-center gap-2 shadow-md shadow-brand-electric/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Upload Renewal / Replacement
          </button>
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-lg border border-brand-edge-dark text-white text-xs font-normal hover:bg-brand-edge-dark transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
