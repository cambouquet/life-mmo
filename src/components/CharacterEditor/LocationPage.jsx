import React from 'react'
import { EarthGlobe } from './EarthGlobe.jsx'
import { CitySearch } from './CitySearch.jsx'

export function LocationPage({ birthCity, onBirthCityChange }) {
  return (
    <div className="char-editor-location">
      <EarthGlobe city={birthCity} size={200} />
      <div style={{ maxWidth: '300px' }}>
        <CitySearch value={birthCity} onChange={onBirthCityChange} />
      </div>
    </div>
  )
}
