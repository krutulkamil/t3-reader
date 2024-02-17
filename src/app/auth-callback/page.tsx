'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { trpc } from '@/app/_trpc/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  const { data, error } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    if (data?.success) {
      router.push(origin ? `/${origin}` : '/');
    }

    if (error?.data?.code === 'UNAUTHORIZED') {
      router.push('/sign-in');
    }
  }, [data, error]);
}
