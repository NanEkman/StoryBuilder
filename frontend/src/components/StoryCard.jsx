import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { User, Lock, Unlock } from 'lucide-react'

export default function StoryCard({ story, showActions = true }) {
  const navigate = useNavigate()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{story.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <User className="h-3 w-3" />
              {story.creator?.username || 'Unknown user'}
              <span className="mx-1">•</span>
              {formatDate(story.created_at)}
            </CardDescription>
          </div>
          <div>
            {story.is_public ? (
              <Unlock className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground mb-4">
          {truncateText(story.initial_content)}
        </p>
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/stories/${story.id}`)}
            >
              Read & Contribute
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/stories/${story.id}`)}
            >
              View Full
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
