import { useState } from 'react'
import { useMapBackups } from '../../hooks/useMapBackups.js'
import { MAP_MENU_ITEMS } from './mapEditorMenuItems.js'
import { MapMenuButton } from './MapMenuButton.jsx'
import { MapBackupMenu } from './DebugConsole/MapBackupMenu.jsx'

export function MapEditorToolbar({ activeMapMenu, onMapMenuChange, onPickerStateChange, layerEdits, spriteColorOverrides, onEditSprite, onSpriteColorChange }) {
  const { backups, createBackup: hookCreateBackup, restoreBackup: hookRestoreBackup, deleteBackup } = useMapBackups()
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  const createBackup = () => {
    hookCreateBackup(layerEdits, spriteColorOverrides)
  }

  const restoreBackup = (backup) => {
    onEditSprite(() => JSON.parse(JSON.stringify(backup.layerEdits)))
    onSpriteColorChange(() => JSON.parse(JSON.stringify(backup.spriteColorOverrides)))
    setShowBackupMenu(false)
  }

  return (
    <div className="menu-bar__map-editor">
      {MAP_MENU_ITEMS.map(item => (
        <MapMenuButton
          key={item.key}
          item={item}
          activeMapMenu={activeMapMenu}
          onMapMenuChange={onMapMenuChange}
          onPickerStateChange={onPickerStateChange}
        />
      ))}
      <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
        <button
          onClick={createBackup}
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
            pointerEvents: 'auto',
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
              pointerEvents: 'auto',
            }}
            title={`${backups.length} backup(s)`}
          >
            ↩
          </button>
          {showBackupMenu && backups.length > 0 && (
            <MapBackupMenu backups={backups} onRestore={restoreBackup} onDelete={deleteBackup} />
          )}
        </div>
      </div>
    </div>
  )
}
