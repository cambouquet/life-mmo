import React, { useRef, useEffect, useCallback, useState } from 'react'
import { hexToHsl, hslToHex } from './colorConversion.js'
import { SLSquare } from './SLSquare.jsx'
import { HueStrip } from './HueStrip.jsx'

export function ColorPickerPopup({ value, onChange, onClose }) {
  const [h, s, l] = hexToHsl(value)
  const [hue, setHue] = useState(h)
  const [sat, setSat] = useState(s)
  const [lit, setLit] = useState(l)
  const wrapRef = useRef(null)

  useEffect(() => {
    const [nh, ns, nl] = hexToHsl(value)
    setHue(nh)
    setSat(ns)
    setLit(nl)
  }, [value])

  const emit = useCallback((nh, ns, nl) => {
    onChange(hslToHex(nh, ns, nl))
  }, [onChange])

  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose()
    }
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 80)
    return () => {
      clearTimeout(id)
      document.removeEventListener('mousedown', handler)
    }
  }, [onClose])

  const SIZE = 148

  return (
    <div className="cp-popup" ref={wrapRef}>
      <SLSquare
        hue={hue}
        s={sat}
        l={lit}
        size={SIZE}
        onChange={(ns, nl) => {
          setSat(ns)
          setLit(nl)
          emit(hue, ns, nl)
        }}
      />
      <HueStrip
        hue={hue}
        width={SIZE}
        height={14}
        onChange={nh => {
          setHue(nh)
          emit(nh, sat, lit)
        }}
      />
      <div className="cp-preview" style={{ background: hslToHex(hue, sat, lit) }} />
    </div>
  )
}
