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

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `)

    console.log('Users table created successfully!')

    // Create indexes for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `)

    console.log('Index skapade framgångsrikt!')

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Fel vid migrering:', error)
    if (pool) await pool.end()
    process.exit(1)
  }
}

createTables()
