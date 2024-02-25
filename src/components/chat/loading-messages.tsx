import React from 'react';
import Skeleton from 'react-loading-skeleton';

export function LoadingMessages() {
  return (
    <div className="w-full flex flex-col gap-2">
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
    </div>
  );
}
