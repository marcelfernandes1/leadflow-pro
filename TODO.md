# LeadFlow Pro - Development To-Do List

## Overview
LeadFlow Pro is a lead generation and CRM platform for agencies with:
- Lead Discovery from Google Maps (via Apify)
- Lead Intelligence Scoring (Pro tier)
- Integrated CRM Pipeline
- Dopaminergic UI/UX

---

## Phase 1: Project Setup & Foundation

### 1.1 Project Initialization
- [ ] Initialize React + TypeScript project with Vite
- [ ] Configure TailwindCSS 4
- [ ] Set up shadcn/ui component library
- [ ] Install and configure Framer Motion
- [ ] Install Lucide React icons
- [ ] Install React Hook Form + Zod
- [ ] Install @dnd-kit for drag-and-drop
- [ ] Install canvas-confetti
- [ ] Install Recharts for analytics
- [ ] Set up Wouter for routing

### 1.2 Backend Setup
- [ ] Set up Express 4 server
- [ ] Configure tRPC 11
- [ ] Set up Drizzle ORM
- [ ] Configure MySQL/TiDB database connection
- [ ] Create database schema (users, leads, searchCache, leadActivities, scrapingJobs)
- [ ] Set up authentication system

### 1.3 Project Structure
- [ ] Create folder structure (components, pages, api, lib, hooks, types)
- [ ] Set up environment variables
- [ ] Configure ESLint and Prettier
- [ ] Set up Vitest for testing

---

## Phase 2: MVP - Lead Discovery (Week 1)

### 2.1 Lead Discovery UI
- [ ] Create `LeadDiscovery.tsx` page component
- [ ] Build search form with category and location inputs (shadcn/ui Form + React Hook Form)
- [ ] Add optional filters (rating, has website)
- [ ] Implement "Find Leads" button with loading state

### 2.2 Dopaminergic Search Experience
- [ ] Add pulsing glow effect on search button during loading
- [ ] Implement animated progress bar with gradient
- [ ] Add real-time status updates ("Searching Google Maps...", "Analyzing businesses...", etc.)
- [ ] Implement confetti explosion on search completion (canvas-confetti)
- [ ] Add success message with lead count

### 2.3 Lead Results Display
- [ ] Build lead card grid layout (responsive: 3-4 columns desktop, 1 mobile)
- [ ] Create `LeadCard.tsx` component using shadcn/ui Card
- [ ] Display: business name, category badge, location, Google rating, quick action icons
- [ ] Add smooth entrance animation with stagger effect (Framer Motion)
- [ ] Implement hover effect (card lift with shadow)

### 2.4 Lead Detail View
- [ ] Create expandable lead detail modal (shadcn/ui Dialog)
- [ ] Display full information: address, phone, email, website, social media
- [ ] Make all contact info clickable (mailto:, tel:, social links open in new tab)
- [ ] Add "Add to Pipeline" button
- [ ] Implement toast notification on add ("Added to pipeline")

### 2.5 Backend - Lead Discovery
- [ ] Integrate Apify Google Maps Scraper
- [ ] Create tRPC procedure `leads.search(category, location, filters?)`
- [ ] Implement smart caching strategy (check cache before scraping)
- [ ] Save search results to database
- [ ] Return leads (randomized if from cache)

### 2.6 Smart Caching System
- [ ] Create `searchCache` table
- [ ] Implement cache check logic (< 60 days = serve from cache)
- [ ] Randomize lead order when serving from cache
- [ ] Track cache metadata (scrapedAt, lastServedAt, serveCount)

---

## Phase 3: MVP - CRM Pipeline (Week 2)

### 3.1 Pipeline UI
- [ ] Create `Pipeline.tsx` page component
- [ ] Build Kanban board layout with columns for each stage
- [ ] Stages: New Leads, Contacted, Qualified, Proposal, Negotiation, Closed Won, Closed Lost
- [ ] Create `PipelineCard.tsx` component for leads in pipeline

### 3.2 Drag-and-Drop
- [ ] Implement drag-and-drop with @dnd-kit
- [ ] Add pick-up animation (scale up, add shadow)
- [ ] Add dragging animation (follow cursor, slight rotation)
- [ ] Add drop animation (smooth transition to new position)
- [ ] Handle invalid drop (shake animation, return to original)

### 3.3 Contact Tracking
- [ ] Create contact modal ("How did you contact them?")
- [ ] Options: Email, Phone, Instagram, Facebook, LinkedIn, Twitter, Website, In-person
- [ ] One-click contact: click → opens contact method → marks as contacted
- [ ] Auto-move lead to "Contacted" stage after contact
- [ ] Record activity in timeline

### 3.4 Lead Detail from Pipeline
- [ ] Create full lead detail modal from pipeline view
- [ ] Display all contact info (clickable)
- [ ] Show activity timeline
- [ ] Add notes section
- [ ] Add tags functionality
- [ ] Add custom fields (key-value pairs)

### 3.5 Follow-Up Scheduling
- [ ] Add "Schedule Follow-Up" button
- [ ] Implement date picker (shadcn/ui Calendar)
- [ ] Save follow-up date to database
- [ ] Create follow-up reminders on dashboard

