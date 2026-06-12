import { moonposition, sidereal, julian } from 'astronomia'
import { getSunSign as getSunSignFromThemes } from '../data/insightThemes'

const R2D = 180 / Math.PI
const D2R = Math.PI / 180

// Mean obliquity of the ecliptic (degrees) — accurate within ±0.01° for 1900–2100
const OBLIQUITY_DEG = 23.4393

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

function eclipticDegreesToSign(deg) {
  const normalized = ((deg % 360) + 360) % 360
  return SIGN_NAMES[Math.floor(normalized / 30)]
}

// Parse birth components into an approximate UTC Date using solar-time offset (lng/15h).
// This avoids needing a timezone database and is accurate within ±30 min for most locations.
function birthToUtcDate(birthdate, birthTime, lng) {
  const [year, month, day] = birthdate.split('-').map(Number)
  const [hour, minute] = birthTime.split(':').map(Number)
  const solarOffsetMs = (lng / 15) * 3600000
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - solarOffsetMs)
}

async function geocodeLocation(locationString) {
  if (!locationString?.trim()) return null

  // Try two strategies: full string first, then city-only (first comma-delimited part).
  // Open-Meteo's geocoding API is a city-name search — it rejects "New York, NY" but
  // accepts "New York". We still try the full string first so that ambiguous names like
  // "Paris, TX" can be resolved by the user entering more context.
  const candidates = [locationString.trim()]
  const cityOnly = locationString.split(',')[0].trim()
  if (cityOnly !== locationString.trim()) candidates.push(cityOnly)

  for (const query of candidates) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      const res = await fetch(url)
      if (!res.ok) continue
      const data = await res.json()
      const first = data?.results?.[0]
      if (first) return { lat: first.latitude, lng: first.longitude }
    } catch {
      continue
    }
  }
  return null
}

export function getSunSign(birthdate) {
  return getSunSignFromThemes(birthdate)
}

export async function getMoonSign(birthdate, birthTime, birthLocation) {
  if (!birthdate || !birthTime || !birthLocation) return null
  try {
    const coords = await geocodeLocation(birthLocation)
    if (!coords) return null
    const utcDate = birthToUtcDate(birthdate, birthTime, coords.lng)
    const jde = julian.DateToJDE(utcDate)
    const pos = moonposition.position(jde)
    const lonDeg = ((pos.lon * R2D) % 360 + 360) % 360
    return eclipticDegreesToSign(lonDeg)
  } catch {
    return null
  }
}

export async function getRisingSign(birthdate, birthTime, birthLocation) {
  if (!birthdate || !birthTime || !birthLocation) return null
  try {
    const coords = await geocodeLocation(birthLocation)
    if (!coords) return null
    const utcDate = birthToUtcDate(birthdate, birthTime, coords.lng)
    const jde = julian.DateToJDE(utcDate)

    // Greenwich Sidereal Time in seconds
    const gst = sidereal.apparent(jde)
    // Local Sidereal Time in seconds
    const lst = ((gst + (coords.lng / 360) * 86400) % 86400 + 86400) % 86400
    // RAMC (Right Ascension of Midheaven Coeli) in radians
    const ramc = (lst / 86400) * 2 * Math.PI

    const epsilon = OBLIQUITY_DEG * D2R
    const latRad = coords.lat * D2R

    // Standard Ascendant formula (Meeus / Koch / equal-house)
    const asc = Math.atan2(
      -Math.cos(ramc),
      Math.sin(ramc) * Math.cos(epsilon) + Math.tan(latRad) * Math.sin(epsilon),
    )
    const ascDeg = ((asc * R2D) % 360 + 360) % 360
    return eclipticDegreesToSign(ascDeg)
  } catch {
    return null
  }
}

export async function getChartSummary(child) {
  const { id, birthdate, birth_time: birthTime, birth_location: birthLocation } = child

  const cacheKey = `chart_${id}`
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? 'null')
    if (
      cached &&
      cached.birthdate === birthdate &&
      cached.birthTime === birthTime &&
      cached.birthLocation === birthLocation
    ) {
      return { sunSign: cached.sunSign, moonSign: cached.moonSign, risingSign: cached.risingSign }
    }
  } catch {
    // corrupt cache — proceed to recalculate
  }

  const sunSign = getSunSign(birthdate)
  const [moonSign, risingSign] = await Promise.all([
    getMoonSign(birthdate, birthTime, birthLocation),
    getRisingSign(birthdate, birthTime, birthLocation),
  ])

  const result = { sunSign, moonSign, risingSign }
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ ...result, birthdate, birthTime, birthLocation }))
  } catch {
    // storage full — skip caching
  }

  return result
}
