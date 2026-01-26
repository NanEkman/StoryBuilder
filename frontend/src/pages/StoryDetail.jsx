import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Label } from '../components/ui/label'
import { User, Lock, Unlock, ArrowLeft } from 'lucide-react'
import axios from 'axios'

export default function StoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = React.useState(null)
  const [contributions, setContributions] = React.useState([])
  const [canContribute, setCanContribute] = React.useState(true)
  const [newContent, setNewContent] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [currentUser, setCurrentUser] = React.useState(null)

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (!token) {
      navigate('/auth')
      return
    }

    if (userStr) {
      setCurrentUser(JSON.parse(userStr))
    }

    fetchStory()
  }, [id, navigate])

  const fetchStory = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setStory(response.data.story)
      setContributions(response.data.contributions || [])
      setCanContribute(response.data.canContribute)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not fetch story')
      console.error('Fetch story error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleContribute = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stories/${id}/contribute`,
        { content: newContent.trim() },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setNewContent('')
      fetchStory() // Update story and contributions
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add contribution')
      console.error('Contribute error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleComplete = async () => {
    if (!window.confirm('Are you sure you want to complete this story? It will no longer be open for contributions.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stories/${id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      fetchStory()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not complete story')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-muted-foreground">Loading story...</p>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Story not found</p>
            <div className="text-center mt-4">
              <Button onClick={() => navigate('/stories')}>
                Back to stories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isCreator = currentUser && story.creator_id === currentUser.id

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/stories')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Story Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{story.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {story.creator?.username || 'Unknown user'}
                <span className="mx-1">•</span>
                {formatDate(story.created_at)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {story.is_public ? (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Unlock className="h-4 w-4" />
                  Public
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  Private
                </div>
              )}
              {story.is_completed && (
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                  Completed
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground whitespace-pre-wrap">{story.initial_content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contributions */}
      {contributions.length > 0 && (
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Contributions ({contributions.length})</h2>
          {contributions.map((contribution, index) => (
            <Card key={contribution.id}>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  {contribution.user?.username || 'Unknown user'}
                  <span className="mx-1">•</span>
                  {formatDate(contribution.created_at)}
                  <span className="mx-1">•</span>
                  Part {index + 1}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{contribution.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contribute Form */}
      {!story.is_completed && canContribute && (
        <Card>
          <CardHeader>
            <CardTitle>Continue the Story</CardTitle>
            <CardDescription>
              Write the next part of the story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContribute} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contribution">Your Contribution</Label>
                <textarea
                  id="contribution"
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Continue the story here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  minLength={10}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground">
                  {newContent.length}/500 characters (minimum 10 characters)
                </p>
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Add Contribution'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {!story.is_completed && !canContribute && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You cannot continue the story since you wrote the last contribution.
              Wait for someone else to contribute first!
            </p>
          </CardContent>
        </Card>
      )}

      {story.is_completed && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              This story is completed and no longer accepts contributions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Creator Actions */}
      {isCreator && !story.is_completed && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Story</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleComplete}>
                Complete Story
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Once you complete the story, no one will be able to contribute anymore.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
