import React, { useRef, useEffect } from 'react'
import { WheelPicker } from './CirclePicker.jsx'
import { createDateRings, needleConfig as baseNeedleConfig, centerDisplay } from './dateWheelConfig.js'
import { createDateWheelNeedleHandler } from './dateWheelHandlers.js'

export function DateWheel({ value, onChange, onPreview, size = 220, style }) {
  const { day, month, year } = value
  const valRef = useRef({ day, month, year })
  useEffect(() => { valRef.current = { day, month, year } }, [day, month, year])

  const rings = createDateRings(value, month, year, onChange)
  const needleHandler = createDateWheelNeedleHandler(onChange)
  const needleConfig = { ...baseNeedleConfig, ...needleHandler }

  return (
    <WheelPicker
      value={value}
      onChange={onChange}
      onPreview={onPreview}
      size={size}
      rings={rings}
      needleConfig={needleConfig}
      centerDisplay={centerDisplay}
      style={style}
    />
  )
}
