import { useNavigate } from 'react-router-dom'
import { Clock, Sparkles, Settings } from 'lucide-react'
import { children } from '../data/mockData'
import BottomNav from '../components/BottomNav'

export default function Home() {
  const navigate = useNavigate()

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

      {/* Child cards */}
      <div className="flex-1 px-5 pt-4 space-y-4">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => navigate(`/child/${child.id}`)}
            className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-cream-200 active:bg-cream-50 transition-colors"
          >
            {/* Child header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cream-300 flex items-center justify-center shrink-0">
                  <span className="font-serif text-sm font-medium text-atlas-warm">
                    {child.initials}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#1C1917] text-sm leading-tight">{child.name}</p>
                  <p className="text-xs text-atlas-muted">{child.age} years old</p>
                </div>
              </div>
              {child.needsAttention.length > 0 && (
                <div className="flex items-center gap-1 text-atlas-muted">
                  <Clock size={12} strokeWidth={1.5} />
                  <span className="text-[11px]">Shoe size updated Dec 8</span>
                </div>
              )}
            </div>

            {/* Weekly theme card */}
            <div className="bg-cream-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-atlas-warm" />
                  <span className="text-[11px] font-medium text-atlas-warm">
                    Theme: {child.weeklyTheme}
                  </span>
                </div>
                <Sparkles size={14} className="text-cream-400" />
              </div>
              <p className="text-xs text-atlas-warm leading-relaxed">
                {child.weeklyThemeDesc}
              </p>
            </div>
          </button>
        ))}

        {/* Add another child */}
        <button
          onClick={() => navigate('/add-child')}
          className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-dashed border-cream-400 flex items-center justify-center gap-2 text-sm text-atlas-muted hover:border-atlas-muted transition-colors"
        >
          + Add another child
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
