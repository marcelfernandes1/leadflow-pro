import type { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { getAuth } from '@clerk/express'

export interface User {
  id: string
  email?: string
}

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  // Extract user from Clerk authentication
  const auth = getAuth(req)

  const user: User | null = auth.userId ? {
    id: auth.userId,
    email: undefined, // Email would require additional Clerk API call
  } : null

  return {
    req,
    res,
    user,
    userId: auth.userId,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
