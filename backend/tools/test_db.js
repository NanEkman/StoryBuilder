const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { supabase } = require('../src/lib/supabaseClient')

;(async () => {
  try {
    const { data, error } = await supabase.from('stories').select('id').limit(1)
    if (error) {
      console.error('Databastest - FEL:', error)
      process.exit(1)
    }
    console.log('Databastest - OK. Retrieved rows:', Array.isArray(data) ? data.length : 0)
    process.exit(0)
  } catch (err) {
    console.error('Databastest - Undantag:', err)
    process.exit(2)
  }
})()
