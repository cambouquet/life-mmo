import React, { useState, useRef, useEffect, useMemo } from 'react'
import { CharacterTemplate } from './CharacterTemplate'
import { searchCities }      from '../../game/astro/cities.js'
import { HouseWheel }        from '../HouseWheel/HouseWheel.jsx'
import { DateWheel, TimeWheel } from './CirclePicker.jsx'
import { getAllPositions, getPlacidusHouses, getHouseNumber, longitudeToSign, longitudeToSymbol, degreesInSign, daysSinceJ2000 } from '../../game/astro/ephemeris.js'
import { SIGN_META }         from '../../game/astro/horoscope.js'
import './CharacterEditor.scss'

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
          <CharacterTemplate colors={colors} scale={6} />
          <div className="char-editor-preview-label">Kami</div>
        </div>

        <div className="char-editor-controls">
          <h3>Personalize</h3>

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

          {/* ── Birth Chart ── */}
          <div className="birth-section">
            <div className="birth-section__title">Birth Chart</div>

            <div className="circle-pickers">
              <DateWheel value={birthDate} onChange={v => { setBirthDate(v); setHasDate(true) }} size={260} />
              <TimeWheel value={birthTime} onChange={setBirthTime} size={200} />
            </div>

            <div className="birth-field">
              <label className="birth-label">Place</label>
              <CitySearch value={birthCity} onChange={setBirthCity} />
            </div>
          </div>

          <div className="char-editor-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={() => onSave(colors, buildBirthData())}>Embody</button>
          </div>
        </div>

        {natalPlacements && (
          <div className="char-editor-wheel">
            <HouseWheel placements={natalPlacements} houseCusps={houseCusps} size={280} />
          </div>
        )}
      </div>
    </div>
  )
}
