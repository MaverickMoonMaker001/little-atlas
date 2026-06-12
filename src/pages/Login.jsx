import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useAuth } from '../store/authStore'
import Spinner from '../components/Spinner'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, resetPassword } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!form.email) {
      setError('Enter your email address first, then tap "Forgot password".')
      return
    }
    setLoading(true)
    try {
      await resetPassword(form.email)
      setResetSent(true)
      setError('')
    } catch (err) {
      setError(err.message || 'Could not send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col px-7 pt-16 pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-full bg-white border border-cream-300 flex items-center justify-center shadow-sm">
          <BookOpen size={18} className="text-atlas-dark" strokeWidth={1.5} />
        </div>
        <span className="font-serif text-lg font-medium text-[#1C1917]">Little Atlas</span>
      </div>

      <h1 className="font-serif text-3xl font-medium text-[#1C1917] mb-1">Welcome back</h1>
      <p className="text-sm text-atlas-warm mb-8">Sign in to your family's atlas.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={set('password')}
            placeholder="Your password"
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark transition-colors"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {resetSent && (
          <p className="text-sm text-green-600">
            Password reset email sent. Check your inbox.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-atlas-dark disabled:bg-atlas-muted text-white rounded-2xl py-4 font-medium text-base transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Spinner size="sm" /> : null}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleForgotPassword}
        className="text-sm text-atlas-warm hover:text-atlas-dark transition-colors mt-4 text-center w-full"
      >
        Forgot password?
      </button>

      <p className="text-sm text-atlas-warm text-center mt-6">
        New here?{' '}
        <Link to="/signup" className="font-medium text-atlas-dark hover:underline">
          Create account
        </Link>
      </p>
    </div>
  )
}
