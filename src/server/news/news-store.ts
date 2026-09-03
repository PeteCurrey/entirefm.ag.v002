import type { NewsArticle, NewsCategory, NewsCategoryMeta, NewsQueryOptions } from './types';

export const NEWS_CATEGORIES: NewsCategoryMeta[] = [
  {
    slug: 'building-safety',
    name: 'Building Safety',
    description: 'Statutory occurrence reporting, Golden Thread compliance, and BSR duty-holder directives.',
    color: 'border-rose-500 text-rose-400',
  },
  {
    slug: 'compliance',
    name: 'Compliance & Regulation',
    description: 'HSE updates, British Standards amendments, ACOP L8 water safety, and legal liability shifts.',
    color: 'border-amber-500 text-amber-400',
  },
  {
    slug: 'engineering',
    name: 'Engineering & M&E',
    description: 'HVAC plant diagnostics, electrical distribution, chiller efficiencies, and asset longevity.',
    color: 'border-brand-electric text-brand-electric',
  },
  {
    slug: 'property-estates',
    name: 'Property & Estates',
    description: 'Commercial leasing shifts, corporate workplace strategies, and estate portfolio transitions.',
    color: 'border-blue-500 text-blue-400',
  },
  {
    slug: 'energy-sustainability',
    name: 'Energy & Sustainability',
    description: 'Heat decarbonisation, BMS optimization, sub-metering mandates, and solar infrastructure.',
    color: 'border-emerald-500 text-emerald-400',
  },
  {
    slug: 'technology-cafm',
    name: 'Technology & CAFM',
    description: 'Asset information models, sensor telemetry, predictive maintenance, and operational software.',
    color: 'border-purple-500 text-purple-400',
  },
  {
    slug: 'contracts-mobilisations',
    name: 'Contracts & Mobilisations',
    description: 'Major UK hard and total facilities management contract awards, tenders, and framework wins.',
    color: 'border-teal-500 text-teal-400',
  },
  {
    slug: 'people-appointments',
    name: 'People & Appointments',
    description: 'Senior FM leadership appointments, director moves, board changes, and industry hires.',
    color: 'border-indigo-500 text-indigo-400',
  },
  {
    slug: 'suppliers-industry',
    name: 'Suppliers & Industry',
    description: 'Supply chain resilience, M&E specialist capability, and contractor trade developments.',
    color: 'border-neutral-400 text-neutral-300',
  },
  {
    slug: 'events-conferences',
    name: 'Events & Conferences',
    description: 'CPD accredited sessions, trade exhibitions, executive roundtables, and technical webinars.',
    color: 'border-orange-500 text-orange-400',
  },
  {
    slug: 'awards-recognition',
    name: 'Awards & Recognition',
    description: 'IWFM, PFM, CIBSE, and national industry award deadlines, shortlists, and ceremony outcomes.',
    color: 'border-yellow-500 text-yellow-400',
  },
];

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [];

class NewsStore {
  private articles: Map<string, NewsArticle> = new Map();

  constructor() {
    // STRICT ZERO-FABRICATION POLICY:
    // No mock or invented stories are seeded.
    for (const article of INITIAL_NEWS_ARTICLES) {
      this.articles.set(article.slug, article);
    }
  }

  public getAll(): NewsArticle[] {
    return Array.from(this.articles.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  public getBySlug(slug: string): NewsArticle | undefined {
    return this.articles.get(slug);
  }

  public getByCategory(category: NewsCategory): NewsArticle[] {
    return this.getAll().filter((a) => a.category === category);
  }

  public getLeadStory(): NewsArticle | undefined {
    return this.getAll().find((a) => a.isLeadStory) || this.getAll()[0];
  }

  public getFeaturedArticles(limit = 4): NewsArticle[] {
    return this.getAll()
      .filter((a) => a.isFeatured && !a.isLeadStory)
      .slice(0, limit);
  }

  public getLatestNewsStream(limit = 5): NewsArticle[] {
    return this.getAll().slice(0, limit);
  }

  public getContractWins(limit = 3): NewsArticle[] {
    return this.getByCategory('contracts-mobilisations').slice(0, limit);
  }

  public getPeopleMoves(limit = 3): NewsArticle[] {
    return this.getByCategory('people-appointments').slice(0, limit);
  }

  public query(options: NewsQueryOptions): { articles: NewsArticle[]; total: number } {
    let list = this.getAll();

    if (options.category && options.category !== 'all') {
      list = list.filter((a) => a.category === options.category);
    }

    if (options.topic) {
      const t = options.topic.toLowerCase();
      list = list.filter((a) => a.topics.some((item) => item.toLowerCase().includes(t)));
    }

    if (options.featuredOnly) {
      list = list.filter((a) => a.isFeatured);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.standfirst.toLowerCase().includes(q) ||
          (a.whyItMatters && a.whyItMatters.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const offset = options.offset || 0;
    const limit = options.limit || 20;

    return {
      articles: list.slice(offset, offset + limit),
      total,
    };
  }

  public overrideArticleImage(slug: string, newProvenance: Partial<NewsArticle['provenance']>): boolean {
    const article = this.articles.get(slug);
    if (!article) return false;

    article.provenance = {
      ...article.provenance,
      ...newProvenance,
    };
    return true;
  }
}

export const newsStore = new NewsStore();

export function getNewsArticles(options?: NewsQueryOptions) {
  return newsStore.query(options || {});
}

export function getNewsArticleBySlug(slug: string) {
  return newsStore.getBySlug(slug);
}

export function getLeadNewsStory() {
  return newsStore.getLeadStory();
}

export function getLatestNewsStream(limit = 5) {
  return newsStore.getLatestNewsStream(limit);
}

export function getContractWins(limit = 3) {
  return newsStore.getContractWins(limit);
}

export function getPeopleMoves(limit = 3) {
  return newsStore.getPeopleMoves(limit);
}

export function getNewsCategories() {
  return NEWS_CATEGORIES;
}
