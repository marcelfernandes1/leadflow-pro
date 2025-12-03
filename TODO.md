# LeadFlow Pro - Development To-Do List

## Overview
LeadFlow Pro is a lead generation and CRM platform for agencies with:
- Lead Discovery from Google Maps (via Apify)
- Lead Intelligence Scoring (Pro tier)
- Integrated CRM Pipeline
- Dopaminergic UI/UX

---

## Phase 1: Project Setup & Foundation ✅ COMPLETED

### 1.1 Project Initialization
- [x] Initialize React + TypeScript project with Vite
- [x] Configure TailwindCSS 4
- [x] Set up shadcn/ui component library
- [x] Install and configure Framer Motion
- [x] Install Lucide React icons
- [x] Install React Hook Form + Zod
- [x] Install @dnd-kit for drag-and-drop
- [x] Install canvas-confetti
- [x] Install Recharts for analytics
- [x] Set up Wouter for routing

### 1.2 Backend Setup
- [x] Set up Express 4 server
- [x] Configure tRPC 11
- [x] Set up Drizzle ORM
- [x] Configure MySQL/TiDB database connection
- [x] Create database schema (users, leads, searchCache, leadActivities, scrapingJobs)
- [ ] Set up authentication system

### 1.3 Project Structure
- [x] Create folder structure (components, pages, api, lib, hooks, types)
- [x] Set up environment variables
- [ ] Configure ESLint and Prettier
- [ ] Set up Vitest for testing

---

## Phase 2: MVP - Lead Discovery (Week 1) 🚧 IN PROGRESS

### 2.1 Lead Discovery UI
- [x] Create `LeadDiscovery.tsx` page component
- [x] Build search form with category and location inputs (shadcn/ui Form + React Hook Form)
- [x] Add optional filters (rating, has website)
- [x] Implement "Find Leads" button with loading state

### 2.2 Dopaminergic Search Experience
- [x] Add pulsing glow effect on search button during loading
- [x] Implement animated progress bar with gradient
- [x] Add real-time status updates ("Searching Google Maps...", "Analyzing businesses...", etc.)
- [x] Implement confetti explosion on search completion (canvas-confetti)
- [x] Add success message with lead count

### 2.3 Lead Results Display
- [x] Build lead card grid layout (responsive: 3-4 columns desktop, 1 mobile)
- [x] Create `LeadCard.tsx` component using shadcn/ui Card
- [x] Display: business name, category badge, location, Google rating, quick action icons
- [x] Add smooth entrance animation with stagger effect (Framer Motion)
- [x] Implement hover effect (card lift with shadow)

### 2.4 Lead Detail View
- [x] Create expandable lead detail modal (shadcn/ui Dialog)
- [x] Display full information: address, phone, email, website, social media
- [x] Make all contact info clickable (mailto:, tel:, social links open in new tab)
- [x] Add "Add to Pipeline" button
- [x] Implement toast notification on add ("Added to pipeline")

### 2.5 Backend - Lead Discovery
- [x] Integrate Apify Google Maps Scraper
- [x] Create tRPC procedure `leads.search(category, location, filters?)`
- [ ] Implement smart caching strategy (check cache before scraping)
- [ ] Save search results to database
- [ ] Return leads (randomized if from cache)

### 2.6 Smart Caching System
- [x] Create `searchCache` table (schema defined)
- [x] Implement cache check logic (< 60 days = serve from cache)
- [x] Randomize lead order when serving from cache
- [x] Track cache metadata (scrapedAt, lastServedAt, serveCount)

### 2.7 Frontend-Backend Integration
- [x] Connect tRPC client to React app
- [x] Wire up LeadDiscovery to call real API
- [x] Handle loading/error states from API
- [x] Store discovered leads in state/context (Zustand store)

---

## Phase 3: MVP - CRM Pipeline (Week 2) ✅ COMPLETED

### 3.1 Pipeline UI
- [x] Create `Pipeline.tsx` page component
- [x] Build Kanban board layout with columns for each stage
- [x] Stages: New Leads, Contacted, Qualified, Proposal, Negotiation, Closed Won, Closed Lost
- [x] Create `PipelineCard.tsx` component for leads in pipeline

### 3.2 Drag-and-Drop
- [x] Implement drag-and-drop with @dnd-kit
- [x] Add pick-up animation (scale up, add shadow)
- [x] Add dragging animation (follow cursor, slight rotation)
- [x] Add drop animation (smooth transition to new position)
- [x] Handle invalid drop (returns to original position)

### 3.3 Contact Tracking
- [x] Create contact modal ("How did you contact them?")
- [x] Options: Email, Phone, Instagram, Facebook, LinkedIn, Twitter, Website, In-person
- [x] One-click contact: click → opens contact method → marks as contacted
- [x] Auto-move lead to "Contacted" stage after contact
- [x] Record activity in timeline

