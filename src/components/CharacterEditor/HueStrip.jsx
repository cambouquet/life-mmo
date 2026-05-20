import React, { useRef, useEffect, useCallback } from 'react'
import { renderHueStripCanvas, pickHueColor } from './hueStripUtils.js'
import { useCanvasDrag } from './useCanvasDrag.js'

export function HueStrip({ hue, width, height, onChange }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    renderHueStripCanvas(ctx, width, height)
  }, [width, height])

  const pick = useCallback((e) => {
    const nh = pickHueColor(e, width, canvasRef)
    onChange(nh)
  }, [width, onChange])

  const { onDown } = useCanvasDrag(pick)

  return (
    <div className="cp-hue-wrap" style={{ width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="cp-hue-canvas"
        onMouseDown={onDown}
        onTouchStart={onDown}
      />
      <div className="cp-hue-cursor" style={{ left: (hue / 360) * width }} />
    </div>
  )
}
