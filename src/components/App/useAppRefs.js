import { useRef, useEffect } from 'react'

export function useAppRefs(exploredTiles) {
  const wrapRef = useRef(null)
  const gameRef = useRef(null)
  const playerStateRef = useRef(null)
  const worldDataRef = useRef(null)
  const canvasWrapRef = useRef(null)
  const doorUnlockedRef = useRef(false)
  const nameSetRef = useRef(false)
  const colorsSetRef = useRef(false)

  useEffect(() => {
    window.__gameRef = gameRef.current
    window.__exploredTiles = exploredTiles
  }, [exploredTiles])

  return { wrapRef, gameRef, playerStateRef, worldDataRef, canvasWrapRef, doorUnlockedRef, nameSetRef, colorsSetRef }
}
