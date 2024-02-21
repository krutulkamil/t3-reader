import React from 'react';
import { Document, Page } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';

import { DocumentLoader } from '@/components/dashboard/document-loader';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface PdfContentProps {
  url: string;
  numPages?: number;
  currPage: number;
  onPageNumChange: (page: number) => void;
  scale: number;
  rotation: number;
  isFullScreen?: boolean;
  renderedScale?: number | null;
  isLoading?: boolean;
  onRenderedScale?: (scale: number) => void;
}

export const PdfContent = ({
  url,
  numPages,
  currPage,
  scale,
  renderedScale,
  rotation,
  onPageNumChange,
  isFullScreen = false,
  isLoading = false,
  onRenderedScale,
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
          <>
            {isLoading && renderedScale ? (
              <Page
                width={width}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={'@' + renderedScale}
              />
            ) : null}
            <Page
              className={cn(isLoading ? 'hidden' : '')}
              width={width}
              pageNumber={currPage}
              scale={scale}
              rotate={rotation}
              key={'@' + scale}
              loading={DocumentLoader}
              onRenderSuccess={() => onRenderedScale?.(scale)}
            />
          </>
        )}
      </Document>
    </div>
  );
};
