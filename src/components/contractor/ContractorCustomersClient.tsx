'use client';

/**
 * CLIENT COMPONENT: ContractorCustomersClient
 * ===========================================
 * Independent customer & private job management CRM for contractor businesses.
 * Comprehensive hierarchy: Customer -> Sites -> Jobs -> Documents -> History.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  Plus,
  Search,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Coins,
  ArrowRight,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  Printer,
  Edit,
  ShieldCheck,
} from 'lucide-react';
import { ContractorClientRecord, ContractorIndependentJobRecord } from '@/server/contractor/independent-job-service';

interface ContractorCustomersClientProps {
  initialClients: ContractorClientRecord[];
  initialJobs: ContractorIndependentJobRecord[];
  contractorOrgId: string;
}

export function ContractorCustomersClient({
  initialClients,
  initialJobs,
  contractorOrgId,
}: ContractorCustomersClientProps) {
  const [clients, setClients] = useState<ContractorClientRecord[]>(initialClients);
  const [jobs, setJobs] = useState<ContractorIndependentJobRecord[]>(initialJobs);
  const [activeTab, setActiveTab] = useState<'jobs' | 'clients'>('jobs');
  const [search, setSearch] = useState('');

  // Selected customer for drill-down drawer
  const [selectedClient, setSelectedClient] = useState<ContractorClientRecord | null>(null);
  const [clientDetailJobs, setClientDetailJobs] = useState<ContractorIndependentJobRecord[]>([]);
  const [clientDetailDocs, setClientDetailDocs] = useState<any[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // New Client Modal
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);

  // New Job Modal
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [trade, setTrade] = useState('ELECTRICAL');
  const [siteAddress, setSiteAddress] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  // Quick Sign-Off Modal
  const [signOffJobId, setSignOffJobId] = useState<string | null>(null);
  const [customerSignerName, setCustomerSignerName] = useState('');

  const openCustomerDetail = async (client: ContractorClientRecord) => {
    setSelectedClient(client);
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/contractor/clients/${client.id}?org_id=${encodeURIComponent(contractorOrgId)}`);
      if (res.ok) {
        const data = await res.json();
        setClientDetailJobs(data.client?.jobs || []);
        setClientDetailDocs(data.client?.documents || []);
      } else {
        // Fallback to local filter
        setClientDetailJobs(jobs.filter((j) => j.client_id === client.id || j.client_name === client.client_name));
        setClientDetailDocs([]);
      }
    } catch {
      setClientDetailJobs(jobs.filter((j) => j.client_id === client.id || j.client_name === client.client_name));
      setClientDetailDocs([]);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingClient(true);
    try {
      const res = await fetch('/api/contractor/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractor_org_id: contractorOrgId,
          client_name: clientName,
          contact_name: contactName,
          email,
          phone,
          address_line1: addressLine,
          city,
          postcode,
          notes,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setClients([data.client, ...clients]);
        setShowNewClientModal(false);
        setClientName('');
        setContactName('');
        setEmail('');
        setPhone('');
        setAddressLine('');
        setCity('');
        setPostcode('');
        setNotes('');
      }
    } catch (err) {
      console.error('[CREATE_CLIENT_ERR]', err);
    } finally {
      setIsSubmittingClient(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingJob(true);
    try {
      const res = await fetch('/api/contractor/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractor_org_id: contractorOrgId,
          client_id: selectedClientId || (selectedClient ? selectedClient.id : undefined),
          title: jobTitle,
          trade,
          site_address: siteAddress,
          description: jobDescription,
          scheduled_date: scheduledDate || undefined,
          total_price_gbp: Number(totalPrice || 0),
          status: 'SCHEDULED',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setJobs([data.job, ...jobs]);
        if (selectedClient) {
          setClientDetailJobs([data.job, ...clientDetailJobs]);
        }
        setShowNewJobModal(false);
        setJobTitle('');
        setSiteAddress('');
        setTotalPrice('');
        setScheduledDate('');
        setJobDescription('');
      }
    } catch (err) {
      console.error('[CREATE_JOB_ERR]', err);
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleSignOffJob = async (jobId: string) => {
    try {
      const res = await fetch('/api/contractor/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: jobId,
          contractor_org_id: contractorOrgId,
          status: 'COMPLETED',
          sign_off_name: customerSignerName || 'Customer Authorized Signatory',
        }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, status: 'COMPLETED', sign_off_name: customerSignerName || 'Signed' } : j
          )
        );
        setClientDetailJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, status: 'COMPLETED', sign_off_name: customerSignerName || 'Signed' } : j
          )
        );
        setSignOffJobId(null);
        setCustomerSignerName('');
      }
    } catch (err) {
      console.error('[SIGN_OFF_ERR]', err);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.job_reference.toLowerCase().includes(q) ||
      (j.client_name && j.client_name.toLowerCase().includes(q)) ||
      (j.site_address && j.site_address.toLowerCase().includes(q)) ||
      j.trade.toLowerCase().includes(q)
    );
  });

  const filteredClients = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.client_name.toLowerCase().includes(q) ||
      (c.contact_name && c.contact_name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* ─── ACTION HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              CONTRACTOR BUSINESS TOOLKIT &bull; PRIVATE CLIENTS &amp; JOBS
            </span>
          </div>
          <h1 className="text-2xl font-light text-white tracking-tight">Customer Directory &amp; Job Management</h1>
          <p className="text-xs text-brand-mist/70">
            Full private CRM for your independent customer directory, sites, trade jobs, and white-labelled documentation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewClientModal(true)}
            className="px-3.5 py-2 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 text-brand-mist text-xs hover:bg-brand-void hover:text-white transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Customer
          </button>
          <button
            onClick={() => {
              setSelectedClientId('');
              setShowNewJobModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-1.5 shadow-md shadow-brand-electric/20"
          >
            <Plus className="w-3.5 h-3.5" /> Create Job
          </button>
        </div>
      </div>

      {/* ─── SEARCH & VIEW TABS ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-edge-dark pb-3">
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'jobs'
                ? 'border border-brand-electric text-white font-medium bg-brand-carbon/80 shadow-sm'
                : 'text-brand-mist/60 hover:text-white bg-brand-carbon/30 border border-brand-edge-dark'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-brand-electric" /> Private Jobs ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'clients'
                ? 'border border-brand-electric text-white font-medium bg-brand-carbon/80 shadow-sm'
                : 'text-brand-mist/60 hover:text-white bg-brand-carbon/30 border border-brand-edge-dark'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-brand-electric" /> Customer Directory ({clients.length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-brand-mist/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab === 'jobs' ? 'jobs' : 'customers'}...`}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-brand-carbon/80 border border-brand-edge-dark text-white text-xs placeholder:text-brand-mist/40 focus:border-brand-electric focus:outline-none"
          />
        </div>
      </div>

      {/* ─── JOBS LIST VIEW ─────────────────────────────────────────────── */}
      {activeTab === 'jobs' && (
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-brand-edge-dark bg-brand-void/80 text-brand-mist/60 text-[11px] uppercase">
              <tr>
                <th className="px-5 py-3.5">Job Ref</th>
                <th className="px-5 py-3.5">Title &amp; Trade</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Site Location</th>
                <th className="px-5 py-3.5">Price (£)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-brand-mist/40 space-y-3">
                    <p>No independent jobs created yet. Track private client work with your own brand and rates.</p>
                    <button
                      onClick={() => setShowNewJobModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-electric text-white text-xs font-medium hover:bg-brand-electric/85 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create First Job
                    </button>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-brand-void/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-brand-electric-bright font-medium">{job.job_reference}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-white font-normal block">{job.title}</span>
                      <span className="text-[10px] text-brand-mist/50">{job.trade}</span>
                    </td>
                    <td className="px-5 py-3.5 text-white font-medium">{job.client_name || 'Direct Client'}</td>
                    <td className="px-5 py-3.5 text-brand-mist/70">{job.site_address || '—'}</td>
                    <td className="px-5 py-3.5 font-mono text-emerald-400">£{Number(job.total_price_gbp).toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-medium border ${
                          job.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-brand-electric/10 text-brand-electric-bright border-brand-electric/20'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {job.status !== 'COMPLETED' && (
                        <button
                          onClick={() => setSignOffJobId(job.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10.5px] transition-all inline-flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Sign Off
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── CLIENTS DIRECTORY GRID ─────────────────────────────────────── */}
      {activeTab === 'clients' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.length === 0 ? (
            <div className="col-span-3 p-12 text-center text-brand-mist/40 border border-brand-edge-dark rounded-2xl bg-brand-carbon/30 space-y-3">
              <p>No private customers added yet. Add your clients to build job packs and generate branded documents.</p>
              <button
                onClick={() => setShowNewClientModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-electric text-white text-xs font-medium hover:bg-brand-electric/85 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Customer
              </button>
            </div>
          ) : (
            filteredClients.map((c) => (
              <div
                key={c.id}
                onClick={() => openCustomerDetail(c)}
                className="p-5 rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 space-y-3 hover:border-brand-electric/60 hover:bg-brand-carbon/70 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-white group-hover:text-brand-electric-bright transition-colors">
                      {c.client_name}
                    </h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-brand-mist/70">
                    {c.contact_name && (
                      <p className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-brand-electric/70" /> {c.contact_name}
                      </p>
                    )}
                    {c.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-electric/70" /> {c.phone}
                      </p>
                    )}
                    {c.email && (
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-brand-electric/70" /> {c.email}
                      </p>
                    )}
                    {c.city && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-electric/70" /> {c.city} {c.postcode ? `· ${c.postcode}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-edge-dark/50 flex items-center justify-between text-xs text-brand-mist/60 group-hover:text-white">
                  <span>View Customer Hub &rarr;</span>
                  <ChevronRight className="w-4 h-4 text-brand-mist/40 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── CUSTOMER DETAIL DRILL-DOWN MODAL (Customer -> Sites -> Jobs -> Docs -> History) ─── */}
      {selectedClient && (
        <div className="fixed inset-0 bg-brand-void/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-3xl w-full bg-brand-carbon border border-brand-edge-dark rounded-2xl shadow-2xl overflow-hidden my-8 space-y-0">
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-edge-dark bg-brand-void/70 flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-electric-bright tracking-wider">
                  CUSTOMER HUB &bull; PRIVATE CRM
                </span>
                <h2 className="text-xl font-light text-white">{selectedClient.client_name}</h2>
                <p className="text-xs text-brand-mist/60">
                  {selectedClient.contact_name ? `${selectedClient.contact_name} · ` : ''}
                  {selectedClient.email ? `${selectedClient.email} · ` : ''}
                  {selectedClient.phone || ''}
                </p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1.5 rounded-lg text-brand-mist/50 hover:text-white hover:bg-brand-void"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Quick Actions Strip */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedClientId(selectedClient.id);
                    setShowNewJobModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> New Job for Customer
                </button>
                <Link
                  href={`/contractor/templates?client_name=${encodeURIComponent(selectedClient.client_name)}&site_name=${encodeURIComponent(selectedClient.address_line1 || selectedClient.city || '')}&template_id=hs-rams`}
                  className="px-3.5 py-1.5 rounded-xl border border-brand-edge-dark bg-brand-void text-white text-xs hover:bg-brand-void/80 transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-electric" /> New Branded Document
                </Link>
              </div>

              {/* Sites / Address */}
              <div className="rounded-xl border border-brand-edge-dark bg-brand-void/50 p-4 space-y-2">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-electric" /> Site &amp; Billing Location
                </h4>
                <p className="text-xs text-brand-mist/80">
                  {selectedClient.address_line1 || 'No specific street address registered.'}
                  {selectedClient.city ? `, ${selectedClient.city}` : ''}
                  {selectedClient.postcode ? ` (${selectedClient.postcode})` : ''}
                </p>
                {selectedClient.notes && (
                  <p className="text-[11px] text-brand-mist/60 pt-1 border-t border-brand-edge-dark/30">
                    <strong>Notes:</strong> {selectedClient.notes}
                  </p>
                )}
              </div>

              {/* Linked Independent Jobs */}
              <div className="rounded-xl border border-brand-edge-dark bg-brand-void/50 p-4 space-y-3">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-brand-electric" /> Linked Private Jobs ({clientDetailJobs.length})
                </h4>

                {clientDetailJobs.length === 0 ? (
                  <p className="text-xs text-brand-mist/40 py-2">No jobs created for this customer yet.</p>
                ) : (
                  <div className="space-y-2">
                    {clientDetailJobs.map((j) => (
                      <div
                        key={j.id}
                        className="p-3 rounded-lg border border-brand-edge-dark bg-brand-void flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-brand-electric-bright font-medium">{j.job_reference}</span>
                            <span className="text-white font-medium">{j.title}</span>
                          </div>
                          <span className="text-[10px] text-brand-mist/50 block">
                            {j.trade} · £{Number(j.total_price_gbp).toFixed(2)}
                            {j.scheduled_date ? ` · Scheduled: ${j.scheduled_date}` : ''}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            j.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-brand-electric/10 text-brand-electric-bright border border-brand-electric/20'
                          }`}
                        >
                          {j.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Branded Documents */}
              <div className="rounded-xl border border-brand-edge-dark bg-brand-void/50 p-4 space-y-3">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-electric" /> Generated Business Documents ({clientDetailDocs.length})
                </h4>

                {clientDetailDocs.length === 0 ? (
                  <p className="text-xs text-brand-mist/40 py-2">No documents generated for this customer yet.</p>
                ) : (
                  <div className="space-y-2">
                    {clientDetailDocs.map((d) => (
                      <div
                        key={d.id}
                        className="p-3 rounded-lg border border-brand-edge-dark bg-brand-void flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono text-brand-electric-bright font-medium">{d.document_number}</span>
                          <span className="text-white font-medium block">{d.title}</span>
                          <span className="text-[10px] text-brand-mist/50">v{d.version} · {d.category}</span>
                        </div>
                        <a
                          href={`/api/contractor/documents/${d.id}/print`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-brand-electric/10 border border-brand-electric/30 text-brand-electric-bright text-[10.5px] hover:bg-brand-electric hover:text-white transition-all inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" /> View Branded PDF
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-brand-edge-dark bg-brand-void/70 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 rounded-xl border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
              >
                Close Customer Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── NEW CUSTOMER MODAL ─────────────────────────────────────────── */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-brand-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateClient} className="max-w-md w-full bg-brand-carbon border border-brand-edge-dark rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-light text-white">Add Independent Customer</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-brand-mist/60 block mb-1">Company / Customer Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Manchester Logistics Hub Ltd"
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-brand-mist/60 block mb-1">Primary Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-brand-mist/60 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0161..."
                    className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-brand-mist/60 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@hub.co.uk"
                    className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-brand-mist/60 block mb-1">Site / Street Address</label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Unit 4, Gateway Logistics Park"
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-brand-mist/60 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Manchester"
                    className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-brand-mist/60 block mb-1">Postcode</label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="M17 1AB"
                    className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-brand-edge-dark/50">
              <button
                type="button"
                onClick={() => setShowNewClientModal(false)}
                className="px-4 py-2 rounded-xl border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingClient}
                className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 disabled:opacity-50"
              >
                Create Customer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── NEW INDEPENDENT JOB MODAL ──────────────────────────────────── */}
      {showNewJobModal && (
        <div className="fixed inset-0 bg-brand-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateJob} className="max-w-md w-full bg-brand-carbon border border-brand-edge-dark rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-light text-white">Create Independent Job</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-brand-mist/60 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Distribution Board Upgrade & DB Testing"
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-brand-mist/60 block mb-1">Customer</label>
                <select
                  value={selectedClientId || (selectedClient ? selectedClient.id : '')}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                >
                  <option value="">Select Customer (Optional)...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.client_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-brand-mist/60 block mb-1">Trade</label>
                  <select
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                  >
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="HVAC">HVAC / Gas</option>
                    <option value="FIRE_SAFETY">Fire Safety</option>
                    <option value="PLUMBING">Plumbing</option>
                    <option value="GENERAL">General Building</option>
                  </select>
                </div>
                <div>
                  <label className="text-brand-mist/60 block mb-1">Price (£ Net)</label>
                  <input
                    type="number"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    placeholder="450.00"
                    className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-brand-mist/60 block mb-1">Site Address</label>
                <input
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="e.g. Unit 4, Trafford Park, M17 1AB"
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-brand-mist/60 block mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-brand-edge-dark/50">
              <button
                type="button"
                onClick={() => setShowNewJobModal(false)}
                className="px-4 py-2 rounded-xl border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingJob}
                className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 disabled:opacity-50 shadow-sm"
              >
                Create Job
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── QUICK SIGN-OFF MODAL ────────────────────────────────────────── */}
      {signOffJobId && (
        <div className="fixed inset-0 bg-brand-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-brand-carbon border border-brand-edge-dark rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-light text-white">Customer Job Sign-Off</h3>
            <p className="text-xs text-brand-mist/70">
              Register completion and customer satisfaction for this independent job.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-brand-mist/60 block mb-1">Customer Signatory Name</label>
                <input
                  type="text"
                  value={customerSignerName}
                  onChange={(e) => setCustomerSignerName(e.target.value)}
                  placeholder="e.g. John Doe (Site Manager)"
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSignOffJobId(null)}
                className="px-4 py-2 rounded-xl border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSignOffJob(signOffJobId)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-brand-void text-xs font-semibold hover:bg-emerald-400 shadow-sm"
              >
                Confirm Sign-Off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
