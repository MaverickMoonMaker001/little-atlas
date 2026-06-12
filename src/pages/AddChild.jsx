import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Camera, Info } from 'lucide-react'

export default function AddChild() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    birthdate: '',
    birthTime: '',
    birthLocation: '',
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const age = form.birthdate
    ? Math.floor((Date.now() - new Date(form.birthdate)) / (365.25 * 24 * 3600 * 1000))
    : null

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-atlas-dark"
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <h1 className="font-serif text-xl font-medium text-[#1C1917]">
          Add First Child
        </h1>
      </div>

      {/* Photo upload */}
      <div className="flex justify-center mt-2 mb-8">
        <button className="w-20 h-20 rounded-full bg-cream-300 flex items-center justify-center hover:bg-cream-400 transition-colors">
          <Camera size={28} className="text-atlas-muted" strokeWidth={1.5} />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 space-y-5">
        {/* Child Name */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">
            Child Name <span className="text-atlas-muted">*</span>
          </label>
          <input
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Anna"
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark transition-colors"
          />
        </div>

        {/* Birthdate + Age */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1.5">
              Birthdate
            </label>
            <input
              type="date"
              value={form.birthdate}
              onChange={set('birthdate')}
              className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] focus:outline-none focus:border-atlas-dark transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1.5">
              Age
            </label>
            <div className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-atlas-muted">
              {age !== null ? `${age} years old` : 'If no date'}
            </div>
          </div>
        </div>

        {/* Info callout */}
        <div className="bg-cream-200 rounded-xl p-4 flex gap-3">
          <Info size={16} className="text-atlas-warm shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-xs text-atlas-warm leading-relaxed">
            Birthdate unlocks basic astrology insights. Birth time and location make the insights more specific, but you can skip them.
          </p>
        </div>

        {/* Birth Time */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">
            Birth Time <span className="text-xs text-atlas-muted font-normal">(Improves insights)</span>
          </label>
          <input
            type="time"
            value={form.birthTime}
            onChange={set('birthTime')}
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] focus:outline-none focus:border-atlas-dark transition-colors"
          />
        </div>

        {/* Birth Location */}
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">
            Birth Location <span className="text-xs text-atlas-muted font-normal">(Used for chart)</span>
          </label>
          <input
            value={form.birthLocation}
            onChange={set('birthLocation')}
            placeholder="City, State, Country"
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark transition-colors"
          />
        </div>
      </div>

      {/* Save */}
      <div className="px-5 pt-6 pb-10">
        <button
          onClick={() => navigate('/home')}
          disabled={!form.name.trim()}
          className="w-full bg-atlas-dark disabled:bg-atlas-muted text-white rounded-2xl py-4 font-medium text-base transition-colors"
        >
          Create Profile
        </button>
      </div>
    </div>
  )
}
