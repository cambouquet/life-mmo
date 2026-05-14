import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { CharacterTemplate } from './CharacterTemplate'
import { searchCities }      from '../../game/astro/cities.js'
import { HouseWheel, HouseWheelWithInfo, HOUSE_THEMES }      from '../HouseWheel/HouseWheel.jsx'
import { DateWheel, TimeWheel } from './CirclePicker.jsx'
import { getAllPositions, getPlacidusHouses, getHouseNumber, longitudeToSign, longitudeToSymbol, degreesInSign, daysSinceJ2000 } from '../../game/astro/ephemeris.js'
import { SIGN_META }         from '../../game/astro/horoscope.js'
import { PLANET_GLYPHS, SIGN_GLYPHS, ELEMENT_COLOR, PLANET_NAMES } from '../HoroscopeModal/HoroscopeModal.jsx'
import { CassiopeiaWheel } from './CassiopeiaWheel.jsx'
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

export function CitySearch({ value, onChange }) {
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


export function AstroSummary({ natalPlacements }) {
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
        <div className="char-editor-summary__row">
          {[['Sun', sunP], ['Moon', moonP]].map(([key, p]) => {
            if (!p) return null
            const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
            return (
              <span key={key} className="char-editor-summary__planet" style={{ color }}>
                <span className="char-editor-summary__glyph">{PLANET_GLYPHS[key]}</span>
                <span className="char-editor-summary__sign">{p.sign} {SIGN_GLYPHS[p.sign]}</span>
                <span className="char-editor-summary__deg">{Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'</span>
              </span>
            )
          })}
        </div>
        <div className="char-editor-summary__row">
          {[['Asc', ascP]].map(([key, p]) => {
            if (!p) return null
            const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
            return (
              <span key={key} className="char-editor-summary__planet" style={{ color }}>
                <span className="char-editor-summary__glyph">{PLANET_GLYPHS['Ascendant']}</span>
                <span className="char-editor-summary__sign">{p.sign} {SIGN_GLYPHS[p.sign]}</span>
                <span className="char-editor-summary__deg">{Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'</span>
              </span>
            )
          })}
        </div>
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

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) { r = g = b = l } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}

function randomHsl(hBase, sRange, lRange) {
  const h = (hBase + Math.random() * 360) % 360
  const s = sRange[0] + Math.random() * (sRange[1] - sRange[0])
  const l = lRange[0] + Math.random() * (lRange[1] - lRange[0])
  return hslToHex(h, s, l)
}

function randomPalette() {
  const hue = Math.random() * 360
  return {
    hair:   randomHsl(hue + 20,  [40, 90], [25, 65]),
    skin:   randomHsl(0,          [15, 40], [55, 80]),
    eyes:   randomHsl(hue + 180, [60, 100],[45, 65]),
    outfit: randomHsl(hue,        [45, 80], [20, 45]),
    stick:  randomHsl(hue + 90,  [50, 90], [40, 70]),
  }
}


function parseDateFromString(dateStr) {
  if (!dateStr) return { year: 1990, month: 1, day: 1 }
  return {
    year: +dateStr.slice(0, 4),
    month: +dateStr.slice(5, 7),
    day: +dateStr.slice(8, 10),
  }
}

function parseTimeFromString(timeStr) {
  if (!timeStr) return { hour: 12, minute: 0 }
  return {
    hour: +timeStr.slice(0, 2),
    minute: +timeStr.slice(3, 5),
  }
}

function formatDate(date) {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
}

function formatTime(time) {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
}

const PAGES_FULL = ['chart', 'location', 'character']
const PAGES_LIMITED = ['character']

function getPageSequence(limited) {
  return limited ? PAGES_LIMITED : PAGES_FULL
}

export default function CharacterEditor({ initialColors, initialBirthData, initialName, scrollPage, limited, onSave, onClose, onChange }) {
  const modalRef = useRef(null)
  const colorsRef = useRef(null)
  const readyRef = useRef(false)

  // Build page sequence based on mode (first page is always default)
  const pageSequence = useMemo(() => {
    return getPageSequence(limited)
  }, [limited])

  const defaultPage = useMemo(() => pageSequence[0], [pageSequence])

  // UI state
  const [activePage, setActivePage] = useState(defaultPage)
  const [name, setName] = useState(initialName ?? '')

  // Birth data state
  const [birthDate, setBirthDate] = useState(() => parseDateFromString(initialBirthData?.date))
  const [birthTime, setBirthTime] = useState(() => parseTimeFromString(initialBirthData?.time))
  const [hasDate, setHasDate] = useState(!!initialBirthData?.date)
  const [birthCity, setBirthCity] = useState(initialBirthData?.city ?? null)
  const [previewDate, setPreviewDate] = useState(null)
  const [previewTime, setPreviewTime] = useState(null)

  // Color state
  const [colors, setColors] = useState(initialColors || {
    hair: '#6030d0',
    skin: '#f8c898',
    eyes: '#8040e8',
    outfit: '#4a1090',
    stick: '#60a8ff',
  })
  const [previewColors, setPreviewColors] = useState(null)

  useEffect(() => {
    colorsRef.current = colors
  }, [colors])

  // Derived state
  const chartDate = previewDate ?? birthDate
  const chartTime = previewTime ?? birthTime
  const displayColors = previewColors ?? colors
  const trimmedName = name.trim() || null
  const dateStr = formatDate(birthDate)
  const timeStr = formatTime(birthTime)
  const birthDataOutput = hasDate ? { date: dateStr, time: timeStr, city: birthCity } : null

  useEffect(() => {
    if (initialColors) setColors(initialColors)
  }, [initialColors])


  // Track scroll to update active page
  useEffect(() => {
    const el = modalRef.current
    if (!el) return
    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.clientWidth)
      const newPage = pageSequence[index] || defaultPage
      setActivePage(newPage)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [pageSequence, defaultPage])

  // Scroll to default page on initial mount only
  useEffect(() => {
    const el = modalRef.current
    if (el) {
      const index = pageSequence.indexOf(defaultPage)
      el.scrollTo({ left: index * el.clientWidth, behavior: 'auto' })
    }
  }, [])

  // External scroll control for playback
  useEffect(() => {
    if (scrollPage !== undefined && modalRef.current) {
      const el = modalRef.current
      el.scrollTo({ left: scrollPage * el.clientWidth, behavior: 'smooth' })
    }
  }, [scrollPage])

  useEffect(() => {
    readyRef.current = false

    const handleKeyUp = (e) => {
      if (e.key === ' ' || e.key === 'Enter') readyRef.current = true
    }

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return

      if (e.key === 'Enter' || e.key === ' ') {
        if (!readyRef.current) return
        e.preventDefault()
        onSave(colorsRef.current, birthDataOutput, trimmedName)
      } else if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const el = modalRef.current
        if (!el) return
        const currentIndex = pageSequence.indexOf(activePage)
        const nextIndex = e.key === 'ArrowRight'
          ? Math.min(currentIndex + 1, pageSequence.length - 1)
          : Math.max(currentIndex - 1, 0)
        el.scrollTo({ left: nextIndex * el.clientWidth, behavior: 'smooth' })
      }
    }

    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onSave, onClose, birthDataOutput, trimmedName, activePage, pageSequence])

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

  // Expose debug info and actions to debug console
  useEffect(() => {
    const pageIndex = pageSequence.indexOf(activePage)
    window.__screenDebug = {
      // State
      pages: pageSequence,
      activePage,
      defaultPage,
      activePageIndex: pageIndex,
      limited,
      hasDate,
      birthDate,
      birthTime,
      birthCity: birthCity?.name ?? 'none',
      natalPlacements: natalPlacements ? Object.keys(natalPlacements).length : 0,
      colors: colors,
      name: name,

      // Navigation
      canGoLeft: pageIndex > 0,
      canGoRight: pageIndex < pageSequence.length - 1,

      // Actions
      actions: {
        goToPage: (pageId) => {
          const index = pageSequence.indexOf(pageId)
          if (index >= 0) {
            setActivePage(pageId)
            if (modalRef.current) {
              const targetScroll = index * modalRef.current.clientWidth
              modalRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
            }
          }
        },
        setDate: (year, month, day) => setBirthDate({ year: +year, month: +month, day: +day }),
        setTime: (hour, minute) => setBirthTime({ hour: +hour, minute: +minute }),
        setCity: (cityName) => {
          const found = cityName ? require('../../game/astro/cities.js').searchCities(cityName)[0] : null
          setBirthCity(found || null)
        },
        randomizeColors: () => {
          const next = { ...colors, ...randomPalette() }
          setColors(next)
          setPreviewColors(null)
          onChange?.(next)
        },
        logNatalData: () => console.log('Natal Placements:', natalPlacements, 'House Cusps:', houseCusps),
      }
    }
  }, [pageSequence, activePage, defaultPage, limited, hasDate, birthDate, birthTime, birthCity, natalPlacements, colors, name, modalRef])

  return (
    <div className="char-editor-root">
      {pageSequence.length > 1 && (
        <div className="char-editor-dots" aria-hidden="true">
          {pageSequence.map((page) => (
            <span key={page} className={`char-editor-dot${activePage === page ? ' char-editor-dot--active' : ''}`} />
          ))}
        </div>
      )}
      <div className="char-editor-modal" ref={modalRef}>
      <div className="char-editor-content">

        {pageSequence.map((page) => (
          <div key={page} className="char-editor-page">
            {page === 'chart' && (
              natalPlacements ? (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: '8px' }}>
                  <div style={{ flex: 0.6, minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <HouseWheelWithInfo
                      placements={natalPlacements}
                      houseCusps={houseCusps}
                      hideStellium
                      birthDate={birthDate}
                      onBirthDateChange={v => { setBirthDate(v); setHasDate(true); setPreviewDate(null) }}
                      birthTime={birthTime}
                      onBirthTimeChange={v => {
                        if (v.daysDiff) {
                          const d = new Date(birthDate.year, birthDate.month - 1, birthDate.day)
                          d.setDate(d.getDate() + v.daysDiff)
                          setBirthDate({ day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() })
                        }
                        setBirthTime({ hour: v.hour, minute: v.minute })
                        setPreviewTime(null)
                      }}
                      size={200}
                    />
                  </div>
                  <div style={{ flex: 0.4, minHeight: 0, overflow: 'auto', padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <AstroSummary natalPlacements={natalPlacements} />
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                  Loading chart...
                </div>
              )
            )}

            {page === 'location' && (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px' }}>
                <EarthGlobe city={birthCity} size={200} />
                <div style={{ maxWidth: '300px' }}>
                  <CitySearch value={birthCity} onChange={setBirthCity} />
                </div>
              </div>
            )}

            {page === 'character' && (
              <div className="char-editor-preview">
                <CharacterTemplate colors={displayColors} scale={5} />
                {limited ? (
                  <input
                    className="char-editor-name-input"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') onSave(colorsRef.current, birthDataOutput, name.trim() || null) }}
                    placeholder="Your name"
                    maxLength={24}
                    autoFocus
                  />
                ) : (
                  <div className="char-editor-preview-label">{initialName || '?'}</div>
                )}
                <CassiopeiaWheel
                  colors={colors}
                  onChange={next => { setColors(next); setPreviewColors(null); onChange?.(next) }}
                  onPreview={next => setPreviewColors(next)}
                  onRandom={() => {
                    const next = { ...colors, ...randomPalette() }
                    setColors(next)
                    setPreviewColors(null)
                    onChange?.(next)
                  }}
                />
                <div className="char-editor-actions">
                  <button className="btn-save" onClick={() => onSave(colors, birthDataOutput, trimmedName)}>Embody</button>
                  <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}

      </div>
      </div>
    </div>
  )
}

