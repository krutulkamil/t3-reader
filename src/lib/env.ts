import { z } from 'zod';

const envVariablesSchema = z.object({
  KINDE_CLIENT_ID: z.string(),
  KINDE_CLIENT_SECRET: z.string(),
  KINDE_ISSUER_URL: z.string(),
  KINDE_SITE_URL: z.string(),
  KINDE_POST_LOGOUT_REDIRECT_URL: z.string(),
  KINDE_POST_LOGIN_REDIRECT_URL: z.string(),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  UPLOADTHING_SECRET: z.string(),
  UPLOADTHING_APP_ID: z.string(),
  PINECONE_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
});

envVariablesSchema.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariablesSchema> {}
  }
}
