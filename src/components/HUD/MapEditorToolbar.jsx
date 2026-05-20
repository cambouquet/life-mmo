import React, { useState } from 'react'
import { useMapBackups } from '../../hooks/useMapBackups.js'

function CategoryIcon({ type }) {
  const baseStyle = { width: '14px', height: '14px', display: 'block' }
  const icons = {
    tiles: (
      <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
        <rect x="2" y="2" width="3" height="3" rx="0.3"/>
        <rect x="6" y="2" width="3" height="3" rx="0.3"/>
        <rect x="10" y="2" width="3" height="3" rx="0.3"/>
        <rect x="2" y="6" width="3" height="3" rx="0.3"/>
        <rect x="6" y="6" width="3" height="3" rx="0.3"/>
        <rect x="10" y="6" width="3" height="3" rx="0.3"/>
        <rect x="2" y="10" width="3" height="3" rx="0.3"/>
        <rect x="6" y="10" width="3" height="3" rx="0.3"/>
        <rect x="10" y="10" width="3" height="3" rx="0.3"/>
      </svg>
    ),
    animations: (
      <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
        <rect x="2" y="3" width="10" height="8" rx="0.5" fillOpacity="0.6"/>
        <rect x="4" y="2" width="10" height="8" rx="0.5" fillOpacity="0.8"/>
        <polygon points="7,7 12,9.5 7,12" fill="currentColor" opacity="0.9"/>
      </svg>
    )
  }
  return icons[type]
}

function BackupMenu({ backups, onRestore, onDelete }) {
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
              pointerEvents: 'auto',
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
              pointerEvents: 'auto',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export function MapEditorToolbar({ activeMapMenu, onMapMenuChange, onPickerStateChange, layerEdits, spriteColorOverrides, onEditSprite, onSpriteColorChange }) {
  const { backups, createBackup: hookCreateBackup, restoreBackup: hookRestoreBackup, deleteBackup } = useMapBackups()
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  const mapMenuItems = [
    { key: 'tiles', label: 'Tiles', icon: 'tiles', category: 'floor' },
    { key: 'animations', label: 'Animations', icon: 'animations', tab: 'animations' }
  ]

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
      {mapMenuItems.map(item => (
        <button
          key={item.key}
          onClick={() => {
            onMapMenuChange?.(item.key)
            if (item.category) {
              onPickerStateChange?.(prev => ({ ...prev, pickerOpen: item.category, activeTab: 'tiles' }))
            } else if (item.tab) {
              onPickerStateChange?.(prev => ({ ...prev, activeTab: item.tab }))
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 8px',
            background: activeMapMenu === item.key ? 'rgba(100, 220, 255, 0.25)' : 'rgba(100, 180, 255, 0.08)',
            border: activeMapMenu === item.key ? '1px solid rgba(100, 220, 255, 0.6)' : '1px solid rgba(100, 180, 255, 0.3)',
            borderRadius: '2px',
            cursor: 'pointer',
            color: '#7ab8ff',
            fontSize: '12px',
            minHeight: '20px',
            pointerEvents: 'auto',
          }}
          title={item.label}
        >
          <CategoryIcon type={item.icon} />
        </button>
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
            <BackupMenu backups={backups} onRestore={restoreBackup} onDelete={deleteBackup} />
          )}
        </div>
      </div>
    </div>
  )
}
