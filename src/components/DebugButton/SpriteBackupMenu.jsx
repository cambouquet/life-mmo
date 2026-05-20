export function SpriteBackupMenu({ backups, onRestore, onDelete }) {
  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      background: 'rgba(6, 4, 14, 0.95)',
      border: '1px solid rgba(100, 180, 255, 0.4)',
      borderRadius: '2px',
      marginTop: '4px',
      zIndex: 1000,
      minWidth: '140px',
      maxHeight: '200px',
      overflowY: 'auto',
    }}>
      {backups.map(backup => (
        <div key={backup.id} style={{ display: 'flex', gap: '2px', padding: '3px', borderBottom: '1px solid rgba(100, 180, 255, 0.1)' }}>
          <button
            onClick={() => onRestore(backup)}
            style={{
              flex: 1,
              background: 'rgba(100, 220, 100, 0.1)',
              border: '1px solid rgba(100, 220, 100, 0.2)',
              color: '#7ab8ff',
              padding: '2px 3px',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '8px',
              textAlign: 'left',
            }}
          >
            {backup.timestamp.split(' ')[1]}
          </button>
          <button
            onClick={() => onDelete(backup.id)}
            style={{
              background: 'rgba(255, 100, 100, 0.1)',
              border: '1px solid rgba(255, 100, 100, 0.2)',
              color: '#ff6464',
              padding: '2px 3px',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '8px',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
