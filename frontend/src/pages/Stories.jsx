import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Button } from '../components/ui/Button'
import StoryCard from '../components/StoryCard'
import { Plus } from 'lucide-react'
import axios from 'axios'

export default function Stories() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState('public')
  const [publicStories, setPublicStories] = React.useState([])
  const [privateStories, setPrivateStories] = React.useState([])
  const [completedStories, setCompletedStories] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth')
      return
    }

    fetchStories()
  }, [navigate])

  const fetchStories = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      // Hämta alla typer av stories parallellt
      const [publicRes, privateRes, completedRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/stories/public`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/stories/private`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/stories/completed`, { headers })
      ])

      setPublicStories(publicRes.data.stories || [])
      setPrivateStories(privateRes.data.stories || [])
      setCompletedStories(completedRes.data.stories || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Could not fetch stories')
      console.error('Fetch stories error:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderStoryList = (stories, emptyMessage) => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading stories...</p>
        </div>
      )
    }

    if (stories.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Stories</h1>
          <p className="text-muted-foreground">
            Explore stories and contribute your own chapters
          </p>
        </div>
        <Button onClick={() => navigate('/stories/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Story
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="public">
            Public
            {publicStories.length > 0 && (
              <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                {publicStories.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="private">
            Private
            {privateStories.length > 0 && (
              <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                {privateStories.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedStories.length > 0 && (
              <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                {completedStories.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="public" className="mt-6">
          {renderStoryList(
            publicStories,
            'No public stories available yet. Be the first to create one!'
          )}
        </TabsContent>

        <TabsContent value="private" className="mt-6">
          {renderStoryList(
            privateStories,
            'You have no private stories. Create a private story and invite friends!'
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderStoryList(
            completedStories,
            'You have not contributed to any completed stories yet.'
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
