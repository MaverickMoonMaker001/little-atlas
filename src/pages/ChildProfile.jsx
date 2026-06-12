import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Pencil } from 'lucide-react'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import Spinner from '../components/Spinner'
import OverviewTab from './tabs/OverviewTab'
import PhysicalTab from './tabs/PhysicalTab'
import ActivitiesTab from './tabs/ActivitiesTab'
import NotesTab from './tabs/NotesTab'
import AstrologyTab from './tabs/AstrologyTab'

const TABS = ['Overview', 'Astrology', 'Physical', 'Activities', 'Notes']

export default function ChildProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error || !data) {
        navigate('/home', { replace: true })
        return
      }
      setChild(data)
      setLoading(false)
    }
    load()
  }, [id, refreshKey])

  function refresh() { setRefreshKey((k) => k + 1) }

  if (loading) {
    return (
      <div className="w-full max-w-sm bg-cream-100 min-h-svh flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const initials = child.name[0].toUpperCase()
  const age = child.birthdate
    ? Math.floor((Date.now() - new Date(child.birthdate)) / (365.25 * 24 * 3600 * 1000))
    : null

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col pb-16">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4">
        <button onClick={() => navigate('/home')} className="p-1 -ml-1 text-atlas-dark">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => navigate(`/child/${id}/edit`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-cream-400 text-sm font-medium text-atlas-dark bg-white"
        >
          <Pencil size={13} strokeWidth={1.5} />
          Edit Profile
        </button>
      </div>

      {/* Child identity */}
      <div className="flex items-center gap-4 px-5 pb-4">
        <div className="w-14 h-14 rounded-full bg-cream-300 flex items-center justify-center shrink-0 overflow-hidden">
          {child.photo_url ? (
            <img src={child.photo_url} alt={child.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-serif text-xl font-medium text-atlas-warm">{initials}</span>
          )}
        </div>
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#1C1917] leading-tight">
            {child.name}
          </h2>
          <p className="text-sm text-atlas-muted">
            {age !== null ? `${age} years old` : 'Age unknown'}
            {child.birthdate ? ` · ${child.birthdate}` : ''}
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

      <div className="h-px bg-cream-300 mx-5" />

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Overview' && (
          <OverviewTab child={child} refreshKey={refreshKey} onDataChanged={refresh} />
        )}
        {activeTab === 'Astrology' && (
          <AstrologyTab child={child} />
        )}
        {activeTab === 'Physical' && (
          <PhysicalTab childId={child.id} gender={child.gender} refreshKey={refreshKey} onDataChanged={refresh} />
        )}
        {activeTab === 'Activities' && (
          <ActivitiesTab childId={child.id} refreshKey={refreshKey} onDataChanged={refresh} />
        )}
        {activeTab === 'Notes' && (
          <NotesTab childId={child.id} refreshKey={refreshKey} onDataChanged={refresh} />
        )}
      </div>

      <BottomNav />
    </div>
  )
}
