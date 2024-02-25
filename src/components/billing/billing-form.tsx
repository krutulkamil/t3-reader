'use client';

import React from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import { MaxWidthWrapper } from '@/components/layout/max-width-wrapper';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { useToast } from '@/components/ui/use-toast';
import { trpc } from '@/app/_trpc/client';

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

export function BillingForm({ subscriptionPlan }: Readonly<BillingFormProps>) {
  const { toast } = useToast();

  const { mutate: createStripeSession, isPending } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url ?? '/dashboard/billing';
        if (!url) {
          return toast({
            title: 'There was a problem...',
            description: 'Please try again later.',
            variant: 'destructive',
          });
        }
      },
    });

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the <strong>{subscriptionPlan.name}</strong>{' '}
              plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {isPending ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? 'Manage Subscription'
                : 'Upgrade to PRO'}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? 'Your plan will be canceled on '
                  : 'Your plan renews on'}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, 'dd.MM.yyyy')}
                .
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
}
