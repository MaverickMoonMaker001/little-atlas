import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useAuth } from '../store/authStore'
import Spinner from '../components/Spinner'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function Signup() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleGoogleSignIn() {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Could not sign in with Google.')
      setGoogleLoading(false)
    }
  }

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

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-cream-300" />
        <span className="text-xs text-atlas-muted">or</span>
        <div className="flex-1 h-px bg-cream-300" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-cream-300 rounded-2xl py-3.5 text-sm font-medium text-[#1C1917] shadow-sm hover:bg-cream-50 active:bg-cream-100 transition-colors disabled:opacity-60"
      >
        {googleLoading ? <Spinner size="sm" /> : <GoogleIcon />}
        Continue with Google
      </button>

      <p className="text-sm text-atlas-warm text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-atlas-dark hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
