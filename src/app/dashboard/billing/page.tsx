import React from 'react';

import { BillingForm } from '@/components/billing/billing-form';
import { getUserSubscriptionPlan } from '@/lib/stripe';

export default async function BillingPage() {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subscriptionPlan={subscriptionPlan} />;
}
