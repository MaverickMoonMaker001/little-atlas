import { useNavigate } from 'react-router-dom'
import { BookOpen, Sparkles } from 'lucide-react'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-sm bg-cream-100 min-h-svh flex flex-col items-center justify-center px-7">
      <div className="flex flex-col items-center flex-1 justify-center w-full">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm border border-cream-300">
            <BookOpen size={36} className="text-atlas-dark" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles size={16} className="text-atlas-warm" />
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="font-serif text-4xl font-medium text-[#1C1917] mb-3 tracking-tight">
          Little Atlas
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-atlas-warm text-center text-lg leading-snug mb-5">
          A private map of your child's growth,<br />records, and rhythms.
        </p>

        {/* Description */}
        <p className="text-sm text-atlas-warm text-center leading-relaxed mb-12">
          Track each child's key details, activities, sizes, accounts,
          notes, and weekly parenting insights in one private place.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/signup')}
          className="w-full bg-atlas-dark text-white rounded-2xl py-4 font-medium text-base tracking-wide mb-4 active:opacity-90 transition-opacity"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate('/login')}
          className="text-sm text-atlas-warm hover:text-atlas-dark transition-colors"
        >
          I already have an account
        </button>
      </div>
    </div>
  )
}
