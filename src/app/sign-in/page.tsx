import { TemplateMemberSignIn } from '@/templates/member/TemplateMemberSignIn';

export const metadata = {
  title: 'Sign In | The Lobby — EntireFM',
  description: 'Sign in to your Lobby Member account.',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <TemplateMemberSignIn />;
}
