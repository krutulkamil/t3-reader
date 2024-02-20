'use client';

import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useToast } from '@/components/ui/use-toast';
import { DocumentLoader } from '@/components/dashboard/document-loader';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
}

export function PdfRenderer({ url }: Readonly<PdfRendererProps>) {
  const { toast } = useToast();
  const { ref, width } = useResizeDetector();

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">top bar</div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            file={url}
            loading={DocumentLoader}
            onLoadError={(error) =>
              toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
              })
            }
            className="max-h-full"
          >
            <Page width={width} pageNumber={1} />
          </Document>
        </div>
      </div>
    </div>
  );
}