### 3.6 Bulk Actions
- [ ] Add checkboxes for multi-select
- [ ] Create bulk actions menu (Move to stage, Add tags, Delete, Export CSV)
- [ ] Implement confirmation dialogs (shadcn/ui AlertDialog)

### 3.7 Backend - CRM
- [ ] Create tRPC procedures for pipeline operations:
  - [ ] `leads.addToPipeline(leadId)`
  - [ ] `leads.updateStage(leadId, stage)`
  - [ ] `leads.trackContact(leadId, method)`
  - [ ] `leads.addNote(leadId, note)`
  - [ ] `leads.scheduleFollowUp(leadId, date)`
  - [ ] `leads.getActivities(leadId)`
  - [ ] `leads.bulkUpdate(leadIds, updates)`

---

## Phase 4: Pro Intelligence (Week 3)

### 4.1 Technology Detection Backend
- [ ] Integrate Apify Tech Stack Detector
- [ ] Create technology detection service
- [ ] Map detected technologies to categories (CRM, Email, Chatbot, etc.)
- [ ] Identify technology gaps

### 4.2 Lead Scoring Algorithm
- [ ] Implement Technology Gap Analysis (40 points max)
  - No CRM: +15
  - No email marketing: +12
  - No marketing automation: +15
  - No analytics: +10
  - No chatbot: +10
  - No AI chatbot: +12
  - Slow website: +8
  - No SSL: +12
  - Outdated CMS: +8
  - No mobile optimization: +10

- [ ] Implement Growth Signals (30 points max)
  - Job postings in last 30 days: +20
  - 3+ job postings: +15
  - Hiring marketing/sales roles: +25
  - Executive hires: +18
  - New website: +12
  - Recent redesign: +10
  - New domain: +8
  - Added e-commerce: +15

- [ ] Implement Budget Signals (20 points max)
  - 10-50 employees: +15
  - 50-200 employees: +12
  - 200+ employees: +8
  - High traffic: +15
  - Premium tools: +12
  - Multiple locations: +8
  - E-commerce with traffic: +15

- [ ] Implement Timing Signals (10 points max)
  - Active job posting for services: +30
  - Q1: +12
  - Q4: +8
  - End of fiscal year: +10

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
- [ ] Calculate opportunity values based on missing tools:
  - Missing CRM: $2,000/month
  - Missing Marketing Automation: $3,000/month
  - Missing AI Chatbot: $500/month
  - etc.
- [ ] Sum total monthly and yearly opportunity

### 4.7 AI Insight Generation
- [ ] Create LLM prompt template for personalized pitch
- [ ] Generate "Why they'll close" insights
- [ ] Generate recommended pitch message
- [ ] Store insights in database

### 4.8 Enrichment Backend
- [ ] Create tRPC procedures:
  - [ ] `leads.enrich(leadId)` - enrich single lead
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
- [ ] Add lead score badge to cards:
  - Hot (80-100): Red/orange gradient, fire emoji
  - Warm (60-79): Yellow gradient, thermometer emoji
  - Cold (40-59): Blue gradient, snowflake emoji
  - Low priority (0-39): Gray, no emoji
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
- [ ] Implement color palette (primary, success, warning, info, neutral)
- [ ] Set up typography (Inter font, scale, weights)
- [ ] Configure spacing system (8px grid)
- [ ] Set up shadows and border radius tokens
- [ ] Implement gradient styles for lead categories

### 6.2 Animation Polish
- [ ] Refine all Framer Motion animations
- [ ] Ensure consistent timing and easing
- [ ] Add micro-interactions on all interactive elements
- [ ] Polish modal open/close transitions

### 6.3 Loading States
- [ ] Add skeleton screens everywhere (shadcn/ui Skeleton)
- [ ] Create skeletons for: lead cards, detail view, pipeline
- [ ] Add shimmer animation to skeletons

### 6.4 Empty States
- [ ] Design empty state for no search results
- [ ] Design empty state for empty pipeline
- [ ] Design Pro upgrade prompt for non-Pro users
- [ ] Add illustrations and CTAs

### 6.5 Error States
- [ ] Create error component for API errors
- [ ] Create no internet state
- [ ] Add retry functionality
- [ ] Show collapsible error details for debugging

### 6.6 Mobile Responsiveness
- [ ] Test and fix all layouts on mobile
- [ ] Ensure touch-friendly tap targets
- [ ] Optimize pipeline view for mobile (horizontal scroll or stacked)

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
- [ ] Create main dashboard page
- [ ] Show key metrics (leads discovered, contacted, in pipeline)
- [ ] Show follow-ups due today
- [ ] Display recent activity feed
- [ ] Show subscription usage

### 9.2 Analytics (Recharts)
- [ ] Lead discovery trends chart
- [ ] Pipeline conversion funnel
- [ ] Contact method breakdown
- [ ] Lead score distribution

---

## Phase 10: Navigation & Layout

### 10.1 App Layout
- [ ] Create main app layout with sidebar
- [ ] Build sidebar navigation (Dashboard, Lead Discovery, Pipeline, Settings)
- [ ] Add user menu with profile/logout
- [ ] Implement responsive sidebar (collapsible on mobile)

### 10.2 Settings Page
- [ ] Create settings page
- [ ] Account settings section
- [ ] Subscription management section
- [ ] Notification preferences

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
