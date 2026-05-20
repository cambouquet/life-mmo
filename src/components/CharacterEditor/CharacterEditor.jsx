import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { CharacterTemplate } from './CharacterTemplate'
import { HouseWheel, HouseWheelWithInfo, HOUSE_THEMES } from '../HouseWheel/HouseWheel.jsx'
import { DateWheel, TimeWheel } from './CirclePicker.jsx'
import { getAllPositions, getPlacidusHouses, getHouseNumber, longitudeToSign, longitudeToSymbol, degreesInSign, daysSinceJ2000 } from '../../game/astro/ephemeris.js'
import { PLANET_GLYPHS, SIGN_GLYPHS, ELEMENT_COLOR, PLANET_NAMES } from '../HoroscopeModal/astroConstants.js'
import { CassiopeiaWheel } from './CassiopeiaWheel.jsx'
import { EarthGlobe } from './EarthGlobe.jsx'
import { CitySearch } from './CitySearch.jsx'
import { AstroSummary } from './AstroSummary.jsx'
import { hslToHex, randomHsl, randomPalette } from './colorUtils.js'
import { parseDateFromString, parseTimeFromString, formatDate, formatTime } from './dateTimeUtils.js'
import { PAGES_FULL, PAGES_LIMITED, getPageSequence, DEFAULT_COLORS } from './editorState.js'
import './CharacterEditor.scss'

export { CitySearch }  from './CitySearch.jsx'
export { AstroSummary } from './AstroSummary.jsx'

export default function CharacterEditor({ initialColors, initialBirthData, initialName, scrollPage, limited, onSave, onClose, onChange }) {
  const modalRef = useRef(null)
  const colorsRef = useRef(null)
  const readyRef = useRef(false)

  const pageSequence = useMemo(() => getPageSequence(limited), [limited])
  const defaultPage = useMemo(() => pageSequence[0], [pageSequence])

  const [activePage, setActivePage] = useState(defaultPage)
  const [name, setName] = useState(initialName ?? '')
  const [birthDate, setBirthDate] = useState(() => parseDateFromString(initialBirthData?.date))
  const [birthTime, setBirthTime] = useState(() => parseTimeFromString(initialBirthData?.time))
  const [hasDate, setHasDate] = useState(!!initialBirthData?.date)
  const [birthCity, setBirthCity] = useState(initialBirthData?.city ?? null)
  const [previewDate, setPreviewDate] = useState(null)
  const [previewTime, setPreviewTime] = useState(null)
  const [colors, setColors] = useState(initialColors || DEFAULT_COLORS)
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


  // Update active page from external scrollPage prop or arrow keys
  useEffect(() => {
    if (scrollPage !== undefined && scrollPage >= 0 && scrollPage < pageSequence.length) {
      setActivePage(pageSequence[scrollPage])
    }
  }, [scrollPage, pageSequence])

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
    console.log('[CharacterEditor] activePage changed:', { activePage, pageIndex, pageSequence })

    const el = modalRef.current
    const contentEl = el?.querySelector('.char-editor-content')
    const scrollDebugInfo = {
      modal: {
        scrollLeft: el?.scrollLeft ?? -1,
        clientWidth: el?.clientWidth ?? -1,
        scrollWidth: el?.scrollWidth ?? -1,
        overflowX: el ? window.getComputedStyle(el).overflowX : 'unknown',
      },
      content: contentEl ? {
        scrollLeft: contentEl.scrollLeft,
        clientWidth: contentEl.clientWidth,
        scrollWidth: contentEl.scrollWidth,
        overflowX: window.getComputedStyle(contentEl).overflowX,
      } : null,
    }

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
      scrollInfo: {
        modalScrollLeft: modalRef.current?.scrollLeft ?? -1,
        modalClientWidth: modalRef.current?.clientWidth ?? -1,
        expectedScrollPosition: pageIndex * (modalRef.current?.clientWidth ?? 0),
      },
      scrollDebug: scrollDebugInfo,

      // Navigation
      canGoLeft: pageIndex > 0,
      canGoRight: pageIndex < pageSequence.length - 1,

      // Actions
      actions: {
        goToPage: (pageId) => {
          const index = pageSequence.indexOf(pageId)
          console.log('[CharacterEditor] goToPage action:', { pageId, index, pageSequence })
          if (index >= 0) {
            setActivePage(pageId)
            if (modalRef.current) {
              const targetScroll = index * modalRef.current.clientWidth
              console.log('[CharacterEditor] scrolling to:', { pageId, targetScroll, clientWidth: modalRef.current.clientWidth })
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
        debugScroll: () => {
          const el = modalRef.current
          if (el) {
            const contentEl = el.querySelector('.char-editor-content')
            console.log('[CharacterEditor] Debug scroll state:', {
              modal: {
                scrollLeft: el.scrollLeft,
                clientWidth: el.clientWidth,
                scrollWidth: el.scrollWidth,
                overflow: window.getComputedStyle(el).overflow,
              },
              content: contentEl ? {
                scrollLeft: contentEl.scrollLeft,
                clientWidth: contentEl.clientWidth,
                scrollWidth: contentEl.scrollWidth,
                overflow: window.getComputedStyle(contentEl).overflow,
              } : 'not found',
              expectedIndex: Math.round(el.scrollLeft / el.clientWidth),
              activePage,
              pageSequence,
            })
          }
        },
      }
    }
  }, [pageSequence, activePage, defaultPage, limited, hasDate, birthDate, birthTime, birthCity, natalPlacements, colors, name, modalRef])

  const renderPageContent = () => {
    if (activePage === 'chart') {
      return natalPlacements ? (
        <>
          <div className="char-editor-chart-wheel">
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
          <div className="char-editor-chart-summary">
            <AstroSummary natalPlacements={natalPlacements} />
          </div>
        </>
      ) : (
        <div className="char-editor-loading">Loading chart...</div>
      )
    }

    if (activePage === 'location') {
      return (
        <div className="char-editor-location">
          <EarthGlobe city={birthCity} size={200} />
          <div style={{ maxWidth: '300px' }}>
            <CitySearch value={birthCity} onChange={setBirthCity} />
          </div>
        </div>
      )
    }

    if (activePage === 'character') {
      return (
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
      )
    }
  }

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
          {renderPageContent()}
        </div>
      </div>
    </div>
  )
}

