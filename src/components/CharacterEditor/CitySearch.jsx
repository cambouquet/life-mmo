import React, { useState, useRef, useEffect } from 'react'
import { searchCities } from '../../game/astro/cities.js'

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