### 3.4 Lead Detail from Pipeline
- [x] Create full lead detail modal from pipeline view
- [x] Display all contact info (clickable)
- [x] Show activity timeline
- [x] Add notes section
- [x] Add tags functionality
- [x] Add custom fields (key-value pairs)

### 3.5 Follow-Up Scheduling
- [x] Add "Schedule Follow-Up" button
- [x] Implement date picker (HTML date input)
- [x] Save follow-up date to store
- [x] Create follow-up reminders on dashboard

### 3.6 Bulk Actions
- [x] Add checkboxes for multi-select
- [x] Create bulk actions menu (Move to stage, Delete)
- [x] Add bulk tagging
- [x] Implement confirmation dialogs (shadcn/ui AlertDialog)
- [x] Add CSV export

### 3.7 Backend - CRM
- [x] Create tRPC procedures for pipeline operations:
  - [x] `leads.addToPipeline(leadId)`
  - [x] `leads.updateStage(leadId, stage)`
  - [x] `leads.trackContact(leadId, method)`
  - [x] `leads.addNote(leadId, note)`
  - [x] `leads.scheduleFollowUp(leadId, date)`
  - [x] `leads.getActivities(leadId)`
  - [x] `leads.bulkUpdate(leadIds, updates)`
  - [x] `leads.bulkDelete(leadIds)`

---

## Phase 4: Pro Intelligence (Week 3)

### 4.1 Technology Detection Backend
- [ ] Integrate Apify Tech Stack Detector
- [ ] Create technology detection service
- [ ] Map detected technologies to categories (CRM, Email, Chatbot, etc.)
- [ ] Identify technology gaps

### 4.2 Lead Scoring Algorithm
- [ ] Implement Technology Gap Analysis (40 points max)
- [ ] Implement Growth Signals (30 points max)
- [ ] Implement Budget Signals (20 points max)
- [ ] Implement Timing Signals (10 points max)

### 4.3 Job Posting Detection
- [ ] Integrate Apify Upwork Job Scraper
- [ ] Integrate Apify Indeed Scraper
- [ ] Search for company job postings
- [ ] Extract job titles and dates
- [ ] Cache results for 7 days

### 4.4 Website Performance Analysis
- [ ] Integrate Google PageSpeed Insights API
- [ ] Get performance score and mobile-friendly status
- [ ] Factor into lead score

### 4.5 Domain Age Detection
- [ ] Integrate WHOIS API
- [ ] Get domain registration date
- [ ] Factor into lead score

### 4.6 Opportunity Value Calculation
- [ ] Calculate opportunity values based on missing tools
- [ ] Sum total monthly and yearly opportunity

### 4.7 AI Insight Generation
- [ ] Create LLM prompt template for personalized pitch
- [ ] Generate "Why they'll close" insights
- [ ] Generate recommended pitch message
- [ ] Store insights in database

### 4.8 Enrichment Backend
- [ ] Create tRPC procedures:
  - [x] `leads.enrich(leadId)` - stub created
  - [ ] `leads.bulkEnrich(leadIds)` - enrich multiple leads in parallel
- [ ] Update lead record with enrichment data
- [ ] Set enrichmentStatus (pending, processing, completed, failed)

---

## Phase 5: Pro Intelligence UI (Week 4)

### 5.1 Pro Toggle
- [ ] Add Pro Intelligence toggle switch on Lead Discovery page
- [ ] Show upgrade prompt for non-Pro users
- [ ] Enable automatic enrichment when Pro is enabled

### 5.2 Lead Score Display
- [ ] Add lead score badge to cards
- [ ] Add spring animation for score badge entrance
- [ ] Add count-up animation (0 to actual score)
- [ ] Add pulsing glow for hot leads
- [ ] Sort leads by score (highest first)

### 5.3 Quick Insight Preview
- [ ] Show key insight on card ("No CRM • Hiring • 25 employees")
- [ ] Show opportunity value ("$5.5K/month")

### 5.4 Full Intelligence Report
- [ ] Create detailed intelligence modal/panel
- [ ] Display score breakdown by category
- [ ] Show "Why They'll Close" section with bullet points
- [ ] Show opportunity breakdown with tool values
- [ ] Display detected technology stack (has/missing/outdated)
- [ ] Show growth signals with icons and dates
- [ ] Display AI-generated recommended pitch

