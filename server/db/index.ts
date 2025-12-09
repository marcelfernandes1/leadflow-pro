import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema.js'

// TiDB Cloud requires SSL
const sslConfig = process.env.DB_SSL === 'true'
  ? { rejectUnauthorized: true }
  : undefined

// Create connection pool
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'leadflow_pro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig,
})

export const db = drizzle(poolConnection, { schema, mode: 'default' })

export * from './schema.js'
