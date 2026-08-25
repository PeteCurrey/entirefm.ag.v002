'use client';

import { useState } from 'react';
import EmptyState from '@/components/admin/EmptyState';
import { ShieldCheck, Upload, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ComplianceDoc {
  id: string;
  document_type: string;
  document_title: string;
  expiry_date?: string;
  review_status: string;
  created_at: string;
}

export default function ContractorComplianceClient({
  initialDocs,
  orgId,
}: {
  initialDocs: ComplianceDoc[];
  orgId: string;
}) {
  const [docs, setDocs] = useState(initialDocs);
  const [isUploading, setIsUploading] = useState(false);
  const [docType, setDocType] = useState('INSURANCE_PUBLIC_LIABILITY');
  const [docTitle, setDocTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);

  const docTypes = [
    { value: 'INSURANCE_PUBLIC_LIABILITY', label: 'Public Liability Insurance' },
    { value: 'INSURANCE_EMPLOYERS', label: 'Employers Liability Insurance' },
    { value: 'ACCREDITATION_GAS_SAFE', label: 'Gas Safe Register' },
    { value: 'ACCREDITATION_NICEIC', label: 'NICEIC / Electrical Registration' },
    { value: 'ACCREDITATION_CHAS', label: 'CHAS Accreditation' },
    { value: 'ACCREDITATION_SAFECONTRACTOR', label: 'SafeContractor Certificate' },
    { value: 'HEALTH_SAFETY_POLICY', label: 'Health & Safety Policy' },
    { value: 'RAMS', label: 'RAMS Standard Document' },
    { value: 'OTHER', label: 'Other Document' },
  ];

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contractor/compliance/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          documentTitle: docTitle,
          storagePath: `compliance/${orgId}/${Date.now()}_${docType.toLowerCase()}.pdf`,
          expiryDate: expiryDate || undefined,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setDocs(prev => [
          {
            id: data.id,
            document_type: docType,
            document_title: docTitle,
            expiry_date: expiryDate || undefined,
            review_status: 'PENDING',
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setIsUploading(false);
        setDocTitle('');
        setExpiryDate('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsUploading(true)}
          className="flex items-center gap-2 bg-brand-electric text-black font-light px-4 py-2.5 rounded-lg text-sm hover:bg-brand-electric-bright transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Compliance Document
        </button>
      </div>

      {isUploading && (
        <form
          onSubmit={handleUploadSubmit}
          className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-light text-white">Upload New Compliance Record</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1">Document Type *</label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value)}
                className="w-full bg-brand-void border border-brand-edge-dark rounded-lg p-2.5 text-sm text-white"
              >
                {docTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1">Title / Policy Number *</label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                placeholder="e.g. QBE Policy #984920"
                className="w-full bg-brand-void border border-brand-edge-dark rounded-lg p-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="w-full bg-brand-void border border-brand-edge-dark rounded-lg p-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="border border-brand-edge-dark py-2 px-4 rounded-lg text-sm text-brand-mist hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !docTitle}
              className="bg-brand-electric text-black font-light py-2 px-5 rounded-lg text-sm hover:bg-brand-electric-bright disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      )}

      {docs.length === 0 ? (
        <EmptyState
          title="No Compliance Documents"
          description="Upload your active accreditations and insurance certificates to maintain dispatch eligibility."
          icon="ShieldCheck"
        />
      ) : (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-brand-mist">
            <thead className="bg-brand-void text-xs uppercase font-light text-brand-mist border-b border-brand-edge-dark">
              <tr>
                <th className="p-4">Document Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark">
              {docs.map(doc => (
                <tr key={doc.id} className="hover:bg-brand-edge-dark/30 transition-colors">
                  <td className="p-4 font-light text-white">{doc.document_title}</td>
                  <td className="p-4 text-xs font-mono">{doc.document_type}</td>
                  <td className="p-4 text-xs font-mono">{doc.expiry_date || 'No Expiry'}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-mono font-light inline-flex items-center gap-1 ${
                        doc.review_status === 'VERIFIED'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : doc.review_status === 'REJECTED'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {doc.review_status === 'VERIFIED' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {doc.review_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
