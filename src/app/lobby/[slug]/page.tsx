import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPublishedLobbyArticles, getLobbyArticleBySlug } from '@/lib/lobby/repository';
import { TemplateLobbyArticle } from '@/templates/lobby/TemplateLobbyArticle';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';
import { canIndexStaticBuild } from '@/lib/indexing';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllPublishedLobbyArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getLobbyArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | The Lobby | EntireFM',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${PRODUCTION_CANONICAL_HOST}/lobby/${article.slug}`;
  const title = article.seoTitle || `${article.title} | The Lobby | EntireFM`;
  const description = article.seoDescription || article.standfirst;
  const canIndex = canIndexStaticBuild();

  return {
    title: { absolute: title },
    description,
    robots: {
      index: canIndex,
      follow: canIndex,
      googleBot: {
        index: canIndex,
        follow: canIndex,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.author.name],
      tags: article.topics,
      images: article.heroImage
        ? [{ url: `${PRODUCTION_CANONICAL_HOST}${article.heroImage}`, alt: article.heroImageAlt || article.title }]
        : undefined,
    },
  };
}

export default async function LobbyArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getLobbyArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <TemplateLobbyArticle article={article} />;
}
