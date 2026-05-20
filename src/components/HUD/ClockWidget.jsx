import { ROMAN_NUMERALS } from './seasonUtils.js'

export function ClockWidget({ now }) {
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  const hourAngle = (hours * 30) + (minutes * 0.5)
  const minuteAngle = (minutes * 6) + (seconds * 0.1)

  const timeString = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })

  return (
    <div className="menu-bar__clock">
      <div className="menu-bar__time-tooltip">{timeString}</div>
      <svg viewBox="0 0 100 100" className="clock-svg">
        {Object.entries(ROMAN_NUMERALS).map(([index, numeral]) => {
          const i = parseInt(index)
          const angle = (i * 30 - 90) * Math.PI / 180
          const x = 50 + 35 * Math.cos(angle)
          const y = 50 + 35 * Math.sin(angle)
          return (
            <text
              key={i}
              x={x}
              y={y}
              className="clock-numeral"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {numeral}
            </text>
          )
        })}

        <line
          x1="50"
          y1="50"
          x2={50 + 18 * Math.cos((hourAngle - 90) * Math.PI / 180)}
          y2={50 + 18 * Math.sin((hourAngle - 90) * Math.PI / 180)}
          className="hour-hand"
        />

        <line
          x1="50"
          y1="50"
          x2={50 + 28 * Math.cos((minuteAngle - 90) * Math.PI / 180)}
          y2={50 + 28 * Math.sin((minuteAngle - 90) * Math.PI / 180)}
          className="minute-hand"
        />

        <circle cx="50" cy="50" r="3" className="clock-center" />
      </svg>
    </div>
  )
}
