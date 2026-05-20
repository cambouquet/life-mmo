export function initAppRefs() {
  return {
    gameRef: null,
    playerStateRef: null,
    worldDataRef: null,
    canvasWrapRef: null,
    doorUnlockedRef: false,
    nameSetRef: false,
    colorsSetRef: false,
  }
}

export function syncAppRefs(charName, charColors, refs) {
  refs.nameSetRef = !!charName
  refs.colorsSetRef = Object.values(charColors).every(v => v !== '#ffffff')
  refs.doorUnlockedRef = refs.nameSetRef && refs.colorsSetRef
}

export function buildDebugConsoleHandlers(playerStateRef, resetChar, resetUI, resetGame, charName, charColors, birthData) {
  return {
    onReset: () => {
      playerStateRef.current = null
      resetChar()
      resetUI()
      resetGame()
    },
    getSaveData: () => ({
      name: charName,
      colors: charColors,
      birth: birthData,
      pos: playerStateRef.current ? { x: playerStateRef.current.x, y: playerStateRef.current.y, facing: playerStateRef.current.facing } : null,
      savedAt: Date.now(),
    }),
    onLoad: (slot, syncCharToStorage) => {
      syncCharToStorage(slot.colors, slot.birth, slot.name)
      if (slot.pos) playerStateRef.current = slot.pos
      resetUI()
    }
  }
}
