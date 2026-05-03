import { useState } from 'react'
import './MapEditorPanel.scss'
import SpritePickerModal from './SpritePickerModal.jsx'
import SPRITESHEETS_DATA from '../../game/config/spritesheets.json'
import spriteColors from '../../game/config/spriteColors.json'

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

export default function MapEditorPanel({ hoveredTile, layers, collMap, layerEdits, onEditSprite, highlightColors, onHighlightColorsChange, spriteColorOverrides, onSpriteColorChange }) {
  const [editingField, setEditingField] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(null)
  const [activeTab, setActiveTab] = useState('tiles') // 'tiles' or 'colors'
  const [selectedSpriteForColor, setSelectedSpriteForColor] = useState(null) // { type: 'floor'|'wall', row: 0, ss: 0x00 }

  if (!hoveredTile || !layers) return null

  const isMultiSelect = hoveredTile.tiles && hoveredTile.tiles.length > 1
  const tiles = isMultiSelect ? hoveredTile.tiles : [hoveredTile]
  const firstTile = tiles[0]
  const { c, r } = firstTile

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

  const fieldToLayerMap = { ground: 'ground', wall: 'walls', obj: 'objects', entity: 'entities' }

  const tileKey = `${c},${r}`
  const collValue = collMap[r]?.[c] ?? '?'
  const collName = COLL_VALUES[collValue] || `${collValue}`

  const ground = getSpriteForTiles('ground')
  const wall = getSpriteForTiles('wall')
  const obj = getSpriteForTiles('obj')
  const entity = getSpriteForTiles('entity')

  const handleSpriteSelect = (category, sprite) => {
    const fieldMap = { floor: 'ground', wall: 'wall', table: 'obj', torch: 'entity', mirror: 'obj' }
    const field = fieldMap[category]

    // Apply sprite to all selected tiles
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

  const getSpriteColor = (ss, row) => {
    const overrideKey = `${ss}_${row}`
    if (spriteColorOverrides?.[overrideKey]) return spriteColorOverrides[overrideKey]
    if (ss === 0x00) return spriteColors.floor[row] ?? spriteColors.floor[0]
    if (ss === 0x01) return spriteColors.wall[row] ?? spriteColors.wall[0]
    return '#0a0612'
  }

  return (
    <div className="cell-info">
      <div className="cell-info__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          </div>
        </div>
      </div>

      {activeTab === 'tiles' ? (
      <div className="cell-info__preview">
        <div className="cell-info__preview-layers">
          <div className="cell-info__preview-col">
            <div className="cell-info__layer-label">Layer 0</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('floor')}>
              <strong>Ground</strong>
              {ground ? (
                <div className="cell-info__sprite-large" style={{ backgroundColor: getSpriteColor(ground.ss, ground.row) }} />
              ) : isMultiSelect ? (
                <div className="cell-info__sprite-large" style={{ backgroundColor: '#0a0612', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ab8ff', fontSize: '24px' }}>≠</div>
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
            <div className="cell-info__layer-label">Layer 1</div>
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
          </div>
          <div className="cell-info__preview-col">
            <div className="cell-info__layer-label">Layer 2</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('table')}>
              <strong>Object</strong>
              {obj ? (
                <div className="cell-info__sprite-large" style={{ backgroundImage: `url(${getSpriteUrl(obj.ss)})`, backgroundPosition: `0 ${obj.row * -32}px` }} />
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
            <div className="cell-info__layer-label">Layer 3</div>
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
          {/* Floor sprites */}
          <div>
            <div className="cell-info__layer-label">Floor</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {spriteColors.floor.map((_, row) => {
                const color = getSpriteColor(0, row)
                const isSelected = selectedSpriteForColor?.ss === 0 && selectedSpriteForColor?.row === row
                return (
                  <button
                    key={`floor-${row}`}
                    onClick={() => setSelectedSpriteForColor({ ss: 0, row, name: `floor_${row}` })}
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
                    <div style={{ fontSize: '9px', color: '#7ab8ff', flex: 1, textAlign: 'left' }}>Row {row}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Wall sprites */}
          <div>
            <div className="cell-info__layer-label">Wall</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {spriteColors.wall.map((_, row) => {
                const color = getSpriteColor(1, row)
                const isSelected = selectedSpriteForColor?.ss === 1 && selectedSpriteForColor?.row === row
                return (
                  <button
                    key={`wall-${row}`}
                    onClick={() => setSelectedSpriteForColor({ ss: 1, row, name: `wall_${row}` })}
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
                    <div style={{ fontSize: '9px', color: '#7ab8ff', flex: 1, textAlign: 'left' }}>Row {row}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {selectedSpriteForColor && (
          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(100, 180, 255, 0.2)' }}>
            <div style={{ fontSize: '10px', color: '#7ab8ff', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>
              Edit Color
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: getSpriteColor(selectedSpriteForColor.ss, selectedSpriteForColor.row), border: '1px solid rgba(100, 180, 255, 0.3)', borderRadius: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', color: 'rgba(122, 184, 255, 0.7)', textTransform: 'uppercase' }}>Selected</div>
                <div style={{ fontSize: '10px', color: '#7ab8ff', fontWeight: '600' }}>Row {selectedSpriteForColor.row}</div>
              </div>
            </div>
            <input
              type="color"
              value={spriteColorOverrides[`${selectedSpriteForColor.ss}_${selectedSpriteForColor.row}`]?.substring(0, 7) || getSpriteColor(selectedSpriteForColor.ss, selectedSpriteForColor.row)}
              onChange={(e) => {
                const key = `${selectedSpriteForColor.ss}_${selectedSpriteForColor.row}`
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

      {pickerOpen && (
        <SpritePickerModal
          category={pickerOpen}
          currentSprite={
            activeTab === 'tiles' ? (
              pickerOpen === 'floor' ? ground :
              pickerOpen === 'wall' ? wall :
              pickerOpen === 'table' ? obj :
              pickerOpen === 'torch' ? entity :
              null
            ) : (
              selectedSpriteForColor
            )
          }
          spriteColorOverrides={spriteColorOverrides}
          onSelect={(sprite) => {
            if (activeTab === 'colors') {
              setSelectedSpriteForColor(sprite)
              setPickerOpen(null)
            } else {
              handleSpriteSelect(pickerOpen, sprite)
            }
          }}
          onClose={() => setPickerOpen(null)}
        />
      )}
    </div>
  )
}
