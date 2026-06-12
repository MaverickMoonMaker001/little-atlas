import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Sparkles, Settings } from 'lucide-react'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import Spinner from '../components/Spinner'
import { getInsightForChild } from '../data/insightThemes'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function needsAttentionFlags(latestSize) {
  const flags = []
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180)

  if (!latestSize) {
    flags.push({ text: 'Shoe size has never been recorded', date: null })
  } else if (new Date(latestSize.recorded_at) < sixMonthsAgo) {
    flags.push({ text: 'Shoe size last updated', date: latestSize.recorded_at })
  }
  return flags
}

export default function Home() {
  const navigate = useNavigate()
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: kids, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: true })

      if (error || !kids) { setLoading(false); return }

      const enriched = await Promise.all(
        kids.map(async (child) => {
          const { data: sizes } = await supabase
            .from('size_history')
            .select('*')
            .eq('child_id', child.id)
            .order('recorded_at', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(1)
          return {
            ...child,
            latestSize: sizes?.[0] ?? null,
          }
        })
      )
      setChildren(enriched)
      setLoading(false)
    }
    load()
  }, [])

  function getAge(birthdate) {
    if (!birthdate) return null
    return Math.floor((Date.now() - new Date(birthdate)) / (365.25 * 24 * 3600 * 1000))
  }

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col pb-16">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-14 pb-2">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#1C1917] leading-tight">
            Your Little Atlas
          </h1>
          <p className="text-sm text-atlas-warm mt-1.5 leading-snug max-w-[240px]">
            Quick view of each child's details, reminders, and weekly themes.
          </p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="mt-1 w-9 h-9 rounded-full bg-white border border-cream-300 flex items-center justify-center shadow-sm shrink-0"
        >
          <Settings size={16} className="text-atlas-warm" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 px-5 pt-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-cream-200">
            <p className="font-serif text-lg text-atlas-warm mb-2">No children yet</p>
            <p className="text-sm text-atlas-muted mb-5">Add your first child to get started.</p>
            <button
              onClick={() => navigate('/add-child')}
              className="bg-atlas-dark text-white rounded-xl px-6 py-2.5 text-sm font-medium"
            >
              Add First Child
            </button>
          </div>
        ) : (
          children.map((child) => {
            const age = getAge(child.birthdate)
            const flags = needsAttentionFlags(child.latestSize)
            const initials = child.name[0].toUpperCase()
            const insight = child.birthdate ? getInsightForChild(child.birthdate) : null

            return (
              <button
                key={child.id}
                onClick={() => navigate(`/child/${child.id}`)}
                className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-cream-200 active:bg-cream-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cream-300 flex items-center justify-center shrink-0 overflow-hidden">
                      {child.photo_url ? (
                        <img src={child.photo_url} alt={child.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif text-sm font-medium text-atlas-warm">{initials}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#1C1917] text-sm leading-tight">{child.name}</p>
                      <p className="text-xs text-atlas-muted">
                        {age !== null ? `${age} years old` : 'Age unknown'}
                      </p>
                    </div>
                  </div>
                  {flags.length > 0 && (
                    <div className="flex items-center gap-1 text-atlas-muted">
                      <Clock size={12} strokeWidth={1.5} />
                      <span className="text-[11px]">Needs attention</span>
                    </div>
                  )}
                </div>

                {/* Needs attention detail */}
                {flags.length > 0 && (
                  <div className="bg-cream-200 rounded-xl px-3 py-2 mb-2">
                    {flags.map((f, i) => (
                      <p key={i} className="text-[11px] text-atlas-warm">
                        {f.text}{f.date ? ` · ${formatDate(f.date)}` : ''}
                      </p>
                    ))}
                  </div>
                )}

                {/* Weekly theme badge */}
                <div className="bg-cream-100 rounded-xl p-3">
                  {insight ? (
                    <>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles size={12} className="text-atlas-warm" />
                        <span className="text-[11px] font-medium text-atlas-warm uppercase tracking-wide">
                          {insight.sign} · {insight.theme}
                        </span>
                      </div>
                      <p className="text-xs text-atlas-warm leading-relaxed line-clamp-2">
                        {insight.body}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-atlas-muted">Add a birthdate to unlock weekly themes.</p>
                  )}
                </div>
              </button>
            )
          })
        )}

        {!loading && (
          <button
            onClick={() => navigate('/add-child')}
            className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-dashed border-cream-400 flex items-center justify-center gap-2 text-sm text-atlas-muted hover:border-atlas-muted transition-colors"
          >
            + Add another child
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
