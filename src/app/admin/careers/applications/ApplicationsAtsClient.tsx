'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users,
  Search,
  Filter,
  Download,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  X,
  Plus,
  Send,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { JobApplication, ApplicationStage, Vacancy } from '@/server/careers/types';

interface ApplicationsAtsClientProps {
  initialApplications: JobApplication[];
  vacancies: Vacancy[];
}

const STAGES: Record<ApplicationStage, { value: ApplicationStage; label: string; color: string }> = {
  NEW: { value: 'NEW', label: 'New Application', color: 'bg-[#FEF3C7] text-[#92400E]' },
  REVIEWING: { value: 'REVIEWING', label: 'Reviewing', color: 'bg-[#FEE2E2] text-[#991B1B]' },
  SHORTLISTED: { value: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-[#E0E7FF] text-[#3730A3]' },
  INTERVIEW: { value: 'INTERVIEW', label: '1st Interview', color: 'bg-[#DBEAFE] text-[#1E40AF]' },
  SECOND_INTERVIEW: { value: 'SECOND_INTERVIEW', label: '2nd Interview', color: 'bg-[#EDE9FE] text-[#5B21B6]' },
  OFFER: { value: 'OFFER', label: 'Offer Extended', color: 'bg-[#CCFBF1] text-[#115E59]' },
  HIRED: { value: 'HIRED', label: 'Hired', color: 'bg-[#D1FAE5] text-[#065F46]' },
  REJECTED: { value: 'REJECTED', label: 'Rejected', color: 'bg-[#F3F4F6] text-[#4B5563]' },
  WITHDRAWN: { value: 'WITHDRAWN', label: 'Withdrawn', color: 'bg-[#F3F4F6] text-[#6B7280]' },
};

const STAGE_KEYS: ApplicationStage[] = [
  'NEW',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW',
  'SECOND_INTERVIEW',
  'OFFER',
  'HIRED',
  'REJECTED',
];

export function ApplicationsAtsClient({ initialApplications, vacancies }: ApplicationsAtsClientProps) {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(
    initialApplications[0] || null
  );
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [vacancyFilter, setVacancyFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);
  const [cvDownloadUrl, setCvDownloadUrl] = useState<string | null>(null);

  const router = useRouter();

  const filtered = applications.filter((app) => {
    if (stageFilter !== 'ALL' && app.stage !== stageFilter) return false;
    if (vacancyFilter !== 'ALL' && app.vacancyId !== vacancyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        app.firstName.toLowerCase().includes(q) ||
        app.lastName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q) ||
        app.vacancyTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStageChange = async (appId: string, newStage: ApplicationStage) => {
    setIsUpdatingStage(true);
    try {
      const res = await fetch('/api/careers/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-stage', id: appId, stage: newStage }),
      });
      const data = await res.json();
      if (data.application) {
        setApplications((prev) => prev.map((a) => (a.id === appId ? data.application : a)));
        if (selectedApp?.id === appId) {
          setSelectedApp(data.application);
        }
      }
    } catch (err) {
      console.error('Error changing stage:', err);
    } finally {
      setIsUpdatingStage(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !noteContent.trim()) return;

    setIsSubmittingNote(true);
    try {
      const res = await fetch('/api/careers/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-note', id: selectedApp.id, note: noteContent.trim() }),
      });
      const data = await res.json();
      if (data.application) {
        setApplications((prev) => prev.map((a) => (a.id === selectedApp.id ? data.application : a)));
        setSelectedApp(data.application);
        setNoteContent('');
      }
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleDownloadCv = async (app: JobApplication) => {
    if (!app.cvStoragePath) return;
    try {
      const res = await fetch(`/api/careers/applications?id=${app.id}&action=cv-token`);
      const data = await res.json();
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to get signed CV token:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Stage Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setStageFilter('ALL')}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              stageFilter === 'ALL'
                ? 'bg-[#111111] text-white font-normal'
                : 'bg-white text-[#6D6D68] hover:text-[#111111] border border-[#E8E8E5]'
            }`}
          >
            All Candidates ({applications.length})
          </button>
          {STAGE_KEYS.map((st) => {
            const count = applications.filter((a) => a.stage === st).length;
            return (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  stageFilter === st
                    ? 'bg-[#111111] text-white font-normal'
                    : 'bg-white text-[#6D6D68] hover:text-[#111111] border border-[#E8E8E5]'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64 relative">
          <Search className="w-3.5 h-3.5 text-[#6D6D68] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>
      </div>

      {/* 2-Column Layout: Table on Left (7 cols), Candidate Profile on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications Table */}
        <div className="lg:col-span-7 border border-[#E8E8E5] rounded bg-white overflow-hidden shadow-xs">
          <div className="divide-y divide-[#E8E8E5]">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6D6D68]">
                No applications matching current filters.
              </div>
            ) : (
              filtered.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                const stageMeta = STAGES[app.stage] || { label: app.stage, color: 'bg-gray-100' };

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected ? 'bg-[#F4F4F2] border-l-2 border-l-[#111111]' : 'hover:bg-[#F9F9F8]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-normal text-[#111111]">
                          {app.firstName} {app.lastName}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-normal uppercase tracking-wider ${stageMeta.color}`}>
                          {app.stage}
                        </span>
                      </div>
                      <div className="text-xs text-[#555550] truncate">
                        {app.vacancyTitle}
                      </div>
                      <div className="text-[11px] text-[#8C8C85]">
                        {app.location} · Applied {app.createdAt.split('T')[0]}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {app.cvStoragePath && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadCv(app);
                          }}
                          className="p-1.5 rounded hover:bg-white text-[#6D6D68] hover:text-[#111111] border border-transparent hover:border-[#E8E8E5]"
                          title="Download CV"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#8C8C85]" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Candidate Profile & ATS Stage Management */}
        <div className="lg:col-span-5">
          {selectedApp ? (
            <div className="border border-[#E8E8E5] rounded bg-white p-6 space-y-6 shadow-xs sticky top-6">
              {/* Candidate Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E8E8E5]">
                <div>
                  <h2 className="text-lg font-light text-[#111111]">
                    {selectedApp.firstName} {selectedApp.lastName}
                  </h2>
                  <div className="text-xs text-[#6D6D68]">
                    Role: <strong className="font-normal text-[#111111]">{selectedApp.vacancyTitle}</strong>
                  </div>
                </div>

                {/* Stage dropdown */}
                <div>
                  <select
                    value={selectedApp.stage}
                    onChange={(e) => handleStageChange(selectedApp.id, e.target.value as ApplicationStage)}
                    disabled={isUpdatingStage}
                    className="px-2.5 py-1 text-xs border border-[#E8E8E5] rounded bg-white font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
                  >
                    {STAGE_KEYS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact & Professional Info */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#6D6D68]">Email</span>
                  <a href={`mailto:${selectedApp.email}`} className="text-[#2563EB] hover:underline font-normal">
                    {selectedApp.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6D6D68]">Phone</span>
                  <span className="text-[#111111]">{selectedApp.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6D6D68]">Location</span>
                  <span className="text-[#111111]">{selectedApp.location}</span>
                </div>
                {selectedApp.currentRole && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6D6D68]">Current Role</span>
                    <span className="text-[#111111]">{selectedApp.currentRole}</span>
                  </div>
                )}
                {selectedApp.currentEmployer && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6D6D68]">Current Employer</span>
                    <span className="text-[#111111]">{selectedApp.currentEmployer}</span>
                  </div>
                )}
                {selectedApp.linkedInUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6D6D68]">LinkedIn</span>
                    <a
                      href={selectedApp.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* CV Document Card */}
              {selectedApp.cvFileName && (
                <div className="p-3.5 rounded bg-[#F9F9F8] border border-[#E8E8E5] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-[#111111]">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                    <div>
                      <div className="font-normal truncate max-w-[200px]">{selectedApp.cvFileName}</div>
                      {selectedApp.cvFileSize && (
                        <div className="text-[10px] text-[#8C8C85]">
                          {(selectedApp.cvFileSize / 1024).toFixed(0)} KB
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadCv(selectedApp)}
                    className="px-3 py-1 bg-white border border-[#E8E8E5] hover:border-[#CCCCCC] text-xs font-normal text-[#111111] rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV</span>
                  </button>
                </div>
              )}

              {/* Supporting Statement */}
              {selectedApp.supportingStatement && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-[#6D6D68] uppercase tracking-wider">
                    Supporting Statement
                  </span>
                  <div className="p-3 bg-[#F9F9F8] rounded text-xs text-[#111111] leading-relaxed border border-[#E8E8E5]">
                    {selectedApp.supportingStatement}
                  </div>
                </div>
              )}

              {/* Internal Notes & Timeline */}
              <div className="space-y-3 pt-4 border-t border-[#E8E8E5]">
                <span className="text-[11px] font-medium text-[#6D6D68] uppercase tracking-wider block">
                  Internal Recruitment Notes ({selectedApp.notes?.length || 0})
                </span>

                {selectedApp.notes && selectedApp.notes.length > 0 ? (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {selectedApp.notes.map((note) => (
                      <div key={note.id} className="p-2.5 rounded bg-[#F9F9F8] border border-[#E8E8E5] text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10.5px] text-[#8C8C85]">
                          <span className="font-medium text-[#111111]">{note.authorName}</span>
                          <span>{note.createdAt.split('T')[0]}</span>
                        </div>
                        <p className="text-[#555550]">{note.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8C8C85]">No notes added yet.</p>
                )}

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add an internal note..."
                    className="flex-1 px-3 py-1.5 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !noteContent.trim()}
                    className="px-3 py-1.5 bg-[#111111] text-white rounded text-xs font-normal hover:bg-[#222222] disabled:opacity-50"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* GDPR Audit Footer */}
              <div className="pt-2 text-[10.5px] text-[#8C8C85] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>GDPR Consent verified at {selectedApp.consentTimestamp.split('T')[0]}</span>
              </div>
            </div>
          ) : (
            <div className="border border-[#E8E8E5] rounded bg-white p-8 text-center text-xs text-[#6D6D68]">
              Select a candidate on the left to view profile and manage stage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
