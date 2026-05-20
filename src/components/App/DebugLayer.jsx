import SpritePickerModal from '../DebugButton/SpritePickerModal'
import InteractionPlayground from '../DebugButton/InteractionPlayground'
import AdminToolbar from '../DebugButton/BottomToolbar'
import { getCurrentSprite, createSpritePickerHandlers, createInteractionHandlers } from './debugLayerHandlers'

export default function DebugLayer({ debugActive, setDebugActive, pickerState, setPickerState, hoveredTile, setHoveredTile, spriteColorOverrides, setSpriteColorOverrides, activeSprite, setActiveSprite, showGameTests, setShowGameTests, playerStateRef, worldDataRef, setHoverPreview }) {
  const spriteHandlers = createSpritePickerHandlers(setActiveSprite, setPickerState, setHoverPreview)
  const interactionHandlers = createInteractionHandlers()

  return (
    <>
      {debugActive && pickerState.pickerOpen && (
        <SpritePickerModal
          category={pickerState.pickerOpen}
          currentSprite={getCurrentSprite(pickerState)}
          spriteColorOverrides={spriteColorOverrides}
          activeSprite={activeSprite}
          onActiveSpriteChange={spriteHandlers.onActiveSpriteChange}
          onSelect={(sprite) => spriteHandlers.onSelect(sprite, pickerState)}
          onClose={spriteHandlers.onClose}
          onHoverPreview={setHoverPreview}
          onSpriteColorChange={setSpriteColorOverrides}
        />
      )}
      {debugActive && showGameTests && (
        <InteractionPlayground
          playerStateRef={playerStateRef}
          worldDataRef={worldDataRef}
          onMovePlayer={interactionHandlers.onMovePlayer}
          onInteract={interactionHandlers.onInteract}
        />
      )}
      <AdminToolbar
        isOpen={debugActive}
        onToggle={() => setDebugActive(!debugActive)}
        onEditMap={() => setDebugActive(!debugActive)}
        onRecord={() => {}}
      />
    </>
  )
}
