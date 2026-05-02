import React, { useState, useRef, useEffect, useMemo } from 'react'
import { CharacterTemplate } from './CharacterTemplate'
import { searchCities }      from '../../game/astro/cities.js'
import { HouseWheel, HOUSE_THEMES }      from '../HouseWheel/HouseWheel.jsx'
import { DateWheel, TimeWheel } from './CirclePicker.jsx'
import { getAllPositions, getPlacidusHouses, getHouseNumber, longitudeToSign, longitudeToSymbol, degreesInSign, daysSinceJ2000 } from '../../game/astro/ephemeris.js'
import { SIGN_META }         from '../../game/astro/horoscope.js'
import { PLANET_GLYPHS, SIGN_GLYPHS, ELEMENT_COLOR, PLANET_NAMES } from '../HoroscopeModal/HoroscopeModal.jsx'
import './CharacterEditor.scss'

// Projects lat/lng onto a sphere SVG (orthographic-like, front hemisphere only)
function EarthGlobe({ city, size = 120, style }) {
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', ...style }}>
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
        style={{ textAlign: 'center' }}
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
        <div className="city-coords" style={{ textAlign: 'center' }}>
          {value.lat > 0 ? value.lat.toFixed(2)+'°N' : Math.abs(value.lat).toFixed(2)+'°S'}
          {' · '}
          {value.lng > 0 ? value.lng.toFixed(2)+'°E' : Math.abs(value.lng).toFixed(2)+'°W'}
          {' · UTC'}{value.tz >= 0 ? '+' : ''}{value.tz}
        </div>
      )}
    </div>
  )
}


