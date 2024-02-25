import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

import { db } from '@/db';
import { pinecone } from '@/lib/pinecone';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { PLANS } from '@/config/stripe';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user?.id) throw new Error('Unauthorized');

      const subscriptionPlan = await getUserSubscriptionPlan();

      return { subscriptionPlan, userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url,
          uploadStatus: 'PROCESSING',
        },
      });

      try {
        const response = await fetch(file.url);
        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        // pdf content
        const pageLevelDocs = await loader.load();

        // pdf length
        const pageAmt = pageLevelDocs.length;

        const { subscriptionPlan } = metadata;
        const { isSubscribed } = subscriptionPlan;

        const isProExceeded =
          pageAmt > PLANS.find((plan) => plan.name === 'Pro')!.pagesPerPdf;
        const isFreeExceeded =
          pageAmt > PLANS.find((plan) => plan.name === 'Free')!.pagesPerPdf;

        if (
          (isSubscribed && isProExceeded) ||
          (!isSubscribed && isFreeExceeded)
        ) {
          await db.file.update({
            data: {
              uploadStatus: 'FAILED',
            },
            where: {
              id: createdFile.id,
            },
          });
        }

        // vectorize and index pdf
        const pineconeIndex = pinecone.index('reader');

        // generate vector from text
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        await db.file.update({
          data: { uploadStatus: 'SUCCESS' },
          where: { id: createdFile.id },
        });
      } catch (error) {
        console.error(error);

        await db.file.update({
          data: {
            uploadStatus: 'FAILED',
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
