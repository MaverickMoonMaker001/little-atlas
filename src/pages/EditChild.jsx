import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Camera, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Spinner from '../components/Spinner'

export default function EditChild() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [child, setChild] = useState(null)
  const [form, setForm] = useState({
    name: '', birthdate: '', birthTime: '', birthLocation: '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error || !data) { navigate('/home', { replace: true }); return }
      setChild(data)
      setForm({
        name: data.name,
        birthdate: data.birthdate ?? '',
        birthTime: data.birth_time ?? '',
        birthLocation: data.birth_location ?? '',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    setError('')
    if (!form.name.trim()) { setError('Name is required.'); return }
    setSaving(true)
    try {
      let photo_url = child.photo_url

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

      const { error: updateError } = await supabase
        .from('children')
        .update({
          name: form.name.trim(),
          birthdate: form.birthdate || null,
          birth_time: form.birthTime || null,
          birth_location: form.birthLocation.trim() || null,
          photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) throw updateError
      navigate(`/child/${id}`)
    } catch (err) {
      setError(err.message || 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const { error: err } = await supabase.from('children').delete().eq('id', id)
      if (err) throw err
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not delete.')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-sm bg-cream-100 min-h-svh flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const currentPhoto = photoPreview ?? child.photo_url
  const initials = form.name[0]?.toUpperCase() ?? '?'

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-atlas-dark">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <h1 className="font-serif text-xl font-medium text-[#1C1917]">Edit Profile</h1>
      </div>

      {/* Photo */}
      <div className="flex justify-center mt-2 mb-8">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-20 h-20 rounded-full bg-cream-300 flex items-center justify-center hover:bg-cream-400 transition-colors overflow-hidden relative"
        >
          {currentPhoto ? (
            <img src={currentPhoto} alt={form.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-serif text-2xl font-medium text-atlas-warm">{initials}</span>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-atlas-dark flex items-center justify-center">
            <Camera size={12} className="text-white" strokeWidth={1.5} />
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      {/* Form */}
      <div className="flex-1 px-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">
            Name <span className="text-atlas-muted">*</span>
          </label>
          <input
            value={form.name}
            onChange={set('name')}
            maxLength={60}
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] focus:outline-none focus:border-atlas-dark transition-colors"
          />
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
            <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Birth Time</label>
            <input
              type="time"
              value={form.birthTime}
              onChange={set('birthTime')}
              className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] focus:outline-none focus:border-atlas-dark transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Birth Location</label>
          <input
            value={form.birthLocation}
            onChange={set('birthLocation')}
            placeholder="City, State, Country"
            className="w-full bg-white rounded-xl border border-cream-300 px-4 py-3 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark transition-colors"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Actions */}
      <div className="px-5 pt-6 pb-10 space-y-3">
        <button
          onClick={handleSave}
          disabled={!form.name.trim() || saving}
          className="w-full bg-atlas-dark disabled:bg-atlas-muted text-white rounded-2xl py-4 font-medium text-base transition-colors flex items-center justify-center gap-2"
        >
          {saving ? <Spinner size="sm" /> : null}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-400 py-2"
          >
            <Trash2 size={14} strokeWidth={1.5} />
            Delete this child's profile
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-600 font-medium mb-1">Delete {form.name}'s profile?</p>
            <p className="text-xs text-red-400 mb-4">
              This will permanently delete all their sizes, activities, notes, and accounts.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 bg-cream-200 text-atlas-warm rounded-xl py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2"
              >
                {deleting ? <Spinner size="sm" /> : null}
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
