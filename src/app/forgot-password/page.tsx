import { TemplateMemberForgotPassword } from '@/templates/member/TemplateMemberForgotPassword';

export const metadata = {
  title: 'Reset Password | The Lobby — EntireFM',
  description: 'Reset your Lobby Member account password.',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <TemplateMemberForgotPassword />;
}
