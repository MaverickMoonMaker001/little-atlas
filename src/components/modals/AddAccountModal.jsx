import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'
import Spinner from '../Spinner'

export default function AddAccountModal({ childId, onClose, onSaved }) {
  const [form, setForm] = useState({ platform: '', username: '', passwordHint: '', url: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSave() {
    setError('')
    if (!form.platform.trim()) { setError('Platform name is required.'); return }
    setLoading(true)
    try {
      const { error: err } = await supabase.from('child_accounts').insert({
        child_id: childId,
        platform: form.platform.trim(),
        username: form.username.trim() || null,
        password_hint: form.passwordHint.trim() || null,
        url: form.url.trim() || null,
      })
      if (err) throw err
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message || 'Could not save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Add account" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-atlas-muted mb-1">Platform</label>
          <input
            value={form.platform}
            onChange={set('platform')}
            placeholder="e.g. School Portal, Spotify"
            className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark"
          />
        </div>

        <div>
          <label className="block text-xs text-atlas-muted mb-1">Username</label>
          <input
            value={form.username}
            onChange={set('username')}
            placeholder="Username or email"
            className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark"
          />
        </div>

        <div>
          <label className="block text-xs text-atlas-muted mb-1">
            Password hint{' '}
            <span className="text-[10px] normal-case font-normal text-atlas-muted">
              — hint only, never the actual password
            </span>
          </label>
          <input
            value={form.passwordHint}
            onChange={set('passwordHint')}
            placeholder="e.g. Favorite pet + birth year"
            className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark"
          />
        </div>

        <div>
          <label className="block text-xs text-atlas-muted mb-1">URL (optional)</label>
          <input
            value={form.url}
            onChange={set('url')}
            placeholder="https://…"
            type="url"
            className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 bg-cream-200 text-atlas-warm rounded-xl py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-atlas-dark disabled:bg-atlas-muted text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : null}
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}
