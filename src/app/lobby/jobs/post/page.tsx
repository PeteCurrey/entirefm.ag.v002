import type { Metadata } from 'next';
import { TemplateJobPost } from '@/templates/jobs/TemplateJobPost';

export const metadata: Metadata = {
  title: 'Post a Facilities Management Role | The Lobby — EntireFM',
  description: 'Reach thousands of verified UK FM practitioners, M&E engineers, and building safety leaders.',
};

export default function JobPostPage() {
  return <TemplateJobPost />;
}
