require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test databaskoppling
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', database: 'Connected', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Get all stories
app.get('/api/stories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, content, turns, created_at, updated_at FROM stories ORDER BY updated_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Databastfel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single story
app.get('/api/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM stories WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Berättelse inte funnen' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Databastfel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new story
app.post('/api/stories', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Innehål kan inte vara tomt' });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: 'Max 500 tecken per tur' });
    }

    const id = uuidv4();
    const title = `Story ${new Date().toLocaleDateString('sv-SE')} - ${id.slice(0, 8)}`;

    const result = await pool.query(
      `INSERT INTO stories (id, title, content, turns, created_at, updated_at) 
       VALUES ($1, $2, $3, 1, NOW(), NOW()) 
       RETURNING *`,
      [id, title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Databastfel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Continue story
app.post('/api/stories/:id/continue', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Innehål kan inte vara tomt' });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: 'Max 500 tecken per tur' });
    }

    // Get existing story
    const storyResult = await pool.query(
      'SELECT * FROM stories WHERE id = $1',
      [id]
    );

    if (storyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Berättelse inte funnen' });
    }

    const story = storyResult.rows[0];
    const updatedContent = story.content + '\n\n' + content;
    const newTurns = story.turns + 1;

    const result = await pool.query(
      `UPDATE stories 
       SET content = $1, turns = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING *`,
      [updatedContent, newTurns, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Databastfel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Något gick fel på servern' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server körs på http://localhost:${PORT}`);
  console.log(`📦 Databas: ${process.env.DATABASE_URL}`);
});

module.exports = app;
