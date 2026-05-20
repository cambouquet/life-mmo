import { useRef, useEffect, useCallback } from 'react'
import { getPointerAngle } from './wheelGeometry.js'

export function useImperativeRing(svgRef, cx, cy, total, onPreview, onCommit) {
  const groupRef = useRef(null)
  const isDragging = useRef(false)
  const onPreviewRef = useRef(onPreview)
  const onCommitRef = useRef(onCommit)

  useEffect(() => {
    onPreviewRef.current = onPreview
  }, [onPreview])

  useEffect(() => {
    onCommitRef.current = onCommit
  }, [onCommit])

  const angleToIdx = useCallback(
    e => {
      const angle = getPointerAngle(e, svgRef.current, cx, cy)
      const norm = ((angle + 90) % 360 + 360) % 360
      return Math.floor(norm / (360 / total)) % total
    },
    [svgRef, cx, cy, total]
  )

  const onPointerDown = useCallback(
    e => {
      isDragging.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      e.currentTarget.style.cursor = 'grabbing'
      onPreviewRef.current(angleToIdx(e))
    },
    [angleToIdx]
  )

  const onPointerMove = useCallback(
    e => {
      onPreviewRef.current(angleToIdx(e))
    },
    [angleToIdx]
  )

  const onPointerUp = useCallback(
    e => {
      e.currentTarget.style.cursor = 'grab'
      isDragging.current = false
      onCommitRef.current(angleToIdx(e))
      onPreviewRef.current(null)
    },
    [angleToIdx]
  )

  const onPointerLeave = useCallback(() => {
    if (isDragging.current) return
    onPreviewRef.current(null)
  }, [])

  return { groupRef, onPointerDown, onPointerMove, onPointerUp, onPointerLeave }
}
