import { useState, useEffect } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Clock, Globe, User, Phone } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/Spinner'
import AddActivityModal from '../../components/modals/AddActivityModal'

const CATEGORY_COLORS = {
  Sport:     'bg-blue-100 text-blue-700',
  Education: 'bg-amber-100 text-amber-700',
  Arts:      'bg-pink-100 text-pink-700',
  Community: 'bg-green-100 text-green-700',
  Other:     'bg-cream-300 text-atlas-warm',
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ActivitiesTab({ childId, refreshKey, onDataChanged }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [showModal, setShowModal] = useState(false)

  async function loadData() {
    setLoading(true)
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('child_id', childId)
      .order('activity_date', { ascending: false })
      .order('created_at', { ascending: false })
    setActivities(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [childId, refreshKey])

  function handleSaved() { loadData(); onDataChanged() }

  async function handleDelete(id) {
    await supabase.from('activities').delete().eq('id', id)
    setActivities((a) => a.filter((x) => x.id !== id))
    if (expanded === id) setExpanded(null)
    onDataChanged()
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  return (
    <div className="px-5 pt-4 pb-6 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium tracking-widest text-atlas-muted uppercase">
          Activities
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-atlas-dark text-white rounded-full px-3 py-1.5 text-xs font-medium"
        >
          <Plus size={12} strokeWidth={2} />
          Log Activity
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-cream-200">
          <p className="font-serif text-base text-atlas-warm mb-2">No activities yet</p>
          <p className="text-xs text-atlas-muted mb-4">Tap "Log Activity" to add one.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-atlas-dark text-white rounded-xl px-5 py-2 text-xs font-medium"
          >
            Log Activity
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((act) => {
            const isOpen = expanded === act.id
            const colorClass = CATEGORY_COLORS[act.category] ?? CATEGORY_COLORS.Other

            return (
              <div key={act.id} className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : act.id)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1917] truncate">{act.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                        {act.category}
                      </span>
                      <span className="text-xs text-atlas-muted">{formatDate(act.activity_date)}</span>
                      {act.hours_estimate != null && (
                        <span className="text-xs text-atlas-muted">{act.hours_estimate}h/session</span>
                      )}
                    </div>
                  </div>
                  {isOpen
                    ? <ChevronUp size={15} className="text-atlas-muted shrink-0" />
                    : <ChevronDown size={15} className="text-atlas-muted shrink-0" />
                  }
                </button>

                {isOpen && (
                  <div className="px-4 pb-3 border-t border-cream-200 pt-3 space-y-2">
                    {act.notes && (
                      <p className="text-xs text-atlas-warm leading-relaxed">{act.notes}</p>
                    )}

                    {(act.poc_name || act.poc_phone) && (
                      <div className="flex items-center gap-3">
                        {act.poc_name && (
                          <span className="flex items-center gap-1 text-xs text-atlas-muted">
                            <User size={11} strokeWidth={1.5} />
                            {act.poc_name}
                          </span>
                        )}
                        {act.poc_phone && (
                          <a
                            href={`tel:${act.poc_phone}`}
                            className="flex items-center gap-1 text-xs text-atlas-dark"
                          >
                            <Phone size={11} strokeWidth={1.5} />
                            {act.poc_phone}
                          </a>
                        )}
                      </div>
                    )}

                    {act.website && (
                      <a
                        href={act.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-atlas-dark underline underline-offset-2"
                      >
                        <Globe size={11} strokeWidth={1.5} />
                        {act.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}

                    {act.hours_estimate != null && (
                      <span className="flex items-center gap-1 text-xs text-atlas-muted">
                        <Clock size={11} strokeWidth={1.5} />
                        {act.hours_estimate} hr{act.hours_estimate !== 1 ? 's' : ''} per session (est.)
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(act.id)}
                      className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors pt-1"
                    >
                      <Trash2 size={12} strokeWidth={1.5} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <AddActivityModal
          childId={childId}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
