import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/Spinner'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NotesTab({ childId, refreshKey, onDataChanged }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    const { data } = await supabase
      .from('child_notes')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
    setNotes(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [childId, refreshKey])

  async function handleSave() {
    if (!content.trim()) return
    setError('')
    setSaving(true)
    try {
      const { error: err } = await supabase.from('child_notes').insert({
        child_id: childId,
        content: content.trim(),
      })
      if (err) throw err
      setContent('')
      loadData()
      onDataChanged()
    } catch (err) {
      setError(err.message || 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    await supabase.from('child_notes').delete().eq('id', id)
    setNotes((n) => n.filter((x) => x.id !== id))
    onDataChanged()
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  return (
    <div className="px-5 pt-4 pb-6 space-y-4">
      {/* Add note */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200 space-y-3">
        <p className="text-[10px] font-medium tracking-widest text-atlas-muted uppercase">New note</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write anything — milestones, observations, reminders…"
          rows={4}
          className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark resize-none leading-relaxed"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="w-full bg-atlas-dark disabled:bg-atlas-muted text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {saving ? <Spinner size="sm" /> : <Plus size={14} strokeWidth={2} />}
          {saving ? 'Saving…' : 'Add Note'}
        </button>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-cream-200">
          <p className="font-serif text-base text-atlas-warm mb-1">No notes yet</p>
          <p className="text-xs text-atlas-muted">Add your first note above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200">
              <p className="text-sm text-[#1C1917] leading-relaxed whitespace-pre-wrap">{note.content}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-[10px] text-atlas-muted">{formatDate(note.created_at)}</p>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="flex items-center gap-1 text-xs text-atlas-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} strokeWidth={1.5} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
