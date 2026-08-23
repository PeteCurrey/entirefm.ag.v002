import { BlogPost } from './types';

export function generateRssFeed(posts: BlogPost[], baseUrl = 'https://www.entirefm.com'): string {
  const pubDate = (date?: string) => new Date(date || Date.now()).toUTCString();
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const items = posts
    .filter(p => p.status === 'PUBLISHED' && p.publishedAt)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    .slice(0, 50)
    .map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${baseUrl}/post/${esc(p.slug)}</link>
      <guid isPermaLink="true">${baseUrl}/post/${esc(p.slug)}</guid>
      <description>${esc(p.metaDescription || p.excerpt)}</description>
      <pubDate>${pubDate(p.publishedAt)}</pubDate>
      <author>editorial@entirefm.com (${esc(p.author?.name || 'EntireFM Editorial')})</author>
      ${p.category ? `<category>${esc(p.category.name)}</category>` : ''}
      ${p.featuredImage ? `<enclosure url="${baseUrl}${esc(p.featuredImage)}" type="image/webp" length="0"/>` : ''}
    </item>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EntireFM — FM Trade Insights &amp; Technical Guides</title>
    <link>${baseUrl}/insights</link>
    <description>Authoritative facilities management insights, statutory compliance guides, and M&amp;E technical analysis from EntireFM's expert operations team.</description>
    <language>en-gb</language>
    <copyright>Copyright ${new Date().getFullYear()} EntireFM Ltd</copyright>
    <managingEditor>editorial@entirefm.com (EntireFM Editorial)</managingEditor>
    <webMaster>hello@entirefm.com (EntireFM)</webMaster>
    <ttl>720</ttl>
    <image>
      <url>${baseUrl}/images/entirefm-logo-og.png</url>
      <title>EntireFM</title>
      <link>${baseUrl}</link>
    </image>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}
