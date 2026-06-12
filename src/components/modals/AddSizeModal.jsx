import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'
import Spinner from '../Spinner'

export default function AddSizeModal({ childId, onClose, onSaved }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ clothingSize: '', shoeSize: '', notes: '', recordedAt: today })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSave() {
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.from('size_history').insert({
        child_id: childId,
        clothing_size: form.clothingSize.trim() || null,
        shoe_size: form.shoeSize.trim() || null,
        notes: form.notes.trim() || null,
        recorded_at: form.recordedAt,
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
    <Modal title="Add size update" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-atlas-muted mb-1">Clothing size</label>
            <input
              value={form.clothingSize}
              onChange={set('clothingSize')}
              placeholder="e.g. Youth XL"
              className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark"
            />
          </div>
          <div>
            <label className="block text-xs text-atlas-muted mb-1">Shoe size</label>
            <input
              value={form.shoeSize}
              onChange={set('shoeSize')}
              placeholder="e.g. Women's 7"
              className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-atlas-muted mb-1">Date</label>
          <input
            type="date"
            value={form.recordedAt}
            onChange={set('recordedAt')}
            className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] focus:outline-none focus:border-atlas-dark"
          />
        </div>

        <div>
          <label className="block text-xs text-atlas-muted mb-1">Notes (optional)</label>
          <input
            value={form.notes}
            onChange={set('notes')}
            placeholder="Any notes"
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
            disabled={loading || (!form.clothingSize.trim() && !form.shoeSize.trim())}
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
