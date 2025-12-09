import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { clerkMiddleware } from '@clerk/express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './routes/index.js'
import { createContext } from './context.js'

const app = express()
const PORT = process.env.PORT || 3000

// CORS configuration - only allow specific origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

// Rate limiting - prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Note: searchLimiter for stricter rate limits on Apify calls can be added per-route as needed

app.use(express.json({ limit: '10mb' }))

// Clerk authentication middleware
app.use(clerkMiddleware())

// Apply rate limiting to API routes
app.use('/api', apiLimiter)

// tRPC middleware
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/api/trpc`)

  // Log environment status for debugging
  console.log('\n=== Environment Check ===')
  console.log('APIFY_API_TOKEN:', process.env.APIFY_API_TOKEN ? `✓ Set (${process.env.APIFY_API_TOKEN.substring(0, 15)}...)` : '✗ NOT SET')
  console.log('NEVERBOUNCE_API_KEY:', process.env.NEVERBOUNCE_API_KEY ? `✓ Set (${process.env.NEVERBOUNCE_API_KEY.substring(0, 10)}...)` : '✗ NOT SET')
  console.log('WHOIS_API_KEY:', process.env.WHOIS_API_KEY ? `✓ Set` : '✗ NOT SET')
  console.log('CLERK_PUBLISHABLE_KEY:', process.env.CLERK_PUBLISHABLE_KEY ? `✓ Set` : '✗ NOT SET')
  console.log('========================\n')
})

export type AppRouter = typeof appRouter
