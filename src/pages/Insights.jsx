import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import Spinner from '../components/Spinner'
import { getInsightForChild } from '../data/insightThemes'

export default function Insights() {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('children')
        .select('id, name, birthdate')
        .order('created_at', { ascending: true })
      setChildren(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col pb-16 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cream-200 -translate-y-8 translate-x-8 pointer-events-none"
        style={{ position: 'absolute' }}
      />

      {/* Header */}
      <div className="relative px-5 pt-14 pb-4">
        <h1 className="font-serif text-3xl font-medium text-[#1C1917] leading-tight">
          Weekly Insights
        </h1>
        <p className="text-sm text-atlas-warm mt-1.5 leading-snug">
          A calm overview of the themes and rhythms shaping your family this week.
        </p>
      </div>

      <div className="relative flex-1 px-5 space-y-5 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-cream-200">
            <p className="font-serif text-lg text-atlas-warm mb-2">No children yet</p>
            <p className="text-sm text-atlas-muted">Add a child to see weekly insights.</p>
          </div>
        ) : (
          children.map((child) => {
            const insight = child.birthdate ? getInsightForChild(child.birthdate) : null

            return (
              <div key={child.id} className="flex gap-3">
                <div className="flex flex-col items-center pt-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-atlas-dark bg-atlas-dark" />
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#1C1917] text-sm">{child.name}</span>
                    {insight && (
                      <span className="flex items-center gap-1 bg-cream-200 text-atlas-warm rounded-full px-2.5 py-0.5 text-[11px]">
                        <Sparkles size={10} />
                        {insight.sign}
                      </span>
                    )}
                  </div>

                  {insight ? (
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200">
                      <p className="text-xs font-medium text-atlas-warm mb-2">{insight.theme}</p>
                      <p className="text-sm text-[#1C1917] leading-relaxed mb-4">{insight.body}</p>
                      <div className="space-y-1.5">
                        <InsightRow label="Best support" value={insight.bestSupport} />
                        <InsightRow label="Watch for"    value={insight.watchFor} />
                        <InsightRow label="Try"          value={insight.tryThis} />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200">
                      <p className="text-sm text-atlas-muted">
                        Add a birthdate to {child.name}'s profile to unlock weekly insights.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <BottomNav />
    </div>
  )
}

function InsightRow({ label, value }) {
  return (
    <div className="flex gap-2 items-baseline">
      <span className="text-[10px] text-atlas-muted">•</span>
      <p className="text-xs text-atlas-warm">
        <span className="font-medium text-[#1C1917]">{label}:</span> {value}
      </p>
    </div>
  )
}
