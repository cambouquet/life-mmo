import React, { useRef, useEffect, useCallback } from 'react'
import { renderSLSquareCanvas, computeSLCursor, pickSLColor } from './slSquareUtils.js'
import { useCanvasDrag } from './useCanvasDrag.js'

export function SLSquare({ hue, s, l, size, onChange }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    renderSLSquareCanvas(ctx, hue, size)
  }, [hue, size])

  const pick = useCallback((e) => {
    const [ns, nl] = pickSLColor(e, hue, size, canvasRef)
    onChange(ns, nl)
  }, [hue, size, onChange])

  const { onDown } = useCanvasDrag(pick)
  const [cx, cy] = computeSLCursor(hue, s, l, size)

  return (
    <div className="cp-sl-wrap" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cp-sl-canvas"
        onMouseDown={onDown}
        onTouchStart={onDown}
      />
      <div className="cp-sl-cursor" style={{ left: cx, top: cy }} />
    </div>
  )
}
