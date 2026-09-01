'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  User,
  Settings,
  Pencil,
  MapPin,
  Building,
  Briefcase,
  Globe,
  Calendar,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  BookOpen,
  Camera,
  Trash2,
} from 'lucide-react';
import { MemberAvatar } from '@/components/member/MemberAvatar';
import { AvatarCropModal } from '@/components/member/AvatarCropModal';

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface MemberData {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  memberStatus: string;
  profileVisibility: string;
  disciplines: string[];
  sectors: string[];
  qualifications: string[];
  badges: string[];
  reputationScore: number;
  joinedAt?: string;
}

const ALL_DISCIPLINES = [
  'Building Safety',
  'Fire Safety',
  'Electrical & M&E',
  'HVAC & Refrigeration',
  'Water Hygiene',
  'CAFM & Tech',
  'AI & Automation',
  'Asset Management',
  'Procurement',
  'Energy & Net Zero',
];

export function TemplateMemberProfile() {
  const searchParams = useSearchParams();
  const welcomeParam = searchParams.get('welcome') === '1';

  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'contributions' | 'activity'>('overview');

  // Edit Profile Drawer / State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    headline: '',
    bio: '',
    company: '',
    jobTitle: '',
    location: '',
    website: '',
    linkedinUrl: '',
    disciplines: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [editFeedback, setEditFeedback] = useState<{ success?: boolean; error?: string } | null>(null);

  // Avatar Management State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setCropModalOpen(true);
    // Reset file input value so re-selecting the same file triggers onChange
    e.target.value = '';
  };

  const handleConfirmCrop = async (croppedBlob: Blob) => {
    setUploadingAvatar(true);
    setAvatarFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', croppedBlob, 'avatar.webp');

      const res = await fetch('/api/member/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setAvatarFeedback({ error: data.error || 'Failed to upload profile photo.' });
      } else {
        setMember((prev) => (prev ? { ...prev, avatarUrl: data.avatarUrl } : null));
        setAvatarFeedback({ success: true, message: 'Profile photo updated successfully.' });
        setCropModalOpen(false);
        setTimeout(() => setAvatarFeedback(null), 3000);
      }
    } catch {
      setAvatarFeedback({ error: 'Network error uploading profile photo.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!confirm('Are you sure you want to remove your profile photo? Your profile will display your initials.')) {
      return;
    }

    setUploadingAvatar(true);
    setAvatarFeedback(null);

    try {
      const res = await fetch('/api/member/avatar', {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        setAvatarFeedback({ error: data.error || 'Failed to remove profile photo.' });
      } else {
        setMember((prev) => (prev ? { ...prev, avatarUrl: undefined } : null));
        setAvatarFeedback({ success: true, message: 'Profile photo removed.' });
        setTimeout(() => setAvatarFeedback(null), 3000);
      }
    } catch {
      setAvatarFeedback({ error: 'Network error removing profile photo.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => {
        if (res.status === 401) {
          setAuthError(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated && data.member) {
          setMember(data.member);
          setEditForm({
            headline: data.member.headline || '',
            bio: data.member.bio || '',
            company: data.member.company || '',
            jobTitle: data.member.jobTitle || '',
            location: data.member.location || '',
            website: data.member.website || '',
            linkedinUrl: data.member.linkedinUrl || '',
            disciplines: data.member.disciplines || [],
          });
        } else {
          setAuthError(true);
        }
      })
      .catch(() => {
        setAuthError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setEditFeedback(null);

    try {
      const res = await fetch('/api/member/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setEditFeedback({ success: false, error: data.error || 'Failed to save changes.' });
      } else {
        setMember((prev) => (prev ? { ...prev, ...data.member } : null));
        setEditFeedback({ success: true });
        setTimeout(() => {
          setIsEditing(false);
          setEditFeedback(null);
        }, 1000);
      }
    } catch {
      setEditFeedback({ success: false, error: 'Network error saving profile.' });
    } finally {
      setSaving(false);
    }
  };

  const formatJoinedDate = (dateStr?: string) => {
    if (!dateStr) return 'Member since August 2026';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Member since August 2026';
      return `Member since ${new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(date)}`;
    } catch {
      return 'Member since August 2026';
    }
  };

  // ── Loading Screen ──
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF9F7]">
        <Header solid={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-electric" />
        </main>
        <Footer />
      </div>
    );
  }

  // ── Unauthenticated State ──
  if (authError || !member) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF9F7] text-neutral-900 font-sans">
        <Header solid={true} />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-electric/10 border border-brand-electric/20 text-brand-electric mx-auto">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extralight text-neutral-900">
                Sign in to view your profile
              </h1>
              <p className="mt-2 text-sm font-extralight text-neutral-600">
                A verified EntireFM Lobby Member account is required to view and manage this identity.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/sign-in"
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/join"
                className="px-6 py-2.5 border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-700 font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors inline-flex items-center justify-center"
              >
                Become a Member
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase() || 'EM';

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F7] text-neutral-900 font-sans selection:bg-brand-electric selection:text-white">
      <Header solid={true} />

      <main className="flex-1 pb-24">
        {/* ── SUBTLE ARCHITECTURAL MASTHEAD ── */}
        <div className="w-full bg-[#0D131F] text-white border-b border-neutral-800 relative overflow-hidden py-8 sm:py-12">
          <div className="container-wide relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="h-px w-6 bg-brand-electric" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric-bright font-light">
                  Lobby Member Identity
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extralight text-brand-mist/70">
                Professional presence in the UK Facilities Management Intelligence Community
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/lobby/me"
                className="px-4 py-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-electric" />
                <span>My Workspace</span>
              </Link>
              <Link
                href="/member/settings"
                className="px-4 py-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5 text-neutral-300" />
                <span>Account Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── FULL-VIEWPORT PROFILE CONTAINER ── */}
        <div className="container-wide py-10 sm:py-14 space-y-12">
          
          {/* ── PROFILE HEADER HERO CARD ── */}
          <div className="bg-white border border-neutral-200/90 rounded-[8px] p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              
              {/* Left Column: Portrait & Primary Bio */}
              <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 flex-1">
                {/* Avatar Portrait */}
                <div className="relative group shrink-0">
                  <MemberAvatar
                    name={member.displayName}
                    avatarUrl={member.avatarUrl}
                    size="3xl"
                    priority={true}
                    className="shadow-sm border-2 border-neutral-200"
                  />
                </div>

                {/* Name, Headline, Metadata */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-neutral-900 leading-tight">
                      {member.displayName}
                    </h1>

                    {/* Member Recognition Badges */}
                    {member.badges?.map((badge, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-neutral-100 border border-neutral-200 text-[10px] uppercase font-medium tracking-wider text-neutral-700"
                      >
                        <ShieldCheck className="w-3 h-3 text-brand-electric" />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>

                  {/* Professional Headline */}
                  {member.headline ? (
                    <p className="text-base sm:text-lg font-light text-neutral-700 leading-relaxed max-w-3xl">
                      {member.headline}
                    </p>
                  ) : (
                    <p className="text-sm font-extralight text-neutral-400 italic">
                      No professional headline added yet.
                    </p>
                  )}

                  {/* Meta Strip: Role, Org, Location, Date */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs sm:text-sm font-extralight text-neutral-500">
                    {member.jobTitle && (
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-neutral-700">{member.jobTitle}</span>
                      </div>
                    )}

                    {member.company && (
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-neutral-700">{member.company}</span>
                      </div>
                    )}

                    {member.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-neutral-700">{member.location}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatJoinedDate(member.joinedAt)}</span>
                    </div>
                  </div>

                  {/* External Links */}
                  {(member.website || member.linkedinUrl) && (
                    <div className="flex items-center gap-4 pt-1 text-xs font-extralight">
                      {member.website && (
                        <a
                          href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-electric hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Website</span>
                        </a>
                      )}
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl.startsWith('http') ? member.linkedinUrl : `https://${member.linkedinUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-electric hover:underline flex items-center gap-1"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex sm:flex-row lg:flex-col items-center gap-3 shrink-0 pt-2 lg:pt-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <Link
                  href="/member/settings"
                  className="w-full sm:w-auto px-5 py-2.5 border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-700 font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>

            {/* Bio section if present */}
            {member.bio && (
              <div className="mt-8 pt-6 border-t border-neutral-100 max-w-4xl">
                <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">About</h2>
                <p className="text-sm sm:text-base font-extralight text-neutral-700 leading-relaxed whitespace-pre-line">
                  {member.bio}
                </p>
              </div>
            )}
          </div>

          {/* ── EDIT PROFILE INLINE DRAWER / FORM ── */}
          {isEditing && (
            <div className="bg-white border-2 border-neutral-900 rounded-[8px] p-6 sm:p-10 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                  <h2 className="text-xl font-light text-neutral-900">Edit Professional Profile</h2>
                  <p className="text-xs font-extralight text-neutral-500">
                    Update your public presence visible to other verified Lobby Members.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editFeedback && (
                <div
                  className={`p-3.5 rounded-[6px] text-xs font-light flex items-center gap-2 ${
                    editFeedback.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {editFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{editFeedback.success ? 'Profile saved successfully.' : editFeedback.error}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* ── PROFILE PHOTO SECTION ── */}
                <div className="border border-neutral-200/90 rounded-[6px] p-5 bg-[#FAF9F7] space-y-3">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-neutral-800 font-medium">
                      Profile photo
                    </h3>
                    <p className="text-xs font-extralight text-neutral-500 mt-0.5">
                      Upload a professional portrait. Recommended square crop, JPG, PNG or WebP up to 10MB.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-1">
                    <MemberAvatar
                      name={member.displayName}
                      avatarUrl={member.avatarUrl}
                      size="2xl"
                      className="shadow-sm border-2 border-neutral-200"
                    />

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <label className="cursor-pointer px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors inline-flex items-center gap-1.5 shadow-sm">
                          <Camera className="w-3.5 h-3.5" />
                          <span>{member.avatarUrl ? 'Change photo' : 'Upload photo'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleSelectImage}
                            disabled={uploadingAvatar}
                          />
                        </label>

                        {member.avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            disabled={uploadingAvatar}
                            className="px-3.5 py-2 border border-neutral-300 hover:border-rose-300 hover:bg-rose-50 text-neutral-700 hover:text-rose-700 font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors inline-flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove photo</span>
                          </button>
                        )}
                      </div>

                      {avatarFeedback && (
                        <p
                          className={`text-xs font-light ${
                            avatarFeedback.success ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {avatarFeedback.message || avatarFeedback.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extralight text-neutral-700">Job Title</label>
                    <input
                      type="text"
                      value={editForm.jobTitle}
                      onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                      placeholder="e.g. Managing Director"
                      className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extralight text-neutral-700">Company</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      placeholder="e.g. Alkota Group"
                      className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extralight text-neutral-700">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="e.g. Derbyshire, United Kingdom"
                      className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extralight text-neutral-700">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={editForm.linkedinUrl}
                      onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extralight text-neutral-700">Professional Headline</label>
                  <input
                    type="text"
                    value={editForm.headline}
                    onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                    placeholder="e.g. Managing Director at Alkota Group"
                    className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extralight text-neutral-700">Professional Bio</label>
                  <textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Summary of your facilities management background, engineering disciplines, and estate scope..."
                    className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                  />
                </div>

                {/* Professional Disciplines Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-extralight text-neutral-700">Focus Areas</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DISCIPLINES.map((d) => {
                      const active = editForm.disciplines.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() =>
                            setEditForm({
                              ...editForm,
                              disciplines: active
                                ? editForm.disciplines.filter((x) => x !== d)
                                : [...editForm.disciplines, d],
                            })
                          }
                          className={`px-3 py-1.5 rounded-[4px] text-xs font-extralight transition-colors ${
                            active
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 border border-neutral-300 text-neutral-700 font-extralight text-xs uppercase tracking-wider rounded-[6px] hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2"
                  >
                    <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── PROFILE NAVIGATION TABS ── */}
          <div className="border-b border-neutral-200 flex items-center gap-8 text-sm font-extralight">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-neutral-900 font-light border-b-2 border-brand-electric'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contributions')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'contributions'
                  ? 'text-neutral-900 font-light border-b-2 border-brand-electric'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Contributions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'activity'
                  ? 'text-neutral-900 font-light border-b-2 border-brand-electric'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Activity Stream
            </button>
          </div>

          {/* ── TAB CONTENT ── */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
              {/* Left Column: Focus Areas & Reputation */}
              <div className="space-y-8">
                {/* Focus Areas */}
                <div className="bg-white border border-neutral-200/90 rounded-[8px] p-6 sm:p-8 space-y-4">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Professional Focus Areas
                  </h2>
                  {member.disciplines && member.disciplines.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {member.disciplines.map((d, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-[6px] text-xs font-extralight text-neutral-800"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-extralight text-neutral-400">
                      No focus areas selected. Click &ldquo;Edit Profile&rdquo; to add your technical specialisms.
                    </p>
                  )}
                </div>

                {/* Community Reputation & Standing */}
                <div className="bg-white border border-neutral-200/90 rounded-[8px] p-6 sm:p-8 space-y-4">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Community Standing
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-4 pt-1">
                    <div className="p-4 rounded-[6px] bg-[#FAF9F7] border border-neutral-200/70">
                      <span className="text-2xl sm:text-3xl font-extralight text-neutral-900">
                        {member.reputationScore || 10}
                      </span>
                      <p className="text-xs font-extralight text-neutral-500 mt-1">Reputation Points</p>
                    </div>
                    <div className="p-4 rounded-[6px] bg-[#FAF9F7] border border-neutral-200/70">
                      <span className="text-2xl sm:text-3xl font-extralight text-neutral-900">
                        {member.badges?.length || 1}
                      </span>
                      <p className="text-xs font-extralight text-neutral-500 mt-1">Recognitions Earned</p>
                    </div>
                    <div className="p-4 rounded-[6px] bg-[#FAF9F7] border border-neutral-200/70">
                      <span className="text-2xl sm:text-3xl font-extralight text-emerald-700">Active</span>
                      <p className="text-xs font-extralight text-neutral-500 mt-1">Verified Member</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Destination Cards (Professional, Not Generic SaaS) */}
              <div className="space-y-6">
                <div className="bg-[#121826] text-white rounded-[8px] p-6 space-y-4 border border-neutral-800">
                  <div className="flex items-center gap-2 text-brand-electric text-[10px] font-medium uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lobby Workspace</span>
                  </div>
                  <h3 className="text-lg font-extralight text-white leading-snug">
                    Access your personal research &amp; bookmarks
                  </h3>
                  <p className="text-xs font-extralight text-brand-mist/70 leading-relaxed">
                    Review your saved compliance watches, private deep research reports, and followed topics.
                  </p>
                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      href="/lobby/me/research"
                      className="inline-flex items-center gap-2 text-xs font-extralight text-brand-electric-bright hover:text-white transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>My Research Library →</span>
                    </Link>
                    <Link
                      href="/lobby/me"
                      className="inline-flex items-center gap-2 text-xs font-extralight text-neutral-400 hover:text-white transition-colors"
                    >
                      <span>Open Full Workspace →</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contributions' && (
            <div className="bg-white border border-neutral-200/90 rounded-[8px] p-8 space-y-6">
              <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Community Contributions
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-[6px] border border-neutral-200 hover:border-neutral-300 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                    <span className="text-brand-electric font-light">Discussion Started</span>
                    <span>·</span>
                    <span>Recent</span>
                  </div>
                  <h3 className="text-base font-light text-neutral-900">
                    How are estate teams managing F-Gas regulation changes on older R410A split systems?
                  </h3>
                  <p className="text-xs font-extralight text-neutral-600 mt-1">
                    Shared insights on commercial chiller phase-downs and compliant replacement strategies.
                  </p>
                </div>

                <div className="p-4 rounded-[6px] border border-neutral-200 hover:border-neutral-300 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                    <span className="text-emerald-600 font-light">Accepted Technical Answer</span>
                    <span>·</span>
                    <span>Recent</span>
                  </div>
                  <h3 className="text-base font-light text-neutral-900">
                    Mandatory testing intervals for commercial emergency lighting (BS 5266-1)
                  </h3>
                  <p className="text-xs font-extralight text-neutral-600 mt-1">
                    Clarified monthly functional flick-test requirements vs annual 3-hour discharge tests.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white border border-neutral-200/90 rounded-[8px] p-8 space-y-6">
              <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Recent Community Activity
              </h2>
              <div className="relative pl-6 border-l border-neutral-200 space-y-6">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-electric ring-4 ring-white" />
                  <p className="text-xs text-neutral-400">2 days ago</p>
                  <p className="text-sm font-light text-neutral-900 mt-0.5">
                    Participated in <Link href="/lobby/community" className="text-brand-electric hover:underline">Building Safety Act Golden Thread Discussion</Link>
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-400 ring-4 ring-white" />
                  <p className="text-xs text-neutral-400">4 days ago</p>
                  <p className="text-sm font-light text-neutral-900 mt-0.5">
                    Saved compliance briefing <Link href="/lobby/compliance" className="text-brand-electric hover:underline">Building Safety Act Part 4 Guidance</Link> to Workspace
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-400 ring-4 ring-white" />
                  <p className="text-xs text-neutral-400">1 week ago</p>
                  <p className="text-sm font-light text-neutral-900 mt-0.5">
                    Voted in <Link href="/lobby" className="text-brand-electric hover:underline">The Pulse: Contractor Pricing Indexes for Q3</Link>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── INTERACTIVE AVATAR CROP & REPOSITION MODAL ── */}
      {selectedFile && (
        <AvatarCropModal
          file={selectedFile}
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setSelectedFile(null);
          }}
          onConfirm={handleConfirmCrop}
          saving={uploadingAvatar}
        />
      )}

      <Footer />
    </div>
  );
}
