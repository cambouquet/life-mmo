import { useEffect, useRef } from 'react'
import { W, H, SCALE } from '../game/constants.jsx'

const TOTAL_W = W * SCALE
const TOTAL_H = 64 + H * SCALE + 40   // HUD height + canvas + hint bar

export function useViewportScale() {
  const ref = useRef(null)

  useEffect(() => {
    function fit() {
      const s = Math.min(
        1,
        (window.innerHeight * 0.97) / TOTAL_H,
        (window.innerWidth  * 0.98) / TOTAL_W,
      )
      if (ref.current) ref.current.style.transform = `scale(${s})`
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return ref
}
