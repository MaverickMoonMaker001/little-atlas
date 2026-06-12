import { useState } from 'react'
import { Sun, Bell, Shield, Download, ChevronRight, LogOut } from 'lucide-react'
import BottomNav from '../components/BottomNav'

const FREQUENCIES = ['Monthly', 'Quarterly', 'Manual']

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        on ? 'bg-atlas-dark' : 'bg-cream-400'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false)
  const [reminders, setReminders] = useState(true)
  const [frequency, setFrequency] = useState('Monthly')

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
              right={<Toggle on={darkMode} onToggle={() => setDarkMode((v) => !v)} />}
            />
            <SettingRow
              icon={<Bell size={16} className="text-atlas-warm" strokeWidth={1.5} />}
              label="Weekly Insight Reminders"
              right={<Toggle on={reminders} onToggle={() => setReminders((v) => !v)} />}
            />
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-[#1C1917] mb-3">
                Growth Reminder Frequency
              </p>
              <div className="flex gap-1 bg-cream-100 rounded-xl p-1">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      frequency === f
                        ? 'bg-white text-atlas-dark shadow-sm'
                        : 'text-atlas-muted'
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
              right={<span className="text-sm text-atlas-muted">parent@family.com</span>}
            />
            <SettingRow
              label="Change Password"
              right={<ChevronRight size={16} className="text-atlas-muted" strokeWidth={1.5} />}
              clickable
            />
            <SettingRow
              icon={<LogOut size={16} className="text-atlas-warm" strokeWidth={1.5} />}
              label="Log Out"
              clickable
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
          <button className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm border border-cream-200 active:bg-cream-50 transition-colors">
            <Download size={16} className="text-atlas-warm" strokeWidth={1.5} />
            <span className="text-sm font-medium text-[#1C1917]">Export All Data</span>
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
        <p className="text-[10px] font-medium tracking-widest text-atlas-muted uppercase">
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-atlas-muted mt-0.5 leading-snug">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

function SettingRow({ icon, label, right, clickable }) {
  const inner = (
    <div className={`flex items-center justify-between px-4 py-3.5 ${clickable ? 'active:bg-cream-50 cursor-pointer' : ''}`}>
      <div className="flex items-center gap-3">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="text-sm font-medium text-[#1C1917]">{label}</span>
      </div>
      {right && <span className="shrink-0">{right}</span>}
    </div>
  )
  return clickable ? <button className="w-full text-left">{inner}</button> : <div>{inner}</div>
}
