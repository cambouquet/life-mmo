import React from 'react'
import { ORBITS } from './houseWheelData.js'

export function WheelBackground({ cx, cy }) {
  return (
    <>
      {ORBITS.map(o => (
        <circle key={o.id} cx={cx} cy={cy} r={o.r} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
      ))}
      <circle cx={cx} cy={cy} r="30" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,2" />
      <circle cx={cx} cy={cy} r="4" fill="rgba(255,255,255,0.15)" />
    </>
  )
}
