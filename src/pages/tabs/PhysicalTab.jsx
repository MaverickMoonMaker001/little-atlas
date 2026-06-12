import { useState } from 'react'
import { Plus, Ruler, Footprints } from 'lucide-react'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function PhysicalTab({ child }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEntry, setNewEntry] = useState({ clothingSize: '', shoeSize: '' })

  const latest = child.sizeHistory[0]

  const set = (key) => (e) => setNewEntry((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="px-5 pt-4 pb-6 space-y-5">
      {/* Current sizes hero */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200">
        <p className="text-[10px] font-medium tracking-widest text-atlas-muted uppercase mb-4">
          Current Sizes
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cream-100 rounded-xl p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Ruler size={13} className="text-atlas-muted" strokeWidth={1.5} />
              <span className="text-[11px] text-atlas-muted uppercase tracking-wide">Clothing</span>
            </div>
            <span className="font-serif text-2xl font-medium text-[#1C1917]">
              {latest?.clothingSize ?? '—'}
            </span>
          </div>
          <div className="bg-cream-100 rounded-xl p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Footprints size={13} className="text-atlas-muted" strokeWidth={1.5} />
              <span className="text-[11px] text-atlas-muted uppercase tracking-wide">Shoe</span>
            </div>
            <span className="font-serif text-2xl font-medium text-[#1C1917]">
              {latest?.shoeSize ?? '—'}
            </span>
          </div>
        </div>
        {latest && (
          <p className="text-xs text-atlas-muted mt-3">
            Updated {formatDate(latest.date)}
          </p>
        )}
      </div>

      {/* Add size entry */}
      {showAddForm ? (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200 space-y-3">
          <p className="text-sm font-medium text-[#1C1917]">Add size update</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-atlas-muted mb-1">Clothing size</label>
              <input
                value={newEntry.clothingSize}
                onChange={set('clothingSize')}
                placeholder="e.g. Youth XL"
                className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark"
              />
            </div>
            <div>
              <label className="block text-xs text-atlas-muted mb-1">Shoe size</label>
              <input
                value={newEntry.shoeSize}
                onChange={set('shoeSize')}
                placeholder="e.g. Women's 7"
                className="w-full bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-atlas-muted focus:outline-none focus:border-atlas-dark"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-cream-200 text-atlas-warm rounded-xl py-2.5 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-atlas-dark text-white rounded-xl py-2.5 text-sm font-medium"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl py-3.5 border border-cream-300 text-sm font-medium text-atlas-dark shadow-sm active:bg-cream-100 transition-colors"
        >
          <Plus size={16} strokeWidth={2} />
          Add size update
        </button>
      )}

      {/* Size history */}
      <div>
        <p className="text-[10px] font-medium tracking-widest text-atlas-muted uppercase mb-3 px-1">
          Size history
        </p>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-3 bottom-3 w-px bg-cream-300" />

          <div className="space-y-1">
            {child.sizeHistory.map((entry, i) => (
              <div key={entry.date} className="flex gap-4 items-start">
                {/* Dot */}
                <div className={`w-[30px] flex justify-center pt-3 shrink-0`}>
                  <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                    i === 0
                      ? 'border-atlas-dark bg-atlas-dark'
                      : 'border-cream-400 bg-white'
                  }`} />
                </div>
                {/* Entry card */}
                <div className="flex-1 bg-white rounded-2xl px-4 py-3 mb-1 shadow-sm border border-cream-200">
                  <p className="text-xs text-atlas-muted mb-2">{formatDate(entry.date)}</p>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-[10px] text-atlas-muted block">Clothing</span>
                      <span className="text-sm font-medium text-[#1C1917]">{entry.clothingSize}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-atlas-muted block">Shoe</span>
                      <span className="text-sm font-medium text-[#1C1917]">{entry.shoeSize}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
