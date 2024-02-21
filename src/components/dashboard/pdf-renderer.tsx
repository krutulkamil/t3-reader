'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useForm } from 'react-hook-form';
import { useResizeDetector } from 'react-resize-detector';
import { ChevronDown, ChevronUp, RotateCw, Search } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useToast } from '@/components/ui/use-toast';
import { DocumentLoader } from '@/components/dashboard/document-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getPageInputSchema } from '@/schemas/pageInputSchema';
import { cn } from '@/lib/utils';

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

  const { toast } = useToast();
  const { ref, width } = useResizeDetector();

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
            onClick={() => setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))}
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

        <div className="space-x-2">
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
                onSelect={() => setScale(1)}
              >
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setScale(1.5)}
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setScale(2)}
              >
                200%
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setScale(2.5)}
              >
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            aria-label="rotate"
            variant="ghost"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
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
              <Page
                width={width}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
