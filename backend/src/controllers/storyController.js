const supabase = require('../lib/supabaseClient');

// Skapa en ny story
exports.createStory = async (req, res) => {
  try {
    const { title, initial_content, is_public, invited_users } = req.body;
    const creator_id = req.user.id;

    // Validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: "Title must be at least 3 characters" });
    }

    if (!initial_content || initial_content.trim().length < 10) {
      return res.status(400).json({ error: "Content must be at least 10 characters" });
    }

    if (initial_content.trim().length > 500) {
      return res.status(400).json({ error: "Content can be maximum 500 characters" });
    }

    // Skapa story
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .insert({
        creator_id,
        title: title.trim(),
        initial_content: initial_content.trim(),
        is_public: is_public !== undefined ? is_public : true
      })
      .select()
      .single();

    if (storyError) throw storyError;

    // Om det finns inbjudna användare, skapa invites
    if (invited_users && Array.isArray(invited_users) && invited_users.length > 0) {
      const invites = invited_users.map(user_id => ({
        story_id: story.id,
        invited_user_id: user_id,
        invited_by: creator_id
      }));

      const { error: inviteError } = await supabase
        .from('story_invites')
        .insert(invites);

      if (inviteError) {
        console.error('Invite error:', inviteError);
      }
    }

    res.status(201).json({ story });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Hämta publika stories (som användaren inte skapat och inte är avslutade)
exports.getPublicStories = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data: stories, error } = await supabase
      .from('stories')
      .select(`
        *,
        creator:users!stories_creator_id_fkey(id, username),
        contributions:story_contributions(id, user_id)
      `)
      .eq('is_public', true)
      .eq('is_completed', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filtrera bort stories där användaren skrev senast
    const filteredStories = stories.filter(story => {
      // Hämta senaste contribution
      if (story.contributions && story.contributions.length > 0) {
        // Sortera contributions efter created_at eller contribution_order
        const sortedContributions = [...story.contributions];
        // Vi behöver faktiskt hämta hela contribution-objektet, inte bara id och user_id
        return true; // Vi gör en mer detaljerad koll senare i frontend eller i en annan endpoint
      }
      return true;
    });

    res.json({ stories });
  } catch (error) {
    console.error('Get public stories error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Hämta privata stories (där användaren är inbjuden eller creator)
exports.getPrivateStories = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Hämta stories där användaren är creator
    const { data: createdStories, error: createdError } = await supabase
      .from('stories')
      .select(`
        *,
        creator:users!stories_creator_id_fkey(id, username)
      `)
      .eq('creator_id', user_id)
      .eq('is_public', false)
      .eq('is_completed', false)
      .order('created_at', { ascending: false });

    if (createdError) throw createdError;

    // Hämta stories där användaren är inbjuden
    const { data: invites, error: inviteError } = await supabase
      .from('story_invites')
      .select(`
        story:stories(
          *,
          creator:users!stories_creator_id_fkey(id, username)
        )
      `)
      .eq('invited_user_id', user_id)
      .eq('accepted', true);

    if (inviteError) throw inviteError;

    // Kombinera och ta bort dubbletter
    const invitedStories = invites
      .map(inv => inv.story)
      .filter(story => story && story.is_public === false && story.is_completed === false);

    const allPrivateStories = [...createdStories, ...invitedStories];
    
    // Ta bort dubbletter baserat på id
    const uniqueStories = allPrivateStories.filter((story, index, self) =>
      index === self.findIndex(s => s.id === story.id)
    );

    res.json({ stories: uniqueStories });
  } catch (error) {
    console.error('Get private stories error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Hämta avslutade stories där användaren har bidragit
exports.getCompletedStories = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Hämta alla contributions från användaren
    const { data: userContributions, error: contribError } = await supabase
      .from('story_contributions')
      .select('story_id')
      .eq('user_id', user_id);

    if (contribError) throw contribError;

    const storyIds = [...new Set(userContributions.map(c => c.story_id))];

    if (storyIds.length === 0) {
      return res.json({ stories: [] });
    }

    // Hämta stories som är completed och användaren har bidragit till
    const { data: stories, error: storyError } = await supabase
      .from('stories')
      .select(`
        *,
        creator:users!stories_creator_id_fkey(id, username)
      `)
      .in('id', storyIds)
      .eq('is_completed', true)
      .order('created_at', { ascending: false });

    if (storyError) throw storyError;

    res.json({ stories: stories || [] });
  } catch (error) {
    console.error('Get completed stories error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Hämta en specifik story med alla contributions
exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get story
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select(`
        *,
        creator:users!stories_creator_id_fkey(id, username)
      `)
      .eq('id', id)
      .single();

    if (storyError) throw storyError;
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    // Check access
    if (!story.is_public) {
      // Check if user is creator or invited
      const isCreator = story.creator_id === user_id;
      
      if (!isCreator) {
        const { data: invite } = await supabase
          .from('story_invites')
          .select('id')
          .eq('story_id', id)
          .eq('invited_user_id', user_id)
          .eq('accepted', true)
          .single();

        if (!invite) {
          return res.status(403).json({ error: "Du har inte åtkomst till denna story" });
        }
      }
    }

    // Get contributions
    const { data: contributions, error: contribError } = await supabase
      .from('story_contributions')
      .select(`
        *,
        user:users(id, username)
      `)
      .eq('story_id', id)
      .order('contribution_order', { ascending: true });

    if (contribError) throw contribError;

    // Check if user wrote last
    let canContribute = true;
    if (contributions && contributions.length > 0) {
      const lastContribution = contributions[contributions.length - 1];
      if (lastContribution.user_id === user_id) {
        canContribute = false;
      }
    }

    res.json({ 
      story, 
      contributions: contributions || [],
      canContribute
    });
  } catch (error) {
    console.error('Get story by id error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Bidra till en story
exports.contributeToStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id;

    // Validation
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ error: "Contribution must be at least 10 characters" });
    }

    if (content.trim().length > 500) {
      return res.status(400).json({ error: "Contribution can be maximum 500 characters" });
    }

    // Get story
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (storyError) throw storyError;
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (story.is_completed) {
      return res.status(400).json({ error: "This story is completed" });
    }

    // Check access
    if (!story.is_public) {
      const isCreator = story.creator_id === user_id;
      
      if (!isCreator) {
        const { data: invite } = await supabase
          .from('story_invites')
          .select('id')
          .eq('story_id', id)
          .eq('invited_user_id', user_id)
          .eq('accepted', true)
          .single();

        if (!invite) {
          return res.status(403).json({ error: "You don't have access to this story" });
        }
      }
    }

    // Get last contribution
    const { data: lastContribution } = await supabase
      .from('story_contributions')
      .select('user_id, contribution_order')
      .eq('story_id', id)
      .order('contribution_order', { ascending: false })
      .limit(1)
      .single();

    // Check if user wrote last
    if (lastContribution && lastContribution.user_id === user_id) {
      return res.status(400).json({ error: "You cannot continue the story since you wrote the last part" });
    }

    // Create contribution
    const nextOrder = lastContribution ? lastContribution.contribution_order + 1 : 1;

    const { data: contribution, error: contribError } = await supabase
      .from('story_contributions')
      .insert({
        story_id: id,
        user_id,
        content: content.trim(),
        contribution_order: nextOrder
      })
      .select(`
        *,
        user:users(id, username)
      `)
      .single();

    if (contribError) throw contribError;

    // Update story updated_at
    await supabase
      .from('stories')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);

    res.status(201).json({ contribution });
  } catch (error) {
    console.error('Contribute to story error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Markera story som avslutad
exports.completeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get story
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (storyError) throw storyError;
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    // Only creator can complete a story
    if (story.creator_id !== user_id) {
      return res.status(403).json({ error: "Only the creator can complete a story" });
    }

    // Update story
    const { data: updatedStory, error: updateError } = await supabase
      .from('stories')
      .update({ is_completed: true })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ story: updatedStory });
  } catch (error) {
    console.error('Complete story error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Bjud in användare till en story
exports.inviteToStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_ids } = req.body;
    const inviter_id = req.user.id;

    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return res.status(400).json({ error: "You must specify at least one user to invite" });
    }

    // Get story
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (storyError) throw storyError;
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    // Only creator can invite to private stories
    if (story.creator_id !== inviter_id) {
      return res.status(403).json({ error: "Only the creator can invite users" });
    }

    // Create invites
    const invites = user_ids.map(user_id => ({
      story_id: id,
      invited_user_id: user_id,
      invited_by: inviter_id
    }));

    const { data: createdInvites, error: inviteError } = await supabase
      .from('story_invites')
      .insert(invites)
      .select();

    if (inviteError) throw inviteError;

    res.status(201).json({ invites: createdInvites });
  } catch (error) {
    console.error('Invite to story error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Acceptera en inbjudan
exports.acceptInvite = async (req, res) => {
  try {
    const { id } = req.params; // invite id
    const user_id = req.user.id;

    // Update invite
    const { data: invite, error } = await supabase
      .from('story_invites')
      .update({ accepted: true })
      .eq('id', id)
      .eq('invited_user_id', user_id)
      .select()
      .single();

    if (error) throw error;
    if (!invite) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    res.json({ invite });
  } catch (error) {
    console.error('Accept invite error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Hämta användarens inbjudningar
exports.getMyInvites = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data: invites, error } = await supabase
      .from('story_invites')
      .select(`
        *,
        story:stories(*),
        inviter:users!story_invites_invited_by_fkey(id, username)
      `)
      .eq('invited_user_id', user_id)
      .eq('accepted', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ invites: invites || [] });
  } catch (error) {
    console.error('Get my invites error:', error);
    res.status(500).json({ error: error.message });
  }
};
