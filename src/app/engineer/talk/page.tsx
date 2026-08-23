import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Mic, ChevronLeft, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EngineerTalkPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const { data: captures } = await dbQuery<any[]>(
    `field_voice_captures?engineer_person_id=eq.${session.personId}&order=captured_at.desc&limit=10&select=*`
  );

  const voiceCaptures = captures || [];

  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/engineer" className="text-brand-mist hover:text-white transition-colors" aria-label="Back">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-white text-xl font-bold">Talk to EntireFM</h1>
      </div>

      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-6 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center mx-auto shadow-lg shadow-brand-electric/5">
          <Mic className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-white text-lg font-bold">Voice-Driven Field Notes</h2>
          <p className="text-brand-mist text-sm mt-1 max-w-xs mx-auto leading-relaxed">
            Speak naturally to describe findings, readings, defects, or job notes.
          </p>
        </div>

        <div className="bg-brand-void rounded-xl p-4 text-left border border-brand-edge-dark">
          <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-2">Example phrases</p>
          <ul className="text-xs text-white/80 space-y-1.5 list-disc list-inside">
            <li>&ldquo;Supply fan bearing has excessive vibration, needs replacement.&rdquo;</li>
            <li>&ldquo;Flow rate 2.4 litres per minute, temperature 62 degrees.&rdquo;</li>
            <li>&ldquo;Filter replacement complete on AHU-02. Unit tested ok.&rdquo;</li>
          </ul>
        </div>
      </div>

      <div>
        <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-3">Recent Voice Captures</p>
        {voiceCaptures.length === 0 ? (
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 text-center text-brand-mist text-sm">
            No recent voice captures recorded.
          </div>
        ) : (
          <div className="space-y-2">
            {voiceCaptures.map(c => (
              <div key={c.id} className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-brand-mist mb-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(c.captured_at).toLocaleString('en-GB')}
                  </span>
                  <span className="bg-brand-void px-2 py-0.5 rounded text-white font-mono">
                    {c.ai_proposed_action_type || 'NOTE'}
                  </span>
                </div>
                <p className="text-white text-sm mt-1">{c.transcription || 'Audio recorded (processing)'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
