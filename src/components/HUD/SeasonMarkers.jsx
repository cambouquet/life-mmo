export function SeasonMarkers() {
  return (
    <>
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
    </>
  )
}
