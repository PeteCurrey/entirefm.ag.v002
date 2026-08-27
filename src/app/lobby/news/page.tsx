import type { Metadata } from 'next';
import {
  getNewsArticles,
  getLeadNewsStory,
  getLatestNewsStream,
  getContractWins,
  getPeopleMoves,
  getNewsCategories,
} from '@/server/news/news-store';
import { TemplateNewsHome } from '@/templates/news/TemplateNewsHome';

export const metadata: Metadata = {
  title: 'FM Industry News & Regulatory Updates | The Lobby',
  description: 'Statutory compliance shifts, engineering developments, contract wins, and executive moves across UK facilities management.',
};

export default function LobbyNewsPage() {
  const leadStory = getLeadNewsStory();
  const { articles: featuredArticles } = getNewsArticles({ featuredOnly: true, limit: 4 });
  const latestStream = getLatestNewsStream(20);
  const contractWins = getContractWins(4);
  const peopleMoves = getPeopleMoves(4);
  const categories = getNewsCategories();

  return (
    <TemplateNewsHome
      leadStory={leadStory}
      featuredArticles={featuredArticles}
      latestStream={latestStream}
      contractWins={contractWins}
      peopleMoves={peopleMoves}
      categories={categories}
    />
  );
}
