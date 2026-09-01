import { Metadata } from 'next';
import Link from 'next/link';
import { listSiteSurveys } from '@/server/commercial/pipeline';
import { MapPin, Calendar, User, Wrench, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'Site Surveys & Asset Audits | EntireFM Admin' };

export default async function SiteSurveysPage() {
  const surveys = await listSiteSurveys();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-pink-400 font-light">
            TECHNICAL DISCOVERY &amp; ASSET WALKS
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Commercial Site Surveys</h1>
          <p className="text-sm text-zinc-400">
            Schedule and manage physical estate walkthroughs, asset counts, and engineering assessments.
          </p>
        </div>
        <Link
          href="/admin/commercial"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Commercial Overview
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            All Site Surveys ({surveys.length})
          </h3>
        </div>

        {surveys.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-normal">
            No site surveys currently scheduled. Technical surveys arranged from opportunities will appear here.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-normal uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Site Name &amp; Address</th>
                <th className="py-3 px-4">Survey Type</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Assigned Surveyor</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {surveys.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-light text-white">{s.site_name}</div>
                    <div className="text-[11px] text-zinc-500">{s.site_address}</div>
                  </td>
                  <td className="py-3.5 px-4 font-normal text-zinc-300">{s.survey_type}</td>
                  <td className="py-3.5 px-4 font-normal text-pink-400">
                    {new Date(s.scheduled_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-3.5 px-4 font-normal text-zinc-400">{s.surveyor_name}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40 font-light">
                      {s.survey_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
