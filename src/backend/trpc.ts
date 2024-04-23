import { TRPCError, initTRPC } from '@trpc/server'
import { Context } from './context'


const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  })
})

export const middleware = t.middleware

// Protected procedures for logged in users only
export const protectedProcedure = t.procedure.use(isAuthed)
