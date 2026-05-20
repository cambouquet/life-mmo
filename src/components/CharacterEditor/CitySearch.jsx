import { useState, useRef, useEffect } from 'react'
import { searchCities } from '../../game/astro/cities.js'
import { formatCityCoords, useCitySearchOutsideClick } from './citySearchHelpers'

export function CitySearch({ value, onChange }) {
  const [query, setQuery] = useState(value?.name ?? '')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const handler = useCitySearchOutsideClick(wrapRef, setOpen)
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleInput = (e) => {
    const q = e.target.value
    setQuery(q)
    const found = searchCities(q)
    setResults(found)
    setOpen(found.length > 0)
    if (q === '') onChange(null)
  }

  const select = (city) => {
    setQuery(`${city.name}, ${city.country}`)
    setResults([])
    setOpen(false)
    onChange(city)
  }

  return (
    <div className="city-search" ref={wrapRef}>
      <input className="input-birth input-city" style={{ textAlign: 'center' }} type="text" value={query}
        onChange={handleInput} onFocus={() => query && setOpen(results.length > 0)}
        placeholder="City of birth" autoComplete="off" />
      {open && (
        <div className="city-dropdown">
          {results.map(city => (
            <div key={`${city.name}-${city.country}`} className="city-option" onMouseDown={() => select(city)}>
              <span className="city-option__name">{city.name}</span>
              <span className="city-option__meta">{city.country} · {formatCityCoords(city, true).split(' · ')[0]}</span>
            </div>
          ))}
        </div>
      )}
      {value && <div className="city-coords" style={{ textAlign: 'center' }}>{formatCityCoords(value)}</div>}
    </div>
  )
}
