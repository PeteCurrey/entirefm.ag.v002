import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Shield, LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EngineerProfilePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      <h1 className="text-white text-xl font-light">Engineer Profile</h1>

      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-6 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-white text-lg font-light">{session.name || 'Field Engineer'}</h2>
          <p className="text-brand-mist text-sm">{session.email}</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-void rounded-full text-xs text-brand-electric border border-brand-edge-dark">
          <Shield className="w-3.5 h-3.5" />
          <span>Role: {session.role}</span>
        </div>
      </div>

      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-4 space-y-3">
        <h3 className="text-white text-sm font-normal">Field Application</h3>
        <div className="flex justify-between text-xs text-brand-mist py-1 border-b border-brand-edge-dark">
          <span>Version</span>
          <span className="font-mono text-white">EntireFM Field 0.3.0</span>
        </div>
        <div className="flex justify-between text-xs text-brand-mist py-1 border-b border-brand-edge-dark">
          <span>Offline Support</span>
          <span className="text-green-400 font-light">Active</span>
        </div>
        <div className="flex justify-between text-xs text-brand-mist py-1">
          <span>AI Voice Assistant</span>
          <span className="text-brand-electric font-light">ASSIST Mode</span>
        </div>
      </div>

      <Link
        href="/api/auth/sign-out"
        className="flex items-center justify-center gap-2 w-full bg-brand-void border border-red-800/60 text-red-400 py-3.5 rounded-xl font-light hover:bg-red-950/30 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Link>
    </div>
  );
}
