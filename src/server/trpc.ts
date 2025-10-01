import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { createContext } from './context'

const t = initTRPC.context<typeof ({} as any)>().create({
transformer: superjson,
errorFormatter({ shape }) {
return shape
}
})

export const router = t.router
export const publicProcedure = t.procedure

// wire routers below (inventory example)
import { inventoryRouter } from './routers/inventory'

export const appRouter = router({
inventory: inventoryRouter
})

export type AppRouter = typeof appRouter
