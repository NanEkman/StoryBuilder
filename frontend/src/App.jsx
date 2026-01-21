import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import WriteStory from './pages/WriteStory'
import ViewStory from './pages/ViewStory'
import Login from './pages/Login'
import Register from './pages/Register'
import Button from './components/ui/Button'
import Card from './components/ui/Card'
import { supabase } from './lib/supabaseClient'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) throw error
        if (data?.user) setUser(data.user)
      } catch (e) {
        console.warn('Could not get user from supabase', e)
        setUser(null)
      }
    })()
    // subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) setUser(session.user)
      else setUser(null)
    })
    return () => listener?.subscription?.unsubscribe()
  }, [])

  function handleLogout() {
    supabase.auth.signOut()
    setUser(null)
  }

  return (
    <BrowserRouter>
      <div className="max-w-6xl mx-auto p-4">
        <nav className="flex justify-between items-center mb-4">
          <Link to="/" className="text-2xl font-bold text-gray-800">Story Builder</Link>
          <div className="flex items-center">
            <Link to="/write" className="mr-2">
              <Button className="px-3 py-1">Skriv</Button>
            </Link>
            {!user ? (
              <>
                <Link to="/login" className="mr-2 inline-block text-sm text-gray-700">Logga in</Link>
                <Link to="/register" className="inline-block text-sm text-gray-700">Registrera</Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button variant="ghost" onClick={handleLogout} className="text-sm text-red-600">Logga ut</Button>
              </div>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<WriteStory />} />
          <Route path="/story/:id" element={<ViewStory />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
