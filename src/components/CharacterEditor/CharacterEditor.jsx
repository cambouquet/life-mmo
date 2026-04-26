import React, { useState, useRef, useEffect } from 'react'
import { CharacterTemplate } from './CharacterTemplate'
import { searchCities }      from '../../game/astro/cities.js'
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
  const [birthDate, setBirthDate] = useState(initialBirthData?.date ?? '')
  const [birthTime, setBirthTime] = useState(initialBirthData?.time ?? '')
  const [birthCity, setBirthCity] = useState(initialBirthData?.city ?? null)

  const updateColor = (key, val) => {
    const next = { ...colors, [key]: val }
    setColors(next)
    onChange?.(next)
  }

  const buildBirthData = () =>
    birthDate ? { date: birthDate, time: birthTime || '12:00', city: birthCity } : null

  return (
    <div className="char-editor-modal">
      <div className="char-editor-content">
        <div className="char-editor-preview">
          <CharacterTemplate colors={colors} scale={6} />
          <div className="char-editor-preview-label">Mira Mirror</div>
        </div>

        <div className="char-editor-controls">
          <h3>Personalize</h3>

          <div className="control-group">
            <label>Hair</label>
            <input type="color" value={colors.hair} onChange={e => updateColor('hair', e.target.value)} />
          </div>
          <div className="control-group">
            <label>Skin</label>
            <input type="color" value={colors.skin} onChange={e => updateColor('skin', e.target.value)} />
          </div>
          <div className="control-group">
            <label>Eyes</label>
            <input type="color" value={colors.eyes} onChange={e => updateColor('eyes', e.target.value)} />
          </div>
          <div className="control-group">
            <label>Armor</label>
            <input type="color" value={colors.outfit} onChange={e => updateColor('outfit', e.target.value)} />
          </div>
          <div className="control-group">
            <label>Wand</label>
            <input type="color" value={colors.stick} onChange={e => updateColor('stick', e.target.value)} />
          </div>

          {/* ── Birth Chart ── */}
          <div className="birth-section">
            <div className="birth-section__title">Birth Chart</div>

            <div className="birth-datetime">
              <div className="birth-field">
                <label className="birth-label">Date</label>
                <input
                  type="date"
                  className="input-birth"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                />
              </div>
              <div className="birth-field birth-field--time">
                <label className="birth-label">Time</label>
                <input
                  type="time"
                  className="input-birth"
                  value={birthTime}
                  onChange={e => setBirthTime(e.target.value)}
                  placeholder="--:--"
                />
              </div>
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
      </div>
    </div>
  )
}
