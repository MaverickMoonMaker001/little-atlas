import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'
import Spinner from '../Spinner'
import { SHIRT_SIZES, PANTS_SIZES, DRESS_SIZES, SHOE_SIZES } from '../../data/sizeOptions'

function SizeSelect({ label, value, onChange, groups, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-atlas-muted mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] focus:outline-none focus:border-atlas-dark appearance-none"
      >
        <option value="">{placeholder}</option>
        {groups.map(({ group, options }) => (
          <optgroup key={group} label={group}>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

export default function AddSizeModal({ childId, gender, onClose, onSaved }) {
  const isFemale = gender === 'Female'
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ shirtSize: '', pantsSize: '', dressSize: '', shoeSize: '', notes: '', recordedAt: today })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const hasAny = form.shirtSize || form.pantsSize || form.shoeSize || (isFemale && form.dressSize)

  async function handleSave() {
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.from('size_history').insert({
        child_id: childId,
        shirt_size: form.shirtSize || null,
        pants_size: form.pantsSize || null,
        dress_size: isFemale ? (form.dressSize || null) : null,
        shoe_size: form.shoeSize || null,
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
          <SizeSelect label="Shirt size"  value={form.shirtSize} onChange={set('shirtSize')} groups={SHIRT_SIZES} placeholder="Select…" />
          <SizeSelect label="Pants size"  value={form.pantsSize} onChange={set('pantsSize')} groups={PANTS_SIZES} placeholder="Select…" />
          {isFemale && (
            <SizeSelect label="Dress size" value={form.dressSize} onChange={set('dressSize')} groups={DRESS_SIZES} placeholder="Select…" />
          )}
          <SizeSelect label="Shoe size"   value={form.shoeSize}  onChange={set('shoeSize')}  groups={SHOE_SIZES}  placeholder="Select…" />
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
            disabled={loading || !hasAny}
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
