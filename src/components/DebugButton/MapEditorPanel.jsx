import { useState } from 'react'
import './MapEditorPanel.scss'
import { CategoryIcon } from './MapEditorIcons.jsx'
import { MapBackupMenu } from './MapBackupMenu.jsx'
import { initializeMapEditorState, createMapBackup, restoreMapBackup, deleteMapBackup } from './mapEditorState.js'

const MENU_ITEMS = [
  { key: 'tiles', label: 'Tiles', icon: 'tiles' },
  { key: 'animations', label: 'Animations', icon: 'animations' },
]

export default function MapEditorPanel({ activeMenu, onMenuChange, layerEdits, onEditSprite, spriteColorOverrides, onSpriteColorChange }) {
  const state = initializeMapEditorState()
  const [floorColors, setFloorColors] = useState(state.floorColors)
  const [wallColors, setWallColors] = useState(state.wallColors)
  const [backups, setBackups] = useState(state.backups)
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  const handleCreateBackup = () => {
    const newBackups = createMapBackup(layerEdits, spriteColorOverrides, floorColors, wallColors, backups)
    setBackups(newBackups)
  }

  const handleRestoreBackup = (backup) => {
    restoreMapBackup(backup, onEditSprite, onSpriteColorChange, setFloorColors, setWallColors)
    setShowBackupMenu(false)
  }

  const handleDeleteBackup = (id) => {
    const newBackups = deleteMapBackup(id, backups)
    setBackups(newBackups)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', width: '100%', pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, pointerEvents: 'auto' }}>
        {MENU_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => onMenuChange?.(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 8px',
              background: activeMenu === item.key ? 'rgba(100, 220, 255, 0.25)' : 'rgba(100, 180, 255, 0.08)',
              border: activeMenu === item.key ? '1px solid rgba(100, 220, 255, 0.6)' : '1px solid rgba(100, 180, 255, 0.3)',
              borderRadius: '2px',
              cursor: 'pointer',
              color: '#7ab8ff',
              fontSize: '12px',
            }}
            title={item.label}
          >
            <CategoryIcon type={item.icon} />
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={handleCreateBackup}
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
            <MapBackupMenu backups={backups} onRestore={handleRestoreBackup} onDelete={handleDeleteBackup} />
          )}
        </div>
      </div>
    </div>
  )
}
