import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-sm bg-cream-100 rounded-t-3xl px-5 pt-5 pb-10 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-cream-400 mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-lg font-medium text-[#1C1917]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center"
          >
            <X size={15} className="text-atlas-warm" strokeWidth={1.5} />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
