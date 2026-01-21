// const { createClient } = require('@supabase/supabase-js')

// const SUPABASE_URL = process.env.SUPABASE_URL
// const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
//   console.warn('Supabase URL or SERVICE_ROLE_KEY not set in env')
// }

// const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// module.exports = { supabase }

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase env saknas – supabaseClient inaktiverad (detta är OK lokalt)"
  );
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = { supabase };
