const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('./src/lib/supabaseClient')
const bcrypt = require('bcryptjs')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple request logger to help debug frontend requests
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`)
  if (req.method === 'POST' || req.method === 'PUT') {
    // log small bodies only
    try { console.log('[BODY]', JSON.stringify(req.body).slice(0, 1000)) } catch (e) {}
  }
  next()
})

// Health
app.get('/health', async (req, res) => {
  try {
    // simple check that Supabase client is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ status: 'Error', message: 'Supabase not configured' });
    }
    res.json({ status: 'OK', supabase: process.env.SUPABASE_URL });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Get all stories
app.get('/api/stories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('id, title, content, turns, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Databastfel:', error)
    res.status(500).json({ error: error.message })
  }
});

// Get single story
app.get('/api/stories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Berättelse inte funnen' })
    res.json(data)
  } catch (error) {
    console.error('Databastfel:', error)
    res.status(500).json({ error: error.message })
  }
});

// Create new story
app.post('/api/stories', async (req, res) => {
  try {
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Innehål kan inte vara tomt' })
    }

    if (content.length > 500) {
      return res.status(400).json({ error: 'Max 500 tecken per tur' })
    }

    const id = uuidv4()
    const title = `Story ${new Date().toLocaleDateString('sv-SE')} - ${id.slice(0, 8)}`

    const { data, error } = await supabase
      .from('stories')
      .insert([{ id, title, content, turns: 1 }])
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    console.error('Databastfel:', error)
    res.status(500).json({ error: error.message })
  }
});

// Continue story
app.post('/api/stories/:id/continue', async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Innehål kan inte vara tomt' })
    }

    if (content.length > 500) {
      return res.status(400).json({ error: 'Max 500 tecken per tur' })
    }

    const { data: story, error: getErr } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (getErr) throw getErr
    if (!story) return res.status(404).json({ error: 'Berättelse inte funnen' })

    const updatedContent = (story.content || '') + '\n\n' + content
    const newTurns = (story.turns || 0) + 1

    const { data, error: updErr } = await supabase
      .from('stories')
      .update({ content: updatedContent, turns: newTurns })
      .eq('id', id)
      .select()
      .single()

    if (updErr) throw updErr
    res.json(data)
  } catch (error) {
    console.error('Databastfel:', error)
    res.status(500).json({ error: error.message })
  }
});

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ error: 'Email och lösenord krävs' })
    if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'Lösenord måste vara minst 6 tecken' })

    // check existing
    const { data: existing, error: selErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (selErr) throw selErr
    if (existing) return res.status(409).json({ error: 'Användare med denna email finns redan' })

    const hashed = await bcrypt.hash(password, 8)
    const id = uuidv4()

    const { data, error } = await supabase
      .from('users')
      .insert([{ id, email, password_hash: hashed }])
      .select('id, email, created_at')
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email och lösenord krävs' })

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (error) throw error
    if (!user) return res.status(401).json({ error: 'Ogiltiga inloggningsuppgifter' })

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return res.status(401).json({ error: 'Ogiltiga inloggningsuppgifter' })

    // return basic user info (no token for now)
    const { password_hash, ...safeUser } = user
    res.json({ user: safeUser })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Något gick fel på servern' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server körs på http://localhost:${PORT}`);
  console.log(`Databas: ${process.env.DATABASE_URL}`);
});

module.exports = app;
