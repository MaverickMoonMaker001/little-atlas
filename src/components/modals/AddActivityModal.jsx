import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'
import Spinner from '../Spinner'

const CATEGORIES = ['Sport', 'Education', 'Arts', 'Community', 'Other']

export default function AddActivityModal({ childId, onClose, onSaved }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ name: '', category: 'Other', activityDate: today, notes: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSave() {
    setError('')
    if (!form.name.trim()) { setError('Activity name is required.'); return }
    setLoading(true)
    try {
      const { error: err } = await supabase.from('activities').insert({
        child_id: childId,
        name: form.name.trim(),
        category: form.category,
        activity_date: form.activityDate,
        notes: form.notes.trim() || null,
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
    <Modal title="Log activity" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-atlas-muted mb-1">Activity name</label>
          <input
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Soccer practice"
            className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark"
          />
        </div>

        <div>
          <label className="block text-xs text-atlas-muted mb-1">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setForm((f) => ({ ...f, category: cat }))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  form.category === cat
                    ? 'bg-atlas-dark text-white'
                    : 'bg-cream-200 text-atlas-warm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-atlas-muted mb-1">Date</label>
          <input
            type="date"
            value={form.activityDate}
            onChange={set('activityDate')}
            className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] focus:outline-none focus:border-atlas-dark"
          />
        </div>

        <div>
          <label className="block text-xs text-atlas-muted mb-1">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={set('notes')}
            placeholder="Any notes about this activity"
            rows={2}
            className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark resize-none"
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
