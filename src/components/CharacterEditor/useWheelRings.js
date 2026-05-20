import { useRef } from 'react'
import { useImperativeRing } from './useImperativeRing.js'

export function useWheelRings(svgRef, cx, cy, rings, value, onChange, onPreview, hovered, setHovered) {
  return rings.map((ring, idx) =>
    useImperativeRing(svgRef, cx, cy, ring.count, h => {
      const newHovered = { ...hovered }
      newHovered[idx] = h
      setHovered(newHovered)
      if (h === null) {
        onPreview?.(null)
      } else {
        onPreview?.(ring.onHover(value, h))
      }
    }, h => {
      const newHovered = { ...hovered }
      delete newHovered[idx]
      setHovered(newHovered)
      onChange(ring.onSelect(value, h))
    })
  )
}
