import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import axios from 'axios'

export default function CreateStory() {
  const navigate = useNavigate()
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [isPublic, setIsPublic] = React.useState(true)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        navigate('/auth')
        return
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stories`,
        {
          title: title.trim(),
          initial_content: content.trim(),
          is_public: isPublic
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.story) {
        navigate('/stories')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong creating the story')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Story</CardTitle>
          <CardDescription>
            Start a new story that others can contribute to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Give your story a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Opening</Label>
              <textarea
                id="content"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write the beginning of your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                minLength={10}
                maxLength={500}
              />
              <p className="text-sm text-muted-foreground">
                {content.length}/500 characters (minimum 10 characters)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="isPublic" className="cursor-pointer">
                Public story (anyone can contribute)
              </Label>
            </div>

            {!isPublic && (
              <div className="bg-muted p-3 rounded text-sm">
                <p className="text-muted-foreground">
                  Private stories are only visible to you and the users you invite.
                  You can invite users after creating the story.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Story'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/stories')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
