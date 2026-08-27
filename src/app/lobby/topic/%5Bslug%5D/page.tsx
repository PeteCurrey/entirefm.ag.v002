import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllLobbyTopics, getTopicBySlug } from '@/lib/lobby/repository';
import { TemplateLobbyTopic } from '@/templates/lobby/TemplateLobbyTopic';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';
import { canIndexStaticBuild } from '@/lib/indexing';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const topics = getAllLobbyTopics();
  return topics.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {
      title: 'Topic Not Found | The Lobby | EntireFM',
      robots: { index: false, follow: false },
    };
  }

  const title = `${topic.name} Intelligence & Briefings | The Lobby | EntireFM`;
  const description = topic.description;
  const canIndex = canIndexStaticBuild();

  return {
    title: { absolute: title },
    description,
    robots: {
      index: canIndex,
      follow: canIndex,
    },
    alternates: {
      canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/topic/${topic.slug}`,
    },
  };
}

export default async function LobbyTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return <TemplateLobbyTopic topic={topic} />;
}
