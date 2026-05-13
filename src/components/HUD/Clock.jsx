import { useState } from 'react'

export default function Clock() {
  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)

  const handleHourChange = (e) => {
    let h = parseInt(e.target.value) || 12
    if (h < 1) h = 12
    if (h > 12) h = h % 12 || 12
    setHour(h)
  }

  const handleMinuteChange = (e) => {
    let m = parseInt(e.target.value) || 0
    if (m < 0) m = 0
    if (m > 59) m = 59
    setMinute(m)
  }

  return (
    <div className="clock-panel">
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <input
          type="number"
          min="1"
          max="12"
          value={String(hour).padStart(2, '0')}
          onChange={handleHourChange}
          style={{
            width: '40px',
            padding: '4px',
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.3)',
            color: '#e8d4ff',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '700',
          }}
        />
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={String(minute).padStart(2, '0')}
          onChange={handleMinuteChange}
          style={{
            width: '40px',
            padding: '4px',
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.3)',
            color: '#e8d4ff',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '700',
          }}
        />
      </div>
    </div>
  )
}
