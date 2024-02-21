import z from 'zod';

export const getPageInputSchema = (numPages?: number) => {
  return z.object({
    page: z.string().refine((num) => {
      return Number(num) > 0 && Number(num) <= (numPages ?? 0);
    }),
  });
};
