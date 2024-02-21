import React from 'react';
import { Document, Page } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';

import { DocumentLoader } from '@/components/dashboard/document-loader';
import { toast } from '@/components/ui/use-toast';

interface PdfContentProps {
  url: string;
  numPages?: number;
  currPage: number;
  onPageNumChange: (page: number) => void;
  scale: number;
  rotation: number;
  isFullScreen?: boolean;
}

export const PdfContent = ({
  url,
  numPages,
  currPage,
  scale,
  rotation,
  onPageNumChange,
  isFullScreen = false,
}: Readonly<PdfContentProps>) => {
  const { ref, width } = useResizeDetector();

  return (
    <div ref={ref}>
      <Document
        file={url}
        loading={DocumentLoader}
        onLoadSuccess={({ numPages }) => onPageNumChange(numPages)}
        onLoadError={(error) =>
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          })
        }
        className="max-h-full"
      >
        {isFullScreen ? (
          new Array(numPages)
            .fill(0)
            .map((_, i) => <Page key={i} width={width} pageNumber={i + 1} />)
        ) : (
          <Page
            width={width}
            pageNumber={currPage}
            scale={scale}
            rotate={rotation}
          />
        )}
      </Document>
    </div>
  );
};
