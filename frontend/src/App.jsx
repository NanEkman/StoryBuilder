import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Account from './pages/Account'
import Stories from './pages/Stories'
import CreateStory from './pages/CreateStory'
import StoryDetail from './pages/StoryDetail'
import UserHistory from './pages/UserHistory'
import { Navbar } from './components/Navbar'
import { ThemeProvider } from './components/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/create" element={<CreateStory />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/history" element={<UserHistory />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

