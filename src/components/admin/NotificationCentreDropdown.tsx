'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Users,
  DollarSign,
  Server,
  ArrowRight,
  ExternalLink,
  Loader2,
  X,
} from 'lucide-react';
import { NotificationRecord, NotificationCategory } from '@/server/notifications/types';

interface NotificationCentreDropdownProps {
  initialUnreadCount?: number;
}

export function NotificationCentreDropdown({ initialUnreadCount = 0 }: NotificationCentreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(initialUnreadCount);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'ALL'>('ALL');
  const [loading, setLoading] = useState(false);
  const [unreadByCat, setUnreadByCat] = useState<Record<string, number>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
          setUnreadTotal(data.unreadTotal || 0);
          setUnreadByCat(data.unreadByCat || {});
        }
      }
    } catch (err) {
      console.warn('[NOTIF_FETCH_ERR]', err);
    }
  };

  // Initial load + background polling every 20 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, actionUrl: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
    );
    setUnreadTotal((prev) => Math.max(0, prev - 1));

    // Post to server
    fetch('/api/admin/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {});

    setIsOpen(false);
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) =>
        activeCategory === 'ALL' || n.category === activeCategory
          ? { ...n, is_read: true, read_at: new Date().toISOString() }
          : n
      )
    );
    if (activeCategory === 'ALL') {
      setUnreadTotal(0);
    } else {
      setUnreadTotal((prev) => Math.max(0, prev - (unreadByCat[activeCategory] || 0)));
    }

    try {
      await fetch('/api/admin/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true, category: activeCategory !== 'ALL' ? activeCategory : undefined }),
      });
      await fetchNotifications();
    } catch (e) {
      console.warn('[MARK_ALL_READ_ERR]', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(
    (n) => activeCategory === 'ALL' || n.category === activeCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LEADS':
        return <Users className="h-3.5 w-3.5 text-pink-600" />;
      case 'OPERATIONS':
        return <Clock className="h-3.5 w-3.5 text-amber-600" />;
      case 'COMPLIANCE':
        return <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />;
      case 'FINANCE':
        return <DollarSign className="h-3.5 w-3.5 text-purple-600" />;
      default:
        return <Server className="h-3.5 w-3.5 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-normal uppercase font-mono bg-red-100 text-red-700 border border-red-200">
            Critical
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-normal uppercase font-mono bg-amber-100 text-amber-700 border border-amber-200">
            Warning
          </span>
        );
      case 'ATTENTION':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-normal uppercase font-mono bg-purple-100 text-purple-700 border border-purple-200">
            Attention
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-normal uppercase font-mono bg-slate-100 text-slate-700 border border-slate-200">
            Info
          </span>
        );
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] text-[#686866] hover:bg-white hover:text-[#101010] hover:border-[#D1D1CD] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        aria-label="Notifications Centre"
        title="Notifications Centre"
      >
        <Bell className="h-4 w-4" />
        {unreadTotal > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#DC2626] px-1 font-mono text-[10px] font-normal text-white shadow-sm ring-2 ring-white">
            {unreadTotal > 99 ? '99+' : unreadTotal}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[380px] sm:w-[440px] rounded-[14px] border border-[#E4E4E1] bg-white shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F9F9F8] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-normal text-sm text-[#101010]">Notifications</span>
              {unreadTotal > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 font-mono text-[11px] font-normal text-red-700">
                  {unreadTotal} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadTotal > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-[11.5px] font-normal text-[#686866] hover:text-[#101010] transition-colors"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#9B9B97] hover:text-[#101010] p-1 rounded-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex border-b border-[#E4E4E1] bg-[#FFFFFF] px-2 py-1.5 overflow-x-auto gap-1 text-[11px] font-normal text-[#686866]">
            {(['ALL', 'LEADS', 'OPERATIONS', 'COMPLIANCE', 'FINANCE', 'SYSTEM'] as const).map((cat) => {
              const count = cat === 'ALL' ? unreadTotal : unreadByCat[cat] || 0;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-[6px] transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#101010] text-white font-light'
                      : 'hover:bg-[#F0F0EE] hover:text-[#101010]'
                  }`}
                >
                  <span>{cat.charAt(0) + cat.slice(1).toLowerCase()}</span>
                  {count > 0 && (
                    <span
                      className={`h-4 min-w-[14px] rounded-full px-1 flex items-center justify-center text-[9px] font-mono font-light ${
                        isActive ? 'bg-white text-black' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E4E4E1]">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center gap-2 text-[#686866]">
                <Check className="h-6 w-6 text-[#16A34A]" />
                <p className="text-xs font-normal text-[#101010]">All caught up</p>
                <p className="text-[11px] text-[#9B9B97]">No notifications in this category.</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id, n.action_url)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-[#F9F9F8] transition-colors cursor-pointer group ${
                    !n.is_read ? 'bg-[#FBFBFA]' : ''
                  }`}
                >
                  {/* Category Icon Badge */}
                  <div className="h-7 w-7 rounded-[8px] bg-[#F0F0EE] border border-[#E4E4E1] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#D1D1CD]">
                    {getCategoryIcon(n.category)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-[12.5px] leading-tight truncate ${
                          !n.is_read ? 'font-light text-[#101010]' : 'font-light text-[#333332]'
                        }`}
                      >
                        {n.title}
                      </h4>
                      {getSeverityBadge(n.severity)}
                    </div>

                    <p className="text-[11.5px] text-[#686866] line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-[10px] text-[#9B9B97]">
                        {formatRelativeTime(n.created_at)}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-normal text-[#FF3E9D] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  {/* Unread Indicator Dot */}
                  {!n.is_read && (
                    <span className="h-2 w-2 rounded-full bg-[#FF3E9D] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Panel Footer */}
          <div className="border-t border-[#E4E4E1] bg-[#F9F9F8] p-2.5 flex items-center justify-between text-[11px]">
            <Link
              href="/admin/growth/leads"
              onClick={() => setIsOpen(false)}
              className="font-medium text-[#686866] hover:text-[#101010] transition-colors"
            >
              View Inbound Leads Directory →
            </Link>
            <span className="font-mono text-[10px] text-[#9B9B97]">Operational Sync Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
