import { useEffect, useState } from 'react'
import './MenuBar.scss'

const ROMAN_NUMERALS = {
  0:  'XII',
  3:  'III',
  6:  'VI',
  9:  'IX'
}

function getSeasonProgress() {
  const now = new Date()
  const year = now.getFullYear()
  const dayOfYear = Math.floor((now - new Date(year, 0, 0)) / 86400000)

  const summerSolstice = 172
  const winterSolstice = 355

  let progress
  if (dayOfYear < summerSolstice) {
    progress = (dayOfYear - 1) / (summerSolstice - 1)
  } else if (dayOfYear < winterSolstice) {
    progress = 1 - ((dayOfYear - summerSolstice) / (winterSolstice - summerSolstice))
  } else {
    progress = (365 - dayOfYear) / (365 - winterSolstice)
  }

  return Math.max(0, Math.min(1, progress))
}

export default function MenuBar() {
  const [now, setNow] = useState(new Date())
  const [seasonProgress, setSeasonProgress] = useState(getSeasonProgress())

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date())
      setSeasonProgress(getSeasonProgress())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  const hourAngle = (hours * 30) + (minutes * 0.5)
  const minuteAngle = (minutes * 6) + (seconds * 0.1)

  return (
    <div className="menu-bar">
      <div className="menu-bar__clock">
        <svg viewBox="0 0 100 100" className="clock-svg">
          {/* Roman numerals */}
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

          {/* Hour hand */}
          <line
            x1="50"
            y1="50"
            x2={50 + 18 * Math.cos((hourAngle - 90) * Math.PI / 180)}
            y2={50 + 18 * Math.sin((hourAngle - 90) * Math.PI / 180)}
            className="hour-hand"
          />

          {/* Minute hand */}
          <line
            x1="50"
            y1="50"
            x2={50 + 28 * Math.cos((minuteAngle - 90) * Math.PI / 180)}
            y2={50 + 28 * Math.sin((minuteAngle - 90) * Math.PI / 180)}
            className="minute-hand"
          />

          {/* Center dot */}
          <circle cx="50" cy="50" r="3" className="clock-center" />
        </svg>
      </div>

      <div className="menu-bar__season">
        <svg viewBox="0 0 80 80" className="season-svg">
          {/* Sun/Moon circle that rotates */}
          <circle
            cx={40 + 25 * Math.cos(seasonProgress * Math.PI * 2 - Math.PI / 2)}
            cy={40 + 25 * Math.sin(seasonProgress * Math.PI * 2 - Math.PI / 2)}
            r="10"
            className={seasonProgress > 0.5 ? 'sun sun--bright' : 'sun sun--dim'}
          />
        </svg>
      </div>
    </div>
  )
}
