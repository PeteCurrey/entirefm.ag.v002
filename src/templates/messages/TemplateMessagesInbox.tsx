'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  MessageSquare,
  Send,
  Lock,
  UserCheck,
  UserX,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export function TemplateMessagesInbox({ activeConversationId }: { activeConversationId?: string }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(activeConversationId || null);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await fetch('/api/lobby/messages');
        if (res.status === 401) {
          window.location.href = '/sign-in?redirect=/lobby/messages';
          return;
        }
        const data = await res.json();
        setConversations(data.conversations || []);
        if (!activeConvId && data.conversations?.length > 0) {
          setActiveConvId(data.conversations[0].id);
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, [activeConvId]);

  useEffect(() => {
    if (!activeConvId) return;

    let eventSource: EventSource | null = null;

    async function loadThread() {
      try {
        const res = await fetch(`/api/lobby/messages/${activeConvId}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentConversation(data.conversation);
          setMessages(data.messages || []);

          // SSE stream for real-time delivery
          eventSource = new EventSource(`/api/lobby/messages/${activeConvId}/events`);
          eventSource.onmessage = (event) => {
            try {
              const parsed = JSON.parse(event.data);
              if (parsed.type === 'new_message') {
                setMessages((prev) => [...prev, parsed.data]);
              }
            } catch (e) {
              console.error('Error parsing DM SSE:', e);
            }
          };
        }
      } catch (err) {
        console.error('Error loading message thread:', err);
      }
    }

    loadThread();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [activeConvId]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;
    setSending(true);

    try {
      const res = await fetch(`/api/lobby/messages/${activeConvId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: inputText }),
      });

      if (res.ok) {
        setInputText('');
      }
    } catch (err) {
      console.error('Error sending DM:', err);
    } finally {
      setSending(false);
    }
  }

  async function handleAction(action: 'accepted' | 'declined' | 'blocked') {
    if (!activeConvId) return;
    try {
      const res = await fetch(`/api/lobby/messages/${activeConvId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentConversation(data.conversation);
      }
    } catch (err) {
      console.error('Error actioning message request:', err);
    }
  }

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-electric">
              The Lobby Messages
            </span>
            <h1 className="text-2xl font-bold text-white">Member Direct Messages</h1>
          </div>
          <Link
            href="/lobby/me"
            className="text-xs text-brand-silver hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            My Lobby
          </Link>
        </div>

        {/* Messaging Container */}
        <div className="bg-brand-graphite/20 border border-white/10 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
          {/* Left Panel: Conversations List */}
          <div className="md:col-span-5 border-r border-white/5 p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-silver px-2 pb-2">
                Conversations ({conversations.length})
              </h2>

              {loading ? (
                <div className="p-8 text-center text-xs text-brand-silver">Loading messages...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-brand-silver">
                  No conversations yet. You can message members from their public profiles or discussion replies.
                </div>
              ) : (
                conversations.map((c) => {
                  const otherParticipant = c.participants.find(
                    (p: any) => p.memberId !== 'mem-00000000-0000-4000-8000-000000000001'
                  ) || c.participants[0];

                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveConvId(c.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                        activeConvId === c.id
                          ? 'bg-brand-electric/15 border-brand-electric/40 text-white'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/5 text-brand-mist'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-brand-electric/20 text-brand-electric flex items-center justify-center text-xs font-bold shrink-0">
                        {otherParticipant.memberName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold truncate text-white">
                            {otherParticipant.memberName}
                          </span>
                          <span className="text-[10px] text-brand-silver">
                            {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-silver truncate mt-0.5">
                          {c.lastMessagePreview || 'New message request'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-white/5 rounded-xl text-[11px] text-brand-silver flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-brand-electric shrink-0" />
              <span>Private & confidential. Strictly segregated from CAFM operational data.</span>
            </div>
          </div>

          {/* Right Panel: Active Thread */}
          <div className="md:col-span-7 flex flex-col justify-between bg-brand-graphite/10 p-6">
            {currentConversation ? (
              <>
                {/* Thread Header */}
                <div className="pb-4 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {currentConversation.participants.map((p: any) => p.memberName).join(', ')}
                    </h3>
                    <p className="text-[11px] text-brand-silver">Professional 1:1 Conversation</p>
                  </div>
                  <button
                    onClick={() => handleAction('blocked')}
                    className="text-[11px] text-brand-silver hover:text-rose-400"
                  >
                    Block Member
                  </button>
                </div>

                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto space-y-4 py-6 max-h-[450px]">
                  {messages.map((m) => {
                    const isMe = m.authorMemberId === 'mem-00000000-0000-4000-8000-000000000001';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-brand-electric text-white rounded-br-none shadow-md'
                              : 'bg-brand-graphite/40 text-brand-mist border border-white/10 rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-line">{m.body}</p>
                        </div>
                        <span className="text-[10px] text-brand-silver mt-1 px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Composer */}
                <form onSubmit={handleSendMessage} className="pt-4 border-t border-white/10 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 p-3 bg-brand-void border border-white/10 rounded-xl text-xs text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="px-5 py-3 rounded-xl bg-brand-electric text-white font-semibold hover:bg-brand-electric/90 disabled:opacity-50 flex items-center gap-1 text-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-brand-silver">
                Select a conversation to view messages.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
