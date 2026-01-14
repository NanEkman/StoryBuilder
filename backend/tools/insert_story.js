const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { supabase } = require('../src/lib/supabaseClient')
const { v4: uuidv4 } = require('uuid')

;(async () => {
  try {
    const id = uuidv4()
    const title = `Test Story ${new Date().toISOString()}`
    const content = 'Detta är en test-berättelse som infogades av script.'

    const { data, error } = await supabase
      .from('stories')
      .insert([{ id, title, content, turns: 1 }])
      .select()
      .single()

    if (error) {
      console.error('Insert FEL:', error)
      process.exit(1)
    }

    console.log('Insert OK:', data)
    process.exit(0)
  } catch (err) {
    console.error('Insert undantag:', err)
    process.exit(2)
  }
})()
