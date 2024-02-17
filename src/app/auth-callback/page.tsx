'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { trpc } from '@/app/_trpc/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  const { data } = trpc.authCallback.useQuery(undefined);

  useEffect(() => {
    if (data?.success) {
      router.push(origin ? `/${origin}` : '/');
    }
  }, [data]);
}
