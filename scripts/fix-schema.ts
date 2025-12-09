import 'dotenv/config'
import mysql from 'mysql2/promise'

async function fixSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '4000'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? {} : undefined,
  })

  try {
    // Drop all tables to start fresh
    const tables = [
      'job_postings_cache',
      'scraping_jobs',
      'lead_activities',
      'search_cache',
      'leads',
      'users',
    ]

    for (const table of tables) {
      await connection.execute(`DROP TABLE IF EXISTS \`${table}\``)
      console.log(`Dropped ${table}`)
    }

    console.log('All tables dropped - run drizzle-kit push to recreate')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await connection.end()
  }
}

fixSchema()
