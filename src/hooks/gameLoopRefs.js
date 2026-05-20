import { useRef } from 'react'
import { useRefSync } from './useRefSync'
import { DRAW_SCALE } from '../game/constants.jsx'

export function createGameLoopRefs(paused, onInteract, onStateChange, charColors, debugActive, layerEdits, highlightColors, spriteColorOverrides, hoverPreview, onHoveredTileChange, onWorldDataChange, activeSprite, onZoomChange) {
  const pausedRef = useRefSync(paused)
  const onInteractRef = useRefSync(onInteract)
  const onStateRef = useRefSync(onStateChange)
  const charColorsRef = useRefSync(charColors)
  const debugActiveRef = useRefSync(debugActive)
  const layerEditsRef = useRefSync(layerEdits)
  const highlightColorsRef = useRefSync(highlightColors)
  const spriteColorOverridesRef = useRefSync(spriteColorOverrides)
  const hoverPreviewRef = useRefSync(hoverPreview)
  const onHoveredTileRef = useRefSync(onHoveredTileChange)
  const onWorldDataRef = useRefSync(onWorldDataChange)
  const onEditSpriteRef = useRef(null)
  const activeSpriteRef = useRefSync(activeSprite)
  const onZoomChangeRef = useRefSync(onZoomChange)
  const zoomRef = useRef(DRAW_SCALE)

  return {
    pausedRef, onInteractRef, onStateRef, charColorsRef, debugActiveRef,
    layerEditsRef, highlightColorsRef, spriteColorOverridesRef, hoverPreviewRef,
    onHoveredTileRef, onWorldDataRef, onEditSpriteRef, activeSpriteRef, onZoomChangeRef,
    zoomRef
  }
}
