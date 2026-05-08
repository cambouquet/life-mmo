import { useEffect, useState } from 'react'
import './MenuBar.scss'

const ROMAN_NUMERALS = {
  0:  'XII',
  3:  'III',
  6:  'VI',
  9:  'IX'
}

function getSeasonData(overrideDay) {
  const now = new Date()
  const year = now.getFullYear()
  const dayOfYear = overrideDay !== undefined ? overrideDay : Math.floor((now - new Date(year, 0, 0)) / 86400000)

  // Approximate solstices
  const summerSolstice = 172 // June 21
  const winterSolstice = 355 // Dec 21

  // Calculate light progress (0 = darkest/Winter, 1 = brightest/Summer)
  let lightProgress
  if (dayOfYear <= summerSolstice) {
    const totalDays = summerSolstice + (365 - winterSolstice)
    const daysSinceWinter = dayOfYear + (365 - winterSolstice)
    lightProgress = daysSinceWinter / totalDays
  } else if (dayOfYear <= winterSolstice) {
    const totalDays = winterSolstice - summerSolstice
    const daysSinceSummer = dayOfYear - summerSolstice
    lightProgress = 1 - (daysSinceSummer / totalDays)
  } else {
    const totalDays = summerSolstice + (365 - winterSolstice)
    const daysSinceWinter = dayOfYear - winterSolstice
    lightProgress = daysSinceWinter / totalDays
  }

  // yearProgress for the full 360 rotation (0-1)
  const yearProgress = dayOfYear / 365
  
  // Format date for display
  const date = new Date(year, 0); // Jan 1st
  date.setDate(dayOfYear + 1);
  const dateString = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return {
    light: Math.max(0, Math.min(1, lightProgress)),
    year:  yearProgress,
    isRising: dayOfYear > winterSolstice || dayOfYear < summerSolstice,
    day: dayOfYear,
    dateString
  }
}

export default function MenuBar() {
  const [now, setNow] = useState(new Date())
  const [overridenDay, setOverridenDay] = useState(172) // Default to June 21 (Summer Solstice)
  const [season, setSeason] = useState(getSeasonData(172))

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date())
      if (overridenDay === undefined) {
        setSeason(getSeasonData())
      }
    }, 1000 * 60)
    return () => clearInterval(id)
  }, [overridenDay])

  const handleDayChange = (e) => {
    const day = parseInt(e.target.value)
    setOverridenDay(day)
    setSeason(getSeasonData(day))
  }

  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  const hourAngle = (hours * 30) + (minutes * 0.5)
  const minuteAngle = (minutes * 6) + (seconds * 0.1)

  const timeString = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })

  return (
    <div className="menu-bar">
      <div className="menu-bar__clock">
        <div className="menu-bar__time-tooltip">{timeString}</div>
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
        <div className="menu-bar__time-tooltip">
          {season.dateString} — {season.isRising ? 'Rising' : 'Falling'}
        </div>
        <svg viewBox="0 0 80 80" className="season-svg">
          {/* Background Orbit/Sky */}
          <circle cx="40" cy="40" r="30" className="season-sky-bg" />
          
          {/* Horizon Line */}
          <line x1="10" y1="40" x2="70" y2="40" className="season-horizon" />

          {/* The Sun / Moon Indicator */}
          <circle
            cx={40 + 30 * Math.cos(season.year * Math.PI * 2 - Math.PI / 2)}
            cy={40 + 30 * Math.sin(season.year * Math.PI * 2 - Math.PI / 2)}
            r={10}
            className="season-sun"
            style={{
              fill: season.light > 0.5 ? '#ffff00' : '#88ccff',
              filter: `drop-shadow(0 0 ${12 * season.light}px ${season.light > 0.5 ? 'gold' : '#7ab8ff'}) brightness(1.5)`
            }}
          />

          {/* Glowing Aura depending on light level */}
          <circle 
            cx="40" 
            cy="40" 
            r="30" 
            className="season-aura"
            style={{
              strokeDasharray: `${season.light * 188.5} 188.5`,
              stroke: season.light > 0.5 ? 'rgba(255, 215, 0, 0.4)' : 'rgba(122, 184, 255, 0.4)'
            }}
          />
        </svg>

        <div className="season-tester" style={{ display: 'flex' }}>
          <input 
            type="range" 
            min="0" 
            max="364" 
            value={season.day} 
            onChange={handleDayChange} 
          />
          <span className="season-tester__label">{season.dateString}</span>
        </div>
      </div>
    </div>
  )
}
