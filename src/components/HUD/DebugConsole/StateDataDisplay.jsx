export function StateDataDisplay({ displayIndex, history }) {
  if (displayIndex < 0 || displayIndex >= history.length || !history[displayIndex]?.parsed) {
    return null
  }

  return (
    <div data-state-data>
      <div style={{ fontSize: '8px', color: 'rgba(192, 132, 252, 0.7)', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>
        State data
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px' }}>
        {Object.entries(history[displayIndex].parsed).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)', minWidth: '80px' }}>{key}:</span>
            <span style={{ color: '#c084fc', fontFamily: 'monospace', textAlign: 'right', wordBreak: 'break-word' }}>
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
