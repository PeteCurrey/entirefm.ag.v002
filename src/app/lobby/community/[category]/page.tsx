import { TemplateCommunityCategory } from '@/templates/community/TemplateCommunityCategory';
import { COMMUNITY_CATEGORIES } from '@/server/community/category-store';

export async function generateStaticParams() {
  return COMMUNITY_CATEGORIES.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const found = COMMUNITY_CATEGORIES.find((c) => c.slug === category);
  return {
    title: `${found ? found.name : 'Category'} | The Lobby Community — EntireFM`,
    description: found?.shortDescription || 'FM practitioner technical discussion.',
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <TemplateCommunityCategory categorySlug={category} />;
}
