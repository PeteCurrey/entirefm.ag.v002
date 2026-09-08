import { NextRequest, NextResponse } from 'next/server';
import { validateCronRequest } from '@/server/intelligence/cron-auth';
import { dbQuery, isDbConfigured } from '@/server/db/client';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60s max execution for Vercel functions

interface ParsedRssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl?: string;
  source: 'BBC News' | 'Sky News';
}

/**
 * Minimal lightweight XML RSS parser for BBC and Sky News feeds.
 * Extracts only title, description, link, pubDate, and thumbnail/enclosure image.
 * Does NOT scrape article bodies (strict copyright/licensing compliance).
 */
function parseRssFeed(xml: string, source: 'BBC News' | 'Sky News'): ParsedRssItem[] {
  const items: ParsedRssItem[] = [];
  const itemBlocks = xml.split(/<item[\s>]/i).slice(1);

  for (const block of itemBlocks) {
    const itemContent = block.split(/<\/item>/i)[0];
    if (!itemContent) continue;

    const extractTag = (tag: string): string => {
      // Check CDATA first: <tag><![CDATA[...]]></tag>
      const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
      const cdataMatch = itemContent.match(cdataRegex);
      if (cdataMatch && cdataMatch[1]) {
        return cdataMatch[1].trim();
      }

      // Standard tag: <tag>...</tag>
      const standardRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const match = itemContent.match(standardRegex);
      if (match && match[1]) {
        return match[1].replace(/<[^>]+>/g, '').trim();
      }
      return '';
    };

    const title = extractTag('title');
    const link = extractTag('link') || extractTag('guid');
    const description = extractTag('description');
    const pubDate = extractTag('pubDate');

    // Extract thumbnail or enclosure image URL
    let imageUrl = '';
    const mediaThumb = itemContent.match(/<media:thumbnail[^>]+url=["\x27]([^"\x27]+)["\x27]/i);
    const mediaContent = itemContent.match(/<media:content[^>]+url=["\x27]([^"\x27]+)["\x27]/i);
    const enclosure = itemContent.match(/<enclosure[^>]+url=["\x27]([^"\x27]+)["\x27]/i);
    const rawImg = mediaThumb?.[1] || mediaContent?.[1] || enclosure?.[1] || '';
    if (rawImg) {
      // If BBC standard 240 thumbnail, upgrade to 480 for crisp retina resolution
      imageUrl = rawImg.replace('/standard/240/', '/standard/480/');
    }

    if (title && link) {
      items.push({
        title,
        link,
        description,
        pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        imageUrl: imageUrl || undefined,
        source,
      });
    }
  }

  return items;
}

export async function ingestGeneralNewsFeed(): Promise<{
  bbcCount: number;
  skyCount: number;
  insertedCount: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let bbcItems: ParsedRssItem[] = [];
  let skyItems: ParsedRssItem[] = [];

  // 1. Fetch BBC News RSS (Business / General UK)
  try {
    const res = await fetch('http://feeds.bbci.co.uk/news/business/rss.xml', {
      headers: { 'User-Agent': 'EntireFM-Intelligence-Ingestion/1.0' },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const xml = await res.text();
      bbcItems = parseRssFeed(xml, 'BBC News').slice(0, 10);
    } else {
      errors.push(`BBC News RSS returned HTTP ${res.status}`);
    }
  } catch (e: any) {
    errors.push(`BBC News fetch failed: ${e.message}`);
  }

  // 2. Fetch Sky News RSS (Business / UK)
  try {
    const res = await fetch('https://feeds.skynews.com/feeds/rss/business.xml', {
      headers: { 'User-Agent': 'EntireFM-Intelligence-Ingestion/1.0' },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const xml = await res.text();
      skyItems = parseRssFeed(xml, 'Sky News').slice(0, 10);
    } else {
      errors.push(`Sky News RSS returned HTTP ${res.status}`);
    }
  } catch (e: any) {
    errors.push(`Sky News fetch failed: ${e.message}`);
  }

  const allItems = [...bbcItems, ...skyItems];
  let insertedCount = 0;

  if (isDbConfigured()) {
    for (const item of allItems) {
      const contentHash = crypto
        .createHash('sha256')
        .update(`${item.source}:${item.link}:${item.title}`)
        .digest('hex');

      const id = `news-${item.source === 'BBC News' ? 'bbc' : 'sky'}-${contentHash.slice(0, 16)}`;

      const row = {
        id,
        external_id: item.link,
        content_hash: contentHash,
        version: 1,
        title: item.title,
        entirefm_summary: item.description || item.title,
        suggested_contractor_action: 'General business and macro context — informational awareness only.',
        source_id: item.source === 'BBC News' ? 'src-bbc-news' : 'src-sky-news',
        source_name: item.source,
        canonical_url: item.link,
        authority_tier: 4,
        source_authenticity: 'TRADE_MEDIA',
        operational_interpretation: 'INFORMATIONAL',
        requires_human_approval: false,
        is_mandatory_action: false,
        legal_status: 'INFORMATIONAL',
        event_type: 'TRADE_BODY_GUIDANCE',
        severity: 'INFORMATION',
        jurisdictions: ['United Kingdom'],
        trade_tags: ['general-news', 'uk-business'],
        credential_tags: [],
        work_type_tags: [],
        published_at: item.pubDate,
        updated_at: new Date().toISOString(),
        raw_payload: item.imageUrl ? { imageUrl: item.imageUrl } : null,
        review_status: 'AUTO_PUBLISHED',
        audience_roles: ['ALL_CONTRACTOR_USERS'],
      };

      try {
        await dbQuery('intelligence_items', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: row,
        });
        insertedCount++;
      } catch (err: any) {
        // Continue processing others
      }
    }
  }

  return {
    bbcCount: bbcItems.length,
    skyCount: skyItems.length,
    insertedCount,
    errors,
  };
}

export async function GET(req: NextRequest) {
  const auth = validateCronRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const result = await ingestGeneralNewsFeed();
    return NextResponse.json({
      success: true,
      job: 'general-news',
      schedule: '*/30 * * * *',
      ...result,
    });
  } catch (err: any) {
    console.error('[General News Cron Error]:', err.message);
    return NextResponse.json(
      { success: false, job: 'general-news', error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
