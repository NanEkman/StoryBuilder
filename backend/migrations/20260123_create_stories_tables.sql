-- Skapa stories-tabell
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

-- Skapa story_contributions-tabell
CREATE TABLE IF NOT EXISTS story_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  contribution_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Skapa story_invites-tabell
CREATE TABLE IF NOT EXISTS story_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(story_id, invited_user_id)
);

-- Index för bättre prestanda
CREATE INDEX IF NOT EXISTS idx_stories_creator ON stories(creator_id);
CREATE INDEX IF NOT EXISTS idx_stories_public ON stories(is_public);
CREATE INDEX IF NOT EXISTS idx_contributions_story ON story_contributions(story_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user ON story_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_invites_story ON story_invites(story_id);
CREATE INDEX IF NOT EXISTS idx_invites_user ON story_invites(invited_user_id);
