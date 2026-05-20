import React, { useState, useRef, useEffect, useMemo } from 'react'
import { getAllPositions, getPlacidusHouses, getHouseNumber, longitudeToSign, longitudeToSymbol, degreesInSign, daysSinceJ2000 } from '../../game/astro/ephemeris.js'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_NAMES } from '../HoroscopeModal/astroConstants.js'
import { ChartPage } from './ChartPage.jsx'
import { LocationPage } from './LocationPage.jsx'
import { CharacterPage } from './CharacterPage.jsx'
import { useEditorState } from './useEditorState.js'
import { useEditorKeyboard } from './useEditorKeyboard.js'
import { useBirthDateHandlers } from './useBirthDateHandlers.js'
import { getPageSequence } from './editorState.js'
import { randomPalette } from './colorUtils.js'
import './CharacterEditor.scss'

export { CitySearch } from './CitySearch.jsx'
export { AstroSummary } from './AstroSummary.jsx'

export default function CharacterEditor({ initialColors, initialBirthData, initialName, scrollPage, limited, onSave, onClose, onChange }) {
  const modalRef = useRef(null)
  const colorsRef = useRef(null)
  const pageSequence = useMemo(() => getPageSequence(limited), [limited])
  const defaultPage = pageSequence[0]

  const editorState = useEditorState(initialColors, initialBirthData, initialName)
  const { activePage, setActivePage, colors, setColors, previewColors, setPreviewColors, chartDate, chartTime, displayColors, trimmedName, birthDataOutput } = editorState
  const { name, setName, birthDate, setBirthDate, birthTime, setBirthTime, hasDate, setHasDate, birthCity, setBirthCity, setPreviewDate, setPreviewTime } = editorState

  useEffect(() => {
    colorsRef.current = colors
  }, [colors])

  useEffect(() => {
    if (scrollPage !== undefined && scrollPage >= 0 && scrollPage < pageSequence.length) {
      setActivePage(pageSequence[scrollPage])
    }
  }, [scrollPage, pageSequence, setActivePage])

  useEditorKeyboard(modalRef, pageSequence, activePage, colorsRef, birthDataOutput, trimmedName, onSave, onClose)
  const { handleBirthDateChange, handleBirthTimeChange } = useBirthDateHandlers(birthDate, setBirthDate, setHasDate, setPreviewDate, setPreviewTime, setBirthTime)

  const { natalPlacements, houseCusps } = useMemo(() => {
    if (!hasDate) return { natalPlacements: null, houseCusps: null }
    try {
      const birthUTC = new Date(Date.UTC(chartDate.year, chartDate.month - 1, chartDate.day, chartDate.hour - (birthCity?.tz ?? 0), chartDate.minute || 0, 0))
      const placements = {}
      const rawNatal = getAllPositions(birthUTC, birthCity ? { lat: birthCity.lat, lng: birthCity.lng } : null)
      const cusps = birthCity ? getPlacidusHouses(daysSinceJ2000(birthUTC), birthCity.lat, birthCity.lng) : null
      for (const [planet, lon] of Object.entries(rawNatal)) {
        const sign = longitudeToSign(lon)
        placements[planet] = {
          longitude: lon,
          sign,
          symbol: longitudeToSymbol(lon),
          degrees: degreesInSign(lon),
          element: SIGN_META[sign]?.element ?? '?',
          house: cusps ? getHouseNumber(lon, cusps) : null,
        }
      }
      return { natalPlacements: placements, houseCusps: cusps }
    } catch {
      return { natalPlacements: null, houseCusps: null }
    }
  }, [hasDate, chartDate, chartTime, birthCity])

  const renderPageContent = () => {
    if (activePage === 'chart') return <ChartPage natalPlacements={natalPlacements} houseCusps={houseCusps} birthDate={birthDate} onBirthDateChange={handleBirthDateChange} birthTime={birthTime} onBirthTimeChange={handleBirthTimeChange} />
    if (activePage === 'location') return <LocationPage birthCity={birthCity} onBirthCityChange={setBirthCity} />
    if (activePage === 'character') return <CharacterPage displayColors={displayColors} colors={colors} onColorsChange={setColors} onPreviewColors={setPreviewColors} initialName={initialName} name={name} onNameChange={setName} limited={limited} birthDataOutput={birthDataOutput} trimmedName={trimmedName} colorsRef={colorsRef} onSave={onSave} onClose={onClose} onChange={onChange} />
  }

  return (
    <div className="char-editor-root">
      {pageSequence.length > 1 && (
        <div className="char-editor-dots" aria-hidden="true">
          {pageSequence.map(page => <span key={page} className={`char-editor-dot${activePage === page ? ' char-editor-dot--active' : ''}`} />)}
        </div>
      )}
      <div className="char-editor-modal" ref={modalRef}>
        <div className="char-editor-content">{renderPageContent()}</div>
      </div>
    </div>
  )
}
