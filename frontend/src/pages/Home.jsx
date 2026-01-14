import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Home() {
  const [stories, setStories] = useState([])

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/stories`)
      setStories(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">📖 Story Builder</h1>
        <p className="text-gray-600 mb-6">Välkommen! Gå till skriv-sidan för att skapa eller fortsätta berättelser.</p>
        <Link to="/write" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-6">Skriv berättelse</Link>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Aktiva berättelser</h2>
        <div className="grid gap-3">
          {stories.map((s) => (
            <Link key={s.id} to={`/story/${s.id}`} className="p-4 bg-white rounded shadow text-left hover:bg-gray-50">
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-gray-500">{s.turns} turn{String(s.turns) !== '1' ? 's' : ''}</div>
            </Link>
          ))}
          {stories.length === 0 && <div className="text-gray-500">Inga berättelser ännu.</div>}
        </div>
      </div>
    </div>
  )
}
