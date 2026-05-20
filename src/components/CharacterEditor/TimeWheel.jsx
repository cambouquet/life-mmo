import { useRef, useEffect } from 'react'
import { WheelPicker } from './CirclePicker.jsx'
import { TIME_WHEEL_RINGS, getNeedleConfig, getCenterDisplay } from './timeWheelConfig'

export function TimeWheel({ value, onChange, onPreview, size = 220, style }) {
  const valRef = useRef(value)
  useEffect(() => { valRef.current = value }, [value])
  const rings = TIME_WHEEL_RINGS.map(r => ({
    ...r,
    onSelect: (v, i) => { onChange(r.count === 60 ? { hour: v.hour, minute: i } : { hour: i === 0 ? 12 : i, minute: v.minute }); return v }
  }))

  return (
    <WheelPicker value={value} onChange={onChange} onPreview={onPreview} size={size}
      rings={rings} needleConfig={getNeedleConfig(onChange)} centerDisplay={getCenterDisplay()} style={style} />
  )
}
