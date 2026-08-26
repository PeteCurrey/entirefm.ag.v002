'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Download,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
  Tag,
  Plus,
  ExternalLink,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { TalentPoolCandidate, Vacancy } from '@/server/careers/types';

interface TalentPoolClientProps {
  initialCandidates: TalentPoolCandidate[];
  vacancies: Vacancy[];
}

const INTEREST_AREAS = [
  'ALL',
  'Engineering',
  'Facilities Management',
  'Operations',
  'Helpdesk',
  'Contract Management',
  'Projects',
  'Commercial',
  'Business Development',
  'Finance',
  'Procurement',
  'Technology / Digital',
  'Marketing',
];

export function TalentPoolClient({ initialCandidates, vacancies }: TalentPoolClientProps) {
  const [candidates, setCandidates] = useState<TalentPoolCandidate[]>(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<TalentPoolCandidate | null>(
    initialCandidates[0] || null
  );
  const [interestFilter, setInterestFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newSkillTag, setNewSkillTag] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');

  const filtered = candidates.filter((c) => {
    if (interestFilter !== 'ALL' && !c.interestAreas.some((ia) => ia.toLowerCase() === interestFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.preferredLocation.toLowerCase().includes(q) ||
        (c.currentRole && c.currentRole.toLowerCase().includes(q)) ||
        c.skillsTags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAddSkill = (skill: string) => {
    if (!selectedCandidate || !skill.trim()) return;
    const clean = skill.trim();
    if (selectedCandidate.skillsTags.includes(clean)) return;

    const updatedTags = [...selectedCandidate.skillsTags, clean];
    const updatedCandidate = { ...selectedCandidate, skillsTags: updatedTags };

    setSelectedCandidate(updatedCandidate);
    setCandidates((prev) => prev.map((c) => (c.id === selectedCandidate.id ? updatedCandidate : c)));
    setNewSkillTag('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !noteContent.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      authorName: 'Admin Recruiter',
      authorEmail: 'admin@entirefm.com',
      createdAt: new Date().toISOString(),
      content: noteContent.trim(),
    };

    const updatedCandidate = {
      ...selectedCandidate,
      notes: [...selectedCandidate.notes, newNote],
    };

    setSelectedCandidate(updatedCandidate);
    setCandidates((prev) => prev.map((c) => (c.id === selectedCandidate.id ? updatedCandidate : c)));
    setNoteContent('');
  };

  const handleDownloadCv = async (c: TalentPoolCandidate) => {
    if (!c.cvStoragePath) return;
    try {
      const res = await fetch(`/api/careers/cv-download?path=${encodeURIComponent(c.cvStoragePath)}`);
      if (res.ok) {
        window.open(`/api/careers/cv-download?path=${encodeURIComponent(c.cvStoragePath)}`, '_blank');
      }
    } catch (err) {
      console.error('Failed to download CV:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Interest Areas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {INTEREST_AREAS.slice(0, 6).map((area) => (
            <button
              key={area}
              onClick={() => setInterestFilter(area)}
              className={`px-3 py-1.5 text-xs rounded transition-colors whitespace-nowrap ${
                interestFilter === area
                  ? 'bg-[#111111] text-white font-normal'
                  : 'bg-white text-[#6D6D68] hover:text-[#111111] border border-[#E8E8E5]'
              }`}
            >
              {area === 'ALL' ? 'All Disciplines' : area}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72 relative">
          <Search className="w-3.5 h-3.5 text-[#6D6D68] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by skill, name, location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Talent List (7 cols) */}
        <div className="lg:col-span-7 border border-[#E8E8E5] rounded bg-white overflow-hidden shadow-xs">
          <div className="divide-y divide-[#E8E8E5]">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6D6D68]">
                No talent pool candidates matching search criteria.
              </div>
            ) : (
              filtered.map((c) => {
                const isSelected = selectedCandidate?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`p-4 transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected ? 'bg-[#F4F4F2] border-l-2 border-l-[#111111]' : 'hover:bg-[#F9F9F8]'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-normal text-[#111111]">
                          {c.firstName} {c.lastName}
                        </span>
                        {c.currentRole && (
                          <span className="text-xs text-[#6D6D68] truncate">
                            · {c.currentRole}
                          </span>
                        )}
                      </div>

                      {/* Interest Badges */}
                      <div className="flex flex-wrap gap-1">
                        {c.interestAreas.map((ia) => (
                          <span
                            key={ia}
                            className="px-1.5 py-0.5 rounded bg-[#F4F4F2] text-[#555550] text-[10px]"
                          >
                            {ia}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-[#8C8C85]">
                        {c.preferredLocation} · Availability: {c.availability || 'Immediate'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {c.cvStoragePath && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadCv(c);
                          }}
                          className="p-1.5 rounded hover:bg-white text-[#6D6D68] hover:text-[#111111] border border-transparent hover:border-[#E8E8E5]"
                          title="Download CV"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Candidate Profile & Skills Tagging (5 cols) */}
        <div className="lg:col-span-5">
          {selectedCandidate ? (
            <div className="border border-[#E8E8E5] rounded bg-white p-6 space-y-6 shadow-xs sticky top-6">
              {/* Header */}
              <div className="pb-4 border-b border-[#E8E8E5] space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-light text-[#111111]">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] uppercase font-normal">
                    {selectedCandidate.status}
                  </span>
                </div>
                {selectedCandidate.currentRole && (
                  <p className="text-xs text-[#6D6D68]">
                    {selectedCandidate.currentRole} {selectedCandidate.currentEmployer ? `at ${selectedCandidate.currentEmployer}` : ''}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#6D6D68]">Email</span>
                  <a href={`mailto:${selectedCandidate.email}`} className="text-[#2563EB] hover:underline font-normal">
                    {selectedCandidate.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6D6D68]">Phone</span>
                  <span className="text-[#111111]">{selectedCandidate.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6D6D68]">Preferred Location</span>
                  <span className="text-[#111111]">{selectedCandidate.preferredLocation}</span>
                </div>
                {selectedCandidate.salaryExpectation && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6D6D68]">Salary Guide</span>
                    <span className="text-[#111111]">{selectedCandidate.salaryExpectation}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#6D6D68]">Notice Period</span>
                  <span className="text-[#111111]">{selectedCandidate.availability || 'Not specified'}</span>
                </div>
                {selectedCandidate.linkedInUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6D6D68]">LinkedIn</span>
                    <a
                      href={selectedCandidate.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* CV Card */}
              {selectedCandidate.cvFileName && (
                <div className="p-3.5 rounded bg-[#F9F9F8] border border-[#E8E8E5] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-[#111111]">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-normal truncate max-w-[200px]">{selectedCandidate.cvFileName}</span>
                  </div>
                  <button
                    onClick={() => handleDownloadCv(selectedCandidate)}
                    className="px-3 py-1 bg-white border border-[#E8E8E5] hover:border-[#CCCCCC] text-xs font-normal text-[#111111] rounded flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              )}

              {/* Candidate Summary */}
              {selectedCandidate.introduction && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-[#6D6D68] uppercase tracking-wider">
                    Candidate Summary
                  </span>
                  <p className="p-3 bg-[#F9F9F8] rounded text-xs text-[#111111] leading-relaxed border border-[#E8E8E5]">
                    {selectedCandidate.introduction}
                  </p>
                </div>
              )}

              {/* Skills & Tags Builder */}
              <div className="space-y-2 pt-4 border-t border-[#E8E8E5]">
                <span className="text-[11px] font-medium text-[#6D6D68] uppercase tracking-wider block">
                  Skills &amp; Match Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skillsTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded bg-[#F4F4F2] border border-[#E8E8E5] text-xs text-[#111111]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newSkillTag}
                    onChange={(e) => setNewSkillTag(e.target.value)}
                    placeholder="Add a skill or trade tag..."
                    className="flex-1 px-3 py-1 text-xs border border-[#E8E8E5] rounded text-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkillTag)}
                    className="px-3 py-1 bg-[#111111] text-white rounded text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-3 pt-4 border-t border-[#E8E8E5]">
                <span className="text-[11px] font-medium text-[#6D6D68] uppercase tracking-wider block">
                  Recruiter Notes ({selectedCandidate.notes.length})
                </span>
                {selectedCandidate.notes.length > 0 && (
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {selectedCandidate.notes.map((note) => (
                      <div key={note.id} className="p-2.5 rounded bg-[#F9F9F8] border border-[#E8E8E5] text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10.5px] text-[#8C8C85]">
                          <span className="font-medium text-[#111111]">{note.authorName}</span>
                          <span>{note.createdAt.split('T')[0]}</span>
                        </div>
                        <p className="text-[#555550]">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add recruiter note..."
                    className="flex-1 px-3 py-1.5 text-xs border border-[#E8E8E5] rounded text-[#111111]"
                  />
                  <button
                    type="submit"
                    disabled={!noteContent.trim()}
                    className="px-3 py-1.5 bg-[#111111] text-white rounded text-xs disabled:opacity-50"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* GDPR Info */}
              <div className="pt-2 text-[10.5px] text-[#8C8C85] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Consent active until {selectedCandidate.retentionExpiresAt.split('T')[0]}</span>
              </div>
            </div>
          ) : (
            <div className="border border-[#E8E8E5] rounded bg-white p-8 text-center text-xs text-[#6D6D68]">
              Select a candidate to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
