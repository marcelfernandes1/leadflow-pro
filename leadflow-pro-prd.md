# LeadFlow Pro - Product Requirements Document (PRD)

**Version**: 1.0  
**Last Updated**: December 2, 2025  
**Author**: Product Team  
**Status**: Ready for Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Target Users](#target-users)
4. [Core Features](#core-features)
5. [User Experience](#user-experience)
6. [Technical Architecture](#technical-architecture)
7. [Pricing & Monetization](#pricing--monetization)
8. [Success Metrics](#success-metrics)
9. [Development Roadmap](#development-roadmap)
10. [Future Enhancements](#future-enhancements)

---

## Executive Summary

**LeadFlow Pro** is a next-generation lead generation and CRM platform designed specifically for marketing agencies, CRM implementation agencies, AI automation agencies, and similar B2B service providers. The platform combines intelligent lead discovery with AI-powered buying intent analysis and an integrated pipeline management system.

### Key Differentiators

**vs. Traditional Lead Gen Tools** (Apollo, ZoomInfo):
- They provide contact information
- **We provide**: Contact info + buying intelligence + perfect timing signals

**vs. Technology Detection Tools** (BuiltWith, Wappalyzer):
- They provide technology stack data
- **We provide**: Technology gaps + opportunity scoring + actionable insights

### The $20M Vision

LeadFlow Pro will become indispensable to agencies by transforming cold outreach into warm, targeted conversations. Agencies using our platform will see 10-30% close rates (vs. 1-5% industry average) because they'll know exactly which businesses are ready to buy, what they need, and when to reach out.

---

## Product Vision

### Mission Statement

**"Make every agency unstoppable by showing them exactly which leads will close and why."**

### Core Philosophy

Traditional lead generation provides **contact information**. LeadFlow Pro provides **buying intelligence**. We answer three critical questions:

1. **Does this business need our services?** (Technology Gap Analysis)
2. **Can they afford our services?** (Budget & Company Size Signals)
3. **Are they ready to buy NOW?** (Growth & Timing Signals)

### Design Philosophy

**Trillion-Dollar Company Quality**: Every interaction should feel premium, satisfying, and rewarding. Think Linear, Vercel, Stripe-level polish with dopaminergic animations that make users want to come back daily.

---

## Target Users

### Primary Personas

**1. Marketing Agency Owner** (Primary)
- **Pain**: Spends 10+ hours/week on cold outreach with 2% response rate
- **Need**: High-intent leads that actually respond
- **Value**: 10-30% close rate, 80% time savings on research

**2. CRM Implementation Consultant**
- **Pain**: Hard to identify businesses without CRM systems
- **Need**: Targeted list of businesses missing CRM + growth signals
- **Value**: Qualified pipeline of businesses ready to invest

**3. AI Automation Agency**
- **Pain**: Everyone claims they need AI, few actually buy
- **Need**: Identify businesses with budget + specific automation gaps
- **Value**: Higher close rates, shorter sales cycles

**4. Sales Development Rep (SDR)**
- **Pain**: Calling through cold lists with no context
- **Need**: Know why each lead might buy before calling
- **Value**: Better conversations, more meetings booked

### User Size Segments

- **Solo Consultant**: 1 person, $5-20K/month revenue
- **Small Agency**: 2-10 people, $20-100K/month revenue
- **Mid-Market Agency**: 11-50 people, $100K-1M/month revenue
- **Enterprise Agency**: 50+ people, $1M+/month revenue

---

## Core Features

### Feature Tier Overview

| Feature | Free | Pro ($149/mo) | Agency ($299/mo) | Enterprise (Custom) |
|---------|------|---------------|------------------|---------------------|
| Lead Discovery (Google Maps) | 100/mo | 1,000/mo | 5,000/mo | Unlimited |
| Contact Information | ✅ | ✅ | ✅ | ✅ |
| One-Click Contact Actions | ✅ | ✅ | ✅ | ✅ |
| CRM Pipeline | ✅ | ✅ | ✅ | ✅ |
| **Lead Intelligence Scoring** | ❌ | ✅ | ✅ | ✅ |
| **Technology Gap Analysis** | ❌ | ✅ | ✅ | ✅ |
| **Growth Signals Detection** | ❌ | ✅ | ✅ | ✅ |
| **AI-Powered Insights** | ❌ | ✅ | ✅ | ✅ |
| Team Collaboration | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| **Funding Intelligence** | ❌ | ❌ | ❌ | ✅ |
| Custom Scoring Rules | ❌ | ❌ | ❌ | ✅ |
| White-Label Option | ❌ | ❌ | ❌ | ✅ |

---

## Feature 1: Lead Discovery (Basic Tier)

### Overview

Users can search for businesses by industry/category and location using Apify's Google Maps scraper. The experience is designed to be highly dopaminergic with satisfying animations and instant gratification.

### User Flow

1. **Search Input**
   - User enters: Industry/Category (e.g., "plumbers", "restaurants", "dentists")
   - User enters: Location (e.g., "Miami, FL", "Chicago", "Los Angeles")
   - Optional filters: Rating (4+ stars), Open now, Has website

2. **Dopaminergic Search Experience**
   - Click "Find Leads" button
   - Button transforms with pulsing glow effect
   - Progress bar appears with animated gradient
   - Real-time status updates:
     - "Searching Google Maps..." (0-30%)
     - "Analyzing 47 businesses..." (30-60%)
     - "Extracting contact information..." (60-90%)
     - "Validating data..." (90-100%)
   - **Confetti explosion** on completion
   - Success message: "🎉 We found 127 leads in Miami!"

3. **Results Display**
   - Beautiful card grid layout (3-4 columns on desktop, 1 on mobile)
   - Each card shows:
     - Business name (bold, prominent)
     - Category/industry (small badge)
     - Location (city, state)
     - Google rating (stars + count)
     - Quick action icons: 📧 Email, 📞 Phone, 🌐 Website, 📱 Instagram
   - Smooth entrance animation (cards fade in with stagger effect)
   - Hover effect: card lifts with soft shadow

4. **Lead Detail View**
   - Click any card → expands to show full details
   - **Full Information Display**:
     - Business name
     - Category/industry
     - Full address (street, city, state, zip)
     - Phone number (clickable tel: link)
     - Email address (clickable mailto: link)
     - Website URL (clickable, opens in new tab)
     - Social media profiles (all clickable):
       - Instagram → opens instagram.com/username
       - Facebook → opens facebook.com/page
       - LinkedIn → opens linkedin.com/company/name
       - Twitter → opens twitter.com/handle
     - Google rating (stars + review count)
     - Business hours (if available)
     - Photos (if available)
   - **One-Click Contact Actions**:
     - Click email → opens mailto:email@business.com
     - Click phone → opens tel:+1234567890
     - Click social → opens profile in new tab
     - User can quickly contact, close detail, move to next lead
   - "Add to Pipeline" button → saves to CRM

5. **Add to CRM**
   - Click "Add to Pipeline" on any lead
   - Lead is saved to database with all information
   - Appears in Pipeline view under "New Leads" stage
   - Toast notification: "✅ Added to pipeline"

### Data Points Collected (from Apify Google Maps)

| Field | Description | Example | Always Available? |
|-------|-------------|---------|-------------------|
| Business Name | Official name | "Joe's Plumbing" | ✅ Yes |
| Category | Industry/type | "Plumber" | ✅ Yes |
| Address | Full address | "123 Main St, Miami, FL 33101" | ✅ Yes |
| Phone | Phone number | "+1-305-555-1234" | ⚠️ Usually |
| Email | Email address | "info@joesplumbing.com" | ⚠️ Sometimes |
| Website | Website URL | "https://joesplumbing.com" | ⚠️ Usually |
| Google Rating | Star rating | 4.5 | ✅ Yes |
| Review Count | Number of reviews | 127 | ✅ Yes |
| Instagram | Instagram handle | "@joesplumbing" | ⚠️ Sometimes |
| Facebook | Facebook page | "facebook.com/joesplumbing" | ⚠️ Sometimes |
| LinkedIn | LinkedIn company | "linkedin.com/company/joes-plumbing" | ⚠️ Rarely |
| Twitter | Twitter handle | "@joesplumbing" | ⚠️ Rarely |
| Business Hours | Operating hours | "Mon-Fri 8am-6pm" | ⚠️ Usually |
| Photos | Business photos | Array of image URLs | ⚠️ Usually |

### Smart Caching Strategy (Cost Optimization)

**Problem**: If 100 users search "plumbers in Miami", we'd pay Apify 100 times for the same data.

**Solution**: Cache search results and serve from database when possible.

#### Caching Logic

1. **Before Scraping**: Check if identical search exists in database
   - Query: `SELECT * FROM searchCache WHERE category = 'plumbers' AND location = 'Miami, FL'`
   
2. **Cache Decision Tree**:
   ```
   Search exists in cache?
   ├─ No → Scrape with Apify, save to database, return results
   └─ Yes → Check age
       ├─ < 30 days old → Serve from cache (randomize order)
       ├─ 30-60 days old → Serve from cache (randomize order)
       └─ > 60 days old → Re-scrape, update database, return results
   ```

3. **Randomization**: When serving cached results, randomize lead order
   - **Why**: Prevent all users from contacting the same businesses in the same order
   - **How**: `ORDER BY RAND()` in SQL query or shuffle array in application code

4. **Cache Metadata**:
   - `scrapedAt`: Timestamp of original scrape
   - `lastServedAt`: Timestamp of last cache hit
   - `serveCount`: Number of times cache was served
   - `leadCount`: Number of leads in this search

#### Cost Savings Example

**Without Caching**:
- 1,000 users search "plumbers in Miami" (same search)
- 1,000 Apify API calls
- Cost: 1,000 × $0.10 = **$100**

**With Caching**:
- First user: Scrape with Apify ($0.10)
- Next 999 users: Serve from cache ($0)
- Cost: **$0.10**
- **Savings: 99.9%**

#### Database Schema for Caching

```sql
CREATE TABLE searchCache (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  filters JSON, -- optional filters (rating, open now, etc.)
  scrapedAt TIMESTAMP NOT NULL,
  lastServedAt TIMESTAMP,
  serveCount INT DEFAULT 0,
  leadCount INT NOT NULL,
  leadIds JSON NOT NULL, -- array of lead IDs
  INDEX idx_search (category, location),
  INDEX idx_age (scrapedAt)
);
```

### Technical Implementation

**Frontend** (Using Existing Components Only):
- React component: `LeadDiscovery.tsx`
- **Form**: shadcn/ui `<Form>` + React Hook Form + Zod validation (NO custom form components)
- **Input fields**: shadcn/ui `<Input>`, `<Select>` components (NO custom inputs)
- **Buttons**: shadcn/ui `<Button>` with variants (NO custom buttons)
- **Cards**: shadcn/ui `<Card>` for lead display (NO custom card components)
- **Progress bar**: shadcn/ui `<Progress>` component (NO custom progress bars)
- **Animations**: Framer Motion `<motion.div>` wrappers (NO custom animation logic)
- **Confetti**: canvas-confetti library (NO custom confetti implementation)
- **Icons**: Lucide React icons (NO custom SVG icons)
- **Modals**: shadcn/ui `<Dialog>` component (NO custom modals)
- **Toasts**: shadcn/ui `<Toast>` via Sonner (NO custom notifications)

**Backend**:
- tRPC procedure: `leads.search(category, location, filters?)`
- Check cache first (database query)
- If cache miss or stale: call Apify Google Maps Scraper API
- Save results to database
- Return leads (randomized if from cache)

**Apify Integration**:
- Actor: `dtrungtin/google-maps-scraper` (most popular)
- Input: `{ searchQuery: "plumbers in Miami, FL", maxCrawledPlaces: 500 }`
- Output: Array of business objects with all fields
- Cost: ~$0.10-0.50 per search (depending on result count)

---

## Feature 2: Lead Intelligence Scoring (Pro Tier)

### Overview

The Pro tier unlocks AI-powered lead intelligence that analyzes each lead's website to detect technology gaps, growth signals, and buying intent. Each lead receives a score from 0-100 indicating probability of closing.

### User Flow

1. **Enable Pro Intelligence**
   - User toggles "Pro Intelligence" switch on Lead Discovery page
   - Or: User enables in Settings → Subscription

2. **Automatic Enrichment**
   - After lead discovery completes, system automatically enriches each lead
   - Background process (doesn't block UI):
     - Analyzes website technology stack
     - Checks for recent job postings
     - Calculates lead score
     - Generates AI insights
   - Progress indicator: "Analyzing 127 leads... (45/127 complete)"

3. **Intelligence Display**
   - Each lead card now shows:
     - **Lead Score Badge**: "95/100 🔥" (hot), "68/100 🌡️" (warm), "42/100 🧊" (cold)
     - **Key Insight**: "No CRM • Hiring • 25 employees"
     - **Opportunity**: "$5.5K/month"
   - Leads are automatically sorted by score (highest first)
   - Visual indicators:
     - Hot leads (80-100): Red/orange gradient, fire emoji
     - Warm leads (60-79): Yellow gradient, thermometer emoji
     - Cold leads (40-59): Blue gradient, snowflake emoji
     - Low priority (0-39): Gray, no special indicator

4. **Detailed Intelligence View**
   - Click lead → expanded view shows full intelligence report
   - **Score Breakdown**:
     - Technology Gaps: 40/40 points
     - Growth Signals: 25/30 points
     - Budget Signals: 15/20 points
     - Timing Signals: 10/10 points
     - **Total: 90/100** 🔥
   
   - **Why They'll Close**:
     - "Just posted job for Marketing Manager (3 days ago)"
     - "No CRM system detected"
     - "No marketing automation platform"
     - "Website redesigned in last 3 months"
     - "25 employees (ideal size for our services)"
   
   - **Opportunity Breakdown**:
     - Missing CRM (HubSpot/Salesforce): **$2,000/month**
     - Missing Marketing Automation: **$3,000/month**
     - Missing AI Chatbot: **$500/month**
     - **Total Opportunity: $5,500/month** or **$66,000/year**
   
   - **Technology Stack Detected**:
     - ✅ Has: WordPress, Google Analytics, Mailchimp (basic)
     - ❌ Missing: CRM, Marketing Automation, AI Chatbot, Facebook Pixel
     - ⚠️ Outdated: WordPress 5.8 (current: 6.4), slow page speed (42/100)
   
   - **Growth Signals**:
     - 🔥 Posted 3 jobs in last 30 days
     - 🔥 Hiring for: Marketing Manager, Sales Rep, Customer Success
     - 📈 Website redesigned 2 months ago
     - 🆕 Domain age: 3 years (established but growing)
   
   - **Recommended Pitch** (AI-Generated):
     > "Hi [Name], I saw you're hiring a Marketing Manager - congrats on the growth! I specialize in setting up CRM and marketing automation systems for growing teams. I can have your new hire set up with HubSpot, automated workflows, and an AI chatbot before their first day. Would you be open to a 15-minute call this week?"

### Lead Scoring Algorithm

#### Scoring Categories (Total: 100 points)

**1. Technology Gap Analysis (40 points max)**

| Signal | Points | Detection Method |
|--------|--------|------------------|
| No CRM system | +15 | Wappalyzer/Apify Tech Detector |
| No email marketing | +12 | Wappalyzer/Apify Tech Detector |
| No marketing automation | +15 | Wappalyzer/Apify Tech Detector |
| No analytics tracking | +10 | Check for Google Analytics, Facebook Pixel |
| No chatbot | +10 | Check for Intercom, Drift, LiveChat, etc. |
| No AI chatbot specifically | +12 | Check for Drift AI, Intercom AI, ChatGPT |
| Slow website (PageSpeed < 50) | +8 | Google PageSpeed API |
| No HTTPS/SSL | +12 | Check certificate |
| Outdated CMS version | +8 | Wappalyzer version detection |
| No mobile optimization | +10 | Google Mobile-Friendly Test API |

**Scoring Logic**: Sum all applicable gaps, cap at 40 points.

**2. Growth Signals (30 points max)**

| Signal | Points | Detection Method |
|--------|--------|------------------|
| Posted jobs in last 30 days | +20 | Apify job scrapers (Upwork, Indeed, LinkedIn) |
| Posted 3+ jobs | +15 | Count job postings |
| Hiring marketing/sales roles | +25 | Keyword match in job titles |
| Executive/C-level hires | +18 | Job title analysis |
| Website launched < 6 months | +12 | WHOIS domain age |
| Website redesigned recently | +10 | Wayback Machine comparison (optional) |
| New domain registration | +8 | WHOIS registration date |
| Added e-commerce recently | +15 | BuiltWith change detection (optional) |

**Scoring Logic**: Sum all applicable signals, cap at 30 points.

**3. Budget & Company Size Signals (20 points max)**

| Signal | Points | Detection Method |
|--------|--------|------------------|
| 10-50 employees (sweet spot) | +15 | LinkedIn Company API |
| 50-200 employees | +12 | LinkedIn Company API |
| 200+ employees | +8 | LinkedIn Company API |
| High website traffic (10K+/mo) | +15 | SimilarWeb API (optional) |
| Using premium tools | +12 | Detect Salesforce, HubSpot Enterprise, etc. |
| Multiple office locations | +8 | Google Maps data |
| E-commerce with traffic | +15 | Shopify + traffic data |

**Scoring Logic**: Sum all applicable signals, cap at 20 points.

**4. Timing Signals (10 points max)**

| Signal | Points | Detection Method |
|--------|--------|------------------|
| Active job posting for our services | +30 | Job title keyword match |
| Q1 (Jan-Mar) | +12 | Current date |
| Q4 (Oct-Dec) | +8 | Current date |
| End of fiscal year | +10 | Company fiscal year (if known) |

**Scoring Logic**: Sum all applicable signals, cap at 10 points.

#### Score Interpretation

| Score Range | Category | Emoji | Meaning | Expected Close Rate |
|-------------|----------|-------|---------|---------------------|
| 80-100 | Hot Lead | 🔥 | Multiple strong signals, ready to buy | 20-30% |
| 60-79 | Warm Lead | 🌡️ | Good fit, needs nurturing | 10-20% |
| 40-59 | Cold Lead | 🧊 | Some potential, long-term prospect | 5-10% |
| 0-39 | Low Priority | - | Poor fit or not ready | 1-5% |

### Detectable Technologies

**CRM Systems**:
- Salesforce, HubSpot (Free/Starter/Pro/Enterprise), Pipedrive, Zoho CRM, Freshsales, Monday.com, Copper CRM, Insightly, Nimble, Streak

**Email Marketing**:
- Mailchimp, Klaviyo, ActiveCampaign, SendGrid, Constant Contact, ConvertKit, Drip, GetResponse, AWeber, Campaign Monitor

**Marketing Automation**:
- HubSpot Marketing Hub, Marketo, Pardot, ActiveCampaign, Autopilot, Customer.io, Eloqua, SharpSpring

**Live Chat & Chatbots**:
- Intercom, Drift, LiveChat, Zendesk Chat, Tidio, Crisp, Olark, Tawk.to, ChatGPT integrations, Dialogflow, ManyChat

**AI Chatbots** (Specific Detection):
- Drift (with AI features), Intercom (with AI features), Ada, Landbot, Chatfuel, MobileMonkey, Botsify, Custom ChatGPT implementations

**Analytics & Tracking**:
- Google Analytics (GA3 vs GA4), Facebook Pixel, Google Ads Tracking, LinkedIn Insight Tag, Hotjar, Mixpanel, Segment, Amplitude, Heap, Matomo

**E-commerce Platforms**:
- Shopify (Basic/Standard/Advanced/Plus), WooCommerce, Magento, BigCommerce, Wix E-commerce, Squarespace Commerce, PrestaShop, OpenCart

**CMS & Website Builders**:
- WordPress (version detectable), Webflow, Wix, Squarespace, Drupal, Joomla, Ghost, Contentful, Strapi

**Payment Processors**:
- Stripe, PayPal, Square, Braintree, Authorize.net, 2Checkout, Adyen, Worldpay

**A/B Testing & Optimization**:
- Optimizely, VWO (Visual Website Optimizer), Google Optimize, Unbounce, Instapage, Convert

### Technical Implementation

**Technology Detection**:
- **Primary**: Apify Tech Stack Detector Actor
  - Cost: ~$0.01-0.05 per website
  - Detects 1,000+ technologies
  - Returns: Array of detected technologies with categories
- **Alternative**: Wappalyzer API (more expensive but more accurate)
  - Cost: $450/month for Business plan (20K API credits)
  - Use for Pro/Agency tiers only

**Job Posting Detection**:
- **Apify Upwork Job Scraper**: Search for company name or domain
- **Apify Indeed Scraper**: Search for company name
- **Apify LinkedIn Jobs Scraper**: Search for company name
- Cost: ~$0.05-0.10 per company
- Cache results for 7 days

**Website Performance**:
- **Google PageSpeed Insights API**: Free, 25K requests/day
- Returns: Performance score (0-100), mobile-friendly status, Core Web Vitals

**Domain Age**:
- **WHOIS Lookup**: Free or cheap APIs ($0.001 per lookup)
- Returns: Registration date, last updated, registrar

**Employee Count** (Optional - LinkedIn API):
- **LinkedIn Company API**: Requires LinkedIn partnership
- Alternative: Scrape from LinkedIn company page (against TOS)
- Alternative: Manual input or user-provided data

**AI Insight Generation**:
- Use built-in LLM (invokeLLM helper)
- Prompt template:
  ```
  Analyze this lead and generate a personalized pitch:
  
  Company: {name}
  Industry: {category}
  Detected Tech: {technologies}
  Missing Tools: {gaps}
  Recent Activity: {jobPostings}
  Score: {score}/100
  
  Generate a 2-3 sentence personalized outreach message that:
  1. References their recent activity (if any)
  2. Mentions specific technology gaps
  3. Offers clear value proposition
  4. Ends with soft call-to-action
  ```

**Database Schema Updates**:

```sql
-- Add to leads table
ALTER TABLE leads ADD COLUMN technologyStack JSON;
ALTER TABLE leads ADD COLUMN leadScore INT DEFAULT 0;
ALTER TABLE leads ADD COLUMN scoreBreakdown JSON;
ALTER TABLE leads ADD COLUMN opportunities JSON;
ALTER TABLE leads ADD COLUMN growthSignals JSON;
ALTER TABLE leads ADD COLUMN lastEnrichedAt TIMESTAMP;
ALTER TABLE leads ADD COLUMN enrichmentStatus ENUM('pending', 'processing', 'completed', 'failed');

-- Example JSON structures:
-- technologyStack: {"crm": null, "email": "Mailchimp", "analytics": "Google Analytics", ...}
-- scoreBreakdown: {"technologyGaps": 35, "growthSignals": 20, "budgetSignals": 15, "timingSignals": 10}
-- opportunities: [{"tool": "CRM", "value": 2000}, {"tool": "Marketing Automation", "value": 3000}]
-- growthSignals: [{"type": "job_posting", "title": "Marketing Manager", "date": "2025-11-28"}]
```

**Backend Procedures**:

```typescript
// tRPC procedures
leads: router({
  search: protectedProcedure
    .input(z.object({ category: z.string(), location: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // 1. Check cache
      // 2. If miss: scrape with Apify
      // 3. Save to database
      // 4. Return leads (randomized if cached)
    }),
  
  enrich: protectedProcedure
    .input(z.object({ leadId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // 1. Get lead from database
      // 2. Run tech detection (Apify)
      // 3. Check job postings (Apify)
      // 4. Calculate score
      // 5. Generate AI insights
      // 6. Save to database
      // 7. Return enriched lead
    }),
  
  bulkEnrich: protectedProcedure
    .input(z.object({ leadIds: z.array(z.number()) }))
    .mutation(async ({ input, ctx }) => {
      // Enrich multiple leads in parallel
      // Return progress updates via websocket (optional)
    }),
})
```

---

## Feature 3: Integrated CRM Pipeline

### Overview

All discovered leads can be added to a visual Kanban-style pipeline for organization and tracking. Users can drag leads between stages, track contact history, and schedule follow-ups.

### Pipeline Stages (Default)

1. **New Leads** - Just discovered, not yet contacted
2. **Contacted** - Reached out via email/phone/social
3. **Qualified** - Expressed interest, needs assessment
4. **Proposal** - Sent proposal or quote
5. **Negotiation** - Discussing terms, pricing, scope
6. **Closed Won** - Deal closed, became customer
7. **Closed Lost** - Deal lost, not interested

**Customization**: Users can add/edit/delete stages (Pro tier)

### User Flow

1. **Add Lead to Pipeline**
   - From Lead Discovery: Click "Add to Pipeline" button
   - Lead appears in "New Leads" stage
   - Toast notification: "✅ Added to pipeline"

2. **View Pipeline**
   - Navigate to "Pipeline" page
   - Kanban board with columns for each stage
   - Each column shows lead cards (name, company, score if Pro)
   - Drag-and-drop between stages

3. **Lead Card (Pipeline View)**
   - Business name
   - Category badge
   - Lead score badge (if Pro): "95/100 🔥"
   - Tags (if any)
   - Last activity date
   - Quick actions: View details, Contact, Move stage

4. **Contact Tracking**
   - Click "Contact" on lead card
   - Modal appears: "How did you contact them?"
   - Options: Email, Phone, Instagram, Facebook, LinkedIn, Twitter, Website form, In-person
   - Click option → one-click action:
     - Email: Opens mailto: link, then marks as "Contacted via Email"
     - Phone: Opens tel: link, then marks as "Contacted via Phone"
     - Instagram: Opens Instagram profile, then marks as "Contacted via Instagram"
     - Etc.
   - After contact, lead automatically moves to "Contacted" stage
   - Activity recorded in timeline: "Contacted via Instagram on Dec 2, 2025"

5. **Follow-Up Scheduling**
   - Click "Schedule Follow-Up" on lead card
   - Date picker appears
   - Select date → saves to database
   - Reminder appears on dashboard: "3 follow-ups due today"
   - Click reminder → opens lead detail

6. **Lead Detail View (from Pipeline)**
   - Click lead card → full detail modal
   - All contact information (clickable)
   - Lead intelligence (if Pro)
   - Activity timeline
   - Notes section (add/edit notes)
   - Tags (add/remove)
   - Custom fields (add key-value pairs)

7. **Bulk Actions**
   - Select multiple leads (checkboxes)
   - Bulk actions menu appears:
     - Move to stage
     - Add tags
     - Delete
     - Export to CSV
   - Confirm → action applied to all selected

### One-Click Contact Workflow

**Goal**: Make contacting leads as fast as possible - click, contact, come back, next lead.

**Example Flow**:
1. User opens Pipeline view
2. Sees "Hot Lead" in "New Leads" stage
3. Clicks Instagram icon on lead card
4. Instagram profile opens in new tab
5. User sends DM on Instagram
6. User closes Instagram tab, returns to LeadFlow Pro
7. Lead card shows "Contacted via Instagram" badge
8. Lead automatically moved to "Contacted" stage
9. User moves to next lead, repeats

**Technical Implementation**:
- All contact links open in new tab (`target="_blank"`)
- After click, JavaScript records contact method
- Background API call: `leads.trackContact(leadId, method)`
- UI updates immediately (optimistic update)
- If user closes tab without contacting, no harm (just marked as contacted)

### Activity Timeline

Every interaction with a lead is recorded:

| Timestamp | Activity | User |
|-----------|----------|------|
| Dec 2, 2025 3:45 PM | Contacted via Instagram | John Smith |
| Dec 2, 2025 2:30 PM | Added note: "Interested in CRM" | John Smith |
| Dec 2, 2025 2:15 PM | Moved to Qualified stage | John Smith |
| Dec 2, 2025 10:00 AM | Contacted via Email | John Smith |
| Dec 1, 2025 4:20 PM | Added to pipeline | John Smith |

### Database Schema

```sql
-- Lead activities table
CREATE TABLE leadActivities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  leadId INT NOT NULL,
  userId INT NOT NULL,
  activityType ENUM('contacted', 'note_added', 'stage_changed', 'tag_added', 'follow_up_scheduled'),
  contactMethod ENUM('email', 'phone', 'instagram', 'facebook', 'linkedin', 'twitter', 'website', 'in_person'),
  details JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leadId) REFERENCES leads(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_lead (leadId),
  INDEX idx_date (createdAt)
);

-- Add to leads table
ALTER TABLE leads ADD COLUMN lastContactedAt TIMESTAMP;
ALTER TABLE leads ADD COLUMN lastContactMethod VARCHAR(50);
ALTER TABLE leads ADD COLUMN nextFollowUpAt TIMESTAMP;
ALTER TABLE leads ADD COLUMN notes TEXT;
ALTER TABLE leads ADD COLUMN customFields JSON;
```

---

## Feature 4: Dopaminergic UI/UX

### Design Principles

**1. Trillion-Dollar Company Quality**
- Inspiration: Linear, Vercel, Stripe, Notion, Figma
- Every pixel matters
- Smooth, satisfying interactions
- Premium feel throughout

**2. Dopaminergic Design**
- Instant feedback on every action
- Satisfying animations and transitions
- Progress indicators that feel rewarding
- Celebration moments (confetti, success messages)
- Visual rewards for completing actions

**3. Accessibility First**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

### Visual Design System

**Color Palette** (Example - adjust based on brand):

```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;  /* Main brand color */
--primary-600: #2563eb;
--primary-900: #1e3a8a;

/* Success (Hot Leads) */
--success-500: #10b981;
--success-600: #059669;

/* Warning (Warm Leads) */
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Info (Cold Leads) */
--info-500: #06b6d4;
--info-600: #0891b2;

/* Neutral */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;

/* Gradients */
--gradient-hot: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
--gradient-warm: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
--gradient-cold: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
```

**Typography**:
- **Font Family**: Inter (primary), SF Pro (fallback), system-ui
- **Headings**: 600-700 weight, tight line-height (1.2)
- **Body**: 400-500 weight, comfortable line-height (1.6)
- **Scale**: 12px, 14px, 16px, 18px, 24px, 32px, 48px

**Spacing System** (8px grid):
- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px

**Shadows**:
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

**Border Radius**:
- Small: 6px (buttons, badges)
- Medium: 12px (cards, inputs)
- Large: 16px (modals, panels)
- Full: 9999px (pills, avatars)

### Animation Library

**IMPORTANT**: Use Framer Motion exclusively for ALL animations. NO custom CSS animations, NO custom JavaScript animations. Framer Motion is already installed and battle-tested.

**Framer Motion Variants**:

```typescript
// Card entrance animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // Stagger effect
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1], // Custom easing
    },
  }),
};

// Button press animation
const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

// Score count-up animation
const scoreVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

// Confetti trigger
import confetti from 'canvas-confetti';

const celebrateSuccess = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
  });
};
```

### Key Animations

**Implementation Rule**: ALL animations below MUST use Framer Motion `<motion.div>` components with variants. NO custom implementations.

**1. Lead Discovery Search**:
- Button: Pulsing glow effect (scale 1.0 → 1.05 → 1.0, repeat)
- Progress bar: Animated gradient moving left to right
- Status text: Fade in/out transitions
- Confetti: Explosion from center on completion

**2. Lead Cards**:
- Entrance: Fade in + slide up, staggered by 50ms
- Hover: Lift effect (translateY: -4px, shadow increase)
- Click: Scale down slightly (0.98), then expand to detail view

**3. Lead Score Badge**:
- Entrance: Spring animation (scale 0.5 → 1.0 with bounce)
- Count-up: Number animates from 0 to actual score over 1 second
- Hot lead: Pulsing glow effect (continuous)

**4. Pipeline Drag-and-Drop**:
- Pick up: Scale up slightly (1.05), add shadow
- Dragging: Follow cursor smoothly, rotate slightly
- Drop: Smooth transition to new position, scale back to 1.0
- Invalid drop: Shake animation, return to original position

**5. Contact Action**:
- Icon click: Scale down (0.9), then back (1.0)
- Toast notification: Slide in from top-right
- Badge update: Fade in new "Contacted" badge

**6. Modal Transitions**:
- Open: Backdrop fade in (0 → 0.5 opacity), modal scale up (0.95 → 1.0)
- Close: Reverse animation
- Duration: 200ms

### Loading States

**Implementation Rule**: Use shadcn/ui `<Skeleton>` component exclusively. NO custom skeleton implementations.

**Skeleton Screens** (instead of spinners):
- Lead card skeleton: Gray rectangles with shimmer animation
- Detail view skeleton: Full layout with animated placeholders
- Pipeline skeleton: Column headers + card skeletons

**Progress Indicators**:
- Linear progress bar: Animated gradient, percentage text
- Circular progress: Animated stroke, percentage in center
- Indeterminate: Pulsing dots or animated gradient

### Empty States

**Lead Discovery (No Results)**:
- Illustration: Magnifying glass with sad face
- Headline: "No leads found in this area"
- Subtext: "Try a different location or category"
- CTA: "Search again" button

**Pipeline (No Leads)**:
- Illustration: Empty Kanban board
- Headline: "Your pipeline is empty"
- Subtext: "Discover leads and add them here to start tracking"
- CTA: "Discover Leads" button

**Pro Intelligence (Not Enabled)**:
- Illustration: Lock icon with sparkles
- Headline: "Unlock Lead Intelligence"
- Subtext: "Get AI-powered insights and lead scoring"
- CTA: "Upgrade to Pro" button

### Error States

**API Error**:
- Icon: Alert triangle
- Headline: "Something went wrong"
- Subtext: "We couldn't complete your request. Please try again."
- CTA: "Try again" button
- Details: Collapsible error message (for debugging)

**No Internet**:
- Icon: WiFi off
- Headline: "No internet connection"
- Subtext: "Check your connection and try again"
- Auto-retry when connection restored

---

## Technical Architecture

### Frontend Development Philosophy

**Core Principle: Zero Custom Components**

To minimize bugs and maximize development speed, we follow a strict "use existing libraries only" approach. Every UI element, animation, and interaction should use battle-tested, production-ready components from established libraries.

**Why This Matters**:
- **Fewer Bugs**: Libraries are used by thousands of projects and have been debugged extensively
- **Faster Development**: No need to build and test custom components from scratch
- **Better UX**: Library components follow best practices for accessibility, keyboard navigation, and edge cases
- **Easier Maintenance**: Updates and bug fixes come from library maintainers
- **Consistent Behavior**: Components work predictably across browsers and devices

**Component Library Stack**:

| Need | Use This Library | Never Do This |
|------|------------------|---------------|
| Buttons, Inputs, Selects | shadcn/ui components | Custom button/input components |
| Cards, Modals, Dialogs | shadcn/ui components | Custom overlay/modal logic |
| Forms & Validation | React Hook Form + Zod | Custom form state management |
| Animations & Transitions | Framer Motion | Custom CSS animations or JS tweens |
| Icons | Lucide React | Custom SVG icons or icon fonts |
| Drag-and-Drop | @dnd-kit | Custom drag logic with mouse events |
| Charts & Graphs | Recharts | Custom canvas/SVG chart rendering |
| Confetti Effects | canvas-confetti | Custom particle systems |
| Toasts/Notifications | Sonner (via shadcn/ui) | Custom notification systems |
| Loading States | shadcn/ui Skeleton | Custom skeleton components |
| Date Pickers | shadcn/ui Calendar | Custom date picker logic |
| Tooltips | shadcn/ui Tooltip | Custom hover/positioning logic |
| Dropdowns | shadcn/ui DropdownMenu | Custom dropdown positioning |
| Tabs | shadcn/ui Tabs | Custom tab switching logic |
| Progress Bars | shadcn/ui Progress | Custom progress bar components |
| Badges | shadcn/ui Badge | Custom badge components |
| Avatars | shadcn/ui Avatar | Custom avatar components |

**Available shadcn/ui Components** (Already Installed):

```typescript
// Layout & Structure
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Forms & Inputs
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Overlays & Modals
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Feedback & Status
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"; // For toast notifications

// Navigation & Organization
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Data Display
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
```

**Implementation Rules**:

1. **Always use shadcn/ui components as base** - Never create custom button, input, card, or modal components
2. **Style with Tailwind only** - Use className prop to customize appearance, never custom CSS files
3. **Wrap with Framer Motion for animations** - Use `<motion.div>` wrapper around shadcn components, never custom animation logic
4. **Use Lucide React for icons** - Import from "lucide-react", never create custom SVG icons
5. **Use React Hook Form for forms** - Never manage form state manually with useState
6. **Use @dnd-kit for drag-and-drop** - Never implement custom drag logic with mouse events
7. **Use canvas-confetti for celebrations** - Never create custom particle effects
8. **Use Recharts for charts** - Never render custom SVG/canvas charts

**Example: Lead Card Component** (Correct Approach):

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Phone, Globe, Instagram } from "lucide-react";

function LeadCard({ lead, index }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{lead.businessName}</CardTitle>
            <Badge variant="secondary">{lead.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={`mailto:${lead.email}`}>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={`tel:${lead.phone}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={lead.website} target="_blank">
                <Globe className="h-4 w-4" />
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={lead.instagram} target="_blank">
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

**What NOT to Do** (Anti-Pattern):

```tsx
// ❌ NEVER DO THIS - Custom button component
function CustomButton({ children, onClick }) {
  return (
    <button 
      className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ❌ NEVER DO THIS - Custom card component
function CustomCard({ title, children }) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <h3 className="font-bold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// ❌ NEVER DO THIS - Custom animation logic
function CustomAnimation({ children }) {
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div style={{ opacity, transition: 'opacity 0.3s' }}>
      {children}
    </div>
  );
}
```

### Tech Stack

**Frontend**:
- **Framework**: React 19 + TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: shadcn/ui (Radix UI primitives) - **USE EXCLUSIVELY, NO CUSTOM COMPONENTS**
- **Animation**: Framer Motion - **USE EXCLUSIVELY FOR ALL ANIMATIONS**
- **Icons**: Lucide React - **USE EXCLUSIVELY FOR ALL ICONS**
- **Forms**: React Hook Form + Zod - **USE EXCLUSIVELY FOR ALL FORMS**
- **Drag-and-Drop**: @dnd-kit - **USE FOR PIPELINE DRAG-AND-DROP**
- **Confetti**: canvas-confetti - **USE FOR CELEBRATION ANIMATIONS**
- **Charts**: Recharts - **USE FOR ANALYTICS VISUALIZATIONS**
- **State Management**: TanStack Query (via tRPC)
- **Routing**: Wouter

**Component Strategy**: Use battle-tested libraries exclusively to minimize bugs. NO custom component implementations from scratch.

**Backend**:
- **Framework**: Express 4 + tRPC 11
- **Database**: MySQL/TiDB (Drizzle ORM)
- **Authentication**: Manus OAuth
- **API Integration**: Apify Client SDK
- **AI/LLM**: Built-in invokeLLM helper
- **File Storage**: S3 (built-in storagePut helper)

**Infrastructure**:
- **Hosting**: Manus platform (auto-scaling)
- **Database**: TiDB Serverless (auto-scaling)
- **CDN**: Cloudflare (automatic)
- **Monitoring**: Built-in analytics

### Data Flow

**Lead Discovery Flow**:
```
User Input (category, location)
  ↓
Frontend: LeadDiscovery.tsx
  ↓
tRPC: leads.search()
  ↓
Check searchCache table
  ├─ Cache Hit (< 60 days) → Return cached leads (randomized)
  └─ Cache Miss → Call Apify Google Maps Scraper
      ↓
    Parse results, save to database
      ↓
    Return leads to frontend
      ↓
    Display with animations
```

**Lead Enrichment Flow** (Pro):
```
User enables Pro Intelligence
  ↓
Frontend: Toggle Pro switch
  ↓
tRPC: leads.bulkEnrich(leadIds)
  ↓
For each lead (parallel):
  ├─ Call Apify Tech Stack Detector
  ├─ Call Apify Job Scrapers
  ├─ Call Google PageSpeed API
  ├─ Call WHOIS API
  ↓
Calculate lead score
  ↓
Generate AI insights (invokeLLM)
  ↓
Save to database (technologyStack, leadScore, etc.)
  ↓
Return enriched leads to frontend
  ↓
Display intelligence with animations
```

### Database Schema

**Core Tables**:

```sql
-- Users (from template)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  role ENUM('user', 'admin') DEFAULT 'user',
  subscriptionTier ENUM('free', 'pro', 'agency', 'enterprise') DEFAULT 'free',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leads
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  
  -- Basic Info (from Google Maps)
  businessName VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  address TEXT,
  city VARCHAR(255),
  state VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(320),
  website VARCHAR(500),
  
  -- Social Media
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  linkedin VARCHAR(255),
  twitter VARCHAR(255),
  
  -- Google Data
  googleRating DECIMAL(2,1),
  googleReviewCount INT,
  businessHours JSON,
  photos JSON,
  
  -- Lead Intelligence (Pro)
  technologyStack JSON,
  leadScore INT DEFAULT 0,
  scoreBreakdown JSON,
  opportunities JSON,
  growthSignals JSON,
  lastEnrichedAt TIMESTAMP,
  enrichmentStatus ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  
  -- CRM Fields
  stage ENUM('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost') DEFAULT 'new',
  tags JSON,
  notes TEXT,
  customFields JSON,
  lastContactedAt TIMESTAMP,
  lastContactMethod VARCHAR(50),
  nextFollowUpAt TIMESTAMP,
  
  -- Metadata
  source VARCHAR(100) DEFAULT 'google_maps',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_user (userId),
  INDEX idx_score (leadScore),
  INDEX idx_stage (stage),
  INDEX idx_follow_up (nextFollowUpAt)
);

-- Search Cache
CREATE TABLE searchCache (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  filters JSON,
  scrapedAt TIMESTAMP NOT NULL,
  lastServedAt TIMESTAMP,
  serveCount INT DEFAULT 0,
  leadCount INT NOT NULL,
  leadIds JSON NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_search (category, location),
  INDEX idx_age (scrapedAt)
);

-- Lead Activities
CREATE TABLE leadActivities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  leadId INT NOT NULL,
  userId INT NOT NULL,
  activityType ENUM('contacted', 'note_added', 'stage_changed', 'tag_added', 'follow_up_scheduled', 'enriched'),
  contactMethod ENUM('email', 'phone', 'instagram', 'facebook', 'linkedin', 'twitter', 'website', 'in_person'),
  details JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leadId) REFERENCES leads(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_lead (leadId),
  INDEX idx_date (createdAt)
);

-- Scraping Jobs (for tracking Apify runs)
CREATE TABLE scrapingJobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  jobType ENUM('google_maps', 'tech_stack', 'job_postings'),
  status ENUM('pending', 'running', 'completed', 'failed'),
  apifyRunId VARCHAR(255),
  input JSON,
  output JSON,
  error TEXT,
  creditsUsed DECIMAL(10,4),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completedAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_user (userId),
  INDEX idx_status (status)
);
```

### API Integration Details

**Apify Actors**:

1. **Google Maps Scraper** (`dtrungtin/google-maps-scraper`)
   - Input: `{ searchQuery: "plumbers in Miami, FL", maxCrawledPlaces: 500 }`
   - Output: Array of business objects
   - Cost: ~$0.10-0.50 per search
   - Run time: 1-5 minutes

2. **Tech Stack Detector** (`benthepythondev/website-tech-detector`)
   - Input: `{ url: "https://example.com" }`
   - Output: Array of detected technologies
   - Cost: ~$0.01-0.05 per website
   - Run time: 5-15 seconds

3. **Upwork Job Scraper** (`neatrat/upwork-job-scraper`)
   - Input: `{ searchQuery: "marketing agency", country: "United States" }`
   - Output: Array of job postings
   - Cost: ~$0.05-0.10 per search
   - Run time: 1-3 minutes

4. **Indeed Scraper** (`misceres/indeed-scraper`)
   - Input: `{ position: "marketing manager", location: "Miami" }`
   - Output: Array of job postings
   - Cost: ~$0.05-0.10 per search
   - Run time: 1-3 minutes

**Google APIs**:

1. **PageSpeed Insights API**
   - Endpoint: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
   - Free tier: 25,000 requests/day
   - Returns: Performance score, mobile-friendly status, Core Web Vitals

2. **Mobile-Friendly Test API**
   - Endpoint: `https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run`
   - Free tier: 400 requests/day
   - Returns: Mobile-friendly status, issues

**WHOIS APIs**:
- **WhoisXML API**: $0.001 per lookup, 500 free/month
- **RDAP Protocol**: Free, but rate-limited
- Returns: Domain registration date, expiration, registrar

### Security & Privacy

**Data Protection**:
- All API keys stored in environment variables (never in code)
- Database credentials encrypted at rest
- HTTPS/TLS for all connections
- No sensitive data logged

**User Data**:
- Users own their leads (not shared between accounts)
- Leads can be exported and deleted (GDPR compliance)
- No selling of user data
- Clear privacy policy

**Rate Limiting**:
- Free tier: 100 leads/month, 10 searches/day
- Pro tier: 1,000 leads/month, 50 searches/day
- Agency tier: 5,000 leads/month, 200 searches/day
- Enterprise: Custom limits

**API Key Management**:
- Apify API key: Stored in `APIFY_API_TOKEN` env var
- Requested via `webdev_request_secrets` tool
- Never exposed to frontend
- Rotated regularly

---

## Pricing & Monetization

### Pricing Tiers

| Feature | Free | Pro | Agency | Enterprise |
|---------|------|-----|--------|------------|
| **Price** | $0 | **$149/mo** | **$299/mo** | **Custom** |
| **Lead Discovery** | 100/mo | 1,000/mo | 5,000/mo | Unlimited |
| **Search Limit** | 10/day | 50/day | 200/day | Unlimited |
| **Contact Info** | ✅ | ✅ | ✅ | ✅ |
| **One-Click Contact** | ✅ | ✅ | ✅ | ✅ |
| **CRM Pipeline** | ✅ | ✅ | ✅ | ✅ |
| **Lead Intelligence** | ❌ | ✅ | ✅ | ✅ |
| **Tech Gap Analysis** | ❌ | ✅ | ✅ | ✅ |
| **Growth Signals** | ❌ | ✅ | ✅ | ✅ |
| **AI Insights** | ❌ | ✅ | ✅ | ✅ |
| **Job Posting Detection** | ❌ | ✅ | ✅ | ✅ |
| **Team Collaboration** | ❌ | ❌ | ✅ (5 users) | ✅ (Unlimited) |
| **API Access** | ❌ | ❌ | ✅ | ✅ |
| **Custom Scoring Rules** | ❌ | ❌ | ❌ | ✅ |
| **Funding Intelligence** | ❌ | ❌ | ❌ | ✅ |
| **White-Label** | ❌ | ❌ | ❌ | ✅ |
| **Dedicated Support** | ❌ | Email | Priority | Account Manager |

### Pricing Strategy

**Free Tier** (Lead Magnet):
- **Goal**: Acquire users, demonstrate value
- **Limits**: Generous enough to be useful, restrictive enough to encourage upgrade
- **Conversion Funnel**: Show "Upgrade to Pro" prompts when intelligence would help

**Pro Tier** ($149/month):
- **Target**: Solo consultants, small agencies (1-2 people)
- **Value Prop**: "Know which leads will close before you call"
- **ROI**: If they close 1 extra deal/month from better targeting = $5K+ revenue
- **Margin**: ~70-80% (API costs ~$30-50/month per user)

**Agency Tier** ($299/month):
- **Target**: Growing agencies (3-10 people)
- **Value Prop**: "Arm your entire team with lead intelligence"
- **ROI**: Team of 5 closes 5 extra deals/month = $25K+ revenue
- **Margin**: ~75-85% (API costs ~$50-75/month per account)

**Enterprise Tier** (Custom):
- **Target**: Large agencies (50+ people), lead gen companies
- **Value Prop**: "White-label our platform for your clients"
- **Pricing**: $999-2,999/month (based on volume)
- **Margin**: ~80-90% (economies of scale)

### Unit Economics

**Assumptions**:
- Average Pro user: 500 leads/month enriched
- Average Agency user: 2,000 leads/month enriched (5 users)
- Cache hit rate: 60% (after 3 months)

**Costs Per User** (Pro Tier):

| Item | Cost/Month | Notes |
|------|------------|-------|
| Google Maps scraping | $5-15 | 20 searches × $0.25-0.75 (with caching) |
| Tech stack detection | $10-25 | 500 websites × $0.02-0.05 |
| Job posting scraping | $5-10 | 100 companies × $0.05-0.10 |
| PageSpeed API | $0 | Free tier sufficient |
| WHOIS lookups | $0.50 | 500 lookups × $0.001 |
| LLM (AI insights) | $5-10 | 500 prompts × $0.01-0.02 |
| Infrastructure | $5 | Database, hosting, CDN |
| **Total** | **$30-65** | **Average: $47.50** |

**Gross Margin**: $149 - $47.50 = **$101.50 (68%)**

**Break-Even**: ~1.5 months (accounting for customer acquisition cost)

**LTV:CAC Ratio**: Assuming 12-month retention, $149 × 12 = $1,788 LTV  
If CAC = $300 (paid ads), LTV:CAC = **5.96:1** (excellent)

### Revenue Projections

**Year 1 Goals**:

| Month | Free Users | Pro Users | Agency Users | MRR | ARR |
|-------|------------|-----------|--------------|-----|-----|
| Month 3 | 100 | 10 | 2 | $2,088 | $25,056 |
| Month 6 | 500 | 50 | 10 | $10,440 | $125,280 |
| Month 12 | 2,000 | 200 | 50 | $44,750 | $537,000 |

**Year 2 Goals**:
- 10,000 free users
- 1,000 Pro users ($149K MRR)
- 250 Agency users ($74.75K MRR)
- 10 Enterprise users ($20K MRR)
- **Total MRR**: $243.75K
- **Total ARR**: $2.925M

**Path to $20M Exit**:
- **Year 3 ARR**: $5-7M (3-4x revenue multiple = $15-28M valuation)
- **Year 4 ARR**: $10-15M (2-3x revenue multiple = $20-45M valuation)
- **Acquisition targets**: HubSpot, Salesforce, ZoomInfo, Apollo

---

## Success Metrics

### North Star Metric

**"Number of deals closed by users from LeadFlow Pro leads"**

This metric directly measures the value we deliver. If users are closing deals, they'll stay subscribed and refer others.

### Key Performance Indicators (KPIs)

**Product Metrics**:
- **Lead Discovery**: Searches per user per month (target: 20+)
- **Lead Quality**: Average lead score (target: 65+)
- **Enrichment Rate**: % of leads enriched with Pro (target: 80%+)
- **Cache Hit Rate**: % of searches served from cache (target: 60%+)
- **Contact Rate**: % of leads contacted within 7 days (target: 40%+)

**Business Metrics**:
- **Monthly Recurring Revenue (MRR)**: Target growth: 15-20%/month
- **Customer Acquisition Cost (CAC)**: Target: <$300
- **Lifetime Value (LTV)**: Target: >$1,500 (10+ months retention)
- **LTV:CAC Ratio**: Target: >3:1
- **Churn Rate**: Target: <5%/month
- **Net Revenue Retention**: Target: >110% (expansion revenue)

**User Engagement**:
- **Daily Active Users (DAU)**: Target: 30% of paid users
- **Weekly Active Users (WAU)**: Target: 70% of paid users
- **Time in App**: Target: 30+ minutes/session
- **Leads Added to Pipeline**: Target: 50+ per user per month
- **Pro Feature Usage**: Target: 80% of Pro users use intelligence weekly

**User Satisfaction**:
- **Net Promoter Score (NPS)**: Target: 50+
- **Customer Satisfaction (CSAT)**: Target: 4.5+/5
- **Feature Satisfaction**: Target: 4.0+/5 for all core features

### Analytics Implementation

**Track Key Events**:
- `lead_search_started` (category, location)
- `lead_search_completed` (result_count, cache_hit)
- `lead_viewed` (lead_id, score)
- `lead_contacted` (lead_id, method)
- `lead_added_to_pipeline` (lead_id, stage)
- `lead_stage_changed` (lead_id, from_stage, to_stage)
- `pro_intelligence_enabled`
- `lead_enriched` (lead_id, score)
- `subscription_upgraded` (from_tier, to_tier)

**Cohort Analysis**:
- Retention by signup month
- Feature adoption by cohort
- Revenue expansion by cohort

**Funnel Analysis**:
1. Sign up → 2. First search → 3. Add to pipeline → 4. Contact lead → 5. Upgrade to Pro → 6. Close deal

---

## Development Roadmap

### Phase 1: MVP (Weeks 1-2)

**Week 1: Basic Lead Discovery**
- [ ] Set up project structure (already done)
- [ ] Integrate Apify Google Maps Scraper
- [ ] Build lead discovery UI with search form
- [ ] Implement dopaminergic search animations
- [ ] Display lead results in card grid
- [ ] Implement expandable lead detail view
- [ ] Add one-click contact actions (mailto, tel, social links)
- [ ] Implement smart caching strategy
- [ ] Test with real searches

**Week 2: CRM Pipeline**
- [ ] Build Kanban pipeline view
- [ ] Implement drag-and-drop between stages
- [ ] Add contact tracking (contacted via X)
- [ ] Add follow-up scheduling
- [ ] Build activity timeline
- [ ] Implement bulk actions
- [ ] Add filtering and search
- [ ] Test full workflow

**Deliverable**: Working MVP with lead discovery + CRM pipeline

---

### Phase 2: Pro Intelligence (Weeks 3-4)

**Week 3: Technology Detection**
- [ ] Integrate Apify Tech Stack Detector
- [ ] Implement lead enrichment backend logic
- [ ] Build scoring algorithm (0-100)
- [ ] Calculate opportunity values
- [ ] Store enrichment data in database
- [ ] Test accuracy with sample websites

**Week 4: Intelligence UI + AI Insights**
- [ ] Add Pro toggle switch
- [ ] Display lead score badges
- [ ] Show "Why they'll close" insights
- [ ] Display opportunity breakdown
- [ ] Integrate job posting detection
- [ ] Generate AI-powered pitch recommendations
- [ ] Add growth signals display
- [ ] Polish animations and transitions

**Deliverable**: Full Pro tier with lead intelligence

---

### Phase 3: Polish & Launch (Week 5)

**Week 5: Design Polish + Testing**
- [ ] Trillion-dollar design pass (typography, spacing, colors)
- [ ] Refine all animations and micro-interactions
- [ ] Add loading skeletons everywhere
- [ ] Implement empty states and error states
- [ ] Mobile responsiveness pass
- [ ] Write comprehensive vitest tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Create user documentation
- [ ] Final QA and bug fixes

**Deliverable**: Production-ready v1.0

---

### Phase 4: Post-Launch (Weeks 6-8)

**Week 6: User Feedback + Iteration**
- [ ] Monitor analytics and user behavior
- [ ] Collect user feedback (surveys, interviews)
- [ ] Fix critical bugs
- [ ] Optimize slow queries
- [ ] Improve cache hit rate

**Week 7: Agency Tier Features**
- [ ] Team collaboration (multi-user accounts)
- [ ] Role-based permissions
- [ ] Team activity feed
- [ ] Lead assignment
- [ ] API access (REST API for integrations)

**Week 8: Growth Features**
- [ ] Referral program
- [ ] Email templates for outreach
- [ ] CSV import/export
- [ ] Zapier integration
- [ ] Chrome extension (quick lead capture)

---

### Phase 5: v2.0 - Enterprise Tier (Months 3-6)

**Funding Intelligence**:
- [ ] Integrate Crunchbase API
- [ ] Detect recently funded companies
- [ ] Add "Recently Funded" filter
- [ ] Boost lead scores for funded companies
- [ ] Generate funding-specific pitch angles

**Advanced Features**:
- [ ] Custom scoring rules (user-defined weights)
- [ ] Automated follow-up sequences
- [ ] Email integration (Gmail, Outlook)
- [ ] Advanced analytics dashboard
- [ ] Predictive lead scoring (ML model)
- [ ] White-label option for agencies

**Integrations**:
- [ ] HubSpot CRM sync
- [ ] Salesforce integration
- [ ] Slack notifications
- [ ] Webhooks for custom integrations

---

## Future Enhancements

### v3.0 Ideas (Year 2)

**AI-Powered Outreach**:
- Generate personalized email templates
- A/B test subject lines
- Optimal send time prediction
- Automated follow-up sequences

**Competitive Intelligence**:
- Track competitors' technology changes
- Alert when competitor loses a tool (opportunity)
- Benchmark against industry averages

**Intent Signals**:
- Monitor website changes (redesigns, new pages)
- Track social media activity
- Detect funding announcements
- Alert on trigger events

**Mobile Apps**:
- iOS app for on-the-go lead management
- Android app
- Push notifications for hot leads

**Marketplace**:
- Pre-built lead lists (e.g., "1000 e-commerce stores in CA without CRM")
- User-generated lead lists
- Revenue share model

---

## Appendix

### Competitive Analysis

**Direct Competitors**:

1. **Apollo.io**
   - Strengths: Large database (275M contacts), email sequences
   - Weaknesses: No technology gap analysis, no lead scoring, expensive ($49-149/user/mo)
   - Differentiation: We provide buying intelligence, not just contact info

2. **ZoomInfo**
   - Strengths: Comprehensive B2B data, intent signals
   - Weaknesses: Very expensive ($15K+/year), complex, overkill for small agencies
   - Differentiation: We're affordable, simple, agency-focused

3. **BuiltWith**
   - Strengths: Technology detection, lead lists by technology
   - Weaknesses: No CRM, no scoring, no growth signals, just raw data
   - Differentiation: We turn technology data into actionable insights

4. **Hunter.io**
   - Strengths: Email finding, verification
   - Weaknesses: No lead intelligence, no CRM, single-purpose tool
   - Differentiation: We're an all-in-one platform

**Indirect Competitors**:
- Google Maps (free but no intelligence)
- LinkedIn Sales Navigator (expensive, no technology detection)
- Clearbit (enrichment only, no discovery)

**Our Competitive Advantages**:
1. **Unified Platform**: Discovery + Intelligence + CRM in one place
2. **Agency-Specific**: Built for agencies, not generic sales teams
3. **Affordable**: $149/mo vs $15K/year for enterprise tools
4. **Dopaminergic UX**: Users actually enjoy using it daily
5. **Smart Caching**: Lower costs = better margins = sustainable pricing

---

### Technical Risks & Mitigation

**Risk 1: Apify API Changes**
- **Impact**: High (core dependency)
- **Probability**: Low (stable platform)
- **Mitigation**: 
  - Abstract Apify calls behind our own API layer
  - Monitor Apify changelog
  - Have backup scrapers ready (Bright Data, ScrapingBee)

**Risk 2: Google Maps Blocking**
- **Impact**: High (primary data source)
- **Probability**: Medium (scraping is against TOS)
- **Mitigation**:
  - Use Apify's rotating proxies (built-in)
  - Rate limit requests
  - Cache aggressively (60-day cache)
  - Have alternative data sources (Yelp, Yellow Pages)

**Risk 3: Technology Detection Accuracy**
- **Impact**: Medium (affects lead scoring)
- **Probability**: Medium (some tools hard to detect)
- **Mitigation**:
  - Use multiple detection methods (Wappalyzer + BuiltWith)
  - Allow users to manually correct detected tech
  - Continuously improve detection rules
  - Show confidence scores

**Risk 4: High API Costs**
- **Impact**: High (affects margins)
- **Probability**: Medium (if cache doesn't work well)
- **Mitigation**:
  - Aggressive caching (60-day TTL)
  - Batch enrichment (process multiple leads together)
  - Tiered pricing (pass costs to heavy users)
  - Monitor usage closely

**Risk 5: User Privacy Concerns**
- **Impact**: Medium (could affect growth)
- **Probability**: Low (B2B data is public)
- **Mitigation**:
  - Clear privacy policy
  - GDPR compliance (data export, deletion)
  - No selling of user data
  - Transparent about data sources

---

### User Stories

**Story 1: Solo Marketing Consultant**
> "As a solo marketing consultant, I want to find local businesses without CRM systems so I can pitch my CRM implementation services."

**Acceptance Criteria**:
- Search for businesses by category and location
- See which businesses don't have a CRM
- Get contact information (email, phone, social)
- Save promising leads to pipeline
- Track which leads I've contacted

---

**Story 2: Agency Owner**
> "As an agency owner, I want to know which leads are most likely to close so my team focuses on the right prospects."

**Acceptance Criteria**:
- See lead scores (0-100) for all discovered leads
- Understand why each lead scored high/low
- Sort leads by score (hot leads first)
- See specific technology gaps and opportunity values
- Share hot leads with my team

---

**Story 3: SDR (Sales Development Rep)**
> "As an SDR, I want to quickly contact leads without switching between tools so I can reach more prospects per day."

**Acceptance Criteria**:
- Click email → opens my email client with pre-filled address
- Click phone → opens my phone dialer
- Click Instagram → opens their profile in new tab
- After contacting, lead is automatically marked as "contacted"
- Move to next lead without friction

---

**Story 4: Agency Team Lead**
> "As a team lead, I want to track my team's outreach activity so I know who's working on what."

**Acceptance Criteria**:
- See which team member contacted which lead
- View activity timeline for each lead
- Assign leads to specific team members
- Get notified when leads move to "Qualified" stage
- Generate team performance reports

---

### Glossary

**Terms**:

- **Lead**: A business that matches search criteria and could be a potential customer
- **Lead Score**: A 0-100 rating indicating probability of closing, based on technology gaps, growth signals, and budget indicators
- **Technology Gap**: A missing tool or outdated technology that represents a sales opportunity
- **Growth Signal**: An indicator that a business is expanding (e.g., job postings, website redesign)
- **Hot Lead**: A lead with score 80-100, indicating high probability of closing
- **Warm Lead**: A lead with score 60-79, indicating moderate probability
- **Cold Lead**: A lead with score 40-59, indicating low probability
- **Enrichment**: The process of analyzing a lead's website to detect technology stack and calculate score
- **Cache Hit**: When a search result is served from database instead of scraping (saves API costs)
- **Dopaminergic**: Design that triggers dopamine release through satisfying animations and instant gratification
- **One-Click Contact**: Ability to contact a lead (email, phone, social) with a single click

---

## Conclusion

LeadFlow Pro is positioned to become the indispensable lead generation and intelligence platform for agencies. By combining beautiful UX with powerful AI-driven insights, we solve the fundamental problem agencies face: **knowing which leads to prioritize**.

**Key Success Factors**:
1. **Dopaminergic UX**: Users love using it daily
2. **Actionable Intelligence**: Not just data, but "why they'll buy"
3. **Smart Caching**: Sustainable unit economics
4. **Agency-Specific**: Built for their workflow
5. **Affordable**: 10x cheaper than enterprise alternatives

**Path to $20M**:
- Year 1: Prove product-market fit, reach $500K ARR
- Year 2: Scale to $3-5M ARR with Pro/Agency tiers
- Year 3: Add Enterprise tier, reach $10-15M ARR
- Year 4: Acquisition by HubSpot, Salesforce, or ZoomInfo at 2-3x revenue multiple

**Next Steps**:
1. Build MVP (Weeks 1-2)
2. Launch Pro tier (Weeks 3-4)
3. Polish and ship v1.0 (Week 5)
4. Iterate based on user feedback (Weeks 6-8)
5. Scale to $20M exit (Years 2-4)

---

**Document Version**: 1.0  
**Last Updated**: December 2, 2025  
**Status**: Ready for Development ✅
