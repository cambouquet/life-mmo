import React, { useRef, useEffect, useCallback, useState } from 'react'

// ── Colour utilities ──────────────────────────────────────────────────────────

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = 0; s = 0 } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      default: h = ((r - g) / d + 4) / 6
    }
  }
  return [h * 360, s * 100, l * 100]
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) { r = g = b = l } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}

// ── SL square rendered on canvas ─────────────────────────────────────────────

function SLSquare({ hue, s, l, size, onChange }) {
  const canvasRef = useRef(null)
  const dragging  = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // White → hue gradient (left→right)
    const gradH = ctx.createLinearGradient(0, 0, size, 0)
    gradH.addColorStop(0, `hsl(${hue}, 0%, 100%)`)
    gradH.addColorStop(1, `hsl(${hue}, 100%, 50%)`)
    ctx.fillStyle = gradH
    ctx.fillRect(0, 0, size, size)

    // Transparent → black gradient (top→bottom)
    const gradV = ctx.createLinearGradient(0, 0, 0, size)
    gradV.addColorStop(0, 'rgba(0,0,0,0)')
    gradV.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.fillStyle = gradV
    ctx.fillRect(0, 0, size, size)
  }, [hue, size])

  // Convert HSL s,l to cursor position on the SL square
  // The square maps: x → saturation (0..100), y → "value" in HSV space
  // We work in HSV internally for the square, convert to HSL for output
  function hslToHsv(h, s, l) {
    s /= 100; l /= 100
    const v = l + s * Math.min(l, 1 - l)
    const sv = v === 0 ? 0 : 2 * (1 - l / v)
    return [h, sv * 100, v * 100]
  }
  function hsvToHsl(h, sv, v) {
    sv /= 100; v /= 100
    const l = v * (1 - sv / 2)
    const sl = (l === 0 || l === 1) ? 0 : (v - l) / Math.min(l, 1 - l)
    return [h, sl * 100, l * 100]
  }

  const [, sv, v] = hslToHsv(hue, s, l)
  const cx = (sv / 100) * size
  const cy = (1 - v / 100) * size

  const pick = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const px = Math.max(0, Math.min(size, (clientX - rect.left) * (size / rect.width)))
    const py = Math.max(0, Math.min(size, (clientY - rect.top)  * (size / rect.height)))
    const sv = px / size * 100
    const v  = (1 - py / size) * 100
    const [, ns, nl] = hsvToHsl(hue, sv, v)
    onChange(ns, nl)
  }, [hue, size, onChange])

  const onDown = e => { dragging.current = true; pick(e) }
  const onMove = e => { if (dragging.current) pick(e) }
  const onUp   = () => { dragging.current = false }

  useEffect(() => {
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('touchend',  onUp)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: false })
    return () => {
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('touchend',  onUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
    }
  })

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
      <div
        className="cp-sl-cursor"
        style={{ left: cx, top: cy }}
      />
    </div>
  )
}

// ── Hue strip ─────────────────────────────────────────────────────────────────

function HueStrip({ hue, width, height, onChange }) {
  const canvasRef = useRef(null)
  const dragging  = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, width, 0)
    for (let i = 0; i <= 12; i++) grad.addColorStop(i / 12, `hsl(${i * 30}, 100%, 50%)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }, [width, height])

  const pick = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const px = Math.max(0, Math.min(width, (clientX - rect.left) * (width / rect.width)))
    onChange(px / width * 360)
  }, [width, onChange])

  const onDown = e => { dragging.current = true; pick(e) }
  const onMove = e => { if (dragging.current) pick(e) }
  const onUp   = () => { dragging.current = false }

  useEffect(() => {
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('touchend',  onUp)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: false })
    return () => {
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('touchend',  onUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
    }
  })

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
      <div
        className="cp-hue-cursor"
        style={{ left: hue / 360 * width }}
      />
    </div>
  )
}

// ── Main popup ────────────────────────────────────────────────────────────────

export function ColorPickerPopup({ value, onChange, onClose }) {
  const [h, s, l] = hexToHsl(value)
  const [hue, setHue] = useState(h)
  const [sat, setSat] = useState(s)
  const [lit, setLit] = useState(l)
  const wrapRef = useRef(null)

  // Sync hue when parent color changes externally
  useEffect(() => {
    const [nh, ns, nl] = hexToHsl(value)
    setHue(nh); setSat(ns); setLit(nl)
  }, [value])

  const emit = useCallback((nh, ns, nl) => {
    onChange(hslToHex(nh, ns, nl))
  }, [onChange])

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose()
    }
    // Delay to not fire on the same click that opened it
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 80)
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler) }
  }, [onClose])

  const SIZE = 148

  return (
    <div className="cp-popup" ref={wrapRef}>
      <SLSquare
        hue={hue} s={sat} l={lit} size={SIZE}
        onChange={(ns, nl) => { setSat(ns); setLit(nl); emit(hue, ns, nl) }}
      />
      <HueStrip
        hue={hue} width={SIZE} height={14}
        onChange={nh => { setHue(nh); emit(nh, sat, lit) }}
      />
      <div className="cp-preview" style={{ background: hslToHex(hue, sat, lit) }} />
    </div>
  )
}
