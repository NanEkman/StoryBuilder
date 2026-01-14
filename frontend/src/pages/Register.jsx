import React, { useState } from 'react'
import axios from 'axios'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) return setError('Email och lösenord krävs')
    if (password.length < 6) return setError('Lösenord måste vara minst 6 tecken')

    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/api/register`, { email, password })
      setSuccess('Registrering lyckades — du kan nu logga in')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err?.response?.data?.error || 'Ett fel uppstod')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Registrera</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Lösenord" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Registrerar...' : 'Registrera'}</Button>
        </form>
      </Card>
    </div>
  )
}
