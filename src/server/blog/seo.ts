import { ALL_ROUTES } from '@/lib/routes/route-registry';
import { BlogPost, InternalLinkItem } from './types';

export interface SeoAnalysisResult {
  seoScore: number;
  warnings: string[];
  recommendations: string[];
  cannibalisationRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  collidingRoutes: Array<{ path: string; reason: string; similarityScore: number }>;
  suggestedInternalLinks: InternalLinkItem[];
}

/**
 * Stopwords to ignore in keyword & query overlap checks
 */
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'how', 'what', 'why', 'when', 'where', 'which', 'who', 'your', 'our'
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Check for search intent collision against the entire 291-route EntireFM estate
 */
export function checkSearchIntentCollision(
  title: string,
  primaryKeyword?: string,
  slug?: string
): { risk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'; collisions: Array<{ path: string; reason: string; similarityScore: number }> } {
  const targetWords = new Set([...extractKeywords(title), ...(primaryKeyword ? extractKeywords(primaryKeyword) : [])]);
  const collisions: Array<{ path: string; reason: string; similarityScore: number }> = [];

  for (const route of ALL_ROUTES) {
    const routeSlug = route.path.replace(/^\//, '').replace(/\//g, '-');
    const routeWords = extractKeywords(routeSlug);

    // Exact slug collision
    if (slug && (route.path === `/${slug}` || route.path === `/post/${slug}`)) {
      collisions.push({
        path: route.path,
        reason: 'Exact URL path collision with existing protected route',
        similarityScore: 100,
      });
      continue;
    }

    // Word overlap count
    if (targetWords.size > 0 && routeWords.length > 0) {
      let intersection = 0;
      for (const w of routeWords) {
        if (targetWords.has(w)) intersection++;
      }
      const score = Math.round((intersection / Math.max(targetWords.size, routeWords.length)) * 100);

      if (score >= 65) {
        collisions.push({
          path: route.path,
          reason: `High semantic overlap with ${route.routeType} page '${route.path}'`,
          similarityScore: score,
        });
      }
    }
  }

  let risk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' = 'NONE';
  if (collisions.some(c => c.similarityScore === 100)) risk = 'HIGH';
  else if (collisions.some(c => c.similarityScore >= 75)) risk = 'MEDIUM';
  else if (collisions.length > 0) risk = 'LOW';

  return { risk, collisions };
}

/**
 * Analyze a post's complete SEO profile
 */
export function analyzePostSeo(post: Partial<BlogPost>, existingPosts: BlogPost[] = []): SeoAnalysisResult {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Title checks
  if (!post.title || post.title.trim().length < 10) {
    warnings.push('Title is missing or too short (< 10 characters)');
    score -= 20;
  }

  const seoTitle = post.seoTitle || post.title || '';
  if (seoTitle.length < 30) {
    recommendations.push('SEO Title is short (< 30 characters). Consider expanding for better SERP visibility.');
    score -= 5;
  } else if (seoTitle.length > 70) {
    recommendations.push('SEO Title exceeds 70 characters and may be truncated on Google mobile SERPs.');
    score -= 5;
  }

  // Meta description checks
  if (!post.metaDescription || post.metaDescription.trim().length < 50) {
    warnings.push('Meta description is missing or too short (< 50 characters).');
    score -= 15;
  } else if (post.metaDescription.length > 175) {
    recommendations.push('Meta description exceeds 175 characters. Keep between 120–160 characters for best display.');
    score -= 5;
  }

  // Primary keyword
  if (!post.primaryKeyword) {
    warnings.push('No primary keyword designated for this article.');
    score -= 10;
  } else {
    const kw = post.primaryKeyword.toLowerCase();
    if (!post.title?.toLowerCase().includes(kw)) {
      recommendations.push(`Primary keyword '${post.primaryKeyword}' does not appear in the main H1 title.`);
      score -= 5;
    }
  }

  // Featured Image & Alt Text
  if (!post.featuredImage) {
    warnings.push('Featured image is missing.');
    score -= 10;
  } else if (!post.featuredImageAlt || post.featuredImageAlt.trim().length < 5) {
    warnings.push('Featured image is missing descriptive alt text for accessibility and image search.');
    score -= 10;
  }

  // Internal Links
  const linkCount = post.internalLinks?.length || 0;
  if (linkCount < 3) {
    warnings.push(`Only ${linkCount} internal link(s) configured. Target 3–8 links to service/compliance hubs.`);
    score -= 10;
  }

  // Content Length
  const wordCount = (post.content || '').split(/\s+/).filter(Boolean).length;
  if (wordCount < 400) {
    warnings.push(`Content is thin (${wordCount} words). A substantive FM trade explainer requires 500+ words.`);
    score -= 15;
  }

  // Duplicate checks against existing blog database
  if (post.slug) {
    const slugDupe = existingPosts.find(p => p.slug === post.slug && p.id !== post.id);
    if (slugDupe) {
      warnings.push(`Duplicate slug '${post.slug}' already exists in another article.`);
      score -= 30;
    }
  }

  // Cannibalisation checking
  const { risk, collisions } = checkSearchIntentCollision(post.title || '', post.primaryKeyword, post.slug);
  if (risk === 'HIGH') {
    warnings.push(`High cannibalisation risk: matches existing protected URL '${collisions[0]?.path}'`);
    score -= 25;
  } else if (risk === 'MEDIUM') {
    recommendations.push(`Moderate keyword overlap with existing page '${collisions[0]?.path}'. Ensure angle is distinct.`);
    score -= 10;
  }

  // Suggest internal links based on content themes
  const suggestedInternalLinks: InternalLinkItem[] = [];
  const text = `${post.title} ${post.content || ''}`.toLowerCase();

  if (text.includes('hvac') || text.includes('chiller') || text.includes('air conditioning')) {
    suggestedInternalLinks.push({ anchorText: 'commercial HVAC maintenance', targetUrl: '/hvac-contractor', targetType: 'service' });
  }
  if (text.includes('eicr') || text.includes('fixed wire') || text.includes('electrical')) {
    suggestedInternalLinks.push({ anchorText: 'fixed wire testing (EICR)', targetUrl: '/compliance/fixed-wire-testing-eicr', targetType: 'compliance' });
  }
  if (text.includes('sfg20') || text.includes('ppm') || text.includes('planned maintenance')) {
    suggestedInternalLinks.push({ anchorText: 'planned preventative maintenance (PPM)', targetUrl: '/ppm', targetType: 'service' });
  }
  if (text.includes('compliance') || text.includes('statutory') || text.includes('obligation')) {
    suggestedInternalLinks.push({ anchorText: 'statutory compliance centre', targetUrl: '/compliance', targetType: 'compliance' });
  }
  if (text.includes('glossary') || text.includes('definition') || text.includes('term')) {
    suggestedInternalLinks.push({ anchorText: 'facilities management glossary', targetUrl: '/facilities-management-glossary', targetType: 'glossary' });
  }

  return {
    seoScore: Math.max(0, Math.min(100, score)),
    warnings,
    recommendations,
    cannibalisationRisk: risk,
    collidingRoutes: collisions,
    suggestedInternalLinks,
  };
}
