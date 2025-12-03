import type { CreateExpressContextOptions } from '@trpc/server/adapters/express'

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  // Here you would typically:
  // 1. Extract user from session/JWT
  // 2. Connect to database
  // 3. Return any shared resources

  return {
    req,
    res,
    // user: null, // Add user from auth later
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
