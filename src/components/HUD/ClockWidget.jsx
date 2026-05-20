import { ROMAN_NUMERALS } from './seasonUtils.js'
import { calculateClockAngles, getHandCoordinates, getNumeralPosition } from './clockUtils.js'

export function ClockWidget({ now }) {
  const { hourAngle, minuteAngle } = calculateClockAngles(now)
  const hourHand = getHandCoordinates(hourAngle, 18)
  const minuteHand = getHandCoordinates(minuteAngle, 28)
  const timeString = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })

  return (
    <div className="menu-bar__clock">
      <div className="menu-bar__time-tooltip">{timeString}</div>
      <svg viewBox="0 0 100 100" className="clock-svg">
        {Object.entries(ROMAN_NUMERALS).map(([index, numeral]) => {
          const i = parseInt(index)
          const pos = getNumeralPosition(i)
          return <text key={i} x={pos.x} y={pos.y} className="clock-numeral" textAnchor="middle" dominantBaseline="middle">{numeral}</text>
        })}
        <line x1="50" y1="50" x2={hourHand.x2} y2={hourHand.y2} className="hour-hand" />
        <line x1="50" y1="50" x2={minuteHand.x2} y2={minuteHand.y2} className="minute-hand" />

        <circle cx="50" cy="50" r="3" className="clock-center" />
      </svg>
    </div>
  )
}
