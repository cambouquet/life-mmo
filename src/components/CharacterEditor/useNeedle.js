import { useRef, useEffect } from 'react'
import { getPointerAngle } from './wheelGeometry.js'

export function useNeedle(svgRef, cx, cy, needleRef, onDelta) {
  const prevAngle = useRef(null)
  const angleRef = useRef(0)
  const onDeltaRef = useRef(onDelta)

  useEffect(() => {
    onDeltaRef.current = onDelta
  }, [onDelta])

  useEffect(() => {
    if (needleRef.current)
      needleRef.current.setAttribute('transform', `rotate(${angleRef.current} ${cx} ${cy})`)
  })

  return {
    onPointerDown: e => {
      prevAngle.current = getPointerAngle(e, svgRef.current, cx, cy)
      e.currentTarget.setPointerCapture(e.pointerId)
      e.currentTarget.style.cursor = 'grabbing'
    },
    onPointerMove: e => {
      if (prevAngle.current === null) return
      const angle = getPointerAngle(e, svgRef.current, cx, cy)
      let delta = angle - prevAngle.current
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360
      if (Math.abs(delta) < 0.01) return
      angleRef.current += delta
      prevAngle.current = angle
      if (needleRef.current) {
        needleRef.current.setAttribute('transform', `rotate(${angleRef.current} ${cx} ${cy})`)
      }
      onDeltaRef.current(delta)
    },
    onPointerUp: e => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
      prevAngle.current = null
      e.currentTarget.style.cursor = 'grab'
    },
  }
}
