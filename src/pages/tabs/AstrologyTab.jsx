import { Sparkles, Star } from 'lucide-react'
import { getInsightForChild, getSunSign } from '../../data/insightThemes'

const SIGN_DESCRIPTIONS = {
  Aries:       'The Ram · Fire sign · Mar 21 – Apr 19',
  Taurus:      'The Bull · Earth sign · Apr 20 – May 20',
  Gemini:      'The Twins · Air sign · May 21 – Jun 20',
  Cancer:      'The Crab · Water sign · Jun 21 – Jul 22',
  Leo:         'The Lion · Fire sign · Jul 23 – Aug 22',
  Virgo:       'The Maiden · Earth sign · Aug 23 – Sep 22',
  Libra:       'The Scales · Air sign · Sep 23 – Oct 22',
  Scorpio:     'The Scorpion · Water sign · Oct 23 – Nov 21',
  Sagittarius: 'The Archer · Fire sign · Nov 22 – Dec 21',
  Capricorn:   'The Sea-Goat · Earth sign · Dec 22 – Jan 19',
  Aquarius:    'The Water Bearer · Air sign · Jan 20 – Feb 18',
  Pisces:      'The Fish · Water sign · Feb 19 – Mar 20',
}

function Bullet({ label, value }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-atlas-muted shrink-0" />
      <div>
        <span className="text-[11px] font-medium text-atlas-warm uppercase tracking-wide mr-1.5">{label}</span>
        <span className="text-sm text-atlas-warm">{value}</span>
      </div>
    </div>
  )
}

export default function AstrologyTab({ child }) {
  if (!child.birthdate) {
    return (
      <div className="px-5 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center mb-4">
          <Star size={24} className="text-atlas-muted" strokeWidth={1.5} />
        </div>
        <p className="font-serif text-lg text-[#1C1917] mb-2">No birthdate set</p>
        <p className="text-sm text-atlas-warm leading-relaxed max-w-[240px]">
          Add {child.name}'s birthdate in Edit Profile to unlock astrology insights.
        </p>
      </div>
    )
  }

  const sign = getSunSign(child.birthdate)
  const insight = getInsightForChild(child.birthdate)
  const signDesc = SIGN_DESCRIPTIONS[sign] ?? sign

  if (!insight) return null

  return (
    <div className="px-5 pt-4 pb-6 space-y-4">
      {/* Sign identity card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-atlas-warm" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-serif text-xl font-medium text-[#1C1917]">{sign}</p>
            <p className="text-xs text-atlas-muted">{signDesc}</p>
          </div>
        </div>
      </div>

      {/* Weekly theme card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200 space-y-4">
        <div>
          <p className="text-[10px] font-medium tracking-widest text-atlas-muted uppercase mb-1">
            This week's theme
          </p>
          <p className="font-serif text-lg font-medium text-[#1C1917]">{insight.theme}</p>
        </div>

        <p className="text-sm text-atlas-warm leading-relaxed">{insight.body}</p>

        <div className="space-y-3 pt-1">
          <Bullet label="Best support"   value={insight.bestSupport} />
          <Bullet label="Watch for"      value={insight.watchFor} />
          <Bullet label="Try this"       value={insight.tryThis} />
        </div>
      </div>
    </div>
  )
}
