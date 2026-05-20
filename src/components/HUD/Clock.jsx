import { useState } from 'react'
import { INPUT_STYLE, SEPARATOR_STYLE, CONTAINER_STYLE } from './clockStyles.js'
import { validateHour, validateMinute } from './clockValidation.js'

export default function Clock() {
  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)

  return (
    <div className="clock-panel">
      <div style={CONTAINER_STYLE}>
        <input
          type="number"
          min="1"
          max="12"
          value={String(hour).padStart(2, '0')}
          onChange={(e) => setHour(validateHour(e.target.value))}
          style={INPUT_STYLE}
        />
        <span style={SEPARATOR_STYLE}>:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={String(minute).padStart(2, '0')}
          onChange={(e) => setMinute(validateMinute(e.target.value))}
          style={INPUT_STYLE}
        />
      </div>
    </div>
  )
}
