import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useNavigate } from 'react-router-dom'


export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) return setError('Email och lösenord krävs')
    if (password.length < 6) return setError('Lösenord måste vara minst 6 tecken')

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setSuccess('Registrering lyckades — kontrollera din email om bekräftelse krävs')
      setEmail('')
      setPassword('')
      setTimeout(() => navigate('/login'), 900)
    } catch (err) {
      setError(err?.message || err?.error || 'Ett fel uppstod')
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
