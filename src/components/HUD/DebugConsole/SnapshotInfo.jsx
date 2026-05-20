export function AnomalySection({ selectedNode }) {
  if (!selectedNode.isAnomalous) return null
  return (
    <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(251, 191, 36, 0.2)' }}>
      <div style={{ fontSize: '8px', color: 'rgba(251, 191, 36, 0.8)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
        ⚠️ Anomaly detected
      </div>
      <div style={{ fontSize: '9px', color: 'rgba(251, 191, 36, 0.7)', lineHeight: '1.4' }}>
        {selectedNode.changedKeys.length} properties changed (2x+ neighbors' average)
      </div>
    </div>
  )
}

export function TriggerSection({ selectedTrigger, selectedNode }) {
  if (!selectedTrigger && selectedNode.unchangedSequence <= 0) return null
  return (
    <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
      <div style={{ fontSize: '8px', color: 'rgba(192, 132, 252, 0.8)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
        {selectedTrigger ? 'Triggered by' : 'No change'}
      </div>
      {selectedTrigger ? (
        <div style={{ fontSize: '11px', color: '#c084fc', fontFamily: 'monospace', lineHeight: '1.4' }}>
          {selectedTrigger.trigger}
        </div>
      ) : (
        <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>
          State is identical to previous {selectedNode.unchangedSequence} snapshot
          {selectedNode.unchangedSequence > 1 ? 's' : ''}.
        </div>
      )}
    </div>
  )
}

export function ChangedKeysSection({ selectedNode }) {
  if (selectedNode.changedKeys.length === 0) return null
  return (
    <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
      <div style={{ fontSize: '8px', color: 'rgba(192, 132, 252, 0.7)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
        Properties changed ({selectedNode.changedKeys.length})
      </div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {selectedNode.changedKeys.map((key) => (
          <span
            key={key}
            style={{
              padding: '3px 8px',
              background: 'rgba(192, 132, 252, 0.2)',
              borderRadius: '3px',
              fontSize: '9px',
              color: '#c084fc',
              fontFamily: 'monospace',
              border: '1px solid rgba(192, 132, 252, 0.3)',
            }}
          >
            {key}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SnapshotStats({ selectedNode, now, history, displayIndex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Snapshot age:</span>
        <span style={{ color: '#c084fc', fontFamily: 'monospace' }}>
          {selectedNode ? (() => {
            const totalSeconds = Math.floor((now - selectedNode.timestamp) / 1000)
            const minutes = Math.floor(totalSeconds / 60)
            const seconds = totalSeconds % 60
            return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
          })() : '0s'}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Index:</span>
        <span style={{ color: '#c084fc', fontFamily: 'monospace' }}>{displayIndex + 1} / {history.length}</span>
      </div>
      {selectedNode.unchangedSequence > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Held unchanged:</span>
          <span style={{ color: '#c084fc', fontFamily: 'monospace' }}>{selectedNode.unchangedSequence} snapshot{selectedNode.unchangedSequence > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}
