import { RINGS, PALETTES, CENTER_R } from './cassiopeiaData'
import { getPointerAngle, getPointerDist } from './cassiopeiaGeometry'

export function createCassiopeiaHitTest(svgRef, cx, cy) {
  return (e) => {
    const svg = svgRef.current
    if (!svg) return null
    const ang = getPointerAngle(e, svg, cx, cy)
    const dist = getPointerDist(e, svg, cx, cy)
    for (let ri = 0; ri < RINGS.length; ri++) {
      const ring = RINGS[ri]
      if (dist < ring.r1 || dist > ring.r2) continue
      const pal = PALETTES[ring.key]
      const n = pal.length
      const seg = Math.floor(ang / (360 / n)) % n
      return { ringIdx: ri, segIdx: seg }
    }
    return null
  }
}

export function createCassiopeiaHandlers(svgRef, colors, onPreview, onChange, hitTest, setHov) {
  const cx = RINGS[0] ? RINGS[0].r1 : 0, cy = cx

  const onPointerMove = (e) => {
    const hit = hitTest(e)
    setHov(hit)
    if (hit) {
      const ring = RINGS[hit.ringIdx]
      const hex = PALETTES[ring.key][hit.segIdx]
      onPreview?.({ ...colors, [ring.key]: hex })
    } else {
      onPreview?.(null)
    }
  }

  const onPointerLeave = () => {
    setHov(null)
    onPreview?.(null)
  }

  const onPointerDown = (e) => {
    const dist = getPointerDist(e, svgRef.current, cx, cy)
    if (dist <= CENTER_R) return
    const hit = hitTest(e)
    if (!hit) return
    const ring = RINGS[hit.ringIdx]
    const hex = PALETTES[ring.key][hit.segIdx]
    onChange({ ...colors, [ring.key]: hex })
  }

  return { onPointerMove, onPointerLeave, onPointerDown }
}
