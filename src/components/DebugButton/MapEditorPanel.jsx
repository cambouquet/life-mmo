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

export default function MapEditorPanel({ hoveredTile, layers, collMap, layerEdits, onEditSprite, highlightColors, onHighlightColorsChange, spriteColorOverrides, onSpriteColorChange, onHoverPreview, onPickerStateChange }) {
  const [editingField, setEditingField] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(null)
  const [activeTab, setActiveTab] = useState('tiles') // 'tiles' or 'colors'
  const [selectedSpriteForColor, setSelectedSpriteForColor] = useState(null) // { type: 'floor'|'wall', row: 0, ss: 0x00 }
  const [floorColors, setFloorColors] = useState(spriteColors.floor)
  const [wallColors, setWallColors] = useState(spriteColors.wall)
  const [backups, setBackups] = useState(loadBackups)
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  if (!hoveredTile || !layers) return null

  const isMultiSelect = hoveredTile.tiles && hoveredTile.tiles.length > 1
  const tiles = isMultiSelect ? hoveredTile.tiles : [hoveredTile]
  const firstTile = tiles[0]
  const { c, r } = firstTile

  const fieldToLayerMap = { ground: 'ground', wall: 'walls', obj: 'objects', entity: 'entities' }

  // For multi-select, check if all tiles have the same sprite
  const getSpriteForTiles = (field) => {
    const sprites = tiles.map(tile => {
      const tileKey = `${tile.c},${tile.r}`
      return layerEdits[tileKey]?.[field] ?? layers[fieldToLayerMap[field]]?.[tile.r]?.[tile.c]
    })
    // Return sprite if all are the same, otherwise return null
    const first = sprites[0]
    const allSame = sprites.every(s => s === first || (s && first && s.ss === first.ss && s.row === first.row))
    return allSame ? first : null
  }

  const tileKey = `${c},${r}`
  const collValue = collMap[r]?.[c] ?? '?'
  const collName = COLL_VALUES[collValue] || `${collValue}`

  const ground = getSpriteForTiles('ground')
  const wall = getSpriteForTiles('wall')
  const obj = getSpriteForTiles('obj')
  const entity = getSpriteForTiles('entity')

  // Expose picker state to parent
  useEffect(() => {
    onPickerStateChange?.({ pickerOpen, activeTab, selectedSpriteForColor, ground, wall, obj, entity })
  }, [pickerOpen, activeTab, selectedSpriteForColor, ground, wall, obj, entity, onPickerStateChange])

  const handleSpriteSelect = (category, sprite) => {
    const fieldMap = { floor: 'ground', wall: 'wall', table: 'obj', torch: 'entity', mirror: 'obj' }
    const field = fieldMap[category]

    onEditSprite(prev => {
      const next = { ...prev }
      tiles.forEach(tile => {
        const key = `${tile.c},${tile.r}`
        next[key] = { ...next[key], [field]: sprite }
      })
      return next
    })
    setPickerOpen(null)
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

  return (
    <div className="cell-info">
      <div className="cell-info__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '8px' }}>
          <span>{isMultiSelect ? `${tiles.length} tiles selected` : `(${c}, ${r})`}</span>
          <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
            <button
              onClick={() => setActiveTab('tiles')}
              style={{
                background: activeTab === 'tiles' ? 'rgba(100, 220, 255, 0.3)' : 'transparent',
                border: activeTab === 'tiles' ? '1px solid rgba(100, 220, 255, 0.8)' : '1px solid rgba(100, 180, 255, 0.2)',
                color: '#7ab8ff',
                padding: '4px 8px',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Tiles
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              style={{
                background: activeTab === 'colors' ? 'rgba(100, 220, 255, 0.3)' : 'transparent',
                border: activeTab === 'colors' ? '1px solid rgba(100, 220, 255, 0.8)' : '1px solid rgba(100, 180, 255, 0.2)',
                color: '#7ab8ff',
                padding: '4px 8px',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Colors
            </button>
            <button
              onClick={createBackup}
              style={{
                background: 'rgba(100, 220, 100, 0.1)',
                border: '1px solid rgba(100, 220, 100, 0.3)',
                color: '#7ab8ff',
                padding: '4px 8px',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
              title="Create backup of current map"
            >
              ✓ Backup
            </button>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowBackupMenu(!showBackupMenu)}
                style={{
                  background: backups.length > 0 ? 'rgba(100, 180, 255, 0.1)' : 'rgba(100, 100, 100, 0.1)',
                  border: '1px solid rgba(100, 180, 255, 0.2)',
                  color: '#7ab8ff',
                  padding: '4px 8px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                }}
                title={`${backups.length} backup(s) available`}
              >
                ↩ Restore ({backups.length})
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
                  minWidth: '200px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {backups.map(backup => (
                    <div
                      key={backup.id}
                      style={{
                        padding: '8px',
                        borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <button
                        onClick={() => restoreBackup(backup)}
                        style={{
                          flex: 1,
                          background: 'rgba(100, 220, 100, 0.1)',
                          border: '1px solid rgba(100, 220, 100, 0.3)',
                          color: '#7ab8ff',
                          padding: '4px 6px',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          fontSize: '9px',
                          textAlign: 'left',
                        }}
                      >
                        {backup.timestamp}
                      </button>
                      <button
                        onClick={() => deleteBackup(backup.id)}
                        style={{
                          background: 'rgba(255, 100, 100, 0.1)',
                          border: '1px solid rgba(255, 100, 100, 0.3)',
                          color: '#ff6464',
                          padding: '4px 6px',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          fontSize: '9px',
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

      {activeTab === 'tiles' ? (
      <div className="cell-info__preview">
        <div className="cell-info__preview-layers">
          <div className="cell-info__preview-col">
            <div className="cell-info__layer-label">Layer 1</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('floor')}>
              <strong>Ground</strong>
              {ground ? (
                <div className="cell-info__sprite-large" style={{ backgroundColor: getSpriteColor(ground.ss, ground.row, ground.variant) }} />
              ) : isMultiSelect ? (
                <div className="cell-info__sprite-large" style={{ backgroundColor: '#0a0612', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ab8ff', fontSize: '24px' }}>≠</div>
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
            <div className="cell-info__layer-label">Layer 3</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('table')}>
              <strong>Object</strong>
              {obj ? (
                <div className="cell-info__sprite-large" style={{ backgroundImage: `url(${getSpriteUrl(obj.ss)})`, backgroundPosition: `0 ${obj.row * -32}px` }} />
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
          </div>
          <div className="cell-info__preview-col">
            <div className="cell-info__layer-label">Layer 2</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('wall')}>
              <strong>Wall</strong>
              {wall ? (
                <div className="cell-info__sprite-large" style={{ backgroundColor: getSpriteColor(wall.ss, wall.row) }} />
              ) : isMultiSelect ? (
                <div className="cell-info__sprite-large" style={{ backgroundColor: '#0a0612', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ab8ff', fontSize: '24px' }}>≠</div>
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
            <div className="cell-info__layer-label">Layer 4</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('torch')}>
              <strong>Entity</strong>
              {entity ? (
                <div className="cell-info__sprite-large" style={{ backgroundImage: `url(${getSpriteUrl(entity.ss)})`, backgroundPosition: `0 ${entity.row * -16}px` }} />
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
          </div>
        </div>

        <div className="cell-info__render">
          <div className="cell-info__render-title">Cell Render</div>
          <div className="cell-info__render-view" style={{ position: 'relative', backgroundColor: ground ? getSpriteColor(ground.ss, ground.row) : '#0a0612' }}>
            {wall && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '96px', height: '96px', backgroundColor: getSpriteColor(wall.ss, wall.row), opacity: 0.8 }} />
            )}
            {obj && (
              <div style={{ position: 'absolute', top: '32px', left: '32px', width: '32px', height: '32px', backgroundColor: getSpriteColor(obj.ss, obj.row) }} />
            )}
            {entity && (
              <div style={{ position: 'absolute', top: '40px', left: '40px', width: '16px', height: '16px', backgroundColor: getSpriteColor(entity.ss, entity.row) }} />
            )}
          </div>
        </div>
      </div>
      ) : (
      <div style={{ padding: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* Floor color variants */}
          <div>
            <div className="cell-info__layer-label">Floor Colors</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {floorColors.map((_, variant) => {
                const color = getSpriteColor(0, 0, variant)
                const isSelected = selectedSpriteForColor?.ss === 0 && selectedSpriteForColor?.variant === variant
                return (
                  <button
                    key={`floor-${variant}`}
                    onClick={() => setSelectedSpriteForColor({ ss: 0, row: 0, variant })}
                    style={{
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center',
                      padding: '4px 6px',
                      background: isSelected ? 'rgba(100, 220, 255, 0.15)' : 'transparent',
                      border: isSelected ? '1px solid rgba(100, 220, 255, 0.6)' : '1px solid rgba(100, 180, 255, 0.2)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ width: '32px', height: '32px', backgroundColor: color, border: '1px solid rgba(100, 180, 255, 0.3)', borderRadius: '2px' }} />
                    <div style={{ fontSize: '9px', color: '#7ab8ff', flex: 1, textAlign: 'left' }}>{variant + 1}</div>
                  </button>
                )
              })}
              <button
                onClick={() => {
                  const newFloorColors = [...floorColors, '#000000']
                  setFloorColors(newFloorColors)
                  spriteColors.floor = newFloorColors
                  setSelectedSpriteForColor({ ss: 0, row: 0, variant: newFloorColors.length - 1 })
                }}
                style={{
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                  padding: '4px 6px',
                  background: 'rgba(100, 220, 255, 0.05)',
                  border: '1px dashed rgba(100, 180, 255, 0.4)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  color: '#7ab8ff',
                  fontSize: '9px',
                  fontWeight: '600',
                  marginTop: '4px'
                }}
              >
                + Add Color
              </button>
            </div>
          </div>

          {/* Wall color rows */}
          <div>
            <div className="cell-info__layer-label">Wall Colors</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {wallColors.map((_, row) => {
                const color = getSpriteColor(1, row)
                const isSelected = selectedSpriteForColor?.ss === 1 && selectedSpriteForColor?.row === row
                return (
                  <button
                    key={`wall-${row}`}
                    onClick={() => setSelectedSpriteForColor({ ss: 1, row, variant: 0 })}
                    style={{
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center',
                      padding: '4px 6px',
                      background: isSelected ? 'rgba(100, 220, 255, 0.15)' : 'transparent',
                      border: isSelected ? '1px solid rgba(100, 220, 255, 0.6)' : '1px solid rgba(100, 180, 255, 0.2)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ width: '32px', height: '32px', backgroundColor: color, border: '1px solid rgba(100, 180, 255, 0.3)', borderRadius: '2px' }} />
                    <div style={{ fontSize: '9px', color: '#7ab8ff', flex: 1, textAlign: 'left' }}>{row + 1}</div>
                  </button>
                )
              })}
              <button
                onClick={() => {
                  const newWallColors = [...wallColors, '#000000']
                  setWallColors(newWallColors)
                  spriteColors.wall = newWallColors
                  setSelectedSpriteForColor({ ss: 1, row: newWallColors.length - 1, variant: 0 })
                }}
                style={{
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                  padding: '4px 6px',
                  background: 'rgba(100, 220, 255, 0.05)',
                  border: '1px dashed rgba(100, 180, 255, 0.4)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  color: '#7ab8ff',
                  fontSize: '9px',
                  fontWeight: '600',
                  marginTop: '4px'
                }}
              >
                + Add Color
              </button>
            </div>
          </div>
        </div>

        {selectedSpriteForColor && (
          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(100, 180, 255, 0.2)' }}>
            <div style={{ fontSize: '10px', color: '#7ab8ff', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>
              Edit Color
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: getSpriteColor(selectedSpriteForColor.ss, selectedSpriteForColor.row, selectedSpriteForColor.variant), border: '1px solid rgba(100, 180, 255, 0.3)', borderRadius: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', color: 'rgba(122, 184, 255, 0.7)', textTransform: 'uppercase' }}>Selected</div>
                <div style={{ fontSize: '10px', color: '#7ab8ff', fontWeight: '600' }}>Color {selectedSpriteForColor.ss === 0 ? selectedSpriteForColor.variant + 1 : selectedSpriteForColor.row + 1}</div>
              </div>
            </div>
            <input
              type="color"
              value={spriteColorOverrides[`${selectedSpriteForColor.ss}_${selectedSpriteForColor.ss === 0x00 ? `v${selectedSpriteForColor.variant}` : selectedSpriteForColor.row}`]?.substring(0, 7) || getSpriteColor(selectedSpriteForColor.ss, selectedSpriteForColor.row, selectedSpriteForColor.variant)}
              onChange={(e) => {
                const key = selectedSpriteForColor.ss === 0x00 ? `${selectedSpriteForColor.ss}_v${selectedSpriteForColor.variant}` : `${selectedSpriteForColor.ss}_${selectedSpriteForColor.row}`
                onSpriteColorChange(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))
              }}
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid rgba(100, 180, 255, 0.3)',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            />
          </div>
        )}
      </div>
      )}

    </div>
  )
}
