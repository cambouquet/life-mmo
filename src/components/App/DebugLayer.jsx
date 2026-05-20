import SpritePickerModal from '../DebugButton/SpritePickerModal.jsx'
import InteractionPlayground from '../DebugButton/InteractionPlayground.jsx'
import AdminToolbar from '../DebugButton/BottomToolbar.jsx'

export default function DebugLayer({
  debugActive, setDebugActive,
  pickerState, setPickerState,
  hoveredTile, setHoveredTile,
  spriteColorOverrides, setSpriteColorOverrides,
  activeSprite, setActiveSprite,
  showGameTests, setShowGameTests,
  playerStateRef, worldDataRef,
  setHoverPreview
}) {
  return (
    <>
      {debugActive && pickerState.pickerOpen && (
        <SpritePickerModal
          category={pickerState.pickerOpen}
          currentSprite={
            pickerState.activeTab === 'tiles' ? (
              pickerState.pickerOpen === 'floor' ? pickerState.ground :
              pickerState.pickerOpen === 'wall' ? pickerState.wall :
              pickerState.pickerOpen === 'table' ? pickerState.obj :
              pickerState.pickerOpen === 'torch' ? pickerState.entity :
              null
            ) : (
              pickerState.selectedSpriteForColor
            )
          }
          spriteColorOverrides={spriteColorOverrides}
          activeSprite={activeSprite}
          onActiveSpriteChange={(newActive) => {
            setActiveSprite(newActive)
            if (newActive.sprite === null) {
              setPickerState(prev => ({ ...prev, pickerOpen: newActive.category }))
            }
          }}
          onSelect={(sprite) => {
            if (pickerState.activeTab === 'colors') {
              setPickerState(prev => ({ ...prev, selectedSpriteForColor: sprite, pickerOpen: null }))
            } else {
              setActiveSprite({ category: pickerState.pickerOpen, sprite })
              setPickerState(prev => ({ ...prev, pickerOpen: null }))
            }
          }}
          onClose={() => {
            setPickerState(prev => ({ ...prev, pickerOpen: null }))
            setHoverPreview(null)
          }}
          onHoverPreview={setHoverPreview}
          onSpriteColorChange={setSpriteColorOverrides}
        />
      )}
      {debugActive && showGameTests && (
        <InteractionPlayground
          playerStateRef={playerStateRef}
          worldDataRef={worldDataRef}
          onMovePlayer={(direction) => {
            const keyMap = { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
            const event = new KeyboardEvent('keydown', { code: keyMap[direction] })
            window.dispatchEvent(event)
          }}
          onInteract={() => {
            const event = new KeyboardEvent('keydown', { code: 'KeyE' })
            window.dispatchEvent(event)
          }}
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
