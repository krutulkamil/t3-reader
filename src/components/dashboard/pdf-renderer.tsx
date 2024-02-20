'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { ChevronDown, ChevronUp } from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useToast } from '@/components/ui/use-toast';
import { DocumentLoader } from '@/components/dashboard/document-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
}

export function PdfRenderer({ url }: Readonly<PdfRendererProps>) {
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [currPage, setCurrPage] = useState<number>(1);

  const { toast } = useToast();
  const { ref, width } = useResizeDetector();

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))}
            disabled={currPage <= 1}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input className="w-12 h-8" />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? 'x'}</span>
            </p>
          </div>

          <Button
            onClick={() =>
              setCurrPage((prev) =>
                prev + 1 > (numPages ?? 0) ? numPages ?? 0 : prev + 1
              )
            }
            disabled={numPages === undefined || currPage >= numPages}
            variant="ghost"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            file={url}
            loading={DocumentLoader}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) =>
              toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
              })
            }
            className="max-h-full"
          >
            <Page width={width} pageNumber={currPage} />
          </Document>
        </div>
      </div>
    </div>
  );
}
