export function CategoryIcon({ type }) {
  const baseStyle = { width: '14px', height: '14px', display: 'block' }
  const icons = {
    floor: (
      <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
        <rect x="2" y="10" width="12" height="4" rx="0.5"/>
      </svg>
    ),
    wall: (
      <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
        <rect x="3" y="2" width="2" height="12" rx="0.5"/>
        <rect x="7" y="2" width="2" height="12" rx="0.5"/>
        <rect x="11" y="2" width="2" height="12" rx="0.5"/>
      </svg>
    ),
    table: (
      <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
        <rect x="3" y="5" width="10" height="5" rx="0.5"/>
        <rect x="4" y="10" width="2" height="3" rx="0.5"/>
        <rect x="10" y="10" width="2" height="3" rx="0.5"/>
      </svg>
    ),
    torch: (
      <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
        <circle cx="8" cy="4" r="1.5"/>
        <path d="M8 5.5 L5 9 L11 9 Z" fill="currentColor"/>
        <rect x="7" y="9" width="2" height="4" rx="0.5"/>
      </svg>
    ),
    tiles: (
      <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
        <rect x="2" y="2" width="3" height="3" rx="0.3"/>
        <rect x="6" y="2" width="3" height="3" rx="0.3"/>
        <rect x="10" y="2" width="3" height="3" rx="0.3"/>
        <rect x="2" y="6" width="3" height="3" rx="0.3"/>
        <rect x="6" y="6" width="3" height="3" rx="0.3"/>
        <rect x="10" y="6" width="3" height="3" rx="0.3"/>
        <rect x="2" y="10" width="3" height="3" rx="0.3"/>
        <rect x="6" y="10" width="3" height="3" rx="0.3"/>
        <rect x="10" y="10" width="3" height="3" rx="0.3"/>
      </svg>
    ),
    animations: (
      <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
        <rect x="2" y="3" width="10" height="8" rx="0.5" fillOpacity="0.6"/>
        <rect x="4" y="2" width="10" height="8" rx="0.5" fillOpacity="0.8"/>
        <polygon points="7,7 12,9.5 7,12" fill="currentColor" opacity="0.9"/>
      </svg>
    )
  }
  return icons[type]
}
