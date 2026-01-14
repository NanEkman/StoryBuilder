const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('./src/lib/supabaseClient')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
