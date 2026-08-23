/**
 * ADMIN — ENQUIRY LIST
 * ====================
 * Every enquiry the site has taken, newest first, with the attribution that
 * came with it.
 *
 * WHY THE ATTRIBUTION COLUMN MATTERS MOST
 * ---------------------------------------
 * The premise of this whole rebuild is that the geo landing pages were
 * producing enquiries and the replacement site stopped them. Nothing recorded
 * which page an enquiry came from, so that was an inference. From now on it is
 * a fact: every row carries its conversion page, its landing page and its UTM
 * set, so "which pages actually generate business" becomes a question with an
 * answer rather than an argument.
 *
 * NEVER INDEXED
 * -------------
 * `noindex, nofollow` in metadata, disallowed in robots.txt, and absent from
 * the sitemap. It is also outside the route registry entirely, so the legacy
 * estate checks do not see it and it can never be mistaken for a Wix URL that
 * needs preserving.
 */

import React from 'react';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { listLeads, leadStoreConfigured } from '@/lib/leads/store';
import { ADMIN_COOKIE, cookieMatches, adminConfigured } from '@/lib/leads/auth';

export const metadata: Metadata = {
  title: { absolute: 'Admin — EntireFM' },
  robots: { index: false, follow: false, nocache: true },
};

// Enquiries arrive continuously; a cached list would show stale ones.
export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const jar = await cookies();
  const signedIn = cookieMatches(jar.get(ADMIN_COOKIE)?.value);

  if (!signedIn) return <SignIn error={Boolean(error)} />;

  const leads = await listLeads(300);
  const storeReady = leadStoreConfigured();

  const today = new Date().toDateString();
  const todayCount = leads.filter((l) => new Date(l.received_at).toDateString() === today).length;
  const newCount = leads.filter((l) => l.status === 'new').length;

  // Which pages actually convert. The reason this screen exists.
  const byPage = new Map<string, number>();
  for (const l of leads) {
    const page = l.conversion_page || l.landing_page || '(not recorded)';
    byPage.set(page, (byPage.get(page) ?? 0) + 1);
  }
  const topPages = [...byPage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="min-h-screen bg-brand-surface">
      <header className="border-b border-brand-edge bg-white">
        <div className="container-custom flex h-16 items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-[15px] font-semibold tracking-tight text-brand-graphite">
              EntireFM
            </span>
            <span className="eyebrow">Enquiries</span>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="text-[12.5px] font-medium text-brand-silver transition-colors hover:text-brand-graphite"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="container-custom py-10">
        {!storeReady && (
          <Callout
            tone="warn"
            title="No lead store configured"
            body="NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not both set, so enquiries are not being written to the database and this list cannot populate. The enquiry form will fall back to email if RESEND_API_KEY is set, and will otherwise refuse submissions rather than silently lose them."
          />
        )}

        {storeReady && leads.length === 0 && (
          <Callout
            tone="info"
            title="No enquiries yet"
            body="The store is connected and empty. If you expected rows here, check that supabase/migrations/0001_leads.sql has been run in the Supabase SQL editor — the endpoint logs an insert failure when the table is missing."
          />
        )}

        <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge lg:grid-cols-4">
          <Stat label="Total enquiries" value={leads.length} />
          <Stat label="Today" value={todayCount} />
          <Stat label="Unactioned" value={newCount} />
          <Stat label="Converting pages" value={byPage.size} />
        </div>

        {topPages.length > 0 && (
          <section className="mb-10 rounded-sm border border-brand-edge bg-white p-6">
            <p className="eyebrow">Where enquiries come from</p>
            <ul className="mt-5 space-y-2">
              {topPages.map(([page, count]) => (
                <li key={page} className="flex items-center gap-4">
                  <span className="w-10 shrink-0 text-[13px] font-semibold tabular-nums text-brand-graphite">
                    {count}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-edge">
                    <span
                      className="block h-full bg-brand-spectrum"
                      style={{ width: `${(count / topPages[0][1]) * 100}%` }}
                    />
                  </span>
                  <span className="w-[46%] shrink-0 truncate text-[12.5px] text-brand-silver">
                    {page}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="overflow-x-auto rounded-sm border border-brand-edge bg-white">
          <table className="w-full min-w-[62rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-edge">
                {['Received', 'Contact', 'Requirement', 'Came from', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-silver"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-brand-edge/70 align-top last:border-0">
                  <td className="whitespace-nowrap px-5 py-4 text-[12.5px] text-brand-silver">
                    {new Date(lead.received_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    <div className="mt-1 font-mono text-[10.5px] text-brand-silver/60">
                      {lead.enquiry_id}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px]">
                    <div className="font-semibold text-brand-graphite">{lead.name}</div>
                    {lead.company && (
                      <div className="text-[12.5px] text-brand-silver">{lead.company}</div>
                    )}
                    <a
                      href={`mailto:${lead.email}`}
                      className="mt-1 block text-[12.5px] text-brand-electric hover:underline"
                    >
                      {lead.email}
                    </a>
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="block text-[12.5px] text-brand-silver hover:text-brand-graphite"
                      >
                        {lead.phone}
                      </a>
                    )}
                  </td>
                  <td className="max-w-[22rem] px-5 py-4 text-[12.5px]">
                    <div className="font-medium text-brand-graphite">
                      {lead.service || '—'}
                      {lead.location ? ` · ${lead.location}` : ''}
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap leading-relaxed text-brand-silver">
                      {lead.message}
                    </p>
                  </td>
                  <td className="max-w-[16rem] px-5 py-4 text-[12px] text-brand-silver">
                    <div className="truncate font-medium text-brand-graphite">
                      {lead.conversion_page || '(not recorded)'}
                    </div>
                    {lead.landing_page && lead.landing_page !== lead.conversion_page && (
                      <div className="truncate">landed: {lead.landing_page}</div>
                    )}
                    <div className="mt-1 truncate">
                      {lead.utm_source || 'direct'}
                      {lead.utm_campaign ? ` / ${lead.utm_campaign}` : ''}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-sm px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] ${
                        lead.status === 'new'
                          ? 'bg-brand-electric/10 text-brand-electric'
                          : 'bg-brand-edge text-brand-silver'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white px-6 py-5">
      <div className="text-[1.75rem] font-extralight leading-none tracking-tight text-brand-graphite">
        {value}
      </div>
      <div className="mt-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-brand-silver">
        {label}
      </div>
    </div>
  );
}

function Callout({ tone, title, body }: { tone: 'warn' | 'info'; title: string; body: string }) {
  return (
    <div
      className={`mb-8 rounded-sm border p-5 ${
        tone === 'warn' ? 'border-amber-300 bg-amber-50' : 'border-brand-edge bg-white'
      }`}
    >
      <p className="text-[13px] font-semibold text-brand-graphite">{title}</p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-brand-silver">{body}</p>
    </div>
  );
}

function SignIn({ error }: { error: boolean }) {
  const configured = adminConfigured();
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-graphite px-5">
      <div className="w-full max-w-sm">
        <p className="eyebrow eyebrow-dark">EntireFM</p>
        <h1 className="mt-4 text-[1.75rem] font-extralight tracking-[-0.04em] text-white">
          Enquiries
        </h1>

        {!configured ? (
          <p className="mt-6 rounded-sm border border-amber-400/40 bg-amber-400/10 p-4 text-[12.5px] leading-relaxed text-amber-100">
            Admin access is not configured. Set <code>ADMIN_PASSWORD</code> in the deployment
            environment and redeploy. Until then this page admits no one, which is the correct
            behaviour for an unset secret.
          </p>
        ) : (
          <form action="/api/admin/login" method="post" className="mt-6">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-sm border border-white/15 bg-white/[0.06] px-4 py-3 text-[14px] text-white placeholder:text-brand-mist/40 focus:border-brand-electric focus:outline-none"
              placeholder="Password"
            />
            {error && (
              <p className="mt-3 text-[12.5px] text-red-300">
                That did not work. Try again.
              </p>
            )}
            <button type="submit" className="btn-primary mt-4 w-full justify-center">
              Sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
