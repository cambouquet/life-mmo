export function SnapshotHeader({ displayIndex, selectedNode, isLocked, setIsLocked }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
      <div style={{ fontSize: '8px', color: '#a1a1aa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Snapshot {displayIndex + 1}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.35)' }}>
          {selectedNode.timestamp.toLocaleTimeString()}
        </div>
        <button
          onClick={() => setIsLocked(!isLocked)}
          style={{
            padding: '3px 6px',
            fontSize: '7px',
            background: isLocked ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: '0.5px solid rgba(192, 132, 252, 0.3)',
            borderRadius: '2px',
            color: isLocked ? '#c084fc' : 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.15s',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = isLocked ? 'rgba(192, 132, 252, 0.3)' : 'rgba(255, 255, 255, 0.08)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isLocked ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)'
          }}
        >
          {isLocked ? '🔒 locked' : 'unlock'}
        </button>
      </div>
    </div>
  )
}
