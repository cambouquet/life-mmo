import React from 'react'

export function WheelNeedle({ cx, cy, needleRef, needleConfig, needle }) {
  return (
    <g onPointerDown={needle.onPointerDown} onPointerMove={needle.onPointerMove} onPointerUp={needle.onPointerUp} style={{ cursor: 'grab' }}>
      <circle cx={cx} cy={cy} r={needleConfig.needleR2 + 4} fill="none" stroke="transparent" strokeWidth="22" />
      <g ref={needleRef}>
        <line x1={cx} y1={cy - needleConfig.needleR1} x2={cx} y2={cy - needleConfig.needleR2} stroke="rgba(168,85,247,0.35)" strokeWidth="10" strokeLinecap="round" />
        <line x1={cx} y1={cy - needleConfig.needleR1} x2={cx} y2={cy - needleConfig.needleR2} stroke="rgba(232,212,255,0.95)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>
  )
}
