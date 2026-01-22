const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('./src/lib/supabaseClient')

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Alla fält måste fyllas i' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Lösenordet måste vara minst 6 tecken' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: 'Användarnamn eller email redan använt' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ username, email, password: hashedPassword }])
      .select('id, username, email, created_at')
      .single();

    if (error) throw error;

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Användarnamn och lösenord krävs' });
    }

    // Find user by username or email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${username}`)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(401).json({ error: 'Felaktigt användarnamn eller lösenord' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Felaktigt användarnamn eller lösenord' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify JWT token middleware
function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token saknas eller fel format' });
    }
    const token = parts[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Ogiltig eller utgången token' });
      }
      req.userId = decoded.userId;
      req.username = decoded.username;
      next();
    });
  } catch (err) {
    console.error('verifyToken error', err);
    return res.status(500).json({ error: 'Autentiseringsfel' });
  }
}

// Get current user
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .eq('id', req.userId)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'Användare inte funnen' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Me error:', error);
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
  console.log(`Backend server körs på http://localhost:${PORT}`);
  console.log(`Databas: ${process.env.DATABASE_URL}`);
});

module.exports = app;
