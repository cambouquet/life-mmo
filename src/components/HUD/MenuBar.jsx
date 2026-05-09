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

      <div 
        className="menu-bar__season"
        style={{ '--season-color': season.light > 0.5 ? 'gold' : '#7ab8ff' }}
      >
        <div className="menu-bar__time-tooltip">
          <b>{season.dateString}</b>
        </div>
        <svg viewBox="0 0 80 80" className="season-svg">
          <defs>
            <linearGradient id="season-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7ab8ff" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>
          </defs>

          {/* Background fill representing light level gradient */}
          <circle 
            cx="40" 
            cy="40" 
            r="25" 
            fill="url(#season-gradient)" 
            fillOpacity={0.15 + (season.light * 0.1)} 
          />

          {/* Vertical seasonality axis (Winter to Summer) */}
          <line x1="40" y1="15" x2="40" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          
          {/* Visual markers (Dots) for the 4 cardinal points of the year */}
          {/* Summer Solstice - Bright Gold */}
          <circle cx="40" cy="15" r="3" fill="#ffd700">
            <animate attributeName="r" values="3;3.5;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="15" r="5" fill="gold" fillOpacity="0.2" />
          
          {/* Winter Solstice - Deep Blue/Dark */}
          <circle cx="40" cy="65" r="3" fill="#1a2a44" stroke="#7ab8ff" strokeWidth="1" />
          
          {/* Spring Equinox (Right) - Half horizontal fill */}
          <g transform="translate(65, 40)">
            <circle cx="0" cy="0" r="3" fill="#1a2a44" />
            <path d="M 0,-3 A 3,3 0 0,1 0,3 Z" fill="#ffd700" />
            <circle cx="0" cy="0" r="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          </g>

          {/* Autumn Equinox (Left) - Half horizontal fill */}
          <g transform="translate(15, 40)">
            <circle cx="0" cy="0" r="3" fill="#ffd700" />
            <path d="M 0,-3 A 3,3 0 0,1 0,3 Z" fill="#1a2a44" />
            <circle cx="0" cy="0" r="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          </g>

          {/* Central Sun */}
          <circle 
            cx="40" 
            cy="40" 
            r="8" 
            fill="gold" 
            style={{
              filter: `drop-shadow(0 0 ${20 * season.light}px gold) brightness(1.2)`
            }}
          />
          <circle cx="40" cy="40" r="8" fill="white" fillOpacity="0.1" />
          
          {/* Earth's Orbit Path */}
          <circle cx="40" cy="40" r="25" className="season-track" />

          {/* Earth Rotating Around Sun */}
          <circle
            cx={40 + 25 * Math.cos(season.year * Math.PI * 2 + Math.PI / 2)}
            cy={40 + 25 * Math.sin(season.year * Math.PI * 2 + Math.PI / 2)}
            r={5}
            className="season-earth"
            style={{
              fill: '#4a9eff',
              filter: 'drop-shadow(0 0 6px rgba(74, 158, 255, 0.8))',
              stroke: 'white',
              strokeWidth: 1
            }}
          />

          {/* Vertical progress bar inside the orbit showing current sunlight height */}
          <rect 
            x="39" 
            y={15 + (1 - season.light) * 50} 
            width="2" 
            height={season.light * 50} 
            fill="gold" 
            fillOpacity="0.75"
            style={{ transition: 'all 0.1s linear' }}
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