### 5.5 Enrichment Progress
- [ ] Show enrichment progress indicator ("Analyzing 127 leads... 45/127")
- [ ] Handle enrichment in background (don't block UI)
- [ ] Update UI as leads are enriched

---

## Phase 6: Polish & Design (Week 5)

### 6.1 Design System Implementation
- [x] Implement color palette (primary, success, warning, info, neutral)
- [x] Set up typography (Inter font, scale, weights)
- [x] Configure spacing system (8px grid)
- [x] Set up shadows and border radius tokens
- [x] Implement gradient styles for lead categories

### 6.2 Animation Polish
- [x] Refine all Framer Motion animations
- [x] Ensure consistent timing and easing
- [x] Add micro-interactions on all interactive elements
- [x] Polish modal open/close transitions

### 6.3 Loading States
- [x] Add skeleton screens everywhere (shadcn/ui Skeleton)
- [x] Create skeletons for: lead cards, detail view, pipeline
- [x] Add shimmer animation to skeletons

### 6.4 Empty States
- [x] Design empty state for no search results
- [x] Design empty state for empty pipeline
- [x] Design Pro upgrade prompt for non-Pro users
- [x] Add illustrations and CTAs

### 6.5 Error States
- [x] Create error component for API errors
- [x] Create no internet state
- [x] Add retry functionality
- [x] Show collapsible error details for debugging

### 6.6 Mobile Responsiveness
- [x] Test and fix all layouts on mobile
- [x] Ensure touch-friendly tap targets
- [x] Optimize pipeline view for mobile (horizontal scroll or stacked)

### 6.7 Accessibility
- [ ] Ensure WCAG 2.1 AA compliance
- [ ] Add keyboard navigation
- [ ] Test with screen reader
- [ ] Ensure proper focus indicators

---

## Phase 7: Testing & Quality (Week 5)

### 7.1 Unit Tests
- [ ] Write tests for lead scoring algorithm
- [ ] Write tests for caching logic
- [ ] Write tests for opportunity calculation
- [ ] Write tests for utility functions

### 7.2 Integration Tests
- [ ] Test lead discovery flow end-to-end
- [ ] Test pipeline drag-and-drop
- [ ] Test contact tracking
- [ ] Test enrichment flow

### 7.3 Performance
- [ ] Optimize bundle size
- [ ] Lazy load routes and components
- [ ] Optimize images and assets
- [ ] Test and improve Core Web Vitals

### 7.4 Security
- [ ] Audit API endpoints for vulnerabilities
- [ ] Ensure proper authentication on all routes
- [ ] Validate all user inputs
- [ ] Sanitize data before display

---

## Phase 8: Authentication & User Management

### 8.1 Authentication
- [ ] Set up authentication system
- [ ] Create login/signup pages
- [ ] Implement session management
- [ ] Add protected routes

### 8.2 User Profile
- [ ] Create user profile page
- [ ] Display subscription tier
- [ ] Show usage statistics (leads discovered, searches remaining)

### 8.3 Subscription Tiers
- [ ] Implement tier-based feature gating
- [ ] Free: 100 leads/mo, 10 searches/day, no intelligence
- [ ] Pro: 1,000 leads/mo, 50 searches/day, full intelligence
- [ ] Agency: 5,000 leads/mo, 200 searches/day, team features

---

## Phase 9: Dashboard & Analytics

### 9.1 Dashboard Page
- [x] Create main dashboard page
- [x] Show key metrics (leads discovered, contacted, in pipeline, won)
- [x] Show follow-ups due (with overdue/today/tomorrow badges)
- [x] Display recent activity feed
- [x] Show pipeline overview with stage counts

### 9.2 Analytics (Recharts)
- [x] Lead discovery trends chart (category breakdown)
- [x] Pipeline conversion funnel
- [x] Contact method breakdown
- [ ] Lead score distribution (requires Pro Intelligence)

---

## Phase 10: Navigation & Layout ✅ COMPLETED

### 10.1 App Layout
- [x] Create main app layout with sidebar
- [x] Build sidebar navigation (Dashboard, Lead Discovery, Pipeline, Settings)
- [x] Add user menu with profile/logout
- [x] Implement responsive sidebar (collapsible on mobile)

### 10.2 Settings Page
- [x] Create settings page
- [x] Account settings section
- [x] Subscription management section
- [x] Notification preferences

---

## Post-MVP Features (Future)

### Team Collaboration (Agency Tier)
- [ ] Multi-user accounts
- [ ] Role-based permissions
- [ ] Lead assignment
- [ ] Team activity feed

### Integrations
- [ ] CSV export/import
- [ ] API access for integrations
- [ ] Zapier integration
- [ ] Chrome extension

### Advanced Features
- [ ] Custom pipeline stages
- [ ] Custom scoring rules (Enterprise)
- [ ] Email templates
- [ ] Automated follow-up sequences
- [ ] Funding intelligence (Enterprise)
- [ ] White-label option (Enterprise)

---

## Tech Stack Summary

**Frontend:**
- React 19 + TypeScript
- Vite
- TailwindCSS 4
- shadcn/ui (Radix UI)
- Framer Motion
- Lucide React
- React Hook Form + Zod
- @dnd-kit
- canvas-confetti
- Recharts
- Wouter
- TanStack Query (via tRPC)

**Backend:**
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL/TiDB

**External APIs:**
- Apify (Google Maps, Tech Stack, Job Scrapers)
- Google PageSpeed Insights
- WHOIS API

---

## Git Workflow

- Push frequently (at least after each completed section)
- Use meaningful commit messages
- Create feature branches for major features
- Tag releases (v0.1.0 MVP, v0.2.0 Pro Intelligence, v1.0.0 Launch)

---

*Last Updated: December 4, 2025*
