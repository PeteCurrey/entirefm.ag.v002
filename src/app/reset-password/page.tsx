import React from 'react';
import type { Metadata } from 'next';
import { TemplateMemberResetPassword } from '@/templates/member/TemplateMemberResetPassword';

export const metadata: Metadata = {
  title: 'Choose New Password | The Lobby — EntireFM',
  description: 'Set a new password for your Lobby Member account.',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <TemplateMemberResetPassword />;
}
