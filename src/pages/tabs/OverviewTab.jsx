import { useState, useEffect } from 'react'
import { Clock, Ruler, Briefcase, KeyRound, FileText, Sparkles, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/Spinner'
import AddSizeModal from '../../components/modals/AddSizeModal'
import AddActivityModal from '../../components/modals/AddActivityModal'
import AddAccountModal from '../../components/modals/AddAccountModal'
import AddNoteModal from '../../components/modals/AddNoteModal'
import { getInsightForChild } from '../../data/insightThemes'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function needsAttentionFlags(latestSize, latestActivity) {
  const flags = []
  const now = new Date()
  const sixMonthsAgo = new Date(now)
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180)
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  if (!latestSize || new Date(latestSize.recorded_at) < sixMonthsAgo) {
    flags.push('Shoe size has not been updated in 6 months')
  }
  if (!latestActivity || new Date(latestActivity.activity_date) < thirtyDaysAgo) {
    flags.push('No activities logged in 30 days')
  }
  return flags
}

const QUICK_ACTIONS = [
  { icon: Ruler,     label: 'Add Size',     modal: 'size' },
  { icon: Briefcase, label: 'Log Activity', modal: 'activity' },
  { icon: KeyRound,  label: 'Add Account',  modal: 'account' },
  { icon: FileText,  label: 'Add Note',     modal: 'note' },
]

