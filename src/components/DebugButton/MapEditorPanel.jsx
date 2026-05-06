import { useState, useEffect } from 'react'
import './MapEditorPanel.scss'
import SPRITESHEETS_DATA from '../../game/config/spritesheets.json'
import spriteColors from '../../game/config/spriteColors.json'

const LS_MAP_BACKUPS = 'life-mmo-map-backups'

function loadBackups() {
  try {
    const data = localStorage.getItem(LS_MAP_BACKUPS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveBackups(backups) {
  localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify(backups))
}

const COLL_VALUES = {
  0: 'floor',
  1: 'wall',
  5: 'void',
  6: 'door',
}

const SPRITESHEET_VALUES = {
  0x00: SPRITESHEETS_DATA['0x00'].name,
  0x01: SPRITESHEETS_DATA['0x01'].name,
  0x02: SPRITESHEETS_DATA['0x02'].name,
  0x03: SPRITESHEETS_DATA['0x03'].name,
  0x04: SPRITESHEETS_DATA['0x04'].name,
}

export default function MapEditorPanel({ hoveredTile, layers, collMap, layerEdits, onEditSprite, highlightColors, onHighlightColorsChange, spriteColorOverrides, onSpriteColorChange, onHoverPreview, onPickerStateChange, activeSprite, onActiveSpriteChange }) {
  const [floorColors, setFloorColors] = useState(spriteColors.floor)
  const [wallColors, setWallColors] = useState(spriteColors.wall)
  const [backups, setBackups] = useState(loadBackups)
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  const tiles = hoveredTile?.tiles && hoveredTile.tiles.length > 1 ? hoveredTile.tiles : hoveredTile ? [hoveredTile] : []
  const firstTile = tiles[0]
  const { c, r } = firstTile || { c: null, r: null }

  const fieldToLayerMap = { ground: 'ground', wall: 'walls', obj: 'objects', entity: 'entities' }

  const getSpriteForTiles = (field) => {
    const sprites = tiles.map(tile => {
      const tileKey = `${tile.c},${tile.r}`
      return layerEdits[tileKey]?.[field] ?? layers[fieldToLayerMap[field]]?.[tile.r]?.[tile.c]
    })
    const first = sprites[0]
    const allSame = sprites.every(s => s === first || (s && first && s.ss === first.ss && s.row === first.row))
    return allSame ? first : null
  }

  const collValue = hoveredTile && c !== null && r !== null ? collMap[r]?.[c] ?? '?' : '?'
  const collName = COLL_VALUES[collValue] || `${collValue}`

  const ground = getSpriteForTiles('ground')
  const wall = getSpriteForTiles('wall')
  const obj = getSpriteForTiles('obj')
  const entity = getSpriteForTiles('entity')

  // No longer needed - picker is controlled by App parent

  const openPicker = (category) => {
    onPickerStateChange?.(prev => ({ ...prev, pickerOpen: category, activeTab: 'tiles' }))
  }

  const EditableField = ({ label, value, field, onEdit }) => (
    <div className="cell-info__line">
      <strong>{label}:</strong>
      <span
        className="cell-info__value"
        onClick={() => onEdit(field)}
      >
        {value || '—'}
      </span>
    </div>
  )

  const collOptions = Object.values(COLL_VALUES)

  const getSpriteUrl = (ss) => {
    const ssHex = `0x${ss.toString(16).padStart(2, '0')}`
    const ssData = SPRITESHEETS_DATA[ssHex]
    return `/src/assets/sprites/${ssData?.file || ''}`
  }

  const getSpriteSize = (ss) => {
    if (ss === 0x02) return 32 // mirror
    if (ss === 0x03) return 32 // table
    return 16 // floor, wall, torch
  }

  const getSpriteColor = (ss, row, variant) => {
    // For floor (ss=0), use variant for color index, not row
    const colorKey = ss === 0x00 ? variant : row
    const overrideKey = ss === 0x00 ? `${ss}_v${variant}` : `${ss}_${row}`

    if (spriteColorOverrides?.[overrideKey]) return spriteColorOverrides[overrideKey]
    if (ss === 0x00) return spriteColors.floor[colorKey] ?? spriteColors.floor[0]
    if (ss === 0x01) return spriteColors.wall[colorKey] ?? spriteColors.wall[0]
    return '#0a0612'
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

  const getActiveSpriteDisplay = () => {
    if (!activeSprite.sprite) return null
    const { ss, row, variant } = activeSprite.sprite
    return getSpriteColor(ss, row, variant)
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
      )
    }
    return icons[type]
  }

  const categories = [
    { key: 'floor', label: 'Ground' },
    { key: 'wall', label: 'Wall' },
    { key: 'table', label: 'Object' },
    { key: 'torch', label: 'Entity' }
  ]

  return (
    <div className="cell-info">
      <div className="cell-info__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => openPicker(cat.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                padding: 0,
                background: activeSprite.category === cat.key && activeSprite.sprite ? 'rgba(100, 220, 255, 0.25)' : 'rgba(100, 180, 255, 0.08)',
                border: activeSprite.category === cat.key ? '1px solid rgba(100, 220, 255, 0.6)' : '1px solid rgba(100, 180, 255, 0.3)',
                borderRadius: '2px',
                cursor: 'pointer',
                color: '#7ab8ff',
              }}
              title={cat.label}
            >
              <CategoryIcon type={cat.key} />
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
    </div>
  )
}
