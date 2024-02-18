import { initTRPC, TRPCError } from '@trpc/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const t = initTRPC.create();

const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return opts.next({
    ...opts,
    ctx: {
      ...opts.ctx,
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
