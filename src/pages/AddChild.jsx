import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Camera, Info } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Spinner from '../components/Spinner'

export default function AddChild() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [form, setForm] = useState({
    name: '',
    gender: '',
    birthdate: '',
    birthTime: '',
    birthLocation: '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const age = form.birthdate
    ? Math.floor((Date.now() - new Date(form.birthdate)) / (365.25 * 24 * 3600 * 1000))
    : null

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    setError('')
    if (!form.name.trim()) return
    setLoading(true)
    try {
      let photo_url = null

      if (photoFile) {
        const ext = photoFile.name.split('.').pop()
        const path = `${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('child-photos')
          .upload(path, photoFile)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('child-photos').getPublicUrl(path)
        photo_url = urlData.publicUrl
      }

      const { error: insertError } = await supabase.from('children').insert({
        name: form.name.trim(),
        gender: form.gender || null,
        birthdate: form.birthdate || null,
        birth_time: form.birthTime || null,
        birth_location: form.birthLocation.trim() || null,
        photo_url,
      })
      if (insertError) throw insertError

      navigate('/home')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-atlas-dark">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <h1 className="font-serif text-xl font-medium text-[#1C1917]">Add Child</h1>
      </div>

      {/* Photo upload */}
      <div className="flex justify-center mt-2 mb-8">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-20 h-20 rounded-full bg-cream-300 flex items-center justify-center hover:bg-cream-400 transition-colors overflow-hidden"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Camera size={28} className="text-atlas-muted" strokeWidth={1.5} />
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Form */}
      <div className="flex-1 px-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">
            Child Name <span className="text-atlas-muted">*</span>
          </label>
          <input
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Anna"
            maxLength={60}
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Gender</label>
          <div className="flex gap-2">
            {['Female', 'Male', 'Other'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setForm((f) => ({ ...f, gender: f.gender === g ? '' : g }))}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                  form.gender === g
                    ? 'bg-atlas-dark text-white border-atlas-dark'
                    : 'bg-white text-atlas-warm border-cream-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Birthdate</label>
            <input
              type="date"
              value={form.birthdate}
              onChange={set('birthdate')}
              className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] focus:outline-none focus:border-atlas-dark transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Age</label>
            <div className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-atlas-muted">
              {age !== null ? `${age} years old` : 'If no date'}
            </div>
          </div>
        </div>

        <div className="bg-cream-200 rounded-xl p-4 flex gap-3">
          <Info size={16} className="text-atlas-warm shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-xs text-atlas-warm leading-relaxed">
            Birthdate unlocks basic astrology insights. Birth time and location make the insights more specific, but you can skip them.
          </p>
        </div>

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

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="px-5 pt-6 pb-10">
        <button
          onClick={handleSubmit}
          disabled={!form.name.trim() || loading}
          className="w-full bg-atlas-dark disabled:bg-atlas-muted text-white rounded-2xl py-4 font-medium text-base transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Spinner size="sm" /> : null}
          {loading ? 'Saving…' : 'Create Profile'}
        </button>
      </div>
    </div>
  )
}