function AstroSummary({ natalPlacements }) {
  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  const modeTally = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  Object.values(natalPlacements).forEach(p => {
    const meta = SIGN_META[p.sign]
    if (meta) {
      if (meta.element) tally[meta.element]++
      if (meta.mode) modeTally[meta.mode]++
    }
  })
  const maxEl = Object.entries(tally).sort((a,b) => b[1]-a[1])[0]
  const maxMo = Object.entries(modeTally).sort((a,b) => b[1]-a[1])[0]
  const hTally = {}
  Object.values(natalPlacements).forEach(p => {
    if (p.house) hTally[p.house] = (hTally[p.house] || 0) + 1
  })
  const maxH = Object.entries(hTally).sort((a,b) => b[1] - a[1])[0]
  const ELEMENTS_ORDER = ['Fire', 'Earth', 'Air', 'Water']
  const sunP = natalPlacements['Sun']
  const moonP = natalPlacements['Moon']
  const ascP = natalPlacements['Ascendant']

  return (
    <div className="char-editor-summary">
      <div className="char-editor-summary__planets">
        {[['Sun', sunP], ['Moon', moonP], ['Asc', ascP]].map(([key, p]) => {
          if (!p) return null
          const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
          return (
            <span key={key} className="char-editor-summary__planet" style={{ color }}>
              <span className="char-editor-summary__glyph">{PLANET_GLYPHS[key === 'Asc' ? 'Ascendant' : key]}</span>
              <span className="char-editor-summary__sign">{p.sign} {SIGN_GLYPHS[p.sign]}</span>
              <span className="char-editor-summary__deg">{Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'</span>
            </span>
          )
        })}
      </div>
      {maxH && (
        <div className="char-editor-summary__stellium">
          {maxH[1] >= 3 ? 'Stellium' : 'Focus'} in H{maxH[0]} ({HOUSE_THEMES[maxH[0]] || ''}) — {maxH[1]} placements.
        </div>
      )}
      <div className="char-editor-summary__grid">
        <div className="char-editor-summary__col">
          {ELEMENTS_ORDER.map(el => {
            const n = tally[el]
            return (
              <div key={el} className="char-editor-summary__bar-row" style={{ opacity: n === 0 ? 0.2 : 1 }}>
                <span className="char-editor-summary__bar-label" style={{ color: ELEMENT_COLOR[el], fontWeight: el === maxEl[0] && n > 0 ? 700 : 400 }}>{el.slice(0,4).toUpperCase()}</span>
                <div className="char-editor-summary__bar-track">
                  <div className="char-editor-summary__bar-fill" style={{ width: maxEl[1] > 0 ? `${(n/maxEl[1])*100}%` : '0%', background: ELEMENT_COLOR[el] }} />
                </div>
                <span className="char-editor-summary__bar-num" style={{ color: ELEMENT_COLOR[el] }}>{n}</span>
              </div>
            )
          })}
        </div>
        <div className="char-editor-summary__col">
          {[['Cardinal','#f472b6'],['Fixed','#a78bfa'],['Mutable','#34d399']].map(([mode, modeCol]) => {
            const n = modeTally[mode]
            return (
              <div key={mode} className="char-editor-summary__bar-row" style={{ opacity: n === 0 ? 0.2 : 1 }}>
                <span className="char-editor-summary__bar-label" style={{ color: modeCol, fontWeight: mode === maxMo[0] && n > 0 ? 700 : 400 }}>{mode.slice(0,4).toUpperCase()}</span>
                <div className="char-editor-summary__bar-track">
                  <div className="char-editor-summary__bar-fill" style={{ width: maxMo[1] > 0 ? `${(n/maxMo[1])*100}%` : '0%', background: modeCol }} />
                </div>
                <span className="char-editor-summary__bar-num" style={{ color: modeCol }}>{n}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function CharacterEditor({ initialColors, initialBirthData, scrollPage, onSave, onClose, onChange }) {
  const modalRef   = useRef(null)
  const [activePage, setActivePage] = useState(0)

  // External control of scrolling for automation/playback
  useEffect(() => {
    if (scrollPage !== undefined && modalRef.current) {
      const el = modalRef.current
      el.scrollTo({ left: scrollPage * el.clientWidth, behavior: 'smooth' })
    }
  }, [scrollPage])

  const [colors, setColors] = useState(initialColors || {
    hair:   '#6030d0',
    skin:   '#f8c898',
    eyes:   '#8040e8',
    outfit: '#4a1090',
    stick:  '#60a8ff',
  })

  useEffect(() => {
    const el = modalRef.current
    if (!el) return
    const onScroll = () => {
      const page = Math.round(el.scrollLeft / el.clientWidth)
      setActivePage(page)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const colorsRef = useRef(colors)
  useEffect(() => { colorsRef.current = colors }, [colors])

  // Sync when parent pushes new colors (e.g. playback engine changing colors)
  useEffect(() => {
    if (initialColors) setColors(initialColors)
  }, [initialColors])
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
  const [previewDate, setPreviewDate] = useState(null)
  const [previewTime, setPreviewTime] = useState(null)

  // Use preview values for chart if hovering, else committed values
  const chartDate = previewDate ?? birthDate
  const chartTime = previewTime ?? birthTime

  const updateColor = (key, val) => {
    const next = { ...colors, [key]: val }
    setColors(next)
    onChange?.(next)
  }

  const dateStr = `${birthDate.year}-${String(birthDate.month).padStart(2,'0')}-${String(birthDate.day).padStart(2,'0')}`
  const timeStr = `${String(birthTime.hour).padStart(2,'0')}:${String(birthTime.minute).padStart(2,'0')}`

  const buildBirthData = () =>
    hasDate ? { date: dateStr, time: timeStr, city: birthCity } : null

  useEffect(() => {
    // Wait for Space/Enter to be physically released before accepting them,
    // so the same keypress that opened the editor doesn't immediately confirm it.
    let ready = false
    const onKeyUp = e => { if (e.key === ' ' || e.key === 'Enter') ready = true }
    const onKey = e => {
      if (e.target.tagName === 'INPUT') return
      if (e.key === 'Enter' || e.key === ' ') {
        if (!ready) return
        e.preventDefault()
        onSave(colorsRef.current, buildBirthData())
      } else if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        const el = modalRef.current
        if (el) el.scrollTo({ left: el.clientWidth, behavior: 'smooth' })
      } else if (e.key === 'ArrowLeft') {
        const el = modalRef.current
        if (el) el.scrollTo({ left: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('keydown', onKey)
    }
  }, [hasDate, dateStr, timeStr, birthCity])

  // Live natal chart computation — uses preview values while hovering
  const { natalPlacements, houseCusps } = useMemo(() => {
    if (!hasDate) return { natalPlacements: null, houseCusps: null }
    try {
      const yr = chartDate.year, mo = chartDate.month, dy = chartDate.day
      const bh = chartTime.hour, bm = chartTime.minute
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
  }, [hasDate, chartDate, chartTime, birthCity])

  return (
    <div className="char-editor-root">
      <div className="char-editor-dots" aria-hidden="true">
        {[0, 1].map(i => (
          <span key={i} className={`char-editor-dot${activePage === i ? ' char-editor-dot--active' : ''}`} />
        ))}
      </div>
      <div className="char-editor-modal" ref={modalRef}>
      <div className={`char-editor-content${natalPlacements ? ' char-editor-content--wide' : ''}`}>

        {/* Page 1: character + colors + actions */}
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
          <div className="char-editor-actions">
            <button className="btn-save" onClick={() => onSave(colors, buildBirthData())}>Embody</button>
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>

        {/* Page 2 (mobile) / column 2 (desktop): birth wheels */}
        <div className="char-editor-astro">
          <div className="birth-trio">
            {/* Left: earth globe fills height */}
            <div className="birth-trio__earth">
              <EarthGlobe city={birthCity} size={180} />
              <CitySearch value={birthCity} onChange={setBirthCity} />
            </div>
            {/* Right: date on top, time on bottom */}
            <div className="birth-trio__pickers">
              <div className="birth-trio__date">
                <DateWheel
                  value={birthDate}
                  onChange={v => { setBirthDate(v); setHasDate(true); setPreviewDate(null) }}
                  onPreview={v => setPreviewDate(v)}
                  size={180} />
              </div>
              <div className="birth-trio__time">
                <TimeWheel
                  value={birthTime}
                  onChange={v => {
                    if (v.daysDiff) {
                      const d = new Date(birthDate.year, birthDate.month - 1, birthDate.day)
                      d.setDate(d.getDate() + v.daysDiff)
                      setBirthDate({ day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() })
                    }
                    setBirthTime({ hour: v.hour, minute: v.minute })
                    setPreviewTime(null)
                  }}
                  onPreview={v => setPreviewTime(v)}
                  size={150} />
              </div>
            </div>
          </div>

          {/* Mobile only: wheel + summary inline on page 2 */}
          {natalPlacements && (
            <div className="char-editor-wheel char-editor-wheel--mobile-only">
              <AstroSummary natalPlacements={natalPlacements} />
              <HouseWheel placements={natalPlacements} houseCusps={houseCusps} size={220} hideStellium />
            </div>
          )}
        </div>{/* end char-editor-astro */}

        {/* Column 3 (desktop only): natal chart summary + house wheel */}
        {natalPlacements && (
          <div className="char-editor-chart">
            <div className="char-editor-wheel">
              <AstroSummary natalPlacements={natalPlacements} />
              <HouseWheel placements={natalPlacements} houseCusps={houseCusps} size={300} hideStellium
                containerStyle={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
                style={{ width: '100%', height: 'auto', flexShrink: 0 }} />
            </div>
          </div>
        )}

      </div>
      </div>
    </div>
  )
}

