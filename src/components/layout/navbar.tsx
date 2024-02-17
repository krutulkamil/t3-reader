import React from 'react';
import Link from 'next/link';

import { MaxWidthWrapper } from '@/components/layout/max-width-wrapper';

export function Navbar() {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Reader.</span>
          </Link>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}