'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LearningPath, Assessment, AssessmentQuestion } from '@/server/academy/types';
import {
  BookOpen,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

interface Props {
  initialPath: LearningPath;
  initialAssessment: Assessment | null;
  isNew: boolean;
}

type EditableQuestion = {
  id: string;
  prompt: string;
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
  explanation?: string;
};

export function AdminAcademyEditorClient({ initialPath, initialAssessment, isNew }: Props) {
  const router = useRouter();

  // Path form state
  const [title, setTitle] = useState(initialPath.title);
  const [slug, setSlug] = useState(initialPath.slug);
  const [description, setDescription] = useState(initialPath.description);
  const [targetRole, setTargetRole] = useState(initialPath.targetRole);
  const [passMarkPercent, setPassMarkPercent] = useState(initialPath.passMarkPercent);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(initialPath.status);
  const [modules, setModules] = useState(initialPath.modules);

  // Assessment form state
  const [questions, setQuestions] = useState<EditableQuestion[]>(
    (initialAssessment?.questions || []).map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options.map((o) => ({ id: o.id, label: o.label })),
      correctOptionId: q.correctOptionId,
      explanation: q.explanation,
    }))
  );

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pathId = initialPath.id;

  // ─── Helpers ───────────────────────────────────────────────
  function generateId(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function autoSlug(t: string) {
    return t
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .trim();
  }

  // ─── Module Handlers ───────────────────────────────────────
  function addModule() {
    setModules((prev) => [
      ...prev,
      {
        id: generateId('mod'),
        order: prev.length + 1,
        title: 'New Module',
        durationMinutes: 30,
        summary: '',
        keyTopics: [],
        readingContent: '',
      },
    ]);
  }

  function removeModule(idx: number) {
    setModules((prev) => prev.filter((_, i) => i !== idx).map((m, i) => ({ ...m, order: i + 1 })));
  }

  function moveModule(idx: number, dir: -1 | 1) {
    const newMods = [...modules];
    const target = idx + dir;
    if (target < 0 || target >= newMods.length) return;
    [newMods[idx], newMods[target]] = [newMods[target], newMods[idx]];
    setModules(newMods.map((m, i) => ({ ...m, order: i + 1 })));
  }

  // ─── Question Handlers ─────────────────────────────────────
  function addQuestion() {
    const qid = generateId('q');
    setQuestions((prev) => [
      ...prev,
      {
        id: qid,
        prompt: '',
        options: [
          { id: generateId('opt'), label: '' },
          { id: generateId('opt'), label: '' },
        ],
        correctOptionId: '',
      },
    ]);
  }

  function removeQuestion(qIdx: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== qIdx));
  }

  function addOption(qIdx: number) {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx] = {
        ...copy[qIdx],
        options: [...copy[qIdx].options, { id: generateId('opt'), label: '' }],
      };
      return copy;
    });
  }

  function removeOption(qIdx: number, oIdx: number) {
    setQuestions((prev) => {
      const copy = [...prev];
      const newOpts = copy[qIdx].options.filter((_, i) => i !== oIdx);
      const stillValid = newOpts.some((o) => o.id === copy[qIdx].correctOptionId);
      copy[qIdx] = {
        ...copy[qIdx],
        options: newOpts,
        correctOptionId: stillValid ? copy[qIdx].correctOptionId : '',
      };
      return copy;
    });
  }

  // ─── Save Actions ──────────────────────────────────────────
  async function savePath() {
    setSaving(true);
    setStatusMessage(null);
    try {
      const payload = {
        title,
        slug: slug || autoSlug(title),
        description,
        targetRole,
        passMarkPercent,
        modules,
        status,
      };

      let res: Response;
      if (isNew) {
        res = await fetch('/api/admin/academy/paths', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/academy/paths/${pathId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed.');

      setStatusMessage({ type: 'success', text: isNew ? 'Learning Path created successfully.' : 'Path saved.' });
      if (isNew && data.path?.id) {
        router.push(`/admin/academy/${data.path.id}`);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function saveAssessment() {
    setSaving(true);
    setStatusMessage(null);
    try {
      // Validate before sending
      for (const q of questions) {
        if (!q.prompt.trim()) throw new Error('All questions must have a prompt.');
        if (!q.correctOptionId) throw new Error(`Question "${q.prompt.slice(0, 40)}" needs a correct answer selected.`);
        if (!q.options.some((o) => o.id === q.correctOptionId)) {
          throw new Error(`Question "${q.prompt.slice(0, 40)}" has an invalid correctOptionId.`);
        }
      }

      const res = await fetch('/api/admin/academy/assessments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathId, questions }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save assessment.');
      setStatusMessage({ type: 'success', text: `Assessment saved. Version ${data.assessment?.version}.` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-10">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => router.push('/admin/academy')}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200">
            <GraduationCap className="w-5 h-5 text-neutral-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              {isNew ? 'Create Learning Path' : `Editing: ${initialPath.title}`}
            </h1>
            <p className="text-xs text-neutral-500">
              {isNew
                ? 'Draft will be invisible to members until published.'
                : `ID: ${pathId} · Version: ${initialAssessment?.version ?? 0}`}
            </p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* ── Section 1: Path Details ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-neutral-600" />
          <h2 className="text-sm font-semibold text-neutral-900">Path Details</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug || slug === autoSlug(title)) setSlug(autoSlug(e.target.value));
                }}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                placeholder="e.g. FM Compliance Foundations"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                placeholder="e.g. Compliance Lead"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-400"
                placeholder="auto-generated from title"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Pass Mark (%)</label>
              <input
                type="number"
                min={50}
                max={100}
                value={passMarkPercent}
                onChange={(e) => setPassMarkPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
              placeholder="What members will learn and achieve from this path..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Status</label>
            <div className="flex gap-3">
              {(['draft', 'published', 'archived'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${
                    status === s
                      ? s === 'published'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : s === 'draft'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-neutral-700 text-white border-neutral-700'
                      : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {status === 'published' && (
              <p className="mt-2 text-xs text-emerald-700 font-medium">
                ✓ Members can discover and take this path once published.
              </p>
            )}
            {status === 'draft' && (
              <p className="mt-2 text-xs text-amber-600 font-medium">
                ⚠ Draft paths are unreachable by members.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-neutral-100 flex justify-end">
            <button
              onClick={savePath}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? 'Create Path' : 'Save Path'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 2: Modules ──────────────────────────────────── */}
      {!isNew && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-600" />
              <h2 className="text-sm font-semibold text-neutral-900">
                Modules ({modules.length})
              </h2>
            </div>
            <button
              onClick={addModule}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Module
            </button>
          </div>
          <div className="divide-y divide-neutral-100">
            {modules.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-neutral-400">
                No modules yet — click "Add Module" to get started.
              </div>
            )}
            {modules.map((mod, idx) => (
              <div key={mod.id} className="px-6 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400 w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    value={mod.title}
                    onChange={(e) => {
                      const m = [...modules];
                      m[idx] = { ...m[idx], title: e.target.value };
                      setModules(m);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-300"
                    placeholder="Module title"
                  />
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveModule(idx, -1)} disabled={idx === 0} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveModule(idx, 1)} disabled={idx === modules.length - 1} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeModule(idx)} className="p-1 rounded text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="ml-7">
                  <textarea
                    rows={2}
                    value={mod.summary}
                    onChange={(e) => {
                      const m = [...modules];
                      m[idx] = { ...m[idx], summary: e.target.value };
                      setModules(m);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-300 resize-none"
                    placeholder="Module summary..."
                  />
                </div>
              </div>
            ))}
          </div>
          {modules.length > 0 && (
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end">
              <button
                onClick={savePath}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Modules
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Section 3: Assessment / Question Bank ──────────────── */}
      {!isNew && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-neutral-600" />
              <h2 className="text-sm font-semibold text-neutral-900">
                Assessment Questions ({questions.length})
              </h2>
            </div>
            <button
              onClick={addQuestion}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>

          {/* Security banner */}
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-2">
            <span className="text-xs font-semibold text-amber-800">🔐 Admin-only:</span>
            <span className="text-xs text-amber-700">
              Correct answers (correctOptionId) are stored server-side and never served to member
              assessment requests. This view is gated to authenticated EntireFM administrators only.
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {questions.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-neutral-400">
                No questions yet — click "Add Question" to build your question bank.
              </div>
            )}
            {questions.map((q, qIdx) => (
              <div key={q.id} className="px-6 py-5 space-y-4">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-neutral-400 pt-2.5 w-5 shrink-0">{qIdx + 1}.</span>
                  <div className="flex-1 space-y-2">
                    <textarea
                      rows={2}
                      value={q.prompt}
                      onChange={(e) => {
                        const qs = [...questions];
                        qs[qIdx] = { ...qs[qIdx], prompt: e.target.value };
                        setQuestions(qs);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
                      placeholder="Question prompt..."
                    />

                    {/* Options */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctOptionId === opt.id}
                            onChange={() => {
                              const qs = [...questions];
                              qs[qIdx] = { ...qs[qIdx], correctOptionId: opt.id };
                              setQuestions(qs);
                            }}
                            className="accent-emerald-600 w-4 h-4 shrink-0"
                            title="Mark as correct answer"
                          />
                          <input
                            type="text"
                            value={opt.label}
                            onChange={(e) => {
                              const qs = [...questions];
                              const opts = [...qs[qIdx].options];
                              opts[oIdx] = { ...opts[oIdx], label: e.target.value };
                              qs[qIdx] = { ...qs[qIdx], options: opts };
                              setQuestions(qs);
                            }}
                            className={`flex-1 px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
                              q.correctOptionId === opt.id
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold'
                                : 'border-neutral-200 text-neutral-700'
                            }`}
                            placeholder={`Option ${oIdx + 1}`}
                          />
                          <button
                            onClick={() => removeOption(qIdx, oIdx)}
                            disabled={q.options.length <= 2}
                            className="p-1 rounded text-red-400 hover:text-red-600 disabled:opacity-30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => addOption(qIdx)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        + Add Option
                      </button>
                      {q.correctOptionId && (
                        <span className="text-xs text-emerald-600 font-medium">✓ Correct answer selected</span>
                      )}
                      {!q.correctOptionId && (
                        <span className="text-xs text-amber-600 font-medium">⚠ Select the correct answer (radio button)</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeQuestion(qIdx)}
                    className="p-1.5 rounded text-red-400 hover:text-red-600 mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {questions.length > 0 && (
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end">
              <button
                onClick={saveAssessment}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Assessment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
