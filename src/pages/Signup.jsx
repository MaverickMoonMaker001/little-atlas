import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useAuth } from '../store/authStore'
import Spinner from '../components/Spinner'

export default function Signup() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await signUp(form.email, form.password)
      navigate('/add-child')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
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

      <h1 className="font-serif text-3xl font-medium text-[#1C1917] mb-1">Create account</h1>
      <p className="text-sm text-atlas-warm mb-8">Start your family's private atlas.</p>

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
            placeholder="At least 6 characters"
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Confirm password</label>
          <input
            type="password"
            required
            value={form.confirm}
            onChange={set('confirm')}
            placeholder="Same password again"
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-atlas-dark disabled:bg-atlas-muted text-white rounded-2xl py-4 font-medium text-base transition-colors mt-2 flex items-center justify-center gap-2"
        >
          {loading ? <Spinner size="sm" /> : null}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-atlas-warm text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-atlas-dark hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
