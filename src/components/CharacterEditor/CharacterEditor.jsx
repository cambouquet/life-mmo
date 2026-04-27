import React, { useState, useRef, useEffect, useMemo } from 'react'
import { CharacterTemplate } from './CharacterTemplate'
import { searchCities }      from '../../game/astro/cities.js'
import { HouseWheel }        from '../HouseWheel/HouseWheel.jsx'
import { DateWheel, TimeWheel } from './CirclePicker.jsx'
import { getAllPositions, getPlacidusHouses, getHouseNumber, longitudeToSign, longitudeToSymbol, degreesInSign, daysSinceJ2000 } from '../../game/astro/ephemeris.js'
import { SIGN_META }         from '../../game/astro/horoscope.js'
import './CharacterEditor.scss'

// Projects lat/lng onto a sphere SVG (orthographic-like, front hemisphere only)
function EarthGlobe({ city, size = 120 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4

  // Orthographic projection: center globe on city if present, else 0,0
  const centerLat = city ? city.lat * Math.PI / 180 : 0
  const centerLng = city ? city.lng * Math.PI / 180 : 0

  function project(lat, lng) {
    const φ = lat * Math.PI / 180
    const λ = lng * Math.PI / 180
    const dλ = λ - centerLng
    const cosC = Math.sin(centerLat) * Math.sin(φ) + Math.cos(centerLat) * Math.cos(φ) * Math.cos(dλ)
    if (cosC < 0) return null // behind the globe
    const x = cx + r * Math.cos(φ) * Math.sin(dλ)
    const y = cy - r * (Math.cos(centerLat) * Math.sin(φ) - Math.sin(centerLat) * Math.cos(φ) * Math.cos(dλ))
    return [x, y]
  }

  function latLine(lat, steps = 72) {
    const pts = []
    for (let i = 0; i <= steps; i++) {
      const lng = -180 + (i / steps) * 360
      const p = project(lat, lng)
      if (p) pts.push(p)
      else if (pts.length > 1) break
    }
    if (pts.length < 2) return null
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  }

  function lngLine(lng, steps = 72) {
    const pts = []
    for (let i = 0; i <= steps; i++) {
      const lat = -90 + (i / steps) * 180
      const p = project(lat, lng)
      if (p) pts.push(p)
    }
    if (pts.length < 2) return null
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  }

  const latLines  = [-60, -30, 0, 30, 60].map(l => latLine(l)).filter(Boolean)
  const lngLines  = [-120, -60, 0, 60, 120, 180].map(l => lngLine(l)).filter(Boolean)
  const dotPos    = city ? project(city.lat, city.lng) : null

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="globe-grad" cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="rgba(80,40,160,0.7)" />
          <stop offset="100%" stopColor="rgba(8,4,24,0.95)" />
        </radialGradient>
        <clipPath id="globe-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* base sphere */}
      <circle cx={cx} cy={cy} r={r} fill="url(#globe-grad)" />

      {/* grid */}
      <g clipPath="url(#globe-clip)" stroke="rgba(168,85,247,0.18)" strokeWidth="0.6" fill="none">
        {latLines.map((d, i) => <path key={`lat${i}`} d={d} />)}
        {lngLines.map((d, i) => <path key={`lng${i}`} d={d} />)}
      </g>

      {/* rim */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(168,85,247,0.35)" strokeWidth="1" />

      {/* city dot */}
      {dotPos && <>
        <circle cx={dotPos[0]} cy={dotPos[1]} r={3.5} fill="rgba(168,85,247,0.3)" />
        <circle cx={dotPos[0]} cy={dotPos[1]} r={2}   fill="#c084fc" />
        <circle cx={dotPos[0]} cy={dotPos[1]} r={4.5} fill="none" stroke="rgba(192,132,252,0.5)" strokeWidth="0.8" />
      </>}
    </svg>
  )
}

function CitySearch({ value, onChange }) {
  const [query,   setQuery]   = useState(value?.name ?? '')
  const [results, setResults] = useState([])
  const [open,    setOpen]    = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleInput = e => {
    const q = e.target.value
    setQuery(q)
    const found = searchCities(q)
    setResults(found)
    setOpen(found.length > 0)
    if (q === '') onChange(null)
  }

  const select = city => {
    setQuery(`${city.name}, ${city.country}`)
    setResults([])
    setOpen(false)
    onChange(city)
  }

  return (
    <div className="city-search" ref={wrapRef}>
      <input
        className="input-birth input-city"
        type="text"
        value={query}
        onChange={handleInput}
        onFocus={() => query && setOpen(results.length > 0)}
        placeholder="City of birth"
        autoComplete="off"
      />
      {open && (
        <div className="city-dropdown">
          {results.map(city => (
            <div key={`${city.name}-${city.country}`} className="city-option" onMouseDown={() => select(city)}>
              <span className="city-option__name">{city.name}</span>
              <span className="city-option__meta">{city.country} · {city.lat > 0 ? city.lat.toFixed(1)+'°N' : Math.abs(city.lat).toFixed(1)+'°S'}</span>
            </div>
          ))}
        </div>
      )}
      {value && (
        <div className="city-coords">
          {value.lat > 0 ? value.lat.toFixed(2)+'°N' : Math.abs(value.lat).toFixed(2)+'°S'}
          {' · '}
          {value.lng > 0 ? value.lng.toFixed(2)+'°E' : Math.abs(value.lng).toFixed(2)+'°W'}
          {' · UTC'}{value.tz >= 0 ? '+' : ''}{value.tz}
        </div>
      )}
    </div>
  )
}

export default function CharacterEditor({ initialColors, initialBirthData, onSave, onClose, onChange }) {
  const [colors, setColors] = useState(initialColors || {
    hair:   '#6030d0',
    skin:   '#f8c898',
    eyes:   '#8040e8',
    outfit: '#4a1090',
    stick:  '#60a8ff',
  })
  const parsedDate = initialBirthData?.date
    ? { year: +initialBirthData.date.slice(0,4), month: +initialBirthData.date.slice(5,7), day: +initialBirthData.date.slice(8,10) }
    : { year: 1990, month: 1, day: 1 }
  const parsedTime = initialBirthData?.time
    ? { hour: +initialBirthData.time.slice(0,2), minute: +initialBirthData.time.slice(3,5) }
    : { hour: 12, minute: 0 }

  const [birthDate, setBirthDate] = useState(parsedDate)
  const [birthTime, setBirthTime] = useState(parsedTime)
  const [hasDate,   setHasDate]   = useState(!!initialBirthData?.date)
  const [birthCity, setBirthCity] = useState(initialBirthData?.city ?? null)

  const updateColor = (key, val) => {
    const next = { ...colors, [key]: val }
    setColors(next)
    onChange?.(next)
  }

  const dateStr = `${birthDate.year}-${String(birthDate.month).padStart(2,'0')}-${String(birthDate.day).padStart(2,'0')}`
  const timeStr = `${String(birthTime.hour).padStart(2,'0')}:${String(birthTime.minute).padStart(2,'0')}`

  const buildBirthData = () =>
    hasDate ? { date: dateStr, time: timeStr, city: birthCity } : null

  // Live natal chart computation
  const { natalPlacements, houseCusps } = useMemo(() => {
    if (!hasDate) return { natalPlacements: null, houseCusps: null }
    try {
      const yr = birthDate.year, mo = birthDate.month, dy = birthDate.day
      const bh = birthTime.hour, bm = birthTime.minute
      const tz           = birthCity?.tz ?? 0
      const birthUTC     = new Date(Date.UTC(yr, mo - 1, dy, bh - tz, bm, 0))
      const d            = daysSinceJ2000(birthUTC)
      const loc          = birthCity ? { lat: birthCity.lat, lng: birthCity.lng } : null
      const rawNatal     = getAllPositions(birthUTC, loc)
      const cusps        = loc ? getPlacidusHouses(d, loc.lat, loc.lng) : null
      const placements   = {}
      for (const [planet, lon] of Object.entries(rawNatal)) {
        const sign = longitudeToSign(lon)
        placements[planet] = {
          longitude: lon,
          sign,
          symbol:   longitudeToSymbol(lon),
          degrees:  degreesInSign(lon),
          element:  SIGN_META[sign]?.element ?? '?',
          house:    cusps ? getHouseNumber(lon, cusps) : null,
        }
      }
      return { natalPlacements: placements, houseCusps: cusps }
    } catch {
      return { natalPlacements: null, houseCusps: null }
    }
  }, [hasDate, birthDate, birthTime, birthCity])

  return (
    <div className="char-editor-modal">
      <div className={`char-editor-content${natalPlacements ? ' char-editor-content--wide' : ''}`}>
        <div className="char-editor-preview">
          <CharacterTemplate colors={colors} scale={5} />
          <div className="char-editor-preview-label">Kami</div>
          <div className="color-row">
            <div className="control-group">
              <input type="color" value={colors.hair}   onChange={e => updateColor('hair',   e.target.value)} />
              <label>Hair</label>
            </div>
            <div className="control-group">
              <input type="color" value={colors.skin}   onChange={e => updateColor('skin',   e.target.value)} />
              <label>Skin</label>
            </div>
            <div className="control-group">
              <input type="color" value={colors.eyes}   onChange={e => updateColor('eyes',   e.target.value)} />
              <label>Eyes</label>
            </div>
            <div className="control-group">
              <input type="color" value={colors.outfit} onChange={e => updateColor('outfit', e.target.value)} />
              <label>Armor</label>
            </div>
            <div className="control-group">
              <input type="color" value={colors.stick}  onChange={e => updateColor('stick',  e.target.value)} />
              <label>Wand</label>
            </div>
          </div>
          <div className="earth-section">
            <EarthGlobe city={birthCity} size={190} />
            <CitySearch value={birthCity} onChange={setBirthCity} />
          </div>
        </div>

        <div className="char-editor-controls">
          <div className="birth-section">
            <div className="birth-wheels">
              <div className="birth-wheels__date">
                <DateWheel value={birthDate} onChange={v => { setBirthDate(v); setHasDate(true) }} size={240} />
              </div>
              <div className="birth-wheels__time">
                <TimeWheel value={birthTime} onChange={setBirthTime} size={190} />
              </div>
            </div>
          </div>

          <div className="char-editor-actions">
            <button className="btn-save" onClick={() => onSave(colors, buildBirthData())}>Embody</button>
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>

        {natalPlacements && (
          <div className="char-editor-wheel">
            <HouseWheel placements={natalPlacements} houseCusps={houseCusps} size={300} />
          </div>
        )}
      </div>
    </div>
  )
}
