import { useState } from 'react'
import { SpriteBackupMenu } from './SpriteBackupMenu'
import { backupButtonStyle, restoreButtonStyle } from './spritePickerStyles'

export function BackupControls({ backups, onCreateBackup, onRestoreBackup, onDeleteBackup }) {
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      <button
        onClick={onCreateBackup}
        style={backupButtonStyle}
        title="Backup"
      >
        ✓
      </button>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowBackupMenu(!showBackupMenu)}
          style={restoreButtonStyle(backups.length > 0)}
          title={`${backups.length} backup(s)`}
        >
          ↩
        </button>
        {showBackupMenu && backups.length > 0 && (
          <SpriteBackupMenu backups={backups} onRestore={onRestoreBackup} onDelete={onDeleteBackup} />
        )}
      </div>
    </div>
  )
}
