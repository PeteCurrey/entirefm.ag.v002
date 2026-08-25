import { Metadata } from 'next';
import { memoryStore } from '@/server/blog/store';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Automation Jobs | Blog | EntireFM Admin' };

export default function AutomationJobsPage() {
  const jobs = memoryStore.jobs;

  const statusBadge = (s: string) => {
    if (s === 'COMPLETED') return 'bg-emerald-900/40 text-emerald-300';
    if (s === 'FAILED') return 'bg-red-900/40 text-red-300';
    if (s === 'PROCESSING') return 'bg-blue-900/40 text-blue-300';
    return 'bg-zinc-800 text-zinc-400';
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Automation Job Log</h1>
          <p className="text-sm text-zinc-400 mt-1">Complete audit trail of all automated generation jobs</p>
        </div>
        <Link href="/admin/blog/automation" className="text-sm text-blue-400 hover:text-blue-300">← Settings</Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Job ID</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Type</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Status</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Post</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Failure Reason</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {jobs.length === 0 && (
              <tr><td colSpan={6} className="text-center text-zinc-500 py-10">No automation jobs have run yet.</td></tr>
            )}
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3">
                  <code className="text-xs text-zinc-400">{job.id.slice(-10)}</code>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">{job.jobType}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(job.status)}`}>{job.status}</span>
                </td>
                <td className="px-4 py-3">
                  {job.postId ? (
                    <Link href={`/admin/blog/${job.postId}`} className="text-xs text-blue-400 hover:text-blue-300">{job.postId.slice(-8)}</Link>
                  ) : <span className="text-xs text-zinc-600">—</span>}
                </td>
                <td className="px-4 py-3">
                  {job.failureReason ? (
                    <span className="text-xs text-red-400">{job.failureReason}</span>
                  ) : (
                    <span className="text-xs text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {new Date(job.createdAt).toLocaleString('en-GB')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
