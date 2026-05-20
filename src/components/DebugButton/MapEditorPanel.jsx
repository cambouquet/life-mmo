import { useState, useEffect } from 'react'
import './MapEditorPanel.scss'
import spriteColors from '../../game/config/spriteColors.json'
import { loadBackups, saveBackups, COLL_VALUES, SPRITESHEET_VALUES } from './mapEditorData.js'

export default function MapEditorPanel({ activeMenu, onMenuChange, hoveredTile, layers, collMap, layerEdits, onEditSprite, highlightColors, onHighlightColorsChange, spriteColorOverrides, onSpriteColorChange, onHoverPreview, onPickerStateChange, activeSprite, onActiveSpriteChange }) {
  const [floorColors, setFloorColors] = useState(spriteColors.floor)
  const [wallColors, setWallColors] = useState(spriteColors.wall)
  const [backups, setBackups] = useState(loadBackups)
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  const tiles = hoveredTile?.tiles && hoveredTile.tiles.length > 1 ? hoveredTile.tiles : hoveredTile ? [hoveredTile] : []
  const firstTile = tiles[0]
  const { c, r } = firstTile || { c: null, r: null }

  const openPicker = (category) => {
    onPickerStateChange?.(prev => ({ ...prev, pickerOpen: category, activeTab: 'tiles' }))
  }

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

  const CategoryIcon = ({ type }) => {
    const baseStyle = { width: '14px', height: '14px', display: 'block' }
    const icons = {
      floor: (
        <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
          <rect x="2" y="10" width="12" height="4" rx="0.5"/>
        </svg>
      ),
      wall: (
        <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
          <rect x="3" y="2" width="2" height="12" rx="0.5"/>
          <rect x="7" y="2" width="2" height="12" rx="0.5"/>
          <rect x="11" y="2" width="2" height="12" rx="0.5"/>
        </svg>
      ),
      table: (
        <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
          <rect x="3" y="5" width="10" height="5" rx="0.5"/>
          <rect x="4" y="10" width="2" height="3" rx="0.5"/>
          <rect x="10" y="10" width="2" height="3" rx="0.5"/>
        </svg>
      ),
      torch: (
        <svg viewBox="0 0 16 16" fill="currentColor" style={baseStyle}>
          <circle cx="8" cy="4" r="1.5"/>
          <path d="M8 5.5 L5 9 L11 9 Z" fill="currentColor"/>
          <rect x="7" y="9" width="2" height="4" rx="0.5"/>
        </svg>
      ),
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

  const menuItems = [
    { key: 'tiles', label: 'Tiles', icon: 'tiles' },
    { key: 'animations', label: 'Animations', icon: 'animations' }
  ]

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', width: '100%', pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, pointerEvents: 'auto' }}>
        {menuItems.map(item => (
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
                      onClick={() => restoreBackup(backup)}
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
                      onClick={() => deleteBackup(backup.id)}
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
            )}
          </div>
        </div>
      </div>
  )
}
