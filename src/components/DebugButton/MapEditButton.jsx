import './MapEditButton.scss'

export default function MapEditButton({ active, onToggle }) {
  return (
    <button
      className={`map-edit-btn ${active ? 'map-edit-btn--active' : ''}`}
      onClick={onToggle}
      title="Toggle map edit mode"
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        {/* Grid */}
        <line x1="4" y1="2" x2="4" y2="14" />
        <line x1="8" y1="2" x2="8" y2="14" />
        <line x1="12" y1="2" x2="12" y2="14" />
        <line x1="2" y1="6" x2="14" y2="6" />
        <line x1="2" y1="10" x2="14" y2="10" />
        {/* Highlight one square */}
        <rect x="8" y="6" width="4" height="4" fill="currentColor" opacity="0.4" />
      </svg>
    </button>
  )
}
