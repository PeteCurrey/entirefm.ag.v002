'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Building,
  Plus,
  Loader2,
  X,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export interface SiteProfileOption {
  id: string;
  name: string;
  building_type: string;
  floor_area: string;
  region: string;
}

export interface SaveToWorkspaceButtonProps {
  toolName: string;
  defaultTitle: string;
  inputsJson: Record<string, any>;
  outputsJson: Record<string, any>;
  summaryKpis: Record<string, any>;
  pdfReference?: string | null;
  className?: string;
  buttonText?: string;
  onSaveSuccess?: (savedRecord: any) => void;
}

export function SaveToWorkspaceButton({
  toolName,
  defaultTitle,
  inputsJson,
  outputsJson,
  summaryKpis,
  pdfReference = null,
  className = '',
  buttonText = 'Save to Workspace',
  onSaveSuccess,
}: SaveToWorkspaceButtonProps) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [memberName, setMemberName] = useState<string>('');
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState(defaultTitle);
  const [siteProfiles, setSiteProfiles] = useState<SiteProfileOption[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // New site profile inline creation
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileBuildingType, setNewProfileBuildingType] = useState('Commercial Office / Corporate HQ');
  const [newProfileFloorArea, setNewProfileFloorArea] = useState('45,000 sq ft');
  const [newProfileRegion, setNewProfileRegion] = useState('Midlands (Birmingham, Nottingham, Derby)');
  const [newProfileOperatingProfile, setNewProfileOperatingProfile] = useState('Standard Business Hours (07:00–19:00)');
  const [newProfileCriticality, setNewProfileCriticality] = useState('Standard Commercial');

  // Saving states
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check auth on mount
  const checkAuth = useCallback(async () => {
    try {
      setAuthChecking(true);
      const res = await fetch('/api/member/me');
      if (!res.ok) {
        setIsAuthenticated(false);
        return false;
      }
      const data = await res.json();
      if (data.authenticated && data.member) {
        setIsAuthenticated(true);
        setMemberName(data.member.displayName || data.member.firstName || 'Member');
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch {
      setIsAuthenticated(false);
      return false;
    } finally {
      setAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Load site profiles when authenticated modal opens
  const loadSiteProfiles = useCallback(async () => {
    try {
      setLoadingProfiles(true);
      const res = await fetch('/api/member/workspace/profiles');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSiteProfiles(json.data);
          if (json.data.length > 0 && !selectedProfileId) {
            setSelectedProfileId(json.data[0].id);
          }
        }
      }
    } catch (err) {
      console.error('[LOAD_PROFILES_ERROR]:', err);
    } finally {
      setLoadingProfiles(false);
    }
  }, [selectedProfileId]);

  const handleClick = async () => {
    setTitle(defaultTitle);
    setSavedSuccess(false);
    setErrorMessage(null);

    // Re-verify auth if not already known
    const authed = isAuthenticated ?? (await checkAuth());

    if (!authed) {
      setIsAuthPromptOpen(true);
    } else {
      setIsModalOpen(true);
      loadSiteProfiles();
    }
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      setErrorMessage('Please enter a name for the new estate profile.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      const res = await fetch('/api/member/workspace/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProfileName.trim(),
          building_type: newProfileBuildingType,
          floor_area: newProfileFloorArea,
          region: newProfileRegion,
          operating_profile: newProfileOperatingProfile,
          site_criticality: newProfileCriticality,
          portfolio_sites: 1,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to create site profile');
      }

      setSiteProfiles((prev) => [json.data, ...prev]);
      setSelectedProfileId(json.data.id);
      setIsCreatingProfile(false);
      setNewProfileName('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not create site profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOutput = async () => {
    try {
      setSaving(true);
      setErrorMessage(null);

      const res = await fetch('/api/member/workspace/outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_profile_id: selectedProfileId || null,
          tool_name: toolName,
          title: title.trim() || defaultTitle,
          inputs_json: inputsJson,
          outputs_json: outputsJson,
          summary_kpis: summaryKpis,
          pdf_reference: pdfReference,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save to workspace');
      }

      setSavedSuccess(true);
      if (onSaveSuccess) {
        onSaveSuccess(json.data);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error saving to workspace. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={handleClick}
        disabled={authChecking}
        className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider px-4 py-2.5 rounded-sm transition-all shadow-2xs active:scale-[0.99] ${
          savedSuccess
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            : 'bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 hover:border-neutral-400'
        } ${className}`}
      >
        {authChecking ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
        ) : savedSuccess ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Bookmark className="w-3.5 h-3.5 text-brand-electric" />
        )}
        <span>{savedSuccess ? 'Saved to Workspace' : buttonText}</span>
      </button>

      {/* ── Unauthenticated Sign-In Prompt Modal ── */}
      {isAuthPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-md border border-neutral-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              type="button"
              onClick={() => setIsAuthPromptOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-sm hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-brand-electric/10 border border-brand-electric/20 flex items-center justify-center text-brand-electric mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-electric block">
                LOBBY MEMBER WORKSPACE
              </span>
              <h3 className="text-xl font-light text-neutral-900 tracking-tight">
                Sign in to save this output
              </h3>
              <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                Save your calculations, asset schedules, and compliance audits to your private Member Workspace. Re-access or regenerate exports anytime without re-entering data.
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-neutral-50 border border-neutral-200/80 space-y-1.5 text-xs font-light text-neutral-700">
              <div className="flex items-center gap-1.5 font-medium text-neutral-900">
                <Bookmark className="w-3.5 h-3.5 text-brand-electric" />
                <span>What gets saved:</span>
              </div>
              <div className="text-[11px] text-neutral-600 pl-5 space-y-0.5">
                <div>• All inputs and tailored calculation parameters</div>
                <div>• Output breakdowns and statutory matrices</div>
                <div>• Optional linkage to your estate site profile</div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href="/sign-in?redirect=back"
                className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-wider py-3 rounded-sm transition-colors"
              >
                <span>Sign In to Your Lobby Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/lobby/join"
                className="w-full inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium uppercase tracking-wider py-2.5 rounded-sm transition-colors border border-neutral-200"
              >
                <span>Create Free Member Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Authenticated Save Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-md border border-neutral-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-sm hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-electric" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-electric">
                  WORKSPACE VAULT
                </span>
              </div>
              <h3 className="text-xl font-light text-neutral-900 tracking-tight">
                Save to Member Workspace
              </h3>
              <p className="text-xs font-extralight text-neutral-500">
                Saving as <span className="font-medium text-neutral-800">{memberName}</span>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-sm bg-rose-50 border border-rose-200 text-rose-800 text-xs font-light flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {savedSuccess ? (
              <div className="p-6 rounded-sm bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-normal text-emerald-900">
                    Saved to your Workspace!
                  </h4>
                  <p className="text-xs text-emerald-700 font-light">
                    You can view, re-download, or reopen this calculation in your Member Profile anytime.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <Link
                    href="/member/profile?tab=workspace"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium uppercase tracking-wider rounded-sm transition-colors"
                  >
                    <span>View in Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-700 block">
                    Record Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-sm text-sm focus:outline-hidden focus:border-neutral-900 transition-colors"
                    placeholder="e.g. Manchester Office 2026 PPM Budget"
                  />
                </div>

                {/* Site Profile Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-700">
                      Estate / Site Profile
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingProfile(!isCreatingProfile)}
                      className="text-xs text-brand-electric hover:underline inline-flex items-center gap-1 font-light"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isCreatingProfile ? 'Select existing profile' : 'Create new site'}</span>
                    </button>
                  </div>

                  {isCreatingProfile ? (
                    <div className="p-4 bg-neutral-50 rounded-sm border border-neutral-200 space-y-3 animate-in fade-in duration-150">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block">
                        New Site Profile Details
                      </span>
                      <input
                        type="text"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="Site Name (e.g. Leeds Distribution Hub)"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-sm text-xs bg-white focus:outline-hidden focus:border-neutral-900"
                      />
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">
                            Building Sector
                          </label>
                          <select
                            value={newProfileBuildingType}
                            onChange={(e) => setNewProfileBuildingType(e.target.value)}
                            className="w-full px-2 py-1.5 border border-neutral-300 rounded-sm text-xs bg-white"
                          >
                            <option value="Commercial Office / Corporate HQ">Commercial Office</option>
                            <option value="Industrial & Manufacturing Facility">Industrial / Plant</option>
                            <option value="Logistics & Distribution Warehousing">Logistics Hub</option>
                            <option value="Retail & Shopping Centres">Retail Centre</option>
                            <option value="Healthcare & Clinical Environments">Healthcare</option>
                            <option value="Hotels & Hospitality Estates">Hospitality</option>
                            <option value="Education & University Campuses">Education</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">
                            Floor Area
                          </label>
                          <input
                            type="text"
                            value={newProfileFloorArea}
                            onChange={(e) => setNewProfileFloorArea(e.target.value)}
                            className="w-full px-2 py-1.5 border border-neutral-300 rounded-sm text-xs bg-white"
                            placeholder="e.g. 45,000 sq ft"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateProfile}
                        disabled={saving || !newProfileName.trim()}
                        className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs font-medium uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                        <span>Save &amp; Link Profile</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      {loadingProfiles ? (
                        <div className="p-3 text-xs text-neutral-400 font-light flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Loading your site profiles...</span>
                        </div>
                      ) : siteProfiles.length > 0 ? (
                        <select
                          value={selectedProfileId}
                          onChange={(e) => setSelectedProfileId(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-sm text-sm bg-white focus:outline-hidden focus:border-neutral-900 transition-colors"
                        >
                          <option value="">-- No specific site (General Portfolio) --</option>
                          {siteProfiles.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.building_type}, {p.floor_area})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-3 bg-neutral-50 rounded-sm border border-neutral-200 text-xs text-neutral-500 font-light flex items-center justify-between">
                          <span>No site profiles created yet.</span>
                          <button
                            type="button"
                            onClick={() => setIsCreatingProfile(true)}
                            className="text-brand-electric font-medium hover:underline"
                          >
                            + Create one now
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* KPI Preview Chips */}
                {summaryKpis && Object.keys(summaryKpis).length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block">
                      Summary KPIs Saved
                    </label>
                    <div className="p-3 bg-neutral-50 rounded-sm border border-neutral-200 grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(summaryKpis)
                        .slice(0, 4)
                        .map(([key, val]) => (
                          <div key={key} className="truncate">
                            <span className="text-[10px] text-neutral-400 block uppercase font-mono">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="font-medium text-neutral-800">
                              {typeof val === 'number'
                                ? val > 1000
                                  ? `£${val.toLocaleString()}`
                                  : val
                                : String(val)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs uppercase font-medium tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveOutput}
                    disabled={saving}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs font-medium uppercase tracking-wider rounded-sm transition-colors inline-flex items-center gap-2 shadow-sm"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirm &amp; Save</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
