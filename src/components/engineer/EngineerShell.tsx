'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Briefcase,
  Mic,
  User,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  ArrowDownCircle,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { getSyncStatus, syncQueue, getPendingCount, type SyncStatus } from '@/lib/field/offline-store';

interface EngineerShellProps {
  children: React.ReactNode;
  session: {
    personId: string;
    displayName: string;
    email?: string;
    role?: string;
    isViewAs?: boolean;
    operatorEmail?: string;
  };
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
    ONLINE: { label: 'Online', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', icon: <Wifi className="w-3 h-3" /> },
    OFFLINE: { label: 'Offline', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', icon: <WifiOff className="w-3 h-3" /> },
    SYNCING: { label: 'Syncing…', color: 'text-brand-electric-bright border-brand-electric/30 bg-brand-electric/10', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
    SYNC_FAILED: { label: 'Sync Error', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10', icon: <AlertTriangle className="w-3 h-3" /> },
  };

  const cfg = badgeConfig[status];

  return (
    <button
      type="button"
      onClick={handleSync}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${cfg.color}`}
      title={pendingCount > 0 ? `${pendingCount} actions queued. Tap to sync.` : 'Network & Sync status'}
      aria-label={`Field sync status: ${cfg.label}${pendingCount > 0 ? `, ${pendingCount} pending` : ''}`}
    >
      {cfg.icon}
      <span>{cfg.label}</span>
      {pendingCount > 0 && (
        <span className="bg-amber-400 text-slate-950 text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ml-0.5">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}
    </button>
  );
}

export default function EngineerShell({ children, session }: EngineerShellProps) {
  const pathname = usePathname();
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
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
        })
        .catch((err) => {
          console.warn('[PWA] Service worker registration error:', err);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-void text-white flex flex-col antialiased selection:bg-brand-electric selection:text-white">
      {/* View-As Banner */}
      {session.isViewAs && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-medium text-amber-300 z-50">
          ⚠️ AUDITED VIEW-AS · Operator: {session.operatorEmail || 'Helpdesk'}
        </div>
      )}

      {/* PWA Update notification */}
      {updateAvailable && (
        <div className="bg-brand-electric text-white px-4 py-2 text-xs font-semibold flex items-center justify-between z-50 shadow-md">
          <div className="flex items-center gap-1.5">
            <ArrowDownCircle className="w-4 h-4 shrink-0" />
            <span>EntireFM Field app update available</span>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-black/30 hover:bg-black/50 text-white px-2.5 py-1 rounded text-[11px] font-bold transition-colors"
          >
            Update Now
          </button>
        </div>
      )}

      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-brand-carbon/95 backdrop-blur-md border-b border-brand-edge-dark safe-area-inset-top">
        <div
          className="flex items-center justify-between px-4 py-2.5 max-w-2xl mx-auto"
          style={{ paddingTop: 'max(10px, env(safe-area-inset-top))' }}
        >
          <Link href="/engineer" className="flex items-center gap-2 group">
            <span className="text-[15px] font-bold tracking-tight text-white group-hover:text-brand-electric-bright transition-colors">
              Entire<span className="text-brand-electric-bright">FM</span>
            </span>
            <span className="bg-brand-electric/15 text-brand-electric-bright border border-brand-electric/30 text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
              FIELD OS
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <SyncBadge personId={session.personId} />
            <Link
              href="/engineer/profile"
              className="text-xs text-brand-mist/80 hover:text-white bg-brand-void/80 border border-brand-edge-dark px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors"
              title="Engineer Profile"
            >
              <User className="w-3.5 h-3.5 text-brand-electric-bright" />
              <span className="truncate max-w-[100px] font-medium">{session.displayName}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Field Workspace */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-5 pb-28">
        {children}
      </main>

      {/* Fixed Ergonomic Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-brand-carbon/95 backdrop-blur-md border-t border-brand-edge-dark shadow-2xl"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
        aria-label="Field operative bottom navigation"
      >
        <div className="max-w-2xl mx-auto grid grid-cols-4 px-2">
          <NavItem
            href="/engineer"
            active={pathname === '/engineer'}
            icon={<Home className="w-5 h-5" />}
            label="Home"
          />
          <NavItem
            href="/engineer/jobs"
            active={pathname.startsWith('/engineer/jobs') || pathname.startsWith('/engineer/visits')}
            icon={<Briefcase className="w-5 h-5" />}
            label="Jobs"
          />
          <NavItem
            href="/engineer/talk"
            active={pathname.startsWith('/engineer/talk')}
            icon={<Mic className="w-5 h-5" />}
            label="Talk to Quote"
            isFeatured
          />
          <NavItem
            href="/engineer/profile"
            active={pathname.startsWith('/engineer/profile')}
            icon={<User className="w-5 h-5" />}
            label="Profile"
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
  isFeatured,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  isFeatured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all select-none active:scale-95 ${
        isFeatured
          ? active
            ? 'text-white font-bold'
            : 'text-brand-electric-bright hover:text-white font-medium'
          : active
          ? 'text-brand-electric-bright font-bold'
          : 'text-brand-mist/60 hover:text-brand-mist font-medium'
      }`}
      style={{ minHeight: '52px' }}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
    >
      <div
        className={`relative flex items-center justify-center p-1 rounded-lg transition-colors ${
          isFeatured
            ? active
              ? 'bg-brand-electric text-white shadow-lg shadow-brand-electric/30'
              : 'bg-brand-electric/15 text-brand-electric-bright border border-brand-electric/30'
            : active
            ? 'bg-brand-electric/15 text-brand-electric-bright'
            : 'text-current'
        }`}
      >
        {icon}
        {isFeatured && !active && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-electric opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-electric-bright" />
          </span>
        )}
      </div>
      <span className="text-[10px] tracking-tight leading-none">{label}</span>
    </Link>
  );
}
