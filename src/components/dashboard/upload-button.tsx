'use client';

import React, { useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function UploadButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setIsOpen(open);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button className="btn-primary">Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>Example content</DialogContent>
    </Dialog>
  );
}
