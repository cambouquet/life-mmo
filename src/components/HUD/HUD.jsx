import Logo     from './Logo.jsx'
import CharPanel from './CharPanel.jsx'
import LogPanel  from './LogPanel.jsx'
import Clock     from './Clock.jsx'
import Minimap   from './Minimap.jsx'
import MenuBar   from './MenuBar.jsx'

export default function HUD({ facing, moving, logEntries, charColors, charName, playerPos, exploredTiles, worldData, debugActive, activeMapMenu, onMapMenuChange, hoveredTile, layers, collMap, layerEdits, onEditSprite, highlightColors, onHighlightColorsChange, spriteColorOverrides, onSpriteColorChange, onHoverPreview, onPickerStateChange, activeSprite, onActiveSpriteChange }) {
  return (
    <div className="hud-header">
      <div className="hud">
        <Logo />
        <div className="hud__right">
          <MenuBar debugActive={debugActive} activeMapMenu={activeMapMenu} onMapMenuChange={onMapMenuChange} hoveredTile={hoveredTile} layers={layers} collMap={collMap} layerEdits={layerEdits} onEditSprite={onEditSprite} highlightColors={highlightColors} onHighlightColorsChange={onHighlightColorsChange} spriteColorOverrides={spriteColorOverrides} onSpriteColorChange={onSpriteColorChange} onHoverPreview={onHoverPreview} onPickerStateChange={onPickerStateChange} activeSprite={activeSprite} onActiveSpriteChange={onActiveSpriteChange} />
          <div className="hud__content">
            <CharPanel facing={facing} moving={moving} charColors={charColors} charName={charName} />
            <LogPanel entries={logEntries} />
            <Minimap playerPos={playerPos} exploredTiles={exploredTiles} worldData={worldData} charColors={charColors} />
          </div>
        </div>
      </div>
    </div>
  )
}
