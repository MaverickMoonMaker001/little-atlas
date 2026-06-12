import { useState, useEffect } from 'react'
import { Sparkles, Star, Moon, ArrowUp } from 'lucide-react'
import { getChartSummary } from '../../lib/astrology'
import { getInsightForChild } from '../../data/insightThemes'
import Spinner from '../../components/Spinner'

const SIGN_DESCRIPTIONS = {
  Aries:       'The Ram · Fire · Mar 21 – Apr 19',
  Taurus:      'The Bull · Earth · Apr 20 – May 20',
  Gemini:      'The Twins · Air · May 21 – Jun 20',
  Cancer:      'The Crab · Water · Jun 21 – Jul 22',
  Leo:         'The Lion · Fire · Jul 23 – Aug 22',
  Virgo:       'The Maiden · Earth · Aug 23 – Sep 22',
  Libra:       'The Scales · Air · Sep 23 – Oct 22',
  Scorpio:     'The Scorpion · Water · Oct 23 – Nov 21',
  Sagittarius: 'The Archer · Fire · Nov 22 – Dec 21',
  Capricorn:   'The Sea-Goat · Earth · Dec 22 – Jan 19',
  Aquarius:    'The Water Bearer · Air · Jan 20 – Feb 18',
  Pisces:      'The Fish · Water · Feb 19 – Mar 20',
}

function SignRow({ icon: Icon, label, sign, subtitle, muted }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center shrink-0">
        <Icon size={15} className={muted ? 'text-atlas-muted' : 'text-atlas-warm'} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-atlas-muted uppercase tracking-wide">{label}</p>
        {sign ? (
          <>
            <p className="text-sm font-medium text-[#1C1917]">{sign}</p>
            {subtitle && <p className="text-[11px] text-atlas-muted">{subtitle}</p>}
          </>
        ) : (
          <p className="text-sm text-atlas-muted">{muted}</p>
        )}
      </div>
    </div>
  )
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
  const [chart, setChart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!child.birthdate) {
      setLoading(false)
      return
    }
    let cancelled = false
    async function compute() {
      setLoading(true)
      const result = await getChartSummary(child)
      if (!cancelled) {
        setChart(result)
        setLoading(false)
      }
    }
    compute()
    return () => { cancelled = true }
  }, [child.id, child.birthdate, child.birth_time, child.birth_location])

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

  const insight = getInsightForChild(child.birthdate)

  return (
    <div className="px-5 pt-4 pb-6 space-y-4">
      {/* Big three card */}
      <div className="bg-white rounded-2xl px-5 py-2 shadow-sm border border-cream-200 divide-y divide-cream-200">
        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <>
            <SignRow
              icon={Sparkles}
              label="Sun Sign"
              sign={chart?.sunSign}
              subtitle={chart?.sunSign ? SIGN_DESCRIPTIONS[chart.sunSign] : null}
            />
            <SignRow
              icon={Moon}
              label="Moon Sign"
              sign={chart?.moonSign}
              subtitle={chart?.moonSign ? SIGN_DESCRIPTIONS[chart.moonSign] : null}
              muted={
                !child.birth_time || !child.birth_location
                  ? 'Needs birth time & location'
                  : 'Could not calculate'
              }
            />
            <SignRow
              icon={ArrowUp}
              label="Rising Sign"
              sign={chart?.risingSign}
              subtitle={chart?.risingSign ? SIGN_DESCRIPTIONS[chart.risingSign] : null}
              muted={
                !child.birth_time || !child.birth_location
                  ? 'Needs birth time & location'
                  : 'Could not calculate'
              }
            />
          </>
        )}
      </div>

      {/* Add data prompt */}
      {(!child.birth_time || !child.birth_location) && (
        <div className="bg-cream-200 rounded-2xl px-4 py-3">
          <p className="text-xs text-atlas-warm leading-relaxed">
            Add birth time and location in Edit Profile to calculate the Moon and Rising signs.
          </p>
        </div>
      )}

      {/* Weekly theme card */}
      {insight && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200 space-y-4">
          <div>
            <p className="text-[10px] font-medium tracking-widest text-atlas-muted uppercase mb-1">
              This week's theme
            </p>
            <p className="font-serif text-lg font-medium text-[#1C1917]">{insight.theme}</p>
          </div>

          <p className="text-sm text-atlas-warm leading-relaxed">{insight.body}</p>

          <div className="space-y-3 pt-1">
            <Bullet label="Best support" value={insight.bestSupport} />
            <Bullet label="Watch for"    value={insight.watchFor} />
            <Bullet label="Try this"     value={insight.tryThis} />
          </div>
        </div>
      )}
    </div>
  )
}
