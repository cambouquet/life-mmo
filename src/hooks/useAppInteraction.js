import { useCallback, useEffect } from 'react'
import { LS_MAP_EDITS, LS_SPRITE_COLORS } from '../constants/persistence.js'

export function useAppInteraction(
  showHoroscope, setShowHoroscope,
  showEditor, setShowEditor, setEditorPage,
  setShowDialog
) {
  const handleInteract = useCallback((target) => {
    if (showHoroscope) setShowHoroscope(false)
    else if (showEditor) {
      setShowEditor(false)
      setEditorPage(0)
    }
    else if (target === 'mirror1') {
      console.action('Opening Mirror (limited)')
      setShowEditor(true)
      setEditorPage(0)
    }
    else if (target === 'mirror2') {
      console.action('Opening Mirror')
      setShowEditor(true)
      setEditorPage(0)
    }
    else if (target === 'npc' || !showEditor) setShowDialog(true)
  }, [showHoroscope, showEditor, setShowHoroscope, setShowEditor, setEditorPage, setShowDialog])

  return { handleInteract }
}

export function useMapPersistence(layerEdits, spriteColorOverrides) {
  useEffect(() => {
    localStorage.setItem(LS_MAP_EDITS, JSON.stringify(layerEdits))
    localStorage.setItem(LS_SPRITE_COLORS, JSON.stringify(spriteColorOverrides))

    if (Object.keys(layerEdits).length > 0 || Object.keys(spriteColorOverrides).length > 0) {
      fetch('/api/map/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layerEdits, spriteColorOverrides }),
      }).catch(err => console.error('Failed to save map edits:', err))
    }
  }, [layerEdits, spriteColorOverrides])
}

export function useExploredTiles(playerPos, setExploredTiles) {
  useEffect(() => {
    if (playerPos) {
      const TILE = 16
      const tileR = Math.floor(playerPos.y / TILE)
      const tileC = Math.floor(playerPos.x / TILE)
      const tileKey = `${tileR},${tileC}`
      setExploredTiles(prev => new Set(prev).add(tileKey))
    }
  }, [playerPos, setExploredTiles])
}
