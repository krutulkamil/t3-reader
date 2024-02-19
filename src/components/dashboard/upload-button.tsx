'use client';

import React, { useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadDropzone } from '@/components/dashboard/upload-dropzone';

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

      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
}
