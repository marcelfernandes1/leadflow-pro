/**
 * Script to add enrichment_cache table to the database
 * Run with: npx tsx scripts/add-enrichment-cache.ts
 */
import { db } from '../server/db/index.js'
import { sql } from 'drizzle-orm'

async function createEnrichmentCacheTable() {
  console.log('Creating enrichment_cache table...')

  try {
    // Create the table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS enrichment_cache (
        id int AUTO_INCREMENT NOT NULL,
        website_key varchar(500) NOT NULL,
        original_url varchar(500) NOT NULL,
        technologies json,
        tech_summary json,
        gap_analysis json,
        website_analysis json,
        domain_info json,
        social_metrics json,
        lead_score int,
        score_breakdown json,
        opportunities json,
        analysis_status enum('pending','processing','completed','failed') DEFAULT 'pending',
        error_message text,
        analyzed_at timestamp,
        expires_at timestamp NOT NULL,
        hit_count int DEFAULT 0,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY enrichment_cache_website_key_unique (website_key)
      )
    `)

    console.log('Table created successfully!')

    // Add indexes
    try {
      await db.execute(sql`CREATE INDEX idx_ec_website_key ON enrichment_cache (website_key)`)
      console.log('Index idx_ec_website_key created')
    } catch (e: any) {
      if (e.code !== 'ER_DUP_KEYNAME') throw e
      console.log('Index idx_ec_website_key already exists')
    }

    try {
      await db.execute(sql`CREATE INDEX idx_ec_status ON enrichment_cache (analysis_status)`)
      console.log('Index idx_ec_status created')
    } catch (e: any) {
      if (e.code !== 'ER_DUP_KEYNAME') throw e
      console.log('Index idx_ec_status already exists')
    }

    try {
      await db.execute(sql`CREATE INDEX idx_ec_expires ON enrichment_cache (expires_at)`)
      console.log('Index idx_ec_expires created')
    } catch (e: any) {
      if (e.code !== 'ER_DUP_KEYNAME') throw e
      console.log('Index idx_ec_expires already exists')
    }

    console.log('\nEnrichment cache table setup complete!')
    process.exit(0)
  } catch (error: any) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('Table already exists!')
      process.exit(0)
    }
    console.error('Error creating table:', error)
    process.exit(1)
  }
}

createEnrichmentCacheTable()
