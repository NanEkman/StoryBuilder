require('dotenv').config();
const { Pool } = require('pg');
const { URL } = require('url')
const dns = require('dns').promises

const createPoolFromConnectionString = async (connectionString) => {
  if (!connectionString) throw new Error('DATABASE_URL saknas')

  try {
    const parsed = new URL(connectionString)
    const host = parsed.hostname
    const port = parsed.port || 5432
    const user = parsed.username
    const password = parsed.password
    const database = parsed.pathname ? parsed.pathname.replace('/', '') : undefined

    console.log(`Parsing DATABASE_URL host=${host} port=${port} user=${user} database=${database}`)

    let address = host
    try {
      const res = await dns.lookup(host, { family: 4 })
      address = res.address
      console.log(`Resolved IPv4 for ${host}: ${address}`)
    } catch (err) {
      console.warn(`Could not resolve IPv4 for ${host}: ${err.message} — will try hostname directly (may require IPv6).`)
    }

    const pool = new Pool({ host: address, port, user, password, database, ssl: { rejectUnauthorized: false } })
    return pool
  } catch (err) {
    console.warn('Failed to parse connection string, falling back to connectionString in Pool')
    return new Pool({ connectionString })
  }
}

const createTables = async () => {
  let pool
  try {
    pool = await createPoolFromConnectionString(process.env.DATABASE_URL)

    console.log('Skapar databastabeller...')

    // Drop existing table if it exists (för utveckling) — only if FORCE_DROP=true
    if (process.env.FORCE_DROP === 'true') {
      console.log('Dropping existing `stories` table because FORCE_DROP=true')
      await pool.query('DROP TABLE IF EXISTS stories CASCADE')
    } else {
      console.log('Skipping DROP TABLE (set FORCE_DROP=true to enable)')
    }

    // Create stories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        turns INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    console.log('Databastabeller skapade framgångsrikt!')

    // Create indexes for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_stories_updated_at ON stories(updated_at DESC);
    `)

    console.log('Index skapade framgångsrikt!')

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    console.log('Users table created successfully!')

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Fel vid migrering:', error)
    if (pool) await pool.end()
    process.exit(1)
  }
}

createTables()
