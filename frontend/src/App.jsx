import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import WriteStory from './pages/WriteStory'
import ViewStory from './pages/ViewStory'

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-6xl mx-auto p-4">
        <nav className="flex justify-between items-center mb-4">
          <Link to="/" className="text-2xl font-bold text-gray-800">Story Builder</Link>
          <div>
            <Link to="/write" className="mr-2 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded">Skriv</Link>
            <Link to="/" className="inline-block text-sm text-gray-600">Hem</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<WriteStory />} />
          <Route path="/story/:id" element={<ViewStory />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

