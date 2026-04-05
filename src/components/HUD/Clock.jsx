import { useEffect, useState } from 'react'

const TZ = 'Europe/Paris'

function formatTime(d) {
  return d.toLocaleTimeString('en-GB', { timeZone: TZ, hour12: false })
}

function formatDate(d) {
  return d.toLocaleDateString('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="clock-panel">
      <div className="clock-panel__time">{formatTime(now)}</div>
      <div className="clock-panel__date">{formatDate(now)}</div>
    </div>
  )
}
