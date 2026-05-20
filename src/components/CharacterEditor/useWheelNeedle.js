import { useRef } from 'react'
import { useNeedle } from './useNeedle.js'

export function useWheelNeedle(svgRef, cx, cy, needleRef, needleConfig, value, onChange) {
  const needleAccum = useRef(0)

  return needleConfig
    ? useNeedle(svgRef, cx, cy, needleRef, delta => {
        needleAccum.current += delta * needleConfig.degreesToUnits
        const steps = Math.trunc(needleAccum.current)
        if (steps === 0) return
        needleAccum.current -= steps
        const newValue = needleConfig.onDelta(value, steps)
        onChange(newValue)
      })
    : null
}
