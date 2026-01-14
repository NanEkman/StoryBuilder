import React, { useState } from 'react'
import axios from 'axios'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) return setError('Email och lösenord krävs')

    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/api/login`, { email, password })
      setUser(res.data.user)
    } catch (err) {
      setError(err?.response?.data?.error || 'Ett fel uppstod')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Logga in</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {user ? (
          <div>
            <p className="text-green-600 mb-2">Inloggning lyckades: {user.email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Lösenord" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Loggar in...' : 'Logga in'}</Button>
          </form>
        )}
      </Card>
    </div>
  )
}
