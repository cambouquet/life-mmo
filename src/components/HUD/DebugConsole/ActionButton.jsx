export function ActionButton({ label, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 8px',
        fontSize: '10px',
        background: isActive ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.15)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        color: '#c084fc',
        borderRadius: '3px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        width: '100%',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => (e.target.style.background = 'rgba(168, 85, 247, 0.3)')}
      onMouseLeave={(e) => (e.target.style.background = isActive ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.15)')}
    >
      {label}
    </button>
  )
}

export function PageButton({ page, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 8px',
        fontSize: '10px',
        background: isActive ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.15)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        color: '#c084fc',
        borderRadius: '3px',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => (e.target.style.background = 'rgba(168, 85, 247, 0.3)')}
      onMouseLeave={(e) => (e.target.style.background = isActive ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.15)')}
    >
      → {page}
    </button>
  )
}
