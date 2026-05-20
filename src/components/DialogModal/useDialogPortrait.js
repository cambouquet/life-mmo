import { useEffect, useRef } from 'react'
import { drawNpc } from '../../game/draw/npc.jsx'

export function useDialogPortrait() {
  const portraitRef = useRef(null)

  useEffect(() => {
    const canvas = portraitRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    let phase = 0
    let last = performance.now()
    let rafId
    const animate = (ts) => {
      phase += (ts - last) / 1000 * 4.5
      last = ts
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawNpc(ctx, 0, 0, phase)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return portraitRef
}
