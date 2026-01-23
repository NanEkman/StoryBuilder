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

    // Create stories tables
    console.log('Skapar stories-tabeller...')

    // Stories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        initial_content TEXT NOT NULL,
        is_public BOOLEAN DEFAULT true,
        is_completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Story contributions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS story_contributions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        contribution_order INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Story invites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS story_invites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
        invited_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        accepted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(story_id, invited_user_id)
      );
    `)

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_stories_creator ON stories(creator_id);
      CREATE INDEX IF NOT EXISTS idx_stories_public ON stories(is_public);
      CREATE INDEX IF NOT EXISTS idx_contributions_story ON story_contributions(story_id);
      CREATE INDEX IF NOT EXISTS idx_contributions_user ON story_contributions(user_id);
      CREATE INDEX IF NOT EXISTS idx_invites_story ON story_invites(story_id);
      CREATE INDEX IF NOT EXISTS idx_invites_user ON story_invites(invited_user_id);
    `)

    console.log('Stories-tabeller skapade framgångsrikt!')

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Fel vid migrering:', error)
    if (pool) await pool.end()
    process.exit(1)
  }
}

createTables()
