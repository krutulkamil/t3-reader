import React, { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface MaxWidthWrapperProps {
  className?: string;
  children: ReactNode;
}

export function MaxWidthWrapper({
  className,
  children,
}: Readonly<MaxWidthWrapperProps>) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-screen-xl px-2.5 md:px-20',
        className
      )}
    >
      {children}
    </div>
  );
}
