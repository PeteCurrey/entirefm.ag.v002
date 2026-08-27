import { Suspense } from 'react';
import { TemplateVerifyEmail } from '@/templates/member/TemplateVerifyEmail';

export const metadata = {
  title: 'Verify Your Email | The Lobby · EntireFM',
  description: 'Confirm your email address to activate your EntireFM Lobby Membership.',
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <TemplateVerifyEmail />
    </Suspense>
  );
}
