import { Clock, Ruler, Briefcase, KeyRound, FileText, Sparkles } from 'lucide-react'

const quickActions = [
  { icon: Ruler,     label: 'Add Size' },
  { icon: Briefcase, label: 'Log Activity' },
  { icon: KeyRound,  label: 'Add Account' },
  { icon: FileText,  label: 'Add Note' },
]

export default function OverviewTab({ child }) {
  return (
    <div className="px-5 pt-4 pb-6 space-y-5">
      {/* Needs attention */}
      {child.needsAttention.length > 0 && (
        <div className="bg-cream-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={15} className="text-atlas-warm" strokeWidth={1.5} />
            <span className="text-sm font-medium text-[#1C1917]">Needs attention</span>
          </div>
          <ul className="space-y-1">
            {child.needsAttention.map((item) => (
              <li key={item} className="text-sm text-atlas-warm flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-atlas-muted shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map(({ icon: Icon, label }) => (
          <button
            key={label}
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
          <Row label="Clothing Size" value={child.clothingSize} />
          <Row label="Shoe Size"     value={child.shoeSize} />
          <Row label="Latest Activity" value={child.latestActivity} truncate />
          <Row
            label={
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-atlas-warm" />
                Weekly Theme
              </span>
            }
            value={child.weeklyTheme}
          />
        </div>
      </div>
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
