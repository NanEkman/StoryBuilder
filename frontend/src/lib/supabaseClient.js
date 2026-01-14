import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set')
}

// Create real client only if env vars present, otherwise provide a safe shim
let _supabase = null
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  // minimal shim to avoid runtime crashes during development
  _supabase = {
    auth: {
      getUser: async () => ({ data: null, error: new Error('Missing VITE_SUPABASE_* env vars') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Missing VITE_SUPABASE_* env vars') }),
      signUp: async () => ({ data: null, error: new Error('Missing VITE_SUPABASE_* env vars') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ data: null, error: null })
    }
  }
}

export const supabase = _supabase
export default supabase
