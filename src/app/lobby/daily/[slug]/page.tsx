import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getEditionBySlug, listEditions } from '@/server/lobby-daily/store';
import { ArrowLeft, Clock, ShieldCheck, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);

  if (!edition) {
    return { title: 'Edition Not Found | The Lobby Daily | EntireFM' };
  }

  return {
    title: `${edition.subjectLine} | The Lobby Daily | EntireFM`,
    description: edition.preheader,
    robots: {
      index: edition.isIndexableWebEdition,
      follow: true,
    },
    alternates: {
      canonical: `https://www.entirefm.com/lobby/daily/${edition.slug}`,
    },
  };
}

export default async function LobbyDailyEditionViewPage({ params }: Props) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);

  if (!edition) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[#F4F4F2] text-[#18181B] pt-20 pb-28 px-4 sm:px-6">
      <div className="max-w-[640px] mx-auto bg-white border border-[#E2E2DE] shadow-sm rounded-sm overflow-hidden">
        
        {/* Navigation Strip */}
        <div className="bg-[#0A0D14] border-b border-[#222734] px-6 py-3 flex items-center justify-between text-xs font-normal text-white/70">
          <Link
            href="/lobby/daily"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#00E599] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Editions</span>
          </Link>
          <span className="text-[#00E599]">Edition #{edition.editionNumber}</span>
        </div>

        {/* ── 1. MASTHEAD ── */}
        <header className="bg-[#0A0D14] text-white p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#00E599] text-[#0A0D14] font-extrabold text-sm flex items-center justify-center rounded-sm">
                E
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#00E599] block uppercase">
                  ENTIREFM
                </span>
                <span className="text-xl font-light tracking-wide text-white block">
                  THE LOBBY DAILY
                </span>
              </div>
            </div>
            <div className="text-right text-xs font-normal text-white/60">
              <span className="block text-white/80 uppercase">{edition.masthead.ukDateFormatted}</span>
              <span className="block text-[11px] text-white/40">{edition.readingTimeMinutes} min read</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#222734] text-xs italic text-white/60">
            What changed. Why it matters. What to do next.
          </div>
        </header>

        {/* ── 2. LEAD STORY ── */}
        <section className="p-6 sm:p-8 border-b border-[#E2E2DE] space-y-4">
          {edition.leadStory.image?.imageUrl && (
            <div className="relative w-full aspect-[16/9] bg-[#0A0D14] rounded-sm overflow-hidden mb-4">
              <Image
                src={
                  edition.leadStory.image.imageUrl.startsWith('/')
                    ? edition.leadStory.image.imageUrl
                    : edition.leadStory.image.imageUrl
                }
                alt={edition.leadStory.image.imageAlt || 'Lead story photography'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 640px"
                priority
              />
            </div>
          )}

          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7] block">
            {edition.leadStory.categoryLabel}
          </span>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0F172A] leading-tight">
            {edition.leadStory.headline}
          </h1>

          <p className="text-base font-normal text-[#334155] leading-relaxed">
            {edition.leadStory.summary}
          </p>

          <div className="bg-[#F8FAFC] border-l-4 border-[#00E599] p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] block">
              WHY IT MATTERS:
            </span>
            <p className="text-sm text-[#334155] leading-relaxed">
              {edition.leadStory.whyItMatters}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B] pt-2">
            <span>Source: <strong className="text-[#334155]">{edition.leadStory.sourceName}</strong></span>
            {edition.leadStory.sourceUrl && (
              <a
                href={edition.leadStory.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#0F172A] hover:underline"
              >
                <span>{edition.leadStory.ctaText || 'Original Source'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </section>

        {/* ── 3. THE MORNING BRIEF ── */}
        {edition.morningBrief && edition.morningBrief.length > 0 && (
          <section className="p-6 sm:p-8 border-b border-[#E2E2DE] space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A] block">
              THE MORNING BRIEF
            </span>

            <div className="space-y-4 divide-y divide-[#F1F1EF]">
              {edition.morningBrief.map((item, idx) => (
                <div key={item.id || idx} className={idx > 0 ? 'pt-4 space-y-1' : 'space-y-1'}>
                  <h3 className="text-base font-semibold text-[#0F172A] leading-snug">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {item.headline}
                    </a>
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {item.oneSentenceSummary}
                  </p>
                  <span className="text-xs text-[#94A3B8] block">
                    Attribution: <em>{item.sourceName}</em>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 4. WHAT CHANGED TODAY ── */}
        {edition.whatChangedToday && edition.whatChangedToday.length > 0 && (
          <section className="p-6 sm:p-8 border-b border-[#E2E2DE] space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A] block">
              WHAT CHANGED TODAY
            </span>

            <div className="space-y-6 divide-y divide-[#F1F1EF]">
              {edition.whatChangedToday.map((story, idx) => (
                <div key={story.id || idx} className={idx > 0 ? 'pt-6 space-y-2' : 'space-y-2'}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] block">
                    {story.category}
                  </span>
                  <h3 className="text-lg font-semibold text-[#0F172A] leading-snug">
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {story.headline}
                    </a>
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {story.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-1">
                    <span>Source: {story.sourceName}</span>
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0F172A] font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>{story.ctaText || 'Source details'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 5. COMPLIANCE WATCH ── */}
        {edition.complianceWatch && (
          <section className="p-6 sm:p-8 bg-[#FFFBEB] border-b border-[#E2E2DE] space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B45309] block">
              COMPLIANCE WATCH · STATUTORY DIRECTIVE
            </span>
            <h3 className="text-lg font-semibold text-[#78350F] leading-snug">
              {edition.complianceWatch.regulationOrStandard}
            </h3>
            <div className="text-xs sm:text-sm text-[#92400E] space-y-1.5 leading-relaxed">
              <p><strong>Effective Date:</strong> {edition.complianceWatch.effectiveOrPublishedDate}</p>
              <p><strong>Who It Affects:</strong> {edition.complianceWatch.whoItAffects}</p>
              <p><strong>Required Action:</strong> {edition.complianceWatch.requiredOperationalAction}</p>
            </div>
            <div className="text-xs text-[#B45309] pt-1">
              Authoritative Source:{' '}
              <a
                href={edition.complianceWatch.authoritativeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#78350F] hover:underline"
              >
                {edition.complianceWatch.authoritativeSource} &rarr;
              </a>
            </div>
          </section>
        )}

        {/* ── 6. CONTRACTS & MOBILISATIONS ── */}
        {edition.contractsMobilisations && edition.contractsMobilisations.length > 0 && (
          <section className="p-6 sm:p-8 border-b border-[#E2E2DE] space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A] block">
              CONTRACTS, AWARDS &amp; MOBILISATIONS
            </span>

            <div className="space-y-4 divide-y divide-[#F1F1EF]">
              {edition.contractsMobilisations.map((c, idx) => (
                <div key={c.id || idx} className={idx > 0 ? 'pt-4 space-y-1' : 'space-y-1'}>
                  <h4 className="text-base font-semibold text-[#0F172A]">
                    <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {c.headline}
                    </a>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {c.summary}
                  </p>
                  <span className="text-xs text-[#94A3B8] block">
                    {c.contractValue ? <strong>Value: {c.contractValue} · </strong> : ''}Source: <em>{c.sourceName}</em>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 7. THE ENGINEER'S NOTE ── */}
        {edition.engineersNote && (
          <section className="p-6 sm:p-8 bg-[#F8FAFC] border-b border-[#E2E2DE] space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#00E599] block">
              THE ENGINEER’S NOTE · OPERATIONAL INSIGHT
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-[#0F172A]">
              {edition.engineersNote.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              {edition.engineersNote.observation}
            </p>
            <span className="text-xs text-[#64748B] block font-medium">
              — {edition.engineersNote.authorName}, {edition.engineersNote.authorRole}
            </span>
          </section>
        )}

        {/* ── 8. ON THE HORIZON ── */}
        {edition.onTheHorizon && (
          <section className="p-6 sm:p-8 border-b border-[#E2E2DE] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#64748B] block">
              ON THE HORIZON
            </span>
            <h4 className="text-base font-semibold text-[#0F172A]">
              {edition.onTheHorizon.title} · <span className="text-[#0284C7]">{edition.onTheHorizon.dateOrDeadline}</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {edition.onTheHorizon.description}
            </p>
            <span className="text-xs text-[#94A3B8] block">
              Milestone Source: <em>{edition.onTheHorizon.sourceName}</em>
            </span>
          </section>
        )}

        {/* ── 9. ONE USEFUL THING ── */}
        {edition.oneUsefulThing && (
          <section className="p-6 sm:p-8 border-b border-[#E2E2DE]">
            <div className="border border-[#E2E2DE] bg-[#FAFAFA] rounded-sm p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E599] block">
                ONE USEFUL THING · ENTIREFM RESOURCES
              </span>
              <h3 className="text-base font-semibold text-[#0F172A]">
                {edition.oneUsefulThing.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {edition.oneUsefulThing.description}
              </p>
              <a
                href={edition.oneUsefulThing.linkUrl}
                className="inline-block text-xs sm:text-sm font-semibold text-[#0F172A] underline hover:text-black pt-1"
              >
                {edition.oneUsefulThing.linkText}
              </a>
            </div>
          </section>
        )}

        {/* ── OPTIONAL SPONSOR ── */}
        {edition.sponsorBlock && edition.sponsorBlock.enabled && (
          <section className="p-6 bg-[#F8FAFC] border-b border-[#E2E2DE] space-y-2 text-xs">
            <span className="text-[9px] uppercase tracking-widest text-[#94A3B8] block font-bold">
              SPONSORED
            </span>
            <h4 className="font-semibold text-sm text-[#0F172A]">
              <a href={edition.sponsorBlock.destinationUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {edition.sponsorBlock.headline}
              </a>
            </h4>
            <p className="text-[#64748B] leading-relaxed">
              {edition.sponsorBlock.body}
            </p>
            <span className="text-[#94A3B8] block">Partner: {edition.sponsorBlock.sponsorName}</span>
          </section>
        )}

        {/* ── 10. FOOTER ── */}
        <footer className="bg-[#0A0D14] text-[#94A3B8] p-6 sm:p-8 space-y-4 text-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block">
              THE LOBBY DAILY
            </span>
            <p className="text-[11px] text-[#64748B]">
              {edition.footer.receiveReason}
            </p>
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex flex-wrap gap-4 text-xs font-normal">
            <Link href="/lobby/preferences" className="text-[#00E599] hover:underline">
              Manage Preferences
            </Link>
            <Link href="/lobby/unsubscribe" className="text-white/60 hover:underline">
              Unsubscribe
            </Link>
            <Link href="/legal/privacy-policy" className="text-white/60 hover:underline">
              Privacy Policy
            </Link>
          </div>

          <div className="text-[11px] text-[#475569] leading-relaxed pt-2">
            {edition.footer.legalEntity}<br />
            {edition.footer.registeredAddress}
          </div>
        </footer>

      </div>
    </article>
  );
}
