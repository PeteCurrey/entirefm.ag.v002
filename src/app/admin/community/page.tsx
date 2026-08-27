import { TemplateCommunityAdmin } from '@/templates/community/TemplateCommunityAdmin';

export const metadata = {
  title: 'Community Moderation Desk | EntireFM Staff Admin',
  robots: { index: false, follow: false },
};

export default function CommunityAdminPage() {
  return <TemplateCommunityAdmin />;
}