export default function OverviewTab({ child, onDataChanged }) {
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [latestSize, setLatestSize] = useState(null)
  const [latestActivity, setLatestActivity] = useState(null)
  const [notes, setNotes] = useState([])
  const [accounts, setAccounts] = useState([])
  const [showNotes, setShowNotes] = useState(false)
  const [showAccounts, setShowAccounts] = useState(false)

  async function loadData() {
    setLoading(true)
    const [sizeRes, actRes, notesRes, accsRes] = await Promise.all([
      supabase.from('size_history').select('*').eq('child_id', child.id).order('recorded_at', { ascending: false }).limit(1),
      supabase.from('activities').select('*').eq('child_id', child.id).order('activity_date', { ascending: false }).limit(1),
      supabase.from('child_notes').select('*').eq('child_id', child.id).order('created_at', { ascending: false }),
      supabase.from('child_accounts').select('*').eq('child_id', child.id).order('created_at', { ascending: false }),
    ])
    setLatestSize(sizeRes.data?.[0] ?? null)
    setLatestActivity(actRes.data?.[0] ?? null)
    setNotes(notesRes.data ?? [])
    setAccounts(accsRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [child.id])

  function handleSaved() { loadData(); onDataChanged() }

  async function deleteNote(noteId) {
    await supabase.from('child_notes').delete().eq('id', noteId)
    setNotes((n) => n.filter((x) => x.id !== noteId))
  }

  async function deleteAccount(accountId) {
    await supabase.from('child_accounts').delete().eq('id', accountId)
    setAccounts((a) => a.filter((x) => x.id !== accountId))
  }

  const flags = needsAttentionFlags(latestSize, latestActivity)
  const insight = child.birthdate ? getInsightForChild(child.birthdate) : null

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  return (
    <div className="px-5 pt-4 pb-6 space-y-5">
      {/* Needs attention */}
      {flags.length > 0 && (
        <div className="bg-cream-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={15} className="text-atlas-warm" strokeWidth={1.5} />
            <span className="text-sm font-medium text-[#1C1917]">Needs attention</span>
          </div>
          <ul className="space-y-1">
            {flags.map((item) => (
              <li key={item} className="text-sm text-atlas-warm flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-atlas-muted shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weekly insight */}
      {insight && (
        <div className="bg-cream-200 rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={13} className="text-atlas-warm" />
            <span className="text-[11px] font-medium text-atlas-warm uppercase tracking-wide">
              {insight.sign} · {insight.theme}
            </span>
          </div>
          <p className="text-xs text-atlas-warm leading-relaxed line-clamp-3">{insight.body}</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map(({ icon: Icon, label, modal: m }) => (
          <button
            key={label}
            onClick={() => setModal(m)}
            className="bg-white rounded-2xl flex flex-col items-center justify-center gap-2 py-4 text-center shadow-sm border border-cream-200 active:bg-cream-100 transition-colors"
          >
            <Icon size={20} className="text-atlas-dark" strokeWidth={1.5} />
            <span className="text-[10px] font-medium text-atlas-warm leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* At a glance */}
      <div>
        <p className="text-[10px] font-medium tracking-widest text-atlas-muted uppercase mb-2 px-1">
          At a glance
        </p>
        <div className="bg-cream-200 rounded-2xl divide-y divide-cream-300 overflow-hidden">
          <Row label="Clothing Size"   value={latestSize?.clothing_size ?? '—'} />
          <Row label="Shoe Size"       value={latestSize?.shoe_size ?? '—'} />
          <Row label="Latest Activity" value={latestActivity?.name ?? '—'} truncate />

          {/* Notes expandable row */}
          <div>
            <button
              onClick={() => setShowNotes((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 gap-4"
            >
              <span className="text-sm text-atlas-warm shrink-0">Notes</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#1C1917]">{notes.length}</span>
                {showNotes ? <ChevronUp size={14} className="text-atlas-muted" /> : <ChevronDown size={14} className="text-atlas-muted" />}
              </div>
            </button>
            {showNotes && (
              <div className="px-4 pb-3 space-y-2">
                {notes.length === 0 && <p className="text-xs text-atlas-muted">No notes yet.</p>}
                {notes.map((note) => (
                  <div key={note.id} className="bg-white rounded-xl p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#1C1917] leading-relaxed">{note.content}</p>
                      <p className="text-[10px] text-atlas-muted mt-1">{formatDate(note.created_at)}</p>
                    </div>
                    <button onClick={() => deleteNote(note.id)} className="shrink-0 text-atlas-muted hover:text-red-400 transition-colors">
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accounts expandable row */}
          <div>
            <button
              onClick={() => setShowAccounts((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 gap-4"
            >
              <span className="text-sm text-atlas-warm shrink-0">Accounts</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#1C1917]">{accounts.length}</span>
                {showAccounts ? <ChevronUp size={14} className="text-atlas-muted" /> : <ChevronDown size={14} className="text-atlas-muted" />}
              </div>
            </button>
            {showAccounts && (
              <div className="px-4 pb-3 space-y-2">
                {accounts.length === 0 && <p className="text-xs text-atlas-muted">No accounts yet.</p>}
                {accounts.map((acc) => (
                  <div key={acc.id} className="bg-white rounded-xl p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1C1917]">{acc.platform}</p>
                      {acc.username && <p className="text-xs text-atlas-muted">{acc.username}</p>}
                      {acc.password_hint && <p className="text-[10px] text-atlas-muted mt-0.5">Hint: {acc.password_hint}</p>}
                    </div>
                    <button onClick={() => deleteAccount(acc.id)} className="shrink-0 text-atlas-muted hover:text-red-400 transition-colors">
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === 'size'     && <AddSizeModal     childId={child.id} onClose={() => setModal(null)} onSaved={handleSaved} />}
      {modal === 'activity' && <AddActivityModal childId={child.id} onClose={() => setModal(null)} onSaved={handleSaved} />}
      {modal === 'account'  && <AddAccountModal  childId={child.id} onClose={() => setModal(null)} onSaved={handleSaved} />}
      {modal === 'note'     && <AddNoteModal     childId={child.id} onClose={() => setModal(null)} onSaved={handleSaved} />}
    </div>
  )
}

function Row({ label, value, truncate }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <span className="text-sm text-atlas-warm shrink-0">{label}</span>
      <span className={`text-sm font-medium text-[#1C1917] text-right ${truncate ? 'truncate max-w-[55%]' : ''}`}>
        {value}
      </span>
    </div>
  )
}
