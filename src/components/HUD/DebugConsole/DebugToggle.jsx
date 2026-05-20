export function DebugToggle({ isOpen, onClick }) {
  return (
    <button
      className={`debug-toggle ${isOpen ? 'debug-toggle--open' : ''}`}
      onClick={onClick}
      title="Toggle Debug Console"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="14" x="8" y="6" rx="4" />
        <path d="m19 7-3 2" />
        <path d="m5 7 3 2" />
        <path d="m19 19-3-2" />
        <path d="m5 19 3-2" />
        <path d="M20 13h-4" />
        <path d="M4 13h4" />
        <path d="m10 4 1 2" />
        <path d="m14 4-1 2" />
      </svg>
    </button>
  )
}
