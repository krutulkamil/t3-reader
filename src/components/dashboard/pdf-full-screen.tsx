import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import { Expand } from 'lucide-react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PdfFullScreenProps {
  children: React.ReactNode;
}

export function PdfFullScreen({ children }: Readonly<PdfFullScreenProps>) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setIsOpen(open);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button className="gap-1.5" variant="ghost" aria-label="Full screen">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar className="max-h-[calc(100vh-10rem)] mt-6" autoHide={false}>
          {children}
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}
