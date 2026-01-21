import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useNavigate } from 'react-router-dom'


export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) return setError('Email och lösenord krävs')

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // data.session is created and persisted by Supabase client; user available in data.user
      if (data?.user && setUser) setUser(data.user)
      navigate('/')
    } catch (err) {
      setError(err?.message || err?.error || 'Ett fel uppstod')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Logga in</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Lösenord" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Loggar in...' : 'Logga in'}</Button>
          </form>
      </Card>
    </div>
  )
}
