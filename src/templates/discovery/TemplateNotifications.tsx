'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  Star,
  Award,
  ArrowLeft,
} from 'lucide-react';

export function TemplateNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch('/api/member/notifications');
        if (res.status === 401) {
          window.location.href = '/sign-in?redirect=/lobby/notifications';
          return;
        }
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error('Error loading notifications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  async function handleMarkAllRead() {
    try {
      const res = await fetch('/api/member/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Error marking notifications read:', err);
    }
  }

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-electric">
              The Lobby Activity
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">Notification Centre</h1>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-brand-silver hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors"
          >
            Mark All as Read
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-brand-silver">Loading activity notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-brand-silver bg-brand-graphite/20 border border-white/5 rounded-2xl">
            <Bell className="w-8 h-8 mx-auto text-brand-silver mb-2 opacity-50" />
            <p className="text-white font-medium">All caught up</p>
            <p className="text-brand-silver mt-1">No unread notifications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <Link
                key={notif.id}
                href={notif.actionUrl || '#'}
                className={`block p-4 rounded-xl border transition-all ${
                  notif.isRead
                    ? 'bg-brand-graphite/20 border-white/5 hover:bg-brand-graphite/30'
                    : 'bg-brand-electric/10 border-brand-electric/30 hover:bg-brand-electric/15'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xs sm:text-sm font-bold text-white">{notif.title}</h2>
                    <p className="text-xs text-brand-silver leading-relaxed">{notif.message}</p>
                  </div>
                  <span className="text-[10px] text-brand-silver shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
