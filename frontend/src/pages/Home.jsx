import React from 'react'
import { Card } from '../components/ui/Card'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Välkommen till StoryBuilder
        </h1>
        
        <Card className="p-8">
          <p className="text-center text-muted-foreground text-lg">
            Din kreativa plattform för att bygga berättelser
          </p>
        </Card>
      </div>
    </div>
  )
}
