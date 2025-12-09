import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  decimal,
  json,
  mysqlEnum,
  index,
} from 'drizzle-orm/mysql-core'

// Users table
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 320 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['user', 'admin']).default('user'),
  subscriptionTier: mysqlEnum('subscription_tier', [
    'free',
    'pro',
    'agency',
    'enterprise',
  ]).default('free'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

// Leads table
export const leads = mysqlTable(
  'leads',
  {
    id: int('id').primaryKey().autoincrement(),
    userId: int('user_id').notNull(),

    // Basic Info (from Google Maps)
    businessName: varchar('business_name', { length: 255 }).notNull(),
    category: varchar('category', { length: 255 }),
    address: text('address'),
    city: varchar('city', { length: 255 }),
    state: varchar('state', { length: 100 }),
    zip: varchar('zip', { length: 20 }),
    country: varchar('country', { length: 100 }),
    phone: varchar('phone', { length: 50 }),
    email: varchar('email', { length: 320 }),
    website: varchar('website', { length: 500 }),

    // Social Media
    instagram: varchar('instagram', { length: 255 }),
    facebook: varchar('facebook', { length: 255 }),
    linkedin: varchar('linkedin', { length: 255 }),
    twitter: varchar('twitter', { length: 255 }),
    tiktok: varchar('tiktok', { length: 255 }),
    youtube: varchar('youtube', { length: 255 }),

    // Email Verification
    emailVerified: int('email_verified'), // 0 or 1 (boolean)
    emailVerificationScore: int('email_verification_score'), // 0-100
    emailVerificationStatus: varchar('email_verification_status', { length: 20 }), // valid, invalid, catchall, unknown

    // Social Metrics (stored as JSON)
    socialMetrics: json('social_metrics'), // All platform metrics

    // Google Data
    googleRating: decimal('google_rating', { precision: 2, scale: 1 }),
    googleReviewCount: int('google_review_count'),
    businessHours: json('business_hours'),
    photos: json('photos'),

    // Lead Intelligence (Pro)
    technologyStack: json('technology_stack'),
    leadScore: int('lead_score').default(0),
    scoreBreakdown: json('score_breakdown'),
    opportunities: json('opportunities'),
    growthSignals: json('growth_signals'),
    lastEnrichedAt: timestamp('last_enriched_at'),
    enrichmentStatus: mysqlEnum('enrichment_status', [
      'pending',
      'processing',
      'completed',
      'failed',
    ]).default('pending'),

    // CRM Fields
    stage: mysqlEnum('stage', [
      'new',
      'contacted',
      'qualified',
      'proposal',
      'negotiation',
      'won',
      'lost',
    ]).default('new'),
    tags: json('tags'),
    notes: text('notes'),
    customFields: json('custom_fields'),
    lastContactedAt: timestamp('last_contacted_at'),
    lastContactMethod: varchar('last_contact_method', { length: 50 }),
    nextFollowUpAt: timestamp('next_follow_up_at'),

    // Metadata
    source: varchar('source', { length: 100 }).default('google_maps'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdx: index('idx_user').on(table.userId),
    scoreIdx: index('idx_score').on(table.leadScore),
    stageIdx: index('idx_stage').on(table.stage),
    followUpIdx: index('idx_follow_up').on(table.nextFollowUpAt),
  })
)

// Search Cache table
export const searchCache = mysqlTable(
  'search_cache',
  {
    id: int('id').primaryKey().autoincrement(),
    category: varchar('category', { length: 255 }).notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    filters: json('filters'),
    scrapedAt: timestamp('scraped_at').notNull(),
    lastServedAt: timestamp('last_served_at'),
    serveCount: int('serve_count').default(0),
    leadCount: int('lead_count').notNull(),
    leadIds: json('lead_ids').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    searchIdx: index('idx_search').on(table.category, table.location),
    ageIdx: index('idx_age').on(table.scrapedAt),
  })
)

// Lead Activities table
export const leadActivities = mysqlTable(
  'lead_activities',
  {
    id: int('id').primaryKey().autoincrement(),
    leadId: int('lead_id').notNull(),
    userId: int('user_id').notNull(),
    activityType: mysqlEnum('activity_type', [
      'contacted',
      'note_added',
      'stage_changed',
      'tag_added',
      'follow_up_scheduled',
      'enriched',
    ]).notNull(),
    contactMethod: mysqlEnum('contact_method', [
      'email',
      'phone',
      'instagram',
      'facebook',
      'linkedin',
      'twitter',
      'website',
      'in_person',
    ]),
    details: json('details'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    leadIdx: index('idx_lead').on(table.leadId),
    dateIdx: index('idx_date').on(table.createdAt),
  })
)

// Scraping Jobs table (for tracking Apify runs)
export const scrapingJobs = mysqlTable(
  'scraping_jobs',
  {
    id: int('id').primaryKey().autoincrement(),
    userId: int('user_id').notNull(),
    jobType: mysqlEnum('job_type', [
      'google_maps',
      'tech_stack',
      'job_postings',
    ]).notNull(),
    status: mysqlEnum('status', [
      'pending',
      'running',
      'completed',
      'failed',
    ]).default('pending'),
    apifyRunId: varchar('apify_run_id', { length: 255 }),
    input: json('input'),
    output: json('output'),
    error: text('error'),
    creditsUsed: decimal('credits_used', { precision: 10, scale: 4 }),
    createdAt: timestamp('created_at').defaultNow(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    userIdx: index('idx_user').on(table.userId),
    statusIdx: index('idx_status').on(table.status),
  })
)

// Job Postings Cache table
export const jobPostingsCache = mysqlTable(
  'job_postings_cache',
  {
    id: int('id').primaryKey().autoincrement(),
    companyName: varchar('company_name', { length: 255 }).notNull(),
    jobPostings: json('job_postings').notNull(), // Array of JobPosting
    scrapedAt: timestamp('scraped_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(), // 60 days from scraped_at
    source: varchar('source', { length: 50 }).default('indeed+upwork'), // which sources were scraped
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    companyIdx: index('idx_company').on(table.companyName),
    expiresIdx: index('idx_expires').on(table.expiresAt),
  })
)

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
export type SearchCache = typeof searchCache.$inferSelect
export type LeadActivity = typeof leadActivities.$inferSelect
export type ScrapingJob = typeof scrapingJobs.$inferSelect
export type JobPostingsCache = typeof jobPostingsCache.$inferSelect
export type NewJobPostingsCache = typeof jobPostingsCache.$inferInsert
