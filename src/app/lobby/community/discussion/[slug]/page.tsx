import { TemplateCommunityDiscussion } from '@/templates/community/TemplateCommunityDiscussion';

export async function generateStaticParams() {
  // Pre-render seed discussions
  return [
    { slug: 'how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off' },
    { slug: 'ahu-belts-failing-early-alignment-tension-or-sheave-wear' },
    { slug: 'mandatory-digital-occurrence-reporting-duty-holder-records' },
    { slug: 'water-hygiene-sensible-kpi-sets-for-water-treatment-contractors' },
    { slug: 'are-people-moving-away-from-blanket-12-month-ppm-frequencies' },
    { slug: 'contractor-evidence-after-reactive-callouts-photo-quality-and-job-sheets' },
    { slug: 'how-are-fm-teams-actually-using-ai-today-beyond-summarising-emails' },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formatted = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `${formatted} | The Lobby Community — EntireFM`,
    description: 'Technical discussion and practitioner answers in The Lobby Community.',
  };
}

export default async function DiscussionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TemplateCommunityDiscussion slug={slug} />;
}
