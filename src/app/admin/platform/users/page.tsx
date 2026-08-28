import { redirect } from 'next/navigation';

export default async function PlatformUsersRedirect({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>;
}) {
  const { type, search } = await searchParams;
  const params = new URLSearchParams();
  if (type) params.set('operational', type);
  if (search) params.set('search', search);

  const qs = params.toString();
  redirect(qs ? `/admin/users?${qs}` : '/admin/users');
}
