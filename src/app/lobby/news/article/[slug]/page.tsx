import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsArticleBySlug, getNewsArticles } from '@/server/news/news-store';
import { TemplateNewsArticle } from '@/templates/news/TemplateNewsArticle';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found | The Lobby' };
  }

  return {
    title: `${article.title} | The Lobby FM News`,
    description: article.standfirst,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { articles: relatedArticles } = getNewsArticles({
    category: article.category,
    limit: 3,
  });

  const filteredRelated = relatedArticles.filter((a) => a.slug !== article.slug);

  return (
    <TemplateNewsArticle
      article={article}
      relatedArticles={filteredRelated}
    />
  );
}
