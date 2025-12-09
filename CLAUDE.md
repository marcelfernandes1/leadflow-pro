# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LeadFlow Pro is an AI-powered lead generation and CRM platform for agencies. It combines intelligent lead discovery (via Google Maps scraping) with AI-powered buying intent analysis and an integrated pipeline management system.

## Commands

```bash
# Development (runs both client and server concurrently)
npm run dev

# Run only frontend (Vite dev server on port 5173)
npm run dev:client

# Run only backend (Express + tRPC on port 3000)
npm run dev:server

# Build for production
npm run build

# Run tests
npm test

# Lint
npm run lint

# Database commands (Drizzle)
npm run db:generate   # Generate migrations
npm run db:migrate    # Run migrations
npm run db:push       # Push schema to database
npm run db:studio     # Open Drizzle Studio
```

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript, Vite bundler
- **Routing**: Wouter (lightweight router)
- **Styling**: Tailwind CSS with "LeadFlow OS" design system (Linear + Stripe + Superhuman inspired, trading terminal aesthetic)
- **State Management**: Zustand for local state (`src/hooks/useLeadStore.ts`), TanStack Query for server state via tRPC
- **UI Components**: Radix UI primitives wrapped with shadcn/ui styling in `src/components/ui/`
- **Animations**: Framer Motion exclusively (use `as const` on ease arrays for TypeScript compatibility)
- **Path alias**: `@/` maps to `src/`

### Backend (Express + tRPC)
- **Server**: Express with tRPC adapter
- **Database**: MySQL via Drizzle ORM
- **API Pattern**: tRPC procedures in `server/routes/`
- **Services**: Apify integration, lead scoring, caching, enrichment in `server/services/`

### Data Flow
1. Frontend calls tRPC procedures via `src/lib/trpc.ts`
2. Backend checks cache before external API calls
3. Lead data stored in MySQL, cached searches in `search_cache` table
4. Frontend uses Zustand store for pipeline management (persisted to localStorage)

### Key Files
- `src/App.tsx` - Route definitions
- `src/components/Layout.tsx` - Main layout with sidebar
- `src/hooks/useLeadStore.ts` - Zustand store for leads/pipeline
- `server/db/schema.ts` - Drizzle schema (users, leads, searchCache, leadActivities, scrapingJobs)
- `server/routes/leads.ts` - Lead-related tRPC procedures
- `server/services/apify.ts` - Apify Google Maps scraper integration

### Pages
- `/` - Dashboard with stats, follow-ups, activity feed
- `/discover` - Lead discovery with search and Pro Intelligence toggle
- `/pipeline` - Kanban board with drag-and-drop (uses @dnd-kit)
- `/analytics` - Charts and funnel visualization (uses Recharts)
- `/settings` - Profile, subscription, notifications

## UI Component Guidelines

Use existing shadcn/ui components from `src/components/ui/`. Key variants:
- **Button**: `default`, `outline`, `ghost`, `glow`, `success`
- **Card**: `default`, `surface`, `elevated`, `interactive`, `glass` (via `variant` prop), `hover` prop for hover effects
- **Badge**: `default`, `hot`, `warm`, `cold`, `glow`, `glass`

For animations, wrap components with Framer Motion's `<motion.div>`. When defining variants with cubic bezier easing, add `as const`:
```typescript
transition: { ease: [0.4, 0, 0.2, 1] as const }
```

## LeadFlow OS Design System

### Color Palette
- **Backgrounds**: `bg-void` (#0C0D0F), `bg-base` (#141618), `bg-elevated` (#212428), `bg-surface` (#292C31)
- **Brand**: `primary` (#3D7BF2 - brand blue)
- **Heat Colors**: `hot` (#FF5353), `warm` (#FFB74A), `cold` (#4AC0FF)
- **Semantic**: `success` (#22C55E), `destructive` (#EF4444)

### Typography
- **Font**: Inter (loaded via Google Fonts)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold)

### Design Principles
- 3-layer depth system: background → surface → interactive
- Glass morphism: Cards use `backdrop-blur` with 60-80% opacity backgrounds
- Sharp 8px border radius on buttons and cards
- Subtle borders with `border-border/50` opacity
- Heat colors for lead scoring (hot/warm/cold badges)
- Trading terminal aesthetic with data-dense layouts

## Database

MySQL database with Drizzle ORM. Schema includes:
- `users` - User accounts with subscription tiers
- `leads` - Lead data with CRM fields, intelligence data, and pipeline stage
- `search_cache` - Cached search results (60-day TTL)
- `lead_activities` - Activity timeline
- `scraping_jobs` - Apify job tracking

Environment variables for database connection: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## Git and Deployment

**Push to GitHub regularly**: After completing meaningful work, push commits to GitHub. This ensures:
- Changes are backed up in the remote repository
- The latest code is available for team collaboration
- Deployment pipelines can access the most recent changes

Use `git push` or `git push origin [branch-name]` to push changes after committing work. Do not hold changes locally for extended periods.
