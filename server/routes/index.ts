import { router } from '../trpc.js'
import { leadsRouter } from './leads.js'

export const appRouter = router({
  leads: leadsRouter,
})

export type AppRouter = typeof appRouter
