import React from 'react';
import { ChevronDown, Search } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type Scale = 1 | 1.5 | 2 | 2.5;

interface PdfRendererProps {
  scale: number;
  onScaleChange: (scale: Scale) => void;
}

export function PdfRotate({
  scale,
  onScaleChange,
}: Readonly<PdfRendererProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1.5" aria-label="zoom" variant="ghost">
          <Search className="h-4 w-4" />
          {scale * 100}% <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => onScaleChange(1)}
        >
          100%
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => onScaleChange(1.5)}
        >
          150%
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => onScaleChange(2)}
        >
          200%
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => onScaleChange(2.5)}
        >
          250%
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
