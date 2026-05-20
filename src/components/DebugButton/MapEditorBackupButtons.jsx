import React from 'react'
import { MapBackupMenu } from './MapBackupMenu.jsx'

export function MapEditorBackupButtons({ backups, showBackupMenu, setShowBackupMenu, onCreateBackup, onRestoreBackup, onDeleteBackup }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      <button
        onClick={onCreateBackup}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          padding: 0,
          background: 'rgba(100, 220, 100, 0.1)',
          border: '1px solid rgba(100, 220, 100, 0.3)',
          color: '#7ab8ff',
          borderRadius: '2px',
          cursor: 'pointer',
        }}
        title="Backup"
      >
        ✓
      </button>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowBackupMenu(!showBackupMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            padding: 0,
            background: backups.length > 0 ? 'rgba(100, 180, 255, 0.1)' : 'rgba(100, 100, 100, 0.05)',
            border: '1px solid rgba(100, 180, 255, 0.2)',
            color: '#7ab8ff',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
          title={`${backups.length} backup(s)`}
        >
          ↩
        </button>
        {showBackupMenu && backups.length > 0 && (
          <MapBackupMenu backups={backups} onRestore={onRestoreBackup} onDelete={onDeleteBackup} />
        )}
      </div>
    </div>
  )
}
