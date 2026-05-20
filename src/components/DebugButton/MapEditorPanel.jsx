import { useState } from 'react'
import './MapEditorPanel.scss'
import spriteColors from '../../game/config/spriteColors.json'
import { loadBackups, saveBackups } from './mapEditorData.js'
import { CategoryIcon } from './MapEditorIcons.jsx'
import { MapBackupMenu } from './MapBackupMenu.jsx'

const MENU_ITEMS = [
  { key: 'tiles', label: 'Tiles', icon: 'tiles' },
  { key: 'animations', label: 'Animations', icon: 'animations' }
]

export default function MapEditorPanel({ activeMenu, onMenuChange, hoveredTile, layers, collMap, layerEdits, onEditSprite, highlightColors, onHighlightColorsChange, spriteColorOverrides, onSpriteColorChange, onHoverPreview, onPickerStateChange, activeSprite, onActiveSpriteChange }) {
  const [floorColors, setFloorColors] = useState(spriteColors.floor)
  const [wallColors, setWallColors] = useState(spriteColors.wall)
  const [backups, setBackups] = useState(loadBackups)
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  const createBackup = () => {
    const backup = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      layerEdits: JSON.parse(JSON.stringify(layerEdits)),
      spriteColorOverrides: JSON.parse(JSON.stringify(spriteColorOverrides)),
      floorColors: [...floorColors],
      wallColors: [...wallColors]
    }
    const newBackups = [backup, ...backups].slice(0, 5)
    setBackups(newBackups)
    saveBackups(newBackups)
  }

  const restoreBackup = (backup) => {
    onEditSprite(() => JSON.parse(JSON.stringify(backup.layerEdits)))
    onSpriteColorChange(() => JSON.parse(JSON.stringify(backup.spriteColorOverrides)))
    setFloorColors([...backup.floorColors])
    spriteColors.floor = [...backup.floorColors]
    setWallColors([...backup.wallColors])
    spriteColors.wall = [...backup.wallColors]
    setShowBackupMenu(false)
  }

  const deleteBackup = (id) => {
    const newBackups = backups.filter(b => b.id !== id)
    setBackups(newBackups)
    saveBackups(newBackups)
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
            <MapBackupMenu backups={backups} onRestore={restoreBackup} onDelete={deleteBackup} />
          )}
        </div>
      </div>
    </div>
  )
}
