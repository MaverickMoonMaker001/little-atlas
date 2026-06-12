import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Pencil } from 'lucide-react'
import { children } from '../data/mockData'
import BottomNav from '../components/BottomNav'
import OverviewTab from './tabs/OverviewTab'
import PhysicalTab from './tabs/PhysicalTab'

const TABS = ['Overview', 'Astrology', 'Physical', 'Activities']

export default function ChildProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')

  const child = children.find((c) => c.id === id) ?? children[0]

  const initials = child.name[0]

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col pb-16">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4">
        <button onClick={() => navigate('/home')} className="p-1 -ml-1 text-atlas-dark">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-cream-400 text-sm font-medium text-atlas-dark bg-white">
          <Pencil size={13} strokeWidth={1.5} />
          Edit Profile
        </button>
      </div>

      {/* Child identity */}
      <div className="flex items-center gap-4 px-5 pb-4">
        <div className="w-14 h-14 rounded-full bg-cream-300 flex items-center justify-center shrink-0">
          <span className="font-serif text-xl font-medium text-atlas-warm">{initials}</span>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#1C1917] leading-tight">
            {child.name}
          </h2>
          <p className="text-sm text-atlas-muted">
            {child.age} years old · {child.birthdate}
          </p>
        </div>
      </div>

      {/* Tab row */}
      <div className="flex gap-2 px-5 pb-4 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-atlas-dark text-white'
                : 'bg-cream-200 text-atlas-warm hover:bg-cream-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-cream-300 mx-5" />

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Overview' && <OverviewTab child={child} />}
        {activeTab === 'Physical' && <PhysicalTab child={child} />}
        {(activeTab === 'Astrology' || activeTab === 'Activities') && (
          <ComingSoon tab={activeTab} />
        )}
      </div>

      <BottomNav />
    </div>
  )
}

function ComingSoon({ tab }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <p className="font-serif text-lg text-atlas-warm mb-2">{tab}</p>
      <p className="text-sm text-atlas-muted">
        This section will be wired up with real data in bolt.new.
      </p>
    </div>
  )
}
