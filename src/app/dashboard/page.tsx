import React from 'react';
import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { MaxWidthWrapper } from '@/components/layout/max-width-wrapper';

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) redirect('/auth-callback?origin=dashboard');

  return <MaxWidthWrapper>{JSON.stringify(user, null, 4)}</MaxWidthWrapper>;
}
