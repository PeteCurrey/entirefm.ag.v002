import { BlogPost, BlogRevision } from './types';
import { memoryStore } from './store';
import { analyzePostSeo } from './seo';
import { runFactCheck } from './factcheck';

/**
 * List blog posts with flexible filtering
 */
export async function listBlogPosts(options: {
  status?: string;
  categoryId?: string;
  authorId?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ posts: BlogPost[]; total: number }> {
  let all = Array.from(memoryStore.posts.values());

  if (options.status) {
    all = all.filter(p => p.status === options.status);
  }
  if (options.categoryId) {
    all = all.filter(p => p.categoryId === options.categoryId);
  }
  if (options.authorId) {
    all = all.filter(p => p.authorId === options.authorId);
  }
  if (options.search) {
    const q = options.search.toLowerCase();
    all = all.filter(p => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
  }

  // Sort by updatedAt descending
  all.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const total = all.length;
  const offset = options.offset || 0;
  const limit = options.limit || 50;
  const posts = all.slice(offset, offset + limit);

  return { posts, total };
}

/**
 * Retrieve a single blog post by ID or Slug
 */
export async function getBlogPost(idOrSlug: string): Promise<BlogPost | null> {
  const all = Array.from(memoryStore.posts.values());
  const found = all.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  return found || null;
}

/**
 * Create or save a new blog post
 */
export async function saveBlogPost(postData: Partial<BlogPost>, actor = 'admin'): Promise<BlogPost> {
  const isNew = !postData.id || !memoryStore.posts.has(postData.id);
  const now = new Date().toISOString();

  let post: BlogPost;

  if (isNew) {
    const id = postData.id || `post-${Date.now()}`;
    const slug = (postData.slug || postData.title || id)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    post = {
      id,
      slug,
      title: postData.title || 'Untitled Post',
      subtitle: postData.subtitle,
      excerpt: postData.excerpt || '',
      content: postData.content || '',
      contentJson: postData.contentJson,
      categoryId: postData.categoryId || memoryStore.categories[0].id,
      category: memoryStore.categories.find(c => c.id === postData.categoryId) || memoryStore.categories[0],
      authorId: postData.authorId || memoryStore.authors[0].id,
      author: memoryStore.authors.find(a => a.id === postData.authorId) || memoryStore.authors[0],
      featuredImage: postData.featuredImage,
      featuredImageAlt: postData.featuredImageAlt,
      featuredImageCaption: postData.featuredImageCaption,
      featuredImageSource: postData.featuredImageSource,
      status: postData.status || 'DRAFT',
      generationMode: postData.generationMode || 'manual',
      publishedAt: postData.publishedAt,
      scheduledAt: postData.scheduledAt,
      createdAt: now,
      updatedAt: now,
      primaryKeyword: postData.primaryKeyword,
      secondaryKeywords: postData.secondaryKeywords || [],
      seoTitle: postData.seoTitle,
      metaDescription: postData.metaDescription,
      canonicalUrl: postData.canonicalUrl || `https://www.entirefm.com/post/${slug}`,
      robotsIndex: postData.robotsIndex ?? true,
      robotsFollow: postData.robotsFollow ?? true,
      sitemapInclude: postData.sitemapInclude ?? true,
      schemaType: postData.schemaType || 'Article',
      readingTime: Math.max(3, Math.round(((postData.content || '').split(/\s+/).length) / 200)),
      reviewStatus: postData.reviewStatus || 'PENDING',
      factCheckStatus: postData.factCheckStatus || 'PENDING',
      seoStatus: postData.seoStatus || 'PENDING',
      imageStatus: postData.imageStatus || 'PENDING',
      contentScore: 90,
      seoScore: 90,
      primaryServiceHref: postData.primaryServiceHref,
      primaryServiceCta: postData.primaryServiceCta,
      internalLinks: postData.internalLinks || [],
      createdBy: actor,
      updatedBy: actor,
    };
  } else {
    const existing = memoryStore.posts.get(postData.id!)!;
    post = {
      ...existing,
      ...postData,
      updatedAt: now,
      updatedBy: actor,
    };
  }

  // Run SEO and Fact Checks
  const existingPosts = Array.from(memoryStore.posts.values()).filter(p => p.id !== post.id);
  const seoAnalysis = analyzePostSeo(post, existingPosts);
  const factCheck = runFactCheck(post.content);

  post.seoScore = seoAnalysis.seoScore;
  post.seoStatus = seoAnalysis.warnings.length === 0 ? 'PASSED' : 'PENDING';
  post.factCheckStatus = factCheck.passed ? 'PASSED' : 'REJECTED';

  // Save to memory store
  memoryStore.posts.set(post.id, post);

  // Create an audit revision
  const revCount = memoryStore.revisions.filter(r => r.postId === post.id).length;
  const revision: BlogRevision = {
    id: `rev-${Date.now()}-${revCount + 1}`,
    postId: post.id,
    revisionNumber: revCount + 1,
    title: post.title,
    content: post.content,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    changedBy: actor,
    changeType: isNew ? 'INITIAL_CREATION' : 'MANUAL_EDIT',
    changeSummary: isNew ? 'Created new blog post' : 'Updated post copy/metadata',
    createdAt: now,
  };
  memoryStore.revisions.unshift(revision);

  return post;
}

/**
 * Change status (Publish, Schedule, Archive, etc.)
 */
export async function updatePostStatus(
  postId: string,
  newStatus: BlogPost['status'],
  scheduledDate?: string,
  actor = 'admin'
): Promise<BlogPost> {
  const post = memoryStore.posts.get(postId);
  if (!post) throw new Error(`Post ${postId} not found`);

  const now = new Date().toISOString();
  post.status = newStatus;
  post.updatedAt = now;
  post.updatedBy = actor;

  if (newStatus === 'PUBLISHED') {
    post.publishedAt = now;
    post.scheduledAt = undefined;
  } else if (newStatus === 'SCHEDULED' && scheduledDate) {
    post.scheduledAt = scheduledDate;
  }

  memoryStore.posts.set(post.id, post);
  return post;
}

/**
 * List revisions for a post
 */
export async function listPostRevisions(postId: string): Promise<BlogRevision[]> {
  return memoryStore.revisions.filter(r => r.postId === postId);
}
