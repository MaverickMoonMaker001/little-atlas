import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Sparkles, Settings } from 'lucide-react'

const tabs = [
  { label: 'Home',     icon: Home,     path: '/home' },
  { label: 'Insights', icon: Sparkles,  path: '/insights' },
  { label: 'Settings', icon: Settings,  path: '/settings' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-cream-300 z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {tabs.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path ||
            (path === '/home' && location.pathname.startsWith('/child'))
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-4 py-1"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2 : 1.5}
                className={active ? 'text-atlas-dark' : 'text-atlas-muted'}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-atlas-dark' : 'text-atlas-muted'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
      <div className="h-safe-bottom" />
    </div>
  )
}
