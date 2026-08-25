import { Metadata } from 'next';
import Link from 'next/link';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'Automation Settings | Blog | EntireFM Admin' };

export default function AutomationPage() {
  const s = memoryStore.settings;
  const jobs = memoryStore.jobs.slice(0, 10);

  const jobStatus = (status: string) => {
    if (status === 'COMPLETED') return 'text-emerald-400';
    if (status === 'FAILED') return 'text-red-400';
    if (status === 'PROCESSING') return 'text-blue-400';
    return 'text-zinc-400';
  };

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Automation Settings</h1>
          <p className="text-sm text-zinc-400 mt-1">Editorial automation controls, kill switches, and quality gates</p>
        </div>
        <Link href="/admin/blog/automation/jobs" className="text-sm text-blue-400 hover:text-blue-300">View job log →</Link>
      </div>

      {/* Emergency Hold Banner */}
      {s.emergencyHold && (
        <div className="bg-red-950/40 border border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="text-sm font-normal text-red-300">EMERGENCY HOLD ACTIVE</h3>
              <p className="text-xs text-red-400 mt-0.5">All automated publication actions are suspended. Manual publishing still available.</p>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-normal text-zinc-300 uppercase tracking-wider">Master Controls</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Automation Enabled', key: 'automationEnabled', value: s.automationEnabled, desc: 'Master switch for all automated blog actions' },
            { label: 'Auto Research', key: 'autoResearchEnabled', value: s.autoResearchEnabled, desc: 'Automatically discover new FM topics' },
            { label: 'Auto Draft', key: 'autoDraftEnabled', value: s.autoDraftEnabled, desc: 'Generate editorial drafts from approved topics' },
            { label: 'Auto Publish', key: 'autoPublishEnabled', value: s.autoPublishEnabled, desc: 'Schedule approved drafts for automatic publication' },
            { label: 'Emergency Hold', key: 'emergencyHold', value: s.emergencyHold, desc: '🚨 Suspend all automated publishing immediately', danger: true },
          ].map(ctrl => (
            <div key={ctrl.key} className={`flex items-start justify-between p-4 rounded-xl border ${
              ctrl.danger ? 'border-red-800/40 bg-red-950/20' : 'border-zinc-700 bg-zinc-800/50'
            }`}>
              <div>
                <div className={`text-sm font-normal ${ctrl.danger ? 'text-red-300' : 'text-white'}`}>{ctrl.label}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{ctrl.desc}</div>
              </div>
              <div className={`shrink-0 w-10 h-5 rounded-full mt-0.5 transition-colors ${
                ctrl.value ? (ctrl.danger ? 'bg-red-600' : 'bg-blue-600') : 'bg-zinc-600'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Publication Rules */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-normal text-zinc-300 uppercase tracking-wider">Publication Rules</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="text-xs text-zinc-500">Min posts / week</div>
            <div className="text-xl font-light text-white mt-1">{s.minPostsPerWeek}</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="text-xs text-zinc-500">Target posts / week</div>
            <div className="text-xl font-light text-blue-400 mt-1">{s.targetPostsPerWeek}</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="text-xs text-zinc-500">Preferred time</div>
            <div className="text-xl font-light text-white mt-1">{s.preferredPublishTimes?.[0] || '09:00'}</div>
          </div>
        </div>
        <div className="text-xs text-zinc-500">
          Allowed publish days: <span className="text-zinc-300">{(s.allowedPublishDays || []).join(', ')}</span>
        </div>
        <div className="text-xs text-zinc-500">
          Quality gate: <span className="text-zinc-300 font-mono">WEEKLY_QUALITY_GATE_NOT_MET</span> — if fewer than {s.minPostsPerWeek} qualified topics exist, the cycle halts rather than publishing filler content.
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-normal text-zinc-300 uppercase tracking-wider">Recent Automation Jobs</h2>
          <Link href="/admin/blog/automation/jobs" className="text-xs text-blue-400 hover:text-blue-300">Full log →</Link>
        </div>
        {jobs.length === 0 && <p className="text-sm text-zinc-500">No jobs run yet.</p>}
        <div className="divide-y divide-zinc-800">
          {jobs.map(job => (
            <div key={job.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs text-white">{job.jobType} · Topic: <span className="text-zinc-400">{job.topicId}</span></div>
                <div className="text-xs text-zinc-600">{new Date(job.createdAt).toLocaleString('en-GB')}</div>
              </div>
              <span className={`text-xs font-normal ${jobStatus(job.status)}`}>{job.status}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
