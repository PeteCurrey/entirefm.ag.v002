'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  MessageSquare,
  Radio,
  ArrowLeft,
  Send,
  Lock,
  Flag,
  Reply,
  ShieldAlert,
} from 'lucide-react';

export function TemplateRoomLive({ slug }: { slug: string }) {
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [presenceCount, setPresenceCount] = useState(0);
  const [replyTo, setReplyTo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function initRoom() {
      try {
        const [roomRes, msgRes] = await Promise.all([
          fetch(`/api/lobby/rooms/${slug}`),
          fetch(`/api/lobby/rooms/${slug}/messages`),
        ]);
        const roomData = await roomRes.json();
        const msgData = await msgRes.json();
        setRoom(roomData.room);
        setPresenceCount(roomData.room?.activePresenceCount || 1);
        setMessages(msgData.messages || []);

        // Connect SSE stream
        eventSource = new EventSource(`/api/lobby/rooms/${slug}/events`);

        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (parsed.type === 'message') {
              setMessages((prev) => [...prev, parsed.data]);
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            } else if (parsed.type === 'presence') {
              setPresenceCount(parsed.data.count);
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e);
          }
        };
      } catch (err) {
        console.error('Error initializing room:', err);
      } finally {
        setLoading(false);
      }
    }

    initRoom();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [slug]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim()) return;
    setSending(true);

    try {
      const payload: any = { body: inputText };
      if (replyTo) {
        payload.replyToMessageId = replyTo.id;
        payload.replyToSnippet = `${replyTo.authorName}: ${replyTo.body.slice(0, 50)}...`;
      }

      const res = await fetch(`/api/lobby/rooms/${slug}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setInputText('');
        setReplyTo(null);
      } else if (res.status === 401) {
        window.location.href = `/sign-in?redirect=/lobby/rooms/${slug}`;
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
        <div className="flex-1 flex items-center justify-center py-20 text-sm text-brand-silver">
          Connecting to live room...
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-xl font-bold text-white">Room not found</h1>
          <Link href="/lobby/rooms" className="mt-4 inline-block text-xs font-semibold text-brand-electric">
            ← Return to Rooms Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 w-full">
        {/* Room Header */}
        <div className="bg-brand-graphite/30 border border-white/10 rounded-2xl p-5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1">
              <Link href="/lobby/rooms" className="text-brand-silver hover:text-white flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                Rooms
              </Link>
              <span className="text-white/20">•</span>
              <span className="text-brand-electric font-semibold">{room.topic}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{room.name}</h1>
            <p className="text-xs text-brand-silver mt-1">{room.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {presenceCount} in room
            </div>
          </div>
        </div>

        {/* Live Conversation Stream */}
        <div className="flex-1 bg-brand-graphite/15 border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[500px]">
          <div className="space-y-4 overflow-y-auto max-h-[550px] pr-2">
            {/* Guidelines banner */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-brand-silver text-center flex items-center justify-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-brand-electric" />
              <span>{room.guidelinesPrompt}</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-brand-graphite/30 border border-white/5 rounded-xl p-4 space-y-2 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-brand-electric/20 text-brand-electric flex items-center justify-center text-xs font-bold">
                      {msg.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{msg.authorName}</span>
                        {msg.isEntireFMOfficial && (
                          <span className="px-1.5 py-0.2 rounded bg-brand-electric/20 text-brand-electric text-[9px] font-bold border border-brand-electric/40">
                            EntireFM
                          </span>
                        )}
                        {msg.authorBadge && !msg.isEntireFMOfficial && (
                          <span className="px-1.5 py-0.2 rounded bg-white/5 text-[9px] text-brand-silver border border-white/10">
                            {msg.authorBadge}
                          </span>
                        )}
                      </div>
                      {msg.authorHeadline && (
                        <p className="text-[10px] text-brand-silver">{msg.authorHeadline}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-brand-silver">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.replyToSnippet && (
                  <div className="text-[11px] text-brand-silver bg-white/5 px-2.5 py-1 rounded border-l border-brand-electric">
                    {msg.replyToSnippet}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-brand-mist leading-relaxed whitespace-pre-line">
                  {msg.body}
                </p>

                <div className="flex items-center justify-end gap-2 pt-1 text-[11px]">
                  <button
                    onClick={() => setReplyTo(msg)}
                    className="text-brand-silver hover:text-white flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </button>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer */}
          <div className="mt-4 pt-4 border-t border-white/10">
            {replyTo && (
              <div className="flex items-center justify-between p-2 mb-2 rounded bg-white/5 text-xs text-brand-silver border border-brand-electric/30">
                <span>Replying to <strong className="text-white">{replyTo.authorName}</strong></span>
                <button onClick={() => setReplyTo(null)} className="text-brand-silver hover:text-white">✕</button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Share with practitioners in this room..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 p-3 bg-brand-void border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric"
              />
              <button
                type="submit"
                disabled={sending || !inputText.trim()}
                className="px-5 py-3 rounded-xl bg-brand-electric text-white font-semibold hover:bg-brand-electric/90 disabled:opacity-50 flex items-center gap-1.5 text-xs shadow-md transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
