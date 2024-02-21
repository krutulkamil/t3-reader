'use client';

import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useForm } from 'react-hook-form';
import { ChevronDown, ChevronUp, RotateCw } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PdfFullScreen } from '@/components/dashboard/pdf-full-screen';
import { PdfContent } from '@/components/dashboard/pdf-content';
import { getPageInputSchema } from '@/schemas/pageInputSchema';
import { cn } from '@/lib/utils';
import { PdfRotate } from '@/components/dashboard/pdf-rotate';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
}

export function PdfRenderer({ url }: Readonly<PdfRendererProps>) {
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const pageInputSchema = getPageInputSchema(numPages);
  type PageInput = z.infer<typeof pageInputSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PageInput>({
    defaultValues: {
      page: '1',
    },
    resolver: zodResolver(pageInputSchema),
    mode: 'onChange',
  });

  function handlePageSubmit({ page }: PageInput) {
    setCurrPage(Number(page));
    setValue('page', page);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit(handlePageSubmit)();
    }
  }

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => {
              setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue('page', String(currPage - 1));
            }}
            disabled={currPage <= 1}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register('page')}
              onKeyDown={handleInputKeyDown}
              className={cn(
                'w-12 h-8',
                errors.page && 'focus-visible:ring-red-500'
              )}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? 'x'}</span>
            </p>
          </div>

          <Button
            onClick={() => {
              setCurrPage((prev) =>
                prev + 1 > (numPages ?? 0) ? numPages ?? 0 : prev + 1
              );
              setValue('page', String(currPage + 1));
            }}
            disabled={numPages === undefined || currPage >= numPages}
            variant="ghost"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2">
          <PdfRotate scale={scale} onScaleChange={setScale} />

          <Button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            aria-label="rotate"
            variant="ghost"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <PdfFullScreen>
            <PdfContent
              url={url}
              currPage={currPage}
              scale={scale}
              rotation={rotation}
              numPages={numPages}
              onPageNumChange={setNumPages}
              isFullScreen
            />
          </PdfFullScreen>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <PdfContent
            url={url}
            currPage={currPage}
            scale={scale}
            rotation={rotation}
            numPages={numPages}
            onPageNumChange={setNumPages}
          />
        </SimpleBar>
      </div>
    </div>
  );
}
