import React, { useRef, useEffect } from 'react'
import { WheelPicker } from './CirclePicker.jsx'

export function TimeWheel({ value, onChange, onPreview, size = 220, style }) {
  const { hour, minute } = value
  const valRef = useRef({ hour, minute })
  useEffect(() => { valRef.current = { hour, minute } }, [hour, minute])

  const rings = [
    {
      count: 60,
      r1: 28, r2: 50,
      isSelected: (v) => false,
      shouldShowLabel: (i) => i % 15 === 0,
      label: (i) => String(i).padStart(2,'0'),
      onHover: (v, i) => ({ hour: v.hour, minute: i }),
      onSelect: (v, i) => { onChange({ hour: v.hour, minute: i }); return v }
    },
    {
      count: 12,
      r1: 54, r2: 76,
      isSelected: (v, i) => (i === 0 ? 12 : i) === v.hour,
      shouldShowLabel: () => true,
      label: (i) => i === 0 ? '12' : String(i).padStart(2,'0'),
      onHover: (v, i) => ({ hour: i === 0 ? 12 : i, minute: v.minute }),
      onSelect: (v, i) => { onChange({ hour: i === 0 ? 12 : i, minute: v.minute }); return v }
    }
  ]

  return (
    <WheelPicker
      value={value}
      onChange={onChange}
      onPreview={onPreview}
      size={size}
      rings={rings}
      needleConfig={{
        needleR1: 80,
        needleR2: 102,
        degreesToUnits: 60 / 360,
        onDelta: (v, steps) => {
          let totalMin = v.hour * 60 + v.minute + steps
          let daysDiff = Math.floor(totalMin / 1440)
          totalMin = ((totalMin % 1440) + 1440) % 1440
          const nextVal = { hour: Math.floor(totalMin / 60), minute: totalMin % 60, daysDiff }
          onChange(nextVal)
          return nextVal
        }
      }}
      centerDisplay={{
        lines: [
          {
            offset: 0,
            size: 13,
            weight: 700,
            color: '#e8d4ff',
            text: (v) => `${String(v.hour).padStart(2,'0')}:${String(v.minute).padStart(2,'0')}`
          },
          {
            offset: 12,
            size: 11,
            weight: 500,
            color: 'rgba(200,168,240,0.7)',
            text: (v) => v.hour === 0 ? '12 AM' : v.hour < 12 ? v.hour + ' AM' : v.hour === 12 ? '12 PM' : (v.hour - 12) + ' PM'
          }
        ]
      }}
      style={style}
    />
  )
}
