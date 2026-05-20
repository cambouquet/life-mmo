import { useEffect, useState } from 'react'
import { getSeasonData } from './seasonUtils.js'
import { ClockWidget } from './ClockWidget.jsx'
import { SeasonWidget } from './SeasonWidget.jsx'
import { MapEditorToolbar } from './MapEditorToolbar.jsx'
import './MenuBar.scss'

export default function MenuBar({ debugActive, activeMapMenu, onMapMenuChange, hoveredTile, layers, collMap, layerEdits, onEditSprite, highlightColors, onHighlightColorsChange, spriteColorOverrides, onSpriteColorChange, onHoverPreview, onPickerStateChange, activeSprite, onActiveSpriteChange }) {
  const [now, setNow] = useState(new Date())
  const [overridenDay, setOverridenDay] = useState(undefined)
  const [season, setSeason] = useState(getSeasonData())

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      setNow(d)
      if (overridenDay === undefined) {
        setSeason(getSeasonData())
      }
    }, 1000 * 60)
    return () => clearInterval(id)
  }, [overridenDay])

  return (
    <div className="menu-bar">
      {debugActive && (
        <MapEditorToolbar
          activeMapMenu={activeMapMenu}
          onMapMenuChange={onMapMenuChange}
          onPickerStateChange={onPickerStateChange}
          layerEdits={layerEdits}
          spriteColorOverrides={spriteColorOverrides}
          onEditSprite={onEditSprite}
          onSpriteColorChange={onSpriteColorChange}
        />
      )}
      <ClockWidget now={now} />
      <SeasonWidget season={season} />
    </div>
  )
}
