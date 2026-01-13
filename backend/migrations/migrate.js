require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  try {
    console.log('🔧 Skapar databastabeller...');

    // Drop existing table if it exists (för utveckling)
    await pool.query('DROP TABLE IF EXISTS stories CASCADE');

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
    `);

    console.log('✅ Databastabeller skapade framgångsrikt!');

    // Create indexes for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_stories_updated_at ON stories(updated_at DESC);
    `);

    console.log('✅ Index skapade framgångsrikt!');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fel vid migrering:', error);
    await pool.end();
    process.exit(1);
  }
};

createTables();
