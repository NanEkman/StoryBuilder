import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ViewStory() {
  const { id } = useParams()
  const [story, setStory] = useState(null)

  useEffect(() => {
    if (id) fetchStory()
  }, [id])

  const fetchStory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/stories/${id}`)
      setStory(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  if (!story) return <div className="p-8">Läser...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{story.title}</h1>
        <div className="whitespace-pre-wrap text-gray-700 mb-4">{story.content}</div>
        <div className="text-sm text-gray-500 mb-4">{story.turns} turn{story.turns !== 1 ? 's' : ''}</div>
        <Link to="/write" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Gå till skriv-sidan</Link>
      </div>
    </div>
  )
}
