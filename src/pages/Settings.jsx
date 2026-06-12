import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Bell, Shield, Download, ChevronRight, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../store/authStore'
import BottomNav from '../components/BottomNav'
import Spinner from '../components/Spinner'

const FREQUENCIES = ['Monthly', 'Quarterly', 'Manual']
const FREQ_MAP = { Monthly: 'monthly', Quarterly: 'quarterly', Manual: 'manual' }
const FREQ_REVERSE = { monthly: 'Monthly', quarterly: 'Quarterly', manual: 'Manual' }

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-atlas-dark' : 'bg-cream-400'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function downloadCsv(filename, rows) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => {
        const val = row[h] == null ? '' : String(row[h]).replace(/"/g, '""')
        return `"${val}"`
      }).join(',')
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function Settings() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [reminders, setReminders] = useState(true)
  const [frequency, setFrequency] = useState('Monthly')
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  // Load profile preferences
  useEffect(() => {
    if (!user) return
    async function load() {
      const { data } = await supabase
        .from('profiles')
        .select('weekly_reminders, reminder_frequency')
        .eq('id', user.id)
        .maybeSingle()
      if (data) {
        setReminders(data.weekly_reminders ?? true)
        setFrequency(FREQ_REVERSE[data.reminder_frequency] ?? 'Monthly')
      }
      setProfileLoaded(true)
    }
    load()
  }, [user])

  // Persist dark mode to localStorage + DOM
  function toggleDarkMode() {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('darkMode', String(next))
    document.documentElement.classList.toggle('dark', next)
  }

  async function toggleReminders() {
    const next = !reminders
    setReminders(next)
    await supabase.from('profiles').upsert({ id: user.id, weekly_reminders: next })
  }

  async function setFreq(label) {
    setFrequency(label)
    const val = FREQ_MAP[label]
    await supabase.from('profiles').upsert({ id: user.id, reminder_frequency: val })
  }

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch {
      setSigningOut(false)
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      const [childrenRes, sizesRes, activitiesRes] = await Promise.all([
        supabase.from('children').select('*'),
        supabase.from('size_history').select('*, children(name)'),
        supabase.from('activities').select('*, children(name)'),
      ])

      if (childrenRes.data?.length) {
        downloadCsv('children.csv', childrenRes.data.map((c) => ({
          name: c.name,
          birthdate: c.birthdate,
          birth_time: c.birth_time,
          birth_location: c.birth_location,
          created_at: c.created_at,
        })))
      }

      if (sizesRes.data?.length) {
        downloadCsv('sizes.csv', sizesRes.data.map((s) => ({
          child_name: s.children?.name ?? '',
          clothing_size: s.clothing_size,
          shoe_size: s.shoe_size,
          recorded_at: s.recorded_at,
          notes: s.notes,
        })))
      }

      if (activitiesRes.data?.length) {
        downloadCsv('activities.csv', activitiesRes.data.map((a) => ({
          child_name: a.children?.name ?? '',
          name: a.name,
          category: a.category,
          activity_date: a.activity_date,
          notes: a.notes,
        })))
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col pb-16">
      <div className="flex-1 px-5 pt-14 space-y-6">
        <h1 className="font-serif text-3xl font-medium text-[#1C1917]">Settings</h1>

        {/* Preferences */}
        <Section label="Preferences">
          <div className="bg-white rounded-2xl divide-y divide-cream-200 overflow-hidden shadow-sm border border-cream-200">
            <SettingRow
              icon={<Sun size={16} className="text-atlas-warm" strokeWidth={1.5} />}
              label="Celestial Theme (Dark Mode)"
              right={<Toggle on={darkMode} onToggle={toggleDarkMode} />}
            />
            <SettingRow
              icon={<Bell size={16} className="text-atlas-warm" strokeWidth={1.5} />}
              label="Weekly Insight Reminders"
              right={
                profileLoaded
                  ? <Toggle on={reminders} onToggle={toggleReminders} />
                  : <Spinner size="sm" />
              }
            />
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-[#1C1917] mb-3">
                Growth Reminder Frequency
              </p>
              <div className="flex gap-1 bg-cream-100 rounded-xl p-1">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFreq(f)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      frequency === f ? 'bg-white text-atlas-dark shadow-sm' : 'text-atlas-muted'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Account */}
        <Section label="Account">
          <div className="bg-white rounded-2xl divide-y divide-cream-200 overflow-hidden shadow-sm border border-cream-200">
            <SettingRow
              label="Email"
              right={<span className="text-sm text-atlas-muted truncate max-w-[170px]">{user?.email ?? '…'}</span>}
            />
            <SettingRow
              label="Change Password"
              right={<ChevronRight size={16} className="text-atlas-muted" strokeWidth={1.5} />}
              clickable
              onClick={async () => {
                if (user?.email) {
                  await supabase.auth.resetPasswordForEmail(user.email)
                  alert('Password reset email sent.')
                }
              }}
            />
            <SettingRow
              icon={
                signingOut
                  ? <Spinner size="sm" />
                  : <LogOut size={16} className="text-atlas-warm" strokeWidth={1.5} />
              }
              label="Log Out"
              clickable
              onClick={handleSignOut}
            />
          </div>
        </Section>

        {/* Data & privacy */}
        <Section
          label={
            <span className="flex items-center gap-1.5">
              <Shield size={12} className="text-atlas-muted" strokeWidth={1.5} />
              Data &amp; Privacy
            </span>
          }
          subtitle="Your family data is private. Export or delete it at any time."
        >
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm border border-cream-200 active:bg-cream-50 transition-colors disabled:opacity-60"
          >
            {exporting ? <Spinner size="sm" /> : <Download size={16} className="text-atlas-warm" strokeWidth={1.5} />}
            <span className="text-sm font-medium text-[#1C1917]">
              {exporting ? 'Exporting…' : 'Export Child Data'}
            </span>
          </button>
        </Section>
      </div>

      <BottomNav />
    </div>
  )
}

function Section({ label, subtitle, children }) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-[10px] font-medium tracking-widest text-atlas-muted uppercase">{label}</p>
        {subtitle && <p className="text-xs text-atlas-muted mt-0.5 leading-snug">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function SettingRow({ icon, label, right, clickable, onClick }) {
  const inner = (
    <div className={`flex items-center justify-between px-4 py-3.5 ${clickable ? 'active:bg-cream-50 cursor-pointer' : ''}`}>
      <div className="flex items-center gap-3">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="text-sm font-medium text-[#1C1917]">{label}</span>
      </div>
      {right && <span className="shrink-0">{right}</span>}
    </div>
  )
  return clickable
    ? <button className="w-full text-left" onClick={onClick}>{inner}</button>
    : <div>{inner}</div>
}
