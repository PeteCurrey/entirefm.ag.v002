'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Home, Briefcase, Mic, User, Wifi, WifiOff, RefreshCw, AlertTriangle, ArrowDownCircle } from 'lucide-react';
import { getSyncStatus, syncQueue, getPendingCount, type SyncStatus } from '@/lib/field/offline-store';

interface EngineerShellProps {
  children: React.ReactNode;
  session: { personId: string; displayName: string };
}

function SyncBadge({ personId }: { personId: string }) {
  const [status, setStatus] = useState<SyncStatus>('ONLINE');
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const updateStatus = useCallback(() => {
    setStatus(getSyncStatus());
    setPendingCount(getPendingCount());
  }, []);

  useEffect(() => {
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    const interval = setInterval(updateStatus, 5000);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(interval);
    };
  }, [updateStatus]);

  const handleSync = async () => {
    if (isSyncing || !navigator.onLine) return;
    setIsSyncing(true);
    setStatus('SYNCING');
    await syncQueue(personId);
    setIsSyncing(false);
    updateStatus();
  };

  const badgeConfig = {
    ONLINE: { label: 'Online', color: 'text-green-400', icon: <Wifi className="w-3 h-3" />, bg: 'bg-green-900/30' },
    OFFLINE: { label: 'Offline', color: 'text-amber-400', icon: <WifiOff className="w-3 h-3" />, bg: 'bg-amber-900/30' },
    SYNCING: { label: 'Syncing…', color: 'text-brand-electric', icon: <RefreshCw className="w-3 h-3 animate-spin" />, bg: 'bg-blue-900/30' },
    SYNC_FAILED: { label: 'Sync Error', color: 'text-red-400', icon: <AlertTriangle className="w-3 h-3" />, bg: 'bg-red-900/30' },
  };

  const cfg = badgeConfig[status];

  return (
    <button
      onClick={handleSync}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${cfg.bg} ${cfg.color}`}
      title={pendingCount > 0 ? `${pendingCount} actions queued. Tap to sync.` : 'Sync status'}
      aria-label={`Field sync status: ${cfg.label}${pendingCount > 0 ? `, ${pendingCount} pending` : ''}`}
    >
      {cfg.icon}
      <span>{cfg.label}</span>
      {pendingCount > 0 && (
        <span className="bg-amber-500 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold ml-0.5">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}
    </button>
  );
}

export default function EngineerShell({ children, session }: EngineerShellProps) {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      }).catch((err) => {
        console.warn('[PWA] Service worker registration error:', err);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-void flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Update notification */}
      {updateAvailable && (
        <div className="bg-brand-electric text-black px-4 py-2 text-xs font-bold flex items-center justify-between z-50">
          <div className="flex items-center gap-1.5">
            <ArrowDownCircle className="w-4 h-4 shrink-0" />
            <span>EntireFM Field update available</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-2.5 py-1 rounded text-[11px] font-semibold"
          >
            Update Now
          </button>
        </div>
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-brand-carbon border-b border-brand-edge-dark safe-area-inset-top">
        <div className="flex items-center justify-between px-4 py-3" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-2">
            <span className="text-brand-electric font-black text-sm tracking-widest">ENTIREFM</span>
            <span className="bg-brand-electric/20 text-brand-electric text-xs font-semibold px-1.5 py-0.5 rounded">FIELD</span>
          </div>
          <div className="flex items-center gap-2">
            <SyncBadge personId={session.personId} />
            <Link
              href="/api/auth/sign-out"
              className="text-brand-mist text-xs hover:text-white transition-colors ml-1"
              aria-label="Sign out"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-brand-carbon border-t border-brand-edge-dark"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Field navigation"
      >
        <div className="grid grid-cols-4">
          <NavItem href="/engineer" icon={<Home className="w-5 h-5" />} label="Home" />
          <NavItem href="/engineer/jobs" icon={<Briefcase className="w-5 h-5" />} label="Jobs" />
          <NavItem href="/engineer/talk" icon={<Mic className="w-5 h-5" />} label="Talk" />
          <NavItem href="/engineer/profile" icon={<User className="w-5 h-5" />} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 py-2.5 text-brand-mist hover:text-brand-electric transition-colors active:scale-95"
      style={{ minHeight: '56px' }}
      aria-label={label}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}
