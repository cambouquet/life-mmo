export function SeasonWidget({ season }) {
  return (
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

        <circle
          cx="40"
          cy="40"
          r="25"
          fill="url(#season-gradient)"
          fillOpacity={0.15 + (season.light * 0.1)}
        />

        <line x1="40" y1="15" x2="40" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        <circle cx="40" cy="15" r="3" fill="#ffd700">
          <animate attributeName="r" values="3;3.5;3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="15" r="5" fill="gold" fillOpacity="0.2" />

        <circle cx="40" cy="65" r="3" fill="#1a2a44" stroke="#7ab8ff" strokeWidth="1" />

        <g transform="translate(65, 40)">
          <circle cx="0" cy="0" r="3" fill="#1a2a44" />
          <path d="M 0,-3 A 3,3 0 0,1 0,3 Z" fill="#ffd700" />
          <circle cx="0" cy="0" r="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        </g>

        <g transform="translate(15, 40)">
          <circle cx="0" cy="0" r="3" fill="#ffd700" />
          <path d="M 0,-3 A 3,3 0 0,1 0,3 Z" fill="#1a2a44" />
          <circle cx="0" cy="0" r="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        </g>

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

        <circle cx="40" cy="40" r="25" className="season-track" />

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
    </div>
  )
}
