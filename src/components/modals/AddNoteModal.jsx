import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'
import Spinner from '../Spinner'

export default function AddNoteModal({ childId, onClose, onSaved }) {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setError('')
    if (!content.trim()) { setError('Note cannot be empty.'); return }
    setLoading(true)
    try {
      const { error: err } = await supabase.from('child_notes').insert({
        child_id: childId,
        content: content.trim(),
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
    <Modal title="Add note" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-atlas-muted mb-1">Note</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a note about this child…"
            rows={5}
            className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark resize-none"
            autoFocus
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
