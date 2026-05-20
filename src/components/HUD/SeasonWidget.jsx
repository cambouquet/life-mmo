import { SeasonMarkers } from './SeasonMarkers.jsx'
import { SeasonLight } from './SeasonLight.jsx'
import { SeasonOrbit } from './SeasonOrbit.jsx'

export function SeasonWidget({ season }) {
  return (
    <div className="menu-bar__season" style={{ '--season-color': season.light > 0.5 ? 'gold' : '#7ab8ff' }}>
      <div className="menu-bar__time-tooltip"><b>{season.dateString}</b></div>
      <svg viewBox="0 0 80 80" className="season-svg">
        <defs>
          <linearGradient id="season-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7ab8ff" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="25" fill="url(#season-gradient)" fillOpacity={0.15 + (season.light * 0.1)} />
        <SeasonMarkers />
        <SeasonLight season={season} />
        <SeasonOrbit season={season} />
      </svg>
    </div>
  )
}
